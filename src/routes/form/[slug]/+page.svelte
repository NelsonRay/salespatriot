<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import Dropdown from '$lib/components/form/Dropdown.svelte';
	import Currency from '$lib/components/form/Currency.svelte';
	import Textarea from '$lib/components/form/Textarea.svelte';
	import TextInput from '$lib/components/form/TextInput.svelte';
	import Checkbox from '$lib/components/form/Checkbox.svelte';
	import { gov_mapper } from '$lib/mappers';

	const submitted = $page.data.submitted;

	let values = {};

	async function handleSubmit() {
		const res = await fetch('/api/gov/form/submit', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ response: values, id: $page.data.id })
		});

		console.log(res.status);

		if (res.status === 200) {
			window.location.reload();
		}
	}
</script>

<div class="flex w-screen h-screen justify-center overflow-y-scroll">
	<div class="flex flex-col p-6">
		{#if !submitted}
			<h1 class="text-3xl mb-8 mt-8">{$page.data.form.name}</h1>
			<p class="text-lg text-center font-semibold mb-3">Solicitation Info</p>
			<div class="grid grid-cols-4 gap-5 px-2 mb-10">
				{#each $page.data.form.solicitation_fields as field}
					<div>
						<p class="text-xs">{gov_mapper(field)}</p>
						{#if !['solicitation_url', 'tech_docs'].includes(field)}
							<p class="text-sm">
								{$page.data.solicitation_matched.solicitation[field] ?? 'N/A'}
							</p>
						{:else}
							<a
								href={$page.data.solicitation_matched.solicitation[field]}
								class="text-sm text-blue-500"
								target="_blank"
							>
								{$page.data.solicitation_matched.solicitation[field] ? 'URL' : 'N/A'}
							</a>
						{/if}
					</div>
				{/each}
			</div>

			{#if $page.data.form.type === 'bom' || $page.data.form.type === 'labor'}
				<p class="mb-1">Engineering Notes</p>
				<Textarea value={$page.data.solicitation_matched.engineering_notes} disabled />
			{/if}
			{#if $page.data.form.type === 'purchasing'}
				<p class="mb-1">Max Purchasing Budget for Total Contract</p>
				<Currency
					value={parseFloat(
						($page.data.solicitation_matched?.price_per_unit ?? 0) *
							0.34 *
							($page.data.solicitation_matched?.solicitation.quantity ?? 0)
					).toFixed(2)}
					disabled
				/>
				<p class="mb-1">Max Purchasing Budget for Each Unit</p>
				<Currency
					value={parseFloat(($page.data.solicitation_matched?.price_per_unit ?? 0) * 0.34).toFixed(
						2
					)}
					disabled
				/>
				<p class="mb-1">Max Purchasing Days</p>
				<Currency
					value={parseInt($page.data.solicitation_matched.solicitation.days_to_deliver * 0.95)}
					disabled
				/>
			{/if}
			{#if $page.data.form.type === 'labor'}
				<p class="mb-1">Max Labor Hours</p>
				<Currency
					value={parseFloat(($page.data.solicitation_matched.price_per_unit * 0.1) / 18).toFixed(2)}
					disabled
				/>
			{/if}
			{#if $page.data.form.type === 'bid'}
				<p class="mb-1">Link to DIBBS to place Bid</p>
				<a
					href={`https://www.dibbs.bsm.dla.mil/rfq/rfqrec.aspx?sn=${$page.data.solicitation_matched.solicitation.number}`}
					target="_blank"
					class="mb-5 text-blue-500">Go to DIBBS</a
				>
				<p class="mb-1">Total Bid Value</p>
				<Currency
					value={$page.data.solicitation_matched.price_per_unit *
						$page.data.solicitation_matched.solicitation.quantity}
					disabled
				/>
				<p class="mb-1">Per Unit</p>
				<Currency value={$page.data.solicitation_matched.price_per_unit} disabled />
				<p class="mb-1">Estimated Days to Deliver</p>
				<Currency value={$page.data.solicitation_matched.estimated_purchasing_days} disabled />
			{/if}

			{#each $page.data.form.matched_fields as field}
				{#if field.type === 'select'}
					<p class="mb-1">{gov_mapper(field.field)}</p>
					<Dropdown
						tags={$page.data.tags}
						tag_type={field.field}
						bind:value={values[field.field]}
					/>
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
					<Checkbox bind:value={values[field.field]} />
				{/if}
				{#if field.type === 'link'}
					{#if $page.data.form.type === 'bom'}
						<p class="mb-1">BOM Template</p>
						<a
							href="https://docs.google.com/spreadsheets/d/1nxogcDAqI7A4TRM-DkLbMEW6Ina9ws_rqbkE_3lOJUw/edit?usp=sharing"
							target="_blank"
							class="mb-5 text-blue-500">Google Sheets</a
						>
					{/if}
					<p class="mb-1">{gov_mapper(field.field)}</p>
					<TextInput bind:value={values[field.field]} />
				{/if}
			{/each}

			{#if $page.data.form.type === 'opportunity'}
				<p class="mb-1">Skip Engineering Feasibility Form</p>

				<Checkbox bind:value={values['skip_engineering']} />

				{#if values['skip_engineering']}
					<p class="mb-1">Engineering Status</p>
					<Dropdown
						tags={$page.data.tags}
						tag_type={'engineering_status'}
						bind:value={values.engineering}
					/>
				{/if}
			{/if}

			<div class="flex flex-row mt-2 text-lg font-medium">
				<button class="btn px-2 rounded-md -ml-2 mt-3" on:click={handleSubmit}>Submit</button>
			</div>
		{:else}
			<p class="mt-12">Thank you for submitting form!</p>
		{/if}
	</div>
</div>
