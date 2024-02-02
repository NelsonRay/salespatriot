<script>
	import { AppRail, AppRailAnchor, AppRailTile } from '@skeletonlabs/skeleton';
	import Contracts from '$lib/icons/Contracts.svg';
	import Workflows from '$lib/icons/Workflows.svg';
	import Reports from '$lib/icons/Reports.svg';

	let currentTile = 0;

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

<div
	class="grid grid-cols-[auto_1fr] h-full bg-surface-50-900-token border-r border-surface-500/30 {$$props.class ??
		''}"
>
	<AppRail>
		<!-- <svelte:fragment slot="lead">
		<AppRailAnchor href="/">(icon)</AppRailAnchor>
	</svelte:fragment> -->
		<!-- --- -->
		<AppRailTile bind:group={currentTile} name="tile-1" value={0} title="tile-1">
			<svelte:fragment slot="lead"
				><div class="flex items-center justify-center">
					<img src={Contracts} class="h-12 w-12" alt="contracts" />
				</div>
			</svelte:fragment>
			<span>Contracts</span>
		</AppRailTile>
		<AppRailTile bind:group={currentTile} name="tile-2" value={1} title="tile-2">
			<svelte:fragment slot="lead"
				><div class="flex items-center justify-center">
					<img src={Workflows} class="h-12 w-12" alt="workflows" />
				</div></svelte:fragment
			>
			<span>Workflows</span>
		</AppRailTile>
		<AppRailTile bind:group={currentTile} name="tile-3" value={2} title="tile-3">
			<svelte:fragment slot="lead"
				><div class="flex items-center justify-center">
					<img src={Reports} class="h-10 w-10" alt="reports" />
				</div></svelte:fragment
			>
			<span>Reports</span>
		</AppRailTile>
		<!-- --- -->
		<svelte:fragment slot="trail">
			<AppRailAnchor href="/settings">Settings</AppRailAnchor>
		</svelte:fragment>
	</AppRail>

	<section class="p-4 pb-20 space-y-4 overflow-y-auto">
		<!-- Title -->
		<p class="font-bold pl-4 text-xl">Views</p>
		<!-- Nav List -->
		<nav class="list-nav">
			<ul>
				{#each submenu as { href, label }}
					<li>
						<a {href} data-sveltekit-preload-data="hover">
							<span class="flex-auto">{@html label}</span>
							<!-- {#if badge}<span class="badge variant-filled-secondary">{badge}</span>{/if} -->
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</section>
</div>
