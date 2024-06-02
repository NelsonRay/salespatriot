// @ts-nocheck

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';

export async function POST({ request, cookies }) {
	try {
		const {
			record: { part, rfq, response, form }
		} = await request.json();

		/** @type {import('@supabase/supabase-js').SupabaseClient<import('$lib/types/supabase.js').Database>} */
		const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
			// @ts-ignore
			cookies,
			global: {
				headers: { Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` }
			}
		});

		switch (form) {
			// confirm form
			case '5a91b7a7-513f-4067-8776-1cb01f334c96': {
				await supabase.from('rfqs_uploaded').insert({ values: response });
				break;
			}
			// purchasing form
			case '18055704-d9b9-42d7-958b-f5d1d5b1ba4d': {
				const spread = ['5', '25', '50', '100', '250'];

				for (let value of spread) {
					const { error } = await supabase.from('parts_purchasing').insert({
						lead_time: response['lead_time_' + value],
						material_cost: response['material_cost_' + value],
						packaging_cost: response['packaging_cost_' + value],
						part,
						quantity: parseInt(value)
					});

					if (error) throw error;
				}

				// update purchasing_ready fpr rfqs_parts
				await supabase
					.from('rfqs_parts')
					.update({ purchasing_ready: true })
					.eq('part', part)
					.eq('purchasing_ready', false);

				// then fetch rfqs_parts and relating rfqs - weirdly needs to be separate query
				const { data } = await supabase
					.from('rfqs_parts')
					.select('*, rfq(*, rfqs_parts(*))')
					.eq('part', part);

				// loop thru rfqs_parts relating to quoted part
				for (let d of data) {
					// check if all of rfqs_parts have purchasing data relating to rfq of the looped rfqs_part
					let rfq = d.rfq;
					let purchasingCompleted = true;
					for (let rfqs_part of rfq.rfqs_parts) {
						// check if purchasing data available for rfqs_part
						if (!rfqs_part?.purchasing_ready) {
							purchasingCompleted = false;
						}
					}

					if (purchasingCompleted) {
						await updateStatusInProgress(rfq.status, ['purchasing:complete'], supabase, rfq.id);
					}
				}
				break;
			}
			// labor form
			case '53cc6979-4406-47aa-97a0-1d83d0504c12': {
				const { data, error } = await supabase
					.from('parts_labor_minutes')
					.insert({ labor_minutes: response.labor_minutes, part })
					.select('id')
					.limit(1)
					.single();

				if (error) throw error;

				const { error: err } = await supabase
					.from('rfqs_parts')
					.update({ parts_labor_minutes: data.id, labor_minutes: response.labor_minutes })
					.eq('part', part)
					.is('labor_minutes', null);

				if (err) throw err;

				// then fetch rfqs_parts and relating rfqs - weirdly needs to be separate query
				const { data: rData } = await supabase
					.from('rfqs_parts')
					.select('*, rfq(*, rfqs_parts(*))')
					.eq('parts_labor_minutes', data.id);

				// loop thru rfqs_parts relating to quoted part
				for (let d of rData) {
					// check if all of rfqs_parts have purchasing data relating to rfq of the looped rfqs_part
					let rfq = d.rfq;
					let laborCompleted = true;
					for (let rfqs_part of rfq.rfqs_parts) {
						// check if purchasing data available for rfqs_part
						if (rfqs_part?.parts_labor_minutes == null) {
							laborCompleted = false;
						}
					}

					if (laborCompleted) {
						await updateStatusInProgress(rfq.status, ['labor:complete'], supabase, rfq.id);
					}
				}

				break;
			}
			// final pricing form
			case '6bbf4342-1b50-4c1a-9dc5-ad40562c5626': {
				// loop thru each part and its quantities to update final_pricing
				for (let rfqs_part of response?.rfqs_parts ?? []) {
					for (let rfqs_parts_quantity of rfqs_part.rfqs_parts_quantities ?? []) {
						const { material_cost, lead_time, final_pricing, labor_minutes, packaging_cost } =
							rfqs_parts_quantity;

						const { error: e } = await supabase
							.from('rfqs_parts_quantities')
							.update({ material_cost, lead_time, final_pricing, labor_minutes, packaging_cost })
							.eq('id', rfqs_parts_quantity.id);

						if (e) throw e;
					}
				}

				// update status with final pricing and next 2 forms sent together
				await updateStatusInProgress(
					response.status,
					['final_pricing:complete', 'enter_quote:in_progress', 'send_quote:in_progress'],
					supabase,
					response.id
				);

				await supabase.from('forms').insert({
					rfq: response.id,
					form: 'a40a1d91-3295-4ca4-b343-ad58e2279fec',
					commercial: true,
					assignee: '1e549c12-269f-43f2-b832-3a5558840cb9' // diana
				});
				await supabase.from('forms').insert({
					rfq: response.id,
					form: '6a0d1585-d572-4d8f-bdb4-498a89506e85',
					commercial: true,
					assignee: '35009618-f673-432a-9113-664874e195af' // cindy
				});
				break;
			}
			case 'a40a1d91-3295-4ca4-b343-ad58e2279fec': {
				await supabase.from('rfqs').update({ quote_number: response.quote_number }).eq('id', rfq);
				await updateStatusInProgress(response.status, ['enter_quote:complete'], supabase, rfq);
				break;
			}
			case '6a0d1585-d572-4d8f-bdb4-498a89506e85': {
				await updateStatusInProgress(response.status, ['send_quote:complete'], supabase, rfq);
				break;
			}
			case 'd3dfeff5-ad61-4948-b028-b4d447cae57f': {
				if (response.status.includes('response:placed_order')) {
					const { date_ordered, due_date, order_notes, rfqs_parts, status } = response;
					await supabase
						.from('rfqs')
						.update({
							status,
							date_ordered,
							due_date,
							order_notes
						})
						.eq('id', rfq);

					for (let rfqs_part of rfqs_parts) {
						const { id, quantity_ordered, unit_price_ordered } = rfqs_part;
						await supabase
							.from('rfqs_parts')
							.update({ quantity_ordered, unit_price_ordered })
							.eq('id', id);
					}
				} else if (
					response.status.includes('response:lost') ||
					response.status.includes('response:assumed_lost')
				) {
					const { status, order_notes, reason_lost } = response;
					await supabase
						.from('rfqs')
						.update({
							status,
							order_notes,
							reason_lost
						})
						.eq('id', rfq);
				} else {
					const { status, order_notes } = response;
					await supabase
						.from('rfqs')
						.update({
							status,
							order_notes
						})
						.eq('id', rfq);
				}

				break;
			}
			default:
				break;
		}

		return json({}, { status: 200 });
	} catch (e) {
		return json(e, { status: 500 });
	}
}

async function updateStatusInProgress(status, statusValues, supabase, id) {
	status = status.filter((e) => !statusValues.some((s) => e.includes(s.split(':')[0])));
	status = [...status, ...statusValues];
	await supabase.from('rfqs').update({ status }).eq('id', id);
}
