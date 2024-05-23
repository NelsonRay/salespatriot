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
	for (let rfqs_part of values.rfqs_parts) {
		for (let rfqs_parts_quantity of rfqs_part.rfqs_parts_quantities) {
			const { material_cost, lead_time, final_pricing, labor_minutes, packaging_cost } =
				rfqs_parts_quantity;

			await supabase
				.from('rfqs_parts_quantities')
				.update({
					material_cost,
					labor_minutes,
					packaging_cost,
					final_pricing,
					lead_time
				})
				.eq('id', rfqs_parts_quantity.id);
		}
	}

	// determine if should delete purchasing forms
	for (let rfqs_part of values.rfqs_parts) {
		const { data } = await supabase
			.from('rfqs_parts')
			.select('id, rfq!inner(id, status)')
			.filter('rfq.status', 'cs', `{"purchasing:in_progress"}`)
			.eq('removed', false)
			.eq('part', rfqs_part.part);

		// see if another live rfq awaiting same part purchasing form - if so, don't delete form
		const deleteForm = data?.filter((d) => d?.rfq?.id !== values.id)?.length === 0;

		if (deleteForm && rfqs_part.part != null) {
			await supabase
				.from('forms')
				.update({ deleted: true })
				.eq('part', rfqs_part.part)
				.eq('form', '18055704-d9b9-42d7-958b-f5d1d5b1ba4d')
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
