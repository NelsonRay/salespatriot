<script>
	//  @ts-nocheck
	export let value;
	export let disabled = false;
	export let fullWidth = true;
</script>

<input class="{fullWidth ? 'w-full' : 'w-52'} rounded-md border p-1" bind:value {disabled} />
