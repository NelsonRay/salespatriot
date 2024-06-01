<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { solColumns, formatCurrency } from '$lib/helpers.js';
	import Table from '$lib/components/app/Government/Table/Table.svelte';
	import { getColumns } from '$lib/table.js';

	export let data;
	export let isAdmin = false;

	$: ({ supabase, session } = data);

	let solicitations_matched = null;

	async function loadData() {
		let query = supabase
			.from('solicitations_matched')
			.select(`*, solicitation!inner(${solColumns}, nsn(id, parts(*))), matching_rule(*)`)
			.filter('status', 'cs', '{"award:won"}');

		let { data } = await query;

		const {
			data: { admin }
		} = await supabase.from('users').select('admin').eq('id', session.user.id).limit(1).single();

		isAdmin = admin;
		solicitations_matched = data;
	}

	onMount(() => {
		if (session) {
			loadData();
		}
	});

	function getTotalValue(solicitations_matched) {
		let value = 0;

		for (let s of solicitations_matched) {
			value += s.unit_price * s.solicitation.quantity;
		}

		return formatCurrency(value);
	}
</script>

<svelte:head>
	<title>Government - Sales Patriot</title>
</svelte:head>

<div class="relative top-0">
	<div class="flex flex-row h-14 items-center justify-between mx-2">
		<div class="flex flex-row items-center">
			<p class="font-semibold text-sm">Government Sales Orders</p>
			{#if solicitations_matched}
				<p class="font-semibold text-sm ml-1">{'- ' + getTotalValue(solicitations_matched)}</p>
			{/if}
		</div>
		<div></div>
	</div>
</div>

{#if solicitations_matched}
	<Table
		data={solicitations_matched}
		columns={getColumns('/rfqs/government-contracts-bid')}
		blockEditing={!isAdmin}
	/>
{:else}
	<div class="flex flex-col gap-4 p-5">
		<div class="skeleton h-4 w-full"></div>
		<div class="skeleton h-4 w-full"></div>
		<div class="skeleton h-4 w-full"></div>
		<div class="skeleton h-4 w-full"></div>
		<div class="skeleton h-4 w-full"></div>
		<div class="skeleton h-4 w-full"></div>
		<div class="skeleton h-4 w-full"></div>
		<div class="skeleton h-4 w-full"></div>
	</div>
{/if}
