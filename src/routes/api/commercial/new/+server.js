// @ts-nocheck
import { json } from '@sveltejs/kit';

/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
	runtime: 'nodejs18.x',
	split: true
};

export async function POST({ request, locals: { supabase } }) {
	const { rfq } = await request.json();

	const { customer, rfqs_products, ...rest } = rfq;

	let customerId = customer.id;

	if (!customerId) {
		const { data, error } = await supabase
			.from('customers')
			.insert(customer)
			.select('id')
			.limit(1)
			.single();

		customerId = data.id;
	}

	const { data, error } = await supabase
		.from('rfqs')
		.insert({ customer: customerId, firm: '6b289746-2b01-47af-a7d4-26a3920f75ca', ...rest })
		.select('id')
		.limit(1)
		.single();

	console.log('n', error);

	const rfqId = data?.id;

	for (let rfqs_product of rfqs_products) {
		const { rfqs_products_quantities, product } = rfqs_product;

		let productId = product?.id;

		if (!productId) {
			if (product.nsn) await supabase.from('nsns').upsert({ id: product.nsn });

			const { data: pData, error: pErr } = await supabase
				.from('products')
				.insert({
					number: product.number,
					nsn: product.nsn || null,
					cross_reference: product.cross_reference,
					firm: '6b289746-2b01-47af-a7d4-26a3920f75ca'
				})
				.select('id')
				.limit(1)
				.single();

			console.log('p', pErr);
			productId = pData?.id;
		}

		const { data: rData, error: rErr } = await supabase
			.from('rfqs_products')
			.insert({ rfq: rfqId, product: productId })
			.select('id')
			.limit(1)
			.single();

		console.log('r', rErr);

		const rfqProductId = rData?.id;

		for (let rfqs_products_quantity of rfqs_products_quantities) {
			const { error: qErr } = await supabase
				.from('rfqs_products_quantities')
				.insert({ rfqs_product: rfqProductId, quantity: rfqs_products_quantity.quantity })
				.select('id')
				.limit(1)
				.single();

			console.log('q', qErr);
		}
	}

	return json({}, { status: 200 });
}
