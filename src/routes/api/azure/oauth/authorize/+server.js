import qs from 'qs';
import { AZURE_CLIENT_ID } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

export async function GET({ url }) {
	const params = {
		client_id: AZURE_CLIENT_ID,
		response_type: 'code',
		redirect_uri: `${url.origin}/api/azure/oauth/callback`,
		scope: 'offline_access https://graph.microsoft.com/mail.send',
		response_mode: 'query',
		state: '555',
		code_challenge: 'SYU2DuL7_EHiwMKFxSX1c72zIOpN8TisFic7xyom7aU'
	};

	throw redirect(
		301,
		`https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${qs.stringify(params)}`
	);
}
