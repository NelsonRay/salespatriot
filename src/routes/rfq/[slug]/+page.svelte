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

	function fixRFQData(rfq) {
		let fix = rfq;

		for (let index = 0; index < rfq?.rfqs_products?.length ?? 0; index++) {
			for (let i = 0; i < rfq?.rfqs_products?.[index].rfqs_products_quantities?.length ?? 0; i++) {
				if (!rfq?.rfqs_products?.[index].rfqs_products_quantities[i].product_final_pricing) {
					fix.rfqs_products[index].rfqs_products_quantities[i].product_final_pricing = {};
				}
			}
		}

		return fix;
	}

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
			.from('rfqs')
			.select(
				'*, rfqs_comments(*), customer(*), rfqs_products(*, product(*, product_purchasing(*)), product_labor_minutes(*), rfqs_products_quantities(*, product_final_pricing(*)))'
			)
			.eq('id', $page.params.slug)
			.limit(1)
			.single();

		rfq = data;

		values = fixRFQData(data);
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
	<Form data={rfq} {values} {handleSubmit} {isSubmitting} />
{/if}
