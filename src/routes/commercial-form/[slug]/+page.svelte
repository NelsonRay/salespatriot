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

	function fixRFQData(form) {
		let fix = form;

		for (let index = 0; index < form?.rfq?.rfqs_products?.length ?? 0; index++) {
			for (
				let i = 0;
				i < form?.rfq?.rfqs_products?.[index].rfqs_products_quantities?.length ?? 0;
				i++
			) {
				if (!form?.rfq?.rfqs_products?.[index].rfqs_products_quantities[i].product_final_pricing) {
					fix.rfq.rfqs_products[index].rfqs_products_quantities[i].product_final_pricing = {};
				}
			}
		}

		return fix;
	}

	async function loadData() {
		const { data, error: err } = await supabase
			.from('forms')
			.select(
				'*, form!inner(*), product(*), rfq(*, customer(*), rfqs_products(*, product(*, product_purchasing(*)), product_labor_minutes(*), rfqs_products_quantities(*, product_final_pricing(*))))'
			)
			.eq('id', parseInt($page.params.slug))
			.limit(1)
			.single();

		form = fixRFQData(data);
		if (form?.form?.type === 'final_pricing') {
			values = form.rfq;
		} else {
			values = {};
		}
	}

	onMount(() => {
		if (session) {
			loadData();
		}
	});

	async function waitingCallback() {
		await supabase.from('forms').update({ waiting: true }).eq('id', form.id);
		window.location.href = `${window.location.origin}/workflows`;
	}

	async function submitCallback() {
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
		<Form
			data={form}
			bind:values
			form={form?.form}
			{submitCallback}
			bind:isSubmitting
			{waitingCallback}
		/>
	{/if}
{:else}
	<p class="mt-12">Thank you for submitting form!</p>
{/if}
