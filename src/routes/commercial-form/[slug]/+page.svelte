<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Form from '$lib/components/app/Commercial/Form/Form.svelte';

	export let data;
	$: ({ supabase, session } = data);

	let form = null;
	let values = {};
	let isSubmitting = false;

	async function loadData() {
		const { data, error: err } = await supabase
			.from('forms')
			.select('*, form!inner(*), product(*)')
			.eq('id', parseInt($page.params.slug))
			.limit(1)
			.single();

		form = data;
		values = {};
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
		{form ? form.form.name : 'Commercial RFQ Form'}
	</title>
</svelte:head>

{#if !form?.submitted}
	{#if form}
		<Form data={form} bind:values form={form?.form} {handleSubmit} bind:isSubmitting />
	{/if}
{:else}
	<p class="mt-12">Thank you for submitting form!</p>
{/if}
