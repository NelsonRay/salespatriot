<script>
	import { page } from '$app/stores';
	import SidebarBtn from './SidebarBtn.svelte';
</script>

<div
	class="grid grid-cols-[auto_1fr] h-full bg-surface-50-900-token border-r border-surface-500/30 {$$props.class ??
		''}"
>
	<div class="flex flex-col justify-between bg-surface-50-800-token p-2">
		<div class="flex flex-col space-y-3">
			<div class="flex flex-col">
				<p class="font-semibold">Workflows</p>
				<SidebarBtn text="My Tasks" href={$page.url.origin + '/workflows'} />
			</div>
			<div class="flex flex-col">
				<p class="font-semibold">Opportunities</p>
				<SidebarBtn text="Commercial" href={$page.url.origin + '/sales/commercial'} />
				<SidebarBtn text="Government" href={$page.url.origin + '/sales/government'} />
			</div>
			<div class="flex flex-col">
				<p class="font-semibold">MRP</p>
				<SidebarBtn text="Inventory" href={$page.url.origin + '/inventory'} />
				<SidebarBtn text="BOMs" href={$page.url.origin + '/boms'} />
			</div>
			<div class="flex flex-col">
				<p class="font-semibold">Purchasing</p>
				<SidebarBtn text="Purchase Orders" href={$page.url.origin + '/purchase-orders'} />
				<SidebarBtn text="Quotes" href={$page.url.origin + '/quotes'} />
			</div>
			<div class="flex flex-col">
				<p class="font-semibold">Reports</p>
				<SidebarBtn text="Opportunities" href={$page.url.origin + '/reports/opportunities'} />
				<SidebarBtn text="Sales Orders" href={$page.url.origin + '/reports/sales-orders'} />
			</div>
		</div>
		<div>
			<SidebarBtn text="Settings" href={$page.url.origin + '/settings'} />
		</div>
	</div>
</div>
