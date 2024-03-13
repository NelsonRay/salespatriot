<script>
	//  @ts-nocheck
	export let value;
	export let disabled = false;
	export let width = null;
	export let focusCallback = () => {};
	export let blurCallback = () => {};
</script>

<input
	type="number"
	class="{width ?? 'w-52'} rounded-md border p-1"
	bind:value
	{disabled}
	autocomplete="off"
	on:focus={focusCallback}
	on:keyup={focusCallback}
	on:blur={blurCallback}
/>
