<script>
	import { AppRail, AppRailAnchor } from '@skeletonlabs/skeleton';
	import Sales from '$lib/icons/Sales.svg';
	import Workflows from '$lib/icons/Workflows.svg';
	import BOMs from '$lib/icons/boms.svg';
	import Reports from '$lib/icons/Reports.svg';
	import Quotes from '$lib/icons/Quotes.svg';
	import { page } from '$app/stores';
</script>

<div
	class="grid grid-cols-[auto_1fr] h-full bg-surface-50-900-token border-r border-surface-500/30 {$$props.class ??
		''}"
>
	<AppRail>
		<AppRailAnchor
			title="Government"
			href="/sales/commercial/active-rfqs"
			selected={$page.url.pathname.toString().includes('/sales')}
		>
			<svelte:fragment slot="lead"
				><div class="flex items-center justify-center">
					<img src={Sales} class="h-7 w-7" alt="Government" />
				</div>
			</svelte:fragment>
			<span>Sales</span>
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
					<img src={Reports} class="h-9 w-9" alt="reports" />
				</div></svelte:fragment
			>
			<span>Reports</span>
		</AppRailAnchor>
		<AppRailAnchor
			title="BOMs"
			href="/boms"
			selected={$page.url.pathname.toString().includes('/boms')}
		>
			<svelte:fragment slot="lead"
				><div class="flex items-center justify-center">
					<img src={BOMs} class="h-7 w-7" alt="BOMs" />
				</div>
			</svelte:fragment>
			<span>BOMs</span>
		</AppRailAnchor>
		<AppRailAnchor
			title="Quotes"
			href="/quotes"
			selected={$page.url.pathname.toString().includes('/quotes')}
		>
			<svelte:fragment slot="lead"
				><div class="flex items-center justify-center">
					<img src={Quotes} class="h-8 w-8" alt="BOMs" />
				</div>
			</svelte:fragment>
			<span>Quotes</span>
		</AppRailAnchor>
		<!-- --- -->
		<svelte:fragment slot="trail">
			<AppRailAnchor href="/settings">Settings</AppRailAnchor>
		</svelte:fragment>
	</AppRail>
</div>
