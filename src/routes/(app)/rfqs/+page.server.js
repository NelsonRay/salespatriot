import { redirect } from '@sveltejs/kit';

export function load({ url }) {
	throw redirect(300, url.origin + '/rfqs/commercial-active-rfqs');
}
