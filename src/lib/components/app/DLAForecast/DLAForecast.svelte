<script>
	// @ts-nocheck

	export let data;
	let formattedForecast;
	let total = 0;
	formatData(data);

	function formatData(forcecast) {
		const keys = Object.keys(data)
			.filter((k) => k.includes(' '))
			.sort((a, b) => parseDateString(a) - parseDateString(b));

		formattedForecast = keys
			.map((e) => [e, forcecast[e]])
			.filter((e) => {
				return e[1] !== '0';
			});

		for (let f of formattedForecast) {
			total += parseInt(f[1]);
		}

		formattedForecast = [...formattedForecast, ['Total', total]];
	}

	function parseDateString(dateStr) {
		const [month, year] = dateStr.split(' ');
		return new Date(`${month} 01 ${year}`);
	}
</script>

{#if formattedForecast && formattedForecast?.length > 0}
	<article
		class="bg-white w-[100%] px-2 overflow-scroll border-l-[0.2px] border-l-gainsboro scrollbar-gutter-stable"
		style="direction: ltr;"
	>
		<table class="text-left w-[100%] border-separate border-spacing-0 overflow-scroll">
			<thead class="h-[32px] sticky bg-white" style="inset-block-start: 0;">
				{#each formattedForecast as month}
					<th>{month[0]}</th>
				{/each}
			</thead>
			<tbody>
				<tr class="hover:bg-neutral-100">
					{#each formattedForecast as quantity}
						<td>{quantity[1]}</td>
					{/each}
				</tr>
			</tbody>
		</table>
	</article>
{:else}
	<p class="text-gray-400 ml-3">No Forecast Data</p>
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
