<script>
	import { page } from '$app/stores';
	import SidebarBtn from './SidebarBtn.svelte';
</script>

<div
	class="grid grid-cols-[auto_1fr] h-full bg-surface-50-900-token border-r border-white {$$props.class ??
		''}"
>
	<div class="flex flex-col justify-between bg-surface-50-900-token-token p-2">
		<div class="flex flex-col space-y-1">
			<SidebarBtn text="Workflows" href={$page.url.origin + '/workflows'} />
			<SidebarBtn text="RFQs" href={$page.url.origin + '/rfqs'} />
			<!-- <SidebarBtn text="Sales Orders" href={$page.url.origin + '/sales/government'} /> -->
			<SidebarBtn text="Reports" href={$page.url.origin + '/reports/rfqs'} />
		</div>
		<div>
			<SidebarBtn text="Settings" href={$page.url.origin + '/settings'} />
		</div>
	</div>
</div>
