// @ts-nocheck

import { json } from '@sveltejs/kit';

export async function POST({ locals: { supabase }, request, fetch }) {
	const {
		record: { id }
	} = await request.json();

	const { data } = await supabase
		.from('vendors_emails')
		.select(
			'id, vendor(*), parts_quotes(*, part(number, description, uom, vendor_instructions), parts_quotes_quantities(*))'
		)
		.eq('id', id)
		.limit(1)
		.single();

	const emailData = {
		id: data.id,
		name: data.vendor.name,
		email: data.vendor.email,
		parts: data.parts_quotes.map((p) => ({
			data: [
				p.part.number,
				p.part.description || 'N/A',
				p.part.vendor_instructions || 'N/A',
				p.parts_quotes_quantities
					.map((q) => q.quantity)
					.sort((a, b) => a - b)
					.join(', ') +
					' ' +
					p.part.uom
			]
		}))
	};

	const res = await fetch('/api/smtp/send-vendor-emails', {
		method: 'POST',
		body: JSON.stringify({ emailData })
	});

	return json({}, { status: res.status });
}
