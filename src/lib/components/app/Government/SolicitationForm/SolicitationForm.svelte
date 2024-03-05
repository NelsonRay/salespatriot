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
	import { govTags } from '$lib/tags';
	import { capitalizeFirstLetter, formatCurrency } from '$lib/helpers';
	import { fieldsForForms } from '$lib/forms';
	import { nsnColumns } from '$lib/table';
	import PartnerSelect from '$lib/components/form/PartnerSelect.svelte';
	import { formsValidation } from '$lib/validation';
	import Forms from '$lib/components/app/Government/Forms/Forms.svelte';

	export let solicitation_matched;
	export let values;
	export let nsn_matches = null;
	export let form = null;
	export let submitCallback;
	export let isSubmitting;
	export let isAdmin = false;

	let errors;

	// if (form?.type === 'enter_quote') {
	// 	values.status = [
	// 		...(values.status.filter((s) => !s.includes('enter_quote')) ?? []),
	// 		'enter_quote:entered'
	// 	];
	// }

	if (form?.type === 'bid') {
		values.status = [...(values.status.filter((s) => !s.includes('bid')) ?? []), 'bid:bid'];
	}

	function goBack() {
		if (form) {
			window.location.href = `${window.location.origin}/workflows`;
		} else {
			window.location.href = `${window.location.origin}`;
		}
	}

	const forms = [
		'opportunity',
		'engineering',
		'bom',
		'purchasing',
		'labor',
		'review',
		'enter_quote',
		'bid',
		'award'
	];

	function handleSubmit() {
		if (form?.type) {
			const results = formsValidation[form.type]?.safeParse(values);
			errors = results?.error?.flatten()?.fieldErrors;
		}

		if (!errors) {
			submitCallback();
		}
	}

	function getEstimatedDays() {
		const estimated_days_to_deliver = solicitation_matched?.estimated_purchasing_days;
		const days_to_deliver = solicitation_matched?.solicitation_matched?.days_to_deliver;

		if (estimated_days_to_deliver < days_to_deliver) {
			return estimated_days_to_deliver;
		} else if (estimated_days_to_deliver > days_to_deliver + 30) {
			return days_to_deliver;
		} else {
			return estimated_days_to_deliver;
		}
	}

	function getFormTitle(type) {
		return `${type
			.split('_')
			.map((e) => capitalizeFirstLetter(e))
			.join(' ')} Form`;
	}

	function getStatusTitle(status) {
		return `${status
			.split('_')
			.map((e) => capitalizeFirstLetter(e))
			.join(' ')} Status`;
	}
</script>

