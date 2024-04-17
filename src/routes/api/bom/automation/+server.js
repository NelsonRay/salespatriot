// @ts-nocheck
import { json } from '@sveltejs/kit';

export async function POST({ locals: { supabase }, request }) {
	const { id, selectedParts } = await request.json();

	const { data } = await supabase
		.from('boms_quotes')
		.select('id, bom(id, boms_parts(*))')
		.eq('id', id)
		.limit(1)
		.single();

	let partsRequestedByVendor = {};

	for (let boms_part of data.bom.boms_parts) {
		if (!boms_part.vendor) continue; // skip if no vendor
		if (partsRequestedByVendor[boms_part.vendor]?.includes(boms_part.part)) continue; // skip if already requested by vendor
		if (!selectedParts?.includes(boms_part.id)) continue; // skip if selectedParts does not include id

		const {
			data: { id: parts_quote_id }
		} = await supabase
			.from('parts_quotes')
			.insert({ part: boms_part.part, vendor: boms_part.vendor, boms_quote: id })
			.select('id')
			.limit(1)
			.single();

		await Promise.all(
			[5, 50, 250, 500, 1000].map((q) =>
				supabase
					.from('parts_quotes_quantities')
					.insert({ parts_quote: parts_quote_id, quantity: q })
			)
		);

		partsRequestedByVendor[boms_part.vendor] = [
			boms_part.part,
			...(partsRequestedByVendor[boms_part.vendor] ?? [])
		];
	}

	await supabase.from('boms_quotes').update({ email_vendors: true }).eq('id', id);

	return json({}, { status: 200 });
}
