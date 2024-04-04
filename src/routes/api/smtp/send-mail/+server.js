import { SMTP_HOST, SMTP_USER, SMTP_PASS } from '$env/static/private';
import { json } from '@sveltejs/kit';
import nodemailer from 'nodemailer';

export async function POST() {
	// Create a transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		host: SMTP_HOST,
		port: 50, // Change to the appropriate port
		secure: false, // true for 465, false for other ports
		tls: {
			rejectUnauthorized: false
		},
		auth: {
			user: SMTP_USER, // Your email address
			pass: SMTP_PASS // Your password for the email address
		}
	});

	// Setup email data with unicode symbols
	let mailOptions = {
		from: '"Nelson Ray" <nelson.ray@auroradefensegroup.com>', // sender address
		to: 'nelsonray27@gmail.com', // list of receivers
		subject: 'Hello', // Subject line
		// text: 'Hello world?', // plain text body
		html: '<b>Hello world?</b>' // html body
	};

	// Send mail with defined transport object
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log(error);
		}
		console.log('Message sent: %s', JSON.stringify(info, null, 4));
	});

	return json({}, { status: 200 });
}
