<script>
	// @ts-nocheck
	import TextInput from '$lib/components/form/TextInput.svelte';
	import Autocomplete from '$lib/components/form/Autocomplete.svelte';
	import DateInput from '$lib/components/form/DateInput.svelte';
	import Currency from '$lib/components/form/Currency.svelte';
	import Comments from '$lib/components/form/Comments.svelte';
	import Arrow from '$lib/icons/Arrow.svg';
	import Info from '$lib/components/app/Commercial/Info/Info.svelte';
	import Products from '$lib/components/app/Commercial/Products/Products.svelte';
	import { capitalizeFirstLetter } from '$lib/helpers';
	import { commercialFormsValidation, masterCommercialValidation } from '$lib/validation';
	import { getCommercialValueCalculation } from '$lib/utils/calculations';
	import { hasErrors } from '$lib/utils/errors';
	import PublicPartsTable from '$lib/components/app/Commercial/PublicPartsTable/PublicPartsTable.svelte';
	import RFQsTable from '$lib/components/app/Commercial/RFQsTable/RFQsTable.svelte';
	import Textarea from '$lib/components/form/Textarea.svelte';

	export let data;
	export let comments;
	export let values;
	export let form = null;
	export let showRemove = false;
	export let submitCallback;
	export let waitingCallback;
	export let isSubmitting;
	export let commentSubmitCallback;
	export let supabase = undefined;
	export let rfqsForPurchasingForm = undefined;
	export let awardModalOpen;

	let focusedRfqProductQty;
	let reviewValues;
	let errors;

	function goBack() {
		history.back();
	}

	function getFormTitle(type) {
		if (type == null) return '';
		return `${type
			.split('_')
			.map((e) => capitalizeFirstLetter(e))
			.join(' ')} Form`;
	}

	let customerSelected = true;
	let createdProductsIndexes = [];

	function handleCompanySelection(event) {
		customerSelected = true;
		const { email_address, phone_number, ...rest } = event.detail;
		values.customer = {
			...rest,
			email_address: values?.customer?.email_address || email_address,
			phone_number: values?.customer?.phone_number || phone_number
		};
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

	function handleSubmit() {
		let validationObj;

		validationObj =
			form != null ? commercialFormsValidation[form.type]() : masterCommercialValidation();
		const results = validationObj?.safeParse(values);
		errors = results?.error?.issues;

		if (form?.type === 'confirm') {
			if (!values.customer.id && customerSelected) {
				errors = [...(errors ?? []), { path: ['customer', 'name'] }];
			}

			for (let i = 0; i < values.rfqs_products.length; i++) {
				if (!values.rfqs_products[i].product?.id && !createdProductsIndexes.includes(i)) {
					errors = [...(errors ?? []), { path: ['rfqs_products', i, 'product', 'number'] }];
				}
			}
		}

		if (!errors) {
			submitCallback();
		}
	}

	$: reviewValues = getCommercialValueCalculation(
		focusedRfqProductQty,
		(form?.type == null ? values : values.rfq)?.rfqs_products?.filter(
			(p) => p?.id === focusedRfqProductQty?.rfqs_product
		)[0]
	);
</script>

{#if values}
	<div class="parent">
		<div class="one pl-4 pt-4 overflow-auto">
			<div>
				<button on:click={goBack}>
					<div class="flex flex-row items-center p-2 rounded-md bg-neutral-50">
						<img src={Arrow} alt="1" class="h-5 w-5" />
						<p class="mb-[0.5px]">Go Back</p>
					</div>
				</button>
			</div>
			<div class="pl-2 pt-3 space-y-5">
				{#if ['final_pricing', 'enter_quote', 'bid', null, undefined].includes(form?.type)}
					<Info
						data={form?.type == null ? data : data.rfq}
						{reviewValues}
						showValueCalc={['final_pricing', null, undefined].includes(form?.type)}
						bind:awardModalOpen
					/>

					<div class="mr-5">
						<p class="text-lg mt-5 font-semibold">Notes</p>
						{#if (form?.type == null ? data : data.rfq)?.notes}
							<Textarea value={(form?.type == null ? data : data.rfq)?.notes} disabled />
						{:else}
							<p>None</p>
						{/if}
					</div>

					<div>
						<p class="text-lg mt-5 mb-2 font-semibold">Comments</p>
						<Comments {comments} {commentSubmitCallback} />
					</div>

					<div>
						<Products
							bind:rfqs_products={values.rfqs_products}
							{showRemove}
							showPurchasing={['purchasing', 'final_pricing', null, undefined].includes(form?.type)}
							showPricing={['final_pricing', null, undefined].includes(form?.type)}
							showAll={['enter_quote', 'bid'].includes(form?.type)}
							{errors}
							bind:focusedRfqProductQty
						/>
					</div>
				{/if}
				{#if ['labor', 'purchasing'].includes(form?.type)}
					<div>
						<p class="mb-1">Product Number</p>
						<TextInput value={data?.product?.number} disabled fullWidth={false} />
					</div>
					<div>
						<p class="mb-1">Product NSN</p>
						<TextInput value={data?.product?.nsn} disabled fullWidth={false} />
					</div>
					<div>
						<p class="mb-1">Cross Ref</p>
						<TextInput value={data?.cross_reference} disabled fullWidth={false} />
					</div>
					{#if form?.type === 'purchasing'}
						<div>
							<RFQsTable data={rfqsForPurchasingForm ?? []} />
						</div>
						<div>
							<p class="mb-1">Waiting on Vendors?</p>
							<button
								class="btn px-6 py-2 rounded-3xl text-xs bg-yellow-400 shadow-md"
								disabled={data.waiting}
								on:click={waitingCallback}>Waiting</button
							>
						</div>
					{/if}
					<div>
						<p class="text-lg mt-5 mb-2 font-semibold">Comments</p>
						<Comments {comments} {commentSubmitCallback} />
					</div>
				{/if}
				{#if form?.type === 'confirm'}
					<div class="flex flex-col space-y-5">
						<div>
							<p class="font-medium">
								{'Company: ' + data.rfq_public.values.customer.name}
							</p>
						</div>
						<div class="flex flex-row space-x-5">
							<div class="flex flex-col">
								<label for="customer_name">Customer Name</label>
								<Autocomplete
									query={getCustomersQuery}
									bind:value={values.customer.name}
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
								<TextInput
									disabled={customerSelected}
									bind:value={values.customer.customer_number}
								/>
							</div>
						</div>
						<div class="flex flex-row space-x-5">
							<div class="flex flex-col">
								<label for="customer_email">Person Name</label>
								<TextInput bind:value={values.person_name} />
							</div>
							<div class="flex flex-col">
								<label for="customer_email">Customer Email</label>
								<TextInput bind:value={values.customer.email_address} />
							</div>
							<div class="flex flex-col">
								<label for="customer_email">Phone Number</label>
								<TextInput bind:value={values.customer.phone_number} />
							</div>
						</div>
						<div class="flex flex-row space-x-5">
							<div class="flex flex-col">
								<label for="received_at">Date Received</label>
								<DateInput bind:value={values.received_at} />
								{#if hasErrors(errors, ['received_at'])}
									<label for="trim" class="label">
										<span class="label-text-alt text-error">Required</span>
									</label>
								{/if}
							</div>
						</div>
					</div>

					<PublicPartsTable data={data.rfq_public.values} />

					<Products
						bind:rfqs_products={values.rfqs_products}
						showRemove
						{supabase}
						{errors}
						bind:createdProductsIndexes
					/>

					<div class="mr-5">
						<p class="text-lg mt-10 font-medium">Notes</p>
						<Textarea bind:value={values.notes} />
					</div>
				{/if}
			</div>
		</div>
		<div class="two bg-neutral-50">
			<div class="flex flex-col p-6 space-y-5">
				<p class="text-gray-400 mb-2 font-medium">{getFormTitle(form?.type)}</p>
				{#if form?.type === 'labor'}
					<div class="mb-2">
						<p class="mb-1 text-sm">Labor Minutes</p>
						<Currency bind:value={values.labor_minutes} />
						{#if hasErrors(errors, ['labor_minutes'])}
							<label for="trim" class="label">
								<span class="label-text-alt text-error">Required</span>
							</label>
						{/if}
					</div>
				{:else if form?.type === 'purchasing'}
					{#each ['5', '25', '50', '100', '250'] as i}
						<p class="font-medium">Quantity: {i}</p>
						<div class="mb-2">
							<p class="mb-1 text-sm">Material Cost</p>
							<Currency bind:value={values['material_cost_' + i]} />
							{#if hasErrors(errors, ['material_cost_' + i])}
								<label for="trim" class="label">
									<span class="label-text-alt text-error">Required</span>
								</label>
							{/if}
						</div>
						<div class="mb-2">
							<p class="mb-1 text-sm">Lead Time</p>
							<Currency bind:value={values['lead_time_' + i]} />
							{#if hasErrors(errors, ['lead_time_' + i])}
								<label for="trim" class="label">
									<span class="label-text-alt text-error">Required</span>
								</label>
							{/if}
						</div>
					{/each}
				{:else if form?.type === 'enter_quote'}
					<div class="mb-2">
						<p class="mb-1 text-sm">Quote Number</p>
						<TextInput bind:value={values.quote_number} fullWidth={false} />
						{#if hasErrors(errors, ['quote_number'])}
							<label for="trim" class="label">
								<span class="label-text-alt text-error">Required</span>
							</label>
						{/if}
					</div>
				{/if}
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
			</div>
		</div>
	</div>
{/if}

<style>
	.parent {
		position: relative;
		width: 100%;
		height: 100vh;
		/* color: #fff; */
	}

	.one {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		width: 60%;
		display: flex;
		flex-direction: column;
		/* background: #333; */
	}
	.two {
		position: absolute;
		top: 0;
		left: 60%;
		bottom: 0;
		width: 40%;
		overflow-y: auto;
		/* background: #999; */
		/* height: 120%; */
	}
</style>
