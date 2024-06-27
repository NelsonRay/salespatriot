/* eslint-disable no-unused-vars */
// @ts-nocheck
import { json } from '@sveltejs/kit';
import { simpleParser } from 'mailparser';
import { IMAP_HOST, IMAP_USER, IMAP_PASS } from '$env/static/private';
import nodemailer from 'nodemailer';
import { generatePDFHtml } from '$lib/pdfHelper.js';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

async function generatePDF(html) {
	// Launch a new browser instance
	const browser = await puppeteer.launch({
		args: chromium.args,
		defaultViewport: chromium.defaultViewport,
		executablePath: await chromium.executablePath,
		headless: true
	});
	const page = await browser.newPage();
	page.setCacheEnabled(false);
	await page.setContent(html);
	const pdfBuffer = await page.pdf({ format: 'a4' });

	await browser.close();

	return pdfBuffer;
}

async function sendEmail(pdfBuffer, messageId, references, to, subject) {
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
		},
		debug: true,
		logger: true
	};

	let transporter = nodemailer.createTransport(smtpConfig);

	// Send email with PDF attachment
	const mailOptions = {
		from: IMAP_USER,
		to,
		subject,
		text: 'Please find attached the quote.',
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

	return await transporter.sendMail(mailOptions);
}

export async function POST({ locals: { supabase }, request }) {
	try {
		const {
			record: { id }
		} = await request.json();

		let { data, error } = await supabase
			.from('rfqs')
			.select(
				'*, email(id, message_id, from, references, subject), comments(*, form(form(name)), user(name), part(number), rfq(customer(name), received_at)), customer(*), rfqs_parts(*, part(*, parts_purchasing(*), parts_labor_minutes(*)), rfqs_parts_quantities(*))'
			)
			.eq('id', id)
			.limit(1)
			.single();

		const messageId = data.email.message_id;
		const to = data.email.from.value.map((v) => v.address).join(',');
		const references = data.email.references
			? data.references.join(' ') + ' ' + messageId
			: messageId;
		const subject = data.email.subject;

		const html = generatePDFHtml(data);
		const pdfBuffer = await generatePDF(html);
		await sendEmail(pdfBuffer, messageId, references, to, subject);
		console.log('PDF generated and email sent successfully');
	} catch (error) {
		console.error('Error:', error);
	}

	return json({}, { status: 200 });
}
