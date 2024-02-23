<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { tags } from '$lib/tags.js';
	import Views from '$lib/components/app/Views/Views.svelte';
	import { page } from '$app/stores';
	import { formatDate } from '$lib/helpers.js';
	import Table from '$lib/components/app/Government/Table/Table.svelte';

	export let data;

	$: ({ supabase, session } = data);

	let solicitations_matched = null;
	let isMounted = false;

	page.subscribe((p) => {
		if (isMounted) {
			console.log(44);
			solicitations_matched = null;
			loadData(p.url.pathname);
		}
	});

	async function loadData(pathname) {
		let query = supabase
			.from('solicitations_matched')
			.select('*, solicitation!inner(*, nsn(id, matching_nsns(*)), expires_on), matching_rule(*)');

		switch (pathname) {
			case '/government/bidding-funnel':
				query = query
					.not('status', 'cs', `{"${tags.opportunity.not_pursue.key}"}`)
					.not('status', 'cs', `{"${tags.engineering.cannot_build.key}"}`)
					.not('status', 'cs', `{"${tags.bom.cannot_create.key}"}`)
					.not('status', 'cs', `{"${tags.purchasing.out_of_budget.key}"}`)
					.not('status', 'cs', `{"${tags.labor.not_within_time.key}"}`)
					.not('status', 'cs', `{"${tags.review.not_approved.key}"}`)
					.not('status', 'cs', `{"bid:bid"}`)
					.filter('solicitation.expires_on', 'gte', formatDate(new Date()))
					.eq('is_killed', false);

				break;
			case '/government/recently-released':
				query = query
					.order('solicitation(issued_on)', {
						ascending: false
					})
					.limit(100);
				break;
			case '/government/expiring-soon':
				let yesterday = new Date();
				yesterday.setDate(new Date().getDate() - 1);

				query = query
					.filter('solicitation.expires_on', 'gt', formatDate(yesterday))
					.order('solicitation(expires_on)', {
						ascending: true
					});
				break;
			case '/government/contracts-bid':
				query = query.filter('status', 'cs', `{"${tags.bid.bid.key}"}`);
				break;
			default:
				break;
		}

		let { data, error } = await query;

		switch (pathname) {
			case '/government/bidding-funnel':
				for (let status of [
					'opportunity',
					'engineering',
					'bom',
					'purchasing',
					'labor',
					'review',
					'bid'
				].reverse()) {
					data = data.sort(function (a, b) {
						let alevel = 10;
						let blevel = 10;
						if (a.status.some((e) => e.includes(status))) {
							alevel =
								tags[status][a.status.filter((e) => e.includes(status))[0].split(':')[1]].level;
						}

						if (b.status.some((e) => e.includes(status))) {
							blevel =
								tags[status][b.status.filter((e) => e.includes(status))[0].split(':')[1]].level;
						}

						return alevel < blevel ? -1 : 1;
					});
				}
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
		'/government/bidding-funnel': 'Bidding Funnel',
		'/government/recently-released': 'Recently Released',
		'/government/expiring-soon': 'Expiring Soon',
		'/government/contracts-bid': 'Contracts Bid',
		'/government/all-contracts': 'All Contracts'
	};
</script>

<div class="relative top-0">
	<div class="flex flex-row h-14 items-center justify-between mx-2">
		<div class="flex flex-row items-center">
			<Views {views} />
			<p class="font-semibold ml-4 text-sm">{views[$page.url.pathname]}</p>
		</div>
		<p class="text-xs">Last Updated: Today 8:30 AM</p>
	</div>
</div>

{#if solicitations_matched}
	<Table data={solicitations_matched} />
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
