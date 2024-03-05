// @ts-nocheck

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';

// 50e95568-180b-46d5-a341-f216bb2a3c17 Opp
// 0ce91293-4277-446e-9ff2-2d5c62bbb0fe Eng
// bee07e8a-3c83-4bce-89a7-f91ca65804e6 Bom
// 18055704-d9b9-42d7-958b-f5d1d5b1ba4d Pur
// 53cc6979-4406-47aa-97a0-1d83d0504c12 Lab
// 6bbf4342-1b50-4c1a-9dc5-ad40562c5626 Rev
// a40a1d91-3295-4ca4-b343-ad58e2279fec Ent
// 6a0d1585-d572-4d8f-bdb4-498a89506e85 Bid

export async function POST({ request, cookies }) {
	const {
		record: { form, response, solicitation_matched }
	} = await request.json();

	/** @type {import('@supabase/supabase-js').SupabaseClient<import('$lib/types/supabase.js').Database>} */
	const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		// @ts-ignore
		cookies,
		global: {
			headers: { Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` }
		}
	});

	const { data, error } = await supabase
		.from('solicitations_matched')
		.update(response)
		.eq('id', solicitation_matched)
		.select('*')
		.single();

	if (error) {
		console.error(error);
		return json({ error, data }, { status: 500 });
	}

	try {
		switch (form) {
			// opportunity form
			case '50e95568-180b-46d5-a341-f216bb2a3c17':
				if (response.skip_engineering) {
					await updateStatusInProgress(
						data.status,
						['purchasing:in_progress', 'labor:in_progress'],
						supabase,
						solicitation_matched
					);
					await supabase
						.from('forms')
						.insert({ form: '18055704-d9b9-42d7-958b-f5d1d5b1ba4d', solicitation_matched });

					await supabase
						.from('forms')
						.insert({ form: '53cc6979-4406-47aa-97a0-1d83d0504c12', solicitation_matched });
				} else if (data.status.includes('opportunity:pursue')) {
					await updateStatusInProgress(
						data.status,
						['engineering:in_progress'],
						supabase,
						solicitation_matched
					);
					await supabase
						.from('forms')
						.insert({ form: '0ce91293-4277-446e-9ff2-2d5c62bbb0fe', solicitation_matched });
				}
				break;

			// engineering form
			case '0ce91293-4277-446e-9ff2-2d5c62bbb0fe':
				if (data.status.includes('engineering:can_build')) {
					await updateStatusInProgress(
						data.status,
						['labor:in_progress'],
						supabase,
						solicitation_matched
					);
					await supabase
						.from('forms')
						.insert({ form: 'bee07e8a-3c83-4bce-89a7-f91ca65804e6', solicitation_matched });
				}

				break;

			// bom form
			case 'bee07e8a-3c83-4bce-89a7-f91ca65804e6':
				if (data.status.includes('bom:created') || data.status.includes('bom:in_house_part')) {
					await updateStatusInProgress(
						data.status,
						['purchasing:in_progress', 'labor:in_progress'],
						supabase,
						solicitation_matched
					);
					await supabase
						.from('forms')
						.insert({ form: '18055704-d9b9-42d7-958b-f5d1d5b1ba4d', solicitation_matched });

					await supabase
						.from('forms')
						.insert({ form: '53cc6979-4406-47aa-97a0-1d83d0504c12', solicitation_matched });
				}
				break;

			// purchasing and labor forms
			case '18055704-d9b9-42d7-958b-f5d1d5b1ba4d':
			case '53cc6979-4406-47aa-97a0-1d83d0504c12':
				if (
					!data.status.includes('purchasing:in_progress') &&
					!data.status.includes('labor:in_progress')
				) {
					await updateStatusInProgress(
						data.status,
						['review:in_progress'],
						supabase,
						solicitation_matched
					);
					await supabase
						.from('forms')
						.insert({ form: '6bbf4342-1b50-4c1a-9dc5-ad40562c5626', solicitation_matched });
				}
				break;

			// review form
			case '6bbf4342-1b50-4c1a-9dc5-ad40562c5626':
				if (data.status.includes('review:approved')) {
					await updateStatusInProgress(
						data.status,
						['enter_quote:in_progress', 'bid:in_progress'],
						supabase,
						solicitation_matched
					);
					await supabase
						.from('forms')
						.insert({ form: 'a40a1d91-3295-4ca4-b343-ad58e2279fec', solicitation_matched });
					await supabase
						.from('forms')
						.insert({ form: '6a0d1585-d572-4d8f-bdb4-498a89506e85', solicitation_matched });
				}
				break;

			default:
				break;
		}
	} catch (e) {
		console.error(e);
		return json({ e, data }, { status: 500 });
	}

	return json({}, { status: 200 });
}

async function updateStatusInProgress(status, statusValues, supabase, id) {
	status = status.filter((e) => !statusValues.some((s) => e.includes(s.split(':')[0])));
	status = [...status, ...statusValues];
	await supabase.from('solicitations_matched').update({ status }).eq('id', id);
}
