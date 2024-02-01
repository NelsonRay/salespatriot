import { error } from '@sveltejs/kit';

export async function load({ params, locals: { supabase } }) {
	const { data, error: err } = await supabase
		.from('forms')
		.select('*, solicitation_matched(*, solicitation(*)), form(*, user(*))')
		.eq('id', parseInt(params.slug));

	const { data: t_data } = await supabase.from('tags').select('*');

	if (err) {
		console.error(err);

		error(404, { message: 'Error occurred' });
	}

	if (!data || data?.length === 0) {
		error(400, { message: 'No form associated with this link' });
	}

	return { ...data[0], tags: t_data };
}
