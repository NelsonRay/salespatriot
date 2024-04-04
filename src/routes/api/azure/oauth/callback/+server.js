import { AZURE_CLIENT_ID, AZURE_CLIENT_SECRET } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import qs from 'qs';

export const GET = async ({ url, locals: { supabase, session }, fetch }) => {
	const code = url.searchParams.get('code');
	console.log(code);

	const response = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
		method: 'POST',
		body: qs.stringify({
			client_id: AZURE_CLIENT_ID,
			client_secret: AZURE_CLIENT_SECRET,
			scope: 'offline_access https://graph.microsoft.com/mail.send',
			redirect_uri: `${url.origin}/api/azure/oauth/callback`,
			code: code,
			grant_type: 'authorization_code',
			code_verifier: 'SYU2DuL7_EHiwMKFxSX1c72zIOpN8TisFic7xyom7aU'
		}),
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
			// Origin: url.origin
		}
	});

	const data = await response.json();
	console.log(data);

	if (data.access_token && data.refresh_token) {
		const { data: tokenData, error } = await supabase.from('users_mail_tokens').upsert({
			access_token: data.access_token,
			refresh_token: data.refresh_token,
			provider: 'azure',
			id: session?.user.id,
			expires_in: data.expires_in,
			last_modified: new Date().toISOString()
		});

		console.log(tokenData, error);
	}

	throw redirect(301, `${url.origin}/settings`);
};
