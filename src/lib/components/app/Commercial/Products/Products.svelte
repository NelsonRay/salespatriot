<script>
	// @ts-nocheck
	import Autocomplete from '$lib/components/form/Autocomplete.svelte';
	import Currency from '$lib/components/form/Currency.svelte';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import { hasErrors } from '$lib/utils/errors.js';
	import { formatMonthDayYearDate, formatCurrency, calculateDaysDifference } from '$lib/helpers';

	export let rfqs_products;
	export let supabase;
	export let showPricing = false;
	export let showRemove = false;
	export let showAll = false;
	export let errors;
	export let createdProductsIndexes = [];
	export let focusedRfqProductQty;
	export let isPublicForm = false;

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
		createdProductsIndexes.push(index);
		createdProductsIndexes = createdProductsIndexes;
	}

	function extractPN(item) {
		return item?.number;
	}

	async function getQuery(searchValue) {
		if (!supabase) return [];
		const { data: queryData, error } = await supabase
			.from('products')
			.select('*')
			.like('number', `%${searchValue}%`);

		return queryData;
	}

	function focusProductQty(rfqs_products_quantity) {
		focusedRfqProductQty = rfqs_products_quantity;
	}

	function blurProductQty() {
		focusedRfqProductQty = null;
	}

	function isStatusComplete(data, isPurchasing) {
		return (
			data?.filter(
				(d) =>
					Math.abs(calculateDaysDifference(new Date(d.created_at))) < (isPurchasing ? 180 : 300)
			)?.length > 0
		);
	}
</script>

