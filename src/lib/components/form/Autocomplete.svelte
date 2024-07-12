<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { capitalizeFirstLetter } from '$lib/helpers';
	import { createEventDispatcher } from 'svelte';

	export let value;
	export let query;
	export let extractItemName;
	export let disabled;
	export let forceCaps = false;
	export let searchParts = false;
	export let preventCreate = false;

	let dispatch = createEventDispatcher();

	let isMounted = false;
	let items = null;
	let timer;
	let isLoading = false;
	let creating = false;

	function onItemClicked(item) {
		// @ts-ignore
		document.activeElement.blur();
		dispatch('selection', item);
	}

	async function callQuery() {
		items = await query(value);
		isLoading = false;
	}

	function debounce() {
		clearTimeout(timer);
		timer = setTimeout(() => {
			callQuery();
		}, 200);
	}

	function handleCreate() {
		creating = true;
		dispatch('create');
	}

	function handleInput(event) {
		if (!forceCaps) return;

		let updatedValue = event.target.value.replace(/^0+|^\s+/g, '');

		if (searchParts) {
			updatedValue = updatedValue.replace(/\s+/g, '').replace(/,/g, '');
		}

		value = updatedValue.toUpperCase();
	}

	onMount(() => {
		isMounted = true;
	});

	$: if (isMounted && value != null && value !== '' && !creating) {
		value = capitalizeFirstLetter(value);
		debounce();
	}
</script>

<div class="dropdown">
	<input
		class="w-full rounded-md border p-1 focus:border-blue-400"
		autocomplete="off"
		bind:value
		on:input={handleInput}
		{disabled}
	/>

	{#if !creating}
		<ul
			tabIndex={0}
			class="dropdown-content z-[1] menu p-2 shadow-md bg-neutral-50 rounded-box w-64 max-h-80 flex-nowrap overflow-auto"
		>
			{#if !isLoading}
				{#if items?.length > 0}
					{#each items ?? [] as item}
						<li>
							<button on:click|preventDefault={() => onItemClicked(item)}
								>{extractItemName(item)}</button
							>
						</li>
					{/each}
				{:else if items?.length === 0}
					<div class="flex flex-row justify-center items-center my-2 space-x-2">
						<p class="text-gray-400">No results.</p>
						{#if !preventCreate}
							<button on:click={handleCreate}>
								<p class="text-blue-400">Create</p>
							</button>
						{/if}
					</div>
				{:else}
					<div class="flex flex-col justify-center items-center my-2">
						<p class="text-gray-400">Type to search...</p>
					</div>
				{/if}
			{:else}
				<div class="flex flex-col justify-center items-center my-2">
					<span class="loading loading-spinner loading-md"></span>
				</div>
			{/if}
		</ul>
	{/if}
</div>
