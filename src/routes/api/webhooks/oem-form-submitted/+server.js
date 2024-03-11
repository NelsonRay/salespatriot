// @ts-nocheck

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';
import { commercialTags } from '$lib/tags.js';

// 64f61fff-0e3a-4993-9fd0-3c563adacca3 Pur
// f657fadb-c9a7-493b-bc2e-c655bcd8c92d Lab
// 5129a9cb-02c0-4bee-8568-e0b8d86a8f31 Fin
// 715b26c6-1ba0-4300-b4b0-a45857ed230e Ent
// f6ab4e4b-a109-4e46-858e-f498428453ad Sen

export async function POST({ request, cookies }) {
	const {
		record: { commercial_form, commercial_rfq }
	} = await request.json();

	/** @type {import('@supabase/supabase-js').SupabaseClient<import('$lib/types/supabase.js').Database>} */
	const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		// @ts-ignore
		cookies,
		global: {
			headers: { Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` }
		}
	});

	const { data, error } = await supabase
		.from('commercial_rfqs')
		.select('*')
		.eq('id', commercial_rfq)
		.limit(1)
		.single();

	if (error) {
		console.log(error);
	}

	switch (commercial_form) {
		case '64f61fff-0e3a-4993-9fd0-3c563adacca3':
			await updateStatusInProgress(
				data.status,
				[commercialTags.purchasing.complete.key, commercialTags.labor.in_progress.key],
				supabase,
				commercial_rfq
			);
			await supabase
				.from('commercial-forms')
				.insert({ commercial_form: 'f657fadb-c9a7-493b-bc2e-c655bcd8c92d', commercial_rfq });
			break;
		case 'f657fadb-c9a7-493b-bc2e-c655bcd8c92d':
			await updateStatusInProgress(
				data.status,
				[commercialTags.labor.complete.key, commercialTags.final_pricing.in_progress.key],
				supabase,
				commercial_rfq
			);
			await supabase
				.from('commercial_forms')
				.insert({ commercial_form: '5129a9cb-02c0-4bee-8568-e0b8d86a8f31', commercial_rfq });
			break;
		case '5129a9cb-02c0-4bee-8568-e0b8d86a8f31':
			await updateStatusInProgress(
				data.status,
				[commercialTags.final_pricing.complete.key, commercialTags.enter_quote.in_progress.key],
				supabase,
				commercial_rfq
			);
			await supabase
				.from('commercial_forms')
				.insert({ commercial_form: '715b26c6-1ba0-4300-b4b0-a45857ed230e', commercial_rfq });
			break;
		case '715b26c6-1ba0-4300-b4b0-a45857ed230e':
			await updateStatusInProgress(
				data.status,
				[commercialTags.enter_quote.complete.key, commercialTags.send_quote.in_progress.key],
				supabase,
				commercial_rfq
			);
			await supabase
				.from('commercial_forms')
				.insert({ commercial_form: 'f6ab4e4b-a109-4e46-858e-f498428453ad', commercial_rfq });
			break;
		case 'f6ab4e4b-a109-4e46-858e-f498428453ad':
			await updateStatusInProgress(
				data.status,
				[commercialTags.send_quote.complete.key],
				supabase,
				commercial_rfq
			);
			break;
		default:
			break;
	}

	return json({}, { status: 200 });
}

async function updateStatusInProgress(status, statusValues, supabase, id) {
	status = status.filter((e) => !statusValues.some((s) => e.includes(s.split(':')[0])));
	status = [...status, ...statusValues];
	await supabase.from('commercial_rfqs').update({ status }).eq('id', id);
}
