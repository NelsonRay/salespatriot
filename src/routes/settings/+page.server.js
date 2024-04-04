import { redirect } from '@sveltejs/kit';

export const ssr = false;

export const actions = {
	mail_token: async ({ url }) => {
		throw redirect(301, `${url.origin}/api/azure/oauth/authorize`);
	}
};
