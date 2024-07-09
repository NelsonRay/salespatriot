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

	let forms;
	let isAdmin = false;
	let isUser = true;
	let isMounted = false;

	async function loadData() {
		forms = null; // reset

		const {
			data: { admin }
		} = await supabase.from('users').select('admin').eq('id', session.user.id).limit(1).single();

		isAdmin = admin;

		let formsQuery = supabase
			.from('forms')
			.select(
				'*, assignee!inner(*), form!inner(*), email(subject, from), part(*, rfqs_parts(*, rfq(status, customer(name)), rfqs_parts_quantities(*))), rfq(*, customer(name), rfqs_parts(id, part(number), rfqs_parts_quantities(id))), rfq_public(*), solicitation_matched(solicitation(id, description, quantity, quantity_units, expires_on, estimated_value), familiarity_status, matching_rule(id, name))'
			)
			.eq('deleted', false)
			.eq('submitted', false);

		if (isUser) formsQuery = formsQuery.eq('assignee', session.user.id);

		const { data, error } = await formsQuery;

		forms = data;
	}

	onMount(() => {
		isMounted = true;
	});

	$: if (isMounted && session && isUser !== null) {
		loadData();
	}

	function getKanbanBoards(forms) {
		let boards = [];

		for (let form of forms) {
			if (!boards.some((b) => b.id == form.form.id && b.assignee.id == form.assignee.id)) {
				boards = [...boards, { ...form.form, assignee: form.assignee }];
			}
		}

		let sortedBoards = boards.sort((a, b) => a.step - b.step);

		return sortedBoards;
	}

	function getSortedForms(forms, board) {
		forms = forms.filter(
			(f) => f.form.id === board.id && f.assignee.id === board.assignee.id && !f.submitted
		);

		switch (board.type) {
			case 'opportunity':
				forms = forms.sort(
					(a, b) =>
						b?.solicitation_matched?.solicitation?.estimated_value -
						a?.solicitation_matched?.solicitation?.estimated_value
				);

				const monitoredSols = forms.filter((e) =>
					['518d98ed-c7d1-4d44-8223-b14214d7b050', '917b423d-a0f6-47bb-82cd-8d73d322b458'].includes(
						e?.solicitation_matched?.matching_rule?.id
					)
				);
				const nonMonitoredSols = forms.filter(
					(e) =>
						![
							'518d98ed-c7d1-4d44-8223-b14214d7b050',
							'917b423d-a0f6-47bb-82cd-8d73d322b458'
						].includes(e?.solicitation_matched?.matching_rule?.id)
				);

				forms = [
					...monitoredSols,
					...nonMonitoredSols.filter(
						(e) => e?.solicitation_matched?.familiarity_status === 'Prev Won'
					),
					...nonMonitoredSols.filter(
						(e) => e?.solicitation_matched?.familiarity_status === 'Prev Bid'
					),
					...nonMonitoredSols.filter((e) => e?.solicitation_matched?.familiarity_status === 'Seen'),
					...nonMonitoredSols.filter((e) => e?.solicitation_matched?.familiarity_status === 'New')
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
		let parts = rfq?.rfqs_parts?.length ?? 0;
		let qty = 0;

		for (let p of rfq?.rfqs_parts ?? []) {
			qty += p.rfqs_parts_quantities?.length ?? 0;
		}

		return `# of Parts: ${parts}, # of Quantities: ${qty}`;
	}

	function getCommercialFormTitle(form) {
		if (form.form.id === '5a91b7a7-513f-4067-8776-1cb01f334c96') {
			if (form.email) {
				return (
					form.email.subject.toString().substring(0, 30) +
					(form.email.subject.length > 30 ? '...' : '')
				);
			} else {
				return form.rfq_public.values.customer.name;
			}
		} else {
			return form?.part?.number ?? form.rfq?.customer?.name + ' / ' + form.rfq.received_at;
		}
	}
</script>

<svelte:head>
	<title>Workflows - Sales Patriot</title>
</svelte:head>

<div class="flex flex-row h-12 bg-white items-center justify-between pl-6 pr-10">
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
{#if forms}
	<article class="flex flex-row space-x-5 bg-white w-[100%] p-5" style="direction: ltr;">
		{#if getKanbanBoards(forms).length === 0}
			<p class="font-semibold">No Tasks</p>
		{:else}
			{#each getKanbanBoards(forms) as board (board.id + board.assignee.id)}
				<div class="flex flex-col pr-5 border-r-2 border-neutral-100">
					<div class="flex flex-row justify-between w-96 items-center">
						<p class="font-semibold text-base">
							{`${board.name} (${getSortedForms(forms, board).length})`}
						</p>
						<p class="font-medium text-base text-gray-500">{board.assignee.name}</p>
					</div>
					{#each getSortedForms(forms, board) as form (form.id)}
						{#if form?.commercial}
							<a href={window.location.origin + '/commercial-form/' + form.id}>
								<div class="relative flex flex-col shadow-lg mt-3 rounded-md bg-white p-2 text-xs">
									<div class="flex flex-row justify-between items-center">
										<p class="font-semibold text-sm">
											{getCommercialFormTitle(form)}
										</p>
										<div class="flex flex-row items-center space-x-1">
											{#if form.waiting}
												<div class="px-2 py-1 rounded-md bg-yellow-400 mb-1">
													<p>Waiting</p>
												</div>
											{/if}
											{#if form.form.type == 'confirm'}
												{#if form.email}
													<div class="px-2 py-1 rounded-md bg-blue-300 mb-1">
														<p>Email</p>
													</div>
												{:else}
													<div class="px-2 py-1 rounded-md bg-yellow-300 mb-1">
														<p>Website</p>
													</div>
												{/if}
											{/if}
										</div>
									</div>
									{#if form?.rfq}
										<p class="mt-1 font-medium">{getRFQDescription(form?.rfq)}</p>
									{/if}
									{#if form?.email}
										<p class="mt-1 font-medium">{form.email.from.value[0].address}</p>
									{/if}
									{#if board?.type === 'purchasing'}
										<div class="mb-2">
											{#each form?.part?.rfqs_parts.filter((p) => !p.rfq.status.includes('purchasing:complete')) ?? [] as rfqs_part}
												<p class="mt-1 font-medium">
													{'QTY: ' +
														rfqs_part.rfqs_parts_quantities.map((p) => p.quantity).join(', ') +
														' - ' +
														rfqs_part.rfq.customer.name}
												</p>
											{/each}
										</div>
									{/if}
									{#if board?.type === 'labor'}
										<div class="mb-2">
											{#each form?.part?.rfqs_parts.filter((p) => !p.rfq.status.includes('labor:complete')) ?? [] as rfqs_part}
												<p class="mt-1 font-medium">
													{'QTY: ' +
														rfqs_part.rfqs_parts_quantities.map((p) => p.quantity).join(', ') +
														' - ' +
														rfqs_part.rfq.customer.name}
												</p>
											{/each}
										</div>
									{/if}
									{#if board?.type === 'enter_quote'}
										{#each form?.rfq?.rfqs_parts ?? [] as rfqs_part}
											<p class="mt-1 font-medium">{rfqs_part.part.number}</p>
										{/each}
									{/if}
									{#if form?.rfq_public}
										<p class="mt-1 font-medium">{getRFQDescription(form?.rfq_public?.values)}</p>
									{/if}
									<div class="flex flex-row justify-end">
										<p
											class={Math.abs(calculateDaysDifference(form.created_at)) > 4
												? 'text-red-400'
												: 'text-gray-500'}
										>
											{formatDateWithTime(form.created_at) +
												' (' +
												Math.abs(calculateDaysDifference(form.created_at)) +
												'd old)'}
										</p>
									</div>
								</div>
							</a>
						{:else}
							<a href={window.location.origin + '/solicitation-form/' + form.id}>
								<div class="relative flex flex-col shadow-md mt-3 rounded-md bg-white p-2 text-xs">
									<div class="flex flex-row justify-between items-center">
										<p class="font-semibold text-sm">
											{form.solicitation_matched.solicitation.id}
										</p>
										<div class="flex flex-row items-center space-x-1">
											{#if form.solicitation_matched?.matching_rule?.name}
												<div
													class="px-2 py-1 rounded-md {getMatchingClass(
														form.solicitation_matched?.matching_rule?.name
													)}"
												>
													<p>{form.solicitation_matched?.matching_rule?.name}</p>
												</div>
											{/if}
											<div
												class="px-2 py-1 rounded-md {getFamiliarityClass(
													form.solicitation_matched.familiarity_status
												)}"
											>
												<p>
													{form.solicitation_matched.familiarity_status}
												</p>
											</div>
										</div>
									</div>
									<div class="flex flex-row justify-between">
										<div class="flex flex-col">
											<p class="mt-2 font-medium">
												{form.solicitation_matched.solicitation.description}
											</p>
											{#if board?.id === '50e95568-180b-46d5-a341-f216bb2a3c17'}
												<p>
													{formatCurrency(form.solicitation_matched.solicitation.estimated_value)}
												</p>
											{/if}
											<p>
												{`${form.solicitation_matched.solicitation.quantity} ${form.solicitation_matched.solicitation.quantity_units}`}
											</p>
											<p
												class={calculateDaysDifference(
													form.solicitation_matched.solicitation.expires_on
												) <= 2
													? 'text-red-400'
													: ''}
											>
												Expires {([1, -1, 0].includes(
													calculateDaysDifference(form.solicitation_matched.solicitation.expires_on)
												)
													? ''
													: ' on ') +
													formatMonthDayYearDate(
														form.solicitation_matched.solicitation.expires_on
													) +
													` (${calculateDaysDifference(form.solicitation_matched.solicitation.expires_on)}d)`}
											</p>
										</div>
										<div>
											{#if form.waiting}
												<div class="px-2 py-1 rounded-md bg-yellow-400 mt-1">
													<p>Waiting</p>
												</div>
											{/if}
										</div>
									</div>
									<div class="flex flex-row justify-end">
										<p
											class={Math.abs(calculateDaysDifference(form.created_at)) > 4
												? 'text-red-400'
												: 'text-gray-500'}
										>
											{formatDateWithTime(form.created_at) +
												' (' +
												Math.abs(calculateDaysDifference(form.created_at)) +
												'd old)'}
										</p>
									</div>
								</div>
							</a>
						{/if}
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
