// @ts-nocheck
import { json } from '@sveltejs/kit';

export async function POST({ locals: { supabase, session }, request }) {
	const { values } = await request.json();

	// update unit price for each quote qty
	for (let qty of values?.parts_quotes_quantities ?? []) {
		await supabase
			.from('parts_quotes_quantities')
			.update({ unit_price: qty.unit_price })
			.eq('id', qty.id);
	}

	// update moq, notes, and complete status for part quote
	await supabase
		.from('parts_quotes')
		.update({
			moq: values.moq || null,
			notes: values.notes || null,
			complete: true,
			completed_by: session?.user?.id
		})
		.eq('id', values.id);

	return json({}, { status: 200 });
}
