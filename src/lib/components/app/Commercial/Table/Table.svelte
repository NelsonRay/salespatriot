<script>
	// @ts-nocheck

	import { commercialTags } from '$lib/tags.js';
	import { commercialTableFieldMapper } from '$lib/mappers';
	import { getMatchingClass } from '$lib/helpers.js';
	import Open from '$lib/icons/Open.svg';

	export let data;
	export let openNewTab = false;
	export let blockEditing = false;

	export let columns = [
		{ type: 'position' },
		{ type: 'name' },
		{ type: 'value' },
		{ type: 'status', status: 'purchasing' },
		{ type: 'status', status: 'labor' },
		{ type: 'status', status: 'final_pricing' },
		{ type: 'status', status: 'enter_quote' },
		{ type: 'status', status: 'send_quote' },
		{ type: 'status', status: 'response' },
		{ type: 'parts' },
		{ type: 'date', field: 'received_at' },
		{ type: 'date', field: 'requested_return_date' },
		{ type: 'date', field: 'sent_quote_timestamp' },
		{ type: 'field', field: 'quote_number' },
		{ type: 'field', field: 'customer.name' },
		{ type: 'email' }
	];

	function getStatusColor(status) {
		if (!status) return '';
		let color = '';

		switch (
			commercialTags[status.toString().split(':')[0]][status.toString().split(':')[1]].color
		) {
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
		return commercialTags[status.toString().split(':')[0]][status.toString().split(':')[1]].name;
	}

	function navToCommercialRfq(id) {
		window.location.href = `${window.location.origin}/rfq/${id}`;
	}
</script>

<article
	class="bg-white w-[100%] h-full overflow-scroll scrollbar-gutter-stable"
	style="direction: ltr;"
>
	<table class="text-left w-[100%] border-separate border-spacing-0 overflow-scroll text-xs">
		<thead class="h-[32px] sticky bg-white" style="inset-block-start: 0;">
			{#each columns as column, i}
				<th class={i === 0 ? 'text-center' : ''}
					>{commercialTableFieldMapper(undefined, column).header}</th
				>
			{/each}
		</thead>
		<tbody>
			{#each data as obj, index (obj.id)}
				<tr on:click={() => navToCommercialRfq(obj.id)} class="hover:bg-neutral-100">
					{#each columns as column, i}
						{#if column.type === 'position'}
							<td class="text-center">{index + 1}</td>
						{:else if column.type === 'status'}
							<td>
								<div
									class="p-2 rounded-md inline-block {getStatusColor(
										commercialTableFieldMapper(obj, column).value
									) ?? ''}"
								>
									{getStatusName(commercialTableFieldMapper(obj, column).value) ?? ''}
								</div>
							</td>
						{:else if column.type === 'matching_rule'}
							<td
								><div
									class="p-2 rounded-md inline-block {getMatchingClass(
										commercialTableFieldMapper(obj, column).value
									)}"
								>
									{commercialTableFieldMapper(obj, column).value ?? ''}
								</div></td
							>
						{:else if column.type === 'link'}
							<td>
								<a
									href={commercialTableFieldMapper(obj, column).value ?? ''}
									target="_blank"
									class="mb-5 text-blue-500">URL</a
								>
							</td>
						{:else if column.type === 'name'}
							<td>
								{#if !blockEditing}
									<a href={`/rfq/${obj?.id}`} target={openNewTab ? '_blank' : '_self'} class="">
										<div class="flex flex-row justify-between items-center">
											{commercialTableFieldMapper(obj, column).value ?? ''}
											<div class="h-3 w-3 ml-2">
												<img src={Open} alt="open" class="h-3 w-3" />
											</div>
										</div>
									</a>
								{:else}
									{commercialTableFieldMapper(obj, column).value ?? ''}
								{/if}
							</td>
						{:else}
							<td>{commercialTableFieldMapper(obj, column).value ?? ''}</td>
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
