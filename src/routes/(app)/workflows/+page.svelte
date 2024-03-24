<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import {
		getMatchingClass,
		getFamiliarityClass,
		calculateDaysDifference,
		formatMonthDayYearDate,
		formatDateWithTime,
		formatCurrency
	} from '$lib/helpers.js';

	export let data;

	$: ({ supabase, session } = data);

	let workflows;
	let isAdmin = false;
	let showSubmitted = {};
	let isUser = true;
	let isMounted = false;

	async function loadData() {
		workflows = null; // reset

		const {
			data: { admin }
		} = await supabase.from('users').select('admin').eq('id', session.user.id).limit(1).single();

		isAdmin = admin;

		let formsQuery = supabase
			.from('forms')
			.select(
				'*, form!inner(*), product(*), rfq(*, customer(name), rfqs_products(id, rfqs_products_quantities(id))), rfq_public(*), solicitation_matched(solicitation(id, description, quantity, quantity_units, expires_on, estimated_value), familiarity_status, matching_rule(name)), created_at'
			)
			.eq('deleted', false)
			.eq('submitted', false);

		if (isUser) formsQuery = formsQuery.eq('form.user', session.user.id);

		const { data, error } = await formsQuery;

		let formQuery = supabase.from('form').select('id, name, user!inner(*), step, type');

		if (isUser) formQuery = formQuery.eq('user.id', session.user.id);

		const { data: f_data, error: f_error } = await formQuery;

		workflows = {};
		workflows.forms = data;
		workflows.form = f_data.sort((a, b) => (a.step > b.step ? 1 : -1));
	}

	onMount(() => {
		isMounted = true;
	});

	$: if (isMounted && session && isUser !== null) {
		loadData();
	}

	function getSortedForms(workflows, form) {
		let forms = workflows.forms.filter((e) => e.form.id === form.id && !e.submitted);

		switch (form.type) {
			case 'opportunity':
				forms =  forms.sort(
					(a, b) =>
						b?.solicitation_matched?.solicitation?.estimated_value -
						a?.solicitation_matched?.solicitation?.estimated_value
				);

				forms = [
					...forms.filter((e) => e?.solicitation_matched?.familiarity_status === 'Prev Won'),
					...forms.filter((e) => e?.solicitation_matched?.familiarity_status === 'Prev Bid'),
					...forms.filter((e) => e?.solicitation_matched?.familiarity_status === 'Seen'),
					...forms.filter((e) => e?.solicitation_matched?.familiarity_status === 'New')
				];
				return forms;
			case 'purchasing':
				return forms.sort((a, b) => a?.waiting - b?.waiting);
			default:
				return [
					...forms.filter((e) => e?.commercial),
					...forms.filter((e) => e?.solicitation_matched?.familiarity_status === 'Prev Won'),
					...forms.filter((e) => e?.solicitation_matched?.familiarity_status === 'Prev Bid'),
					...forms.filter((e) => e?.solicitation_matched?.familiarity_status === 'Seen'),
					...forms.filter((e) => e?.solicitation_matched?.familiarity_status === 'New')
				];
		}
	}

	function getRFQDescription(rfq) {
		let parts = rfq?.rfqs_products?.length ?? 0;
		let qty = 0;

		for (let p of rfq.rfqs_products) {
			qty += p.rfqs_products_quantities?.length ?? 0;
		}

		return `# of Parts: ${parts}, # of Quantities: ${qty}`;
	}

	function getCommercialFormTitle(forms, form) {
		if (form.id === '5a91b7a7-513f-4067-8776-1cb01f334c96') {
			return forms.rfq_public.values.customer.name + ' / ' + forms.rfq_public.values.received_at;
		} else {
			return forms?.product?.number ?? forms.rfq?.customer?.name + ' / ' + forms.rfq.received_at;
		}
	}
</script>

<svelte:head>
	<title>Workflows - Sales Patriot</title>
</svelte:head>

<div class="h-12 bg-neutral-50 flex flex-row items-center justify-between pl-6 pr-10">
	<p class="text-lg font-medium">Workflows</p>
	<div class="flex flex-row items-center space-x-5">
		{#if isAdmin}
			<div class="flex flex-row items-center">
				<button
					class="rounded-r-none text-xs bg-neutral-200 p-2 rounded-l-md border-r-[1px] border-gray-300 hover:bg-neutral-300 {!isUser
						? 'bg-neutral-300'
						: ''}"
					on:click={() => (isUser = false)}>Admin</button
				>
				<button
					class="rounded-l-none text-xs bg-neutral-200 p-2 rounded-r-md border-l-[1px] border-gray-300 hover:bg-neutral-300 {isUser
						? 'bg-neutral-300'
						: ''}"
					on:click={() => (isUser = true)}>User</button
				>
			</div>
		{/if}
	</div>
