<script>
	// @ts-nocheck
	import { Dropdown } from 'flowbite-svelte';

	export let value;
	export let status;
	export let tags;
	export let skipInProgress = true;
	export let dropdown = false;

	let selected_tag_key;
	let dropdownOpen = false;

	// if includes status, update selected_tag_key
	$: if (value?.filter((e) => e.includes(status))?.length > 0) {
		if (
			skipInProgress &&
			value?.filter((e) => e.includes(status))[0].split(':')[1] === 'in_progress'
		) {
			value = value.filter((e) => !e.includes(status));
		} else {
			selected_tag_key = value?.filter((e) => e.includes(status))[0].split(':')[1];
		}
	}

	function filterTags(status) {
		let filtered_tags = Object.keys(tags[status])
			.map((key) => ({ ...tags[status][key], key }))
			.filter((e) => (skipInProgress ? e.key !== 'in_progress' : true));

		return filtered_tags;
	}

	function updateValues(key) {
		selected_tag_key = key;

		value = value?.filter((e) => !e.includes(status)) ?? [];
		if (selected_tag_key) {
			value = [...value, `${status}:${selected_tag_key}`];
		}

		dropdownOpen = false; // if needed
	}

	function getTagClass(key, status, selected_tag_key) {
		let color = '';
		let borderColor = '';
		let shadowColor = '';

		switch (key ? tags[status][key].color : tags[status][selected_tag_key].color) {
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
				color = 'bg-gray-500';
				borderColor = 'border-gray-600';
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
		if (key) {
			selected_tag_key === key
				? (tclass += ` border-[2px] shadow-sm ${shadowColor} ${borderColor}`)
				: selected_tag_key
					? (tclass += ' border-[2px] opacity-40')
					: (tclass += ' border-[2px]');
		} else {
			tclass += ` border-[2px] shadow-sm ${shadowColor} ${borderColor}`;
		}
		return tclass;
	}
</script>

{#if !dropdown}
	<div class="flex flex-row">
		{#each filterTags(status) as tag}
			<button
				class={getTagClass(tag.key, status, selected_tag_key)}
				on:click={() => updateValues(tag.key)}
			>
				{tags[status][tag.key]?.name}
			</button>
		{/each}
	</div>
{:else}
	<div class="z-10">
		<button
			class={selected_tag_key
				? getTagClass(null, status, selected_tag_key)
				: 'py-2 px-4 rounded-3xl m-1 text-xs font-medium bg-neutral-50 border-[2px] shadow-sm shadow-neutral-200 border-neutral-200 whitespace-nowrap text-neutral-600'}
		>
			{selected_tag_key ? tags[status][selected_tag_key]?.name : 'Select'}
		</button>

		<Dropdown bind:open={dropdownOpen} class="bg-white">
			<ul>
				{#each filterTags(status) as tag}
					<li>
						<button
							class={getTagClass(tag.key, status, selected_tag_key)}
							on:click={() => updateValues(tag.key)}
						>
							{tags[status][tag.key]?.name}
						</button>
					</li>
				{/each}
			</ul>
		</Dropdown>
	</div>
{/if}
