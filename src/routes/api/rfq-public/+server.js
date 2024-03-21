// @ts-nocheck

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';

/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
	runtime: 'nodejs18.x',
	split: true
};

export async function POST({ request, cookies }) {
	const { values, firm } = await request.json();

	/** @type {import('@supabase/supabase-js').SupabaseClient<import('$lib/types/supabase.js').Database>} */
	const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		// @ts-ignore
		cookies,
		global: {
			headers: { Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` }
		}
	});

	const { data, error } = await supabase
		.from('rfqs_public')
		.insert({ values, firm })
		.select('id')
		.limit(1)
		.single();

	await supabase.from('forms').insert({
		form: '5a91b7a7-513f-4067-8776-1cb01f334c96',
		commercial: true,
		rfq_public: data.id
	});

	return json({}, { status: 200 });
}
