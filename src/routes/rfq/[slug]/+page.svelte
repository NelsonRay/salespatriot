<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Form from '$lib/components/app/Commercial/Form/Form.svelte';

	export let data;
	$: ({ supabase, session } = data);

	let rfq = null;

	let values;

	let isSubmitting = false;

	async function submitCallback() {
		isSubmitting = true; // show loading spinner
		const res = await fetch('/api/rfq/update', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ values })
		});

		if (res.status === 200) {
			window.location.href = `${window.location.origin}`;
		} else {
			isSubmitting = false; // hide loading spinner
		}
	}

	async function loadData() {
		let { data, error } = await supabase
			.from('rfqs')
			.select(
				'*, rfqs_comments(*), customer(*), rfqs_products(*, product(*, product_purchasing(*)), product_labor_minutes(*), rfqs_products_quantities(*))'
			)
			.eq('id', $page.params.slug)
			.limit(1)
			.single();

		rfq = data;

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
		{rfq
			? rfq?.customer?.name + ' / ' + rfq?.received_at + ' Commercial RFQ Form'
			: 'Commercial RFQ Form'}
	</title>
</svelte:head>

{#if values}
	<Form data={rfq} {values} {submitCallback} {isSubmitting} />
{/if}
