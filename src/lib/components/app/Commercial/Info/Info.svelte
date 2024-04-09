<script>
	// @ts-nocheck

	import ValueCalculator from '$lib/components/form/ValueCalculator.svelte';

	export let data;
	export let reviewValues;
	export let showValueCalc = true;

	function getQty(rfq) {
		let qty = 0;

		for (let p of rfq.rfqs_products) {
			qty += p.rfqs_products_quantities?.length ?? 0;
		}

		return qty;
	}
</script>

<div class="flex flex-col text-[14px] pr-2">
	<div class="flex flex-row mb-3 space-x-5 items-start">
		<div>
			<div class="flex flex-col space-y-2 bg-neutral-50 shadow-sm rounded-md p-3">
				<div class="mb-3">
					<div class="flex flex-row items-center space-x-2">
						<p class="text-lg font-semibold">{data?.customer?.name + ' / ' + data?.received_at}</p>
					</div>
				</div>

				<div>
					<div class="flex flex-row space-x-1">
						<p class="text-gray-400">Customer Name:</p>
						<p>
							{data?.customer?.name}
						</p>
					</div>

					<div class="flex flex-row space-x-1">
						<p class="text-gray-400">Customer #:</p>
						<p>
							{data?.customer?.customer_number ?? 'N/A'}
						</p>
					</div>

					<div class="flex flex-row space-x-1">
						<p class="text-gray-400">Person Name:</p>
						<p>
							{data?.person_name ?? 'N/A'}
						</p>
					</div>

					<div class="flex flex-row space-x-1">
						<p class="text-gray-400">Customer Email:</p>
						<p>
							{data?.email_address ?? 'N/A'}
						</p>
					</div>

					<div class="flex flex-row space-x-1">
						<p class="text-gray-400">Phone Number:</p>
						<p>
							{data?.phone_number ?? 'N/A'}
						</p>
					</div>
				</div>

				<div>
					<div class="flex flex-row space-x-1">
						<p class="text-gray-400">Date Received:</p>
						<p>
							{data?.received_at}
						</p>
					</div>
					<div class="flex flex-row space-x-1">
						<p class="text-gray-400">Quote Number:</p>
						<p>
							{data?.quote_number ? `#${data?.quote_number}` : 'N/A'}
						</p>
					</div>
				</div>

				<div>
					<div class="flex flex-row space-x-1">
						<p class="text-gray-400"># of Parts:</p>
						<p>{data?.rfqs_products?.length}</p>
					</div>

					<div class="flex flex-row space-x-1">
						<p class="text-gray-400"># of Quantities:</p>
						<p>{getQty(data)}</p>
					</div>
				</div>

				<div class="h-8"></div>
			</div>
		</div>
		{#if showValueCalc}
			<ValueCalculator show values={reviewValues} />
		{/if}
	</div>
</div>
