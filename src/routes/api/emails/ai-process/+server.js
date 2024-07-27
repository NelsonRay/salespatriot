// @ts-nocheck
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';
import axios from 'axios';

/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
	runtime: 'nodejs18.x',
	split: true,
	maxDuration: 90
};

export async function POST({ request, cookies }) {
	const {
		record: { id }
	} = await request.json();

	/** @type {import('@supabase/supabase-js').SupabaseClient<import('$lib/types/supabase.js').Database>} */
	const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies,
		global: {
			headers: { Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` }
		}
	});

	let { data: email } = await supabase.from('emails').select('*').eq('id', id).limit(1).single();

	const { data: attachments } = await supabase.storage
		.from('email_attachments')
		.list(id.toString() + '/');

	email.attachments = attachments;

	const res = await axios.post('http://3.145.215.113:5000/api', JSON.stringify(email));

	const data = { ...(res?.data ?? {}), gpt_response: JSON.parse(res?.data?.gpt_response ?? {}) };

	const { error: e } = await supabase.from('emails').update({ ai_response: data }).eq('id', id);

	if (e) console.log(e);

	return json({}, { status: 200 });
}
