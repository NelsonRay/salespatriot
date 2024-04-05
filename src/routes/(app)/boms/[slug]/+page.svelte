<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Table from '$lib/components/app/BOMs/LineItemsTable/Table.svelte';
	import VendorEmailModal from '$lib/components/app/BOMs/VendorEmailModal/VendorEmailModal.svelte';

	export let data;
	export let isAdmin = false;

	$: ({ supabase, session } = data);

	let bom = null;
	let isMounted = false;
	let isLoading = false;
	let selectedVendor;

	page.subscribe((p) => {
		if (isMounted) {
			bom = null;
			loadData();
		}
	});

	async function loadData() {
		let query = supabase
			.from('boms')
			.select('id, products(*), boms_parts(*, part(*), vendor(*)), boms_quotes(*)')
			.eq('id', $page.params.slug)
			.limit(1)
			.single();

		let { data, error } = await query;

		bom = data;
	}

	async function emailVendors() {
		if (!isLoading && isBomQuoteReady(bom)) {
			isLoading = true;
			await fetch('/api/bom/automation', { method: 'POST', body: JSON.stringify({ id: bom.id }) });
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

		for (let part of b?.boms_parts ?? []) {
			if (part.vendor && !part.vendor?.email) {
				return false;
			}
		}

		return true;
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
			<p class="font-semibold ml-4 text-sm">{(bom?.products?.number ?? '') + ' '}BOM</p>
		</div>
		<div>
			{#if !isLoading}
				<button
					on:click={emailVendors}
					class="text-xs p-3 rounded-3xl font-medium mr-2 {isBomQuoteReady(bom)
						? 'bg-green-400 hover:bg-green-300'
						: 'bg-gray-100 text-gray-400'}">Email Vendors</button
				>{:else}
				<span class="loading loading-spinner loading-md"></span>
			{/if}
		</div>
	</div>
</div>

{#if bom}
	<Table
		data={bom?.boms_parts?.sort((a, b) => a.line_number - b.line_number)}
		blockEditing={!isAdmin}
		bind:selectedVendor
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
