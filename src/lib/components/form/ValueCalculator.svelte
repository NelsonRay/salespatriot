<script>
	// @ts-nocheck
	export let show = true;
	export let values;
</script>

{#if show}
	<div class="bg-neutral-50 shadow-sm rounded-md p-3">
		<div class="flex flex-col">
			<p class="text-base font-medium mb-2">Value Calculator</p>
			{#if !values}
				<p>Focus part to start calculating...</p>
			{:else}
				<div class="flex flex-row space-x-5">
					<div class="flex flex-col space-y-2">
						<p class="text-gray-400">Unit Price:</p>
						<p class="text-gray-400">Estimated Cost:</p>
						<p class="text-gray-400 ml-2">Est. Material Cost:</p>
						<p class="text-gray-400 ml-2">Est. Labor Cost:</p>
						<p class="text-gray-400 ml-2">Est. Packaging Cost:</p>
						<p class="text-gray-400">Estimated Profit:</p>

						<div class="h-2" />
						<p class="text-gray-400">Market Value:</p>
						<p class="text-gray-400">Estimated Total Profit:</p>
					</div>
					<div class="flex flex-col space-y-2">
						<p class={values?.unit_price ? '' : 'text-gray-300'}>
							{values?.unit_price ?? 'N/A'}
						</p>
						<p class={values?.estimated_cost ? '' : 'text-gray-300'}>
							{values?.estimated_cost ?? 'N/A'}
						</p>
						<p class={values?.estimated_material_cost ? 'ml-2' : 'ml-2 text-gray-300'}>
							{values?.estimated_material_cost ?? 'N/A'}
						</p>
						<p class={values?.estimated_labor_cost ? 'ml-2' : 'ml-2 text-gray-300'}>
							{values?.estimated_labor_cost ?? 'N/A'}
						</p>
						<p class={values?.estimated_packaging_cost ? 'ml-2' : 'ml-2 text-gray-300'}>
							{values?.estimated_packaging_cost ?? 'N/A'}
						</p>
						<p class={values?.estimated_profit ? '' : 'text-gray-300'}>
							{values?.estimated_profit ?? 'N/A'}
						</p>
						<div class="h-2" />
						<p class={values?.market_value ? '' : 'text-gray-300'}>
							{values?.market_value ?? 'N/A'}
						</p>
						<p class={values?.estimated_total_profit ? '' : 'text-gray-300'}>
							{values?.estimated_total_profit ?? 'N/A'}
						</p>
					</div>
					<div class="flex flex-col space-y-2">
						<p class={values?.unit_price_date ? '' : 'text-gray-300'}>
							{values?.unit_price_date ?? 'N/A'}
						</p>
						<div class="h-6"></div>
						<p class={values?.estimated_labor_cost_date ? '' : 'text-gray-300'}>
							{values?.estimated_labor_cost_date ?? 'N/A'}
						</p>
						<p class={values?.estimated_material_cost_date ? '' : 'text-gray-300'}>
							{values?.estimated_material_cost_date ?? 'N/A'}
						</p>
						<p class={values?.profit_margin ? '' : 'text-gray-300'}>
							{values?.profit_margin ?? ''}
						</p>
					</div>
				</div>
			{/if}
		</div>
	</div>
	<!-- {#if reviewValues.previous_bid_outcome}
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
				{/if} -->
{/if}
