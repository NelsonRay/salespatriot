<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import StatusSelect from '$lib/components/form/StatusSelect.svelte';
	import Currency from '$lib/components/form/Currency.svelte';
	import Textarea from '$lib/components/form/Textarea.svelte';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import Boolean from '$lib/components/form/Boolean.svelte';
	import { tableFieldMapper, gov_mapper } from '$lib/mappers';
	import { onMount } from 'svelte';

	export let data;
	$: ({ supabase, session } = data);

	let solicitation_matched = null;

	let values = {};

	async function loadData() {
		let { data, error } = await supabase
			.from('solicitations_matched')
			.select('*, solicitation!inner(*, nsn(id, matching_nsns(*)), expires_on), matching_rule(*)')
			.eq('id', $page.params.slug)
			.limit(1)
			.single();

		solicitation_matched = data;
		const { solicitation, matching_rule, ...rest } = data;
		values = rest;
		console.log(values);
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

	const columns = [
		{ type: 'field', field: 'solicitation.number' },
		{ type: 'field', field: 'solicitation.description' },
		{ type: 'field', field: 'solicitation.expires_on' },
		{ type: 'formula', field: 'market_value' },
		{ type: 'field', field: 'solicitation.estimated_value' },
		{ type: 'field', field: 'solicitation.nsn.id', header: 'NSN' },
		{ type: 'matching_rule', status: 'matching_rule' },
		{ type: 'field', field: 'solicitation.set_aside' },
		{ type: 'field', field: 'solicitation.issued_on' },
		{ type: 'field', field: 'solicitation.quantity' },
		{ type: 'field', field: 'solicitation.quantity_units' },
		{ type: 'field', field: 'solicitation.first_article' },
		{
			type: 'field',
			field: 'solicitation.nsn.matching_nsns',
			array_selector: 'part_number',
			header: 'In-House PN'
		},
		{ type: 'field', field: 'solicitation.days_to_deliver' },
		{ type: 'field', field: 'bom_url' },
		{ type: 'field', field: 'price_per_unit' },
		{ type: 'link', field: 'solicitation.solicitation_url' },
		{ type: 'link', field: 'solicitation.tech_docs' }
	];

	const matched_fields = [
		{
			type: 'currency',
			field: 'price_per_unit'
		},
		{
			type: 'status',
			status: 'opportunity'
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
	<div class="flex w-screen h-screen justify-center overflow-y-scroll">
		<div class="flex flex-col p-6">
			<p class="text-lg text-center font-semibold mb-3">Solicitation Info</p>
			<div class="grid grid-cols-4 gap-5 px-2 mb-10">
				{#each columns as column}
					<div>
						<p class="text-xs">{tableFieldMapper(undefined, column).header}</p>

						{#if column.type === 'matching_rule'}
							<p class="text-sm">{tableFieldMapper(solicitation_matched, column).value ?? ''}</p>
						{:else if column.type === 'link'}
							<a
								href={tableFieldMapper(solicitation_matched, column).value ?? ''}
								target="_blank"
								class="mb-5 text-blue-500">URL</a
							>
						{:else}
							<p class="text-sm">{tableFieldMapper(solicitation_matched, column).value ?? ''}</p>
						{/if}
					</div>
				{/each}
			</div>
			{#each matched_fields as field}
				{#if field.type === 'status'}
					<p class="mb-1">{capitalizeFirstLetter(field.status)} Status</p>
					<StatusSelect status={field.status} bind:value={values.status} />
				{/if}
				{#if field.type === 'currency'}
					<p class="mb-1">{gov_mapper(field.field)}</p>
					<Currency bind:value={values[field.field]} />
				{/if}
				{#if field.type === 'textarea'}
					<p class="mb-1">{gov_mapper(field.field)}</p>
					<Textarea bind:value={values[field.field]} />
				{/if}
				{#if field.type === 'checkbox'}
					<p class="mb-1">{gov_mapper(field.field)}</p>
					<Boolean bind:value={values[field.field]} />
				{/if}
				{#if field.type === 'link' || field.type === 'text'}
					<p class="mb-1">{gov_mapper(field.field)}</p>
					<TextInput bind:value={values[field.field]} />
				{/if}
			{/each}
			<div class="flex flex-row mt-2 text-lg font-medium">
				<button class="btn px-2 rounded-md -ml-2 mt-3" on:click={() => {}}>Submit</button>
			</div>
		</div>
	</div>
{/if}
