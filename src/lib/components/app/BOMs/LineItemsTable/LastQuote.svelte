<script>
	// @ts-nocheck
	import { formatCurrency, calculateDaysDifference, formatMonthDayYearDate } from '$lib/helpers';

	export let data;
	export let callback = () => {};

	function getClass() {
		let color = '';

		if (data.parts_quote.date_received == null) {
			color = ' bg-yellow-400';
		} else {
			const diff = Math.abs(calculateDaysDifference(new Date(data.parts_quote.date_received)));

			if (diff < 180) {
				color = ' bg-green-300';
			} else if (diff < 365) {
				color = ' bg-red-300';
			} else {
				color = ' bg-red-400';
			}
		}

		return 'p-1 rounded-md inline-block text-xs' + color;
	}
</script>

{#if data}
	<button class={getClass()} on:click={callback}>
		<div class="flex flex-col items-start">
			{#if data.parts_quote.complete}
				<p>
					{formatCurrency(data?.unit_price) + ' @ ' + data.quantity + ' QTY'}
				</p>
				<p>
					{data.lead_time + ' Days'}
				</p>
				<p>
					{data.parts_quote.vendor.name + ' - ' + data.parts_quote.date_received}
				</p>
				{#if data.parts_quote.notes}
					<p class="text-[10px]">
						{data.parts_quote.notes.toString().length > 50
							? data.parts_quote.notes.substring(0, 50) + '...'
							: data.parts_quote.notes}
					</p>
				{/if}
			{:else}
				<p>Waiting on Quote</p>
				{#if data.parts_quote?.vendors_email?.email_sent_at}
					<p>
						Sent on {formatMonthDayYearDate(data.parts_quote?.vendors_email?.email_sent_at)}
					</p>
				{:else}
					<p>Sending</p>
				{/if}
				<p>{data.parts_quote.vendor.name}</p>
			{/if}
		</div>
	</button>
{/if}
