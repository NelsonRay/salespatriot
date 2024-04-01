// @ts-nocheck
import { json } from '@sveltejs/kit';

/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
	runtime: 'nodejs18.x',
	split: true
};

export async function POST({ request, locals: { supabase, session } }) {
	const { rfq } = await request.json();

	const { error } = await supabase
		.from('rfqs_uploaded')
		.insert({ values: rfq, user: session?.user?.id });

	if (error) {
		return json({ error }, { status: 500 });
	}

	return json({}, { status: 200 });
}
