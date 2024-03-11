<script>
	import { AppRail, AppRailAnchor } from '@skeletonlabs/skeleton';
	import Contracts from '$lib/icons/Contracts.svg';
	import Workflows from '$lib/icons/Workflows.svg';
	import Reports from '$lib/icons/Reports.svg';
	import Commercial from '$lib/icons/Commercial.svg';
	import { page } from '$app/stores';
</script>

<div
	class="grid grid-cols-[auto_1fr] h-full bg-surface-50-900-token border-r border-surface-500/30 {$$props.class ??
		''}"
>
	<AppRail>
		<AppRailAnchor
			title="Government"
			href="/government"
			selected={$page.url.pathname.toString().includes('/government')}
		>
			<svelte:fragment slot="lead"
				><div class="flex items-center justify-center">
					<img src={Contracts} class="h-8 w-8" alt="Government" />
				</div>
			</svelte:fragment>
			<span>Government</span>
		</AppRailAnchor>
		<AppRailAnchor
			title="Commercial"
			href="/commercial/rfqs"
			selected={$page.url.pathname.toString().includes('/commercial/rfqs')}
		>
			<svelte:fragment slot="lead"
				><div class="flex items-center justify-center">
					<img src={Commercial} class="h-8 w-8" alt="Commercial" />
				</div>
			</svelte:fragment>
			<span>Commercial</span>
		</AppRailAnchor>
		<AppRailAnchor
			title="Workflows"
			href="/workflows"
			selected={$page.url.pathname.toString().includes('/workflows')}
		>
			<svelte:fragment slot="lead"
				><div class="flex items-center justify-center">
					<img src={Workflows} class="h-8 w-8" alt="workflows" />
				</div></svelte:fragment
			>
			<span>Workflows</span>
		</AppRailAnchor>
		<AppRailAnchor
			title="Reports"
			href="/reports"
			selected={$page.url.pathname.toString().includes('/reports')}
		>
			<svelte:fragment slot="lead"
				><div class="flex items-center justify-center">
					<img src={Reports} class="h-7 w-7" alt="reports" />
				</div></svelte:fragment
			>
			<span>Reports</span>
		</AppRailAnchor>
		<!-- --- -->
		<svelte:fragment slot="trail">
			<AppRailAnchor href="/settings">Settings</AppRailAnchor>
		</svelte:fragment>
	</AppRail>
</div>
