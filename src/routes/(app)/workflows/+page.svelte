<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { getMatchingClass } from '$lib/helpers.js';

	export let data;

	$: ({ supabase, session } = data);

	let workflows;
	let isAdmin = false;
	let showSubmitted = {};
	let isGov = true;
	let isUser = true;
	let isMounted = false;

	async function loadData(isGov) {
		workflows = null; // reset

		const {
			data: { is_admin }
		} = await supabase.from('users').select('is_admin').eq('id', session.user.id).limit(1).single();

		isAdmin = is_admin;

		if (isGov) {
			let formsQuery = supabase
				.from('forms')
				.select(
					'id, submitted, response_timestamp, form!inner(*), solicitation_matched(solicitation(number, description, quantity, quantity_units, expires_on), familiarity_status, matching_rule(name)), created_at'
				)
				.eq('is_deleted', false);

			if (isUser) formsQuery = formsQuery.eq('form.user', session.user.id);

			const { data, error } = await formsQuery;

			let formQuery = supabase.from('form').select('id, name, user!inner(*), step');

			if (isUser) formQuery = formQuery.eq('user.id', session.user.id);

			const { data: f_data, error: f_error } = await formQuery;

			workflows = {};
			workflows.forms = data;
			workflows.form = f_data.sort((a, b) => (a.step > b.step ? 1 : -1));
		} else {
			let formsQuery = supabase
				.from('oem_forms')
				.select('*, oem_form(*), oem_rfq(*, oem_rfqs_parts(*), customer(*))')
				.eq('is_deleted', false);

			if (isUser) formsQuery = formsQuery.eq('oem_form.user', session.user.id);
			const { data, error } = await formsQuery;

			let formQuery = supabase.from('oem_form').select('*, user!inner(id, name)');

			if (isUser) formQuery = formQuery.eq('user.id', session.user.id);

			const { data: f_data, error: f_error } = await formQuery;

			workflows = {};
			workflows.forms = data;
			workflows.form = f_data?.sort((a, b) => (a.step > b.step ? 1 : -1));
		}
	}

	onMount(() => {
		isMounted = true;
	});

	$: if (isMounted && session && isUser !== null) {
		loadData(isGov);
	}

	function formatDate(created_at) {
		let date = new Date(created_at);
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		const diffInDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));

		if (diffInDays === 0) {
			return (
				'Today ' + date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase()
			);
		} else if (diffInDays === 1) {
			return (
				'Yesterday ' +
				date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase()
			);
		} else if (diffInDays <= 6) {
			return date
				.toLocaleDateString('en-US', { weekday: 'long', hour: 'numeric', minute: '2-digit' })
				.replace(',', '');
		} else {
			return date.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				hour: 'numeric',
				minute: '2-digit'
			});
		}
	}

	function calculateDaysDifference(expires_on) {
		let date = new Date(expires_on);
		const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
		const currentDate = new Date();
		const givenDate = new Date(date);

		// Calculate the difference in milliseconds
		const differenceInMilliseconds = Math.abs(currentDate - givenDate);

		// Convert the difference to days
		const differenceInDays = Math.round(differenceInMilliseconds / oneDay);

		return differenceInDays;
	}

	function getForms(workflows, form) {
		let forms = workflows.forms.filter((e) => e.form.id === form.id && !e.submitted);

		return [
			...forms.filter((e) => e.solicitation_matched.familiarity_status === 'Prev Won'),
			...forms.filter((e) => e.solicitation_matched.familiarity_status === 'Prev Bid'),
			...forms.filter((e) => e.solicitation_matched.familiarity_status === 'Seen'),
			...forms.filter((e) => e.solicitation_matched.familiarity_status === 'New')
		];
	}

	function getOemForms(workflows, form) {
		return workflows.forms.filter((e) => e.oem_form.id === form.id && !e.submitted);
	}

	function getFamiliarityClass(status) {
		let pClass = '';
		switch (status) {
			case 'Prev Won':
				pClass = 'bg-green-600';
				break;
			case 'Prev Bid':
				pClass = 'bg-green-500';
				break;
			case 'Seen':
				pClass = 'bg-blue-300';
				break;
			case 'New':
				pClass = 'bg-green-300';
				break;
		}

		return pClass;
	}

	function getPartsDescription(parts) {
		let qty = 0;

		parts?.forEach((e) => {
			qty += e?.quantities?.length || 0;
		});

		return `Parts: ${parts.length}, Quantities: ${qty}`;
	}
