<script>
	// @ts-nocheck
	import { formatCurrency, calculateDaysDifference } from '$lib/helpers';

	export let data;
	export let callback = () => {};

	function getClass() {
		let color = '';

		const diff = Math.abs(calculateDaysDifference(new Date(data.date_ordered)));

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
	<button class={getClass()} on:click={callback}>
		<div class="flex flex-col items-start">
			<p>
				{formatCurrency(data?.unit_price) + ' @ ' + data.quantity + ' QTY'}
			</p>
			<p>
				{data.vendor.name + ' - ' + data.date_ordered}
			</p>
		</div>
	</button>
{/if}
