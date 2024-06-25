// @ts-nocheck
import { json } from '@sveltejs/kit';
import { simpleParser } from 'mailparser';
import { SMTP_HOST, SMTP_USER, SMTP_PASS } from '$env/static/private';
import nodemailer from 'nodemailer';

export async function POST({ locals: { supabase }, request }) {
	const { email_id } = await request.json();

	const data = await supabase.from('emails').select('*').eq('id', email_id);

	const smtpConfig = {
		host: SMTP_HOST,
		port: 50,
		secure: false,
		tls: {
			rejectUnauthorized: false
		},
		auth: {
			user: SMTP_USER,
			pass: SMTP_PASS
		}
	};

	// Forward the email using SMTP
	let transporter = nodemailer.createTransport(smtpConfig);
	let mailOptions = {
		from: imapConfig.user, // sender address
		to: email.from.value[0].address, // recipient address (original sender)
		subject: 'Re: ' + email.subject, // Subject line
		text: replyText, // plain text body
		html: `<p>${replyText}</p>`, // HTML body
		inReplyTo: email.messageId,
		references: email.messageId
	};
	let mailOptions = {
		from: IMAP_USER,
		to: 'cjohnson@auroradefensegroup.com',
		subject: 'Fwd: ' + data.subject,
		text: data.text,
		html: data.html,
		attachments: data.attachments.map((attachment) => ({
			filename: attachment.filename,
			content: attachment.content,
			contentType: attachment.contentType
		}))
	};

	let info = await transporter.sendMail(mailOptions);
	console.log('Message sent: %s', info.messageId);

	return json({}, { status: 200 });
}
