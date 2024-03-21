<script>
	// @ts-nocheck
	import Products from '$lib/components/app/Commercial/Products/Products.svelte';
	import { publicRFQFormValidation } from '$lib/validation.js';
	import { formatDate } from '$lib/helpers.js';
	import { hasErrors } from '$lib/utils/errors.js';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import DateInput from '$lib/components/form/DateInput.svelte';
	import ADGLogo from '$lib/images/logo.png';
	import { page } from '$app/stores';

	export let data;
	$: ({ supabase, session } = data);

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
		console.log(errors);

		if (!errors) {
			const res = await fetch('/api/rfq-public', {
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

	const appInput = 'border border-blue-400 rounded-md text-sm py-1 px-2';
</script>

<svelte:head>
	<title>Add RFQ</title>
</svelte:head>

<div class="flex h-screen w-screen justify-center overflow-y-auto">
	<div class="flex flex-col">
		{#if !submitted}
			<div class="flex flex-row justify-center mt-10">
				<img src={ADGLogo} alt="adg" class="h-28 w-28" />
			</div>
			<h1 class="text-3xl mt-8">Request for Quote</h1>
			<p class="text-sm mt-4 mb-8">
				If you have any questions about a product/quote feel free to call us at 630-851-1616 or <br
				/>
				email sales@auroradefensegroup.com. We aim to return all quotes in 5 days or less.
			</p>
			<div class="grid grid-cols-3 gap-5 mb-5">
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
					<label for="return_date">Return Date</label>
					<DateInput bind:value={rfq.requested_return_date} />
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

			<p class="text-lg mt-10 font-medium">Notes</p>
			<textarea class="flex min-h-16 overflow-y-auto {appInput}" bind:value={rfq.notes} />

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
			<p class="mt-12">Thank you for submitting form!</p>
			<button class="mt-3 p-2 bg-blue-300 rounded-md" on:click|once={reloadPage}>
				Submit another form
			</button>
		{/if}
	</div>
</div>
