// @ts-nocheck
import { AIRTABLE_API_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';

/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
	runtime: 'nodejs18.x',
	split: true
};

export async function POST({ request, fetch }) {
	const { value } = await request.json();

	const url = 'https://api.airtable.com/v0/appckqmLpLvXCi7rA/tblNv96zolsGAmdM9';

	let Parts = '';
	let Quantities = '';

	for (let part of value.parts) {
		if (Parts !== '' && Quantities !== '') {
			Parts += '\n';
			Quantities += '\n';
		}

		Parts += `${part.part_number},${part.nsn},${part.cross_ref}`;
		Quantities += part.quantities.join(',');
	}

	let records = [
		{
			fields: {
				'Company Name': value.customer_name,
				'Customer Number': value.customer_number,
				Date: value.date,
				'Expiration Date': value.return_date,
				'Customer Contact': value.customer_email,
				"Cindy's Notes": value.notes,
				Parts,
				Quantities
			}
		}
	];

	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${AIRTABLE_API_KEY}` },
		body: JSON.stringify({ records })
	});

	const data = await res.json();
	console.log(res.status, data);

	return json(data, { status: res.status });
}
