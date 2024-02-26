<script>
	// @ts-nocheck

	export let data;
	let formattedForecast;
	let total = 0;
	formatData(data);

	function formatData(forcecast) {
		const keys = Object.keys(data ?? {})
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
		if (formattedForecast?.length > 0) formattedForecast = [...formattedForecast, ['Total', total]];
	}

	function parseDateString(dateStr) {
		const [month, year] = dateStr.split(' ');
		return new Date(`${month} 01 ${year}`);
	}

	function formatDate(date) {
		if (date === 'Total') return 'Total';
		let month = '';

		switch (date.split(' ')[0]) {
			case '01':
				month = 'Jan';
				break;
			case '02':
				month = 'Feb';
				break;
			case '03':
				month = 'Mar';
				break;
			case '04':
				month = 'Apr';
				break;
			case '05':
				month = 'May';
				break;
			case '06':
				month = 'Jun';
				break;
			case '07':
				monyh = 'Jul';
				break;
			case '08':
				month = 'Aug';
				break;
			case '09':
				month = 'Sep';
				break;
			case '10':
				month = 'Oct';
				break;
			case '11':
				month = 'Nov';
				break;
			case '12':
				month = 'Dec';
				break;
		}

		return month + ' ' + date.split(' ')[1];
	}
</script>

{#if formattedForecast && formattedForecast?.length > 0}
	<article
		class="bg-white w-[100%] overflow-scroll scrollbar-gutter-stable"
		style="direction: ltr;"
	>
		<table class="text-left w-[100%] border-separate border-spacing-0 overflow-scroll">
			<thead class="h-[32px] sticky bg-white" style="inset-block-start: 0;">
				{#each formattedForecast as month}
					<th>{formatDate(month[0])}</th>
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
