/* eslint-disable no-unused-vars */
import { error, json } from '@sveltejs/kit';

export async function POST({ request, locals: { supabase, session } }) {
	const { values, id } = await request.json();

	const { error: err } = await supabase
		.from('commercial_forms')
		.update({
			submitted_timestamp: new Date().toISOString(),
			submitted: true,
			submitted_at: session?.user.id
		})
		.eq('id', id);

	const { commercial_rfqs_parts, customer, ...rest } = values;

	const { error: oErr } = await supabase.from('commercial_rfqs').update(rest).eq('id', values.id);

	const { error: pErr } = await supabase
		.from('commercial_rfqs_parts')
		.upsert(commercial_rfqs_parts);

	if (err) {
		console.error(err);

		error(400, err.toString());
	}

	return json({}, { status: 200 });
}
