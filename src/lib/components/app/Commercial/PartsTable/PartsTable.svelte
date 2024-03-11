<script>
	// @ts-nocheck

	import { commercialTableFieldMapper } from '$lib/mappers';

	export let data;

	const columns = [
		{ type: 'field', field: 'part_number' },
		{ type: 'field', field: 'nsn' },
		{ type: 'field', field: 'cross_reference' },
		{ type: 'field', field: 'quantities' },
		{ type: 'field', field: 'material_cost' },
		{ type: 'field', field: 'lead_time' },
		{ type: 'field', field: 'labor_minutes' },
		{ type: 'field', field: 'final_pricing' }
	];
</script>

<article
	class="bg-white w-[100%] h-full overflow-scroll scrollbar-gutter-stable"
	style="direction: ltr;"
>
	<table class="text-left w-[100%] border-separate border-spacing-0 overflow-scroll text-xs">
		<thead class="h-[32px] sticky bg-white" style="inset-block-start: 0;">
			{#each columns as column}
				<th>{commercialTableFieldMapper(undefined, column).header}</th>
			{/each}
		</thead>
		<tbody>
			{#each data as obj (obj.id)}
				<tr on:click={() => {}} class="hover:bg-neutral-100">
					{#each columns as column, i}
						<td>{commercialTableFieldMapper(obj, column).value ?? ''}</td>
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
