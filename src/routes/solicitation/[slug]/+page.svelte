<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import SolicitationForm from '$lib/components/app/Government/SolicitationForm/SolicitationForm.svelte';
	import AwardModal from '$lib/components/app/Government/Modals/AwardModal/AwardModal.svelte';

	export let data;
	$: ({ supabase, session } = data);

	let solicitation_matched = null;
	let nsn_matches = null;
	let awardModalOpen = false;

	let values = {};
	let awardValues = {};

	let isSubmitting = false;

	async function submitCallback() {
		isSubmitting = true; // show loading spinner
		const res = await fetch('/api/solicitations/update', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ values, id: solicitation_matched.id, oldValues: solicitation_matched })
		});

		if (res.status === 200) {
			window.location.href = `${window.location.origin}`;
		} else {
			isSubmitting = false; // hide loading spinner
		}
	}

	async function loadData() {
		let { data, error } = await supabase
			.from('solicitations_matched')
			.select(
				`*, solicitation!inner(*, nsn(id, matching_nsns(*))), matching_rule(*), forms(*, form(*), submitted_by(*)), solicitations_matched_comments(*, user(name), form(form(name)))`
			)
			.eq('id', $page.params.slug)
			.limit(1)
			.single();

		let { data: n_data, error: n_error } = await supabase
			.from('solicitations_matched')
			.select('*, solicitation!inner(*, nsn(id, matching_nsns(*))), matching_rule(*)')
			.eq('solicitation.nsn', data.solicitation.nsn.id)
			.lt('solicitation.issued_on', data.solicitation.issued_on);

		nsn_matches = n_data.sort((a, b) =>
			new Date(a.solicitation.expires_on) > new Date(b.solicitation.expires_on) ? -1 : 1
		);
		solicitation_matched = data;

		const { solicitation, matching_rule, forms, solicitations_matched_comments, ...rest } = data;
		values = rest;
		awardValues = { status: values.status };
	}

	async function commentSubmitCallback(message) {
		if (message) {
			const { data, error } = await supabase
				.from('solicitations_matched_comments')
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
				solicitation_matched.solicitations_matched_comments = [
					...(solicitation_matched.solicitations_matched_comments ?? []),
					data
				];
			}
		}
	}

	async function awardModalSubmitCallback(award) {
		await supabase
			.from('solicitations_matched')
			.update({ status: award.status })
			.eq('id', solicitation_matched.id);

		if (award.status.includes('award:lost')) {
			await supabase
				.from('solicitations')
				.update({
					company_awarded: award.company_awarded,
					date_awarded: award.date_awarded,
					price_won_at: award.price_won_at
				})
				.eq('id', solicitation_matched.solicitation.id);
		}

		if (award.status.includes('award:won')) {
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
				.from('solicitations')
				.update({
					company_awarded,
					price_won_at,
					date_awarded: award.date_awarded
				})
				.eq('id', solicitation_matched.solicitation.id);
		}

		awardModalOpen = false;
		window.location.reload();
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
	{values}
	{nsn_matches}
	{submitCallback}
	{isSubmitting}
	{commentSubmitCallback}
	bind:awardModalOpen
/>

<AwardModal
	bind:open={awardModalOpen}
	values={awardValues}
	submitCallback={awardModalSubmitCallback}
/>
