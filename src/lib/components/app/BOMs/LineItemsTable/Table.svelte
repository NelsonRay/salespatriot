<script>
	// @ts-nocheck
	import { formatCurrency, formatMonthDayYearDate } from '$lib/helpers';
	import { page } from '$app/stores';
	import Edit from '$lib/icons/Edit.svg';
	import LastQuote from '$lib/components/app/BOMs/LineItemsTable/LastQuote.svelte';
	import LastPO from '$lib/components/app/BOMs/LineItemsTable/LastPO.svelte';

	export let data;
	export let selectedVendor;
	export let selectedPart;
	export let selectedPartForInstructions;
	export let selectedBomPartForQuote;
	export let selectedPartForComment;
	export let isSelectingParts;
	export let selectedPartForAllQuotes;
	export let selectedQuoteForAllQuotes;
	export let selectedPartForAllPOs;
	export let selectedPOForAllPOs;
	export let selectedPartForUnitPrice;
	export let selectedPartForLeadTime;
	export let updateUseQuote;
	export let selectedParts;

	let columns = [
		{ type: 'checkbox' },
		{ type: 'position', header: '#' },
		{ type: 'level', header: 'Level' },
		{ type: 'part', field: 'number', header: 'Part Number' },
		{ type: 'part', field: 'description', header: 'Part Description' },
		{ type: 'part', field: 'vendor_instructions', header: 'Vendor Instructions' },
		{ type: 'part', field: 'source', header: 'Source' },
		{ type: 'boms_part', field: 'quantity', header: 'Quantity' },
		{ type: 'part', field: 'uom', header: 'UOM' },
		{ type: 'field', field: 'on_hand', header: 'On Hand' },
		{ type: 'field', field: 'on_order', header: 'On Order' },
		{ type: 'field', field: 'required', header: 'Required' },
		{ type: 'field', field: 'bom_net', header: 'BOM Net' },
		{ type: 'vendor', field: 'name', header: 'Vendor Name' },
		{ type: 'vendor', field: 'email', header: 'Email' },
		{ type: 'unit_price', header: 'Unit Price' },
		{ type: 'ext_price', header: 'Ext. Price' },
		{ type: 'lead_time', field: 'lead_time', header: 'Lead Time' },
		{ type: 'parts_quotes_quantity', header: 'Last Quote' },
		{ type: 'parts_po_history', header: 'Last PO' },
		{ type: 'comments', header: 'Comments' }
		// { type: 'email_status', header: 'Email Status' },
		// { type: 'email_sent', header: 'Email Sent' },
	];

	if ($page.url.origin == 'http://localhost:5173') {
		columns = [...columns, { type: 'field', field: 'id', header: 'ID' }];
	}

	export function tableFieldMapper(obj, column) {
		let value;

		if (column.type === 'position') {
		} else if (column.type === 'level') {
			value = obj?.boms_part?.level;

			for (let i = 0; i < obj?.boms_part?.level - 1; i++) {
				value = `-${value}`;
			}
		} else if (column.type === 'part') {
			value = obj?.boms_part?.part?.[column?.field];
		} else if (column.type === 'comments') {
			value = obj?.comments;
		} else if (column.type === 'vendor') {
			value = obj?.vendor?.[column?.field];
		} else if (column.type === 'boms_part') {
			value = obj?.boms_part?.[column?.field];
		} else if (column.type === 'field') {
			value = obj?.[column?.field];
		} else if (column.type === 'status') {
			if (obj?.vendor) {
				value = obj?.boms_part?.part?.parts_quotes[0]?.parts_quotes_quantities?.length > 0;
			} else {
				value = null;
			}
		} else if (column.type === 'date_received') {
			value = obj?.boms_part?.part?.parts_quotes[0]?.date_received;

			if (value != null) {
				value = formatMonthDayYearDate(value);
			} else {
				value = null;
			}
		} else if (column.type === 'email_status') {
			if (obj?.boms_part?.part?.parts_quotes[0]?.email_sent_at) {
				value = obj?.boms_part?.part?.parts_quotes[0]?.complete;
			}
		} else if (column.type === 'email_sent') {
			value = obj?.boms_part?.part?.parts_quotes[0]?.email_sent_at;

			if (value != null) {
				value = formatMonthDayYearDate(value);
			} else {
				value = null;
			}
		} else if (column.type === 'parts_quotes') {
			value = obj?.boms_part?.part?.parts_quotes[0]?.[column.field];

			if (column.field === 'moc' && !!value) {
				value = formatCurrency(value);
			}
		} else if (column.type == 'unit_price') {
			value = obj?.unit_price;

			if (value) {
				value = formatCurrency(value);
			}
		} else if (column.type == 'ext_price') {
			if (obj?.use_quote != null) {
				value = formatCurrency(
					(obj.use_quote ? obj?.parts_quotes_quantity : obj?.parts_po_history)?.unit_price *
						obj?.boms_part?.quantity
				);
			} else {
				value = '';
			}
		} else if (column.type == 'lead_time') {
			value = obj?.lead_time;
		}

		return { header: column.header, value };
	}

	function toggleSelectingPart(part) {
		if (isPartDisabled(part)) return;

		if (!selectedParts.includes(part?.id)) {
			selectedParts = [...selectedParts, part?.id];
		} else {
			selectedParts = selectedParts.filter((p) => p != part?.id);
		}
	}

	function isPartDisabled(obj) {
		return !obj?.vendor?.email || obj?.use_quote != null;
	}

	function getClass(obj, selectedPartsById, isSelectingParts) {
		let trClass = '';

		if (!isSelectingParts) {
			if (obj.use_quote != null) {
				if (obj.use_quote && !obj?.parts_quotes_quantity?.parts_quote?.complete) {
					trClass = 'bg-yellow-200';
				} else {
					trClass = 'bg-green-100';
				}
			}

			if (!obj?.vendor) {
				trClass = 'bg-neutral-200';
			}

			return (trClass += ' hover:bg-neutral-100');
		} else {
			if (selectedPartsById.includes(obj?.id)) {
				trClass = 'bg-blue-50';
			}

			if (isPartDisabled(obj)) {
				trClass = 'bg-neutral-200';
			}

			return trClass;
		}
	}

	function handleClick(callback) {
		if (!isSelectingParts) callback();
	}
