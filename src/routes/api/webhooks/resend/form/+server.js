// @ts-nocheck
import { RESEND_API_KEY, SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';
import { json } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
	const { record } = await request.json();

	/** @type {import('@supabase/supabase-js').SupabaseClient<import('$lib/types/supabase.js').Database>} */
	const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		// @ts-ignore
		cookies,
		global: {
			headers: { Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` }
		}
	});

	let userId = '';
	let userName = '';
	let to = '';
	let btnText = '';
	let subject = '';
	let formLink = '';

	if (!record.commercial) {
		// if government

		const { data, error } = await supabase
			.from('forms')
			.select('*, form(user, name, type), solicitation_matched(solicitation!inner(id))')
			.eq('id', record.id)
			.limit(1)
			.single();

		if (error) console.error(error);

		// skip opportunity form
		if (data.form.type === 'opportunity') {
			return json({}, { status: 201 });
		}

		userId = data.form.user;
		btnText = `Open ${data.form.name}`;
		subject = `${data.form.name}: ${data.solicitation_matched.solicitation.id}`;
		formLink = `https://salespatriot.com/solicitation-form/${record.id}`;
	} else {
		// if commercial

		const { data, error } = await supabase
			.from('forms')
			.select('form(name, user), product(number), rfq(received_at, customer(name))')
			.eq('id', record.id)
			.limit(1)
			.single();

		if (error) console.error(error);

		userId = data.form.user;
		btnText = `Open ${data.form.name}`;
		subject = `${data.form.name}: ${data.product?.number ?? data.rfq.customer.name + ' / ' + data.rfq.received_at}`;
		formLink = `https://salespatriot.com/commercial-form/${record.id}`;
	}

	const {
		data: { name, email }
	} = await supabase.from('users').select('name, email').eq('id', userId).limit(1).single();

	userName = name;
	to = email;

	let html = `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;"><table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center"><table cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 4px 6px rgba(0,0,0,0.1);"><tr><td style="display: flex; align-items: center; align-content: center; margin-top: 30px;"><div style="text-align: center; margin: 0 auto;"></div></td></tr><tr><td style="padding: 20px;"><p style="color: #333; margin-bottom: 25px; text-align: center; font-size: 20px; font-weight: 600;">Sales Patriot</p><p style="margin-bottom: 15px;">Hello {{user_name}},</p><p style="margin-bottom: 30px;">Please complete the following form:</p><p style="margin-bottom: 40px; text-align: center;"><a href="{{form_link}}" style="background-color: #1F3C70; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">{{btn_text}}</a></p><p>Thank you!</p><p>Nelson and Alex</p></td></tr></table></td></tr></table></body>`;
	html = html.replace('{{user_name}}', userName);
	html = html.replace('{{form_link}}', formLink);
	html = html.replace('{{btn_text}}', btnText);

	const res = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
		body: JSON.stringify({
			from: 'Sales Patriot <hello@salespatriot.com>',
			to,
			cc: 'nelsonray27@gmail.com',
			subject,
			html
		})
	});

	return json({}, { status: res.status });
}
