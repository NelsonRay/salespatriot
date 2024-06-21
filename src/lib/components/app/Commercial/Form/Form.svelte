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
	import Table from './Table.svelte';
	import StatusSelect from '$lib/components/form/StatusSelect.svelte';
	import { commercialTags } from '$lib/tags';
	import RemoveComOptionSelect from '$lib/components/form/RemoveComOptionSelect.svelte';
	import Download from '$lib/icons/Download.svg';
	import OrderPlacedTable from '../OrderPlacedTable/OrderPlacedTable.svelte';
	import Remove from '$lib/icons/Remove.svg';

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
	export let partLaborMinutes;
	export let deleteForm;

	let focusedRfqPartQty;
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
	let createdPartsIndexes = [];

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

			for (let i = 0; i < values.rfqs_parts.length; i++) {
				if (!values.rfqs_parts[i].part?.id && !createdPartsIndexes.includes(i)) {
					errors = [...(errors ?? []), { path: ['rfqs_parts', i, 'part', 'number'] }];
				}
			}
		}

		if (!errors) {
			submitCallback();
		}
	}

	async function downloadFile(fileName) {
		const { data: file, error } = await supabase.storage
			.from('email_attachments')
			.download(data.email.id + '/' + fileName);

		if (error) {
			console.error('Error downloading file:', error);
			return;
		}

		const url = URL.createObjectURL(file);
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', fileName);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	function formatEmailText(email) {
		let content = '';

		if (email.html && email.html != 'false') {
			content = email.html;
		} else if (email.text_as_html) {
			content = email.text_as_html;
		} else {
			content = email.text;
		}

		let formattedContent;

		if (email.in_reply_to) {
			formattedContent =
				'From:' +
				content
					.replace(/\n/g, '<br>')
					.split('From:')
					.slice(1)
					.join('')
					.split('<br>')
					.filter((e) => e.trim() != '')
					.join('<br>');
		} else {
			formattedContent = content;
		}

		return formattedContent;
	}

	function filterAttachments(attachments) {
		return attachments.filter((a) => !['.png', '.jpg'].some((e) => a.name.includes(e)));
	}

	$: reviewValues = getCommercialValueCalculation(focusedRfqPartQty);
</script>

