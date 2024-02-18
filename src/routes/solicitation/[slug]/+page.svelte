<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import StatusSelect from '$lib/components/form/StatusSelect.svelte';
	import Currency from '$lib/components/form/Currency.svelte';
	import Textarea from '$lib/components/form/Textarea.svelte';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import Boolean from '$lib/components/form/Boolean.svelte';
	import { gov_mapper, tableFieldMapper } from '$lib/mappers';
	import { onMount } from 'svelte';
	import { formatCurrency } from '$lib/helpers.js';
	import Table from '$lib/components/app/Table/Table.svelte';
	import Arrow from '$lib/icons/Arrow.svg';
	import DlaForecast from '$lib/components/app/DLAForecast/DLAForecast.svelte';
	import AwardHistory from '$lib/components/app/AwardHistory/AwardHistory.svelte';

	export let data;
	$: ({ supabase, session } = data);

	let solicitation_matched = null;
	let nsn_matches = null;

	let values = {};

	async function loadData() {
		let { data, error } = await supabase
			.from('solicitations_matched')
			.select('*, solicitation!inner(*, nsn(id, matching_nsns(*)), expires_on), matching_rule(*)')
			.eq('id', $page.params.slug)
			.limit(1)
			.single();

		let { data: n_data, error: n_error } = await supabase
			.from('solicitations_matched')
			.select('*, solicitation!inner(*, nsn(id, matching_nsns(*)), expires_on), matching_rule(*)')
			.eq('solicitation.nsn', data.solicitation.nsn.id)
			.not('solicitation.number', 'eq', data.solicitation.number);

		nsn_matches = n_data;
		solicitation_matched = data;

		const { solicitation, matching_rule, ...rest } = data;
		values = rest;
	}

	onMount(() => {
		if (session) {
			loadData();
		}
	});

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
					<div class="flex flex-row items-center p-2 rounded-md bg-neutral-100">
						<img src={Arrow} alt="1" class="h-5 w-5" />
						<p class="mb-[0.5px]">Go Back</p>
					</div>
				</button>
			</div>
			<div class="pl-2 pt-3 space-y-2">
				<div class="mb-3">
					<p class="text-lg font-semibold">{solicitation_matched.solicitation.number}</p>
					<p class="text-sm">{solicitation_matched.solicitation.description}</p>
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
							}).value}
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

					<div class="flex flex-row space-x-1">
						<p class="text-gray-400">Set Aside:</p>
						<p>
							{solicitation_matched.solicitation.set_aside ?? 'None'}
						</p>
					</div>
				</div>

				<div>
					<div class="flex flex-row space-x-1">
						<p class="text-gray-400">Tech Docs:</p>
						{#if solicitation_matched.solicitation.tech_docs}
							<a href={solicitation_matched.solicitation.tech_docs} class="text-blue-500"> URL </a>
						{:else}
							<p>None</p>
						{/if}
					</div>
					<div class="flex flex-row space-x-1">
						<p class="text-gray-400">Solicitation URL:</p>
						{#if solicitation_matched.solicitation.solicitation_url}
							<a href={solicitation_matched.solicitation.solicitation_url} class="text-blue-500">
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

				<p class="text-lg mt-5 mb-2 font-semibold">Previous NSN Matches</p>
				{#if solicitation_matched?.length > 0}
					<Table data={nsn_matches} />
				{:else}
					<p class="text-gray-400">NSN not seen before</p>
				{/if}

				<p class="text-lg mt-5 mb-2 font-semibold">DLA Forecast (Next 2 Years)</p>
				<DlaForecast data={solicitation_matched.solicitation.dla_forecast} />

				<p class="text-lg mt-5 mb-2 font-semibold">Award History</p>
				<AwardHistory data={solicitation_matched.solicitation.award_history} />
			</div>
		</div>
		<div class="two bg-neutral-100">
			<div class="flex flex-col p-6">
				{#each matched_fields as field}
					{#if field.type === 'status'}
						<p class="mb-1 text-sm">{capitalizeFirstLetter(field.status)} Status</p>
						<StatusSelect status={field.status} bind:value={values.status} />
					{/if}
					{#if field.type === 'currency'}
						<p class="mb-1 text-sm">{gov_mapper(field.field)}</p>
						<Currency bind:value={values[field.field]} />
					{/if}
					{#if field.type === 'textarea'}
						<p class="mb-1 text-sm">{gov_mapper(field.field)}</p>
						<Textarea bind:value={values[field.field]} />
					{/if}
					{#if field.type === 'checkbox'}
						<p class="mb-1 text-sm">{gov_mapper(field.field)}</p>
						<Boolean bind:value={values[field.field]} />
					{/if}
					{#if field.type === 'link' || field.type === 'text'}
						<p class="mb-1 text-sm">{gov_mapper(field.field)}</p>
						<TextInput bind:value={values[field.field]} />
					{/if}
				{/each}
				<div class="flex flex-row mt-2">
					<button class="btn px-2 rounded-md -ml-2 mt-3 text-xs" on:click={() => {}}>Submit</button>
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
