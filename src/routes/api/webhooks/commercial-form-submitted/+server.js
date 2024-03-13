// @ts-nocheck

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';

export async function POST({ request, cookies }) {
	try {
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
					const { error } = await supabase.from('product_purchasing').insert({
						lead_time: response['lead_time_' + value],
						material_cost: response['material_cost_' + value],
						product,
						quantity: parseInt(value)
					});

					if (error) throw error;
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

				if (error) throw error;
				console.log(data, error);

				const { data: pData, error: pErr } = await supabase
					.from('rfqs_products')
					.update({ product_labor_minutes: data.id })
					.eq('product', product)
					.is('product_labor_minutes', null)
					.eq('rfq.deleted', false)
					.select('rfq(*)');

				if (pErr) throw pErr;

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
			case '6bbf4342-1b50-4c1a-9dc5-ad40562c5626': {
				for (let rfqs_product of response?.rfqs_products ?? []) {
					const { product } = rfqs_product;
					for (let rfqs_products_quantity of rfqs_product.rfqs_products_quantities ?? []) {
						const {
							material_cost,
							lead_time,
							product_final_pricing: { final_pricing },
							quantity
						} = rfqs_products_quantity;

						const { data, error } = await supabase
							.from('product_final_pricing')
							.insert({ product: product.id, final_pricing, quantity })
							.select('id')
							.limit(1)
							.single();

						if (error) throw error;

						const { error: e } = await supabase
							.from('rfqs_products_quantities')
							.update({ material_cost, lead_time, product_final_pricing: data.id })
							.eq('id', rfqs_products_quantity.id);

						if (e) throw e;
					}
				}

				updateStatusInProgress(rfq.status, ['final_pricing:assigned'], supabase, rfq.id);
				break;
			}
			default:
				break;
		}

		return json({}, { status: 200 });
	} catch (e) {
		return json(e, { status: 500 });
	}
}

async function updateStatusInProgress(status, statusValues, supabase, id) {
	status = status.filter((e) => !statusValues.some((s) => e.includes(s.split(':')[0])));
	status = [...status, ...statusValues];
	await supabase.from('rfqs').update({ status }).eq('id', id);
}
