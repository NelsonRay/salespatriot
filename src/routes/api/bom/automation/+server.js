// @ts-nocheck
import { json } from '@sveltejs/kit';

export async function POST({ locals: { supabase, session }, request }) {
	const { id } = await request.json();

	const { data } = await supabase
		.from('boms')
		.select('id, boms_parts(*)')
		.eq('id', id)
		.limit(1)
		.single();

	const {
		data: { id: bom_quote_id }
	} = await supabase
		.from('boms_quotes')
		.insert({
			bom: id,
			created_by: session?.user?.id
		})
		.select('id')
		.limit(1)
		.single();

	let partsRequestedByVendor = {};

	for (let boms_part of data.boms_parts) {
		if (!boms_part.vendor) continue; // skip if no vendor
		if (partsRequestedByVendor[boms_part.vendor]?.includes(boms_part.part)) continue; // skip if already requested by vendor

		const {
			data: { id: parts_quote_id }
		} = await supabase
			.from('parts_quotes')
			.insert({ part: boms_part.part, vendor: boms_part.vendor, boms_quote: bom_quote_id })
			.select('id')
			.limit(1)
			.single();

		await Promise.all(
			[5, 50, 250, 500, 100].map((q) =>
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

	await supabase.from('boms_quotes').update({ email_vendors: true }).eq('id', bom_quote_id);

	return json({}, { status: 200 });
}
