<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import SolicitationForm from '$lib/components/app/Government/SolicitationForm/SolicitationForm.svelte';
	import RemoveModal from '$lib/components/app/Government/Modals/RemoveModal/RemoveModal.svelte';

	export let data;
	$: ({ supabase, session } = data);

	let form = null;
	let nsn_matches = null;
	let isAdmin = false;
	let removeModalOpen = false;
	let removeValues = {};

	let values = {};

	let isSubmitting = false;

	async function loadData() {
		const { data, error: err } = await supabase
			.from('forms')
			.select(
				`*, form!inner(*), solicitation_matched!inner(*, solicitations_matched_comments(*, user(name), form(form(name))), solicitation!inner(*, nsn(id, matching_nsns(*, product(number)))), forms(*, form(*), submitted_by(*)), matching_rule(*))`
			)
			.eq('id', parseInt($page.params.slug))
			.limit(1)
			.single();

		if (['opportunity', 'final_pricing', 'bid'].includes(data.form.type)) {
			const { data: n_data, error: n_error } = await supabase
				.from('solicitations_matched')
				.select(
					'*, solicitation!inner(*, nsn(id, matching_nsns(*, product(number))), expires_on), matching_rule(*)'
				)
				.eq('solicitation.nsn', data.solicitation_matched.solicitation.nsn.id)
				.lt('solicitation.issued_on', data.solicitation_matched.solicitation.issued_on);

			nsn_matches = n_data.sort((a, b) =>
				new Date(a.solicitation.expires_on) > new Date(b.solicitation.expires_on) ? -1 : 1
			);
		}
		const {
			data: { admin },
			error
		} = await supabase.from('users').select('*').eq('id', session.user.id).limit(1).single();

		isAdmin = admin;

		form = data;
		const { solicitation, matching_rule, forms, solicitations_matched_comments, ...rest } =
			data.solicitation_matched;
		values = rest;
		removeValues = {
			removed_option: values.removed_option,
			removed: values.removed || true,
			flagged: values.flagged
		};
	}

	async function commentSubmitCallback(message) {
		if (message) {
			const { data, error } = await supabase
				.from('solicitations_matched_comments')
				.insert({
					message,
					user: session.user.id,
					solicitation_matched: form.solicitation_matched.id,
					form: form.id
				})
				.select('*, form(form(name)), user(name)')
				.limit(1)
				.single();

			if (data) {
				form.solicitation_matched.solicitations_matched_comments = [
					...(form?.solicitation_matched?.solicitations_matched_comments ?? []),
					data
				];
			}
		}
	}

	async function removeModalSubmitCallback(removedValues) {
		let status = form.solicitation_matched.status ?? [];
		let updateStatus = false;

		if (removeValues?.removed_option === 'c714e8d7-277e-4f39-8e9e-b92352b1c26e') {
			status = status.filter((s) => !s.includes('opportunity'));
			status = [...(status ?? []), 'opportunity:not_pursue'];
			updateStatus = true;
		} else if (removeValues?.removed_option === '45c9d55c-dd2b-4bd9-b53d-be65bd70863f') {
			status = status.filter((s) => !s.includes('engineering'));
			status = [...(status ?? []), 'engineering:cannot_build'];
			updateStatus = true;
		}

		if (updateStatus) {
			await supabase
				.from('solicitations_matched')
				.update({
					removed_option: removedValues.removed ? removedValues.removed_option : null,
					removed: removedValues.removed,
					flagged: removedValues.flagged || false,
					status
				})
				.eq('id', form.solicitation_matched.id);
		} else {
			await supabase
				.from('solicitations_matched')
				.update({
					removed_option: removedValues.removed ? removedValues.removed_option : null,
					removed: removedValues.removed,
					flagged: removedValues.flagged || false
				})
				.eq('id', form.solicitation_matched.id);
		}

		if (removedValues.removed && removedValues.removed_notes)
			await supabase.from('solicitations_matched_comments').insert({
				solicitation_matched: form.solicitation_matched.id,
				user: session.user.id,
				message: removedValues.removed_notes
			});

		removeModalOpen = false;

		if (removeValues.removed) {
			window.location.href = `${window.location.origin}/workflows`;
		} else {
			window.location.reload();
		}
	}

	onMount(() => {
		if (session) {
			loadData();
		}
	});

	async function submitCallback() {
		isSubmitting = true; // show loading spinner
		const res = await fetch('/api/solicitations/form-submission', {
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

	$: if (form?.form?.type === 'opportunity') {
		if (!values?.status?.includes('opportunity:pursue')) {
			delete values.skip_engineering;
			values.status = values?.status?.filter((e) => !e.toString().includes('engineering'));
		}
		if (!values.skip_engineering) {
			values.status = values?.status?.filter((e) => !e.toString().includes('engineering'));
		}
	}

	$: if (form?.submitted || form?.deleted) {
		setTimeout(() => {
			window.location.href = `${window.location.origin}/workflows`;
		}, 1500);
	}
</script>

<svelte:head>
	<title>
		{form?.solicitation_matched
			? form.solicitation_matched.solicitation.id + ' - ' + form.form.name
			: 'Sales Patriot'}
	</title>
</svelte:head>

{#if form}
	{#if !form?.deleted}
		{#if !form?.submitted}
			<SolicitationForm
				solicitation_matched={form?.solicitation_matched}
				bind:values
				form={form?.form}
				bind:nsn_matches
				{submitCallback}
				bind:isSubmitting
				{isAdmin}
				{commentSubmitCallback}
				bind:removeModalOpen
			/>
		{:else}
			<p class="mt-12 ml-12">Thank you for submitting form!</p>
		{/if}
	{:else}
		<p class="mt-12 ml-12">Form is no longer active.</p>
	{/if}
{/if}

<RemoveModal
	bind:open={removeModalOpen}
	values={removeValues}
	submitCallback={removeModalSubmitCallback}
/>
