import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import { redirect } from '@sveltejs/kit';

Sentry.init({
	dsn: 'https://50b9f1f3ca9b0df58e50b2baef3bea6c@o4507150077722624.ingest.us.sentry.io/4507150079098880',
	tracesSampleRate: 1,
	environment: import.meta.env.MODE
});

export const handle = sequence(Sentry.sentryHandle(), async ({ event, resolve }) => {
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
		throw redirect(303, '/rfqs/commercial-active-rfqs');
	}

	// if trying to access paths other than accepted api routes, redirect to auth
	if (
		event.url.pathname !== '/' &&
		![
			'/api/webhooks/form-submitted',
			'/api/webhooks/commercial-form-submitted',
			'/api/webhooks/rfq-automation',
			'/api/webhooks/rfq-upload',
			'/api/webhooks/resend/form',
			'/api/pb-upload',
			'/rfq-public/6b289746-2b01-47af-a7d4-26a3920f75ca',
			'/api/smtp/send-vendor-email',
			'/api/bom/prepare-vendors-emails',
			'/api/bom/email-vendor',
			'/api/emails/process-emailed-rfqs'
		].includes(event.url.pathname) &&
		!event.locals.session
	) {
		throw redirect(303, '/');
	}

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
});
export const handleError = Sentry.handleErrorWithSentry();
