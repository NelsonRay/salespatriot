import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const payload = await request.json();
	console.log(payload);

	return json({}, { status: 200 });
}
