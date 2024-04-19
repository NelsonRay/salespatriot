<script>
	import { formatCurrency, calculateDaysDifference } from '$lib/helpers';

	export let data;

	function getClass() {
		let color = '';

		const diff = Math.abs(calculateDaysDifference(new Date(data.parts_quote.date_received)));

		if (diff < 180) {
			color = ' bg-green-300';
		} else if (diff < 365) {
			color = ' bg-red-300';
		} else {
			color = ' bg-red-400';
		}

		return 'p-1 rounded-md inline-block text-xs' + color;
	}
</script>

{#if data}
	<div class={getClass()}>
		<div class="flex flex-col">
			<p>
				{formatCurrency(data?.unit_price) + ' @ ' + data.quantity + ' QTY'}
			</p>
			<p>
				{data.lead_time + ' Days'}
			</p>
			<p>
				{data.parts_quote.vendor.name + ' - ' + data.parts_quote.date_received}
			</p>
		</div>
	</div>
{/if}
