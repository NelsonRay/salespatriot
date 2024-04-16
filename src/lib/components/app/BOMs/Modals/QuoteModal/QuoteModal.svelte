<script>
	// @ts-nocheck
	import Textarea from '$lib/components/form/Textarea.svelte';
	import Currency from '$lib/components/form/Currency.svelte';
	import DateInput from '$lib/components/form/DateInput.svelte';
	import { hasErrors } from '$lib/utils/errors';
	import { quoteForm } from '$lib/validation.js';

	export let open;
	export let submitCallback;
	export let selectedBomPartForQuote;

	let quote = {
		parts_quotes_quantities: [{}]
	};
	let errors;
	let isLoading = false;

	async function handleSubmit() {
		const results = quoteForm()?.safeParse(quote);
		errors = results?.error?.issues;

		if (!errors) {
			isLoading = true;
			await submitCallback(quote || null);
		}
	}

	function addQty() {
		quote.parts_quotes_quantities = [...(quote.parts_quotes_quantities ?? []), {}];
	}
</script>

{#if open}
	<div
		class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
	>
		<div class="relative w-1/3 my-6 mx-auto max-w-3xl">
			<!--content-->
			<div
				class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
			>
				<!--header-->
				<div class="flex items-start justify-between p-5 rounded-t">
					<h3 class="text-3xl text-gray-600 font-semibold">
						{selectedBomPartForQuote?.part?.number}
					</h3>
					<button
						class="p-1 ml-auto bg-transparent border-0 text-gray-500 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
						on:click={() => (open = false)}
					>
						<span
							class="bg-transparent text-gray-500 opacity-4 h-6 w-6 text-2xl block outline-none focus:outline-none"
						>
							×
						</span>
					</button>
				</div>

				<div class="mx-4">
					<div class="p-4 space-y-3">
						{#each quote?.parts_quotes_quantities ?? [] as qty, index}
							<div class="flex flex-row space-x-5">
								<div>
									<div>
										<p class="mb-1">Quantity</p>
										<Currency bind:value={qty.quantity} width={'w-24'} />
										{#if hasErrors(errors, ['parts_quotes_quantities', index, 'quantity'])}
											<label for="trim" class="label">
												<span class="label-text-alt text-error">Required</span>
											</label>
										{/if}
									</div>
								</div>
								<div>
									<p class="mb-1">Unit Price</p>
									<Currency bind:value={qty.unit_price} width={'w-24'} />
									{#if hasErrors(errors, ['parts_quotes_quantities', index, 'unit_price'])}
										<label for="trim" class="label">
											<span class="label-text-alt text-error">Required</span>
										</label>
									{/if}
								</div>
								<div>
									<p class="mb-1">Lead Time (Days)</p>
									<Currency bind:value={qty.lead_time} width={'w-24'} />
									{#if hasErrors(errors, ['parts_quotes_quantities', index, 'lead_time'])}
										<label for="trim" class="label">
											<span class="label-text-alt text-error">Required</span>
										</label>
									{/if}
								</div>
							</div>
						{/each}

						<button class="text-sm rounded-2xl p-2 bg-gray-100" on:click={addQty}>
							Add Quantity
						</button>

						<div class="flex flex-row space-x-5">
							<div>
								<p class="mb-1">Date Received:</p>
								<DateInput bind:value={quote.date_received} />
								{#if hasErrors(errors, ['date_received'])}
									<label for="trim" class="label">
										<span class="label-text-alt text-error">Required</span>
									</label>
								{/if}
							</div>
							<div>
								<p class="mb-1">Expiration Date:</p>
								<DateInput bind:value={quote.expiration_date} />
							</div>
						</div>

						<div class="flex flex-row space-x-5">
							<div>
								<p class="mb-1">Min Order Qty:</p>
								<Currency bind:value={quote.moq} width={'w-24'} />
							</div>

							<div>
								<p class="mb-1">Min Lot Charge:</p>
								<Currency bind:value={quote.moc} width={'w-24'} />
							</div>
						</div>

						<div>
							<p class="mb-1">Notes:</p>
							<Textarea bind:value={quote.notes} autoCollapse={false} />
						</div>
					</div>
				</div>

				<div class="flex items-center justify-center p-6">
					{#if !isLoading}
						<button
							class="btn px-6 py-2 rounded-md text-xs bg-white shadow-md"
							on:click={handleSubmit}
							>Submit
						</button>
					{:else}
						<span class="loading loading-spinner loading-md"></span>
					{/if}
				</div>
			</div>
		</div>
	</div>
	<div class="opacity-25 fixed inset-0 z-40 bg-black"></div>
{/if}
