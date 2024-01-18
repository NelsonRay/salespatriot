<script>
	let value = {
		customer_name: '',
		customer_email: '',
		customer_number: '',
		date: '',
		return_date: '',
		parts: [
			{
				part_number: '',
				nsn: '',
				cross_ref: '',
				quantities: ['']
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
			cross_ref: '',
			quantities: ['']
		});

		value = value;
	}

	function resetParts() {
		value.parts = [
			{
				part_number: '',
				nsn: '',
				cross_ref: '',
				quantities: ['']
			}
		];

		value = value;
	}

	/**
	 * @param {number} index
	 */
	function addQty(index) {
		value.parts[index].quantities.push('');

		value = value;
	}

	/**
	 * @param {number} index
	 */
	function resetQuantities(index) {
		value.parts[index].quantities = [''];

		value = value;
	}
</script>

<div class="flex w-screen justify-center">
	<div class="flex flex-col">
		{#if !submitted}
			<h1 class="text-3xl mb-8 mt-8">New OEM RFQ Form</h1>
			<div class="grid grid-cols-3 gap-5">
				<div class="flex flex-col">
					<label for="customer_name">Customer Name</label>
					<input
						id="customer_name"
						class="border border-blue-400"
						bind:value={value.customer_name}
					/>
				</div>
				<div class="flex flex-col">
					<label for="customer_email">Customer Email</label>
					<input
						id="customer_email"
						class="border border-blue-400"
						bind:value={value.customer_email}
					/>
				</div>
				<div class="flex flex-col">
					<label for="customer_number">Customer Number</label>
					<input
						id="customer_number"
						class="border border-blue-400"
						bind:value={value.customer_number}
					/>
				</div>
				<div class="flex flex-col">
					<label for="date_received">Date Received</label>
					<input
						id="date_received"
						type="date"
						class="border border-blue-400"
						bind:value={value.date}
					/>
				</div>
				<div class="flex flex-col">
					<label for="return_date">Return Date</label>
					<input
						id="return_date"
						type="date"
						class="border border-blue-400"
						bind:value={value.return_date}
					/>
				</div>
			</div>
			<p class="text-xl font-semibold mt-8 mb-4">Parts</p>
			<div class="flex flex-col space-y-7">
				{#each value.parts as part, index}
					<div>
						<p class="text-lg font-semibold mb-2">Part #{index + 1}</p>
						<div class="grid grid-cols-3 gap-5">
							<div class="flex flex-col">
								<label for="part_number">Part Number</label>
								<input
									id="part_number"
									class="border border-blue-400"
									bind:value={part.part_number}
								/>
							</div>
							<div class="flex flex-col">
								<label for="nsn">NSN</label>
								<input id="nsn" class="border border-blue-400" bind:value={part.nsn} />
							</div>
							<div class="flex flex-col">
								<label for="cross_ref">Cross Ref</label>
								<input id="cross_ref" class="border border-blue-400" bind:value={part.cross_ref} />
							</div>
						</div>
						<div class="flex flex-col mt-5">
							<p>Quantities</p>
							<div class="flex flex-row justify-between">
								<div class="flex flex-row space-x-2">
									{#each part.quantities as qty}
										<input class="border border-blue-400 w-16" bind:value={qty} />
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
				{/each}
			</div>
			<div class="flex flex-row justify-between mt-8 -mx-1">
				<button on:click={addPart} class="bg-blue-50 px-2 rounded-md text-lg font-medium"
					>Add Part</button
				>
				{#if value.parts.length > 1}
					<button on:click={resetParts} class="bg-blue-50 px-2 rounded-md text-md"
						>Reset Parts</button
					>
				{/if}
			</div>
			<p class="text-lg mt-10 font-medium">Notes</p>
			<textarea
				class="flex min-h-16 overflow-y-auto border border-blue-400"
				bind:value={value.notes}
			/>
			<p class="mt-10">Please ensure all necessary text fields are filled in before submitting!</p>
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
