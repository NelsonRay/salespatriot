<script>
	let openDropdown = false;

	function handleDropdownClick() {
		openDropdown = !(openDropdown ?? false);
	}

	// @ts-ignore
	const handleDropdownFocusLoss = ({ relatedTarget, currentTarget }) => {
		// // use "focusout" event to ensure that we can close the dropdown when clicking outside or when we leave the dropdown with the "Tab" button
		if (relatedTarget instanceof HTMLElement && currentTarget.contains(relatedTarget)) return; // check if the new focus target doesn't present in the dropdown tree (exclude ul\li padding area because relatedTarget, in this case, will be null)
		openDropdown = false;
	};

	let views = [
		{
			href: '/contracts/bidding-funnel',
			label: 'Bidding Funnel'
		},
		{
			href: '/contracts/recently-released',
			label: 'Recently Released'
		},
		{
			href: '/contracts/expiring-soon',
			label: 'Expiring Soon'
		},
		{
			href: '/contracts/contracts-bid',
			label: 'Contracts Bid'
		},
		{
			href: '/contracts/all-contracts',
			label: 'All Contracts'
		}
	];
</script>

<div class="dropdown" on:focusout={handleDropdownFocusLoss}>
	<button class="bg-neutral-100 p-2 rounded-sm font-medium text-sm" on:click={handleDropdownClick}
		>Views
	</button>
	<ul
		class="dropdown-content z-[100] menu p-2 shadow bg-neutral-100 rounded-box w-52"
		style:visibility={openDropdown ? 'visible' : 'hidden'}
	>
		{#each views as view (view.label)}
			<li>
				<a
					href={view.href}
					on:click={() => {
						handleDropdownClick();
					}}
					class="mb-1"
				>
					{view.label}
				</a>
			</li>
		{/each}
	</ul>
</div>
