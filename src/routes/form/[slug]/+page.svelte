<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import Dropdown from '$lib/components/form/Dropdown.svelte';
	import Currency from '$lib/components/form/Currency.svelte';
	import Textarea from '$lib/components/form/Textarea.svelte';
	import { gov_mapper } from '$lib/mappers';

	const submitted = $page.data.form.submitted;

	let values = {};

	async function handleSubmit() {
		const res = await fetch('/api/gov/form/submit', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ response: values, id: $page.data.id })
		});

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

			{#each $page.data.form.matched_fields as field}
				<p class="mb-1">{gov_mapper(field.field)}</p>
				{#if field.type === 'select'}
					<Dropdown
						tags={$page.data.tags}
						tag_type={field.field}
						bind:value={values[field.field]}
					/>
				{/if}
				{#if field.type === 'currency'}
					<Currency bind:value={values[field.field]} />
				{/if}
				{#if field.type === 'textarea'}
					<Textarea bind:value={values[field.field]} />
				{/if}
			{/each}

			{#if $page.data.form.type === 'opportunity'}
				<p class="mb-1">Skip Engineering Feasibility Form</p>
				<div class="flex items-start">
					<input class="mb-5" type="checkbox" bind:checked={values['skip_engineering']} />
				</div>

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
