<script>
	//  @ts-nocheck
	export let value;
	export let disabled = false;
	export let fullWidth = true;
	export let forceCaps = false;

	function handleInput(event) {
		if (!forceCaps) return;
		value = event.target.value.replace(/^0+|^\s+/g, '').toUpperCase();
	}
</script>

<input
	class="{fullWidth ? 'w-full' : 'w-52'} rounded-md border p-1 focus:border-blue-400"
	autocomplete="off"
	bind:value
	on:input={handleInput}
	{disabled}
/>
