// @ts-nocheck
import { json, error } from '@sveltejs/kit';

export async function POST({ request, locals: { supabase } }) {
	const { id, values, oldValues } = await request.json();

	const { error: err } = await supabase.from('solicitations_matched').update(values).eq('id', id);

	const forms = {
		opportunity: {
			id: '50e95568-180b-46d5-a341-f216bb2a3c17',
			assignee: '6a349541-2915-42c6-86f3-e8af347bdf01' // alex
		},
		engineering: {
			id: '0ce91293-4277-446e-9ff2-2d5c62bbb0fe',
			assignee: '019a28d1-3429-4831-8161-2abbf6072cfa' // wayne
		},
		bom: {
			id: 'bee07e8a-3c83-4bce-89a7-f91ca65804e6',
			assignee: '6a349541-2915-42c6-86f3-e8af347bdf01' // alex
		},
		purchasing: {
			id: '18055704-d9b9-42d7-958b-f5d1d5b1ba4d',
			assignee: '1e549c12-269f-43f2-b832-3a5558840cb9' // diana
		},
		labor: {
			id: '53cc6979-4406-47aa-97a0-1d83d0504c12',
			assignee: '74f12757-db07-41af-bf29-422e97561118' // aman
		},
		final_pricing: {
			id: '6bbf4342-1b50-4c1a-9dc5-ad40562c5626',
			assignee: '6a349541-2915-42c6-86f3-e8af347bdf01' // alex
		},
		enter_quote: {
			id: 'a40a1d91-3295-4ca4-b343-ad58e2279fec',
			assignee: '1e549c12-269f-43f2-b832-3a5558840cb9' // diana
		},
		bid: {
			id: '6a0d1585-d572-4d8f-bdb4-498a89506e85',
			assignee: '35009618-f673-432a-9113-664874e195af' // cindy
		}
	};

	const newTypes = values.status
		.filter((e) => e.includes('in_progress'))
		.filter((e) => !oldValues.status.includes(e))
		.map((e) => e.split(':')[0]);

	for (let type of newTypes) {
		const { data: d, error: e } = await supabase
			.from('forms')
			.insert({ form: forms[type].id, assignee: forms[type].assignee, solicitation_matched: id });
		if (e) {
			console.error(d, e);
		}
	}

	const oldTypes = oldValues.status
		.filter((e) => e.includes('in_progress'))
		.filter((e) => !values.status.includes(e))
		.map((e) => e.split(':')[0]);

	for (let type of oldTypes) {
		const { data, error: dErr } = await supabase
			.from('forms')
			.update({ deleted: true })
			.eq('form', forms[type].id)
			.eq('solicitation_matched', id);

		if (dErr) {
			console.error(data, dErr);
		}
	}

	if (err) {
		console.error('sol', err);
		console.log(values);

		error(400, err.toString());
	}

	return json({}, { status: 200 });
}
