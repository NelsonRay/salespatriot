// @ts-nocheck
import { json } from '@sveltejs/kit';

export async function POST({ locals: { supabase }, request }) {
	const { values } = await request.json();

	// update unit price for each quote qty
	for (let qty of values?.parts_quotes_quantities ?? []) {
		await supabase
			.from('parts_quotes_quantities')
			.update({ unit_price: qty.unit_price, lead_time: qty.lead_time })
			.eq('id', qty.id);
	}

	// update moq, notes, and complete status for part quote
	await supabase
		.from('parts_quotes')
		.update({
			moq: values.moq || null,
			moc: values.moc || null,
			date_received: values.date_received || null,
			expiration_date: values.expiration_date || null,
			notes: values.notes || null,
			complete: true,
			completed_at: new Date().toISOString()
		})
		.eq('id', values.id);

	return json({}, { status: 200 });
}
