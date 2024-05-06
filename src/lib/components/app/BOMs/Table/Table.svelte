<script>
	// @ts-nocheck
	import { formatMonthDayYearDate } from '$lib/helpers';
	import Open from '$lib/icons/Open.svg';

	export let data;
	export let blockEditing = false;
	export let openNewTab = false;

	const columns = [
		{ type: 'position', header: '#' },
		{ type: 'part', field: 'number', header: 'Part Number' },
		{ type: 'part', field: 'description', header: 'Description' },
		{ type: 'field', field: 'quantity', header: 'Quantity' },
		{ type: 'field', field: 'complete', header: 'Status' },
		{ type: 'bom_started', header: 'BOM Started' }
	];

	export function tableFieldMapper(obj, column) {
		let value;

		if (column.type === 'part') {
			value = obj?.bom?.parts?.[column?.field];
		} else if (column.type === 'field') {
			value = obj?.[column.field];
		} else if (column.type === 'bom_started') {
			value = obj?.created_at;

			if (value != null) {
				value = formatMonthDayYearDate(value);
			} else {
				value = '';
			}
		}

		return { header: column.header, value };
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
				<tr class={!blockEditing ? 'hover:bg-neutral-100' : ''}>
					{#each columns as column}
						{#if column.type === 'position'}
							<td class="text-center"> {index + 1}</td>
						{:else if column.field === 'number'}
							<td>
								{#if !blockEditing}
									<a href={`/boms/${obj?.id}`} target={openNewTab ? '_blank' : '_self'}>
										<div class="flex flex-row justify-between pr-1 items-center">
											{tableFieldMapper(obj, column).value ?? ''}
											<img src={Open} alt="open" class="h-3 w-3" />
										</div>
									</a>
								{:else}
									{tableFieldMapper(obj, column).value ?? ''}
								{/if}
							</td>
						{:else if column.field === 'complete'}
							<td>
								{#if tableFieldMapper(obj, column).value}
									<div class="p-1 rounded-md inline-block bg-green-300 text-xs">Complete</div>
								{:else if tableFieldMapper(obj, column).value != null}
									<div class="p-1 rounded-md inline-block bg-yellow-300 text-xs">Waiting</div>{/if}
							</td>
						{:else}
							<td>
								<p>
									{tableFieldMapper(obj, column).value ?? ''}
								</p>
							</td>
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
