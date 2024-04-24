<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { formatMonthDayYearDate, calculateDaysDifference } from '$lib/helpers';
	import PoTable from './POTable.svelte';
	import Autocomplete from '$lib/components/form/Autocomplete.svelte';
	import { hasErrors } from '$lib/utils/errors.js';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import DateInput from '$lib/components/form/DateInput.svelte';
	import Currency from '$lib/components/form/Currency.svelte';
	import Textarea from '$lib/components/form/Textarea.svelte';
	import { createPO } from '$lib/validation';

	export let open;
	export let selectedPartForAllPOs;
	export let selectedPOForAllPOs;
	export let submitCallback;
	export let supabase;

	let parts_po_history = [];
	let isMounted = false;
	let creatingPO = false;
	let isSubmitting = false;

	let values = { vendor: {} };
	let errors;

	async function loadData(isMounted, selectedPartForAllPOs) {
		values = { vendor: {}, part: selectedPartForAllPOs?.boms_part?.part };
		if (isMounted && selectedPartForAllPOs) {
			let query = supabase
				.from('parts_po_history')
				.select('*, vendor(name)')
				.eq('part', selectedPartForAllPOs.boms_part.part.id);

			let { data, error } = await query;

			parts_po_history = data?.sort((a, b) => new Date(b.date_ordered) - new Date(a.date_ordered));
		} else {
			parts_po_history = undefined;
		}
	}

	async function handleSubmit(qtyId) {
		await submitCallback(qtyId || null);
	}

	async function getVendorsQuery(searchValue) {
		const { data: queryData, error } = await supabase
			.from('vendors')
			.select('*')
			.like('name', `%${searchValue}%`);

		return queryData;
	}

	async function handleCreatePO() {
		const results = createPO()?.safeParse(values);
		errors = results?.error?.issues;

		if (!errors) {
			isSubmitting = true;
			const {
				quantity,
				unit_price,
				lead_time,
				notes,
				uom,
				date_due,
				date_ordered,
				date_received,
				order_number
			} = values;

			const { data, error } = await supabase
				.from('parts_po_history')
				.insert({
					vendor: values.vendor.id,
					part: selectedPartForAllPOs.boms_part.part.id,
					order_number,
					date_received: date_received || null,
					date_ordered,
					date_due: date_due || null,
					quantity,
					unit_price,
					lead_time,
					uom,
					notes
				})
				.select('id')
				.limit(1)
				.single();

			if (error) {
				console.error(error);
			}

			await supabase
				.from('boms_quotes_parts')
				.update({ parts_po_history: data.id })
				.eq('id', selectedPartForAllPOs.id);

			window.location.reload();
		}
	}

	onMount(() => {
		isMounted = true;
	});

	$: loadData(isMounted, selectedPartForAllPOs);
</script>

