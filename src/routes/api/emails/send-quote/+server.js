/* eslint-disable no-unused-vars */
// @ts-nocheck
import { json } from '@sveltejs/kit';
import { simpleParser } from 'mailparser';
import { IMAP_HOST, IMAP_USER, IMAP_PASS } from '$env/static/private';
import nodemailer from 'nodemailer';
import puppeteer from 'puppeteer';

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Request for Quote (RFQ)</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="container mx-auto p-4">
  <h1 class="text-center text-2xl font-bold mb-4">REQUEST FOR QUOTE (RFQ)</h1>
  <div class="mb-4">
    <p class="mb-1">[Company Name]</p>
    <p class="mb-1">[Company Address]</p>
    <p class="mb-1">[Company Phone, Email, Fax]</p>
  </div>
  <div class="mb-4">
    <h2 class="text-lg font-semibold mb-2">Quote for:</h2>
    <p class="mb-1">[Name]</p>
    <p class="mb-1">[Company Name]</p>
    <p class="mb-1">[Company Address]</p>
    <p class="mb-1">[Company Phone, Email, Fax]</p>
  </div>
  <div class="mb-4 text-right">
    <p class="mb-1">Date: <span>[Date]</span></p>
    <p class="mb-1">Quotation #: <span>[Quotation #]</span></p>
    <p class="mb-1">Customer ID: <span>[Customer ID]</span></p>
    <p class="mb-1">Quote Valid Until: <span>[Quote Valid Until]</span></p>
    <p class="mb-1">Prepared By: <span>[Prepared By]</span></p>
  </div>
  <div class="mb-4">
    <h2 class="text-lg font-semibold mb-2">Comments or Special Instructions:</h2>
    <textarea class="w-full border border-gray-300 rounded p-2" rows="3"></textarea>
  </div>
  <table class="w-full mb-4 border-collapse">
    <thead>
      <tr>
        <th class="border border-gray-300 p-2">Salesperson</th>
        <th class="border border-gray-300 p-2">P.O. Number</th>
        <th class="border border-gray-300 p-2">Ship Date</th>
        <th class="border border-gray-300 p-2">Ship Via</th>
        <th class="border border-gray-300 p-2">F.O.B. Point</th>
        <th class="border border-gray-300 p-2">Terms</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="border border-gray-300 p-2"></td>
        <td class="border border-gray-300 p-2"></td>
        <td class="border border-gray-300 p-2"></td>
        <td class="border border-gray-300 p-2"></td>
        <td class="border border-gray-300 p-2"></td>
        <td class="border border-gray-300 p-2"></td>
      </tr>
    </tbody>
  </table>
  <table class="w-full mb-4 border-collapse">
    <thead>
      <tr>
        <th class="border border-gray-300 p-2">Quantity</th>
        <th class="border border-gray-300 p-2">Description</th>
        <th class="border border-gray-300 p-2">Unit Price</th>
        <th class="border border-gray-300 p-2">Taxable</th>
        <th class="border border-gray-300 p-2">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="border border-gray-300 p-2">1</td>
        <td class="border border-gray-300 p-2">Concrete</td>
        <td class="border border-gray-300 p-2">$20</td>
        <td class="border border-gray-300 p-2">$20</td>
        <td class="border border-gray-300 p-2">$20</td>
      </tr>
      <tr>
        <td class="border border-gray-300 p-2">1</td>
        <td class="border border-gray-300 p-2">Glue</td>
        <td class="border border-gray-300 p-2">$5</td>
        <td class="border border-gray-300 p-2">$5</td>
        <td class="border border-gray-300 p-2">$5</td>
      </tr>
    </tbody>
  </table>
  <div class="mb-4 text-right">
    <p class="mb-1">Subtotal: <span>$25.00</span></p>
    <p class="mb-1">Tax Rate: <span></span></p>
    <p class="mb-1">Sale Tax: <span></span></p>
    <p class="mb-1">Other: <span></span></p>
    <p class="mb-1 font-bold">Total: <span>$25.00</span></p>
  </div>
</body>
</html>
`;

async function generatePDF(html) {
	// Launch a new browser instance
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	// Set the content of the page
	await page.setContent(html, { waitUntil: 'networkidle0' });

	// Generate the PDF
	const pdfBuffer = await page.pdf({ format: 'A4' });

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
		text: '2 - Please find attached the quote.',
		inReplyTo: messageId,
		references
		// attachments: [
		// 	{
		// 		filename: 'rfq.pdf',
		// 		content: pdfBuffer,
		// 		contentType: 'application/pdf'
		// 	}
		// ]
	};

	return await transporter.sendMail(mailOptions);
}

export async function POST({ locals: { supabase }, request }) {
	try {
		const { id } = await request.json();

		const { data } = await supabase
			.from('emails')
			.select('id, message_id, from, subject, references')
			.eq('id', id)
			.limit(1)
			.single();

		const messageId = data.message_id;
		const to = data.from.value.map((v) => v.address).join(',');
		const references = data.references ? data.references.join(' ') + ' ' + messageId : messageId;
		const subject = data.subject;

		// console.log(to, references);

		const pdfBuffer = await generatePDF(htmlContent);
		await sendEmail(pdfBuffer, messageId, references, to, subject);
		console.log('PDF generated and email sent successfully');
	} catch (error) {
		console.error('Error:', error);
	}

	return json({}, { status: 200 });
}
