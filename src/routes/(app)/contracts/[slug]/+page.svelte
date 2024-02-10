<script>
	// @ts-nocheck
	import { tableFieldMapper } from '$lib/mappers';
	import { onMount } from 'svelte';
	import { tags } from '$lib/tags.js';
	import ContractViews from '$lib/components/app/ContractViews/ContractViews.svelte';
	import { page } from '$app/stores';
	import { formatDate } from '$lib/helpers.js';

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
			case '/contracts/bidding-funnel':
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
			case '/contracts/recently-released':
				query = query
					.order('solicitation(issued_on)', {
						ascending: false
					})
					.limit(100);
				break;
			case '/contracts/expiring-soon':
				let yesterday = new Date();
				yesterday.setDate(new Date().getDate() - 1);

				query = query
					.filter('solicitation.expires_on', 'gt', formatDate(yesterday))
					.order('solicitation(expires_on)', {
						ascending: true
					});
				break;
			default:
				break;
		}

		let { data, error } = await query;

		switch (pathname) {
			case '/contracts/bidding-funnel':
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

	const columns = [
		{ type: 'field', field: 'solicitation.number' },
		{ type: 'field', field: 'solicitation.description' },
		{ type: 'field', field: 'solicitation.expires_on' },
		{ type: 'formula', field: 'market_value' },
		{ type: 'field', field: 'solicitation.estimated_value' },
		{ type: 'status', status: 'opportunity' },
		{ type: 'status', status: 'engineering' },
		{ type: 'status', status: 'bom' },
		{ type: 'status', status: 'purchasing' },
		{ type: 'status', status: 'labor' },
		{ type: 'status', status: 'review' },
		{ type: 'status', status: 'bid' },
		{ type: 'field', field: 'solicitation.nsn.id', header: 'NSN' },
		{ type: 'matching_rule', status: 'matching_rule' },
		{ type: 'field', field: 'solicitation.set_aside' },
		{ type: 'field', field: 'solicitation.issued_on' },
		{ type: 'field', field: 'solicitation.quantity' },
		{ type: 'field', field: 'solicitation.quantity_units' },
		{ type: 'field', field: 'solicitation.first_article' },
		{
			type: 'field',
			field: 'solicitation.nsn.matching_nsns',
			array_selector: 'part_number',
			header: 'In-House PN'
		},
		{ type: 'field', field: 'solicitation.days_to_deliver' },
		{ type: 'field', field: 'bom_url' },
		{ type: 'field', field: 'price_per_unit' },
		{ type: 'link', field: 'solicitation.solicitation_url' },
		{ type: 'link', field: 'solicitation.tech_docs' }
	];

	function getStatusColor(status) {
		if (!status) return '';
		return tags[status.toString().split(':')[0]][status.toString().split(':')[1]].color;
	}

	function getStatusName(status) {
		if (!status) return '';
		return tags[status.toString().split(':')[0]][status.toString().split(':')[1]].name;
	}
</script>

<div class="relative top-0">
	<div class="flex flex-row h-14 items-center justify-between mx-2">
		<div class="flex flex-row items-center">
			<ContractViews />
			<p class="font-semibold ml-4">Bidding Funnel</p>
		</div>
		<p>Last Updated: Today 8:30 AM</p>
	</div>
</div>

{#if solicitations_matched}
	<article
		class="bg-white w-[100%] h-[95%] px-2 overflow-y-auto overflow-x-auto border-l-[0.2px] border-l-gainsboro"
		style="direction: ltr;"
	>
		<table class="text-left w-[100%] border-separate border-spacing-0">
			<thead class="h-[32px] sticky bg-white" style="inset-block-start: 0;">
				{#each columns as column}
					<th>{tableFieldMapper(undefined, column).header}</th>
				{/each}
			</thead>

			<tbody>
				{#each solicitations_matched as solicitation_matched}
					<tr>
						{#each columns as column, i}
							{#if column.type === 'status'}
								<td>
									<div
										class="p-2 rounded-md inline-block {getStatusColor(
											tableFieldMapper(solicitation_matched, column).value
										) ?? ''}"
									>
										{getStatusName(tableFieldMapper(solicitation_matched, column).value) ?? ''}
									</div>
								</td>
							{:else if column.type === 'matching_rule'}
								<td>{tableFieldMapper(solicitation_matched, column).value ?? ''}</td>
							{:else if column.type === 'link'}
								<td>
									<a
										href={tableFieldMapper(solicitation_matched, column).value ?? ''}
										target="_blank"
										class="mb-5 text-blue-500">URL</a
									>
								</td>
							{:else}
								<td>{tableFieldMapper(solicitation_matched, column).value ?? ''}</td>
							{/if}
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</article>
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

<style>
	th {
		border-bottom: 1px solid #e0e0e0;
		border-top: 1px solid #e0e0e0;
		white-space: nowrap;
		border: 0.2px solid gainsboro;
		padding: 4px;
	}

	td {
		border: 0.2px solid gainsboro;
		white-space: nowrap;
		padding: 4px;
	}
</style>
