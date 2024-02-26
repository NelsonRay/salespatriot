<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import SolicitationForm from '$lib/components/app/Government/SolicitationForm/SolicitationForm.svelte';

	export let data;
	$: ({ supabase, session } = data);

	let solicitation_matched = null;
	let nsn_matches = null;

	let values = {};

	let isSubmitting = false;

	async function handleSubmit() {
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
			.select('*, solicitation!inner(*, nsn(id, matching_nsns(*))), matching_rule(*)')
			.eq('id', $page.params.slug)
			.limit(1)
			.single();

		let { data: n_data, error: n_error } = await supabase
			.from('solicitations_matched')
			.select('*, solicitation!inner(*, nsn(id, matching_nsns(*))), matching_rule(*)')
			.eq('solicitation.nsn', data.solicitation.nsn.id)
			.not('solicitation.number', 'eq', data.solicitation.number);

		nsn_matches = n_data.sort((a, b) =>
			new Date(a.solicitation.expires_on) > new Date(b.solicitation.expires_on) ? -1 : 1
		);
		solicitation_matched = data;

		const { solicitation, matching_rule, ...rest } = data;
		values = rest;
	}

	onMount(() => {
		if (session) {
			loadData();
		}
	});
</script>

<SolicitationForm {solicitation_matched} {values} {nsn_matches} {handleSubmit} {isSubmitting} />
