<script>
	// @ts-nocheck
	export let value;
	export let tags;
	export let tag_type;

	let openDropdown = false;

	function handleDropdownClick() {
		openDropdown = !(openDropdown ?? false);
	}

	function filterTags(type) {
		let filtered_tags = tags.filter((t) => t.type === type);

		filtered_tags.sort((a, b) => (a.level > b.level ? 1 : -1));
		return filtered_tags;
	}

	function getSelectedTagName(id) {
		if (!id) return undefined;
		return tags.filter((t) => t.id === id)[0].name;
	}

	function getSelectedTagColor(id) {
		if (!id) return undefined;
		return tags.filter((t) => t.id === id)[0].color;
	}

	function getTagClass(color) {
		switch (color) {
			case 'green':
				return 'bg-green-400';
			case 'blue':
				return 'bg-blue-400';
			case 'red':
				return 'bg-red-400';
			default:
				return '';
		}
	}

	const handleDropdownFocusLoss = ({ relatedTarget, currentTarget }) => {
		// // use "focusout" event to ensure that we can close the dropdown when clicking outside or when we leave the dropdown with the "Tab" button
		if (relatedTarget instanceof HTMLElement && currentTarget.contains(relatedTarget)) return; // check if the new focus target doesn't present in the dropdown tree (exclude ul\li padding area because relatedTarget, in this case, will be null)
		openDropdown = false;
	};
</script>

<div class="dropdown mb-5" on:focusout={handleDropdownFocusLoss}>
	<button
		class="btn m-1 {value ? getTagClass(getSelectedTagColor(value)) : 'bg-base-100'}"
		on:click={() => handleDropdownClick(tag_type)}
	>
		{getSelectedTagName(value) ?? 'Select'}
	</button>
	<ul
		class="dropdown-content z-[10] menu p-2 shadow bg-base-100 rounded-box w-52"
		style:visibility={openDropdown ? 'visible' : 'hidden'}
	>
		{#each filterTags(tag_type) as tag (tag.id)}
			<li>
				<button
					on:click={() => {
						value = tag.id;
						handleDropdownClick();
					}}
					class={getTagClass(tag.color) + ' mb-1'}
				>
					{tag.name}
				</button>
			</li>
		{/each}
	</ul>
</div>
