// @ts-nocheck
import { json } from '@sveltejs/kit';
import Imap from 'imap';
import { simpleParser } from 'mailparser';
import { IMAP_HOST, IMAP_USER, IMAP_PASS } from '$env/static/private';

export async function GET({ locals: { supabase } }) {
	const emails = await readEmails();

	let { data: dbEmails } = await supabase.from('emails').select('*');

	for (let email of emails) {
		if (
			(email.inReplyTo == null || !dbEmails.some((de) => de.in_reply_to == email.inReplyTo)) &&
			!dbEmails.some((de) => de.message_id == email.messageId)
		) {
			const emailContent = (email.subject + email.text || email.textAsHtml || email.html)
				.toString()
				.toLowerCase();

			const keywords = [
				'quote',
				'rfq',
				'quoting',
				'request',
				'proposal',
				'pricing',
				'price',
				'order',
				'rfp',
				'solicitation'
			];

			const includes_keyword = keywords.some((k) => emailContent.includes(k));

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
					reply_to: email.replyTo,
					includes_keyword
				})
				.select('*')
				.limit(1)
				.single();

			if (error) {
				console.error(error);
			}

			// avoids potential dups based on inReplyTo
			dbEmails = [...dbEmails, newEmail];

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

			if (includes_keyword) {
				await supabase.from('forms').insert({
					form: '5a91b7a7-513f-4067-8776-1cb01f334c96',
					assignee: '35009618-f673-432a-9113-664874e195af',
					commercial: true,
					email: newEmail.id
				});
			}
		}
	}

	return json({}, { status: 200 });
}

async function readEmails() {
	// eslint-disable-next-line no-unused-vars
	return new Promise((resolve, reject) => {
		const imap = new Imap({
			user: IMAP_USER,
			password: IMAP_PASS,
			host: IMAP_HOST,
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
				const date30MinutesAgo = new Date(Date.now() - 30 * 60000);
				imap.search([['SINCE', formatDate(date30MinutesAgo)]], function (err, results) {
					if (err) throw err;
					if (!results || !results.length) {
						console.log('No emails found.');
						imap.end();
						resolve([]);
						return;
					}

					const f = imap.fetch(results, { bodies: '', struct: true });
					const emails = [];
					let messagesProcessed = 0;

					f.on('message', function (msg) {
						msg.on('body', function (stream) {
							simpleParser(stream, {}, (err, parsed) => {
								if (err) throw err;

								let email = {};

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
				});
			});
		});

		imap.connect();
	});
}

function formatDate(date) {
	const months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];
	const day = String(date.getDate()).padStart(2, '0');
	const month = months[date.getMonth()];
	const year = date.getFullYear();
	return `${day}-${month}-${year}`;
}
