<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import SolicitationForm from '$lib/components/app/Government/SolicitationForm/SolicitationForm.svelte';
	import AwardModal from '$lib/components/app/Government/Modals/AwardModal/AwardModal.svelte';
	import RemoveModal from '$lib/components/app/Government/Modals/RemoveModal/RemoveModal.svelte';

	export let data;
	$: ({ supabase, session } = data);

	let solicitation_matched = null;
	let nsn_matches = null;
	let awardModalOpen = false;
	let removeModalOpen = false;

	let values = {};
	let awardValues = {};
	let removeValues = {};

	let isSubmitting = false;

	async function submitCallback() {
		isSubmitting = true; // show loading spinner
		const res = await fetch('/api/solicitations/update', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ values, id: solicitation_matched.id, oldValues: solicitation_matched })
		});

		if (res.status === 200) {
			window.location.reload();
		} else {
			isSubmitting = false; // hide loading spinner
		}
	}

	async function loadData() {
		let { data, error } = await supabase
			.from('solicitations_matched')
			.select(
				`*, solicitation!inner(*, nsn(id, map_nsns_to_parts(*, part(id, number)))), matching_rule(*), forms(*, form(*), submitted_by(*)), comments(*, user(name), form(form(name)))`
			)
			.eq('id', $page.params.slug)
			.limit(1)
			.single();

		let { data: n_data, error: n_error } = await supabase
			.from('solicitations_matched')
			.select(
				'*, solicitation!inner(*, nsn(id, map_nsns_to_parts(*, part(id, number)))), matching_rule(*)'
			)
			.eq('solicitation.nsn', data.solicitation.nsn.id)
			.lt('solicitation.issued_on', data.solicitation.issued_on);

		nsn_matches = n_data.sort((a, b) =>
			new Date(a.solicitation.expires_on) > new Date(b.solicitation.expires_on) ? -1 : 1
		);
		solicitation_matched = data;

		const { solicitation, matching_rule, forms, comments, ...rest } = data;
		values = rest;

		// Queue values for modals
		awardValues = {
			status: values.status,
			company_awarded: values.company_awarded,
			price_won_at: values.price_won_at,
			date_awarded: values.date_awarded,
			first_article_waive_request_honored: values.first_article_waive_request_honored
		};
		removeValues = {
			removed_option: values.removed_option,
			removed: values.removed || true,
			flagged: values.flagged
		};
	}

	async function commentSubmitCallback(message) {
		if (message) {
			const { data, error } = await supabase
				.from('comments')
				.insert({
					message,
					user: session.user.id,
					solicitation_matched: solicitation_matched.id,
					form: null
				})
				.select('*, form(form(name)), user(name)')
				.limit(1)
				.single();

			if (data) {
				solicitation_matched.comments = [...(solicitation_matched.comments ?? []), data];
			}
		}
	}

	async function awardModalSubmitCallback(award) {
		if (award.status.includes('award:lost')) {
			await supabase
				.from('solicitations_matched')
				.update({
					status: award.status,
					company_awarded: award.company_awarded,
					date_awarded: award.date_awarded,
					price_won_at: award.price_won_at
				})
				.eq('id', solicitation_matched.id);
		} else if (award.status.includes('award:won')) {
			const { data } = await supabase
				.from('users')
				.select('firm(name)')
				.eq('id', session.user.id)
				.limit(1)
				.single();

			const company_awarded = data.firm.name;
			const price_won_at =
				solicitation_matched.unit_price * solicitation_matched.solicitation.quantity;

			await supabase
				.from('solicitations_matched')
				.update({
					status: award.status,
					company_awarded,
					price_won_at,
					date_awarded: award.date_awarded,
					first_article_waive_request_honored: award.first_article_waive_request_honored
				})
				.eq('id', solicitation_matched.id);
		} else if (award.status.includes('award:cancelled')) {
			const { data, error } = await supabase
				.from('solicitations_matched')
				.update({
					status: award.status
				})
				.eq('id', solicitation_matched.id);
		}

		awardModalOpen = false;
		window.location.reload();
	}

	async function removeModalSubmitCallback(removedValues) {
		let status = solicitation_matched.status ?? [];
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
				.eq('id', solicitation_matched.id);
		} else {
			await supabase
				.from('solicitations_matched')
				.update({
					removed_option: removedValues.removed ? removedValues.removed_option : null,
					removed: removedValues.removed,
					flagged: removedValues.flagged || false
				})
				.eq('id', solicitation_matched.id);
		}

		if (removedValues.removed && removedValues.removed_notes)
			await supabase.from('comments').insert({
				solicitation_matched: solicitation_matched.id,
				user: session.user.id,
				message: removedValues.removed_notes
			});

		removeModalOpen = false;

		if (removeValues.removed) {
			window.location.href = `${window.location.origin}/rfqs/government-bidding-funnel`;
		} else {
			window.location.reload();
		}
	}

	onMount(() => {
		if (session) {
			loadData();
		}
	});
</script>

<svelte:head>
	<title
		>{solicitation_matched
			? solicitation_matched.solicitation.id + ' Solicitation Form'
			: 'Solicitation Form'}</title
	>
</svelte:head>

<SolicitationForm
	{solicitation_matched}
	bind:values
	{nsn_matches}
	{submitCallback}
	{isSubmitting}
	{commentSubmitCallback}
	bind:awardModalOpen
	bind:removeModalOpen
/>

<RemoveModal
	bind:open={removeModalOpen}
	values={removeValues}
	submitCallback={removeModalSubmitCallback}
/>

<AwardModal
	bind:open={awardModalOpen}
	values={awardValues}
	{solicitation_matched}
	submitCallback={awardModalSubmitCallback}
/>
