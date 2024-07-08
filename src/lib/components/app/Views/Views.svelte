<script>
	// @ts-nocheck
	import { page } from '$app/stores';

	export let views;

	let openDropdown = false;

	function handleDropdownClick() {
		openDropdown = !(openDropdown ?? false);
	}

	// @ts-ignore
	const handleDropdownFocusLoss = ({ relatedTarget, currentTarget }) => {
		// use "focusout" event to ensure that we can close the dropdown when clicking outside or when we leave the dropdown with the "Tab" button
		if (relatedTarget instanceof HTMLElement && currentTarget.contains(relatedTarget)) return; // check if the new focus target doesn't present in the dropdown tree (exclude ul\li padding area because relatedTarget, in this case, will be null)
		openDropdown = false;
	};
</script>

<div class="flex flex-row items-center">
	<div class="dropdown dropdown-bottom dropdown-hover">
		<button class="bg-neutral-100 p-2 rounded-sm font-medium text-sm">Views </button>
		<div class="dropdown-content relative z-10 menu p-4 shadow bg-neutral-100 rounded-box w-52">
			<ul>
				{#each views as view}
					<p class="font-semibold mb-1 ml-1 mt-1 text-md">{view.title}</p>
					{#each view.paths as path (path.url)}
						<li>
							<a
								href={path.url}
								on:click={() => {
									handleDropdownClick();
								}}
							>
								{path.title}
							</a>
						</li>
					{/each}
				{/each}
			</ul>
		</div>
	</div>

	<p class="font-semibold ml-4 text-sm">
		{views
			.filter((v) => v.paths.some((p) => p.url.includes($page.url.pathname)))[0]
			?.paths.filter((p) => p.url.includes($page.url.pathname))[0].title}
	</p>
</div>