{#if solicitation_matched}
	<div class="parent">
		<div class="one pl-4 pt-4 overflow-auto">
			<div class="flex flex-row justify-between">
				<button on:click={goBack}>
					<div class="flex flex-row items-center p-2 rounded-md bg-neutral-50">
						<img src={Arrow} alt="1" class="h-5 w-5" />
						<p class="mb-[0.5px]">Go Back</p>
					</div>
				</button>

				{#if isAdmin}
					<a
						href={window.location.origin + '/solicitation/' + solicitation_matched.id}
						target="_blank"
						class="mr-4"
					>
						<div class="flex flex-row items-center p-2 rounded-md bg-neutral-50">
							<p class="mb-[0.5px]">View Master</p>
						</div>
					</a>
				{/if}
			</div>
			<div class="pl-2 pt-3 space-y-5">
				<SolicitationInfo {solicitation_matched} {nsn_matches} {values} {form} />

				<div>
					<p class="mb-1 font-medium">Additional Notes</p>

					<Textarea bind:value={values.additional_notes} />
				</div>

				{#if form?.type === 'bom' || (form?.type === 'labor' && solicitation_matched?.engineering_notes)}
					<div>
						<p class="mb-1">Engineering Notes</p>
						<Textarea value={solicitation_matched?.engineering_notes} disabled />
					</div>
				{/if}
				{#if form?.type === 'purchasing'}
					<div class="space-y-3">
						<div>
							<p class="mb-1">Max Purchasing Budget for Total Contract</p>
							<TextInput
								value={formatCurrency(
									(solicitation_matched?.unit_price ?? 0) *
										0.34 *
										(solicitation_matched?.solicitation.quantity ?? 0)
								)}
								disabled
								fullWidth={false}
							/>
						</div>
						<div>
							<p class="mb-1">Max Purchasing Budget for Each Unit</p>
							<TextInput
								value={formatCurrency((solicitation_matched?.unit_price ?? 0) * 0.34)}
								disabled
								fullWidth={false}
							/>
						</div>
						<div>
							<p class="mb-1">Max Purchasing Days</p>
							<Currency
								value={parseInt(solicitation_matched?.solicitation?.days_to_deliver * 0.95)}
								disabled
							/>
						</div>
					</div>
				{/if}
				{#if form?.type === 'labor'}
					<div>
						<p class="mb-1">Max Labor Minutes</p>
						<Currency
							value={parseFloat(((solicitation_matched.unit_price * 0.1) / 20) * 60).toFixed(2)}
							disabled
						/>
					</div>
				{/if}
				{#if form?.type === 'enter_quote'}
					<div class="space-y-3">
						<div>
							<p class="mb-1">Total Value</p>
							<TextInput
								value={formatCurrency(
									solicitation_matched?.unit_price * solicitation_matched?.solicitation?.quantity
								)}
								disabled
								fullWidth={false}
							/>
						</div>
						<div>
							<p class="mb-1">Unit Price</p>
							<TextInput
								value={formatCurrency(solicitation_matched?.unit_price)}
								disabled
								fullWidth={false}
							/>
						</div>
						<div>
							<p class="mb-1">Quantity</p>
							<Currency value={solicitation_matched?.solicitation.quantity} disabled />
						</div>
						<div>
							<p class="mb-1">Estimated Purchasing Days</p>
							<Currency value={solicitation_matched?.estimated_purchasing_days} disabled />
						</div>
						<div>
							<p class="mb-1">NSN</p>
							<Currency value={solicitation_matched?.solicitation.nsn.id} disabled />
						</div>
						<div>
							<p class="mb-1">In-House Part Number</p>
							<TextInput
								value={solicitation_matched?.solicitation.nsn?.matching_nsns?.length > 0
									? solicitation_matched?.solicitation.nsn?.matching_nsns[0]['part_number']
									: ''}
								disabled
								fullWidth={false}
							/>
						</div>
					</div>
				{/if}
				{#if form?.type === 'bid'}
					<div class="space-y-3">
						<div>
							<a
								href={`https://www.dibbs.bsm.dla.mil/rfq/rfqrec.aspx?sn=${solicitation_matched?.solicitation?.number}`}
								target="_blank"
								class="mb-5 text-blue-500">Open DIBBS</a
							>
						</div>
						<div>
							<p class="mb-1">In-House Part Number</p>
							<TextInput
								value={solicitation_matched?.solicitation.nsn?.matching_nsns?.length > 0
									? solicitation_matched?.solicitation.nsn?.matching_nsns[0]['part_number']
									: 'N/A'}
								disabled
								fullWidth={false}
							/>
						</div>
						<div>
							<p class="mb-1">Total Bid Value</p>
							<TextInput
								value={formatCurrency(
									solicitation_matched?.unit_price * solicitation_matched?.solicitation?.quantity
								)}
								disabled
								fullWidth={false}
							/>
						</div>
						<div>
							<p class="mb-1">Unit Price</p>
							<TextInput
								value={formatCurrency(solicitation_matched?.unit_price)}
								disabled
								fullWidth={false}
							/>
						</div>
						<div>
							<p class="mb-1">Quantity</p>
							<Currency value={solicitation_matched?.solicitation.quantity} disabled />
						</div>
						<div>
							<p class="mb-1">Estimated Days to Deliver</p>
							<Currency value={getEstimatedDays()} disabled />
						</div>
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

				{#if form === null || form?.type === 'opportunity' || form?.type === 'review'}
					<div>
						<p class="text-lg mt-5 mb-2 font-semibold">Forms</p>
						<Forms data={solicitation_matched?.forms ?? []} />

						<p class="text-lg mt-5 mb-2 font-semibold">Previous NSN Matches</p>
						{#if nsn_matches?.length > 0}
							<Table data={nsn_matches} columns={nsnColumns} />
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
				{#each forms as f}
					{#if form === null || form.type === 'review' || form.type === f}
						<div class="mb-3">
							<p class="text-gray-400 mb-2 font-medium">{getFormTitle(f)}</p>
							{#each fieldsForForms[f] as field}
								<div class="mb-3">
									{#if field.type === 'status'}
										<p class="mb-1 text-sm">{getStatusTitle(field.status)}</p>
										<StatusSelect
											status={field.status}
											bind:value={values.status}
											tags={govTags}
											skipInProgress={form !== null}
										/>
										{#if errors?.status}
											<label for="trim" class="label">
												<span class="label-text-alt text-error">{errors?.status[0]}</span>
											</label>
										{/if}
									{/if}
									{#if field.type === 'currency'}
										<p class="mb-1 text-sm">{govMapper(field.field)}</p>
										<Currency bind:value={values[field.field]} />
										{#if errors?.[field.field]}
											<label for="trim" class="label">
												<span class="label-text-alt text-error">{errors?.[field.field][0]}</span>
											</label>
										{/if}
									{/if}
									{#if field.type === 'textarea'}
										<p class="mb-1 text-sm">{govMapper(field.field)}</p>
										<Textarea bind:value={values[field.field]} />
										{#if errors?.[field.field]}
											<label for="trim" class="label">
												<span class="label-text-alt text-error">{errors?.[field.field][0]}</span>
											</label>
										{/if}
									{/if}
									{#if field.type === 'checkbox'}
										<p class="mb-1 text-sm">{govMapper(field.field)}</p>
										<Boolean bind:value={values[field.field]} />
										{#if errors?.[field.field]}
											<label for="trim" class="label">
												<span class="label-text-alt text-error">{errors?.[field.field][0]}</span>
											</label>
										{/if}
									{/if}
									{#if field.type === 'link' || field.type === 'text'}
										<p class="mb-1 text-sm">{govMapper(field.field)}</p>
										<TextInput bind:value={values[field.field]} />
										{#if errors?.[field.field]}
											<label for="trim" class="label">
												<span class="label-text-alt text-error">{errors?.[field.field][0]}</span>
											</label>
										{/if}
									{/if}
									{#if field.type === 'bid_partners'}
										<p class="mb-1 text-sm">{govMapper(field.field)}</p>
										<PartnerSelect bind:value={values[field.field]} />
										{#if errors?.[field.field]}
											<label for="trim" class="label">
												<span class="label-text-alt text-error">{errors?.[field.field][0]}</span>
											</label>
										{/if}
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				{/each}
				{#if (values.status ?? []).includes('opportunity:pursue') && form?.type === 'opportunity'}
					<p class="mb-1">Skip Engineering Feasibility Form</p>

					<Boolean bind:value={values['skip_engineering']} />
					{#if errors?.skip_engineering}
						<label for="trim" class="label">
							<span class="label-text-alt text-error">{errors?.skip_engineering[0]}</span>
						</label>
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
