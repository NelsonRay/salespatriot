<script>
	// @ts-nocheck
	import { formatDateWithTime } from '$lib/helpers';

	export let data;

	const columns = [
		{ type: 'position', header: '#' },
		{ type: 'part', field: 'number', header: 'Part Number' },
		{ type: 'product', field: 'number', header: 'Parent Number' },
		{ type: 'vendor', field: 'name', header: 'Supplier Name' },
		{ type: 'vendor', field: 'email', header: 'Email' },
		{ type: 'sent', header: 'Email Sent' },
		{ type: 'status', header: 'Status' }
	];

	export function tableFieldMapper(obj, column) {
		let value;

		if (column.type === 'position') {
		} else if (column.type === 'product') {
			value = obj?.boms_quote?.bom?.products?.[column?.field];
		} else if (column.type === 'part') {
			value = obj?.part?.[column?.field];
		} else if (column.type === 'vendor') {
			value = obj?.vendor?.[column?.field];
		} else if (column.type === 'status') {
			value = obj?.complete;
		} else if (column.type === 'sent') {
			value = obj?.created_at;

			if (value != null) {
				value = formatDateWithTime(value);
			} else {
				value = '';
			}
		}

		return { header: column.header, value };
	}

	function navToSupplier(id) {
		window.location.href = `/quotes/${id}`;
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
				<tr class="hover:bg-neutral-100" on:click={() => navToSupplier(obj.id)}>
					{#each columns as column}
						{#if column.type === 'position'}
							<td class="text-center"> {index + 1}</td>
						{:else if column.field === 'number'}
							<td>
								{tableFieldMapper(obj, column).value ?? ''}
							</td>
						{:else if column.type === 'status'}
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
