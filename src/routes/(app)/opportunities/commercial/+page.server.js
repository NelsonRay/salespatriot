import { redirect } from '@sveltejs/kit';

export function load({ url }) {
	throw redirect(300, url.origin + '/opportunities/commercial/active-rfqs');
}
