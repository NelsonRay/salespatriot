<script>
	let value = {
		customer: { name: '', email_address: '', customer_number: '' },
		date_received: '',
		requested_return_date: '',
		parts: [
			{
				part_number: '',
				nsn: '',
				cross_reference: '',
				quantities: [null]
			}
		],
		notes: ''
	};

	let submitted = false;

	async function submit() {
		const res = await fetch('/api/oem', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ value })
		});

		if (res.status === 200) {
			submitted = true;
		}
	}

	async function reloadPage() {
		window.location.reload();
	}

	function addPart() {
		value.parts.push({
			part_number: '',
			nsn: '',
			cross_reference: '',
			quantities: [null]
		});

		value = value;
	}

	// @ts-ignore
	function removePart(index) {
		value.parts.splice(index, 1);
		value = value;
	}

	/**
	 * @param {number} index
	 */
	function addQty(index) {
		value.parts[index].quantities.push(null);

		value = value;
	}

	/**
	 * @param {number} index
	 */
	function resetQuantities(index) {
		value.parts[index].quantities = [null];

		value = value;
	}
</script>

<div class="flex h-screen w-screen justify-center overflow-y-auto">
	<div class="flex flex-col">
		{#if !submitted}
			<h1 class="text-3xl mb-8 mt-8">New OEM RFQ Form</h1>
			<div class="grid grid-cols-3 gap-5">
				<div class="flex flex-col">
					<label for="customer_name">Customer Name</label>
					<input
						id="customer_name"
						autocomplete="off"
						class="border border-blue-400"
						bind:value={value.customer.name}
					/>
				</div>
				<div class="flex flex-col">
					<label for="customer_email">Customer Email</label>
					<input
						id="customer_email"
						autocomplete="off"
						class="border border-blue-400"
						bind:value={value.customer.email_address}
					/>
				</div>
				<div class="flex flex-col">
					<label for="customer_number">Customer Number</label>
					<input
						id="customer_number"
						autocomplete="off"
						class="border border-blue-400"
						bind:value={value.customer.customer_number}
					/>
				</div>
				<div class="flex flex-col">
					<label for="date_received">Date Received</label>
					<input
						id="date_received"
						autocomplete="off"
						type="date"
						class="border border-blue-400"
						bind:value={value.date_received}
					/>
				</div>
				<div class="flex flex-col">
					<label for="return_date">Return Date</label>
					<input
						id="return_date"
						autocomplete="off"
						type="date"
						class="border border-blue-400"
						bind:value={value.requested_return_date}
					/>
				</div>
			</div>
			<p class="text-xl font-semibold mt-8 mb-4">Parts</p>
			<div class="flex flex-col space-y-7">
				{#each value.parts as part, index}
					<div class="flex flex-row items-center bg-neutral-100 rounded-md">
						<p class="text-lg font-semibold mb-2 mx-3">#{index + 1}</p>
						<div class="flex flex-col my-2">
							<div class="flex flex-row space-x-3">
								<div class="flex flex-col">
									<label class="text-xs text-gray-500 font-medium" for="part_number"
										>Part Number</label
									>
									<input
										id="part_number"
										autocomplete="off"
										class="border border-blue-400"
										bind:value={part.part_number}
									/>
								</div>
								<div class="flex flex-col">
									<label class="text-xs text-gray-500 font-medium" for="nsn">NSN</label>
									<input
										id="nsn"
										autocomplete="off"
										class="border border-blue-400"
										bind:value={part.nsn}
									/>
								</div>
								<div class="flex flex-col">
									<label class="text-xs text-gray-500 font-medium" for="cross_ref">Cross Ref</label>
									<input
										id="cross_ref"
										autocomplete="off"
										class="border border-blue-400"
										bind:value={part.cross_reference}
									/>
								</div>
							</div>
							<div class="flex flex-col mt-2">
								<p class="text-xs text-gray-500 font-medium">Quantities</p>
								<div class="flex flex-row justify-between">
									<div class="flex flex-row space-x-2">
										{#each part.quantities as qty}
											<input
												autocomplete="off"
												class="border border-blue-400 w-16"
												type="number"
												bind:value={qty}
											/>
										{/each}
										<button class="bg-blue-50 mx-5 px-2 rounded-md" on:click={() => addQty(index)}
											>+</button
										>
									</div>
									{#if part.quantities.length > 1}
										<button
											class="bg-blue-50 px-2 text-sm rounded-md"
											on:click={() => resetQuantities(index)}
										>
											Reset
										</button>
									{/if}
								</div>
							</div>
						</div>
						<div class="w-10">
							{#if index > 0}
								<button class="w-10" on:click={() => removePart(index)}>
									<p class="text-center text-gray-500">X</p>
								</button>
							{/if}
						</div>
					</div>
				{/each}
			</div>

			<button
				on:click={addPart}
				class="bg-neutral-50 p-1 mt-6 rounded-md text-base font-medium w-full">Add Part</button
			>

			<p class="text-lg mt-10 font-medium">Notes</p>
			<textarea
				class="flex min-h-16 overflow-y-auto border border-blue-400"
				bind:value={value.notes}
			/>

			<div class="flex flex-row mt-2 text-lg font-medium">
				<button class="bg-blue-50 px-2 rounded-md -ml-2" on:click={submit}>Submit</button>
			</div>
		{:else}
			<p class="mt-12">Thank you for submitting form!</p>
			<button class="mt-3 p-2 bg-blue-300 rounded-md" on:click|once={reloadPage}>
				Submit another form
			</button>
		{/if}
	</div>
</div>
