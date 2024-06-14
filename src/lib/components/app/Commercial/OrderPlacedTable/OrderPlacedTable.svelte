<script>
	// @ts-nocheck

	import { commercialTableFieldMapper } from '$lib/mappers';

	export let data;

	function getOrderedParts(rfqs_parts) {
		return rfqs_parts.filter((p) => !!p.quantity_ordered);
	}

	const columns = [
		{ type: 'position', header: '#' },
		{ type: 'field', field: 'part.number', header: 'Part' },
		{ type: 'field', field: 'nsn', header: 'NSN' },
		{ type: 'field', field: 'cross_reference', header: 'Cross Ref' },
		{ type: 'field', field: 'quantity_ordered', header: 'Quantity Ordered' },
		{ type: 'field', field: 'unit_price_ordered', header: 'Unit Price' }
	];
</script>

<article
	class="bg-white w-[100%] h-full overflow-scroll scrollbar-gutter-stable"
	style="direction: ltr;"
>
	<table class="text-left w-[100%] border-separate border-spacing-0 overflow-scroll text-xs">
		<thead class="h-[32px] sticky bg-white" style="inset-block-start: 0;">
			{#each columns as column}
				<th>{column.header}</th>
			{/each}
		</thead>
		<tbody>
			{#each getOrderedParts(data) as obj (obj.id)}
				<tr on:click={() => {}} class="hover:bg-neutral-100">
					{#each columns as column, i}
						{#if column.type == 'position'}
							<td>{i + 1}</td>
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
