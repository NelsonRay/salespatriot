<script>
	// @ts-nocheck
	import StatusSelect from '$lib/components/form/StatusSelect.svelte';
	import Textarea from '$lib/components/form/Textarea.svelte';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import Boolean from '$lib/components/form/Boolean.svelte';
	import Currency from '$lib/components/form/Currency.svelte';
	import Arrow from '$lib/icons/Arrow.svg';
	import Info from '$lib/components/app/Commercial/Info/Info.svelte';
	import Products from '$lib/components/app/Commercial/Products/Products.svelte';
	import { capitalizeFirstLetter, formatCurrency } from '$lib/helpers';

	export let data;
	export let values;
	export let form = null;
	export let handleSubmit;
	export let isSubmitting;
	export let errors;

	function goBack() {
		window.location.href = `${window.location.origin}`;
	}

	function getFormTitle(type) {
		return `${type
			.split('_')
			.map((e) => capitalizeFirstLetter(e))
			.join(' ')} Form`;
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
				{#if !form.type}
					<Info {data} />

					<div>
						<Products
							bind:products={values.rfqs_products}
							showRemove={form === null}
							showPurchasing={['purchasing', 'final_pricing', null].includes(form?.type)}
							showPricing={['final_pricing', null].includes(form?.type)}
						/>
					</div>
				{/if}
				{#if form.type === 'labor'}
					<div>
						<p class="mb-1">Product Number</p>
						<TextInput value={data?.product?.number} disabled fullWidth={false} />
					</div>
					<div>
						<p class="mb-1">Product NSN</p>
						<TextInput value={data?.product?.nsn} disabled fullWidth={false} />
					</div>
					<div>
						<p class="mb-1">Cross Ref</p>
						<TextInput value={data?.product?.cross_reference} disabled fullWidth={false} />
					</div>
				{/if}
			</div>
		</div>
		<div class="two bg-neutral-50">
			<div class="flex flex-col p-6 space-y-5">
				<p class="text-gray-400 mb-2 font-medium">{getFormTitle(form?.type)}</p>
				{#if form.type === 'labor'}
					<div class="mb-2">
						<p class="mb-1 text-sm">Labor Minutes</p>
						<Currency bind:value={values.labor_minutes} />
						{#if errors?.labor_minutes}
							<label for="trim" class="label">
								<span class="label-text-alt text-error">{errors?.labor_minutes[0]}</span>
							</label>
						{/if}
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
