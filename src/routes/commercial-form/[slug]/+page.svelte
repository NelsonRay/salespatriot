<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Form from '$lib/components/app/Commercial/Form/Form.svelte';

	export let data;
	$: ({ supabase, session } = data);

	let form = null;
	let comments = [];
	let values = {};
	let isSubmitting = false;
	let rfqsForPurchasingForm;

	async function loadData() {
		const { data, error: err } = await supabase
			.from('forms')
			.select(
				'*, form!inner(*), part(*, parts_labor_minutes(*), comments(*, form(form(name)), user(name), part(number), rfq(customer(name), received_at))), rfq_public(*), rfq(*, comments(*, form(form(name)), user(name), part(number), rfq(customer(name), received_at)), customer(*), rfqs_parts(*, part(*, parts_purchasing(*), parts_labor_minutes(*)), rfqs_parts_quantities(*)))'
			)
			.eq('id', parseInt($page.params.slug))
			.limit(1)
			.single();

		if (data?.rfq) {
			let { data: partsComments } = await supabase
				.from('comments')
				.select('*, form(form(name)), user(name), part(number), rfq(customer(name), received_at)')
				.in(
					'part',
					data.rfq.rfqs_parts.map((p) => p.part.id)
				);

			comments = [...(data?.rfq?.comments ?? []), ...partsComments];
		} else if (data?.part) {
			let { data: rfqs_parts } = await supabase
				.from('rfqs_parts')
				.select(
					'id, rfq(comments(*, form(form(name)), user(name), part(number), rfq(customer(name), received_at)))'
				)
				.eq('part', data.part.id);

			let rfqComments = [];

			for (let rfqs_part of rfqs_parts) {
				rfqComments = [...rfqComments, ...(rfqs_part?.rfq?.comments ?? [])];
			}

			comments = [...(data?.part?.comments ?? []), ...rfqComments];
		}

		if (data?.form?.type === 'purchasing') {
			const { data: d, error: e } = await supabase
				.from('rfqs_parts')
				.select(
					'id, rfq!inner(id, status, customer(*), received_at, rfqs_parts(id, rfqs_parts_quantities(*)))'
				)
				.eq('part', data.part.id);

			rfqsForPurchasingForm = d;
		}

		form = data;

		if (['final_pricing', 'enter_quote', 'bid'].includes(form?.form?.type)) {
			values = form.rfq;
		} else if (form?.form?.type === 'confirm') {
			values = {
				person_name: data.rfq_public?.values?.person_name,
				customer: {
					email_address: data.rfq_public?.values?.customer?.email_address,
					phone_number: data.rfq_public?.values?.customer?.phone_number
				},
				received_at: data.rfq_public.values.received_at,
				requested_return_date: data.rfq_public.values.requested_return_date,
				rfqs_parts: [
					{
						part: {},
						rfqs_parts_quantities: [{ quantity: null }]
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
				.from('comments')
				.insert({
					message,
					user: session.user.id,
					form: form.id,
					part: form?.part?.id,
					rfq: form?.rfq?.id
				})
				.select('*, form(form(name)), user(name), part(number), rfq(customer(name), received_at)')
				.limit(1)
				.single();

			if (data) {
				comments = [...(comments ?? []), data];
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
			{comments}
			{submitCallback}
			bind:isSubmitting
			{waitingCallback}
			{commentSubmitCallback}
			{supabase}
			{rfqsForPurchasingForm}
			partLaborMinutes={form?.part?.parts_labor_minutes}
		/>
	{/if}
{/if}
