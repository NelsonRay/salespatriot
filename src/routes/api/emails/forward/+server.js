/* eslint-disable no-unused-vars */
// @ts-nocheck
import { json } from '@sveltejs/kit';
import { simpleParser } from 'mailparser';
import { IMAP_HOST, IMAP_USER, IMAP_PASS, SMTP_HOST } from '$env/static/private';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { createServerClient } from '@supabase/ssr';
import nodemailer from 'nodemailer';
import fs from 'fs/promises';

/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
	runtime: 'nodejs18.x',
	split: true
};

// Function to download a file from Supabase storage
async function downloadFile(path, supabase) {
	const { data: file, error } = await supabase.storage.from('email_attachments').download(path);
	if (error) {
		throw error;
	}
	const filePath = `/tmp/${path.split('/').pop()}`;
	await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
	return filePath;
}

function filterAttachments(attachments) {
	return attachments.filter(
		(a) => !['image/png', 'image/jpg', 'image/jpeg'].some((e) => a.metadata.mimetype == e)
	);
}

function escapeHtml(text) {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

function formatOriginalEmailDetails(email) {
	return `
      From: ${escapeHtml(email.from.text)}<br>
      Date: ${email.date}<br>
      To: ${email.to.value.map((to) => escapeHtml(`${to.name} <${to.address}>`)).join(', ')}<br>
      Subject: ${email.subject}<br>
    `;
}

export async function POST({ request, cookies }) {
	const { id, user_id } = await request.json();

	/** @type {import('@supabase/supabase-js').SupabaseClient<import('$lib/types/supabase.js').Database>} */
	const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies,
		global: {
			headers: { Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` }
		}
	});

	try {
		// get user email
		const {
			data: { email: to }
		} = await supabase.from('users').select('id, email').eq('id', user_id).limit(1).single();

		// get email data and attachments
		let { data, error } = await supabase.from('emails').select('*').eq('id', id).limit(1).single();
		let { data: files } = await supabase.storage
			.from('email_attachments')
			.list(data.id.toString() + '/');

		files = filterAttachments(files);

		// download the files
		const downloadedFiles = await Promise.all(
			files.map((file) => downloadFile(data.id + '/' + file.name, supabase))
		);

		// prepare the attachments
		const attachments = downloadedFiles.map((filePath) => ({
			filename: filePath.split('/').pop(),
			path: filePath
		}));

		const smtpConfig = {
			host: SMTP_HOST,
			port: 50,
			secure: false,
			tls: {
				rejectUnauthorized: false
			},
			auth: {
				user: IMAP_USER,
				pass: IMAP_PASS
			}
		};

		const messageId = data.message_id;
		const references = data.references ? data.references.join(' ') + ' ' + messageId : messageId;
		const originalEmailDetails = formatOriginalEmailDetails(data);

		// Forward the email using SMTP
		let transporter = nodemailer.createTransport(smtpConfig);
		let mailOptions = {
			from: IMAP_USER,
			to,
			subject: data.subject,
			text: `${originalEmailDetails}\n\n${data.text}`,
			html: `<p style="font-weight: semibold;">${originalEmailDetails}</p><br>${data.html || data.text}`,
			references,
			inReplyTo: messageId,
			attachments
		};

		let info = await transporter.sendMail(mailOptions);
		console.log('Message sent: %s', info);
	} catch (error) {
		console.error('Error:', error);
	}

	return json({}, { status: 200 });
}
