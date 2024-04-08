<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Table from '$lib/components/app/BOMs/LineItemsTable/Table.svelte';
	import VendorEmailModal from '$lib/components/app/BOMs/VendorEmailModal/VendorEmailModal.svelte';

	export let data;

	$: ({ supabase, session } = data);

	let bom = null;
	let isMounted = false;
	let isLoading = false;
	let selectedVendor;
	let isSelectingParts = false;
	let selectedParts = [];

	page.subscribe((p) => {
		if (isMounted) {
			bom = null;
			loadData();
		}
	});

	async function loadData() {
		let query = supabase
			.from('boms')
			.select('id, products(*), boms_parts(*, part(*, parts_quotes(*)), vendor(*)), boms_quotes(*)')
			.eq('id', $page.params.slug)
			.limit(1)
			.single();

		let { data, error } = await query;

		bom = data;
	}

	async function emailVendors() {
		if (!isLoading && isBomQuoteReady(bom)) {
			isLoading = true;
			await fetch('/api/bom/automation', {
				method: 'POST',
				body: JSON.stringify({ id: bom.id, selectedParts })
			});
			window.location.reload();
		}
	}

	async function updateVendorEmail(email) {
		const vendorId = selectedVendor?.id;
		selectedVendor = null;

		await supabase.from('vendors').update({ email }).eq('id', vendorId);

		window.location.reload();
	}

	function isBomQuoteReady(b) {
		if (!b) return false;
		if (b?.boms_quotes?.length > 0) return false;

		return true;
	}

	onMount(() => {
		if (session) {
			loadData($page.url.pathname);
		}
		isMounted = true;
	});

	function toggleSelectingParts() {
		isSelectingParts = true;

		selectedParts = bom.boms_parts.filter((p) => p.vendor?.email).map((p) => p.id);
	}
</script>

<svelte:head>
	<title>BOMs - Sales Patriot</title>
</svelte:head>

<div class="relative top-0">
	<div class="flex flex-row h-14 items-center justify-between mx-2">
		<div class="flex flex-row items-center">
			<p class="font-semibold ml-4 text-sm">{(bom?.products?.number ?? '') + ' '}BOM</p>
		</div>
		<div>
			{#if isSelectingParts}
				<button
					on:click={() => {
						isSelectingParts = false;
						selectedParts = [];
					}}
					class="text-xs p-3 rounded-3xl font-medium mr-1 bg-gray-200 hover:bg-gray-100"
					>Cancel</button
				>
				{#if !isLoading}
					<button
						on:click={emailVendors}
						class="text-xs p-3 rounded-3xl font-medium mr-2 bg-blue-300 hover:bg-blue-200"
						>Email Vendors</button
					>
				{:else}
					<span class="loading loading-spinner loading-md"></span>
				{/if}
			{:else}
				<button
					on:click={toggleSelectingParts}
					class="text-xs p-3 rounded-3xl font-medium mr-2 bg-blue-300 hover:bg-blue-200"
					>Select Parts</button
				>
			{/if}
		</div>
	</div>
</div>

{#if bom}
	<Table
		data={bom?.boms_parts?.sort((a, b) => a.line_number - b.line_number)}
		bind:selectedVendor
		{isSelectingParts}
		bind:selectedParts
	/>
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

<VendorEmailModal open={!!selectedVendor} {selectedVendor} submitCallback={updateVendorEmail} />