{#if values}
	<div class="parent">
		<div class="one px-4 pt-4 overflow-auto">
			<div class="flex flex-row justify-between">
				<button on:click={goBack}>
					<div class="flex flex-row items-center p-2 rounded-md bg-neutral-50">
						<img src={Arrow} alt="1" class="h-5 w-5" />
						<p class="mb-[0.5px]">Go Back</p>
					</div>
				</button>
				{#if form?.type == 'confirm'}
					<button
						class="flex flex-row items-center p-2 rounded-md bg-red-400 space-x-2"
						on:click={deleteForm}
					>
						<p class="text-white text-sm">Delete</p>
						<img src={Remove} alt="edit" class="h-5 w-5" />
					</button>
				{/if}
			</div>
			<div class="pl-2 pt-3 space-y-5">
				{#if ['final_pricing', 'enter_quote', 'bid', 'follow_up', 'enter_sales_order', null, undefined].includes(form?.type)}
					<Info
						data={form?.type == null ? data : data.rfq}
						{reviewValues}
						showValueCalc={['final_pricing', null, undefined].includes(form?.type)}
						bind:awardModalOpen
						disableAwardEdit={!(form?.type == null)}
					/>

					{#if form?.type === 'enter_sales_order'}
						<div class="mr-5">
							<p class="text-lg mt-5 mb-2 font-semibold">Placed Order</p>
							<OrderPlacedTable data={data.rfq.rfqs_parts} />
						</div>
					{/if}

					<div class="mr-5">
						<p class="text-lg mt-5 mb-2 font-semibold">Notes</p>
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
							bind:rfqs_parts={values.rfqs_parts}
							{showRemove}
							showPurchasing={['purchasing', 'final_pricing', null, undefined].includes(form?.type)}
							showPricing={['final_pricing', null, undefined].includes(form?.type)}
							showAll={['enter_quote', 'bid', 'follow_up', 'enter_sales_order'].includes(
								form?.type
							)}
							{errors}
							bind:focusedRfqPartQty
						/>
					</div>
				{/if}
				{#if ['labor', 'purchasing'].includes(form?.type)}
					<div>
						<p class="mb-1">Part Number</p>
						<TextInput value={data?.part?.number} disabled fullWidth={false} />
					</div>
					<div>
						<p class="mb-1">Part NSN</p>
						<TextInput value={data?.part?.nsn} disabled fullWidth={false} />
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
								class="btn px-6 py-2 rounded-3xl text-xs bg-yellow-400 shadow-md {data?.waiting
									? 'opacity-40'
									: ''}"
								disabled={data.waiting}
								on:click={waitingCallback}>Waiting</button
							>
						</div>
					{/if}
					<div>
						<p class="text-lg mt-5 mb-2 font-semibold">Comments</p>
						<Comments {comments} {commentSubmitCallback} />
					</div>

					{#if form?.type == 'labor'}
						<p>Previously Recorded Labor Minutes:</p>
						{#if partLaborMinutes?.length > 0}
							<Table data={partLaborMinutes} />
						{:else}
							<p>None</p>
						{/if}
					{/if}
				{/if}
				{#if form?.type === 'confirm'}
					<div class="flex flex-col space-y-5">
						{#if data.email}
							<div class="flex flex-col space-y-2">
								<p class="font-medium">Email:</p>
								{#if data.email}
									<p class="text-sm">
										{@html formatEmailText(data.email)}
									</p>
									{#if filterAttachments(data.email.attachments)?.length > 0}
										<p class="font-medium">Download files from email:</p>
										<ul>
											{#each filterAttachments(data.email.attachments) as attachment}
												<li>
													<button
														class="bg-neutral-100 p-2 rounded-md"
														on:click={() => downloadFile(attachment.name)}
													>
														<div class="flex flex-row justify-center items-center space-x-2">
															<p>
																{attachment.name}
															</p>
															<img src={Download} alt="download" class="w-4 h-4" />
														</div>
													</button>
												</li>
											{/each}
										</ul>
									{/if}
								{/if}
							</div>
						{/if}
						{#if data.rfq_public}
							<div>
								<p class="font-medium">
									{'Company: ' + data.rfq_public.values.customer.name}
								</p>
							</div>
						{/if}
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

					{#if data.rfq_public}
						<PublicPartsTable data={data.rfq_public.values} />
					{/if}

					<Products
						bind:rfqs_parts={values.rfqs_parts}
						showRemove
						{supabase}
						{errors}
						bind:createdPartsIndexes
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
						<div class="mb-2">
							<p class="mb-1 text-sm">Packaging Cost</p>
							<Currency bind:value={values['packaging_cost_' + i]} />
							{#if hasErrors(errors, ['packaging_cost_' + i])}
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
				{:else if form?.type === 'enter_sales_order'}
					<div>
						<p class="mb-1 text-sm">Award Status</p>
						<StatusSelect
							tags={commercialTags}
							status="enter_sales_order"
							bind:value={values.status}
						/>
						{#if hasErrors(errors, ['status'])}
							<label for="trim" class="label">
								<span class="label-text-alt text-error">Required</span>
							</label>
						{/if}
					</div>
				{:else if form?.type === 'follow_up'}
					<div class="mb-2">
						<div class="mb-6">
							<p class="mb-1">Followed up and waiting on response?</p>
							<button
								class="px-4 py-1 rounded-3xl text-xs bg-yellow-400 shadow-md {data?.waiting
									? 'opacity-40'
									: ''}"
								disabled={data.waiting}
								on:click={waitingCallback}>Waiting</button
							>
						</div>
						<p class="mb-1 text-sm">Award Status</p>
						<StatusSelect tags={commercialTags} status="response" bind:value={values.status} />
						{#if hasErrors(errors, ['quote_number'])}
							<label for="trim" class="label">
								<span class="label-text-alt text-error">Required</span>
							</label>
						{/if}

						{#if values?.status?.includes('response:placed_order')}
							<div class="flex flex-col space-y-2">
								<div class="flex flex-col space-y-2">
									{#each values.rfqs_parts as rfqs_part, i}
										<div
											class="flex flex-row justify-between items-center space-x-5 bg-neutral-100 p-3 rounded-lg"
										>
											<p>{rfqs_part.part.number}</p>
											<div>
												<p class="mb-1 text-sm">Quantity:</p>
												<Currency bind:value={rfqs_part.quantity_ordered} width={'w-24'} />
												{#if hasErrors(errors, ['rfqs_parts', i, 'quantity_ordered'])}
													<label for="trim" class="label">
														<span class="label-text-alt text-error">Required</span>
													</label>
												{/if}
											</div>
											<div>
												<p class="mb-1 text-sm">Unit Price:</p>
												<Currency bind:value={rfqs_part.unit_price_ordered} width={'w-24'} />
												{#if hasErrors(errors, ['rfqs_parts', i, 'unit_price_ordered'])}
													<label for="trim" class="label">
														<span class="label-text-alt text-error">Required</span>
													</label>
												{/if}
											</div>
										</div>
									{/each}
								</div>
								<div class="flex flex-row space-x-5">
									<div>
										<p class="mb-1 text-sm">Ordered Date</p>
										<DateInput bind:value={values.date_ordered} preventFutureDates={false} />
										{#if hasErrors(errors, ['date_ordered'])}
											<label for="trim" class="label">
												<span class="label-text-alt text-error">Required</span>
											</label>
										{/if}
									</div>
									<div>
										<p class="mb-1 text-sm">Due Date</p>
										<DateInput bind:value={values.due_date} preventFutureDates={false} />
										{#if hasErrors(errors, ['due_date'])}
											<label for="trim" class="label">
												<span class="label-text-alt text-error">Required</span>
											</label>
										{/if}
									</div>
								</div>
							</div>
						{/if}
						{#if values?.status?.includes('response:lost') || values?.status?.includes('response:assumed_lost')}
							<div>
								<p class="mb-1 text-sm">Reason Lost</p>
								<RemoveComOptionSelect bind:value={values.reason_lost} />
								{#if hasErrors(errors, ['reason_lost'])}
									<label for="trim" class="label">
										<span class="label-text-alt text-error">Required</span>
									</label>
								{/if}
							</div>
						{/if}

						<div>
							<p class="mb-1 text-sm">Notes</p>
							<Textarea autoCollapse={false} bind:value={values.order_notes} />
						</div>
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
