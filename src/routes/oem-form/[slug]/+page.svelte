<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import OEMForm from '$lib/components/app/OEM/OEMForm/OEMForm.svelte';

	export let data;
	$: ({ supabase, session } = data);

	let form = null;
	let nsn_matches = null;

	let values = {};

	let isSubmitting = false;

	async function loadData() {
		const { data, error: err } = await supabase
			.from('oem_forms')
			.select('*, oem_form!inner(*), oem_rfq!inner(*, oem_rfqs_parts(*), customer(*))')
			.eq('id', parseInt($page.params.slug))
			.limit(1)
			.single();

		form = data;
		values = data.oem_rfq;
	}

	onMount(() => {
		if (session) {
			loadData();
		}
	});

	async function handleSubmit() {
		isSubmitting = true; // show loading spinner
		const res = await fetch('/api/oem/form-submission', {
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

{#if !form?.submitted}
	{#if form}
		<OEMForm data={form} bind:values form={form?.oem_form} {handleSubmit} bind:isSubmitting />
	{/if}
{:else}
	<p class="mt-12">Thank you for submitting form!</p>
{/if}
