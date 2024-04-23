<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Form from '$lib/components/app/Commercial/Form/Form.svelte';
	import AwardModal from '$lib/components/app/Commercial/Modals/AwardModal/AwardModal.svelte';

	export let data;
	$: ({ supabase, session } = data);

	let rfq = null;
	let comments = [];

	let values;
	let awardModalOpen = false;

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
				'*, comments(*, form(form(name)), user(name), product(number), rfq(customer(name), received_at)), customer(*), rfqs_products(*, product(*, product_purchasing(*), product_labor_minutes(*)), product_labor_minutes(*), rfqs_products_quantities(*))'
			)
			.eq('id', $page.params.slug)
			.limit(1)
			.single();

		let { data: productsComments } = await supabase
			.from('comments')
			.select('*, form(form(name)), user(name), product(number), rfq(customer(name), received_at)')
			.in(
				'product',
				data.rfqs_products.map((p) => p.product.id)
			);

		comments = [...(data?.comments ?? []), ...productsComments];
		comments = comments.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

		rfq = data;
		values = data;
	}

	async function commentSubmitCallback(message) {
		if (message) {
			const { data, error } = await supabase
				.from('comments')
				.insert({
					message,
					user: session.user.id,
					rfq: rfq.id,
					form: null
				})
				.select(
					'*, form(form(name)), user(name), product(number), rfq(customer(name), received_at)'
				)
				.limit(1)
				.single();

			if (data) {
				comments = [...(comments ?? []), data];
			}
		}
	}

	async function awardCallback(values) {
		if (values.status.includes('response:placed_order')) {
			const { date_ordered, due_date, order_notes, rfqs_products, status } = values;
			await supabase
				.from('rfqs')
				.update({
					status,
					date_ordered,
					due_date,
					order_notes
				})
				.eq('id', rfq.id);

			for (let rfqs_product of rfqs_products) {
				const { id, quantity_ordered, unit_price_ordered } = rfqs_product;
				await supabase
					.from('rfqs_products')
					.update({ quantity_ordered, unit_price_ordered })
					.eq('id', id);
			}
		} else {
			const { status } = values;
			await supabase
				.from('rfqs')
				.update({
					status
				})
				.eq('id', rfq.id);
		}

		window.location.reload();
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
	<Form
		data={rfq}
		{values}
		{submitCallback}
		{isSubmitting}
		{comments}
		{commentSubmitCallback}
		bind:awardModalOpen
	/>
{/if}

<AwardModal bind:open={awardModalOpen} values={rfq} submitCallback={awardCallback} />
