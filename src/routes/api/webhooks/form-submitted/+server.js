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
		.limit(1)
		.single();

	if (error) {
		console.log(error);
	}

	switch (form) {
		case '50e95568-180b-46d5-a341-f216bb2a3c17':
			if (data.status.includes('opportunity:pursue') && !data.skip_engineering) {
				await supabase
					.from('forms')
					.insert({ form: '0ce91293-4277-446e-9ff2-2d5c62bbb0fe', solicitation_matched });
			}
			break;
		case '0ce91293-4277-446e-9ff2-2d5c62bbb0fe':
			if (data.status.includes('engineering:can_build')) {
				await supabase
					.from('forms')
					.insert({ form: 'bee07e8a-3c83-4bce-89a7-f91ca65804e6', solicitation_matched });

				await supabase
					.from('forms')
					.insert({ form: '18055704-d9b9-42d7-958b-f5d1d5b1ba4d', solicitation_matched });
			}

			break;
		case 'bee07e8a-3c83-4bce-89a7-f91ca65804e6':
			if (data.status.includes('bom:created') || data.status.included('bom:in_house_part')) {
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
				data.status.includes('purchasing:within_budget') ||
				data.status.includes('labor:within_time')
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
