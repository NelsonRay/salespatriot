<script>
	// @ts-nocheck
	import { formatCurrency, formatMonthDayYearDate } from '$lib/helpers';
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
	export let selectedParts;

	const columns = [
		{ type: 'checkbox' },
		{ type: 'position', header: '#' },
		{ type: 'level', header: 'Level' },
		{ type: 'part', field: 'number', header: 'Part Number' },
		{ type: 'part', field: 'description', header: 'Part Description' },
		{ type: 'part', field: 'vendor_instructions', header: 'Vendor Instructions' },
		{ type: 'part', field: 'source', header: 'Source' },
		{ type: 'field', field: 'quantity', header: 'Quantity' },
		{ type: 'part', field: 'uom', header: 'UOM' },
		{ type: 'field', field: 'on_hand', header: 'On Hand' },
		{ type: 'field', field: 'bom_net', header: 'BOM Net' },
		{ type: 'vendor', field: 'name', header: 'Vendor Name' },
		{ type: 'vendor', field: 'email', header: 'Email' },
		{ type: 'parts_quotes_quantity', header: 'Last Quote' },
		{ type: 'parts_po_history', header: 'Last PO' },
		{ type: 'ext_price', header: 'Ext. Price' },
		{ type: 'comments', header: 'Comments' }
		// { type: 'email_status', header: 'Email Status' },
		// { type: 'email_sent', header: 'Email Sent' },
	];

	export function tableFieldMapper(obj, column) {
		let value;

		if (column.type === 'position') {
		} else if (column.type === 'level') {
			value = obj?.boms_part?.level;

			for (let i = 0; i < obj?.level - 1; i++) {
				value = `-${value}`;
			}
		} else if (column.type === 'part') {
			value = obj?.boms_part?.part?.[column?.field];
		} else if (column.type === 'comments') {
			value = obj?.comments;
		} else if (column.type === 'vendor') {
			value = obj?.boms_part?.vendor?.[column?.field];
		} else if (column.type === 'field') {
			value = obj?.boms_part?.[column?.field];
		} else if (column.type === 'status') {
			if (obj?.boms_part?.vendor) {
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
			const qtys = obj?.boms_part?.part?.parts_quotes[0]?.parts_quotes_quantities?.sort(
				(a, b) => a?.quantity - b?.quantity
			);

			if (qtys?.length > 0) {
				value = formatCurrency(qtys[0].unit_price);
			} else {
				value = '';
			}
		} else if (column.type == 'ext_price') {
			if (obj?.parts_quotes_quantity) {
				value = formatCurrency(obj?.parts_quotes_quantity?.unit_price * obj?.boms_part?.quantity);
			} else {
				value = '';
			}
		} else if (column.type == 'lead_time') {
			const qtys = obj?.boms_part?.part?.parts_quotes[0]?.parts_quotes_quantities?.sort(
				(a, b) => a?.quantity - b?.quantity
			);

			if (qtys?.length > 0) {
				value = qtys[0].lead_time ?? '';
			} else {
				value = '';
			}
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

	function isPartSelected(partId, selectedPartsById) {
		return selectedPartsById.includes(partId);
	}

	function isPartDisabled(obj) {
		return !obj?.vendor?.email;
	}

	function getClass(obj, selectedPartsById, selecting) {
		return selecting
			? isPartSelected(obj?.id, selectedPartsById)
				? 'bg-blue-50'
				: 'hover:bg-neutral-100'
			: '';
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
							<td class={tableFieldMapper(obj, column).value ? '' : 'bg-gray-200'}>
								{#if obj?.boms_part?.vendor}
									<div class="flex flex-row justify-between pr-1 items-center space-x-5">
										{#if tableFieldMapper(obj, column).value}
											{tableFieldMapper(obj, column).value ?? ''}
										{/if}
										<button on:click={() => (selectedVendor = obj?.boms_part?.vendor)}>
											<img src={Edit} alt="open" class="h-3 w-3" />
										</button>
									</div>
								{:else}
									<p class={tableFieldMapper(obj, column).value ? '' : 'text-gray-400'}>
										{tableFieldMapper(obj, column).value ?? '---'}
									</p>
								{/if}
							</td>
						{:else if column.field === 'description' || column.field === 'vendor_instructions'}
							<td>
								<div class="flex flex-row justify-between pr-1 items-center">
									{#if tableFieldMapper(obj, column).value}
										<p class="mr-2 text-wrap max-w-44">
											{tableFieldMapper(obj, column).value}
										</p>
									{/if}
									<button
										class="h-3 w-3"
										on:click={() =>
											column.field === 'description'
												? (selectedPart = obj?.boms_part?.part)
												: (selectedPartForInstructions = obj?.boms_part?.part)}
									>
										<img src={Edit} alt="open" class="h-3 w-3" />
									</button>
								</div>
							</td>
						{:else if column.type === 'parts_quotes_quantity'}
							<td>
								<LastQuote
									data={obj?.parts_quotes_quantity}
									callback={() => {
										selectedPartForAllQuotes = obj;
										selectedQuoteForAllQuotes = obj?.parts_quotes_quantity;
									}}
								/>
							</td>
						{:else if column.type === 'parts_po_history'}
							<td>
								<LastPO
									data={obj?.parts_po_history}
									callback={() => {
										selectedPartForAllPOs = obj;
										selectedPOForAllPOs = obj?.parts_po_history;
									}}
								/>
							</td>
						{:else if column.field === 'email'}
							<td>
								<div class="flex flex-row justify-between pr-1 items-center space-x-5">
									{#if tableFieldMapper(obj, column).value}
										{tableFieldMapper(obj, column).value ?? ''}
									{/if}
									<button on:click={() => (selectedVendor = obj?.boms_part?.vendor)}>
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
										<button on:click={() => (selectedBomPartForQuote = obj?.boms_part)}>
											<img src={Edit} alt="open" class="h-3 w-3" />
										</button>
									</div>
								{/if}
							</td>
						{:else if column.type === 'comments'}
							<td>
								<div class="flex flex-row justify-between pr-1 items-center space-x-5">
									{#if tableFieldMapper(obj, column).value}
										{tableFieldMapper(obj, column).value ?? ''}
									{/if}
									<button on:click={() => (selectedPartForComment = obj)}>
										<img src={Edit} alt="open" class="h-3 w-3" />
									</button>
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
