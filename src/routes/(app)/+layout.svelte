<script>
	import { AppShell } from '@skeletonlabs/skeleton';
	import AppBar from '$lib/components/app/Navigation/AppBar/AppBar.svelte';
	import AppSidebar from '$lib/components/app/Navigation/AppSidebar/AppSidebar.svelte';

	export let data;

	$: ({ supabase, session } = data);

	// @ts-ignore
	async function handleFeedbackSubmit(message) {
		await supabase.from('feedback').insert({ message, user: session?.user.id });
	}
</script>

<AppShell slotPageContent="overflow-x-scroll">
	<svelte:fragment slot="header"><AppBar {handleFeedbackSubmit} /></svelte:fragment>
	<svelte:fragment slot="sidebarLeft"><AppSidebar /></svelte:fragment>
	<slot />
</AppShell>
