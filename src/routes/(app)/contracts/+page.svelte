<script>
	// @ts-nocheck
	import { tableFieldMapper } from '$lib/mappers';
	import { onMount } from 'svelte';
	import { tags } from '$lib/tags.js';

	export let data = [];

	$: ({ supabase, session } = data);

	let solicitations_matched = [];

	async function loadData() {
		const { data, error } = await supabase
			.from('solicitations_matched')
			.select('*, solicitation(*, nsn(id, matching_nsns(*))), matching_rule(*)')
			.eq('firm', '6b289746-2b01-47af-a7d4-26a3920f75ca')
			.not('status', 'cs', '{"engineering:cannot_build"}')
			.not('status', 'cs', '{"opportunity:not_pursue"}');

		solicitations_matched = data;
	}

	onMount(() => {
		if (session) {
			loadData();
		}
	});

	let showViews = true;

	function toggleShowViews() {
		showViews = !showViews;
	}

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
			<button class="bg-neutral-100 p-2 rounded-sm font-medium" on:click={toggleShowViews}
				>Views</button
			>
			<p class="font-semibold ml-4">Bidding Funnel</p>
		</div>
		<p>Last Updated: Today 8:30 AM</p>
	</div>
</div>

{#if solicitations_matched}
	<article
		class="bg-white w-[100%] h-[95%] ml-2 overflow-y-auto overflow-x-auto border-l-[0.2px] border-l-gainsboro"
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
