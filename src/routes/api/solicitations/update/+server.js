import { json, error } from '@sveltejs/kit';

export async function POST({ request, locals: { supabase } }) {
	const { id, values } = await request.json();

	const { error: err } = await supabase.from('solicitations_matched').update(values).eq('id', id);

	if (err) {
		console.error(err);

		error(400, err.toString());
	}

	return json({}, { status: 200 });
}
