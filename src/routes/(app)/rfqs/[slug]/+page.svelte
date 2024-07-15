<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { govTags } from '$lib/tags.js';
	import Views from '$lib/components/app/Views/Views.svelte';
	import { page } from '$app/stores';
	import { formatDate, solColumns } from '$lib/helpers.js';
	import GovTable from '$lib/components/app/Government/Table/Table.svelte';
	import { getColumns } from '$lib/table.js';
	import { commercialTags } from '$lib/tags.js';
	import { getTableColumns } from '$lib/table.js';
	import ComTable from '$lib/components/app/Commercial/Table/Table.svelte';
	import { calculateDaysDifference } from '$lib/helpers.js';

	export let data;

	$: ({ supabase, session } = data);

	let rfqs = null;
	let isMounted = false;
	let sorted = false;
	let rows = null;

	page.subscribe((p) => {
		if (isMounted) {
			rfqs = null;
			loadData(p.url.pathname);
		}
	});

	async function loadData(pathname) {
		if ($page.url.pathname.includes('government')) {
			let query = supabase
				.from('solicitations_matched')
				.select(
					`*, solicitation!inner(${solColumns}, nsn(id, map_nsns_to_parts(*, part(id, number)))), matching_rule(*)`
				);

			switch (pathname) {
				case '/rfqs/government-bidding-funnel':
					query = query.eq('removed', false);

					break;
				case '/rfqs/government-view-opportunities':
					query = query.filter('status', 'cs', `{"opportunity:in_progress"}`).eq('removed', false);
					break;
				case '/rfqs/government-recently-released':
					query = query
						.order('solicitation(issued_on)', {
							ascending: false
						})
						.limit(100);
					break;
				case '/rfqs/government-expiring-soon':
					let yesterday = new Date();
					yesterday.setDate(new Date().getDate() - 1);

					query = query
						.filter('solicitation.expires_on', 'gt', formatDate(yesterday))
						.order('solicitation(expires_on)', {
							ascending: true
						});
					break;
				case '/rfqs/government-contracts-bid':
					query = query.filter('status', 'cs', `{"${govTags.bid.bid.key}"}`);
					break;
				case '/rfqs/government-flagged':
					query = query.eq('flagged', true);
					break;
				default:
					break;
			}

			let { data, error } = await query;

			switch (pathname) {
				case '/rfqs/government-bidding-funnel':
					for (let status of [
						'opportunity',
						'engineering',
						'bom',
						'purchasing',
						'labor',
						'final_pricing',
						'bid'
					].reverse()) {
						data = data.sort(function (a, b) {
							let alevel = 10;
							let blevel = 10;
							if (a.status.some((e) => e.includes(status))) {
								alevel =
									govTags[status][a.status.filter((e) => e.includes(status))[0].split(':')[1]]
										.level;
							}

							if (b.status.some((e) => e.includes(status))) {
								blevel =
									govTags[status][b.status.filter((e) => e.includes(status))[0].split(':')[1]]
										.level;
							}

							return alevel < blevel ? -1 : 1;
						});
					}
					break;
				case '/rfqs/government-contracts-bid':
					data = data.sort(function (a, b) {
						let alevel = 10;
						let blevel = 10;
						if (a.status.some((e) => e.includes('award'))) {
							alevel =
								govTags['award'][a.status.filter((e) => e.includes('award'))[0].split(':')[1]]
									.level;
						}

						if (b.status.some((e) => e.includes('award'))) {
							blevel =
								govTags['award'][b.status.filter((e) => e.includes('award'))[0].split(':')[1]]
									.level;
						}

						return alevel < blevel ? -1 : 1;
					});
					break;
			}
			rfqs = data;
			rows = rfqs;
		} else {
			let query = supabase
				.from('rfqs')
				.select('*, customer!inner(*), rfqs_parts(part(number), rfqs_parts_quantities(*))');

			switch (pathname) {
				case '/rfqs/commercial-active-rfqs':
					query = query.eq('removed', false);
					break;
				case '/rfqs/commercial-follow-up':
					query = query.filter('status', 'cs', `{"response:waiting"}`);
					break;
				case '/rfqs/commercial-sent-rfqs':
					query = query.filter('status', 'cs', `{"send_quote:complete"}`);
					break;
				case '/rfqs/commercial-placed-orders':
					query = query.filter('status', 'cs', `{"response:placed_order"}`);
					break;
				default:
					break;
			}

			let { data, error } = await query;

			switch (pathname) {
				case '/rfqs/commercial-active-rfqs':
					for (let status of ['purchasing', 'labor', 'final_pricing'].reverse()) {
						data = data.sort(function (a, b) {
							let alevel = 10;
							let blevel = 10;
							if (a.status.some((e) => e.includes(status))) {
								alevel =
									commercialTags[status][
										a.status.filter((e) => e.includes(status))[0].split(':')[1]
									].level;
							}

							if (b.status.some((e) => e.includes(status))) {
								blevel =
									commercialTags[status][
										b.status.filter((e) => e.includes(status))[0].split(':')[1]
									].level;
							}

							return alevel < blevel ? -1 : 1;
						});
					}
					break;
				case '/rfqs/commercial-follow-up':
					data = data
						.sort((a, b) => new Date(b.sent_quote_timestamp) - new Date(a.sent_quote_timestamp))
						.filter((d) => Math.abs(calculateDaysDifference(d.sent_quote_timestamp)) > 11);
					break;
				case '/rfqs/commercial-sent-rfqs':
					data = data.sort(
						(a, b) => new Date(b.sent_quote_timestamp) - new Date(a.sent_quote_timestamp)
					);
					break;
				case '/rfqs/commercial-all-rfqs':
					data = data.sort(
						(a, b) => new Date(a.sent_quote_timestamp) - new Date(b.sent_quote_timestamp)
					);
					break;
			}
			rfqs = data;
		}
	}

	onMount(() => {
		if (session) {
			loadData($page.url.pathname);
		}
		isMounted = true;
	});

	const views = [
		{
			title: 'Commercial',
			paths: [
				{ url: '/rfqs/commercial-active-rfqs', title: 'RFQS - In Progress' },
				{ url: '/rfqs/commercial-sent-rfqs', title: 'Sent RFQS' },
				{ url: '/rfqs/commercial-follow-up', title: 'Follow Up' },
				{ url: '/rfqs/commercial-placed-orders', title: 'Placed Orders' },
				{ url: '/rfqs/commercial-all-rfqs', title: 'All RFQS' }
			]
		},
		{
			title: 'Government',
			paths: [
				{ url: '/rfqs/government-bidding-funnel', title: 'Bidding Funnel' },
				{ url: '/rfqs/government-view-opportunities', title: 'View Opportunities' },
				{ url: '/rfqs/government-recently-released', title: 'Recently Released' },
				{ url: '/rfqs/government-expiring-soon', title: 'Expiring Soon' },
				{ url: '/rfqs/government-contracts-bid', title: 'Contracts Bid' },
				{ url: '/rfqs/government-flagged', title: 'Flagged' },
				{ url: '/rfqs/government-all-contracts', title: 'All Contracts' }
			]
		}
	];

	async function assignFollowUp(person, rfq) {
		// update response status to following up and then assign form
		const status = [...rfq.status.filter((s) => s != 'response:waiting'), 'response:following_up'];

		const { error } = await supabase.from('rfqs').update({ status }).eq('id', rfq.id);

		if (person == 'cindy') {
			await supabase.from('forms').insert({
				form: 'd3dfeff5-ad61-4948-b028-b4d447cae57f',
				commercial: true,
				rfq: rfq.id,
				assignee: '35009618-f673-432a-9113-664874e195af' // cindy
			});
		} else if (person == 'tom') {
			await supabase.from('forms').insert({
				form: 'd3dfeff5-ad61-4948-b028-b4d447cae57f',
				commercial: true,
				rfq: rfq.id,
				assignee: 'c8905ffa-50a4-4d04-bbe3-e7a26371c78d' // tom
			});
		}
	}

	$: if (rfqs && sorted) {
		let temp = [...rfqs];
		temp?.sort((a, b) => {
			if (a.matching_rule.name < b.matching_rule.name) {
				return -1;
			}
			if (a.matching_rule.name > b.matching_rule.name) {
				return 1;
			}
			return 0;
		});

		rows = temp;
	} else {
		rows = rfqs;
	}
</script>

<svelte:head>
	<title>RFQs - Sales Patriot</title>
</svelte:head>

<div>
	<div class="flex flex-row h-14 items-center justify-between mx-2">
		<Views {views} />
		{#if $page.url.pathname.includes('government')}
			<div></div>
		{:else}
			<div class="flex flex-row items-center">
				<a
					class="text-sm p-2 bg-neutral-100 rounded-md mr-4"
					href={`${$page.url.origin}/commercial-new`}
					target="_blank">+ RFQ</a
				>
			</div>
		{/if}
		<!-- <p class="text-xs">Last Updated: Today 8:30 AM</p> -->
	</div>

	<div class="max-h-[calc(100vh-3.5rem)]">
		{#if rfqs}
			{#if $page.url.pathname.includes('government')}
				<GovTable data={rows} columns={getColumns($page.url.pathname)} enableSort bind:sorted />
			{:else}
				<ComTable data={rfqs} columns={getTableColumns($page.url.pathname)} {assignFollowUp} />
			{/if}
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
	</div>
</div>
