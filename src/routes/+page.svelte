<script>
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeSupa } from '@supabase/auth-ui-shared';
	import { page } from '$app/stores';

	export let data;
</script>

<svelte:head>
	<title>Login - Sales Patriot</title>
</svelte:head>

<div class="hero min-h-screen bg-base-100">
	<div class="hero-content flex-col">
		<div class="flex flex-col w-96 items-center">
			<div class="flex flex-row items-center space-x-3 font-semibold">
				<!-- <img src={LPLogo} alt="sf" class="h-20 w-20" /> -->
				<p class="text-3xl">Sales Patriot</p>
			</div>
			<p class="mt-9 mb-3 text-gray-700 font-semibold">Welcome to the beta!</p>
		</div>
		<div class="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
			<div class="card-body">
				<Auth
					supabaseClient={data.supabase}
					view="sign_in"
					redirectTo={`${$page.url.origin}/auth/callback`}
					showLinks={false}
					appearance={{ theme: ThemeSupa, style: { input: 'color: #000000' } }}
				/>
			</div>
		</div>
	</div>
</div>
