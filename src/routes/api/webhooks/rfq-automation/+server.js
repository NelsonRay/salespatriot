// @ts-nocheck

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';

// 50e95568-180b-46d5-a341-f216bb2a3c17 Opp
// 0ce91293-4277-446e-9ff2-2d5c62bbb0fe Eng
// bee07e8a-3c83-4bce-89a7-f91ca65804e6 Bom
// 18055704-d9b9-42d7-958b-f5d1d5b1ba4d Pur
// 53cc6979-4406-47aa-97a0-1d83d0504c12 Lab
// 6bbf4342-1b50-4c1a-9dc5-ad40562c5626 Rev
// a40a1d91-3295-4ca4-b343-ad58e2279fec Ent
// 6a0d1585-d572-4d8f-bdb4-498a89506e85 Bid

export async function POST({ request, cookies }) {
	const {
		record: { rfq }
	} = await request.json();

	/** @type {import('@supabase/supabase-js').SupabaseClient<import('$lib/types/supabase.js').Database>} */
	const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		// @ts-ignore
		cookies,
		global: {
			headers: { Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` }
		}
	});

	try {
		const { data, error } = await supabase
			.from('rfqs')
			.select(
				'*, rfqs_products(*, product(*, product_labor_minutes(*), product_purchasing(*)), rfqs_products_quantities(*))'
			)
			.eq('id', rfq)
			.limit(1)
			.single();

		for (let product of data.rfqs_products) {
			let purchasing_ready = false;
			let product_labor_minutes = null;
			let labor_minutes = null;

			let laborInProgress = true;
			let purchasingInProgress = true;

			if (product?.product?.product_labor_minutes?.length > 0) {
				product_labor_minutes = product?.product?.product_labor_minutes[0]?.id;
				labor_minutes = product?.product?.product_labor_minutes[0]?.labor_minutes;
				laborInProgress = false;
			}
			if (product?.product?.product_purchasing?.length > 0) {
				purchasing_ready = true;
				purchasingInProgress = false;
			}

			const { data: d, error } = await supabase
				.from('rfqs_products')
				.update({ purchasing_ready, product_labor_minutes, labor_minutes })
				.eq('id', product?.id);

			if (!purchasing_ready) {
				const { data: forms, error } = await supabase
					.from('forms')
					.select('id')
					.eq('product', product?.product?.id)
					.eq('submitted', false)
					.eq('form', '18055704-d9b9-42d7-958b-f5d1d5b1ba4d');

				if (forms?.length === 0)
					await supabase.from('forms').insert({
						commercial: true,
						form: '18055704-d9b9-42d7-958b-f5d1d5b1ba4d',
						product: product.product.id
					});
			}

			if (!product_labor_minutes) {
				const { data: forms } = await supabase
					.from('forms')
					.select('id')
					.eq('product', product?.product?.id)
					.eq('submitted', false)
					.eq('form', '53cc6979-4406-47aa-97a0-1d83d0504c12');

				if (forms?.length === 0)
					await supabase.from('forms').insert({
						commercial: true,
						form: '53cc6979-4406-47aa-97a0-1d83d0504c12',
						product: product.product.id
					});
			}
			updateStatusInProgress(
				data.status,
				[
					laborInProgress ? 'labor:in_progress' : 'labor:complete',
					purchasingInProgress ? 'purchasing:in_progress' : 'purchasing:complete'
				],
				supabase,
				data.id
			);
		}

		if (error) {
			console.error(error);
			return json({ error, data }, { status: 500 });
		}

		return json({}, { status: 200 });
	} catch (e) {
		console.error(e);
		return json({ e }, { status: 500 });
	}
}

async function updateStatusInProgress(status, statusValues, supabase, id) {
	status = status.filter((e) => !statusValues.some((s) => e.includes(s.split(':')[0])));
	status = [...status, ...statusValues];
	await supabase.from('rfqs').update({ status }).eq('id', id);
}
