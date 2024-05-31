<script>
	// @ts-nocheck
	import { getCommercialStatusColor, getCommercialStatusName } from '$lib/helpers';
	import ValueCalculator from '$lib/components/form/ValueCalculator.svelte';
	import Edit from '$lib/icons/Edit.svg';

	export let data;
	export let reviewValues;
	export let showValueCalc = true;
	export let awardModalOpen;
	export let disableAwardEdit = false;

	function getQty(rfq) {
		let qty = 0;

		for (let p of rfq.rfqs_parts) {
			qty += p.rfqs_parts_quantities?.length ?? 0;
		}

		return qty;
	}
</script>

<div class="flex flex-col text-[14px] pr-2">
	<div class="flex flex-row mb-3 justify-between items-center">
		<p class="text-lg font-semibold">{data?.customer?.name + ' / ' + data?.received_at}</p>

		<div class="flex flex-row items-center space-x-3">
			{#if data.status?.filter((s) => s.includes('response'))?.length > 0}
				<div class="flex flex-row items-center p-2 rounded-md bg-neutral-50 space-x-3">
					<div class="flex flex-col">
						<div class="flex flex-row items-center space-x-2">
							<p>Award Status:</p>
							<div class="flex flex-row items-center space-x-2">
								<div
									class="p-1 px-2 rounded-md inline-block text-xs {getCommercialStatusColor(
										data.status?.filter((s) => s.includes('response'))[0]
									) ?? ''}"
								>
									{getCommercialStatusName(data.status?.filter((s) => s.includes('response'))[0]) ??
										''}
								</div>
							</div>
						</div>
					</div>
					{#if !disableAwardEdit}
						<button on:click={() => (awardModalOpen = true)}>
							<img src={Edit} alt="edit" class="h-4 w-4" />
						</button>
					{/if}
				</div>
			{/if}
			<!-- {#if solicitation_matched.removed_option}
					<div>
						<div class="flex flex-row items-center p-2 rounded-md bg-neutral-50 space-x-3">
							<p>Removed:</p>
							<div class="flex flex-row items-center space-x-2">
								<div
									class="p-1 px-2 rounded-md inline-block text-xs {getRemoveOptionClass(
										solicitation_matched.removed_option
									) ?? ''}"
								>
									{getRemoveOptionName(solicitation_matched.removed_option) ?? ''}
								</div>
								<button on:click={() => (removeModalOpen = true)}>
									<img src={Edit} alt="edit" class="h-4 w-4" />
								</button>
							</div>
						</div>
					</div>
				{:else}
					<div>
						<button
							class="flex flex-row items-center p-2 rounded-md bg-red-400 space-x-2"
							on:click={() => (removeModalOpen = true)}
						>
							<p class="text-white text-sm">Remove</p>
							<img src={Remove} alt="edit" class="h-5 w-5" />
						</button>
					</div>
				{/if} -->
		</div>
	</div>

	<div class="flex flex-row mb-3 space-x-5 items-start">
		<div>
			<div class="flex flex-col space-y-2 bg-neutral-50 shadow-sm rounded-md p-3">
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
						<p>{data?.rfqs_parts?.length}</p>
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
