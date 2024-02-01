import { SUPABASE_URL, SUPABASE_ANON_KEY } from '$env/static/private';
import { createServerClient } from '@supabase/ssr';
// import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
	event.locals.supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => event.cookies.get(key),
			set: (key, value, options) => {
				// @ts-ignore
				event.cookies.set(key, value, options);
			},
			remove: (key, options) => {
				// @ts-ignore
				event.cookies.delete(key, options);
			}
		}
	});

	const getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	event.locals.session = await getSession();

	// if (['/', '/auth'].includes(event.url.pathname) && event.locals.session) {
	// 	throw redirect(302, '/households?type=CLIENT');
	// }

	// if (
	// 	['/households', '/forms', '/activity', '/settings', '/', 'household'].includes(
	// 		event.url.pathname
	// 	) &&
	// 	!event.locals.session
	// ) {
	// 	throw redirect(303, '/auth');
	// }

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
}
