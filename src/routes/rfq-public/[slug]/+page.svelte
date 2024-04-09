<script>
	// @ts-nocheck
	import Products from '$lib/components/app/Commercial/Products/Products.svelte';
	import { publicRFQFormValidation } from '$lib/validation.js';
	import { formatDate } from '$lib/helpers.js';
	import { hasErrors } from '$lib/utils/errors.js';
	import TextInput from '$lib/components/form/TextInput.svelte';

	import { page } from '$app/stores';

	export let data;
	$: ({ supabase } = data);

	let rfq = {
		customer: {},
		received_at: formatDate(new Date()),
		requested_return_date: null,
		rfqs_products: [
			{
				product: {},
				rfqs_products_quantities: [{ quantity: null }]
			}
		],
		notes: ''
	};

	let createdProductsIndexes = [];
	let submitted = false;
	let isSubmitting = false;
	let errors;

	async function handleSubmit() {
		const results = publicRFQFormValidation()?.safeParse(rfq);
		errors = results?.error?.issues;

		if (!errors) {
			const res = await fetch('/api/rfq/public', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ values: rfq, firm: $page.params.slug })
			});

			if (res.status === 200) {
				submitted = true;
			}
		}
	}

	async function reloadPage() {
		window.location.reload();
	}
</script>

<svelte:head>
	<title>Request for Quote - Aurora Defense Group</title>
</svelte:head>

<div class="flex h-screen w-screen justify-center overflow-y-auto">
	<div class="flex flex-col">
		{#if !submitted}
			<div class="flex flex-row justify-center mt-10">
				<img
					src="https://byhpfvdicvtmwnuwrbtp.supabase.co/storage/v1/object/public/logos/ADG%20Logo%20Transparent.png"
					alt="adg"
					class="h-28 w-28"
				/>
			</div>
			<h1 class="text-3xl mt-8">Request for Quote</h1>
			<p class="text-xs mt-4 mb-8">
				If you have any questions about a product/quote, feel free to call us at 630-851-1616 or
				email sales@auroradefensegroup.com.<br /> We aim to return all quotes in 5 days or less.
			</p>
			<div class="grid grid-cols-2 gap-5 mb-5">
				<div class="flex flex-col">
					<label for="customer_email">Your Name</label>
					<TextInput bind:value={rfq.person_name} />
					{#if hasErrors(errors, ['person_name'])}
						<label for="trim" class="label">
							<span class="label-text-alt text-error">Required</span>
						</label>
					{/if}
				</div>
				<div class="flex flex-col">
					<label for="customer_email">Company Name</label>
					<TextInput bind:value={rfq.customer.name} />
					{#if hasErrors(errors, ['customer', 'name'])}
						<label for="trim" class="label">
							<span class="label-text-alt text-error">Required</span>
						</label>
					{/if}
				</div>

				<div class="flex flex-col">
					<label for="customer_email">Email</label>
					<TextInput bind:value={rfq.customer.email_address} />
					{#if hasErrors(errors, ['customer', 'email_address'])}
						<label for="trim" class="label">
							<span class="label-text-alt text-error">Required</span>
						</label>
					{/if}
				</div>
				<div class="flex flex-col">
					<label for="return_date">Phone Number</label>
					<TextInput bind:value={rfq.customer.phone_number} />
					{#if hasErrors(errors, ['customer', 'phone_number'])}
						<label for="trim" class="label">
							<span class="label-text-alt text-error">Required</span>
						</label>
					{/if}
				</div>
			</div>

			<Products
				bind:rfqs_products={rfq.rfqs_products}
				showRemove
				{supabase}
				{errors}
				isPublicForm
				bind:createdProductsIndexes
			/>

			<p class="text-lg mt-10 font-medium">
				Any comments about the RFQ or the parts (colors, voltages, material, etc).
			</p>
			<textarea
				class="flex min-h-16 overflow-y-auto border rounded-md text-sm py-1 px-2"
				bind:value={rfq.notes}
			/>

			<div class="flex flex-row mt-5 items-center justify-center pb-32">
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
			<p class="mt-12">
				Thank you for submitted a quote with Aurora Defense Group - we will be in touch shortly.
			</p>
			<button class="mt-3 p-2 bg-blue-300 rounded-md" on:click|once={reloadPage}>
				Submit another form
			</button>
			<a class="mt-3 p-2 bg-blue-300 rounded-md text-center" href="http://auroradefensegroup.com/">
				Return to homepage (auroradefensegroup.com)
			</a>
		{/if}
	</div>
</div>