<div class="flex flex-col space-y-7">
	<p class="text-xl font-semibold">Parts</p>
	{#each rfqs_products as rfqs_product, index}
		<div class="flex flex-col">
			<div class="flex flew-row items-center">
				<div class="flex flex-col p-2 pr-4 bg-neutral-50 rounded-md shadow-sm">
					<div class="flex flex-row space-x-3 items-start">
						<div class="w-8">
							<p class="text-lg font-semibold text-center mt-4">#{index + 1}</p>
						</div>
						<div class="flex flex-col">
							<label class="text-xs text-gray-500 font-medium" for="part_number"
								>{isPublicForm ? 'Aurora Defense Part Number' : 'Part Number'}</label
							>
							{#if !isPublicForm}
								<Autocomplete
									query={getQuery}
									bind:value={rfqs_product.product.number}
									disabled={rfqs_product.product.id}
									extractItemName={extractPN}
									on:selection={(event) => handleSelection(event, index)}
									on:create={(event) => handleCreateNew(event, index)}
								/>
							{:else}
								<TextInput bind:value={rfqs_product.product.number} />
							{/if}
							{#if hasErrors(errors, ['rfqs_products', index, 'product', 'number'])}
								<label for="trim" class="label">
									<span class="label-text-alt text-error"
										>{hasErrors(errors, ['rfqs_products', index, 'product', 'number'])}</span
									>
								</label>
							{/if}
						</div>
						<div class="flex flex-col">
							<label class="text-xs text-gray-500 font-medium" for="nsn">NSN</label>
							<Currency
								bind:value={rfqs_product.product.nsn}
								disabled={!isPublicForm && !createdProductsIndexes.includes(index)}
							/>

							{#if hasErrors(errors, ['rfqs_products', index, 'product', 'nsn'])}
								<label for="trim" class="label">
									<span class="label-text-alt text-error">Not 13 digits</span>
								</label>
							{/if}
						</div>
						<div class="flex flex-col">
							<label class="text-xs text-gray-500 font-medium" for="cross_ref"
								>{isPublicForm
									? 'Your Cross Reference Part Number (if needed)'
									: 'Customer PN'}</label
							>
							<TextInput
								disabled={!isPublicForm && !createdProductsIndexes.includes(index)}
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
											<label class="text-xs text-gray-500 font-medium" for="qty"
												>Quantity - #{i + 1}</label
											>
											<Currency
												bind:value={rfqs_products_quantity.quantity}
												width={'w-20'}
												disabled={showPricing || showAll}
											/>
											{#if hasErrors( errors, ['rfqs_products', index, 'rfqs_products_quantities', i, 'quantity'] )}
												<label for="trim" class="label">
													<span class="label-text-alt text-error">Required</span>
												</label>
											{/if}
										</div>

										{#if showPricing || showAll}
											<div class="flex flex-col">
												<label class="text-xs text-gray-500 font-medium" for="qty"
													>Labor Minutes
												</label>
												<Currency
													bind:value={rfqs_product.labor_minutes}
													width={'w-20'}
													focusCallback={() => focusProductQty(rfqs_products_quantity)}
													blurCallback={blurProductQty}
													disabled={!showPricing}
												/>
												{#if hasErrors(errors, ['rfqs_products', index, 'labor_minutes'])}
													<label for="trim" class="label">
														<span class="label-text-alt text-error">Required</span>
													</label>
												{/if}
											</div>
											<div class="flex flex-col">
												<label class="text-xs text-gray-500 font-medium" for="qty"
													>Material Cost</label
												>
												<Currency
													bind:value={rfqs_products_quantity.material_cost}
													width={'w-20'}
													focusCallback={() => focusProductQty(rfqs_products_quantity)}
													blurCallback={blurProductQty}
													disabled={showAll}
												/>
												{#if hasErrors( errors, ['rfqs_products', index, 'rfqs_products_quantities', i, 'material_cost'] )}
													<label for="trim" class="label">
														<span class="label-text-alt text-error">Required</span>
													</label>
												{/if}
											</div>
											<div class="flex flex-col">
												<label class="text-xs text-gray-500 font-medium" for="qty">Lead Time</label>
												<Currency
													bind:value={rfqs_products_quantity.lead_time}
													width={'w-20'}
													focusCallback={() => focusProductQty(rfqs_products_quantity)}
													blurCallback={blurProductQty}
													disabled={showAll}
												/>
												{#if hasErrors( errors, ['rfqs_products', index, 'rfqs_products_quantities', i, 'lead_time'] )}
													<label for="trim" class="label">
														<span class="label-text-alt text-error">Required</span>
													</label>
												{/if}
											</div>

											<div class="flex flex-col">
												<label class="text-xs text-gray-500 font-medium" for="qty"
													>Final Pricing</label
												>
												<Currency
													bind:value={rfqs_products_quantity.final_pricing}
													width={'w-20'}
													focusCallback={() => focusProductQty(rfqs_products_quantity)}
													blurCallback={blurProductQty}
													disabled={showAll}
												/>
												{#if hasErrors( errors, ['rfqs_products', index, 'rfqs_products_quantities', i, 'final_pricing'] )}
													<label for="trim" class="label">
														<span class="label-text-alt text-error">Required</span>
													</label>
												{/if}
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
										<button
											class="text-sm text-gray-700 bg-white p-1 border rounded-md font-medium"
											on:click={() => addQty(index)}
											>{isPublicForm ? 'Request another quantity break' : '+ Quantity'}</button
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
			<div class="flex flex-row">
				{#if showPricing}
					<div>
						<div class="flex flex-row">
							<div class="flex flex-col bg-neutral-50 rounded-md p-3 mr-8 mt-2 text-xs">
								<div class="flex flex-row justify-between items-center">
									<p class="mb-1 font-medium text-sm">Purchasing:</p>
									{#if isStatusComplete(rfqs_product?.product?.product_purchasing, true)}
										<div class="p-2 rounded-md inline-block bg-green-300 ml-10 text-xs">
											Complete
										</div>
									{:else}
										<div class="p-2 rounded-md inline-block bg-yellow-300 ml-10 text-xs">
											In Progress
										</div>
									{/if}
								</div>
								{#if rfqs_product?.product?.product_purchasing?.length > 0}
									<div class="flex flex-row space-x-5 mt-3">
										<div class="flex flex-col">
											<p class="text-gray-400">Quantity:</p>
											{#each rfqs_product?.product?.product_purchasing as purchasing}
												<p>{purchasing.quantity}</p>
											{/each}
										</div>

										<div class="flex flex-col">
											<p class="text-gray-400">Mat Cost:</p>
											{#each rfqs_product?.product?.product_purchasing as purchasing}
												<p>{formatCurrency(purchasing.material_cost)}</p>
											{/each}
										</div>

										<div class="flex flex-col">
											<p class="text-gray-400">Lead Time:</p>
											{#each rfqs_product?.product?.product_purchasing as purchasing}
												<p>{purchasing.lead_time}</p>
											{/each}
										</div>

										<div class="flex flex-col">
											<p class="text-gray-400">Date:</p>
											{#each rfqs_product?.product?.product_purchasing as purchasing}
												<p>{formatMonthDayYearDate(purchasing.created_at)}</p>
											{/each}
										</div>
									</div>
								{/if}
							</div>
						</div>
					</div>

					<div>
						<div class="flex flex-row">
							<div class="flex flex-col bg-neutral-50 rounded-md p-3 mr-8 mt-2 text-xs">
								<div class="flex flex-row justify-between items-center">
									<p class="mb-1 font-medium text-sm">Labor:</p>
									{#if isStatusComplete(rfqs_product?.product?.product_labor_minutes, false)}
										<div class="p-2 rounded-md inline-block bg-green-300 ml-10 text-xs">
											Complete
										</div>
									{:else}
										<div class="p-2 rounded-md inline-block bg-yellow-300 ml-10 text-xs">
											In Progress
										</div>
									{/if}
								</div>
								{#if rfqs_product?.product?.product_labor_minutes?.length > 0}
									<div class="flex flex-row space-x-5 mt-3">
										<div class="flex flex-col">
											<p class="text-gray-400">Quantity:</p>
											{#each rfqs_product?.product?.product_labor_minutes as labor}
												<p>1</p>
											{/each}
										</div>

										<div class="flex flex-col">
											<p class="text-gray-400">Labor Minutes:</p>
											{#each rfqs_product?.product?.product_labor_minutes as labor}
												<p>{labor.labor_minutes}</p>
											{/each}
										</div>

										<div class="flex flex-col">
											<p class="text-gray-400">Date:</p>
											{#each rfqs_product?.product?.product_labor_minutes as labor}
												<p>{formatMonthDayYearDate(labor.created_at)}</p>
											{/each}
										</div>
									</div>
								{/if}
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/each}
	{#if showRemove}
		<div>
			<button on:click={addProduct} class="bg-neutral-50 p-2 rounded-md text-base font-medium mr-10"
				>{isPublicForm ? 'Request another part to be quoted' : 'Add Part'}</button
			>
		</div>
	{/if}
</div>
