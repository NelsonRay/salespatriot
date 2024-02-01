import { json } from '@sveltejs/kit';

export async function POST({ request, locals: { supabase } }) {
	const { id, response } = await request.json();

	const { error } = await supabase
		.from('forms')
		.update({ response, response_timestamp: new Date().toISOString(), submitted: true })
		.eq('id', id);

	if (error) {
		console.log(error);
	}

	return json({}, { status: 200 });
}
