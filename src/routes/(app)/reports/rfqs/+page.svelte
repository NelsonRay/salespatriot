<script>
	// @ts-nocheck
	import DateInput from '$lib/components/form/DateInput.svelte';
	import { formatCurrency } from '$lib/helpers';
	import { onMount } from 'svelte';
	import Table from '$lib/components/app/Government/Table/Table.svelte';
	import RfqsTable from '$lib/components/app/Commercial/Table/Table.svelte';
	import { getReportColumns, getReportRfqColumns } from '$lib/table.js';
	import { solColumns } from '$lib/helpers.js';

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
			.select(`*, solicitation!inner(${solColumns}, nsn(id, parts(*))), matching_rule(*)`)
			.gte('bid_timestamp', new Date(startDate).toUTCString())
			.lte('bid_timestamp', new Date(endDate).toUTCString());

		solicitations = sols.sort((a, b) => new Date(b.bid_timestamp) - new Date(a.bid_timestamp));

		const { data, error: err } = await supabase
			.from('rfqs')
			.select('*, customer!inner(*), rfqs_parts(part(number), rfqs_parts_quantities(*))')
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
</script>

<svelte:head>
	<title>Reports - Sales Patriot</title>
</svelte:head>

<div class="flex flex-row items-center m-4">
	<div class="w-40">
		<DateInput bind:value={startDate} />
	</div>
	<p class="mx-3">-</p>
	<div class="w-40">
		<DateInput bind:value={endDate} />
	</div>
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
