<script>
	//  @ts-nocheck
	export let value;
	export let disabled = false;
	export let fullWidth = true;
</script>

<input class="{fullWidth ? 'w-full' : ''} rounded-md mb-5 border" bind:value {disabled} />
