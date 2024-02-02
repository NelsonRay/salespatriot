// @ts-nocheck

import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { json } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';

// 50e95568-180b-46d5-a341-f216bb2a3c17 Opp
// 0ce91293-4277-446e-9ff2-2d5c62bbb0fe Eng
// bee07e8a-3c83-4bce-89a7-f91ca65804e6 Bom
// 18055704-d9b9-42d7-958b-f5d1d5b1ba4d Pur
// 53cc6979-4406-47aa-97a0-1d83d0504c12 Lab
// 6bbf4342-1b50-4c1a-9dc5-ad40562c5626 Rev
// 6a0d1585-d572-4d8f-bdb4-498a89506e85 Bid

export async function POST({ request, cookies }) {
	const {
		record: { form, response, solicitation_matched }
	} = await request.json();

	/** @type {import('@supabase/supabase-js').SupabaseClient<import('$lib/server/types/supabase.js').Database>} */
	const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
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
		.select('*');

	if (error) {
		console.log(error);
	}

	const solicitation_matched_data = data[0];

	switch (form) {
		case '50e95568-180b-46d5-a341-f216bb2a3c17':
			if (
				solicitation_matched_data.opportunity_status === '70e84e79-dea9-4269-ad49-f6952caf9a3d' &&
				!solicitation_matched_data.skip_engineering
			) {
				await supabase
					.from('forms')
					.insert({ form: '0ce91293-4277-446e-9ff2-2d5c62bbb0fe', solicitation_matched });
			}
			break;
		case '0ce91293-4277-446e-9ff2-2d5c62bbb0fe':
			if (solicitation_matched_data.engineering_status === 'a822ed5c-5df9-4697-b136-21f79e0c005c') {
				await supabase
					.from('forms')
					.insert({ form: 'bee07e8a-3c83-4bce-89a7-f91ca65804e6', solicitation_matched });

				await supabase
					.from('forms')
					.insert({ form: '18055704-d9b9-42d7-958b-f5d1d5b1ba4d', solicitation_matched });
			}

			break;
		case 'bee07e8a-3c83-4bce-89a7-f91ca65804e6':
			if (solicitation_matched_data.bom_status === '6e06ae44-05c0-44b7-9e7b-1f297e8f3f5d') {
				await supabase
					.from('forms')
					.insert({ form: '18055704-d9b9-42d7-958b-f5d1d5b1ba4d', solicitation_matched });

				await supabase
					.from('forms')
					.insert({ form: '53cc6979-4406-47aa-97a0-1d83d0504c12', solicitation_matched });
			}
			break;
		case '18055704-d9b9-42d7-958b-f5d1d5b1ba4d':
		case '53cc6979-4406-47aa-97a0-1d83d0504c12':
			if (
				solicitation_matched_data.purchasing_status === '35179f79-2b6e-481f-8da1-55c2c3c439f2' ||
				solicitation_matched_data.labor_status === '835014e3-9683-4321-b876-1ed5b5867f3d'
			) {
				await supabase
					.from('forms')
					.insert({ form: '6bbf4342-1b50-4c1a-9dc5-ad40562c5626', solicitation_matched });
			}
			break;

		case '6bbf4342-1b50-4c1a-9dc5-ad40562c5626':
			await supabase
				.from('forms')
				.insert({ form: '6a0d1585-d572-4d8f-bdb4-498a89506e85', solicitation_matched });
			break;
		case '6a0d1585-d572-4d8f-bdb4-498a89506e85':
			break;
		default:
			break;
	}

	return json({}, { status: 200 });
}
