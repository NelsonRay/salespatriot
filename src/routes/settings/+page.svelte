<script>
	import Arrow from '$lib/icons/Arrow.svg';
	import { onMount } from 'svelte';

	export let data;
	$: ({ supabase } = data);

	let users;

	async function loadData() {
		const { data } = await supabase.from('users').select('*, form(*)');

		users = data?.sort((a, b) => a.index - b.index);
	}

	onMount(() => {
		loadData();
	});

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

<button on:click={goBack}>
	<div class="flex flex-row items-center p-2 rounded-md bg-neutral-50 m-4">
		<img src={Arrow} alt="1" class="h-5 w-5" />
		<p class="mb-[0.5px]">Go Back</p>
	</div>
</button>
<div class="flex flex-row m-4 justify-center w-full">
	<div class="w-1/2">
		<p class="font-bold text-lg mb-2">Users</p>
		<div class="flex flex-col space-y-3">
			{#each users ?? [] as user}
				<div class="flex flex-col">
					<div class="bg-neutral-100 flex flex-row justify-between p-2 rounded-md">
						<div class="flex flex-row space-x-3">
							<p class="font-semibold">{user.name}</p>
							<p>{user.title}</p>
						</div>
						<p class="text-sm text-gray-400">{user.email}</p>
					</div>
					{#each user.form ?? [] as form}
						<div class="flex flex-col ml-4">
							<div class="flex flex-row bg-neutral-50 rounded-md mt-2">
								<p>{form.name}</p>
							</div>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<!-- <form action="?/mail_token" method="post" use:enhance>
		<button class="btn capitalize mt-5" type="submit">
			<img src={Outlook} alt="sfc" height="32px" width="32px" />
			<span>Authorize Outlook</span>
		</button>
	</form> -->
</div>
<button class="ml-4 mt-32" on:click={logout}>Logout</button>
