import { redirect } from '@sveltejs/kit';

export function load({ url }) {
	throw redirect(300, url.origin + '/sales/commercial/active-rfqs');
}
