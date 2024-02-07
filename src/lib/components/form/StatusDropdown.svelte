<script>
	// @ts-nocheck
	import { tags } from '$lib/tags';

	export let value;
	export let status;

	let selected_tag_key;
	let openDropdown = false;

	// if includes status, update selected_tag_key

	const containsStatus = value.filter((e) => e.includes(status));
	if (containsStatus.length > 0) {
		selected_tag_key = containsStatus[0].split(':')[1];
	}

	function handleDropdownClick() {
		openDropdown = !(openDropdown ?? false);
	}

	function filterTags(status) {
		let filtered_tags = Object.keys(tags[status])
			.map((key) => ({ ...tags[status][key], key }))
			.filter((e) => e.level !== 3);

		return filtered_tags;
	}

	const handleDropdownFocusLoss = ({ relatedTarget, currentTarget }) => {
		// // use "focusout" event to ensure that we can close the dropdown when clicking outside or when we leave the dropdown with the "Tab" button
		if (relatedTarget instanceof HTMLElement && currentTarget.contains(relatedTarget)) return; // check if the new focus target doesn't present in the dropdown tree (exclude ul\li padding area because relatedTarget, in this case, will be null)
		openDropdown = false;
	};

	function updateValues() {
		value = value?.filter((e) => !e.includes(status)) ?? [];
		if (selected_tag_key) {
			value = [...value, `${status}:${selected_tag_key}`];
		}
	}
</script>

<div class="dropdown mb-5" on:focusout={handleDropdownFocusLoss}>
	<button
		class="btn m-1 {tags[status][selected_tag_key]?.color ?? 'bg-base-100'}"
		on:click={() => handleDropdownClick()}
	>
		{tags[status][selected_tag_key]?.name ?? 'Select'}
	</button>
	<ul
		class="dropdown-content z-[10] menu p-2 shadow bg-base-100 rounded-box w-52"
		style:visibility={openDropdown ? 'visible' : 'hidden'}
	>
		{#each filterTags(status) as tag (tag.level)}
			<li>
				<button
					on:click={() => {
						selected_tag_key = tag.key;
						updateValues();
						handleDropdownClick();
					}}
					class={tag.color + ' mb-1'}
				>
					{tag.name}
				</button>
			</li>
		{/each}
	</ul>
</div>
