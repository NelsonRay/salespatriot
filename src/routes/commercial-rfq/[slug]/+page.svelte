<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Form from '$lib/components/app/Commercial/Form/Form.svelte';

	export let data;
	$: ({ supabase, session } = data);

	let commercial_rfq = null;

	let values;

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
			.from('commercial_rfqs')
			.select('*, customer!inner(*), commercial_rfqs_parts(*)')
			.eq('id', $page.params.slug)
			.limit(1)
			.single();

		commercial_rfq = data;

		values = data;
	}

	onMount(() => {
		if (session) {
			loadData();
		}
	});
</script>

<svelte:head>
	<title>
		{commercial_rfq
			? commercial_rfq?.customer?.name +
				' / ' +
				commercial_rfq?.date_received +
				' Commercial RFQ Form'
			: 'Commercial RFQ Form'}
	</title>
</svelte:head>

{#if values}
	<Form data={commercial_rfq} {values} {handleSubmit} {isSubmitting} />
{/if}
