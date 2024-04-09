<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Table from '$lib/components/app/Suppliers/Table/Table.svelte';

	export let data;
	// export let isAdmin = false;

	$: ({ supabase, session } = data);

	let quotes = null;
	let isMounted = false;

	async function loadData() {
		let query = supabase
			.from('parts_quotes')
			.select('id, part(*), boms_quote(id, bom(id, products(number))), vendor(*), created_at')
			.eq('complete', false);

		let { data, error } = await query;

		quotes = data;
	}

	onMount(() => {
		if (session) {
			loadData($page.url.pathname);
		}
		isMounted = true;
	});
</script>

<svelte:head>
	<title>Quotes</title>
</svelte:head>

<div class="relative top-0">
	<div class="flex flex-row h-14 items-center justify-between mx-2">
		<div class="flex flex-row items-center">
			<p class="font-semibold ml-4 text-sm">Quotes</p>
		</div>
	</div>
</div>

{#if quotes}
	<Table data={quotes} />
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
