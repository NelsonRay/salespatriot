// @ts-nocheck
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';

export async function GET({ cookies }) {
	/** @type {import('@supabase/supabase-js').SupabaseClient<import('$lib/types/supabase.js').Database>} */
	const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies,
		global: {
			headers: { Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` }
		}
	});

	let date = new Date();
	date.setDate(date.getDate() - 1);
	date = new Date(date.toISOString().split('T')[0]);

	const { data } = await supabase
		.from('forms')
		.select('*, forms_notifications(id)')
		.eq('deleted', false)
		.eq('submitted', false)
		.neq('form', '50e95568-180b-46d5-a341-f216bb2a3c17')
		.lt('created_at', date.toISOString());

	const pendingNotifications = data
		.filter((d) => d.forms_notifications?.length === 0)
		.map((d) => ({ form: d.id }));

	await supabase.from('forms_notifications').insert(pendingNotifications);

	return json({}, { status: 200 });
}
