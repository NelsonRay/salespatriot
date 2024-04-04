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
			.select('id, products(*), boms_parts(*, part(*), vendor(*))')
			.eq('id', $page.params.slug)
			.limit(1)
			.single();

		let { data, error } = await query;

		bom = data;
	}

	async function updateVendorEmail(email) {
		const vendorId = selectedVendor?.id;
		selectedVendor = null;

		await supabase.from('vendors').update({ email }).eq('id', vendorId);

		window.location.reload();
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
