<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import Table from '$lib/components/app/Suppliers/Table/Table.svelte';

	export let data;
	// export let isAdmin = false;

	$: ({ supabase, session } = data);

	let quotes = null;
	let showAll = false;
	let isMounted = false;

	async function loadData() {
		let query = supabase
			.from('parts_quotes')
			.select('*, part(*), boms_quote(id, bom(id, parts(number))), vendor(*)');

		if (!showAll) {
			query = query.eq('complete', false);
		} else {
			query = query.filter('vendors_email', 'not.is', null);
		}

		let { data, error } = await query;

		console.log(data, error);

		quotes = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
	}

	onMount(() => {
		isMounted = true;
	});

	$: if (isMounted && showAll != null) {
		if (session) {
			loadData();
		}
	}
</script>

<svelte:head>
	<title>Quotes</title>
</svelte:head>

<div class="relative top-0">
	<div class="flex flex-row h-14 items-center justify-between mx-2">
		<div class="flex flex-row items-center">
			<p class="font-semibold ml-4 text-sm">Quotes</p>
		</div>
		<div class="flex flex-row items-center">
			<button
				on:click={() => (showAll = false)}
				class="rounded-r-none text-xs bg-neutral-200 p-2 rounded-l-md border-l-[1px] border-gray-300 hover:bg-neutral-300 {!showAll
					? 'bg-neutral-300'
					: ''}">Pending</button
			>
			<button
				on:click={() => (showAll = true)}
				class="rounded-l-none text-xs bg-neutral-200 p-2 rounded-r-md border-r-[1px] border-gray-300 hover:bg-neutral-300 {showAll
					? 'bg-neutral-300'
					: ''}">Show All</button
			>
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
