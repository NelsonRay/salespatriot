<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import OEMForm from '$lib/components/app/OEM/OEMForm/OEMForm.svelte';

	export let data;
	$: ({ supabase, session } = data);

	let oem_rfq = null;

	let values = {};

	let isSubmitting = false;

	async function handleSubmit() {
		isSubmitting = true; // show loading spinner
		const res = await fetch('/api/solicitations/update', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ values, id: solicitation_matched.id })
		});

		if (res.status === 200) {
			window.location.href = `${window.location.origin}`;
		} else {
			isSubmitting = false; // hide loading spinner
		}
	}

	async function loadData() {
		let { data, error } = await supabase
			.from('oem_rfqs')
			.select('*, customer!inner(*), oem_rfqs_parts(*)')
			.eq('id', $page.params.slug)
			.limit(1)
			.single();

		oem_rfq = data;

		values = data;
	}

	onMount(() => {
		if (session) {
			loadData();
		}
	});
</script>

{#if values}
	<OEMForm data={oem_rfq} {values} {handleSubmit} {isSubmitting} />
{/if}
