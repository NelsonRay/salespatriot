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

	let rfqId = null;

	try {
		const { customer, rfqs_parts, ...rest } = rfq;

		let customerId = customer.id;

		if (!customerId) {
			const { data, error } = await supabase
				.from('customers')
				.insert({ ...customer, firm: '6b289746-2b01-47af-a7d4-26a3920f75ca' })
				.select('id')
				.limit(1)
				.single();

			if (error) throw { type: 'Customer Error', ...error };

			customerId = data.id;
		}

		const { data, error } = await supabase
			.from('rfqs')
			.insert({
				customer: customerId,
				email_address: customer?.email_address,
				phone_number: customer?.phone_number,
				firm: '6b289746-2b01-47af-a7d4-26a3920f75ca',
				...rest
			})
			.select('id')
			.limit(1)
			.single();

		if (error) throw { type: 'RFQs Error', ...error };

		rfqId = data?.id;

		for (let rfqs_part of rfqs_parts) {
			const { rfqs_parts_quantities, part } = rfqs_part;

			let partId = part?.id;
			// if part nsn is assigned, ensure it exists
			if (part.nsn) await supabase.from('nsns').upsert({ id: part.nsn });

			if (!partId) {
				const { data: pData, error: pErr } = await supabase
					.from('parts')
					.insert({
						number: part.number,
						nsn: part.nsn || null,
						cross_reference: part.cross_reference,
						firm: '6b289746-2b01-47af-a7d4-26a3920f75ca'
					})
					.select('id')
					.limit(1)
					.single();

				if (pErr) throw { type: 'Parts Error', ...pErr };
				partId = pData?.id;
			} else if (part.nsn) {
				await supabase.from('parts').update({ nsn: part.nsn }).eq('id', partId);
			}

			const { data: rData, error: rErr } = await supabase
				.from('rfqs_parts')
				.insert({
					rfq: rfqId,
					part: partId,
					cross_reference: rfqs_part.cross_reference || null
				})
				.select('id')
				.limit(1)
				.single();

			if (rErr) throw { type: 'RFQs Parts Error', ...rErr };

			const rfqPartId = rData?.id;

			for (let rfqs_parts_quantity of rfqs_parts_quantities) {
				const { error: qErr } = await supabase
					.from('rfqs_parts_quantities')
					.insert({ rfqs_part: rfqPartId, quantity: rfqs_parts_quantity.quantity })
					.select('id')
					.limit(1)
					.single();

				if (qErr) throw { type: 'RFQs Parts Qty Error', ...qErr };
			}
		}

		await supabase.from('rfqs_uploaded').update({ success: true, rfq: rfqId }).eq('id', id);

		return json({}, { status: 200 });
	} catch (e) {
		await supabase
			.from('rfqs_uploaded')
			.update({ success: false, error: e, rfq: rfqId })
			.eq('id', id);

		return json({ e }, { status: 500 });
	}
}
