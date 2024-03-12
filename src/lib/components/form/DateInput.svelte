<script>
	//  @ts-nocheck
	export let value;
	export let disabled = false;
	export let fullWidth = true;
</script>

<input
	class="{fullWidth ? 'w-full' : 'w-52'} rounded-md border p-1 focus:border-blue-400"
	autocomplete="off"
	type="date"
	bind:value
	{disabled}
/>
