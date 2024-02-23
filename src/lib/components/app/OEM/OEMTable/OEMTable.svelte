<script>
	// @ts-nocheck

	import { oemTags } from '$lib/tags.js';
	import { oemTableFieldMapper } from '$lib/mappers';
	import { getMatchingClass } from '$lib/helpers.js';

	export let data;

	const columns = [
		{ type: 'name' },
		{ type: 'value' },
		{ type: 'status', status: 'purchasing' },
		{ type: 'status', status: 'labor' },
		{ type: 'status', status: 'final_pricing' },
		{ type: 'status', status: 'enter_quote' },
		{ type: 'status', status: 'send_quote' },
		{ type: 'status', status: 'response' },
		{ type: 'field', field: 'date_received' },
		{ type: 'field', field: 'requested_return_date' },
		{ type: 'field', field: 'quote_number' },
		{ type: 'field', field: 'customer.name' },
		{ type: 'field', field: 'customer.email_addresses' }
	];

	function getStatusColor(status) {
		if (!status) return '';
		let color = '';

		switch (oemTags[status.toString().split(':')[0]][status.toString().split(':')[1]].color) {
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
		return oemTags[status.toString().split(':')[0]][status.toString().split(':')[1]].name;
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
				<th>{oemTableFieldMapper(undefined, column).header}</th>
			{/each}
		</thead>
		<tbody>
			{#each data as obj (obj.id)}
				<tr on:click={() => {}} class="hover:bg-neutral-100">
					{#each columns as column, i}
						{#if column.type === 'status'}
							<td>
								<div
									class="p-2 rounded-md inline-block {getStatusColor(
										oemTableFieldMapper(obj, column).value
									) ?? ''}"
								>
									{getStatusName(oemTableFieldMapper(obj, column).value) ?? ''}
								</div>
							</td>
						{:else if column.type === 'matching_rule'}
							<td
								><div
									class="p-2 rounded-md inline-block {getMatchingClass(
										oemTableFieldMapper(obj, column).value
									)}"
								>
									{oemTableFieldMapper(obj, column).value ?? ''}
								</div></td
							>
						{:else if column.type === 'link'}
							<td>
								<a
									href={oemTableFieldMapper(obj, column).value ?? ''}
									target="_blank"
									class="mb-5 text-blue-500">URL</a
								>
							</td>
						{:else}
							<td>{oemTableFieldMapper(obj, column).value ?? ''}</td>
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
