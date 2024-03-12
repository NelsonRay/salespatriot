<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { govTags } from '$lib/tags.js';
	import Views from '$lib/components/app/Views/Views.svelte';
	import { page } from '$app/stores';
	import { formatDate } from '$lib/helpers.js';
	import Table from '$lib/components/app/Commercial/Table/Table.svelte';

	export let data;

	$: ({ supabase, session } = data);

	let rfqs = null;
	let isMounted = false;

	page.subscribe((p) => {
		if (isMounted) {
			rfqs = null;
			loadData(p.url.pathname);
		}
	});

	async function loadData(pathname) {
		let query = supabase.from('rfqs').select('*, customer!inner(*)');

		switch (pathname) {
			default:
				break;
		}

		let { data, error } = await query;

		// switch (pathname) {
		// 	case '/sales/commerical/bidding-funnel':
		// 		for (let status of [
		// 			'opportunity',
		// 			'engineering',
		// 			'bom',
		// 			'purchasing',
		// 			'labor',
		// 			'final_pricing',
		// 			'bid'
		// 		].reverse()) {
		// 			data = data.sort(function (a, b) {
		// 				let alevel = 10;
		// 				let blevel = 10;
		// 				if (a.status.some((e) => e.includes(status))) {
		// 					alevel =
		// 						govTags[status][a.status.filter((e) => e.includes(status))[0].split(':')[1]].level;
		// 				}

		// 				if (b.status.some((e) => e.includes(status))) {
		// 					blevel =
		// 						govTags[status][b.status.filter((e) => e.includes(status))[0].split(':')[1]].level;
		// 				}

		// 				return alevel < blevel ? -1 : 1;
		// 			});
		// 		}
		// 		break;
		// }
		rfqs = data;
	}

	onMount(() => {
		if (session) {
			loadData($page.url.pathname);
		}
		isMounted = true;
	});

	const views = {
		'/sales/commercial/rfqs': 'RFQS'
	};
</script>

<svelte:head>
	<title>Commercial RFQs - Sales Patriot</title>
</svelte:head>

<div class="relative top-0">
	<div class="flex flex-row h-14 items-center justify-between mx-2">
		<div class="flex flex-row items-center">
			<Views {views} />
			<p class="font-semibold ml-4 text-sm">{views[$page.url.pathname]}</p>
		</div>
		<div class="flex flex-row items-center">
			<a
				class="text-sm p-2 bg-neutral-100 rounded-md mr-4"
				href={`${$page.url.origin}/commercial-new`}
				target="_blank">+ RFQ</a
			>
			<div class="flex flex-row items-center">
				<a
					href="/sales/commercial/rfqs"
					class="rounded-r-none text-xs bg-neutral-200 p-2 rounded-l-md border-l-[1px] border-gray-300 hover:bg-neutral-300 {$page.url.pathname.includes(
						'commercial'
					)
						? 'bg-neutral-300'
						: ''}">Commercial</a
				>
				<a
					href="/sales/government/bidding-funnel"
					class="rounded-l-none text-xs bg-neutral-200 p-2 rounded-r-md border-r-[1px] border-gray-300 hover:bg-neutral-300 {$page.url.pathname.includes(
						'government'
					)
						? 'bg-neutral-300'
						: ''}">Government</a
				>
			</div>
		</div>
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
