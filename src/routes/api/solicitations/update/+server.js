// @ts-nocheck
import { json, error } from '@sveltejs/kit';

export async function POST({ request, locals: { supabase } }) {
	const { id, values, oldValues } = await request.json();

	const { error: err } = await supabase.from('solicitations_matched').update(values).eq('id', id);

	const forms = {
		opportunity: '50e95568-180b-46d5-a341-f216bb2a3c17',
		engineering: '0ce91293-4277-446e-9ff2-2d5c62bbb0fe',
		bom: 'bee07e8a-3c83-4bce-89a7-f91ca65804e6',
		purchasing: '18055704-d9b9-42d7-958b-f5d1d5b1ba4d',
		labor: '53cc6979-4406-47aa-97a0-1d83d0504c12',
		review: '6bbf4342-1b50-4c1a-9dc5-ad40562c5626',
		enter_quote: 'a40a1d91-3295-4ca4-b343-ad58e2279fec',
		bid: '6a0d1585-d572-4d8f-bdb4-498a89506e85'
	};

	const newTypes = values.status
		.filter((e) => e.includes('in_progress'))
		.filter((e) => !oldValues.status.includes(e))
		.map((e) => e.split(':')[0]);

	for (let type of newTypes) {
		const { data: d, error: e } = await supabase
			.from('forms')
			.insert({ form: forms[type], solicitation_matched: id });
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
			.delete()
			.eq('form', forms[type])
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
