// @ts-nocheck

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';

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
		// purchasing form
		case '18055704-d9b9-42d7-958b-f5d1d5b1ba4d': {
			const spread = ['5', '25', '50', '100', '250'];

			for (let value of spread) {
				await supabase.from('product_purchasing').insert({
					lead_time: response['lead_time_' + value],
					material_cost: response['material_cost_' + value],
					product,
					quantity: parseInt(value)
				});
			}
			break;
		}
		// labor form
		case '53cc6979-4406-47aa-97a0-1d83d0504c12': {
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