</script>

<svelte:head>
	<title>Workflows - Sales Patriot</title>
</svelte:head>

<div class="h-12 bg-neutral-50 flex flex-row items-center justify-between pl-6 pr-10">
	<p>{isGov ? 'Government' : 'OEM'}</p>
	<div class="flex flex-row items-center space-x-5">
		<div class="flex flex-row items-center">
			<button
				class="rounded-r-none text-xs bg-neutral-200 p-2 rounded-l-md border-r-[1px] border-gray-300 hover:bg-neutral-300 {isGov
					? 'bg-neutral-300'
					: ''}"
				on:click={() => (isGov = true)}>Government</button
			>
			<button
				class="rounded-l-none text-xs bg-neutral-200 p-2 rounded-r-md border-l-[1px] border-gray-300 hover:bg-neutral-300 {!isGov
					? 'bg-neutral-300'
					: ''}"
				on:click={() => (isGov = false)}>OEM</button
			>
		</div>
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
		{#if isGov}
			{#each workflows.form.sort((a, b) => (a.step > b.step ? 1 : -1)) as form (form.id)}
				<div class="flex flex-col">
					<div class="flex flex-row justify-between w-96 items-center">
						<p class="font-semibold text-base">
							{`${form.name} (${workflows.forms.filter((e) => e.form.id === form.id && !e.submitted).length})`}
						</p>
						<p class="font-medium text-base">{form.user.name}</p>
					</div>
					{#each getForms(workflows, form) as forms (forms.id)}
						<a href={window.location.origin + '/solicitation-form/' + forms.id} target="_blank">
							<div class="relative flex flex-col shadow-md mt-3 rounded-md bg-white p-2 text-xs">
								<div class="flex flex-row justify-between items-center">
									<p class="font-semibold text-sm">
										{forms.solicitation_matched.solicitation.number}
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
								<p class="mt-2">{forms.solicitation_matched.solicitation.description}</p>
								<p>
									{`${forms.solicitation_matched.solicitation.quantity} ${forms.solicitation_matched.solicitation.quantity_units}`}
								</p>
								<p>
									Expires in {calculateDaysDifference(
										forms.solicitation_matched.solicitation.expires_on
									)} days
								</p>
								<div class="flex flex-row justify-end">
									<p class="text-gray-500">{formatDate(forms.created_at)}</p>
								</div>
							</div>
						</a>
					{/each}
				</div>
			{/each}
		{:else}
			{#each workflows.form.sort((a, b) => (a.step > b.step ? 1 : -1)) as form (form.id)}
				<div class="flex flex-col">
					<div class="flex flex-row justify-between w-96 items-center">
						<p class="font-semibold text-base">
							{`${form.name} (${workflows.forms.filter((e) => e.oem_form.id === form.id && !e.submitted).length})`}
						</p>
						<p class="font-medium text-base">{form.user.name}</p>
					</div>
					{#each getOemForms(workflows, form) as forms (forms.id)}
						<a href={window.location.origin + '/oem-form/' + forms.id} target="_blank">
							<div class="relative flex flex-col shadow-md mt-3 rounded-md bg-white p-2 text-xs">
								<div class="flex flex-row justify-between items-center">
									<p class="font-semibold text-sm">
										{forms.oem_rfq.customer.name + ' / ' + forms.oem_rfq.date_received}
									</p>
								</div>
								<p>
									{getPartsDescription(forms.oem_rfq.oem_rfqs_parts)}
								</p>
								{#if forms.oem_rfq.requested_return_date}
									<p>
										Requested return in {calculateDaysDifference(
											forms.oem_rfq.requested_return_date
										)}
										days
									</p>
								{/if}
								<div class="flex flex-row justify-end">
									<p class="text-gray-500">{formatDate(forms.created_at)}</p>
								</div>
							</div>
						</a>
					{/each}
				</div>
			{/each}
		{/if}
	</article>
{:else}
	<div class="flex flex-col gap-4 p-5">
		<div class="skeleton h-8 w-full"></div>
		<div class="skeleton h-4 w-full"></div>
		<div class="skeleton h-4 w-full"></div>
	</div>
{/if}
