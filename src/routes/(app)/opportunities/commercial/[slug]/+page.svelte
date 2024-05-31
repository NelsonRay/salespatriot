<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import Views from '$lib/components/app/Views/Views.svelte';
	import { page } from '$app/stores';
	import { commercialTags } from '$lib/tags.js';
	import { getTableColumns } from '$lib/table.js';
	import Table from '$lib/components/app/Commercial/Table/Table.svelte';
	import { calculateDaysDifference } from '$lib/helpers.js';

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
		let query = supabase
			.from('rfqs')
			.select('*, customer!inner(*), rfqs_parts(part(number), rfqs_parts_quantities(*))');

		switch (pathname) {
			case '/opportunities/commercial/active-rfqs':
				query = query.eq('removed', false);
				break;
			case '/opportunities/commercial/follow-up':
				query = query.filter('status', 'cs', `{"response:waiting"}`);
				break;
			case '/opportunities/commercial/sent-rfqs':
				query = query.filter('status', 'cs', `{"send_quote:complete"}`);
				break;
			case '/opportunities/commercial/placed-orders':
				query = query.filter('status', 'cs', `{"response:placed_order"}`);
				break;
			default:
				break;
		}

		let { data, error } = await query;

		switch (pathname) {
			case '/opportunities/commercial/active-rfqs':
				for (let status of ['purchasing', 'labor', 'final_pricing'].reverse()) {
					data = data.sort(function (a, b) {
						let alevel = 10;
						let blevel = 10;
						if (a.status.some((e) => e.includes(status))) {
							alevel =
								commercialTags[status][a.status.filter((e) => e.includes(status))[0].split(':')[1]]
									.level;
						}

						if (b.status.some((e) => e.includes(status))) {
							blevel =
								commercialTags[status][b.status.filter((e) => e.includes(status))[0].split(':')[1]]
									.level;
						}

						return alevel < blevel ? -1 : 1;
					});
				}
				break;
			case '/opportunities/commercial/follow-up':
				data = data
					.sort((a, b) => new Date(b.sent_quote_timestamp) - new Date(a.sent_quote_timestamp))
					.filter((d) => Math.abs(calculateDaysDifference(d.sent_quote_timestamp)) > 11);
				break;
			case '/opportunities/commercial/sent-rfqs':
				data = data.sort(
					(a, b) => new Date(b.sent_quote_timestamp) - new Date(a.sent_quote_timestamp)
				);
				break;
			case '/opportunities/commercial/all-rfqs':
				data = data.sort(
					(a, b) => new Date(a.sent_quote_timestamp) - new Date(b.sent_quote_timestamp)
				);
				break;
		}
		rfqs = data;
	}

	onMount(() => {
		if (session) {
			loadData($page.url.pathname);
		}
		isMounted = true;
	});

	const views = {
		'/opportunities/commercial/active-rfqs': 'RFQS - In Progress',
		'/opportunities/commercial/sent-rfqs': 'Sent RFQS',
		'/opportunities/commercial/follow-up': 'Follow Up',
		'/opportunities/commercial/placed-orders': 'Placed Orders',
		'/opportunities/commercial/all-rfqs': 'All RFQS'
	};

	async function assignFollowUp(person, rfq) {
		// update response status to following up and then assign form
		const status = [...rfq.status.filter((s) => s != 'response:waiting'), 'response:following_up'];

		const { error } = await supabase.from('rfqs').update({ status }).eq('id', rfq.id);

		if (person == 'cindy') {
			await supabase
				.from('forms')
				.insert({ form: 'd3dfeff5-ad61-4948-b028-b4d447cae57f', commercial: true, rfq: rfq.id });
		} else if (person == 'tom') {
			await supabase
				.from('forms')
				.insert({ form: 'd3dfeff5-ad61-4948-b028-b4d447cae57f', commercial: true, rfq: rfq.id });
		}
	}
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
		</div>
	</div>
</div>

{#if rfqs}
	<Table data={rfqs} columns={getTableColumns($page.url.pathname)} {assignFollowUp} />
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
