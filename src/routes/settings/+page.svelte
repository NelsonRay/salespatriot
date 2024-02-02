<script>
	export let data;

	async function logout() {
		await data.supabase.auth.signOut();
		window.location.reload();
	}
</script>

<button on:click={logout}>Logout</button>
