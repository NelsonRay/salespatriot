<script>
	// @ts-nocheck

	import { govTags } from '$lib/tags.js';
	import { tableFieldMapper } from '$lib/mappers';
	import { getMatchingClass, getPartnerColor, getSetAsideColor } from '$lib/helpers.js';

	export let data;
	export let columns;
	export let blockEditing = false;

	function getStatusColor(status) {
		if (!status) return '';
		let color = '';

		switch (govTags[status.toString().split(':')[0]][status.toString().split(':')[1]].color) {
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
				color = 'bg-gray-300';
				break;
		}
		return color;
	}

	function getStatusName(status) {
		if (!status) return '';
		return govTags[status.toString().split(':')[0]][status.toString().split(':')[1]].name;
	}

	function navToSolicitation(id) {
		if (blockEditing) return;
		window.location.href = `${window.location.origin}/solicitation/${id}`;
	}
</script>

<article
	class="bg-white w-[100%] h-full overflow-scroll scrollbar-gutter-stable"
	style="direction: ltr;"
>
	<table class="text-left w-[100%] border-separate border-spacing-0 overflow-scroll text-xs">
		<thead class="h-[32px] sticky bg-white" style="inset-block-start: 0;">
			{#each columns as column}
				<th class={column.type === 'position' ? 'text-center' : ''}
					>{tableFieldMapper(undefined, column).header}</th
				>
			{/each}
		</thead>
		<tbody>
			{#each data as obj, index (obj.id)}
				<tr on:click={() => navToSolicitation(obj.id)} class="hover:bg-neutral-100">
					{#each columns as column, i}
						{#if column.type === 'position'}
							<td class="text-center"> {index + 1}</td>
						{:else if column.type === 'status'}
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
							<td>
								{#if tableFieldMapper(obj, column).value}
									<div
										class="p-2 rounded-md inline-block {getMatchingClass(
											tableFieldMapper(obj, column).value
										)}"
									>
										{tableFieldMapper(obj, column).value ?? ''}
									</div>
								{/if}</td
							>
						{:else if column.type === 'bid_partner'}
							<td>
								{#if tableFieldMapper(obj, column).value}
									<div
										class="p-2 rounded-md inline-block {getPartnerColor(
											tableFieldMapper(obj, column).value
										)}"
									>
										{tableFieldMapper(obj, column).value ?? ''}
									</div>
								{/if}</td
							>
						{:else if column.type === 'set_aside'}
							<td>
								{#if tableFieldMapper(obj, column).value}
									<div
										class="p-2 rounded-md inline-block {getSetAsideColor(
											tableFieldMapper(obj, column).value
										)}"
									>
										{tableFieldMapper(obj, column).value ?? ''}
									</div>
								{/if}
							</td>
						{:else if column.type === 'link'}
							<td>
								{#if tableFieldMapper(obj, column).value}
									<a
										href={tableFieldMapper(obj, column).value}
										target="_blank"
										class="mb-5 text-blue-500">URL</a
									>
								{/if}
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
