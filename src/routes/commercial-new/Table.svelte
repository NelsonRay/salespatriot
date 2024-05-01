<script>
	// @ts-nocheck
	import { formatMonthDayYearDate } from '$lib/helpers';

	export let data;

	const columns = [
		{ type: 'position', header: '#' },
		{ type: 'products', header: 'Products' },
		{ type: 'field', field: 'received_at', header: 'Date Received' }
	];

	export function tableFieldMapper(obj, column) {
		let value;

		if (column.type === 'products') {
			value = obj?.rfqs_products?.map((p) => p.product.number).join(', ');
		} else if (column.type === 'field') {
			value = formatMonthDayYearDate(obj?.[column.field]);
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
				<tr class="hover:bg-neutral-100">
					{#each columns as column}
						{#if column.type === 'position'}
							<td class="text-center"> {index + 1}</td>
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
