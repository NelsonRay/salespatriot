import { error } from '@sveltejs/kit';

export const ssr = false;

export async function load({ params, locals: { supabase } }) {
	const { data, error: err } = await supabase
		.from('forms')
		.select(
			'*, form!inner(*), solicitation_matched!inner(*, solicitation!inner(*, nsn(id, matching_nsns(*)), expires_on), matching_rule(*))'
		)
		.eq('id', parseInt(params.slug))
		.limit(1)
		.single();

	if (err) {
		console.error(err);

		error(404, { message: 'Error occurred' });
	}

	if (!data) {
		error(400, { message: 'No form associated with this link' });
	}

	return data;
}
