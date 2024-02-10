<script>
	// @ts-nocheck
	import { tags } from '$lib/tags';

	export let value;
	export let status;

	let selected_tag_key;

	// if includes status, update selected_tag_key

	const containsStatus = value.filter((e) => e.includes(status));
	if (containsStatus.length > 0) {
		if (containsStatus[0].split(':')[1] === 'in_progress') {
			value = value.filter((e) => !e.includes(status));
		} else {
			selected_tag_key = containsStatus[0].split(':')[1];
		}
	}

	function filterTags(status) {
		let filtered_tags = Object.keys(tags[status])
			.map((key) => ({ ...tags[status][key], key }))
			.filter((e) => e.level !== 3);

		return filtered_tags;
	}

	function updateValues(key) {
		selected_tag_key = key;

		value = value?.filter((e) => !e.includes(status)) ?? [];
		if (selected_tag_key) {
			value = [...value, `${status}:${selected_tag_key}`];
		}
	}

	function getTagClass(key, selected_tag_key) {
		let tclass = `py-3 px-6 rounded-3xl m-1 text-md font-medium bg-${tags[status][key].color}-400 border-${tags[status][key].color}-700`;
		selected_tag_key === key
			? (tclass += ` border-[4px] shadow-lg shadow-${tags[status][key].color}-400`)
			: (tclass += ' border-[0px]');
		return tclass;
	}
</script>

<div class="flex flex-row mb-5">
	{#each filterTags(status) as tag}
		<button class={getTagClass(tag.key, selected_tag_key)} on:click={() => updateValues(tag.key)}>
			{tags[status][tag.key]?.name}
		</button>
	{/each}
</div>
