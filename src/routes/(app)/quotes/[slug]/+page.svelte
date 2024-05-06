<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Arrow from '$lib/icons/Arrow.svg';
	import Textarea from '$lib/components/form/Textarea.svelte';
	import Currency from '$lib/components/form/Currency.svelte';
	import DateInput from '$lib/components/form/DateInput.svelte';
	import { quoteForm } from '$lib/validation.js';
	import { hasErrors } from '$lib/utils/errors';

	export let data;
	// export let isAdmin = false;

	$: ({ supabase, session } = data);

	let quote = null;
	let isMounted = false;
	let isSubmitting = false;
	let errors;

	function goBack() {
		history.back();
	}

	async function loadData() {
		let query = supabase
			.from('parts_quotes')
			.select(
				'id, part(*), parts_quotes_quantities(*), boms_quote(id, bom(id, parts(number))), vendor(*), created_at'
			)
			.eq('id', $page.params.slug)
			.limit(1)
			.single();

		let { data, error } = await query;

		quote = data;
	}

	onMount(() => {
		if (session) {
			loadData($page.url.pathname);
		}
		isMounted = true;
	});

	async function handleSubmit() {
		const results = quoteForm()?.safeParse(quote);
		errors = results?.error?.issues;

		if (!errors) {
			isSubmitting = true;

			const res = await fetch('/api/quotes/complete', {
				method: 'POST',
				body: JSON.stringify({ values: quote })
			});

			if (res.status === 200) {
				window.location.href = '/quotes';
			} else {
				isSubmitting = false; // hide loading spinner
			}
		}
	}
</script>

<svelte:head>
	<title>Quotes - Sales Patriot</title>
</svelte:head>

<div class="relative top-0">
	<div class="flex flex-row h-14 items-center justify-between mx-2">
		<div class="flex flex-row items-center space-x-5">
			<button on:click={goBack}>
				<div class="flex flex-row items-center p-2 rounded-md bg-neutral-50">
					<img src={Arrow} alt="1" class="h-5 w-5" />
					<p class="mb-[0.5px]">Go Back</p>
				</div>
			</button>
			{#if quote}
				<p>
					{`${quote.part.number} (PN: ${quote.boms_quote?.bom?.parts?.number}) - ${quote.vendor?.name} (${quote.vendor.email})`}
				</p>
			{/if}
		</div>
	</div>

	{#if quote}
		<div class="p-4 space-y-3">
			{#each quote?.parts_quotes_quantities?.sort((a, b) => a.quantity - b.quantity) ?? [] as qty, index}
				<div class="flex flex-row space-x-5">
					<div>
						<div>
							<p class="mb-1">Quantity</p>
							<Currency bind:value={qty.quantity} width={'w-24'} disabled />
							{#if hasErrors(errors, ['parts_quotes_quantities', index, 'quantity'])}
								<label for="trim" class="label">
									<span class="label-text-alt text-error">Required</span>
								</label>
							{/if}
						</div>
					</div>
					<div>
						<p class="mb-1">Unit Price</p>
						<Currency bind:value={qty.unit_price} width={'w-24'} />
						{#if hasErrors(errors, ['parts_quotes_quantities', index, 'unit_price'])}
							<label for="trim" class="label">
								<span class="label-text-alt text-error">Required</span>
							</label>
						{/if}
					</div>
					<div>
						<p class="mb-1">Lead Time (Days)</p>
						<Currency bind:value={qty.lead_time} width={'w-24'} />
						{#if hasErrors(errors, ['parts_quotes_quantities', index, 'lead_time'])}
							<label for="trim" class="label">
								<span class="label-text-alt text-error">Required</span>
							</label>
						{/if}
					</div>
				</div>
			{/each}

			<div class="flex flex-row space-x-5">
				<div>
					<p class="mb-1">Date Received:</p>
					<DateInput bind:value={quote.date_received} />
					{#if hasErrors(errors, ['date_received'])}
						<label for="trim" class="label">
							<span class="label-text-alt text-error">Required</span>
						</label>
					{/if}
				</div>
				<div>
					<p class="mb-1">Expiration Date:</p>
					<DateInput bind:value={quote.expiration_date} />
				</div>
			</div>

			<div class="flex flex-row space-x-5">
				<div>
					<p class="mb-1">Min Order Qty:</p>
					<Currency bind:value={quote.moq} width={'w-24'} />
				</div>

				<div>
					<p class="mb-1">Min Lot Charge:</p>
					<Currency bind:value={quote.moc} width={'w-24'} />
				</div>
			</div>

			<div>
				<p class="mb-1">Notes:</p>
				<Textarea bind:value={quote.notes} autoCollapse={false} />
			</div>
		</div>
	{/if}

	<div class="flex flex-row mt-5 items-center justify-center">
		{#if !isSubmitting}
			<button class="btn px-6 py-2 rounded-md text-xs bg-white shadow-md" on:click={handleSubmit}
				>Submit</button
			>
		{:else}
			<span class="loading loading-spinner loading-md"></span>
		{/if}
	</div>
</div>
