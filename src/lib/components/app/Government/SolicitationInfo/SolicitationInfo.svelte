<script>
	// @ts-nocheck
	import { tableFieldMapper } from '$lib/mappers';
	import {
		formatCurrency,
		getMatchingClass,
		getReviewValues,
		getSetAsideColor,
		getFamiliarityClass,
		formatMonthDayYearDate,
		calculateDaysDifference
	} from '$lib/helpers.js';

	export let solicitation_matched;
	export let nsn_matches;
	export let values;
	export let form;

	// get updated review values
	$: ({
		values: reviewValues,
		dates,
		award_details
	} = nsn_matches
		? getReviewValues([{ ...solicitation_matched, ...(values || {}) }, ...(nsn_matches ?? [])])
		: {});
</script>

<div class="flex flex-col">
	<div class="mb-3">
		<div class="flex flex-row items-center space-x-2 mb-1">
			{#if solicitation_matched?.matching_rule?.name}
				<div
					class="px-2 py-1 rounded-md {getMatchingClass(solicitation_matched?.matching_rule?.name)}"
				>
					<p class="text-xs">{solicitation_matched?.matching_rule?.name}</p>
				</div>
			{/if}
			{#if solicitation_matched.familiarity_status}
				<div
					class="px-2 py-1 rounded-md {getFamiliarityClass(
						solicitation_matched.familiarity_status
					)}"
				>
					<p class="text-xs">
						{solicitation_matched.familiarity_status}
					</p>
				</div>
			{/if}
		</div>
		<p class="text-lg font-semibold">{solicitation_matched.solicitation.id}</p>
		<p class="text-sm mt-1">{solicitation_matched.solicitation.description}</p>
	</div>

	{#if !['enter_quote', 'bid'].includes(form?.type)}
		<div class="flex flex-row">
			<div class="flex flex-row bg-neutral-100 space-x-10 rounded-md p-4">
				<div class="space-y-2">
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
							<p class="text-gray-400">Unit Price:</p>
							<p>
								{values?.unit_price ? formatCurrency(values?.unit_price) : 'N/A'}
							</p>
						</div>
						<div class="flex flex-row space-x-1">
							<p class="text-gray-400">Market Value:</p>
							<p>
								{values?.unit_price
									? formatCurrency(values?.unit_price * solicitation_matched.solicitation.quantity)
									: 'N/A'}
							</p>
						</div>
						<div class="flex flex-row space-x-1">
							<p class="text-gray-400">Est. Value:</p>
							<p>
								{formatCurrency(solicitation_matched.solicitation.estimated_value)}
							</p>
						</div>
					</div>
				</div>

				<div class="space-y-2">
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
								{formatMonthDayYearDate(solicitation_matched.solicitation.expires_on) +
									` (${calculateDaysDifference(solicitation_matched.solicitation.expires_on)} days)`}
							</p>
						</div>

						<div class="flex flex-row space-x-1">
							<p class="text-gray-400">Issued:</p>
							<p>
								{formatMonthDayYearDate(solicitation_matched.solicitation.issued_on)}
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
								<a
									href={solicitation_matched.solicitation.tech_docs}
									target="_blank"
									class="text-blue-500"
								>
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
			</div>
			{#if nsn_matches}
				<div class="ml-5 bg-neutral-100 rounded-md">
					<div class="flex flex-col">
						<div class="flex flex-row space-x-5 p-4">
							<div class="flex flex-col space-y-3">
								<p class="text-gray-400">Estimated Labor Cost:</p>
								<p class="text-gray-400">Estimated Mat. Cost:</p>
								<p class="text-gray-400">Estimated Pur. Days:</p>
								<p class="text-gray-400">Estimated Total Cost:</p>
								<p class="text-gray-400">Price Last Bid:</p>
								<p class="text-gray-400">Prev Bid Outcome:</p>
							</div>
							<div class="flex flex-col space-y-3">
								{#each reviewValues as value}
									<p>{value}</p>
								{/each}
							</div>
							<div class="flex flex-col space-y-3">
								{#each dates as date}
									<p>{date}</p>
								{/each}
							</div>
						</div>
						{#if award_details}
							<div class="flex flex-col justify-between bg-neutral-200 rounded-md m-2 p-2">
								<p class="text-gray-400">Award Details:</p>
								<div class="flex flex-row space-x-3">
									<p>Company:</p>
									<p>{award_details.company_awarded}</p>
								</div>
								<div class="flex flex-row space-x-3">
									<p>Unit Price:</p>
									<p>{award_details.unit_price_won_at}</p>
								</div>
								<div class="flex flex-row space-x-3">
									<p>Awarded:</p>
									<p>{award_details.date_awarded}</p>
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
