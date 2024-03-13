/* eslint-disable no-unused-vars */
import { error, json } from '@sveltejs/kit';

export async function POST({ request, locals: { supabase, session } }) {
	const { values, id } = await request.json();

	const { error: err } = await supabase
		.from('forms')
		.update({
			submitted_timestamp: new Date().toISOString(),
			submitted: true,
			submitted_by: session?.user?.id,
			values
		})
		.eq('id', id);

	if (err) {
		console.error(err);

		error(400, err.toString());
	}

	return json({}, { status: 200 });
}
