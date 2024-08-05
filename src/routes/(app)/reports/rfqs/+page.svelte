<script>
	// @ts-nocheck
	import DateInput from '$lib/components/form/DateInput.svelte';
	import { formatCurrency } from '$lib/helpers';
	import { onMount } from 'svelte';
	import Table from '$lib/components/app/Government/Table/Table.svelte';
	import RfqsTable from '$lib/components/app/Commercial/Table/Table.svelte';
	import { getReportColumns, getReportRfqColumns } from '$lib/table.js';
	import { solColumns } from '$lib/helpers.js';
	import * as XLSX from 'xlsx';

	export let data;
	$: ({ supabase } = data);

	let isMounted = false;
	let startDate = null;
	let endDate = null;
	let solicitations = [];
	let rfqs = [];

	onMount(() => {
		isMounted = true;
	});

	async function loadData() {
		const { data: sols, error } = await supabase
			.from('solicitations_matched')
			.select(
				`*, solicitation!inner(${solColumns}, nsn(id, map_nsns_to_parts(*, part(id, number)))), matching_rule(*)`
			)
			.gte('bid_timestamp', new Date(startDate).toUTCString())
			.lte('bid_timestamp', new Date(endDate).toUTCString());

		solicitations = sols.sort((a, b) => new Date(b.bid_timestamp) - new Date(a.bid_timestamp));

		const { data, error: err } = await supabase
			.from('rfqs')
			.select(
				'*, customer!inner(*), rfqs_parts(part(number, description), rfqs_parts_quantities(*))'
			)
			.gte('sent_quote_timestamp', new Date(startDate).toUTCString())
			.lte('sent_quote_timestamp', new Date(endDate).toUTCString());

		rfqs = data.sort((a, b) => new Date(b.sent_quote_timestamp) - new Date(a.sent_quote_timestamp));
	}

	function calcGovQuotes(sols) {
		let value = 0;

		for (let sol of sols) {
			value += sol.solicitation.quantity * sol.unit_price;
		}

		return `${sols.length} Quoted - ${value ? formatCurrency(value) : '$0.00'}`;
	}

	function calcRfqQuotes(allRfqs) {
		let value = 0;

		for (let rfq of allRfqs) {
			let avgParts = [];

			for (let rfqs_part of rfq.rfqs_parts) {
				const qtyPrices = rfqs_part.rfqs_parts_quantities.map((q) => q.quantity * q.final_pricing);

				let sumOfQtyPrices = 0;

				for (let qtyPrice of qtyPrices) {
					sumOfQtyPrices += qtyPrice;
				}

				let avgForPart = sumOfQtyPrices / rfqs_part.rfqs_parts_quantities?.length;

				avgParts = [...avgParts, avgForPart];
			}

			let avgValueForRfq = 0;

			for (let avgPart of avgParts) {
				avgValueForRfq += avgPart;
			}

			value += avgValueForRfq;
		}

		return `${allRfqs.length} Quoted - ${value ? formatCurrency(value) : '$0.00'}`;
	}

	$: if (isMounted && startDate && endDate) loadData();

	// function to export sols and rfqs as .xlsx file to local machine
	function handleExport() {
		let rows = [];

		const sols = solicitations.map((sol) => {
			return {
				DATE: formatDate(sol.bid_timestamp),
				CUSTOMER: 'Government',
				D: '',
				'PART NUMBER': sol.solicitation.nsn?.map_nsns_to_parts[0]?.part?.number,
				QTY: sol.solicitation.quantity,
				'UNIT PRICE': formatCurrency(sol.unit_price),
				TOTAL: formatCurrency(sol.unit_price * sol.solicitation.quantity),
				DESCRIPTION: sol.solicitation.description,
				GOVERNMENT: formatCurrency(sol.unit_price * sol.solicitation.quantity),
				COMMERCIAL: ''
			};
		});

		rows = [...rows, ...sols];

		rfqs.forEach((rfq) => {
			rfq.rfqs_parts.forEach((part) => {
				part.rfqs_parts_quantities.forEach((qty) => {
					rows.push({
						DATE: formatDate(rfq.sent_quote_timestamp),
						CUSTOMER: rfq.customer.name,
						D: '',
						'PART NUMBER': part.part.number,
						QTY: qty.quantity,
						'UNIT PRICE': formatCurrency(qty.final_pricing),
						TOTAL: formatCurrency(qty.quantity * qty.final_pricing),
						DESCRIPTION: part.part.description,
						GOVERNMENT: '',
						COMMERCIAL: formatCurrency(qty.quantity * qty.final_pricing)
					});
				});
			});
		});

		const wb = XLSX.utils.book_new();
		const solsWS = XLSX.utils.json_to_sheet(rows);

		XLSX.utils.book_append_sheet(wb, solsWS, `${new Date().toISOString()}`);

		XLSX.writeFile(wb, `SalesPatriot_Reports_${new Date().toISOString()}.xlsx`);
	}

	// function to convert date to MM/DD/YYYY format
	function formatDate(date) {
		const d = new Date(date);
		return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
	}
</script>

<svelte:head>
	<title>Reports - Sales Patriot</title>
</svelte:head>

<div class="flex flex-row items-center m-4 justify-between">
	<div class="flex flex-row items-center">
		<div class="w-40">
			<DateInput bind:value={startDate} />
		</div>
		<p class="mx-3">-</p>
		<div class="w-40">
			<DateInput bind:value={endDate} />
		</div>
	</div>
	<button class="p-2 bg-neutral-200 rounded-md" on:click={handleExport}>Export</button>
</div>

<div class="flex flex-col">
	<div class="flex flex-col w-1/2">
		<div class="flex flex-row items-center">
			<p class="m-4 font-medium">Government:</p>
			<p>{calcGovQuotes(solicitations)}</p>
		</div>

		<div>
			<Table data={solicitations} columns={getReportColumns()} openNewTab />
		</div>
	</div>
	<div class="flex flex-col w-1/2">
		<div class="flex flex-row items-center">
			<p class="m-4 font-medium">Commercial:</p>
			<p>{calcRfqQuotes(rfqs)}</p>
		</div>
		<div>
			<RfqsTable data={rfqs} columns={getReportRfqColumns()} />
		</div>
	</div>
</div>
