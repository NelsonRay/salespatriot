<script>
	// @ts-nocheck
	import { formatCurrency, formatMonthDayYearDate } from '$lib/helpers';
	import Edit from '$lib/icons/Edit.svg';

	export let data;
	export let selectedVendor;
	export let selectedPart;
	export let selectedPartForInstructions;
	export let selectedBomPartForQuote;
	export let isSelectingParts;
	export let selectedParts;

	const columns = [
		{ type: 'checkbox' },
		{ type: 'position', header: '#' },
		{ type: 'level', header: 'Level' },
		{ type: 'part', field: 'number', header: 'Part Number' },
		{ type: 'part', field: 'description', header: 'Part Description' },
		{ type: 'part', field: 'vendor_instructions', header: 'Vendor Instructions' },
		{ type: 'field', field: 'quantity', header: 'Quantity' },
		{ type: 'part', field: 'source', header: 'Source' },
		{ type: 'part', field: 'uom', header: 'UOM' },
		{ type: 'vendor', field: 'name', header: 'Vendor Name' },
		{ type: 'vendor', field: 'email', header: 'Email' },
		{ type: 'status', header: 'Status' },
		{ type: 'field', field: 'on_hand', header: 'On Hand' },
		{ type: 'field', field: 'bom_net', header: 'BOM Net' },
		{ type: 'date_received', header: 'Date Recorded' },
		{ type: 'parts_quotes', field: 'moq', header: 'MOQ' },
		{ type: 'parts_quotes', field: 'moc', header: 'MOC' },
		{ type: 'email_status', header: 'Email Status' },
		{ type: 'email_sent', header: 'Email Sent' }
	];

	export function tableFieldMapper(obj, column) {
		let value;

		if (column.type === 'position') {
		} else if (column.type === 'level') {
			value = obj?.level;

			for (let i = 0; i < obj?.level - 1; i++) {
				value = `-${value}`;
			}
		} else if (column.type === 'part') {
			value = obj?.part?.[column?.field];
		} else if (column.type === 'vendor') {
			value = obj?.vendor?.[column?.field];
		} else if (column.type === 'field') {
			value = obj?.[column?.field];
		} else if (column.type === 'status') {
			if (obj?.vendor) {
				value = obj?.part?.parts_quotes[0]?.parts_quotes_quantities?.length > 0;
			} else {
				value = null;
			}
		} else if (column.type === 'date_received') {
			value = obj?.part?.parts_quotes[0]?.date_received;

			if (value != null) {
				value = formatMonthDayYearDate(value);
			} else {
				value = null;
			}
		} else if (column.type === 'email_status') {
			if (obj?.part?.parts_quotes[0]?.email_sent_at) {
				value = obj?.part?.parts_quotes[0]?.complete;
			}
		} else if (column.type === 'email_sent') {
			value = obj?.part?.parts_quotes[0]?.email_sent_at;

			if (value != null) {
				value = formatMonthDayYearDate(value);
			} else {
				value = null;
			}
		} else if (column.type === 'parts_quotes') {
			value = obj?.part?.parts_quotes[0]?.[column.field];

			if (column.field === 'moc' && !!value) {
				value = formatCurrency(value);
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
		if (!obj?.vendor) return 'bg-gray-300';
		if (isPartDisabled(obj)) return 'bg-gray-200';

		return selecting
			? isPartSelected(obj?.id, selectedPartsById)
				? 'bg-blue-50'
				: 'hover:bg-neutral-100'
			: '';
	}
</script>

<article
	class="bg-white w-[100%] overflow-scroll scrollbar-gutter-stable pb-10"
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
							<td>
								{#if obj?.vendor}
									<div class="flex flex-row justify-between pr-1 items-center space-x-5">
										{#if tableFieldMapper(obj, column).value}
											{tableFieldMapper(obj, column).value ?? ''}
										{/if}
										<button on:click={() => (selectedVendor = obj?.vendor)}>
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
												? (selectedPart = obj?.part)
												: (selectedPartForInstructions = obj?.part)}
									>
										<img src={Edit} alt="open" class="h-3 w-3" />
									</button>
								</div>
							</td>
						{:else if column.field === 'email'}
							<td>
								<div class="flex flex-row justify-between pr-1 items-center space-x-5">
									{#if tableFieldMapper(obj, column).value}
										{tableFieldMapper(obj, column).value ?? ''}
									{/if}
									<button on:click={() => (selectedVendor = obj?.vendor)}>
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
										<button on:click={() => (selectedBomPartForQuote = obj)}>
											<img src={Edit} alt="open" class="h-3 w-3" />
										</button>
									</div>
								{/if}
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
