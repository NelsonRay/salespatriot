<script>
	//  @ts-nocheck
	export let value;
	export let disabled = false;
</script>

<input type="number" class="w-52 rounded-md mb-5 border" bind:value {disabled} />
