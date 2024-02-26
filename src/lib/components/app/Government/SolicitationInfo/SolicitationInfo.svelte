<script>
	// @ts-nocheck
	import { tableFieldMapper } from '$lib/mappers';
	import { formatCurrency, getMatchingClass, getSetAsideColor } from '$lib/helpers.js';

	export let solicitation_matched;
</script>

<div class="space-y-2">
	<div class="mb-3">
		<div class="flex flex-row items-center space-x-2">
			<p class="text-lg font-semibold">{solicitation_matched.solicitation.number}</p>
			{#if solicitation_matched?.matching_rule?.name}
				<div
					class="px-2 py-1 rounded-md {getMatchingClass(solicitation_matched?.matching_rule?.name)}"
				>
					<p class="text-xs">{solicitation_matched?.matching_rule?.name}</p>
				</div>
			{/if}
		</div>
		<p class="text-sm mt-1">{solicitation_matched.solicitation.description}</p>
	</div>

	<div>
		<div class="flex flex-row space-x-1 items-center">
			<p class="text-gray-400">Set Aside:</p>
			{#if solicitation_matched.solicitation.set_aside}
				<div
					class="py-1 px-2 rounded-md inline-block text-xs {getSetAsideColor(
						solicitation_matched.solicitation.set_aside
					)}"
				>
					{solicitation_matched.solicitation.set_aside}
				</div>
			{:else}
				<p>None</p>
			{/if}
		</div>
	</div>

	<div>
		<div class="flex flex-row space-x-1">
			<p class="text-gray-400">NSN:</p>
			<p>
				{solicitation_matched.solicitation.nsn.id}
			</p>
		</div>

		<div class="flex flex-row space-x-1">
			<p class="text-gray-400">In-House PN:</p>
			<p>
				{tableFieldMapper(solicitation_matched, {
					type: 'field',
					field: 'solicitation.nsn.matching_nsns',
					array_selector: 'part_number',
					header: 'In-House PN'
				}).value || 'N/A'}
			</p>
		</div>
	</div>

	<div>
		<div class="flex flex-row space-x-1">
			<p class="text-gray-400">Quantity:</p>
			<p>
				{solicitation_matched.solicitation.quantity}
				{solicitation_matched.solicitation.quantity_units}
			</p>
		</div>
		<div class="flex flex-row space-x-1">
			<p class="text-gray-400">Est. Value:</p>
			<p>
				{formatCurrency(solicitation_matched.solicitation.estimated_value)}
			</p>
		</div>
	</div>

	<div class="flex flex-row space-x-1">
		<p class="text-gray-400">Status:</p>
		<p>
			{solicitation_matched.solicitation.contract_status}
		</p>
	</div>

	<div>
		<div class="flex flex-row space-x-1">
			<p class="text-gray-400">Expires:</p>
			<p>
				{solicitation_matched.solicitation.expires_on}
			</p>
		</div>

		<div class="flex flex-row space-x-1">
			<p class="text-gray-400">Issued:</p>
			<p>
				{solicitation_matched.solicitation.issued_on}
			</p>
		</div>
	</div>

	<div>
		<div class="flex flex-row space-x-1">
			<p class="text-gray-400">First Article:</p>
			<p>
				{solicitation_matched.solicitation.first_article ? 'Yes' : 'No'}
			</p>
		</div>
	</div>

	<div>
		<div class="flex flex-row space-x-1">
			<p class="text-gray-400">Tech Docs:</p>
			{#if solicitation_matched.solicitation.tech_docs}
				<a href={solicitation_matched.solicitation.tech_docs} target="_blank" class="text-blue-500">
					URL
				</a>
			{:else}
				<p>None</p>
			{/if}
		</div>
		<div class="flex flex-row space-x-1">
			<p class="text-gray-400">Solicitation URL:</p>
			{#if solicitation_matched.solicitation.solicitation_url}
				<a
					href={solicitation_matched.solicitation.solicitation_url}
					target="_blank"
					class="text-blue-500"
				>
					URL
				</a>
			{:else}
				<p>None</p>
			{/if}
		</div>
	</div>

	<div class="flex flex-row space-x-1">
		<p class="text-gray-400">Days to Deliver:</p>
		<p>
			{solicitation_matched.solicitation.days_to_deliver}
		</p>
	</div>
</div>
