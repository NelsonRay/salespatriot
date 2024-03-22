<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { govTags } from '$lib/tags.js';
	import Views from '$lib/components/app/Views/Views.svelte';
	import { page } from '$app/stores';
	import { formatDate, solColumns } from '$lib/helpers.js';
	import Table from '$lib/components/app/Government/Table/Table.svelte';
	import { getColumns } from '$lib/table.js';

	export let data;
	export let isAdmin = false;

	$: ({ supabase, session } = data);

	let solicitations_matched = null;
	let isMounted = false;

	page.subscribe((p) => {
		if (isMounted) {
			solicitations_matched = null;
			loadData(p.url.pathname);
		}
	});

	async function loadData(pathname) {
		let query = supabase
			.from('solicitations_matched')
			.select(`*, solicitation!inner(${solColumns}, nsn(id, products(*))), matching_rule(*)`);

		switch (pathname) {
			case '/sales/government/bidding-funnel':
				query = query.eq('removed', false);

				break;
			case '/sales/government/recently-released':
				query = query
					.order('solicitation(issued_on)', {
						ascending: false
					})
					.limit(100);
				break;
			case '/sales/government/expiring-soon':
				let yesterday = new Date();
				yesterday.setDate(new Date().getDate() - 1);

				query = query
					.filter('solicitation.expires_on', 'gt', formatDate(yesterday))
					.order('solicitation(expires_on)', {
						ascending: true
					});
				break;
			case '/sales/government/contracts-bid':
				query = query.filter('status', 'cs', `{"${govTags.bid.bid.key}"}`);
				break;
			case '/sales/government/flagged':
				query = query.eq('flagged', true);
				break;
			default:
				break;
		}

		let { data, error } = await query;

		const {
			data: { admin }
		} = await supabase.from('users').select('admin').eq('id', session.user.id).limit(1).single();

		isAdmin = admin;

		switch (pathname) {
			case '/sales/government/bidding-funnel':
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
								govTags[status][a.status.filter((e) => e.includes(status))[0].split(':')[1]].level;
						}

						if (b.status.some((e) => e.includes(status))) {
							blevel =
								govTags[status][b.status.filter((e) => e.includes(status))[0].split(':')[1]].level;
						}

						return alevel < blevel ? -1 : 1;
					});
				}
				break;
			case '/sales/government/contracts-bid':
				data = data.sort(function (a, b) {
					let alevel = 10;
					let blevel = 10;
					if (a.status.some((e) => e.includes('award'))) {
						alevel =
							govTags['award'][a.status.filter((e) => e.includes('award'))[0].split(':')[1]].level;
					}

					if (b.status.some((e) => e.includes('award'))) {
						blevel =
							govTags['award'][b.status.filter((e) => e.includes('award'))[0].split(':')[1]].level;
					}

					return alevel < blevel ? -1 : 1;
				});
				break;
		}
		solicitations_matched = data;
	}

	onMount(() => {
		if (session) {
			loadData($page.url.pathname);
		}
		isMounted = true;
	});

	const views = {
		'/sales/government/bidding-funnel': 'Bidding Funnel',
		'/sales/government/recently-released': 'Recently Released',
		'/sales/government/expiring-soon': 'Expiring Soon',
		'/sales/government/contracts-bid': 'Contracts Bid',
		'/sales/government/flagged': 'Flagged',
		'/sales/government/all-contracts': 'All Contracts'
	};
</script>

<svelte:head>
	<title>Government - Sales Patriot</title>
</svelte:head>

<div class="relative top-0">
	<div class="flex flex-row h-14 items-center justify-between mx-2">
		<div class="flex flex-row items-center">
			<Views {views} />
			<p class="font-semibold ml-4 text-sm">{views[$page.url.pathname]}</p>
		</div>
		<div class="flex flex-row items-center">
			<a
				href="/sales/commercial/active-rfqs"
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
		<!-- <p class="text-xs">Last Updated: Today 8:30 AM</p> -->
	</div>
</div>

{#if solicitations_matched}
	<Table
		data={solicitations_matched}
		columns={getColumns($page.url.pathname)}
		blockEditing={!isAdmin}
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
