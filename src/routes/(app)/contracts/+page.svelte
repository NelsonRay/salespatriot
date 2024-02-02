<script>
	// @ts-nocheck

	import { Table, tableMapperValues } from '@skeletonlabs/skeleton';

	export let data;

	$: ({ supabase, session } = data);

	let loadedData = [];
	async function loadData() {
		const { data, error } = await supabase
			.from('solicitations_matched')
			.select('*, solicitations(*)');
		// @ts-ignore
		loadedData = data;
	}

	$: if (session) {
		loadData();
	}

	let sourceData = [
		{
			position: 1,
			solicition: 'SPE4A624Q0547',
			description: 'CABLE ASSEMBLY,POWER,ELECTRICAL',
			value: '$419,665.48',
			estimate: '$419,665.48',
			expires: '1/19/2024',
			purchasing: 'Slightly Out of Budget',
			labor: 'Within Time',
			bid: 'Bid Complete'
		}
	];

	for (let i = 0; i < 100; i++) {
		sourceData = [
			...sourceData,
			{
				position: i + 2,
				solicition: 'SPE4A624Q0547',
				description: 'CABLE ASSEMBLY,POWER,ELECTRICAL',
				value: '$419,665.48',
				estimate: '$419,665.48',
				expires: '1/19/2024',
				purchasing: 'Slightly Out of Budget',
				labor: 'Within Time',
				bid: 'Bid Complete'
			}
		];
	}

	const tableSimple = {
		// A list of heading labels.
		head: [
			'Solicitation',
			'Description',
			'Market Value',
			'Estimate Value',
			'Expires',
			'Purchasing Status',
			'Labor Status',
			'Bid Status'
		],
		// The data visibly shown in your table body UI.
		body: tableMapperValues(sourceData, [
			'solicition',
			'description',
			'value',
			'estimate',
			'expires',
			'purchasing',
			'labor',
			'bid'
		]),
		// Optional: The data returned when interactive is enabled and a row is clicked.
		meta: tableMapperValues(sourceData, [
			'position',
			'solicition',
			'description',
			'value',
			'estimate',
			'expires',
			'purchasing',
			'labor',
			'bid'
		])
		// Optional: A list of footer labels.
		// foot: ['Total', '', '<code class="code">5</code>']
	};
</script>

<Table source={tableSimple} interactive class="min-w-[110%]" regionHead={'text-sm'} />

{#if session}
	<p>client-side data fetching with RLS</p>
	<pre>{JSON.stringify(loadedData, null, 2)}</pre>
{/if}
