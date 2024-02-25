<script>
	// @ts-nocheck
	export let parts;
	export let showPurchasing = false;
	export let showLabor = false;
	export let showPricing = false;
	export let showRemove = false;

	console.log(parts);

	function addPart() {
		parts.push({
			part_number: '',
			nsn: '',
			cross_reference: '',
			quantities: [{ quantity: null }]
		});

		parts = parts;
	}

	// @ts-ignore
	function removePart(index) {
		parts.splice(index, 1);
		parts = parts;
	}

	/**
	 * @param {number} index
	 */
	function addQty(index) {
		parts[index].quantities.push({ quantity: null });

		parts = parts;
	}

	/**
	 * @param {number} index
	 * @param {number} i
	 */
	function removeQty(index, i) {
		parts[index].quantities.splice(i, 1);

		parts = parts;
	}
	const appInput = 'border border-blue-400 rounded-md text-sm py-1 px-2';
</script>

<div class="flex flex-col">
	<p class="text-xl font-semibold mb-4">Parts</p>
	<div class="flex flex-col space-y-7">
		{#each parts as part, index}
			<div class="flex flew-row items-center">
				<div class="flex flex-col p-2 pr-4 bg-neutral-100 rounded-md shadow-sm">
					<div class="flex flex-row space-x-3 items-center">
						<div class="w-8">
							<p class="text-lg font-semibold text-center">#{index + 1}</p>
						</div>
						<div class="flex flex-col">
							<label class="text-xs text-gray-500 font-medium" for="part_number">Part Number</label>
							<input
								id="part_number"
								autocomplete="off"
								class={appInput}
								bind:value={part.part_number}
							/>
						</div>
						<div class="flex flex-col">
							<label class="text-xs text-gray-500 font-medium" for="nsn">NSN</label>
							<input id="nsn" autocomplete="off" class={appInput} bind:value={part.nsn} />
						</div>
						<div class="flex flex-col">
							<label class="text-xs text-gray-500 font-medium" for="cross_ref">Cross Ref</label>
							<input
								id="cross_ref"
								autocomplete="off"
								class={appInput}
								bind:value={part.cross_reference}
							/>
						</div>
					</div>
					<div class="flex flex-col mt-2 ml-11">
						<div class="flex flex-row justify-between">
							<div class="flex flex-col space-y-2">
								{#each part.quantities as qty, i}
									<div class="flex flex-row space-x-3">
										<div class="flex flex-col">
											<label class="text-xs text-gray-500 font-medium" for="qty">Quantity</label>
											<input
												id="qty"
												autocomplete="off"
												class="{appInput} w-20"
												type="number"
												bind:value={qty.quantity}
											/>
										</div>

										{#if showPurchasing}
											<div class="flex flex-col">
												<label class="text-xs text-gray-500 font-medium" for="qty"
													>Material Cost</label
												>
												<input
													id="qty"
													autocomplete="off"
													class="{appInput} w-20"
													type="number"
													bind:value={qty.material_cost}
												/>
											</div>
											<div class="flex flex-col">
												<label class="text-xs text-gray-500 font-medium" for="qty">Lead Time</label>
												<input
													id="qty"
													autocomplete="off"
													class="{appInput} w-20"
													type="number"
													bind:value={qty.material_cost}
												/>
											</div>
										{/if}

										{#if showLabor}
											<div class="flex flex-col">
												<label class="text-xs text-gray-500 font-medium" for="qty"
													>Labor Minutes</label
												>
												<input
													id="qty"
													autocomplete="off"
													class="{appInput} w-20"
													type="number"
													bind:value={qty.material_cost}
												/>
											</div>
										{/if}

										{#if showPricing}
											<div class="flex flex-col">
												<label class="text-xs text-gray-500 font-medium" for="qty"
													>Final Pricing</label
												>
												<input
													id="qty"
													autocomplete="off"
													class="{appInput} w-20"
													type="number"
													bind:value={qty.final_pricing}
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
						<button class="w-10" on:click={() => removePart(index)}>
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
				on:click={addPart}
				class="bg-neutral-50 p-2 mt-6 rounded-md text-base font-medium mr-10">Add Part</button
			>
		</div>
	{/if}
</div>
