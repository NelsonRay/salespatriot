// @ts-nocheck

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';

/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
	runtime: 'nodejs18.x',
	split: true
};

export async function POST({ request, cookies }) {
	const {
		record: { values: rfq, id }
	} = await request.json();

	/** @type {import('@supabase/supabase-js').SupabaseClient<import('$lib/types/supabase.js').Database>} */
	const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		// @ts-ignore
		cookies,
		global: {
			headers: { Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` }
		}
	});

	let rfqId;

	try {
		const { customer, rfqs_products, ...rest } = rfq;

		let customerId = customer.id;

		if (!customerId) {
			const { data, error } = await supabase
				.from('customers')
				.insert(customer)
				.select('id')
				.limit(1)
				.single();

			if (error) throw { type: 'Customer Error', ...error };

			customerId = data.id;
		}

		const { data, error } = await supabase
			.from('rfqs')
			.insert({ customer: customerId, firm: '6b289746-2b01-47af-a7d4-26a3920f75ca', ...rest })
			.select('id')
			.limit(1)
			.single();

		if (error) throw { type: 'RFQs Error', ...error };

		rfqId = data?.id;

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

				if (pErr) throw { type: 'Products Error', ...pErr };
				productId = pData?.id;
			}

			const { data: rData, error: rErr } = await supabase
				.from('rfqs_products')
				.insert({ rfq: rfqId, product: productId })
				.select('id')
				.limit(1)
				.single();

			if (rErr) throw { type: 'RFQs Products Error', ...rErr };

			const rfqProductId = rData?.id;

			for (let rfqs_products_quantity of rfqs_products_quantities) {
				const { error: qErr } = await supabase
					.from('rfqs_products_quantities')
					.insert({ rfqs_product: rfqProductId, quantity: rfqs_products_quantity.quantity })
					.select('id')
					.limit(1)
					.single();

				if (qErr) throw { type: 'RFQs Products Qty Error', ...qErr };
			}
		}

		await supabase.from('rfqs_uploaded').update({ success: true, rfq: rfq }).eq('id', id);

		return json({}, { status: 200 });
	} catch (e) {
		await supabase.from('rfqs_uploaded').update({ success: false, error: e }).eq('id', id);

		return json({ e }, { status: 500 });
	}
}
