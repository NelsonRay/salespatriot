<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Table from '$lib/components/app/Commercial/Table/Table.svelte';

	export let data;

	$: ({ supabase, session } = data);

	let rfqs = null;
	let isMounted = false;

	async function loadData() {
		let query = supabase
			.from('rfqs')
			.select('*, customer!inner(*), rfqs_parts(part(number), rfqs_parts_quantities(*))')
			.filter('status', 'cs', '{"response:placed_order"}');

		let { data } = await query;

		rfqs = data;
	}

	onMount(() => {
		if (session) {
			loadData();
		}
		isMounted = true;
	});
</script>

<svelte:head>
	<title>Commercial RFQs - Sales Patriot</title>
</svelte:head>

<div class="relative top-0">
	<div class="flex flex-row h-14 items-center justify-between mx-2">
		<div class="flex flex-row items-center">
			<p class="font-semibold text-sm">Commercial Sales Orders</p>
		</div>
		<div></div>
	</div>
</div>

{#if rfqs}
	<Table data={rfqs} />
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
