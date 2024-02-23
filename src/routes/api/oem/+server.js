// @ts-nocheck
import { json } from '@sveltejs/kit';

/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
	runtime: 'nodejs18.x',
	split: true
};

export async function POST({ request, locals: { supabase } }) {
	const { value } = await request.json();

	const { customer, parts, ...rest } = value;

	let customerId = customer.id;

	if (!customerId) {
		const { data: cData, error: cError } = await supabase
			.from('oem_customers')
			.upsert(customer)
			.select('id')
			.limit(1)
			.single();

		customerId = cData.id;
	}

	const { data, error } = await supabase
		.from('oem_rfqs')
		.upsert({ ...rest, customer: customerId, firm: '6b289746-2b01-47af-a7d4-26a3920f75ca' })
		.select('id')
		.limit(1)
		.single();

	const { data: pData, error: pError } = await supabase
		.from('oem_rfqs_parts')
		.upsert(parts.map((p) => ({ ...p, oem_rfq: data.id })));

	return json({}, { status: 200 });
}
