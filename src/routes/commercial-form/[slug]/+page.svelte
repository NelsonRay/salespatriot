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
	let rfqsForPurchasingForm;

	async function loadData() {
		const { data, error: err } = await supabase
			.from('forms')
			.select(
				'*, form!inner(*), product(*), rfq_public(*), rfq(*, rfqs_comments(*), customer(*), rfqs_products(*, product(*, product_purchasing(*)), product_labor_minutes(*), rfqs_products_quantities(*)))'
			)
			.eq('id', parseInt($page.params.slug))
			.limit(1)
			.single();

		if (data?.form?.type === 'purchasing') {
			const { data: d, error: e } = await supabase
				.from('rfqs_products')
				.select(
					'id, rfq!inner(id, status, customer(*), received_at, rfqs_products(id, rfqs_products_quantities(*)))'
				)
				.eq('product', data.product.id);

			rfqsForPurchasingForm = d;
		}

		form = data;

		if (['final_pricing', 'enter_quote', 'bid'].includes(form?.form?.type)) {
			values = form.rfq;
		} else if (form?.form?.type === 'confirm') {
			values = {
				customer: {
					email_address: data.rfq_public?.values?.customer?.email_address,
					phone_number: data.rfq_public?.values?.customer?.phone_number
				},
				received_at: data.rfq_public.values.received_at,
				requested_return_date: data.rfq_public.values.requested_return_date,
				rfqs_products: [
					{
						product: {},
						rfqs_products_quantities: [{ quantity: null }]
					}
				],
				notes: data.rfq_public?.values?.notes
			};
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
		history.back();
	}

	async function commentSubmitCallback(message) {
		if (message) {
			const { data, error } = await supabase
				.from('rfqs_comments')
				.insert({
					message,
					user: session.user.id,
					rfq: form.rfq.id,
					form: form.id
				})
				.select('*, form(form(name)), user(name)')
				.limit(1)
				.single();

			if (data) {
				form.rfq.rfqs_comments = [...(form?.rfq?.rfqs_comments ?? []), data];
			}
		}
	}

	async function submitCallback() {
		isSubmitting = true; // show loading spinner
		const res = await fetch('/api/rfq/form-submission', {
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

	$: if (form?.submitted || form?.deleted) {
		setTimeout(() => {
			history.back();
		}, 750);
	}
</script>

<svelte:head>
	<title>
		{form ? form.form.name : 'Commercial RFQ Form'}
	</title>
</svelte:head>

{#if form}
	{#if form?.submitted}
		<div class="grid place-content-center">
			<p class="mt-12 ml-12">Thank you for submitting form!</p>
		</div>
	{:else if form?.deleted}
		<div class="grid place-content-center">
			<p class="mt-12 ml-12">Form is no longer active.</p>
		</div>
	{:else}
		<Form
			data={form}
			bind:values
			form={form?.form}
			{submitCallback}
			bind:isSubmitting
			{waitingCallback}
			{commentSubmitCallback}
			{supabase}
			{rfqsForPurchasingForm}
		/>
	{/if}
{/if}
