<script>
	// @ts-nocheck

	// export let data = [];

	// $: ({ supabase, session } = data);

	// let loadedData = [];
	// async function loadData() {
	// 	const { data, error } = await supabase
	// 		.from('solicitations_matched')
	// 		.select('*, solicitations(*)');
	// 	// @ts-ignore
	// 	loadedData = [...data, ...data, ...data];
	// }

	// $: if (session) {
	// 	loadData();
	// }

	let showViews = true;

	function toggleShowViews() {
		showViews = !showViews;
	}
</script>

<div class="relative top-0">
	<div class="flex flex-row h-14 items-center justify-between mx-2">
		<div class="flex flex-row items-center">
			<button class="bg-neutral-100 p-2 rounded-sm font-medium" on:click={toggleShowViews}
				>Views</button
			>
			<p class="font-semibold ml-4">Bidding Funnel</p>
		</div>
		<p>Last Updated: Today 8:30 AM</p>
	</div>
</div>

<article
	class="bg-white w-[100%] h-[100%] ml-2 overflow-y-auto overflow-x-auto border-l-[0.2px] border-l-gainsboro"
	style="direction: ltr;"
>
	<table class="text-left w-[100%] border-separate border-spacing-0">
		<thead class="h-[32px] sticky bg-white" style="inset-block-start: 0;">
			<th>ID</th>
			<th>First name</th>
			<th>Last name</th>
			<th>ID</th>
			<th>First name</th>
			<th>Last name</th>
			<th>ID</th>
			<th>First name</th>
			<th>Last name</th>
			<th>ID</th>
			<th>First name</th>
			<th>Last name</th>
			<th>ID</th>
			<th>First name</th>
			<th>Last name</th>
			<th>ID</th>
			<th>First name</th>
			<th>Last name</th>
			<th>ID</th>
			<th>First name</th>
			<th>Last name</th>
			<th>ID</th>
			<th>First name</th>
			<th>Last name</th>
			<th>ID</th>
			<th>First name</th>
			<th>Last name</th>
			<th>ID</th>
			<th>First name</th>
			<th>Last name</th>
			<th>ID</th>
			<th>First name</th>
			<th>Last name</th>
			<th>ID</th>
			<th>First name</th>
			<th>Last name</th>
		</thead>

		<tbody>
			{#each Array(100) as row, i}
				<tr>
					<td>{i + 1}</td>
					<td>John</td>
					<td>Doe</td>
					<td>{i + 1}</td>
					<td>Johjojoijoioiohoihiohiohn</td>
					<td>Doe</td>
					<td>{i + 1}</td>
					<td>John</td>
					<td>Doe</td>
					<td>{i + 1}</td>
					<td>John</td>
					<td>Doe</td>
					<td>{i + 1}</td>
					<td>Johjojoijoioiohoihiohiohn</td>
					<td>Doe</td>
					<td>{i + 1}</td>
					<td>John</td>
					<td>Doe</td>
					<td>{i + 1}</td>
					<td>John</td>
					<td>Doe</td>
					<td>{i + 1}</td>
					<td>Johjojoijoioiohoihiohiohn</td>
					<td>Doe</td>
					<td>{i + 1}</td>
					<td>John</td>
					<td>Doe</td>
					<td>{i + 1}</td>
					<td>John</td>
					<td>Doe</td>
					<td>{i + 1}</td>
					<td>Johjojoijoioiohoihiohiohn</td>
					<td>Doe</td>
					<td>{i + 1}</td>
					<td>John</td>
					<td>Doe</td>
				</tr>
			{/each}
		</tbody>
	</table>
</article>

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
		padding: 4px;
	}
</style>
