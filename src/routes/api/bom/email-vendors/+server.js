// @ts-nocheck

import { json } from '@sveltejs/kit';

export async function POST({ locals: { supabase }, request, fetch }) {
	const {
		record: { id }
	} = await request.json();

	const { data } = await supabase
		.from('boms_quotes')
		.select(
			'id, parts_quotes(*, vendor(*), part(number, description, uom, vendor_instructions), parts_quotes_quantities(*))'
		)
		.eq('id', id)
		.limit(1)
		.single();

	let partsByVendor = {};

	for (let part of data?.parts_quotes ?? []) {
		partsByVendor[part.vendor.id] = [part, ...(partsByVendor[part.vendor.id] ?? [])];
	}

	let emailsData = Object.keys(partsByVendor).map((v) => ({
		name: partsByVendor[v][0].vendor.name,
		email: partsByVendor[v][0].vendor.email,
		parts: partsByVendor[v].map((p) => ({
			data: [
				p.part.number,
				p.part.description,
				p.part.vendor_instructions || 'N/A',
				p.parts_quotes_quantities
					.map((q) => q.quantity)
					.sort((a, b) => a - b)
					.join(', ') +
					' ' +
					p.part.uom
			],
			id: p.id
		}))
	}));

	const res = await fetch('/api/smtp/send-vendor-emails', {
		method: 'POST',
		body: JSON.stringify({ emailsData })
	});

	return json({}, { status: res.status });
}
