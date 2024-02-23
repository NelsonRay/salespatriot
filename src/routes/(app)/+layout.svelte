<script>
	import { AppShell } from '@skeletonlabs/skeleton';
	import AppBar from '$lib/components/app/Navigation/AppBar/AppBar.svelte';
	import AppSidebar from '$lib/components/app/Navigation/AppSidebar/AppSidebar.svelte';
</script>

<AppShell slotPageContent="overflow-x-scroll">
	<svelte:fragment slot="header"><AppBar /></svelte:fragment>
	<svelte:fragment slot="sidebarLeft"><AppSidebar /></svelte:fragment>
	<slot />
</AppShell>
