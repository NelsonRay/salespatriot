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
		calculateDaysDifference,
		getStatusColor,
		getStatusName,
		addCommasToNumber
	} from '$lib/helpers.js';
	import Download from '$lib/icons/Download.svg';

	export let solicitation_matched;
	export let nsn_matches;
	export let values;
	export let form;

	// get updated review values
	$: ({ values: reviewValues, award_details } = nsn_matches
		? getReviewValues([{ ...solicitation_matched, ...(values || {}) }, ...(nsn_matches ?? [])])
		: {});
</script>

<div class="flex flex-col text-[14px] pr-2">
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
		<div class="grid grid-cols-2 gap-3">
			<div class="flex flex-col justify-between bg-neutral-50 shadow-sm rounded-md p-3">
				<div>
					<p class="text-base font-medium mb-2">Solicitation Info</p>
					<div class="flex flex-row space-x-8">
						<div class="space-y-2">
							<div class="flex flex-row space-x-1">
								<p class="text-gray-400">Status:</p>
								<p>
									{solicitation_matched.solicitation.contract_status}
								</p>
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
										{addCommasToNumber(solicitation_matched.solicitation.quantity)}
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

							<div>
								<div class="flex flex-row space-x-1">
									<p class="text-gray-400">Expires:</p>
									<p>
										{formatMonthDayYearDate(solicitation_matched.solicitation.expires_on) +
											` (${calculateDaysDifference(solicitation_matched.solicitation.expires_on)}d)`}
									</p>
								</div>

								<div class="flex flex-row space-x-1">
									<p class="text-gray-400">Issued:</p>
									<p>
										{formatMonthDayYearDate(solicitation_matched.solicitation.issued_on)}
									</p>
								</div>
							</div>
						</div>

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
									<p class="text-gray-400">First Article:</p>
									<p>
										{solicitation_matched.solicitation.first_article ? 'Yes' : 'No'}
									</p>
								</div>
								<div class="flex flex-row space-x-1">
									<p class="text-gray-400">Higher Quality (Mfg):</p>
									<p>
										{solicitation_matched.solicitation.first_article ? 'Yes' : 'No'}
									</p>
								</div>
							</div>

							<div>
								<div class="flex flex-row space-x-1">
									<p class="text-gray-400">Inspection At:</p>
									<p>
										{solicitation_matched.solicitation.inspection_location ?? 'N/A'}
									</p>
								</div>
								<div class="flex flex-row space-x-1">
									<p class="text-gray-400">FOB:</p>
									<p>
										{solicitation_matched.solicitation.fob ?? 'N/A'}
									</p>
								</div>
							</div>
							<div>
								<div class="flex flex-row space-x-1">
									<p class="text-gray-400">Days to Deliver:</p>
									<p>
										{solicitation_matched.solicitation.days_to_deliver}
									</p>
								</div>
								<div class="flex flex-row space-x-1">
									<p class="text-gray-400">Est. Purchasing Days:</p>
									<p
										class={values.estimated_purchasing_days >
										solicitation_matched.solicitation.days_to_deliver
											? 'text-red-500'
											: ''}
									>
										{values.estimated_purchasing_days ?? 'N/A'}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="flex flex-row justify-between mt-5">
					<a
						class="w-full mr-2 p-2 {solicitation_matched.solicitation.solicitation_url
							? 'bg-gray-100 rounded-md shadow-md'
							: ''}"
						href={solicitation_matched.solicitation.solicitation_url || null}
						target="_blank"
					>
						<div class="flex flex-row justify-center items-center space-x-1">
							<p class={solicitation_matched.solicitation.solicitation_url ? '' : 'text-gray-400'}>
								{solicitation_matched.solicitation.solicitation_url
									? 'Solicitation URL'
									: 'No Solicitation URL'}
							</p>
							{#if solicitation_matched.solicitation.solicitation_url}
								<img src={Download} alt="download" class="w-4 h-4" />
							{/if}
						</div>
					</a>

					<a
						class="w-full mr-2 p-2 {solicitation_matched.solicitation.tech_docs
							? 'bg-neutral-100 rounded-md shadow-md'
							: ''}"
						href={solicitation_matched.solicitation.tech_docs || null}
						target="_blank"
					>
						<div class="flex flex-row justify-center items-center space-x-1">
							<p class={solicitation_matched.solicitation.tech_docs ? '' : 'text-gray-400'}>
								{solicitation_matched.solicitation.tech_docs ? 'Tech Docs' : 'No Tech Docs'}
							</p>
							{#if solicitation_matched.solicitation.tech_docs}
								<img src={Download} alt="download" class="w-4 h-4" />
							{/if}
						</div>
					</a>
				</div>
			</div>

			{#if nsn_matches}
				<div class="bg-neutral-50 shadow-sm rounded-md p-3">
					<div class="flex flex-col">
						<p class="text-base font-medium mb-2">Value Calculator</p>
						<div class="flex flex-row space-x-5">
							<div class="flex flex-col space-y-2">
								<p class="text-gray-400">Unit Price:</p>
								<p class="text-gray-400">Estimated Labor Cost:</p>
								<p class="text-gray-400">Estimated Mat. Cost:</p>
								<p class="text-gray-400">Estimated Cost:</p>
								<p class="text-gray-400">Estimated Profit:</p>

								<div class="h-2" />
								<p class="text-gray-400">Market Value:</p>
								<p class="text-gray-400">Estimated Total Profit:</p>
							</div>
							<div class="flex flex-col space-y-2">
								<p class={reviewValues.unit_price ? '' : 'text-gray-300'}>
									{reviewValues.unit_price ?? 'N/A'}
								</p>
								<p class={reviewValues.estimated_labor_cost ? '' : 'text-gray-300'}>
									{reviewValues.estimated_labor_cost ?? 'N/A'}
								</p>
								<p class={reviewValues.estimated_material_cost ? '' : 'text-gray-300'}>
									{reviewValues.estimated_material_cost ?? 'N/A'}
								</p>
								<p class={reviewValues.estimated_cost ? '' : 'text-gray-300'}>
									{reviewValues.estimated_cost ?? 'N/A'}
								</p>
								<p class={reviewValues.estimated_profit ? '' : 'text-gray-300'}>
									{reviewValues.estimated_profit ?? 'N/A'}
								</p>
								<div class="h-2" />
								<p class={reviewValues.market_value ? '' : 'text-gray-300'}>
									{reviewValues.market_value ?? 'N/A'}
								</p>
								<p class={reviewValues.estimated_total_profit ? '' : 'text-gray-300'}>
									{reviewValues.estimated_total_profit ?? 'N/A'}
								</p>
							</div>
							<div class="flex flex-col space-y-2">
								<p class={reviewValues.unit_price_date ? '' : 'text-gray-300'}>
									{reviewValues.unit_price_date ?? 'N/A'}
								</p>
								<p class={reviewValues.estimated_labor_cost_date ? '' : 'text-gray-300'}>
									{reviewValues.estimated_labor_cost_date ?? 'N/A'}
								</p>
								<p class={reviewValues.estimated_material_cost_date ? '' : 'text-gray-300'}>
									{reviewValues.estimated_material_cost_date ?? 'N/A'}
								</p>
								<p class="h-[72px]"></p>
								<p class={reviewValues.quantity ? '' : 'text-gray-300'}>
									{addCommasToNumber(solicitation_matched.solicitation.quantity)}
									{solicitation_matched.solicitation.quantity_units}
								</p>
								<p class={reviewValues.profit_margin ? '' : 'text-gray-300'}>
									{reviewValues.profit_margin ?? 'N/A'}
								</p>
							</div>
						</div>
					</div>
				</div>
				{#if reviewValues.previous_bid_outcome}
					<div />
					<div class="bg-neutral-50 shadow-sm rounded-md p-3">
						<div class="flex flex-col">
							<div class="flex flex-row justify-between">
								<p class="text-base font-medium mb-2">Previous Bid Outcome</p>
								<div
									class="p-1 px-2 rounded-md inline-block text-xs mb-2 {getStatusColor(
										reviewValues.previous_bid_outcome
									) ?? ''}"
								>
									{getStatusName(reviewValues.previous_bid_outcome) ?? ''}
								</div>
							</div>
							{#if award_details}
								<div class="flex flex-row space-x-5 mt-2">
									<div class="flex flex-col space-y-2">
										<p class="text-gray-400">Price Won At:</p>
										{#if reviewValues.previous_bid_outcome === 'award:lost'}
											<p class="text-gray-400">Company Awarded:</p>
											<p class="text-gray-400">Estimated Pur. Days:</p>
										{/if}
									</div>
									<div class="flex flex-col space-y-2">
										<p class={award_details.unit_price_won_at ? '' : 'text-gray-300'}>
											{award_details.unit_price_won_at ?? 'N/A'}
										</p>
										{#if reviewValues.previous_bid_outcome === 'award:lost'}
											<p class={award_details.company_awarded ? '' : 'text-gray-300'}>
												{award_details.company_awarded ?? 'N/A'}
											</p>
											<p class={award_details.date_awarded ? '' : 'text-gray-300'}>
												{award_details.date_awarded ?? 'N/A'}
											</p>
										{/if}
									</div>
								</div>
							{/if}
						</div>
					</div>
				{/if}
			{/if}
		</div>
	{/if}
</div>
