<script>
	// @ts-nocheck
	export let value;

	function getClass(answer, value) {
		let tclass = `py-3 px-6 rounded-3xl m-1 text-md font-medium bg-${answer ? 'green' : 'red'}-400 border-${answer ? 'green' : 'red'}-700`;
		answer === value
			? (tclass += ` border-[4px] shadow-lg shadow-${answer ? 'green' : 'red'}-400`)
			: (tclass += ' border-[0px]');
		return tclass;
	}
</script>

<div class="flex flex-row mb-5">
	{#each [true, false] as answer}
		<button class={getClass(answer, value)} on:click={() => (value = answer)}>
			{answer ? 'Yes' : 'No'}
		</button>
	{/each}
</div>