{#if open}
	<div
		class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
	>
		<div class="relative w-2/3 h-1/2 my-6 mx-auto max-w-3xl">
			<div
				class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
			>
				<div class="flex items-start justify-between p-5 rounded-t">
					<h3 class="text-3xl text-gray-600 font-semibold">
						{!creatingPO ? 'PO History' : 'Add PO'}
					</h3>
					<button
						class="p-1 ml-auto bg-transparent border-0 text-gray-500 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
						on:click={() => (open = false)}
					>
						<span
							class="bg-transparent text-gray-500 opacity-4 h-6 w-6 text-2xl block outline-none focus:outline-none"
						>
							×
						</span>
					</button>
				</div>
				{#if !creatingPO}
					<div class="mx-4">
						<PoTable data={parts_po_history} {selectedPOForAllPOs} callback={handleSubmit} />
					</div>
				{:else}
					<div class="flex flex-col m-4">
						<div class="flex flex-row space-x-5 mb-5">
							<div class="flex flex-col">
								<label for="customer_name">Customer Name</label>
								<Autocomplete
									query={getVendorsQuery}
									bind:value={values.vendor.name}
									extractItemName={(item) => item?.name}
									on:selection={(event) => (values.vendor = event.detail)}
									preventCreate
									forceCaps
								/>
								{#if hasErrors(errors, ['vendor', 'id'])}
									<label for="trim" class="label">
										<span class="label-text-alt text-error">Required</span>
									</label>
								{/if}
							</div>
							<div class="flex flex-col">
								<label for="customer_name">Part</label>
								<TextInput bind:value={values.part.number} disabled />
								{#if hasErrors(errors, ['part', 'id'])}
									<label for="trim" class="label">
										<span class="label-text-alt text-error">Required</span>
									</label>
								{/if}
							</div>
							<div class="flex flex-col">
								<label for="customer_name">PO #</label>
								<TextInput bind:value={values.order_number} />
								{#if hasErrors(errors, ['order_number'])}
									<label for="trim" class="label">
										<span class="label-text-alt text-error">Required</span>
									</label>
								{/if}
							</div>
						</div>
						<div class="flex flex-row space-x-5 mb-5">
							<div class="flex flex-col">
								<label for="customer_name">Date Ordered</label>
								<DateInput bind:value={values.date_ordered} />
								{#if hasErrors(errors, ['date_ordered'])}
									<label for="trim" class="label">
										<span class="label-text-alt text-error">Required</span>
									</label>
								{/if}
							</div>
							<div class="flex flex-col">
								<label for="customer_name">Date Due</label>
								<DateInput bind:value={values.date_due} preventFutureDates={false} />
								{#if hasErrors(errors, ['date_due'])}
									<label for="trim" class="label">
										<span class="label-text-alt text-error">Required</span>
									</label>
								{/if}
							</div>
							<div class="flex flex-col">
								<label for="customer_name">Date Received</label>
								<DateInput bind:value={values.date_received} preventFutureDates={false} />
								{#if hasErrors(errors, ['date_received'])}
									<label for="trim" class="label">
										<span class="label-text-alt text-error">Required</span>
									</label>
								{/if}
							</div>
							<div class="flex flex-col">
								<label for="customer_name">Lead Time (Days)</label>
								<Currency bind:value={values.lead_time} width={'w-20'} />
								{#if hasErrors(errors, ['lead_time'])}
									<label for="trim" class="label">
										<span class="label-text-alt text-error">Required</span>
									</label>
								{/if}
							</div>
						</div>
						<div class="flex flex-row space-x-5 mb-5">
							<div class="flex flex-col">
								<label for="customer_name">Quantity</label>
								<Currency bind:value={values.quantity} />
								{#if hasErrors(errors, ['quantity'])}
									<label for="trim" class="label">
										<span class="label-text-alt text-error">Required</span>
									</label>
								{/if}
							</div>

							<div class="flex flex-col">
								<label for="customer_name">Unit Price</label>
								<Currency bind:value={values.unit_price} />
								{#if hasErrors(errors, ['unit_price'])}
									<label for="trim" class="label">
										<span class="label-text-alt text-error">Required</span>
									</label>
								{/if}
							</div>

							<div class="flex flex-col">
								<label for="customer_name">UOM</label>
								<TextInput bind:value={values.uom} />
								{#if hasErrors(errors, ['uom'])}
									<label for="trim" class="label">
										<span class="label-text-alt text-error">Required</span>
									</label>
								{/if}
							</div>
						</div>
						<div class="flex flex-col">
							<label for="customer_name">Notes</label>
							<Textarea bind:value={values.notes} autoCollapse={false} />
						</div>
					</div>
				{/if}

				{#if !isSubmitting}
					<button
						class="m-6 text-xs bg-neutral-100 rounded-lg p-3"
						on:click={() => (!creatingPO ? (creatingPO = true) : handleCreatePO())}
						>{!creatingPO ? 'Add PO' : 'Save'}</button
					>
				{/if}
			</div>
		</div>
	</div>
	<div class="opacity-25 fixed inset-0 z-40 bg-black"></div>
{/if}
