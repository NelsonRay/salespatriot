<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Table from '$lib/components/app/BOMs/Table/Table.svelte';

	export let data;
	// export let isAdmin = false;

	$: ({ supabase, session } = data);

	let boms = null;
	let isMounted = false;

	page.subscribe((p) => {
		if (isMounted) {
			boms = null;
			loadData();
		}
	});

	async function loadData() {
		let query = supabase.from('boms').select('id, products(*), boms_quotes(*)');

		let { data, error } = await query;

		boms = data;
	}

	onMount(() => {
		if (session) {
			loadData($page.url.pathname);
		}
		isMounted = true;
	});
</script>

<svelte:head>
	<title>BOMs - Sales Patriot</title>
</svelte:head>

<div class="relative top-0">
	<div class="flex flex-row h-14 items-center justify-between mx-2">
		<div class="flex flex-row items-center">
			<p class="font-semibold ml-4 text-sm">BOMs</p>
		</div>
	</div>
</div>

{#if boms}
	<Table data={boms} />
{:else}
	<div class="flex flex-col gap-4 p-5">
		<div class="skeleton h-4 w-full"></div>
		<div class="skeleton h-4 w-full"></div>
		<div class="skeleton h-4 w-full"></div>
		<div class="skeleton h-4 w-full"></div>
		<div class="skeleton h-4 w-full"></div>
		<div class="skeleton h-4 w-full"></div>
		<div class="skeleton h-4 w-full"></div>
		<div class="skeleton h-4 w-full"></div>
	</div>
{/if}
