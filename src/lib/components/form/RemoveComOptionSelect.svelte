<script>
	// @ts-nocheck
	import { Dropdown } from 'flowbite-svelte';

	export let value;
	let dropdownOpen = false;

	const options = [
		{
			id: 'No Longer Needed'
		},
		{
			id: 'Too Expensive'
		},
		{
			id: 'Took too long to quote'
		},
		{
			id: 'Too long of lead time'
		},
		{
			id: 'Looking for pricing for a quote'
		},
		{
			id: 'Other'
		}
	];

	function getTagClass(option, selected_id) {
		let tclass = `py-2 px-4 rounded-3xl m-1 text-xs font-medium bg-gray-200 whitespace-nowrap`;

		if (option) {
			selected_id === option.id
				? (tclass += ` border-[2px] shadow-sm`)
				: selected_id
					? (tclass += ' border-[2px] opacity-40')
					: (tclass += ' border-[2px]');
		}

		return tclass;
	}

	function toggleOption(option) {
		value = option.id;
		dropdownOpen = false;
	}
</script>

<div class="z-10">
	<button class={getTagClass(options.filter((o) => o.id == value)[0], value)}>
		{options.filter((o) => o.id == value)[0]?.id ?? 'Select'}
	</button>

	<Dropdown bind:open={dropdownOpen} class="bg-white">
		<ul>
			{#each options as option}
				<li>
					<button class={getTagClass(option, value)} on:click={() => toggleOption(option)}>
						{option.id}
					</button>
				</li>
			{/each}
		</ul>
	</Dropdown>
</div>
