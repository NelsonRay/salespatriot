// @ts-nocheck
import { json } from '@sveltejs/kit';

/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
	runtime: 'nodejs18.x',
	split: true
};

export async function POST({ request, locals: { supabase } }) {
	const { values } = await request.json();

	// forcefully push rfq thru to enter quote and send quote stages
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

	// determine if should delete purchasing forms
	for (let rfqs_product of values.rfqs_products) {
		const { data } = await supabase
			.from('rfqs_products')
			.select('id, rfq!inner(id, status)')
			.filter('rfq.status', 'cs', `{"purchasing:in_progress"}`)
			.eq('removed', false);

		// see if another live rfq awaiting same product purchasing form - if so, don't delete form
		const deleteForm = data?.filter((d) => d?.rfq?.id !== values.id)?.length === 0;

		if (deleteForm) {
			await supabase
				.from('forms')
				.update({ deleted: true })
				.eq('product', rfqs_product.id)
				.eq('submitted', false);
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

		// delete final_pricing form if needed
		await supabase
			.from('forms')
			.update({ deleted: true, submitted: true })
			.eq('rfq', values.id)
			.eq('form', '6bbf4342-1b50-4c1a-9dc5-ad40562c5626');
	}

	return json({}, { status: 200 });
}
