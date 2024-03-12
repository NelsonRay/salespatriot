<script>
	//  @ts-nocheck
	export let value;
	export let disabled = false;
	export let width;
</script>

<input
	type="number"
	class="{width ?? 'w-52'} rounded-md border p-1"
	bind:value
	{disabled}
	autocomplete="off"
/>
