<script>
	// @ts-nocheck
	export let value;
	export let disabled = false;
	export let addClass = '';
</script>

<textarea
	class="flex min-h-16 overflow-y-auto border rounded-md {addClass}"
	bind:value
	{disabled}
/>
