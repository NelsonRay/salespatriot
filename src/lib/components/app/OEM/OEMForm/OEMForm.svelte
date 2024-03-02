<script>
	// @ts-nocheck
	import StatusSelect from '$lib/components/form/StatusSelect.svelte';
	import Textarea from '$lib/components/form/Textarea.svelte';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import Boolean from '$lib/components/form/Boolean.svelte';
	import Arrow from '$lib/icons/Arrow.svg';
	import OEMInfo from '$lib/components/app/OEM/OEMInfo/OEMInfo.svelte';
	import OEMParts from '$lib/components/app/OEM/OEMParts/OEMParts.svelte';
	import { oemTags } from '$lib/tags';

	export let data;
	export let values;
	export let form = null;
	export let handleSubmit;
	export let isSubmitting;

	function goBack() {
		window.location.href = `${window.location.origin}`;
	}
</script>

{#if values}
	<div class="parent">
		<div class="one pl-4 pt-4 overflow-auto">
			<div>
				<button on:click={goBack}>
					<div class="flex flex-row items-center p-2 rounded-md bg-neutral-50">
						<img src={Arrow} alt="1" class="h-5 w-5" />
						<p class="mb-[0.5px]">Go Back</p>
					</div>
				</button>
			</div>
			<div class="pl-2 pt-3 space-y-5">
				<OEMInfo {data} />

				<div>
					<OEMParts
						bind:parts={values.oem_rfqs_parts}
						showRemove={form === null}
						showPurchasing={['purchasing', 'final_pricing', null].includes(form?.type)}
						showLabor={['labor', 'final_pricing', null].includes(form?.type)}
						showPricing={['final_pricing', null].includes(form?.type)}
					/>
				</div>
			</div>
		</div>
		<div class="two bg-neutral-50">
			<div class="flex flex-col p-6 space-y-5">
				{#if form === null || form?.type === 'purchasing'}
					<div>
						<p class="text-gray-400 mb-2 font-medium">Purchasing Form</p>

						<p class="text-gray-500 mb-2 text-sm">
							Please provide material costs and lead times for each part.
						</p>

						<div class="mb-3">
							<p class="mb-1 text-sm">Resale</p>
							<Boolean bind:value={values.resale} />
						</div>

						<p class="mb-1 text-sm">Notes</p>
						<Textarea bind:value={values.purchasing_notes} />
					</div>
				{/if}

				{#if form === null || form?.type === 'labor'}
					<div>
						<p class="text-gray-400 mb-2 font-medium">Labor Form</p>
						<p class="text-gray-500 text-sm mb-3">Please provide labor minutes for each part.</p>

						<p class="mb-1 text-sm">Notes</p>
						<Textarea bind:value={values.labor_notes} />
					</div>
				{/if}

				{#if form === null || form?.type === 'final_pricing'}
					<div>
						<p class="text-gray-400 mb-2 font-medium">Final Pricing Form</p>
						<p class="text-gray-500 mb-3 text-sm">Please provide final pricing for each part:</p>

						<p class="mb-1 text-sm">Final Pricing Notes</p>
						<Textarea bind:value={values.final_pricing_notes} />
					</div>
				{/if}

				{#if form === null || form?.type === 'enter_quote'}
					<div>
						<p class="text-gray-400 mb-2 font-medium">Enter Quote Number Form</p>
						<div class="mb-3">
							<p class="mb-1 text-sm">Quote Number</p>
							<TextInput bind:value={values.quote_number} fullWidth={false} />
						</div>

						<p class="mb-1 text-sm">Notes</p>
						<Textarea bind:value={values.enter_quote_number_notes} />
					</div>
				{/if}

				{#if form === null || form?.type === 'send_quote'}
					<div>
						<p class="text-gray-400 mb-2 font-medium">Send Quote Form</p>
						<div class="mb-3">
							<p class="mb-1 text-sm">Quote Sent</p>
							<Boolean bind:value={values.quote_sent} />
						</div>

						<p class="mb-1 text-sm">Notes</p>
						<Textarea bind:value={values.send_quote_notes} />
					</div>
				{/if}

				{#if form === null || form?.type === 'response'}
					<div>
						<div class="mb-3">
							<p class="text-gray-400 mb-2 font-medium">Response Form</p>
							<p class="mb-1 text-sm">Response Status</p>
							<StatusSelect status="response" bind:value={values.status} tags={oemTags} />
						</div>

						<p class="mb-1 text-sm">Notes</p>
						<Textarea bind:value={values.response_notes} />
					</div>
				{/if}

				<div class="flex flex-row mt-5 items-center justify-center">
					{#if !isSubmitting}
						<button
							class="btn px-6 py-2 rounded-md text-xs bg-white shadow-md"
							on:click={handleSubmit}>Submit</button
						>
					{:else}
						<span class="loading loading-spinner loading-md"></span>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.parent {
		position: relative;
		width: 100%;
		height: 100vh;
		/* color: #fff; */
	}

	.one {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		width: 50%;
		display: flex;
		flex-direction: column;
		/* background: #333; */
	}
	.two {
		position: absolute;
		top: 0;
		left: 50%;
		bottom: 0;
		width: 50%;
		overflow-y: auto;
		/* background: #999; */
		/* height: 120%; */
	}
</style>
