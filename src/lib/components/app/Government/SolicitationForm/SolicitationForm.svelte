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
	import { formsValidation, masterFormValidation } from '$lib/validation';
	import Forms from '$lib/components/app/Government/Forms/Forms.svelte';
	import Comments from '$lib/components/form/Comments.svelte';

	export let solicitation_matched;
	export let values;
	export let nsn_matches = null;
	export let form = null;
	export let submitCallback;
	export let isSubmitting;
	export let isAdmin = false;
	export let commentSubmitCallback;
	export let awardModalOpen = false;
	export let removeModalOpen = false;

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
		'first_article',
		'final_pricing',
		'enter_quote',
		'bid'
	];

	const statuses = [
		'opportunity',
		'engineering',
		'bom',
		'purchasing',
		'labor',
		'final_pricing',
		'enter_quote',
		'bid'
	];

	function handleSubmit() {
		let validationObj;

		switch (form?.type) {
			case 'bid':
				validationObj = formsValidation[form.type](
					solicitation_matched?.solicitation?.first_article
				);
				break;
			case 'final_pricing':
			case null:
			case undefined:
				validationObj = masterFormValidation(solicitation_matched?.solicitation?.first_article);
				break;
			default:
				validationObj = formsValidation[form.type]();
				break;
		}

		const results = validationObj?.safeParse(values);
		errors = results?.error?.flatten()?.fieldErrors;

		if (!errors) {
			submitCallback();
		}
	}

	function getEstimatedDays() {
		const estimated_days_to_deliver = solicitation_matched?.estimated_purchasing_days;
		const days_to_deliver = solicitation_matched?.solicitation?.days_to_deliver;

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

	function getStatusTitle(status, excludeStatus) {
		let title = `${status
			.split('_')
			.map((e) => capitalizeFirstLetter(e))
			.join(' ')}`;
		if (status === 'bom') title = 'BOM';
		if (!excludeStatus) title += '  Status';

		return title;
	}

	function showInput(field, obj, matched) {
		if (field.field === 'special_equipment_notes') {
			return obj?.requires_special_equipment;
		} else if (field.field === 'exception_notes') {
			return obj?.bid_exception;
		} else if (field.field === 'first_article_waive_requested') {
			return matched?.solicitation?.first_article;
		}
		return true;
	}

	function showForm(form, type) {
		switch (type) {
			case 'first_article':
				return form === null && solicitation_matched.solicitation.first_article;
			default:
				return form === null || form.type === 'final_pricing' || form.type === type;
		}
	}
</script>

{#if solicitation_matched}
	<div class="parent">
		<div class="one pl-4 pt-4 overflow-auto">
			<div class="flex flex-row justify-between items-center">
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
				<SolicitationInfo
					{solicitation_matched}
					{nsn_matches}
					{values}
					{form}
					bind:awardModalOpen
					bind:removeModalOpen
				/>

				<div>
					<p class="text-lg mt-5 mb-2 font-semibold">Comments</p>
					<Comments
						comments={solicitation_matched.solicitations_matched_comments}
						{commentSubmitCallback}
					/>
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
								href={`https://www.dibbs.bsm.dla.mil/rfq/rfqrec.aspx?sn=${solicitation_matched?.solicitation?.id}`}
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
						<div>
							<p class="mb-1">First Article</p>
							<TextInput
								value={solicitation_matched.solicitation.first_article ? 'Yes' : 'No'}
								disabled
								fullWidth={false}
							/>
						</div>
						{#if solicitation_matched.solicitation.first_article}
							<div>
								<p class="mb-1">First Article Price</p>
								<TextInput
									value={formatCurrency(solicitation_matched.first_article_price)}
									disabled
									fullWidth={false}
								/>
							</div>
							<div>
								<p class="mb-1">First Article Lead Time</p>
								<Currency value={solicitation_matched.first_article_lead_time} disabled />
							</div>
						{/if}
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

				{#if form === null || form?.type === 'opportunity' || form?.type === 'final_pricing'}
					<div>
						<p class="text-lg mt-5 mb-2 font-semibold">Forms</p>
						<Forms data={solicitation_matched?.forms ?? []} />

						<p class="text-lg mt-5 mb-2 font-semibold">Previous NSN Matches</p>
						{#if nsn_matches?.length > 0}
							<Table data={nsn_matches} columns={nsnColumns} openNewTab={true} />
						{:else}
							<p class="text-gray-400">NSN not seen before</p>
						{/if}

						<p class="text-lg mt-5 mb-2 font-semibold">DLA Forecast (Next 2 Years)</p>
						<DlaForecast data={solicitation_matched?.solicitation?.dla_forecast} />

						<p class="text-lg mt-5 mb-2 font-semibold">Award History</p>
						<AwardHistory data={solicitation_matched.solicitation.award_history} />
					</div>
				{:else if form?.type === 'bid'}
					<div>
						<p class="text-lg mt-5 mb-2 font-semibold">Previous NSN Matches</p>
						{#if nsn_matches?.length > 0}
							<Table data={nsn_matches} columns={nsnColumns} openNewTab={true} blockEditing />
						{:else}
							<p class="text-gray-400">NSN not seen before</p>
						{/if}

						<p class="text-lg mt-5 mb-2 font-semibold">Award History</p>
						<AwardHistory data={solicitation_matched.solicitation.award_history} />
					</div>
				{/if}
			</div>
		</div>
		<div class="two bg-neutral-50">
			<div class="flex flex-col pl-6 py-6">
				{#if form === null || form.type === 'final_pricing'}
					<div class="flex flex-row overflow-x-auto mb-2">
						{#each statuses as status}
							<div class="flex flex-col items-center">
								<p class="text-sm text-neutral-400">{getStatusTitle(status, true)}</p>
								<StatusSelect
									{status}
									bind:value={values.status}
									tags={govTags}
									dropdown
									skipInProgress={false}
								/>
							</div>
						{/each}
					</div>
				{/if}
				{#each forms as type}
					{#if showForm(form, type)}
						<div>
							{#if !(form === null || form.type === 'final_pricing')}
								<p class="text-gray-400 mb-2 font-medium">{getFormTitle(type)}</p>
							{/if}
							{#each fieldsForForms[type] as field}
								<div>
									{#if field.type === 'status' && !(form === null || form.type === 'final_pricing')}
										<div class="mb-2">
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
										</div>
									{/if}
									{#if field.type === 'currency'}
										<div class="mb-2">
											<p class="mb-1 text-sm">{govMapper(field.field)}</p>
											<Currency bind:value={values[field.field]} />
											{#if errors?.[field.field]}
												<label for="trim" class="label">
													<span class="label-text-alt text-error">{errors?.[field.field][0]}</span>
												</label>
											{/if}
										</div>
									{/if}
									{#if field.type === 'textarea'}
										{#if showInput(field, values, solicitation_matched)}
											<div class="mb-2">
												<p class="mb-1 text-sm">{govMapper(field.field)}</p>
												<Textarea bind:value={values[field.field]} />
												{#if errors?.[field.field]}
													<label for="trim" class="label">
														<span class="label-text-alt text-error">{errors?.[field.field][0]}</span
														>
													</label>
												{/if}
											</div>
										{/if}
									{/if}
									{#if field.type === 'checkbox'}
										{#if showInput(field, values, solicitation_matched)}
											<div class="mb-2">
												<p class="mb-1 text-sm">{govMapper(field.field)}</p>
												<Boolean bind:value={values[field.field]} />
												{#if errors?.[field.field]}
													<label for="trim" class="label">
														<span class="label-text-alt text-error">{errors?.[field.field][0]}</span
														>
													</label>
												{/if}
											</div>
										{/if}
									{/if}
									{#if field.type === 'link' || field.type === 'text'}
										<div class="mb-2">
											<p class="mb-1 text-sm">{govMapper(field.field)}</p>
											<TextInput bind:value={values[field.field]} fullWidth={false} />
											{#if errors?.[field.field]}
												<label for="trim" class="label">
													<span class="label-text-alt text-error">{errors?.[field.field][0]}</span>
												</label>
											{/if}
										</div>
									{/if}
									{#if field.type === 'bid_partners'}
										<div class="mb-2">
											<p class="mb-1 text-sm">{govMapper(field.field)}</p>
											<PartnerSelect bind:value={values[field.field]} />
											{#if errors?.[field.field]}
												<label for="trim" class="label">
													<span class="label-text-alt text-error">{errors?.[field.field][0]}</span>
												</label>
											{/if}
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				{/each}
				{#if (values.status ?? []).includes('opportunity:pursue') && form?.type === 'opportunity'}
					<div class="space-y-2">
						<div>
							<p class="mb-1 text-sm">Skip Engineering Feasibility Form</p>
							<Boolean bind:value={values['skip_engineering']} />
							{#if errors?.skip_engineering}
								<label for="trim" class="label">
									<span class="label-text-alt text-error">{errors?.skip_engineering[0]}</span>
								</label>
							{/if}
						</div>

						{#if values?.skip_engineering}
							<div>
								<p class="mb-1 text-sm">BOM Status</p>
								<StatusSelect
									status="bom"
									bind:value={values.status}
									tags={govTags}
									skipInProgress={false}
								/>
								{#if errors?.bom_status}
									<label for="trim" class="label">
										<span class="label-text-alt text-error">{errors?.bom_status[0]}</span>
									</label>
								{/if}
							</div>
						{/if}
					</div>
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
		width: 60%;
		display: flex;
		flex-direction: column;
		/* background: #333; */
	}
	.two {
		position: absolute;
		top: 0;
		left: 60%;
		bottom: 0;
		width: 40%;
		overflow-y: auto;
		/* background: #999; */
		/* height: 120%; */
	}
</style>
