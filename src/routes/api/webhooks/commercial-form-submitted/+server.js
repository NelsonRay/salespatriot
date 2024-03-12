// @ts-nocheck

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';

// 53cc6979-4406-47aa-97a0-1d83d0504c12 Labor

export async function POST({ request, cookies }) {
	const {
		record: { id, product, rfq, response, form }
	} = await request.json();

	/** @type {import('@supabase/supabase-js').SupabaseClient<import('$lib/types/supabase.js').Database>} */
	const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		// @ts-ignore
		cookies,
		global: {
			headers: { Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` }
		}
	});

	switch (form) {
		case '53cc6979-4406-47aa-97a0-1d83d0504c12': {
			console.log(123);
			if (!response.labor_minutes) break;

			const { data, error } = await supabase
				.from('product_labor_minutes')
				.insert({ labor_minutes: response.labor_minutes, product })
				.select('id')
				.limit(1)
				.single();

			console.log(data, error);

			const { data: pData, error: pErr } = await supabase
				.from('rfqs_products')
				.update({ product_labor_minutes: data.id })
				.eq('product', product)
				.is('product_labor_minutes', null)
				.eq('rfq.deleted', false)
				.select('rfq(*)');

			if (pErr) console.error(pErr);

			for (let rfqs_product of pData) {
				updateStatusInProgress(
					rfqs_product.rfq.status,
					['labor:assigned'],
					supabase,
					rfqs_product.rfq.id
				);
			}

			break;
		}
		default:
			break;
	}

	return json({}, { status: 200 });
}

async function updateStatusInProgress(status, statusValues, supabase, id) {
	status = status.filter((e) => !statusValues.some((s) => e.includes(s.split(':')[0])));
	status = [...status, ...statusValues];
	await supabase.from('rfqs').update({ status }).eq('id', id);
}
