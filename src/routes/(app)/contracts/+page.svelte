<script>
	// @ts-nocheck
	import { table_mapper } from '$lib/mappers';
	import { onMount } from 'svelte';

	export let data = [];

	$: ({ supabase, session } = data);

	let solicitations_matched = [];

	async function loadData() {
		const { data, error } = await supabase
			.from('solicitations_matched')
			.select(
				'*, solicitation(*), opportunity_status(*), engineering_status(*), bom_status(*), purchasing_status(*), labor_status(*), review_status(*), bid_status(*)'
			)
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
		'solicitation.number',
		'solicitation.description',
		'solicitation.expires_on',
		'opportunity_status',
		'engineering_status',
		'bom_status',
		'purchasing_status',
		'labor_status',
		'review_status',
		'bid_status'
	];

	function getTagClass(color) {
		switch (color) {
			case 'green':
				return 'bg-green-400';
			case 'blue':
				return 'bg-blue-400';
			case 'red':
				return 'bg-red-400';
			case 'yellow':
				return 'bg-yellow-400';
			default:
				return '';
		}
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
					<th>{table_mapper(undefined, column).header}</th>
				{/each}
			</thead>

			<tbody>
				{#each solicitations_matched as solicitation_matched}
					<tr>
						{#each columns as column, i}
							{#if column.includes('status')}
								<td>
									<div
										class={getTagClass(solicitation_matched[column]?.color) +
											' p-2 rounded-md inline-block'}
									>
										{solicitation_matched[column]?.name ?? ''}
									</div>
								</td>
							{:else}
								<td>{table_mapper(solicitation_matched, column).value ?? ''}</td>
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
		padding: 4px;
	}
</style>
