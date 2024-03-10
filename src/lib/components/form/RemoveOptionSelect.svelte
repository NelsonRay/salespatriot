<script>
	// @ts-nocheck
	import { removeOptions } from '$lib/helpers';

	export let value;

	function getTagClass(option, selected_id) {
		let color = '';
		let borderColor = '';
		let shadowColor = '';

		if (option === null) {
			option = removeOptions.filter((r) => r.id === selected_id)[0];
		}

		switch (option?.color) {
			case 'green':
				color = 'bg-green-400';
				borderColor = 'border-green-600';
				shadowColor = 'shadow-green-300';
				break;
			case 'yellow':
				color = 'bg-yellow-400';
				borderColor = 'border-yellow-600';
				shadowColor = 'shadow-yellow-300';
				break;
			case 'red':
				color = 'bg-red-400';
				borderColor = 'border-red-600';
				shadowColor = 'shadow-red-300';
				break;
			case 'blue':
				color = 'bg-blue-400';
				borderColor = 'border-blue-600';
				shadowColor = 'shadow-blue-300';
				break;
			case 'gray':
				color = 'bg-gray-300';
				borderColor = 'border-gray-400';
				shadowColor = 'shadow-gray-300';
				break;
			case 'orange':
				color = 'bg-orange-500';
				borderColor = 'border-orange-600';
				shadowColor = 'shadow-orange-300';
				break;
			default:
				break;
		}

		let tclass = `py-2 px-4 rounded-3xl m-1 text-xs font-medium ${color} whitespace-nowrap`;
		if (option) {
			selected_id === option.id
				? (tclass += ` border-[2px] shadow-sm ${shadowColor} ${borderColor}`)
				: selected_id
					? (tclass += ' border-[2px] opacity-40')
					: (tclass += ' border-[2px]');
		} else {
			tclass += ` border-[2px] shadow-sm ${shadowColor} ${borderColor}`;
		}
		return tclass;
	}

	function toggleOption(option) {
		value = option.id;
	}
</script>

<div class="grid grid-cols-4">
	{#each removeOptions.filter((r) => !r.ignore) as option}
		<button class={getTagClass(option, value)} on:click={() => toggleOption(option)}>
			{option.name}
		</button>
	{/each}
</div>
