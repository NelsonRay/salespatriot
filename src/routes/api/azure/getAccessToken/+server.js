import {
	SUPABASE_URL,
	SUPABASE_ANON_KEY,
	SUPABASE_SERVICE_ROLE_KEY,
	ENCRYPTION_KEY,
	AZURE_CLIENT_ID,
} from "$env/static/private";
import cryptojs from "crypto-js";
import { createServerClient } from "@supabase/ssr";
import { json } from "@sveltejs/kit";

export async function POST({ fetch, request, cookies }) {
	/** @type {import('@supabase/supabase-js').SupabaseClient<import('$lib/types/supabase.js').Database>} */
	const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
		cookies,
		global: {
			headers: { Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
		},
	});
	const { id } = await request.json();

	const { data: m_data } = await supabase
		.from("firms_users_mail_tokens")
		.select("*")
		.eq("id", id);

	const {
		refresh_token: encrypted_refresh_token,
		access_token: encrypted_access_token,
		expires_in,
		last_modified,
	} = m_data[0];

	const refresh_token = cryptojs.AES.decrypt(
		encrypted_refresh_token,
		ENCRYPTION_KEY
	).toString(cryptojs.enc.Utf8);

	const access_token = cryptojs.AES.decrypt(
		encrypted_access_token,
		ENCRYPTION_KEY
	).toString(cryptojs.enc.Utf8);

	const date = new Date(last_modified);
	date.setSeconds(date.getSeconds() + expires_in - 60);

	if (new Date() > date) {
		const res = await fetch(
			"https://login.microsoftonline.com/common/oauth2/v2.0/token",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams({
					grant_type: "refresh_token",
					client_id: AZURE_CLIENT_ID,
					refresh_token,
					scope: "offline_access https://graph.microsoft.com/mail.send",
				}),
			}
		);

		const data = await res.json();

		if (res.status === 200) {
			const encrypted_access_token = cryptojs.AES.encrypt(
				data.access_token, // client key
				ENCRYPTION_KEY
			).toString();

			const encrypted_refresh_token = cryptojs.AES.encrypt(
				data.refresh_token, // client key
				ENCRYPTION_KEY
			).toString();

			await supabase.from("firms_users_mail_tokens").upsert({
				access_token: encrypted_access_token,
				refresh_token: encrypted_refresh_token,
				provider: "azure",
				id: id,
				expires_in: data.expires_in,
				last_modified: new Date().toISOString(),
			});
		} else {
			console.error(data);
			throw new Error("Error refreshing MS token");
		}
		return json({ access_token: data.access_token }, { status: res.status });
	} else {
		return json({ access_token }, { status: 200 });
	}
}
