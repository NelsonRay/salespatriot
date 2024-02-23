<script>
	// @ts-nocheck
	export let value;
	export let disabled = false;
</script>

<textarea class="flex min-h-16 overflow-y-auto border rounded-md" bind:value {disabled} />
