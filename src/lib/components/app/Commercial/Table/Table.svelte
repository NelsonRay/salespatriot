<script>
	// @ts-nocheck
	import { commercialTableFieldMapper } from '$lib/mappers';
	import {
		getCommercialStatusColor,
		getMatchingClass,
		getCommercialStatusName
	} from '$lib/helpers.js';

	import Open from '$lib/icons/Open.svg';

	export let data;
	export let openNewTab = false;
	export let blockEditing = false;
	export let columns;
	export let assignFollowUp;

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
				<tr class="hover:bg-neutral-50">
					{#each columns as column}
						{#if column.type === 'position'}
							<td class="text-center">{index + 1}</td>
						{:else if column.type === 'status'}
							<td>
								<div
									class="p-2 rounded-md inline-block {getCommercialStatusColor(
										commercialTableFieldMapper(obj, column).value
									) ?? ''}"
								>
									{getCommercialStatusName(commercialTableFieldMapper(obj, column).value) ?? ''}
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
							<td on:click={() => navToCommercialRfq(obj.id)}>
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
						{:else if column.type == 'button'}
							<td>
								<button
									class="bg-neutral-200 rounded-lg p-2"
									on:click={() => assignFollowUp(column.person, obj)}
								>
									Assign
								</button>
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
