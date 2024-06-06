// @ts-nocheck
import { json } from '@sveltejs/kit';
import Imap from 'imap';
import { simpleParser } from 'mailparser';

export async function GET({ locals: { supabase } }) {
	const emails = await readEmails();

	const { data: dbEmails } = await supabase.from('emails').select('*');

	for (let email of emails) {
		if (!dbEmails.some((de) => de.message_id == email.messageId)) {
			const { data: newEmail, error } = await supabase
				.from('emails')
				.insert({
					message_id: email.messageId,
					header_lines: email.headerLines,
					headers: Object.fromEntries(email.headers || {}) || null,
					html: email.html,
					text: email.text,
					text_as_html: email.textAsHtml,
					references: typeof email.references === 'string' ? [email.references] : email.references,
					subject: email.subject,
					date: email.date,
					to: email.to,
					from: email.from,
					cc: email.cc,
					bcc: email.bcc,
					firm: '6b289746-2b01-47af-a7d4-26a3920f75ca',
					in_reply_to: email.inReplyTo,
					reply_to: email.replyTo
				})
				.select('id')
				.limit(1)
				.single();

			if (error) console.error(error);

			if (email.attachments.length > 0) {
				email.attachments.forEach(async (attachment) => {
					const fileBuffer = Buffer.from(attachment.content);
					const filename = attachment.filename;
					const { error: err } = await supabase.storage
						.from('email_attachments')
						.upload(newEmail.id + '/' + filename, fileBuffer, {
							contentType: attachment.contentType
						});

					if (err) console.error(err);
				});
			}

			await supabase.from('forms').insert({
				form: '5a91b7a7-513f-4067-8776-1cb01f334c96',
				assignee: '35009618-f673-432a-9113-664874e195af',
				commercial: true,
				email: newEmail.id
			});
		}
	}

	return json({}, { status: 200 });
}

async function readEmails() {
	// eslint-disable-next-line no-unused-vars
	return new Promise((resolve, reject) => {
		const imap = new Imap({
			user: 'quoting@auroradefensegroup.com',
			password: 'New0rders!',
			host: 'mail.auroradefensegroup.com',
			port: 143, // IMAP SSL port
			tls: false,
			tlsOptions: { rejectUnauthorized: false } // for testing purposes
		});

		function openInbox(cb) {
			imap.openBox('INBOX', true, cb);
		}

		imap.once('ready', function () {
			// eslint-disable-next-line no-unused-vars
			openInbox(function (err, box) {
				if (err) throw err;
				imap.search([['SINCE', '22-May-2024']], function (err, results) {
					if (err) throw err;
					if (!results || !results.length) {
						console.log('No emails found.');
						imap.end();
						return;
					}

					const f = imap.fetch(results, { bodies: '', struct: true });
					const emails = [];
					let messagesProcessed = 0;

					f.on('message', function (msg, seqno) {
						let email = {
							seqno
						};

						msg.on('body', function (stream) {
							simpleParser(stream, {}, (err, parsed) => {
								if (err) throw err;
								for (let key of Object.keys(parsed)) {
									email[key] = parsed[key];
								}

								emails.push(email);
								messagesProcessed++;

								if (messagesProcessed === results.length) {
									imap.end();
									resolve(emails);
								}
							});
						});
					});

					// f.once('error', function (err) {
					// 	console.log('Fetch error: ' + err);
					// });

					// f.once('end', function () {
					// 	console.log('Fetch operation ended.');
					// });
				});
			});
		});

		// imap.once('error', function (err) {
		// 	console.log(err);
		// });

		// imap.once('end', function () {
		// 	console.log('Connection ended');
		// });

		imap.connect();
	});
}
