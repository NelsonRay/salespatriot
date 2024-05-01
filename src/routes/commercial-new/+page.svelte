<script>
	// @ts-nocheck
	import Products from '$lib/components/app/Commercial/Products/Products.svelte';
	import Autocomplete from '$lib/components/form/Autocomplete.svelte';
	import { addRFQFormValidation } from '$lib/validation.js';
	import { hasErrors } from '$lib/utils/errors.js';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import Textarea from '$lib/components/form/Textarea.svelte';
	import DateInput from '$lib/components/form/DateInput.svelte';
	import Table from './Table.svelte';

	export let data;
	$: ({ supabase } = data);

	let rfq = {
		person_name: null,
		customer: {},
		received_at: null,
		requested_return_date: null,
		rfqs_products: [
			{
				product: {},
				rfqs_products_quantities: [{ quantity: null }]
			}
		],
		notes: ''
	};

	let customerRfqs = [];

	let customerSelected = true;
	let createdProductsIndexes = [];
	let submitted = false;
	let isSubmitting = false;
	let errors;

	async function handleSubmit() {
		const results = addRFQFormValidation()?.safeParse(rfq);
		errors = results?.error?.issues;

		if (!rfq.customer.id && customerSelected) {
			errors = [...(errors ?? []), { path: ['customer', 'name'] }];
		}

		for (let i = 0; i < rfq.rfqs_products.length; i++) {
			if (!rfq.rfqs_products[i].product?.id && !createdProductsIndexes.includes(i)) {
				errors = [...(errors ?? []), { path: ['rfqs_products', i, 'product', 'number'] }];
			}
		}

		if (!errors) {
			isSubmitting = true;
			const res = await fetch('/api/rfq/new', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ rfq })
			});

			if (res.status === 200) {
				submitted = true;
			}
		}
	}

	async function loadCustomerRfqs() {
		const { data } = await supabase
			.from('rfqs')
			.select('*, customer(*), rfqs_products(*, product(number), rfqs_products_quantities(*))')
			.eq('customer', rfq.customer.id);

		customerRfqs = data;
	}

	async function reloadPage() {
		window.location.reload();
	}

	function handleCompanySelection(event) {
		customerSelected = true;
		rfq.customer = event.detail;
	}

	function handleCreateNewCustomer(event) {
		customerSelected = false;
	}

	function extractCompanyName(item) {
		return item?.name;
	}

	async function getCustomersQuery(searchValue) {
		const { data: queryData, error } = await supabase
			.from('customers')
			.select('*')
			.like('name', `%${searchValue}%`);

		return queryData;
	}

	$: if (rfq.customer.id) loadCustomerRfqs();
</script>

<svelte:head>
	<title>Add RFQ</title>
</svelte:head>

<div class="flex h-screen w-screen justify-center overflow-y-auto">
	<div class="flex flex-col">
		{#if !submitted}
			<h1 class="text-3xl mb-8 mt-8">Add RFQ</h1>
			<div class="flex flex-row space-x-5 mb-5">
				<div class="flex flex-col">
					<label for="customer_name">Customer Name</label>
					<Autocomplete
						query={getCustomersQuery}
						bind:value={rfq.customer.name}
						extractItemName={extractCompanyName}
						on:selection={handleCompanySelection}
						on:create={handleCreateNewCustomer}
						forceCaps
					/>
					{#if hasErrors(errors, ['customer', 'name'])}
						<label for="trim" class="label">
							<span class="label-text-alt text-error">Required</span>
						</label>
					{/if}
				</div>

				<div class="flex flex-col">
					<label for="customer_number">Customer Number</label>
					<TextInput disabled={customerSelected} bind:value={rfq.customer.customer_number} />
				</div>
				<div class="flex flex-col">
					<label for="received_at">Date Received</label>
					<DateInput bind:value={rfq.received_at} />
					{#if hasErrors(errors, ['received_at'])}
						<label for="trim" class="label">
							<span class="label-text-alt text-error">Required</span>
						</label>
					{/if}
				</div>
			</div>
			<div class="flex flex-row space-x-5 mb-5">
				<div class="flex flex-col">
					<label for="return_date">Person Name</label>
					<TextInput bind:value={rfq.person_name} />
				</div>
				<div class="flex flex-col">
					<label for="customer_email">Customer Email</label>
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
				</div>
			</div>

			<Products
				bind:rfqs_products={rfq.rfqs_products}
				showRemove
				{supabase}
				{errors}
				bind:createdProductsIndexes
			/>

			<p class="text-lg mt-10 font-medium">Notes</p>
			<Textarea bind:value={rfq.notes} />

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

			<div class="pt-10 pb-16">
				<p>Recent RFQS by Customer</p>
				{#if customerRfqs?.length > 0}
					<Table
						data={customerRfqs?.sort((a, b) => new Date(b.received_at) - new Date(a.received_at))}
					/>
				{:else}
					<p>No RFQs</p>
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
