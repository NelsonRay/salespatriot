<script>
	import OEMParts from '$lib/components/app/OEM/OEMParts/OEMParts.svelte';

	let value = {
		customer: { name: '', email_address: '', customer_number: '' },
		date_received: '',
		requested_return_date: '',
		parts: [
			{
				part_number: '',
				nsn: '',
				cross_reference: '',
				quantities: [{ quantity: null }]
			}
		],
		notes: ''
	};

	let submitted = false;
	let isSubmitting = false;

	async function handleSubmit() {
		const res = await fetch('/api/oem/new', {
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

	const appInput = 'border border-blue-400 rounded-md text-sm py-1 px-2';
</script>

<div class="flex h-screen w-screen justify-center overflow-y-auto">
	<div class="flex flex-col">
		{#if !submitted}
			<h1 class="text-3xl mb-8 mt-8">New OEM RFQ Form</h1>
			<div class="grid grid-cols-3 gap-5 mb-5">
				<div class="flex flex-col">
					<label for="customer_name">Customer Name</label>
					<input
						id="customer_name"
						autocomplete="off"
						class={appInput}
						bind:value={value.customer.name}
					/>
				</div>
				<div class="flex flex-col">
					<label for="customer_email">Customer Email</label>
					<input
						id="customer_email"
						autocomplete="off"
						class={appInput}
						bind:value={value.customer.email_address}
					/>
				</div>
				<div class="flex flex-col">
					<label for="customer_number">Customer Number</label>
					<input
						id="customer_number"
						autocomplete="off"
						class={appInput}
						bind:value={value.customer.customer_number}
					/>
				</div>
				<div class="flex flex-col">
					<label for="date_received">Date Received</label>
					<input
						id="date_received"
						autocomplete="off"
						type="date"
						class={appInput}
						bind:value={value.date_received}
					/>
				</div>
				<div class="flex flex-col">
					<label for="return_date">Return Date</label>
					<input
						id="return_date"
						autocomplete="off"
						type="date"
						class={appInput}
						bind:value={value.requested_return_date}
					/>
				</div>
			</div>
			<OEMParts bind:parts={value.parts} showRemove />

			<p class="text-lg mt-10 font-medium">Notes</p>
			<textarea class="flex min-h-16 overflow-y-auto {appInput}" bind:value={value.notes} />

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
		{:else}
			<p class="mt-12">Thank you for submitting form!</p>
			<button class="mt-3 p-2 bg-blue-300 rounded-md" on:click|once={reloadPage}>
				Submit another form
			</button>
		{/if}
	</div>
</div>
