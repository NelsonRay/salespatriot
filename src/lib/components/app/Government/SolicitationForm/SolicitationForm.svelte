<script>
	// @ts-nocheck
	import StatusSelect from '$lib/components/form/StatusSelect.svelte';
	import Currency from '$lib/components/form/Currency.svelte';
	import Textarea from '$lib/components/form/Textarea.svelte';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import Boolean from '$lib/components/form/Boolean.svelte';
	import { govMapper } from '$lib/mappers';
	import Table from '$lib/components/app/Government/Table/Table.svelte';
	import Arrow from '$lib/icons/Arrow.svg';
	import DlaForecast from '$lib/components/app/Government/DLAForecast/DLAForecast.svelte';
	import AwardHistory from '$lib/components/app/Government/AwardHistory/AwardHistory.svelte';
	import SolicitationInfo from '$lib/components/app/Government/SolicitationInfo/SolicitationInfo.svelte';

	export let solicitation_matched;
	export let values;
	export let nsn_matches = null;
	export let form = null;
	export let handleSubmit;
	export let isSubmitting;

	function capitalizeFirstLetter(sentence) {
		return sentence.replace(/\b\w/g, function (char) {
			return char.toUpperCase();
		});
	}

	function goBack() {
		window.location.href = `${window.location.origin}`;
	}

	const matched_fields = [
		{
			type: 'status',
			status: 'opportunity'
		},
		{
			type: 'currency',
			field: 'price_per_unit'
		},
		{
			type: 'textarea',
			field: 'opportunity_notes'
		},

		{
			type: 'status',
			status: 'engineering'
		},
		{
			type: 'textarea',
			field: 'engineering_notes'
		},
		{
			type: 'status',
			status: 'bom'
		},
		{
			type: 'link',
			field: 'bom_url'
		},
		{
			type: 'textarea',
			field: 'bom_notes'
		},
		{
			type: 'status',
			status: 'purchasing'
		},
		{
			type: 'currency',
			field: 'estimated_purchasing_budget'
		},
		{
			type: 'currency',
			field: 'estimated_purchasing_days'
		},
		{
			type: 'textarea',
			field: 'purchasing_notes'
		},
		{
			type: 'status',
			status: 'labor'
		},
		{
			type: 'currency',
			field: 'estimated_labor_hours'
		},
		{
			type: 'textarea',
			field: 'special_equipment'
		},
		{
			type: 'textarea',
			field: 'labor_notes'
		},
		{
			type: 'status',
			status: 'review'
		},
		{
			type: 'textarea',
			field: 'review_notes'
		},
		{
			type: 'status',
			status: 'bid'
		},
		{
			type: 'link',
			field: 'quote_number'
		},
		{
			type: 'checkbox',
			field: 'bid_exception'
		},
		{
			type: 'textarea',
			field: 'exception_notes'
		},
		{
			type: 'textarea',
			field: 'bid_notes'
		}
	];
</script>

