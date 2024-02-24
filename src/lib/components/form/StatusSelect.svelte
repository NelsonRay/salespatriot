<script>
	// @ts-nocheck
	export let value;
	export let status;
	export let tags;
	export let skipInProgress = true;

	let selected_tag_key;

	// if includes status, update selected_tag_key
	const containsStatus = value?.filter((e) => e.includes(status));
	if (containsStatus?.length > 0) {
		if (skipInProgress && containsStatus[0].split(':')[1] === 'in_progress') {
			value = value.filter((e) => !e.includes(status));
		} else {
			selected_tag_key = containsStatus[0].split(':')[1];
		}
	}

	function filterTags(status) {
		let filtered_tags = Object.keys(tags[status])
			.map((key) => ({ ...tags[status][key], key }))
			.filter((e) => (skipInProgress ? e.key.split(':')[1] !== 'in_progress' : true));

		return filtered_tags;
	}

	function updateValues(key) {
		selected_tag_key = key;

		value = value?.filter((e) => !e.includes(status)) ?? [];
		if (selected_tag_key) {
			value = [...value, `${status}:${selected_tag_key}`];
		}
	}

	function getTagClass(key, status, selected_tag_key) {
		let color = '';
		let borderColor = '';
		let shadowColor = '';
		switch (tags[status][key].color) {
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

		let tclass = `py-3 px-6 rounded-3xl m-1 text-xs font-medium ${color}`;
		selected_tag_key === key
			? (tclass += ` border-[2px] shadow-md ${shadowColor} ${borderColor}`)
			: (tclass += ' border-[2px]');
		return tclass;
	}
</script>

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
