<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Form from '$lib/components/app/Commercial/Form/Form.svelte';

	export let data;
	$: ({ supabase, session } = data);

	let form = null;
	let nsn_matches = null;

	let values = {};

	let isSubmitting = false;

	async function loadData() {
		const { data, error: err } = await supabase
			.from('commercial_forms')
			.select(
				'*, commercial_form!inner(*), commercial_rfq!inner(*, commercial_rfqs_parts(*), customer(*))'
			)
			.eq('id', parseInt($page.params.slug))
			.limit(1)
			.single();

		form = data;
		values = data.commercial_rfq;
	}

	onMount(() => {
		if (session) {
			loadData();
		}
	});

	async function handleSubmit() {
		isSubmitting = true; // show loading spinner
		const res = await fetch('/api/commercial/form-submission', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ values, id: form.id })
		});

		if (res.status === 200) {
			window.location.reload();
		} else {
			isSubmitting = false; // hide loading spinner
		}
	}
</script>

<svelte:head>
	<title>
		{form
			? form.commercial_rfq?.customer?.name +
				' / ' +
				form.commercial_rfq?.date_received +
				' ' +
				form.commercial_form.name
			: 'Commercial RFQ Form'}
	</title>
</svelte:head>

{#if !form?.submitted}
	{#if form}
		<Form
			data={form?.commercial_rfq}
			bind:values
			form={form?.commercial_form}
			{handleSubmit}
			bind:isSubmitting
		/>
	{/if}
{:else}
	<p class="mt-12">Thank you for submitting form!</p>
{/if}
