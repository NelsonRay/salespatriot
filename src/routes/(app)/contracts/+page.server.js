export async function load({ locals: { supabase } }) {
	const { data, error } = await supabase
		.from('solicitations_matched')
		.select('*, solicitations(*)');

	if (error) {
		console.log(error);
	}

	console.log(data);

	return {};
}
