// @ts-nocheck

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';

// 64f61fff-0e3a-4993-9fd0-3c563adacca3 Pur
// f657fadb-c9a7-493b-bc2e-c655bcd8c92d Lab
// 5129a9cb-02c0-4bee-8568-e0b8d86a8f31 Fin
// 715b26c6-1ba0-4300-b4b0-a45857ed230e Ent
// f6ab4e4b-a109-4e46-858e-f498428453ad Sen

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
		case 'f657fadb-c9a7-493b-bc2e-c655bcd8c92d': {
			if (!response.labor_minutes) break;

			const { data } = await supabase
				.from('product_labor_minutes')
				.insert({ labor_minutes: response.labor_minutes, product })
				.select('id')
				.limit(1)
				.single();

			const { data: pData, error } = await supabase
				.from('rfqs_products')
				.update({ product_labor_minutes: data.id })
				.eq('product', product)
				.eq('product_labor_minutes', null)
				.eq('rfq.deleted', false)
				.select('rfq(*)');

			if (error) console.error(error);

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
