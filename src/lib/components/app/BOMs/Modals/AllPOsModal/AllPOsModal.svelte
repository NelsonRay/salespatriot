<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { formatMonthDayYearDate, calculateDaysDifference } from '$lib/helpers';
	import PoTable from './POTable.svelte';

	export let open;
	export let selectedPartForAllPOs;
	export let selectedPOForAllPOs;
	export let submitCallback;
	export let supabase;

	let parts_po_history = [];
	let isMounted = false;

	async function loadData(isMounted, selectedPartForAllPOs) {
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

	onMount(() => {
		isMounted = true;
	});

	$: loadData(isMounted, selectedPartForAllPOs);
</script>

{#if open}
	<div
		class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
	>
		<div class="relative w-1/2 h-1/2 my-6 mx-auto max-w-3xl">
			<div
				class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
			>
				<div class="flex items-start justify-between p-5 rounded-t">
					<h3 class="text-3xl text-gray-600 font-semibold">PO History</h3>
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

				<div class="mx-4 pb-10">
					<PoTable data={parts_po_history} {selectedPOForAllPOs} callback={handleSubmit} />
				</div>
			</div>
		</div>
	</div>
	<div class="opacity-25 fixed inset-0 z-40 bg-black"></div>
{/if}
