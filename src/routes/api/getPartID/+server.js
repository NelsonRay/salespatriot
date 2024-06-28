// @ts-nocheck
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';

export async function POST({ request, cookies }) {
	const { number } = await request.json();

	/** @type {import('@supabase/supabase-js').SupabaseClient<import('$lib/types/supabase.js').Database>} */
	const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies,
		global: {
			headers: { Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` }
		}
	});

	const { data } = await supabase
		.from('parts')
		.select('id')
		.eq('number', number.toString())
		.limit(1)
		.single();

	return json({ id: data?.id ?? null }, { status: 200 });
}
