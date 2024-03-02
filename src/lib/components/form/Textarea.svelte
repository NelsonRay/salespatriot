<script>
	// @ts-nocheck
	export let value;
	export let disabled = false;
	export let autoCollapse = true;

	function handleClick() {
		value = '';
	}
</script>

{#if !(value?.length > -1) && autoCollapse}
	<button class="bg-gray-200 rounded-md p-1 text-sm" on:click={handleClick}>Add Notes</button>
{:else}
	<textarea
		class="flex min-h-16 overflow-y-auto border rounded-md w-full p-1 text-sm"
		bind:value
		{disabled}
	/>
{/if}
