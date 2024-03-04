<script>
	// @ts-nocheck
	import { getBidPartners } from '$lib/helpers';

	const partners = getBidPartners().filter((p) => !p.inactive);

	export let value;

	function getTagClass(id, selected) {
		let color = '';
		let borderColor = '';
		let shadowColor = '';
		switch (id) {
			case '66ebce9c-66db-45cf-a91e-1425a45b47b2':
				color = 'bg-green-300';
				borderColor = 'border-green-500';
				shadowColor = 'shadow-green-200';
				break;
			case '0a47172d-8394-4f28-a4be-1606aa395380':
				color = 'bg-yellow-300';
				borderColor = 'border-yellow-500';
				shadowColor = 'shadow-yellow-200';
				break;
			case '297ca905-a9dd-48f5-9af3-306547997320':
				color = 'bg-purple-300';
				borderColor = 'border-purple-500';
				shadowColor = 'shadow-purple-200';
				break;
			case '1c3ea0f7-a624-44b7-91fd-3efc82e982a8':
				color = 'bg-orange-300';
				borderColor = 'border-orange-500';
				shadowColor = 'shadow-orange-200';
				break;
			case '36d12554-f91f-4e16-a2e1-018d15552a54':
				color = 'bg-blue-300';
				borderColor = 'border-blue-500';
				shadowColor = 'shadow-blue-200';
				break;
			default:
				break;
		}

		let tclass = `py-3 px-6 rounded-3xl m-1 text-xs font-medium ${color}`;

		(selected ?? []).includes(id)
			? (tclass += ` border-[2px] shadow-md ${shadowColor} ${borderColor}`)
			: (tclass += ' border-[2px] opacity-40');

		return tclass;
	}

	function togglePartner(id) {
		if ((value ?? []).includes(id)) {
			value = (value ?? []).filter((p) => p !== id);
		} else {
			value = [...(value ?? []), id];
		}
	}
</script>

<div class="flex flex-row">
	{#each partners as partner}
		<button class={getTagClass(partner.id, value)} on:click={() => togglePartner(partner.id)}>
			{partner.name}
		</button>
	{/each}
</div>
