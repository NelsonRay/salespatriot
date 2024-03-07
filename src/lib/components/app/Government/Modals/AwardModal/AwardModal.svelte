<script>
	// @ts-nocheck
	import Currency from '$lib/components/form/Currency.svelte';
	import StatusSelect from '$lib/components/form/StatusSelect.svelte';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import { govTags } from '$lib/tags';
	import { awardModalValidation } from '$lib/validation';

	export let open;
	export let submitCallback;

	export let values;

	let errors;
	let isLoading = false;

	async function handleSubmit() {
		const results = awardModalValidation?.safeParse(values);
		errors = results?.error?.flatten()?.fieldErrors;

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
		<div class="relative w-1/4 my-6 mx-auto max-w-3xl">
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
						<StatusSelect tags={govTags} status="award" bind:value={values.status} />
						{#if errors?.status}
							<label for="trim" class="label">
								<span class="label-text-alt text-error">{errors?.status[0]}</span>
							</label>
						{/if}
					</div>

					{#if values?.status?.includes('award:won')}
						<p>Congratulations!</p>
					{:else if values?.status?.includes('award:lost')}
						<div>
							<p class="mb-1 text-sm">Company Awarded</p>
							<TextInput bind:value={values.company_awarded} fullWidth={false} />
							{#if errors?.company_awarded}
								<label for="trim" class="label">
									<span class="label-text-alt text-error">{errors?.company_awarded[0]}</span>
								</label>
							{/if}
						</div>
						<div>
							<p class="mb-1 text-sm">Total Price Won At</p>
							<Currency bind:value={values.price_won_at} />
							{#if errors?.price_won_at}
								<label for="trim" class="label">
									<span class="label-text-alt text-error">{errors?.price_won_at[0]}</span>
								</label>
							{/if}
						</div>
						<div>
							<p class="mb-1 text-sm">Date Awarded</p>
							<input
								type="date"
								class="w-52 rounded-md border p-1"
								bind:value={values.date_awarded}
							/>
							{#if errors?.date_awarded}
								<label for="trim" class="label">
									<span class="label-text-alt text-error">{errors?.date_awarded[0]}</span>
								</label>
							{/if}
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
