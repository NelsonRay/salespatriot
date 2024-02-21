<script>
	// @ts-nocheck

	import { tags } from '$lib/tags.js';
	import { tableFieldMapper } from '$lib/mappers';
	import { getMatchingClass } from '$lib/helpers.js';

	export let data;

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
		let color = '';

		switch (tags[status.toString().split(':')[0]][status.toString().split(':')[1]].color) {
			case 'green':
				color = 'bg-green-400';
				break;
			case 'yellow':
				color = 'bg-yellow-400';
				break;
			case 'red':
				color = 'bg-red-400';
				break;
			case 'blue':
				color = 'bg-blue-400';
				break;
			case 'gray':
				color = 'bg-gray-500';
				break;
		}
		return color;
	}

	function getStatusName(status) {
		if (!status) return '';
		return tags[status.toString().split(':')[0]][status.toString().split(':')[1]].name;
	}

	function navToSolicitation(id) {
		window.location.href = `${window.location.origin}/solicitation/${id}`;
	}
</script>

<article
	class="bg-white w-[100%] h-full px-2 overflow-scroll scrollbar-gutter-stable"
	style="direction: ltr;"
>
	<table class="text-left w-[100%] border-separate border-spacing-0 overflow-scroll text-xs">
		<thead class="h-[32px] sticky bg-white" style="inset-block-start: 0;">
			{#each columns as column}
				<th>{tableFieldMapper(undefined, column).header}</th>
			{/each}
		</thead>
		<tbody>
			{#each data as obj (obj.id)}
				<tr on:click={() => navToSolicitation(obj.id)} class="hover:bg-neutral-100">
					{#each columns as column, i}
						{#if column.type === 'status'}
							<td>
								<div
									class="p-2 rounded-md inline-block {getStatusColor(
										tableFieldMapper(obj, column).value
									) ?? ''}"
								>
									{getStatusName(tableFieldMapper(obj, column).value) ?? ''}
								</div>
							</td>
						{:else if column.type === 'matching_rule'}
							<td
								><div
									class="p-2 rounded-md inline-block {getMatchingClass(
										tableFieldMapper(obj, column).value
									)}"
								>
									{tableFieldMapper(obj, column).value ?? ''}
								</div></td
							>
						{:else if column.type === 'link'}
							<td>
								<a
									href={tableFieldMapper(obj, column).value ?? ''}
									target="_blank"
									class="mb-5 text-blue-500">URL</a
								>
							</td>
						{:else}
							<td>{tableFieldMapper(obj, column).value ?? ''}</td>
						{/if}
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</article>

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
