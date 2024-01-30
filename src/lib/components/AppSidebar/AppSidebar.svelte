<script>
	import { AppRail, AppRailAnchor, AppRailTile } from '@skeletonlabs/skeleton';
	import Contracts from '$lib/icons/Contracts.svg';
	import Workflows from '$lib/icons/Workflows.svg';
	import Reports from '$lib/icons/Reports.svg';

	let currentTile = 0;
</script>

<AppRail>
	<!-- <svelte:fragment slot="lead">
		<AppRailAnchor href="/">(icon)</AppRailAnchor>
	</svelte:fragment> -->
	<!-- --- -->
	<AppRailTile bind:group={currentTile} name="tile-1" value={0} title="tile-1">
		<svelte:fragment slot="lead"
			><div class="flex items-center justify-center">
				<img src={Contracts} class="h-12 w-12" />
			</div>
		</svelte:fragment>
		<span>Contracts</span>
	</AppRailTile>
	<AppRailTile bind:group={currentTile} name="tile-2" value={1} title="tile-2">
		<svelte:fragment slot="lead"
			><div class="flex items-center justify-center">
				<img src={Workflows} class="h-12 w-12" />
			</div></svelte:fragment
		>
		<span>Workflows</span>
	</AppRailTile>
	<AppRailTile bind:group={currentTile} name="tile-3" value={2} title="tile-3">
		<svelte:fragment slot="lead"
			><div class="flex items-center justify-center">
				<img src={Reports} class="h-10 w-10" />
			</div></svelte:fragment
		>
		<span>Reports</span>
	</AppRailTile>
	<!-- --- -->
	<!-- <svelte:fragment slot="trail">
		<AppRailAnchor href="/" target="_blank" title="Account">(icon)</AppRailAnchor>
	</svelte:fragment> -->
</AppRail>