</div>
{#if workflows}
	<article
		class="bg-neutral-50 w-[100%] h-[93%] p-5 overflow-y-auto overflow-x-auto border-l-[0.2px] border-l-gainsboro flex flex-row overflow-auto space-x-5"
		style="direction: ltr;"
	>
		{#each workflows.form.sort((a, b) => (a.step > b.step ? 1 : -1)) as form (form.id)}
			<div class="flex flex-col">
				<div class="flex flex-row justify-between w-96 items-center">
					<p class="font-semibold text-base">
						{`${form.name} (${workflows.forms.filter((e) => e.form.id === form.id && !e.submitted).length})`}
					</p>
					<p class="font-medium text-base">{form.user.name}</p>
				</div>
				{#each getSortedForms(workflows, form) as forms (forms.id)}
					{#if forms?.commercial}
						<a href={window.location.origin + '/commercial-form/' + forms.id}>
							<div class="relative flex flex-col shadow-md mt-3 rounded-md bg-white p-2 text-xs">
								<div class="flex flex-row justify-between items-center">
									<p class="font-semibold text-sm">
										{getCommercialFormTitle(forms, form)}
									</p>
									<div class="flex flex-row items-center space-x-1">
										{#if forms.waiting}
											<div class="px-2 py-1 rounded-md bg-yellow-400 mb-1">
												<p>Waiting</p>
											</div>
										{/if}
									</div>
								</div>
								{#if forms?.rfq}
									<p class="mt-1 font-medium">{getRFQDescription(forms?.rfq)}</p>
								{/if}
								{#if forms?.rfq_public}
									<p class="mt-1 font-medium">{getRFQDescription(forms?.rfq_public?.values)}</p>
								{/if}
								<div class="flex flex-row justify-end">
									<p class="text-gray-500">{formatDateWithTime(forms.created_at)}</p>
								</div>
							</div>
						</a>
					{:else}
						<a href={window.location.origin + '/solicitation-form/' + forms.id}>
							<div class="relative flex flex-col shadow-md mt-3 rounded-md bg-white p-2 text-xs">
								<div class="flex flex-row justify-between items-center">
									<p class="font-semibold text-sm">
										{forms.solicitation_matched.solicitation.id}
									</p>
									<div class="flex flex-row items-center space-x-1">
										{#if forms.solicitation_matched?.matching_rule?.name}
											<div
												class="px-2 py-1 rounded-md {getMatchingClass(
													forms.solicitation_matched?.matching_rule?.name
												)}"
											>
												<p>{forms.solicitation_matched?.matching_rule?.name}</p>
											</div>
										{/if}
										<div
											class="px-2 py-1 rounded-md {getFamiliarityClass(
												forms.solicitation_matched.familiarity_status
											)}"
										>
											<p>
												{forms.solicitation_matched.familiarity_status}
											</p>
										</div>
									</div>
								</div>
								<div class="flex flex-row justify-between">
									<div class="flex flex-col">
										<p class="mt-2 font-medium">
											{forms.solicitation_matched.solicitation.description}
										</p>
										{#if form?.id === '50e95568-180b-46d5-a341-f216bb2a3c17'}
											<p>
												{formatCurrency(forms.solicitation_matched.solicitation.estimated_value)}
											</p>
										{/if}
										<p>
											{`${forms.solicitation_matched.solicitation.quantity} ${forms.solicitation_matched.solicitation.quantity_units}`}
										</p>
										<p
											class={calculateDaysDifference(
												forms.solicitation_matched.solicitation.expires_on
											) <= 2
												? 'text-red-400'
												: ''}
										>
											Expires {([1, -1, 0].includes(
												calculateDaysDifference(forms.solicitation_matched.solicitation.expires_on)
											)
												? ''
												: ' on ') +
												formatDateWithTime(forms.solicitation_matched.solicitation.expires_on) +
												` (${calculateDaysDifference(forms.solicitation_matched.solicitation.expires_on)}d)`}
										</p>
									</div>
									<div>
										{#if forms.waiting}
											<div class="px-2 py-1 rounded-md bg-yellow-400 mt-1">
												<p>Waiting</p>
											</div>
										{/if}
									</div>
								</div>
								<div class="flex flex-row justify-end">
									<p class="text-gray-500">{formatDateWithTime(forms.created_at)}</p>
								</div>
							</div>
						</a>
					{/if}
				{/each}
			</div>
		{/each}
	</article>
{:else}
	<div class="flex flex-col gap-4 p-5">
		<div class="skeleton h-8 w-full"></div>
		<div class="skeleton h-4 w-full"></div>
		<div class="skeleton h-4 w-full"></div>
	</div>
{/if}