</script>

<article
	class="bg-white w-[100%] h-full overflow-scroll scrollbar-gutter-stable pb-20"
	style="direction: ltr;"
>
	<table class="text-left w-[100%] border-separate border-spacing-0 overflow-scroll text-xs">
		<thead class="h-[32px] sticky bg-white" style="inset-block-start: 0;">
			{#each columns as column}
				{#if column.type === 'checkbox'}
					{#if isSelectingParts}
						<th>
							<input type="checkbox" disabled />
						</th>
					{/if}
				{:else}
					<th class={column.type === 'position' ? 'text-center' : ''}
						>{tableFieldMapper(undefined, column).header}</th
					>
				{/if}
			{/each}
		</thead>
		<tbody>
			{#each data as obj, index (obj.id)}
				<tr
					class={getClass(obj, selectedParts, isSelectingParts)}
					on:click={() => toggleSelectingPart(obj)}
				>
					{#each columns as column}
						{#if column.type === 'checkbox'}
							{#if isSelectingParts}
								<td>
									<input
										type="checkbox"
										checked={selectedParts.includes(obj.id)}
										disabled={!obj?.vendor?.email}
									/>
								</td>
							{/if}
						{:else if column.type === 'position'}
							<td class="text-center">{index + 1}</td>
						{:else if column.field === 'number'}
							<td>
								{tableFieldMapper(obj, column).value ?? ''}
							</td>
						{:else if column.type === 'vendor' && column.field === 'name'}
							<td>
								<p>
									{tableFieldMapper(obj, column).value ?? 'LABOR & OVERHEAD'}
								</p>
							</td>
						{:else if column.type === 'vendor' && column.field === 'email'}
							<td
								class={tableFieldMapper(obj, column).value ? '' : 'bg-gray-200'}
								on:click={() => handleClick(() => (selectedVendor = obj?.vendor))}
							>
								{#if obj?.vendor}
									<div class="flex flex-row justify-between pr-1 items-center space-x-5">
										{#if tableFieldMapper(obj, column).value}
											{tableFieldMapper(obj, column).value ?? ''}
										{/if}
										<div class="h-3 w-3">
											<img src={Edit} alt="open" class="h-3 w-3" />
										</div>
									</div>
								{:else}
									<p class={tableFieldMapper(obj, column).value ? '' : 'text-gray-400'}>
										{tableFieldMapper(obj, column).value ?? '---'}
									</p>
								{/if}
							</td>
						{:else if column.field === 'description' || column.field === 'vendor_instructions'}
							<td
								on:click={() =>
									handleClick(() =>
										column.field === 'description'
											? (selectedPart = obj?.boms_part?.part)
											: (selectedPartForInstructions = obj?.boms_part?.part)
									)}
							>
								<div class="flex flex-row justify-between pr-1 items-center">
									{#if tableFieldMapper(obj, column).value}
										<p class="mr-2 text-wrap max-w-44">
											{tableFieldMapper(obj, column).value}
										</p>
									{/if}
									<div class="h-3 w-3">
										<img src={Edit} alt="open" class="h-3 w-3" />
									</div>
								</div>
							</td>
						{:else if column.type === 'parts_quotes_quantity'}
							<td
								class={obj.use_quote == true
									? obj?.parts_quotes_quantity?.parts_quote?.complete
										? 'bg-green-200'
										: 'bg-yellow-300'
									: ''}
							>
								{#if obj?.vendor}
									<div class="flex flex-row justify-between pr-1 items-center space-x-5">
										<LastQuote
											data={obj?.parts_quotes_quantity}
											callback={() => updateUseQuote(obj, true)}
										/>
										<button
											on:click={() =>
												handleClick(() => {
													selectedPartForAllQuotes = obj;
													selectedQuoteForAllQuotes = obj?.parts_quotes_quantity;
												})}
										>
											<img src={Edit} alt="open" class="h-3 w-3" />
										</button>
									</div>
								{:else}
									<p class="text-gray-400">---</p>
								{/if}
							</td>
						{:else if column.type === 'parts_po_history'}
							<td class={obj.use_quote == false ? 'bg-green-200' : ''}>
								{#if obj?.vendor}
									<div class="flex flex-row justify-between pr-1 items-center space-x-5">
										<LastPO
											data={obj?.parts_po_history}
											callback={() => updateUseQuote(obj, false)}
										/>
										<button
											on:click={() =>
												handleClick(() => {
													selectedPartForAllPOs = obj;
													selectedPOForAllPOs = obj?.parts_po_history;
												})}
										>
											<img src={Edit} alt="open" class="h-3 w-3" />
										</button>
									</div>
								{:else}
									<p class="text-gray-400">---</p>
								{/if}
							</td>
						{:else if column.field === 'email'}
							<td>
								<div class="flex flex-row justify-between pr-1 items-center space-x-5">
									{#if tableFieldMapper(obj, column).value}
										{tableFieldMapper(obj, column).value ?? ''}
									{/if}
									<button on:click={() => handleClick(() => (selectedVendor = obj?.vendor))}>
										<img src={Edit} alt="open" class="h-3 w-3" />
									</button>
								</div>
							</td>
						{:else if column.type === 'unit_price'}
							<td>
								<div class="flex flex-row justify-between pr-1 items-center space-x-5">
									{#if tableFieldMapper(obj, column).value}
										{tableFieldMapper(obj, column).value ?? ''}
									{/if}
									<button on:click={() => handleClick(() => (selectedPartForUnitPrice = obj))}>
										<img src={Edit} alt="open" class="h-3 w-3" />
									</button>
								</div>
							</td>
						{:else if column.type === 'lead_time'}
							<td>
								<div class="flex flex-row justify-between pr-1 items-center space-x-5">
									{#if tableFieldMapper(obj, column).value}
										{tableFieldMapper(obj, column).value ?? ''}
									{/if}
									<button on:click={() => handleClick(() => (selectedPartForLeadTime = obj))}>
										<img src={Edit} alt="open" class="h-3 w-3" />
									</button>
								</div>
							</td>
						{:else if column.type === 'email_status'}
							<td>
								{#if tableFieldMapper(obj, column).value}
									<div class="p-1 rounded-md inline-block bg-green-300 text-xs">Complete</div>
								{:else if tableFieldMapper(obj, column).value != null}
									<div class="p-1 rounded-md inline-block bg-yellow-300 text-xs">Waiting</div>{/if}
							</td>
						{:else if column.type === 'status'}
							<td>
								{#if tableFieldMapper(obj, column).value}
									<div class="p-1 rounded-md inline-block bg-green-300 text-xs">Complete</div>
								{:else if tableFieldMapper(obj, column).value != null}
									<div class="flex flex-row justify-between pr-1 items-center space-x-5">
										<div class="p-1 rounded-md inline-block bg-yellow-300 text-xs">Waiting</div>
										<button
											on:click={() => handleClick(() => (selectedBomPartForQuote = obj?.boms_part))}
										>
											<img src={Edit} alt="open" class="h-3 w-3" />
										</button>
									</div>
								{/if}
							</td>
						{:else if column.type === 'comments'}
							<td on:click={() => (selectedPartForComment = obj)}>
								<div class="flex flex-row justify-between pr-1 items-center space-x-5">
									{#if tableFieldMapper(obj, column).value}
										{tableFieldMapper(obj, column).value ?? ''}
									{/if}
									<div class="h-3 w-3">
										<img src={Edit} alt="open" class="h-3 w-3" />
									</div>
								</div>
							</td>
						{:else}
							<td>
								<p>
									{tableFieldMapper(obj, column).value ?? ''}
								</p>
							</td>
						{/if}
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</article>

<style>
	th {
		border-bottom: 1px solid #e0e0e0;
		border-top: 1px solid #e0e0e0;
		white-space: nowrap;
		border: 0.2px solid gainsboro;
		padding: 4px;
	}

	td {
		border: 0.2px solid gainsboro;
		white-space: nowrap;
		padding: 4px;
	}
</style>
