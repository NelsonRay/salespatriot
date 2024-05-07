<script>
	// @ts-nocheck
	import Currency from '$lib/components/form/Currency.svelte';
	import DateInput from '$lib/components/form/DateInput.svelte';
	import StatusSelect from '$lib/components/form/StatusSelect.svelte';
	import Textarea from '$lib/components/form/Textarea.svelte';
	import { hasErrors } from '$lib/utils/errors';

	import { commercialTags } from '$lib/tags';
	import { commercialAwardModal } from '$lib/validation';

	export let open;
	export let submitCallback;

	export let values;

	let errors;
	let isLoading = false;

	async function handleSubmit() {
		const results = commercialAwardModal()?.safeParse(values);
		errors = results?.error?.issues;

		if (!errors) {
			isLoading = true;
			await submitCallback(values);
		}
	}
</script>

{#if open}
	<div
		class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
	>
		<div class="relative w-1/3 max-h-2/3 my-6 mx-auto max-w-3xl">
			<!--content-->
			<div
				class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
			>
				<!--header-->
				<div class="flex items-start justify-between p-5 rounded-t">
					<h3 class="text-3xl text-gray-600 font-semibold">Award Status</h3>
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
				<div class="flex flex-col items-center space-y-3">
					<div>
						<StatusSelect tags={commercialTags} status="response" bind:value={values.status} />
						{#if errors?.status}
							<label for="trim" class="label">
								<span class="label-text-alt text-error">{errors?.status[0]}</span>
							</label>
						{/if}
					</div>

					{#if values?.status?.includes('response:placed_order')}
						<div class="flex flex-col">
							{#each values.rfqs_parts as rfqs_part, i}
								<div
									class="flex flex-row justify-between items-center space-x-5 bg-neutral-100 p-3 rounded-lg"
								>
									<p>{rfqs_part.part.number}</p>
									<div>
										<p class="mb-1 text-sm">Quantity:</p>
										<Currency bind:value={rfqs_part.quantity_ordered} width={'w-24'} />
										{#if hasErrors(errors, ['rfqs_parts', i, 'quantity_ordered'])}
											<label for="trim" class="label">
												<span class="label-text-alt text-error">Required</span>
											</label>
										{/if}
									</div>
									<div>
										<p class="mb-1 text-sm">Unit Price:</p>
										<Currency bind:value={rfqs_part.unit_price_ordered} width={'w-24'} />
										{#if hasErrors(errors, ['rfqs_parts', i, 'unit_price_ordered'])}
											<label for="trim" class="label">
												<span class="label-text-alt text-error">Required</span>
											</label>
										{/if}
									</div>
								</div>
							{/each}
						</div>
						<div class="flex flex-row space-x-5">
							<div>
								<p class="mb-1 text-sm">Ordered Date</p>
								<DateInput bind:value={values.date_ordered} preventFutureDates={false} />
								{#if hasErrors(errors, ['date_ordered'])}
									<label for="trim" class="label">
										<span class="label-text-alt text-error">Required</span>
									</label>
								{/if}
							</div>
							<div>
								<p class="mb-1 text-sm">Due Date</p>
								<DateInput bind:value={values.due_date} preventFutureDates={false} />
								{#if hasErrors(errors, ['due_date'])}
									<label for="trim" class="label">
										<span class="label-text-alt text-error">Required</span>
									</label>
								{/if}
							</div>
						</div>
						<div class="mx-5">
							<p class="mb-1 text-sm">Order Notes</p>
							<Textarea autoCollapse={false} bind:value={values.order_notes} />
						</div>
					{/if}
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
