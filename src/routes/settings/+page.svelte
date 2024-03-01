<script>
	export let data;

	async function logout() {
		await data.supabase.auth.signOut();
		window.location.reload();
	}
</script>

<svelte:head>
	<title>Settings</title>
</svelte:head>

<button on:click={logout}>Logout</button>
