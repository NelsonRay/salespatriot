<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Table from '$lib/components/app/BOMs/LineItemsTable/Table.svelte';
	import VendorEmailModal from '$lib/components/app/BOMs/Modals/VendorEmailModal/VendorEmailModal.svelte';
	import DescriptionModal from '$lib/components/app/BOMs/Modals/DescriptionModal/DescriptionModal.svelte';
	import InstructionsModal from '$lib/components/app/BOMs/Modals/InstructionsModal/InstructionsModal.svelte';
	import QuoteModal from '$lib/components/app/BOMs/Modals/QuoteModal/QuoteModal.svelte';
	import { formatCurrency } from '$lib/helpers.js';

	export let data;

	$: ({ supabase, session } = data);

	let boms_quote = null;
	let isMounted = false;
	let isLoading = false;
	let selectedVendor;
	let selectedPart;
	let selectedPartForInstructions;
	let selectedBomPartForQuote;
	let isSelectingParts = false;
	let selectedParts = [];

	page.subscribe((p) => {
		if (isMounted) {
			boms_quote = null;
			loadData();
		}
	});

	async function loadData() {
		let query = supabase
			.from('boms_quotes')
			.select(
				'*, bom(id, products(*), boms_parts(*, part(*, parts_quotes(*, parts_quotes_quantities(*))), vendor(*)))'
			)
			.eq('id', $page.params.slug)
			.limit(1)
			.single();

		let { data, error } = await query;

		boms_quote = data;
	}

	async function emailVendors() {
		if (!isLoading && boms_quote != null && selectedParts?.length > 0) {
			isLoading = true;

			await fetch('/api/bom/automation', {
				method: 'POST',
				body: JSON.stringify({ id: boms_quote.id, selectedParts })
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

	async function updatePartDescription(description) {
		const partId = selectedPart?.id;
		selectedPart = null;

		await supabase.from('parts').update({ description }).eq('id', partId);

		window.location.reload();
	}

	async function updatePartInstructions(vendor_instructions) {
		const partId = selectedPartForInstructions?.id;
		selectedPartForInstructions = null;

		await supabase.from('parts').update({ vendor_instructions }).eq('id', partId);

		window.location.reload();
	}

	async function insertPartQuote(quote) {
		const partId = selectedBomPartForQuote?.part?.id;
		const vendorId = selectedBomPartForQuote?.vendor?.id;
		selectedBomPartForQuote = null;

		// insert part quote
		const { data, error } = await supabase
			.from('parts_quotes')
			.insert({
				part: partId,
				vendor: vendorId,
				moq: quote.moq || null,
				moc: quote.moc || null,
				date_received: quote.date_received || null,
				expiration_date: quote.expiration_date || null,
				notes: quote.notes || null,
				complete: true,
				completed_by: session?.user?.id
			})
			.select('id')
			.limit(1)
			.single();

		// update unit price for each quote qty
		for (let qty of quote?.parts_quotes_quantities ?? []) {
			await supabase.from('parts_quotes_quantities').insert({
				parts_quote: data.id,
				quantity: qty.quantity,
				unit_price: qty.unit_price,
				lead_time: qty.lead_time
			});
		}

		window.location.reload();
	}

	function calcMatCost(q) {
		if (!q) return '';
		let completedCount = 0;
		let matCost = 0;

		const totalCount = q.bom.boms_parts.length;

		for (let bom_part of q.bom.boms_parts) {
			if (bom_part?.part?.parts_quotes[0]?.parts_quotes_quantities?.length > 0) {
				completedCount++;
				const extCost =
					bom_part?.part?.parts_quotes[0]?.parts_quotes_quantities?.sort(
						(a, b) => a.quantity - b.quantity
					)?.[0]?.unit_price * bom_part?.quantity;

				matCost += extCost;
			}
		}

		return `${formatCurrency(matCost)} (${completedCount}/${totalCount} parts)`;
	}

	onMount(() => {
		if (session) {
			loadData($page.url.pathname);
		}
		isMounted = true;
	});

	function toggleSelectingParts() {
		isSelectingParts = true;

		selectedParts = [];
	}
</script>

<svelte:head>
	<title>BOMs - Sales Patriot</title>
</svelte:head>

<div class="relative top-0">
	<div class="flex flex-row h-14 items-center justify-between mx-2">
		<div class="flex flex-row items-center">
			<p class="font-semibold ml-4 text-sm">{(boms_quote?.bom?.products?.number ?? '') + ' '}BOM</p>
		</div>
		<div class="flex flex-row items-center space-x-5">
			<p>{calcMatCost(boms_quote)}</p>
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
</div>

{#if boms_quote}
	<Table
		data={boms_quote?.bom?.boms_parts?.sort((a, b) => a.line_number - b.line_number)}
		bind:selectedVendor
		bind:selectedPart
		bind:selectedPartForInstructions
		bind:selectedBomPartForQuote
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
<DescriptionModal open={!!selectedPart} {selectedPart} submitCallback={updatePartDescription} />
<InstructionsModal
	open={!!selectedPartForInstructions}
	selectedPart={selectedPartForInstructions}
	submitCallback={updatePartInstructions}
/>
<QuoteModal
	open={!!selectedBomPartForQuote}
	{selectedBomPartForQuote}
	submitCallback={insertPartQuote}
/>
