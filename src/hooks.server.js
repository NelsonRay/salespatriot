import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';

export const handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});

	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	event.locals.session = await event.locals.getSession();

	if (['/'].includes(event.url.pathname) && event.locals.session) {
		throw redirect(303, '/government');
	}

	// if trying to access paths other than accepted api routes, redirect to auth
	if (
		event.url.pathname !== '/' &&
		!['/api/webhooks/form-submitted', '/api/pb-upload'].includes(event.url.pathname) &&
		!event.locals.session
	) {
		throw redirect(303, '/');
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};
