// @ts-nocheck
import { json } from '@sveltejs/kit';

export async function POST({ locals: { supabase }, request }) {
	const { selectedParts } = await request.json();

	const { data } = await supabase
		.from('boms_quotes_parts')
		.select('*, boms_part(part)')
		.in('id', selectedParts);

	let partsRequestedByVendor = {};

	let uniqueVendors = [];

	for (let boms_quotes_part of data) {
		if (!uniqueVendors.includes(boms_quotes_part?.vendor) && boms_quotes_part?.vendor != null) {
			uniqueVendors.push(boms_quotes_part.vendor);
		}
	}

	const { data: vendorsEmails } = await supabase
		.from('vendors_emails')
		.insert(uniqueVendors.map((v) => ({ vendor: v, firm: '6b289746-2b01-47af-a7d4-26a3920f75ca' })))
		.select('*');

	for (let boms_quotes_part of data) {
		if (!boms_quotes_part.vendor) continue; // skip if no vendor
		if (partsRequestedByVendor[boms_quotes_part.vendor]?.includes(boms_quotes_part.boms_part.part))
			continue; // skip if already requested by vendor

		const {
			data: { id: parts_quote_id }
		} = await supabase
			.from('parts_quotes')
			.insert({
				part: boms_quotes_part.boms_part.part,
				vendor: boms_quotes_part.vendor,
				vendors_email: vendorsEmails.filter((v) => v.vendor == boms_quotes_part.vendor)[0].id,
				complete: false
			})
			.select('id')
			.limit(1)
			.single();

		const { data: parts_quotes_quantities } = await supabase
			.from('parts_quotes_quantities')
			.insert([5, 50, 250, 500, 1000].map((q) => ({ parts_quote: parts_quote_id, quantity: q })))
			.select('*');

		const bomsQuotesPartsWithSamePart = data.filter(
			(d) => d.boms_part.part == boms_quotes_part.boms_part.part
		);

		for (let p of bomsQuotesPartsWithSamePart) {
			let diffs = [];

			for (let parts_quotes_qty of parts_quotes_quantities) {
				diffs = [...diffs, Math.abs(p.boms_part.quantity - parts_quotes_qty.quantity)];
			}

			if (diffs?.length > 0) {
				const index = indexOfMin(diffs);

				const parts_quotes_quantity = parts_quotes_quantities[index].id;

				await Promise.all(
					bomsQuotesPartsWithSamePart.map((b) =>
						supabase
							.from('boms_quotes_parts')
							.update({ parts_quotes_quantity, use_quote: true })
							.eq('id', b.id)
					)
				);
			}
		}

		// record that that part was already requested by vendor - this is to avoid request more than once
		partsRequestedByVendor[boms_quotes_part.boms_part.vendor] = [
			boms_quotes_part.boms_part.part,
			...(partsRequestedByVendor[boms_quotes_part.boms_part.vendor] ?? [])
		];
	}

	for (let vendorsEmail of vendorsEmails) {
		await supabase.from('vendors_emails').update({ complete: true }).eq('id', vendorsEmail.id);
	}

	return json({}, { status: 200 });
}

function indexOfMin(arr) {
	if (arr.length === 0) {
		return -1; // Return -1 if the array is empty
	}

	let minIndex = 0; // Initialize the index of the minimum value to the first element
	let minValue = arr[0]; // Initialize the minimum value to the value of the first element

	for (let i = 1; i < arr.length; i++) {
		if (arr[i] < minValue) {
			minValue = arr[i]; // Update the minimum value
			minIndex = i; // Update the index of the minimum value
		}
	}

	return minIndex; // Return the index of the minimum value
}
