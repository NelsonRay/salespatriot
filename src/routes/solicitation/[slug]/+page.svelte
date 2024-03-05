<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import SolicitationForm from '$lib/components/app/Government/SolicitationForm/SolicitationForm.svelte';
	import { solColumns } from '$lib/helpers.js';

	export let data;
	$: ({ supabase, session } = data);

	let solicitation_matched = null;
	let nsn_matches = null;

	let values = {};

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
				`*, solicitation!inner(${solColumns}, nsn(id, matching_nsns(*))), matching_rule(*), forms(*, form(*), submitted_by(*))`
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

		const { solicitation, matching_rule, forms, ...rest } = data;
		values = rest;
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
			? solicitation_matched.solicitation.number + ' Solicitation Form'
			: 'Solicitation Form'}</title
	>
</svelte:head>

<SolicitationForm {solicitation_matched} {values} {nsn_matches} {submitCallback} {isSubmitting} />
