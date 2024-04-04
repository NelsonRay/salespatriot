<script>
	import { enhance } from '$app/forms';
	import Outlook from '$lib/icons/Outlook.svg';
	import Arrow from '$lib/icons/Arrow.svg';

	export let data;

	async function logout() {
		await data.supabase.auth.signOut();
		window.location.reload();
	}

	function goBack() {
		history.back();
	}
</script>

<svelte:head>
	<title>Settings</title>
</svelte:head>

<div class="flex flex-col m-4 items-start">
	<button on:click={goBack}>
		<div class="flex flex-row items-center p-2 rounded-md bg-neutral-50">
			<img src={Arrow} alt="1" class="h-5 w-5" />
			<p class="mb-[0.5px]">Go Back</p>
		</div>
	</button>

	<form action="?/mail_token" method="post" use:enhance>
		<button class="btn capitalize mt-5" type="submit">
			<img src={Outlook} alt="sfc" height="32px" width="32px" />
			<span>Authorize Outlook</span>
		</button>
	</form>

	<button class="mt-5" on:click={logout}>Logout</button>
</div>