{#if solicitation_matched}
	<div class="parent">
		<div class="one pl-4 pt-4 overflow-auto">
			<div>
				<button on:click={goBack}>
					<div class="flex flex-row items-center p-2 rounded-md bg-neutral-50">
						<img src={Arrow} alt="1" class="h-5 w-5" />
						<p class="mb-[0.5px]">Go Back</p>
					</div>
				</button>
			</div>
			<div class="pl-2 pt-3 space-y-5">
				<SolicitationInfo {solicitation_matched} />

				{#if form?.type === 'bom' || form?.type === 'labor'}
					<div>
						<p class="mb-1">Engineering Notes</p>
						<Textarea value={solicitation_matched?.engineering_notes} disabled />
					</div>
				{/if}
				{#if form?.type === 'purchasing'}
					<div>
						<p class="mb-1">Max Purchasing Budget for Total Contract</p>
						<Currency
							value={parseFloat(
								(solicitation_matched?.price_per_unit ?? 0) *
									0.34 *
									(solicitation_matched?.solicitation.quantity ?? 0)
							).toFixed(2)}
							disabled
						/>
						<p class="mb-1">Max Purchasing Budget for Each Unit</p>
						<Currency
							value={parseFloat((solicitation_matched?.price_per_unit ?? 0) * 0.34).toFixed(2)}
							disabled
						/>
						<p class="mb-1">Max Purchasing Days</p>
						<Currency
							value={parseInt(solicitation_matched?.solicitation?.days_to_deliver * 0.95)}
							disabled
						/>
					</div>
				{/if}
				{#if form?.type === 'labor'}
					<div>
						<p class="mb-1">Max Labor Hours</p>
						<Currency
							value={parseFloat((solicitation_matched.price_per_unit * 0.1) / 18).toFixed(2)}
							disabled
						/>
					</div>
				{/if}
				{#if form?.type === 'bid'}
					<div>
						<p class="mb-1">Link to DIBBS to place Bid</p>
						<a
							href={`https://www.dibbs.bsm.dla.mil/rfq/rfqrec.aspx?sn=${solicitation_matched?.solicitation?.number}`}
							target="_blank"
							class="mb-5 text-blue-500">Go to DIBBS</a
						>
						<p class="mb-1">Total Bid Value</p>
						<Currency
							value={solicitation_matched?.price_per_unit *
								solicitation_matched?.solicitation?.quantity}
							disabled
						/>
						<p class="mb-1">Per Unit</p>
						<Currency value={solicitation_matched?.price_per_unit} disabled />
						<p class="mb-1">Estimated Days to Deliver</p>
						<Currency value={solicitation_matched?.estimated_purchasing_days} disabled />
					</div>
				{/if}
				{#if form?.type === 'bom'}
					<div>
						<p class="mb-1">BOM Template</p>
						<a
							href="https://docs.google.com/spreadsheets/d/1nxogcDAqI7A4TRM-DkLbMEW6Ina9ws_rqbkE_3lOJUw/edit?usp=sharing"
							target="_blank"
							class="mb-5 text-blue-500">Google Sheets</a
						>
					</div>
				{/if}

				{#if form === null || form?.type === 'opportunity'}
					<div>
						<p class="text-lg mt-5 mb-2 font-semibold">Previous NSN Matches</p>
						{#if nsn_matches?.length > 0}
							<Table data={nsn_matches} />
						{:else}
							<p class="text-gray-400">NSN not seen before</p>
						{/if}

						<p class="text-lg mt-5 mb-2 font-semibold">DLA Forecast (Next 2 Years)</p>
						<DlaForecast data={solicitation_matched?.solicitation?.dla_forecast} />

						<p class="text-lg mt-5 mb-2 font-semibold">Award History</p>
						<AwardHistory data={solicitation_matched.solicitation.award_history} />
					</div>
				{/if}
			</div>
		</div>
		<div class="two bg-neutral-50">
			<div class="flex flex-col p-6">
				{#each form?.matched_fields ?? matched_fields as field}
					{#if field.type === 'status'}
						<p class="mb-1 text-sm">{capitalizeFirstLetter(field.status)} Status</p>
						<StatusSelect status={field.status} bind:value={values.status} />
					{/if}
					{#if field.type === 'currency'}
						<p class="mb-1 text-sm">{govMapper(field.field)}</p>
						<Currency bind:value={values[field.field]} />
					{/if}
					{#if field.type === 'textarea'}
						<p class="mb-1 text-sm">{govMapper(field.field)}</p>
						<Textarea bind:value={values[field.field]} />
					{/if}
					{#if field.type === 'checkbox'}
						<p class="mb-1 text-sm">{govMapper(field.field)}</p>
						<Boolean bind:value={values[field.field]} />
					{/if}
					{#if field.type === 'link' || field.type === 'text'}
						<p class="mb-1 text-sm">{govMapper(field.field)}</p>
						<TextInput bind:value={values[field.field]} />
					{/if}
				{/each}
				{#if (values.status ?? []).includes('opportunity:pursue') && form?.type === 'opportunity'}
					<p class="mb-1">Skip Engineering Feasibility Form</p>

					<Boolean bind:value={values['skip_engineering']} />

					{#if values['skip_engineering']}
						<p class="mb-1">Engineering Status</p>
						<StatusSelect status={'engineering'} bind:value={values.status} />
					{/if}
				{/if}
				<div class="flex flex-row mt-5 items-center justify-center">
					{#if !isSubmitting}
						<button
							class="btn px-6 py-2 rounded-md text-xs bg-white shadow-md"
							on:click={handleSubmit}>Submit</button
						>
					{:else}
						<span class="loading loading-spinner loading-md"></span>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.parent {
		position: relative;
		width: 100%;
		height: 100vh;
		/* color: #fff; */
	}

	.one {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		width: 50%;
		display: flex;
		flex-direction: column;
		/* background: #333; */
	}
	.two {
		position: absolute;
		top: 0;
		left: 50%;
		bottom: 0;
		width: 50%;
		overflow-y: auto;
		/* background: #999; */
		/* height: 120%; */
	}
</style>
