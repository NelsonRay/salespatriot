<script>
	// @ts-nocheck
	import { formatCurrency } from '$lib/helpers';

	export let data;
	data?.sort((a, b) => new Date(b.AWARDDATE) - new Date(a.AWARDDATE));
</script>

{#if data && data?.length > 0}
	<article
		class="bg-white w-[100%] overflow-scroll scrollbar-gutter-stable"
		style="direction: ltr;"
	>
		<table class="text-left w-[100%] border-separate border-spacing-0 overflow-scroll">
			<thead class="h-[32px] sticky bg-white" style="inset-block-start: 0;">
				{#each ['#', 'Total Value', 'Unit Price', 'Quantity', 'Award Date', 'Cage', 'Vendor'] as header, i}
					<th class={i === 0 ? 'text-center' : ''}>{header}</th>
				{/each}
			</thead>
			<tbody>
				{#each data as award, index}
					<tr>
						{#each ['#', 'TOTALVALUE', 'UNITPRICE', 'QUANTITY', 'AWARDDATE', 'CAGE', 'VENDOR'] as key, i}
							{#if i === 0}
								<td class="text-center">{index + 1}</td>
							{:else if key === 'TOTALVALUE'}
								<td>{formatCurrency(award['UNITPRICE'] * award['QUANTITY'])}</td>
							{:else if key === 'UNITPRICE'}
								<td>{formatCurrency(award[key])}</td>
							{:else}
								<td>{award[key]}</td>
							{/if}
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</article>
{:else}
	<p class="text-gray-400">No Forecast Data</p>
{/if}

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
