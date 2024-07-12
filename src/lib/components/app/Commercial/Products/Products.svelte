<script>
	// @ts-nocheck
	import Autocomplete from '$lib/components/form/Autocomplete.svelte';
	import Currency from '$lib/components/form/Currency.svelte';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import { hasErrors } from '$lib/utils/errors.js';
	import { formatMonthDayYearDate, formatCurrency, calculateDaysDifference } from '$lib/helpers';

	export let rfqs_parts;
	export let supabase = undefined;
	export let showPricing = false;
	export let showRemove = false;
	export let showAll = false;
	export let errors;
	export let createdPartsIndexes = [];
	export let focusedRfqPartQty;
	export let isPublicForm = false;

	function addPart() {
		rfqs_parts.push({
			part: {},
			rfqs_parts_quantities: [{ quantity: null }]
		});

		rfqs_parts = rfqs_parts;
	}

	function removePart(index) {
		rfqs_parts.splice(index, 1);
		rfqs_parts = rfqs_parts;

		if (createdPartsIndexes.includes(index)) {
			createdPartsIndexes = createdPartsIndexes.filter((i) => i !== index);
		}
	}

	/**
	 * @param {number} index
	 */
	function addQty(index) {
		rfqs_parts[index].rfqs_parts_quantities.push({ quantity: null });

		rfqs_parts = rfqs_parts;
	}

	/**
	 * @param {number} index
	 * @param {number} i
	 */
	function removeQty(index, i) {
		rfqs_parts[index].rfqs_parts_quantities.splice(i, 1);

		rfqs_parts = rfqs_parts;
	}

	function handleSelection(event, index) {
		rfqs_parts[index] = {
			...(rfqs_parts[index] || {}),
			part: event.detail,
			cross_reference: rfqs_parts[index]?.cross_reference || event?.detail?.cross_reference
		};
	}

	function handleCreateNew(event, index) {
		createdPartsIndexes.push(index);
		createdPartsIndexes = createdPartsIndexes;
	}

	function extractPN(item) {
		return item?.number;
	}

	async function getQuery(searchValue) {
		if (!supabase) return [];
		const { data: queryData, error } = await supabase
			.from('parts')
			.select('*')
			.like('number', `%${searchValue}%`);

		return queryData;
	}

	function focusPartQty(rfqs_parts_quantity) {
		focusedRfqPartQty = rfqs_parts_quantity;
	}

	function blurPartQty() {
		focusedRfqPartQty = null;
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
	{#each rfqs_parts as rfqs_part, index}
		<div class="flex flex-col">
			<div class="flex flew-row items-center">
				<div class="flex flex-col p-2 pr-4 bg-neutral-100 rounded-md shadow-sm">
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
									bind:value={rfqs_part.part.number}
									disabled={rfqs_part.part.id}
									extractItemName={extractPN}
									forceCaps
									searchParts
									on:selection={(event) => handleSelection(event, index)}
									on:create={(event) => handleCreateNew(event, index)}
								/>
							{:else}
								<TextInput bind:value={rfqs_part.part.number} />
							{/if}
							{#if hasErrors(errors, ['rfqs_parts', index, 'part', 'number'])}
								<label for="trim" class="label">
									<span class="label-text-alt text-error"
										>{hasErrors(errors, ['rfqs_parts', index, 'part', 'number'])}</span
									>
								</label>
							{/if}
						</div>
						<div class="flex flex-col">
							<label class="text-xs text-gray-500 font-medium" for="nsn">NSN</label>
							<Currency bind:value={rfqs_part.part.nsn} disabled={!supabase} />

							{#if hasErrors(errors, ['rfqs_parts', index, 'part', 'nsn'])}
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
							<TextInput bind:value={rfqs_part.cross_reference} disabled={!supabase} />
						</div>
					</div>
					<div class="flex flex-col mt-2 ml-11">
						<div class="flex flex-row justify-between">
							<div class="flex flex-col space-y-2">
								{#each rfqs_part.rfqs_parts_quantities as rfqs_parts_quantity, i}
									<div class="flex flex-row space-x-3">
										<div class="flex flex-col">
											<label class="text-xs text-gray-500 font-medium" for="qty"
												>Quantity - #{i + 1}</label
											>
											<Currency
												bind:value={rfqs_parts_quantity.quantity}
												width={'w-20'}
												disabled={showPricing || showAll}
											/>
											{#if hasErrors( errors, ['rfqs_parts', index, 'rfqs_parts_quantities', i, 'quantity'] )}
												<label for="trim" class="label">
													<span class="label-text-alt text-error">Required</span>
												</label>
											{/if}
										</div>

										{#if showPricing || showAll}
											<div class="flex flex-col">
												<label class="text-xs text-gray-500 font-medium" for="qty"
													>Material Cost</label
												>
												<Currency
													bind:value={rfqs_parts_quantity.material_cost}
													width={'w-20'}
													focusCallback={() => focusPartQty(rfqs_parts_quantity)}
													blurCallback={blurPartQty}
													disabled={showAll}
												/>
												{#if hasErrors( errors, ['rfqs_parts', index, 'rfqs_parts_quantities', i, 'material_cost'] )}
													<label for="trim" class="label">
														<span class="label-text-alt text-error">Required</span>
													</label>
												{/if}
											</div>
											<div class="flex flex-col">
												<label class="text-xs text-gray-500 font-medium" for="qty"
													>Labor Minutes
												</label>
												<Currency
													bind:value={rfqs_parts_quantity.labor_minutes}
													width={'w-20'}
													focusCallback={() => focusPartQty(rfqs_parts_quantity)}
													blurCallback={blurPartQty}
													disabled={!showPricing}
												/>
												{#if hasErrors( errors, ['rfqs_parts', index, 'rfqs_parts_quantities', i, 'labor_minutes'] )}
													<label for="trim" class="label">
														<span class="label-text-alt text-error">Required</span>
													</label>
												{/if}
											</div>
											<div class="flex flex-col">
												<label class="text-xs text-gray-500 font-medium" for="qty"
													>Packaging Cost</label
												>
												<Currency
													bind:value={rfqs_parts_quantity.packaging_cost}
													width={'w-20'}
													focusCallback={() => focusPartQty(rfqs_parts_quantity)}
													blurCallback={blurPartQty}
													disabled={showAll}
												/>
												{#if hasErrors( errors, ['rfqs_parts', index, 'rfqs_parts_quantities', i, 'packaging_cost'] )}
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
													bind:value={rfqs_parts_quantity.final_pricing}
													width={'w-20'}
													focusCallback={() => focusPartQty(rfqs_parts_quantity)}
													blurCallback={blurPartQty}
													disabled={showAll}
												/>
												{#if hasErrors( errors, ['rfqs_parts', index, 'rfqs_parts_quantities', i, 'final_pricing'] )}
													<label for="trim" class="label">
														<span class="label-text-alt text-error">Required</span>
													</label>
												{/if}
											</div>
											<div class="flex flex-col">
												<label class="text-xs text-gray-500 font-medium" for="qty">Lead Time</label>
												<Currency
													bind:value={rfqs_parts_quantity.lead_time}
													width={'w-20'}
													focusCallback={() => focusPartQty(rfqs_parts_quantity)}
													blurCallback={blurPartQty}
													disabled={showAll}
												/>
												{#if hasErrors( errors, ['rfqs_parts', index, 'rfqs_parts_quantities', i, 'lead_time'] )}
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
						<button class="w-10" on:click={() => removePart(index)}>
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
									{#if isStatusComplete(rfqs_part?.part?.parts_purchasing, true)}
										<div class="p-2 rounded-md inline-block bg-green-300 ml-10 text-xs">
											Complete
										</div>
									{:else}
										<div class="p-2 rounded-md inline-block bg-yellow-300 ml-10 text-xs">
											In Progress
										</div>
									{/if}
								</div>
								{#if rfqs_part?.part?.parts_purchasing?.length > 0}
									<div class="flex flex-row space-x-5 mt-3">
										<div class="flex flex-col">
											<p class="text-gray-400">Quantity:</p>
											{#each rfqs_part?.part?.parts_purchasing as purchasing}
												<p>{purchasing.quantity}</p>
											{/each}
										</div>

										<div class="flex flex-col">
											<p class="text-gray-400">Mat Cost:</p>
											{#each rfqs_part?.part?.parts_purchasing as purchasing}
												<p>{formatCurrency(purchasing.material_cost)}</p>
											{/each}
										</div>

										<div class="flex flex-col">
											<p class="text-gray-400">Pack Cost:</p>
											{#each rfqs_part?.part?.parts_purchasing as purchasing}
												<p>{formatCurrency(purchasing.packaging_cost)}</p>
											{/each}
										</div>

										<div class="flex flex-col">
											<p class="text-gray-400">Lead Time:</p>
											{#each rfqs_part?.part?.parts_purchasing as purchasing}
												<p>{purchasing.lead_time}</p>
											{/each}
										</div>

										<div class="flex flex-col">
											<p class="text-gray-400">Date:</p>
											{#each rfqs_part?.part?.parts_purchasing as purchasing}
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
									{#if isStatusComplete(rfqs_part?.part?.parts_labor_minutes, false)}
										<div class="p-2 rounded-md inline-block bg-green-300 ml-10 text-xs">
											Complete
										</div>
									{:else}
										<div class="p-2 rounded-md inline-block bg-yellow-300 ml-10 text-xs">
											In Progress
										</div>
									{/if}
								</div>
								{#if rfqs_part?.part?.parts_labor_minutes?.length > 0}
									<div class="flex flex-row space-x-5 mt-3">
										<div class="flex flex-col">
											<p class="text-gray-400">Quantity:</p>
											{#each rfqs_part?.part?.parts_labor_minutes as labor}
												<p>1</p>
											{/each}
										</div>

										<div class="flex flex-col">
											<p class="text-gray-400">Labor Minutes:</p>
											{#each rfqs_part?.part?.parts_labor_minutes as labor}
												<p>{labor.labor_minutes}</p>
											{/each}
										</div>

										<div class="flex flex-col">
											<p class="text-gray-400">Date:</p>
											{#each rfqs_part?.part?.parts_labor_minutes as labor}
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
			<button on:click={addPart} class="bg-neutral-100 p-2 rounded-md text-base font-medium mr-10"
				>{isPublicForm ? 'Request another part to be quoted' : 'Add Part'}</button
			>
		</div>
	{/if}
</div>
