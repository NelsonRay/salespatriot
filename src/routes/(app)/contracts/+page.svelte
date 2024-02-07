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

	let submenu = [
		{
			href: '/utilities/table-of-contents',
			label: 'Bidding Funnel'
		},
		{
			href: '/utilities/table-of-contents',
			label: 'Recently Released'
		},
		{
			href: '/utilities/table-of-contents',
			label: 'Expiring Soon'
		},
		{
			href: '/utilities/table-of-contents',
			label: 'Contracts Bid'
		},
		{
			href: '/utilities/table-of-contents',
			label: 'All Contracts'
		}
	];
</script>

<!-- <section class="p-4 pb-20 space-y-4">
		<p class="font-bold pl-4 text-xl">Views</p>

		<nav class="list-nav">
			<ul>
				{#each submenu as { href, label }}
					<li>
						<a {href} data-sveltekit-preload-data="hover">
							<span class="flex-auto">{@html label}</span>
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</section> -->
<article>
	<table>
		<thead>
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
	article {
		position: relative;
		top: 20px;
		color: #212121;
		background: #fff;
		width: 100%;
		height: 100%;
		overflow-y: auto;
		overflow-x: auto;
		border-left: 2px solid #eee;
		direction: ltr;
	}
	table {
		text-align: left;
		width: 100%;
		border-collapse: separate;
		border-spacing: 0;
	}
	thead {
		background: #fff;
		height: 32px;
		position: sticky;
		inset-block-start: 0;
	}

	th {
		border-bottom: 1px solid #e0e0e0;
		border-top: 1px solid #e0e0e0;
		white-space: nowrap;
		border: 0.2px solid gainsboro;
		padding-right: 5px;
	}

	td {
		border: 0.2px solid gainsboro;
		padding-right: 5px;
	}
</style>
