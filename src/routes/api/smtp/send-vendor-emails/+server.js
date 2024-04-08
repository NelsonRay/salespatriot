/* eslint-disable no-unused-vars */
// @ts-nocheck
import { SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM } from '$env/static/private';
import { json } from '@sveltejs/kit';
import nodemailer from 'nodemailer';

export async function POST({ request, locals: { supabase } }) {
	try {
		const { emailsData } = await request.json();

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

		await Promise.all(emailsData.map((emailData) => sendMail(transporter, emailData, supabase)));

		return json({}, { status: 200 });
	} catch (e) {
		console.error(e);
	}
}

// Function to send email wrapped in a Promise
function sendMail(transporter, emailData, supabase) {
	const mailOptions = getMailOptions(emailData);

	return new Promise((resolve, reject) => {
		transporter.sendMail(mailOptions, async (error, info) => {
			if (error) {
				await Promise.all(
					emailData.parts.map((p) =>
						supabase
							.from('parts_quotes')
							.update({ email_sent: false, email_info: info || error })
							.eq('id', p.id)
					)
				);
				reject(error);
			} else {
				await Promise.all(
					emailData.parts.map((p) =>
						supabase
							.from('parts_quotes')
							.update({ email_sent: true, email_info: info })
							.eq('id', p.id)
					)
				);

				resolve(info);
			}
		});
	});
}

function getMailOptions(emailData) {
	const options = {
		from: SMTP_FROM,
		to: emailData.email,
		subject: `QUOTES AND LEAD TIMES NEEDED`,
		html: `<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Request for Quote</title>
			<style>
				body {
					font-family: Arial, sans-serif;
				}
				table {
					width: 100%;
					border-collapse: collapse;
				}
				th, td {
					border: 1px solid #ddd;
					padding: 6px;
					text-align: left;
              		font-size: 14px;
				}
				th {
					background-color: #f2f2f2;
				}
			</style>
		</head>
		<body>
          <p>
            Hello,
          </p>

			<p>Please provide a quote and lead times for the following part numbers and quantities:</p>
			
			<table>
				<thead>
					<tr>
						<th>Part Number</th>
						<th>Quantity</th>
                      <th>Lead Times:</th>
					</tr>
				</thead>
				<tbody>
				${emailData.parts
					.map(
						// @ts-ignore
						(p) => `<tr>
								<td>${p.data[0]}</td>
								<td>${p.data[1]}</td>
								<td></td>
							</tr>`
					)
					.join('')}
				</tbody>
			</table>
			
			<p style="margin-top: 20px;">Thank you,</p>
          <p>
            Diana Cepeda
          </p>
		  <p>
            630 851-1616 (Ext. 242)
          </p>

		  <img src="https://byhpfvdicvtmwnuwrbtp.supabase.co/storage/v1/object/public/logos/ADG%20Logo%20Transparent.png" alt="Image description" width="154" height="162">
		</body>
</html>`
	};
	return options;
}
