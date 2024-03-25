<script>
	// @ts-nocheck
	export let data;

	function getQty(product) {
		return product?.rfqs_products_quantities?.map((e) => e?.quantity).join(', ');
	}
</script>

<div class="flex flex-col">
	<p class="mb-2 font-semibold">Requested Parts:</p>
	<article
		class="bg-white w-[100%] overflow-scroll scrollbar-gutter-stable text-sm"
		style="direction: ltr;"
	>
		<table class="text-left w-[100%] border-separate border-spacing-0 overflow-scroll">
			<thead class="h-[32px] sticky bg-white" style="inset-block-start: 0;">
				{#each ['Part Number', 'NSN', 'Customer PN', 'Quantity'] as header}
					<th>{header}</th>
				{/each}
			</thead>
			<tbody>
				{#each data.rfqs_products as rfqs_product}
				<tr class="hover:bg-neutral-100">
						<td>{rfqs_product.product.number ?? ''}</td>
						<td>{rfqs_product.product.nsn ?? ''}</td>
						<td>{rfqs_product.product.cross_reference ?? ''}</td>
						<td>{getQty(rfqs_product)}</td>
					</tr>
					{/each}
			</tbody>
		</table>
	</article>
</div>

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
