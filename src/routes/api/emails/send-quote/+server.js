/* eslint-disable no-unused-vars */
// @ts-nocheck
import { json } from '@sveltejs/kit';
import { simpleParser } from 'mailparser';
import { IMAP_HOST, IMAP_USER, IMAP_PASS } from '$env/static/private';
import nodemailer from 'nodemailer';
import { generatePDFHtml } from '$lib/pdfHelper.js';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
	runtime: 'nodejs18.x',
	split: true
};

async function generatePDF(html) {
	// Launch a new browser instance
	const browser = await puppeteer.launch({
		args: chromium.args,
		defaultViewport: chromium.defaultViewport,
		executablePath: await chromium.executablePath(),
		headless: chromium.headless
	});
	const page = await browser.newPage();
	page.setCacheEnabled(false);
	await page.setContent(html, { waitUntil: 'networkidle0' });
	const pdfBuffer = await page.pdf({ format: 'a4' });

	await browser.close();

	return pdfBuffer;
}

async function sendEmail(pdfBuffer, messageId, references, to, subject, text) {
	const smtpConfig = {
		host: IMAP_HOST,
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

	let transporter = nodemailer.createTransport(smtpConfig);

	// Send email with PDF attachment
	const mailOptions = {
		from: IMAP_USER,
		to,
		subject,
		text,
		inReplyTo: messageId,
		references,
		attachments: [
			{
				filename: 'rfq.pdf',
				content: pdfBuffer,
				contentType: 'application/pdf'
			}
		]
	};

	const info = await transporter.sendMail(mailOptions);
	return info;
}

export async function POST({ locals: { supabase }, request }) {
	try {
		const {
			record: { id }
		} = await request.json();

		let { data, error } = await supabase
			.from('quote_emails_sent')
			.select(
				'id, rfq(email(id, message_id, from, references, subject), customer(*), rfqs_parts(*, part(*, parts_purchasing(*), parts_labor_minutes(*)), rfqs_parts_quantities(*)))'
			)
			.eq('id', id)
			.limit(1)
			.single();

		const messageId = data.rfq.email.message_id;
		const to = data.rfq.email.from.value.map((v) => v.address).join(',');
		const references = data.rfq.email.references
			? data.references.join(' ') + ' ' + messageId
			: messageId;
		const subject = data.rfq.email.subject;
		const text = data.rfq.quote_email_text;

		const html = generatePDFHtml(data.rfq);
		const pdfBuffer = await generatePDF(html);
		const info = await sendEmail(pdfBuffer, messageId, references, to, subject, text);

		await supabase.from('quote_emails_sent').update({ info, successful: true }).eq('id', id);
	} catch (error) {
		console.error('Error:', error);
	}

	return json({}, { status: 200 });
}
