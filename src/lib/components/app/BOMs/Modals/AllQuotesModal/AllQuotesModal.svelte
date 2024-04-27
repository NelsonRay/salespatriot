<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import QuotesTable from '$lib/components/app/BOMs/Modals/AllQuotesModal/QuotesTable.svelte';
	import { formatMonthDayYearDate, calculateDaysDifference } from '$lib/helpers';

	export let open;
	export let selectedPartForAllQuotes;
	export let selectedQuoteForAllQuotes;
	export let submitCallback;
	export let supabase;

	let parts_quotes;
	let isMounted = false;

	async function loadData(isMounted, selectedPartForAllQuotes) {
		if (isMounted && selectedPartForAllQuotes) {
			let query = supabase
				.from('parts_quotes')
				.select('*, vendor(name), parts_quotes_quantities(*), vendors_email(*)')
				.eq('part', selectedPartForAllQuotes.boms_part.part.id);

			let { data } = await query;

			parts_quotes = data?.sort((a, b) => new Date(b.date_received) - new Date(a.date_received));
		} else {
			parts_quotes = undefined;
		}
	}

	function getClass(date) {
		let color = '';

		const diff = Math.abs(calculateDaysDifference(new Date(date)));

		if (diff < 180) {
			color = 'text-green-300';
		} else if (diff < 365) {
			color = 'text-red-300';
		} else {
			color = 'text-red-400';
		}

		return color;
	}

	async function handleSubmit(qtyId) {
		await submitCallback(qtyId || null);
	}

	onMount(() => {
		isMounted = true;
	});

	$: loadData(isMounted, selectedPartForAllQuotes);
</script>

{#if open}
	<div
		class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
	>
		<div class="relative w-1/2 h-1/2 my-6 mx-auto max-w-3xl">
			<!--content-->
			<div
				class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
			>
				<!--header-->
				<div class="flex items-start justify-between p-5 rounded-t">
					<h3 class="text-3xl text-gray-600 font-semibold">Quotes</h3>
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

				<div class="mx-4 flex flex-col space-y-5 pb-10">
					{#each parts_quotes?.filter((q) => !q.deleted) ?? [] as parts_quote (parts_quote.id)}
						<div>
							<div class="flex flex-row justify-between">
								<p>{parts_quote.vendor.name}</p>
								{#if parts_quote.date_received}
									<p class={getClass(parts_quote.date_received)}>
										{formatMonthDayYearDate(parts_quote.date_received)}
									</p>
								{:else}
									<p class="text-yellow-400">
										Waiting - Sent on {formatMonthDayYearDate(
											parts_quote.vendors_email.email_sent_at
										)}
									</p>
								{/if}
							</div>
							{#if parts_quote.notes}
								<p>{parts_quote.notes}</p>
							{/if}
							<QuotesTable
								data={parts_quote.parts_quotes_quantities?.sort((a, b) => a.quantity - b.quantity)}
								{selectedQuoteForAllQuotes}
								callback={handleSubmit}
							/>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
	<div class="opacity-25 fixed inset-0 z-40 bg-black"></div>
{/if}
