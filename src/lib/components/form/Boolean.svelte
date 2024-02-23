<script>
	// @ts-nocheck
	export let value;

	function getTagClass(answer, value) {
		let color = '';
		let borderColor = '';
		let shadowColor = '';
		if (answer) {
			color = 'bg-green-400';
			borderColor = 'border-green-600';
			shadowColor = 'shadow-green-300';
		} else {
			color = 'bg-red-400';
			borderColor = 'border-red-600';
			shadowColor = 'shadow-red-300';
		}

		let tclass = `py-3 px-6 rounded-3xl m-1 text-xs font-medium ${color}`;
		answer === value
			? (tclass += ` border-[2px] shadow-md ${shadowColor} ${borderColor}`)
			: (tclass += ' border-[2px]');
		return tclass;
	}
</script>

<div class="flex flex-row">
	{#each [true, false] as answer}
		<button class={getTagClass(answer, value)} on:click={() => (value = answer)}>
			{answer ? 'Yes' : 'No'}
		</button>
	{/each}
</div>
