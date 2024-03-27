// @ts-nocheck
import { json } from '@sveltejs/kit';

/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
	runtime: 'nodejs18.x',
	split: true
};

export async function POST({ request, locals: { supabase } }) {
	const { values } = await request.json();

	console.log(JSON.stringify(values, null, 4));

	for (let rfqs_product of values.rfqs_products) {
		await supabase
			.from('rfqs_products')
			.update({ labor_minutes: rfqs_product.labor_minutes })
			.eq('id', rfqs_product.id);

		for (let rfqs_products_quantity of rfqs_product.rfqs_products_quantities) {
			await supabase
				.from('rfqs_products_quantities')
				.update({
					lead_time: rfqs_products_quantity.lead_time,
					material_cost: rfqs_products_quantity.material_cost,
					final_pricing: rfqs_products_quantity.final_pricing
				})
				.eq('id', rfqs_products_quantity.id);
		}
	}

	const sendQuoteForms = !(values.status.filter((s) => s.includes('send_quote'))?.length > 0);

	if (sendQuoteForms) {
		await supabase.from('forms').insert([
			{ form: 'a40a1d91-3295-4ca4-b343-ad58e2279fec', commercial: true, rfq: values.id },
			{ form: '6a0d1585-d572-4d8f-bdb4-498a89506e85', commercial: true, rfq: values.id }
		]);
		await supabase
			.from('rfqs')
			.update({
				status: [
					'purchasing:complete',
					'labor:complete',
					'final_pricing:complete',
					'enter_quote:in_progress',
					'send_quote:in_progress'
				]
			})
			.eq('id', values.id);
	}

	return json({}, { status: 200 });
}
