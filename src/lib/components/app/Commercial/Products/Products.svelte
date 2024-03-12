<script>
	// @ts-nocheck
	import Autocomplete from '$lib/components/form/Autocomplete.svelte';
	import Currency from '$lib/components/form/Currency.svelte';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import { hasErrors } from '$lib/utils/errors.js';

	export let rfqs_products;
	export let supabase;
	export let showPurchasing = false;
	export let showPricing = false;
	export let showRemove = false;
	export let errors;
	export let createdProductsIndexes = [];

	function addProduct() {
		rfqs_products.push({
			product: {},
			rfqs_products_quantities: [{ quantity: null }]
		});

		rfqs_products = rfqs_products;
	}

	function removeProduct(index) {
		rfqs_products.splice(index, 1);
		rfqs_products = rfqs_products;

		if (createdProductsIndexes.includes(index)) {
			createdProductsIndexes = createdProductsIndexes.filter((i) => i !== index);
		}
	}

	/**
	 * @param {number} index
	 */
	function addQty(index) {
		rfqs_products[index].rfqs_products_quantities.push({ quantity: null });

		rfqs_products = rfqs_products;
	}

	/**
	 * @param {number} index
	 * @param {number} i
	 */
	function removeQty(index, i) {
		rfqs_products[index].rfqs_products_quantities.splice(i, 1);

		rfqs_products = rfqs_products;
	}

	function handleSelection(event, index) {
		rfqs_products[index] = { ...(rfqs_products[index] || {}), product: event.detail };
	}

	function handleCreateNew(event, index) {
		console.log(index);
		createdProductsIndexes.push(index);
		createdProductsIndexes = createdProductsIndexes;
	}

	function extractPN(item) {
		return item?.number;
	}

	async function getQuery(searchValue) {
		const { data: queryData, error } = await supabase
			.from('products')
			.select('*')
			.like('number', `%${searchValue}%`);

		return queryData;
	}

	const appInput = 'border border-blue-400 rounded-md text-sm py-1 px-2';
</script>

<div class="flex flex-col">
	<p class="text-xl font-semibold mb-4">Parts</p>
	<div class="flex flex-col space-y-7">
		{#each rfqs_products as rfqs_product, index}
			<div class="flex flew-row items-center">
				<div class="flex flex-col p-2 pr-4 bg-neutral-100 rounded-md shadow-sm">
					<div class="flex flex-row space-x-3 items-start">
						<div class="w-8">
							<p class="text-lg font-semibold text-center mt-4">#{index + 1}</p>
						</div>
						<div class="flex flex-col">
							<label class="text-xs text-gray-500 font-medium" for="part_number">Part Number</label>
							<Autocomplete
								query={getQuery}
								bind:value={rfqs_product.product.number}
								disabled={rfqs_product.product.id}
								extractItemName={extractPN}
								on:selection={(event) => handleSelection(event, index)}
								on:create={(event) => handleCreateNew(event, index)}
							/>
							{#if hasErrors(errors, ['rfqs_products', index, 'product', 'number'])}
								<label for="trim" class="label">
									<span class="label-text-alt text-error">Required</span>
								</label>
							{/if}
						</div>
						<div class="flex flex-col">
							<label class="text-xs text-gray-500 font-medium" for="nsn">NSN</label>
							<Currency
								bind:value={rfqs_product.product.nsn}
								disabled={!createdProductsIndexes.includes(index)}
							/>

							{#if hasErrors(errors, ['rfqs_products', index, 'product', 'nsn'])}
								<label for="trim" class="label">
									<span class="label-text-alt text-error">Not 13 digits</span>
								</label>
							{/if}
						</div>
						<div class="flex flex-col">
							<label class="text-xs text-gray-500 font-medium" for="cross_ref">Cross Ref</label>
							<TextInput
								disabled={!createdProductsIndexes.includes(index)}
								bind:value={rfqs_product.product.cross_reference}
							/>
						</div>
					</div>
					<div class="flex flex-col mt-2 ml-11">
						<div class="flex flex-row justify-between">
							<div class="flex flex-col space-y-2">
								{#each rfqs_product.rfqs_products_quantities as rfqs_products_quantity, i}
									<div class="flex flex-row space-x-3">
										<div class="flex flex-col">
											<label class="text-xs text-gray-500 font-medium" for="qty">Quantity</label>
											<Currency bind:value={rfqs_products_quantity.quantity} width={'w-20'} />
											{#if hasErrors( errors, ['rfqs_products', index, 'rfqs_products_quantities', i, 'quantity'] )}
												<label for="trim" class="label">
													<span class="label-text-alt text-error">Required</span>
												</label>
											{/if}
										</div>

										{#if showPurchasing}
											<div class="flex flex-col">
												<label class="text-xs text-gray-500 font-medium" for="qty"
													>Material Cost</label
												>
												<Currency
													bind:value={rfqs_products_quantity.material_cost}
													width={'w-20'}
												/>
											</div>
											<div class="flex flex-col">
												<label class="text-xs text-gray-500 font-medium" for="qty">Lead Time</label>
												<Currency bind:value={rfqs_products_quantity.lead_time} width={'w-20'} />
											</div>
										{/if}

										{#if showPricing}
											<div class="flex flex-col">
												<label class="text-xs text-gray-500 font-medium" for="qty"
													>Final Pricing</label
												>
												<Currency
													bind:value={rfqs_products_quantity.final_pricing}
													width={'w-20'}
												/>
											</div>
										{/if}

										{#if i > 0 && showRemove}
											<button
												class="text-sm text-gray-500 mt-4"
												on:click={() => removeQty(index, i)}
											>
												X
											</button>
										{/if}
									</div>
								{/each}

								{#if showRemove}
									<div>
										<button class="text-sm text-gray-700 font-medium" on:click={() => addQty(index)}
											>+ Quantity</button
										>
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
				<div class="w-10">
					{#if index > 0 && showRemove}
						<button class="w-10" on:click={() => removeProduct(index)}>
							<p class="text-center text-gray-500">X</p>
						</button>
					{/if}
				</div>
			</div>
		{/each}
	</div>

	{#if showRemove}
		<div>
			<button
				on:click={addProduct}
				class="bg-neutral-50 p-2 mt-6 rounded-md text-base font-medium mr-10">Add Part</button
			>
		</div>
	{/if}
</div>
