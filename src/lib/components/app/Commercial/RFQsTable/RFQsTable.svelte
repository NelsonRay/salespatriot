<script>
	// @ts-nocheck

	export let data;

	function getQuantities(rfqs_product) {
		return rfqs_product?.rfq?.rfqs_products
			?.filter((p) => p?.id === rfqs_product?.id)[0]
			?.rfqs_products_quantities?.map((q) => q?.quantity)
			?.join(', ');
	}

	function isStatusComplete(rfqs_product) {
		return rfqs_product.rfq.status?.includes('purchasing:complete');
	}
</script>

<div class="flex flex-col">
	<p class="mb-2 font-semibold">RFQs:</p>
	<article
		class="bg-white w-[100%] overflow-scroll scrollbar-gutter-stable text-sm"
		style="direction: ltr;"
	>
		<table class="text-left w-[100%] border-separate border-spacing-0 overflow-scroll">
			<thead class="h-[32px] sticky bg-white" style="inset-block-start: 0;">
				{#each ['Customer', 'Received At', 'Quantities', 'Purchasing Status'] as header}
					<th>{header}</th>
				{/each}
			</thead>
			<tbody>
				{#each data as rfqs_product}
					<tr class="hover:bg-neutral-100">
						<td>
							<a href={window.location.origin + '/rfq/' + rfqs_product.rfq.id} target="_blank"
								>{rfqs_product.rfq.customer.name ?? ''}</a
							>
						</td>
						<td>{rfqs_product.rfq.received_at ?? ''}</td>
						<td>{getQuantities(rfqs_product) ?? ''}</td>
						<td>
							{#if isStatusComplete(rfqs_product)}
								<div class="p-2 rounded-md inline-block bg-green-300 text-xs">Complete</div>
							{:else}
								<div class="p-2 rounded-md inline-block bg-yellow-300 text-xs">In Progress</div>
							{/if}
						</td>
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
