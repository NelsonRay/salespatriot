<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import SolicitationForm from '$lib/components/app/SolicitationForm/SolicitationForm.svelte';

	export let data;
	$: ({ supabase, session } = data);

	let form = null;
	let nsn_matches = null;

	let values = {};

	let isSubmitting = false;

	async function loadData() {
		const { data, error: err } = await supabase
			.from('forms')
			.select(
				'*, form!inner(*), solicitation_matched!inner(*, solicitation!inner(*, nsn(id, matching_nsns(*)), expires_on), matching_rule(*))'
			)
			.eq('id', parseInt($page.params.slug))
			.limit(1)
			.single();

		if (data.form.type === 'opportunity') {
			const { data: n_data, error: n_error } = await supabase
				.from('solicitations_matched')
				.select('*, solicitation!inner(*, nsn(id, matching_nsns(*)), expires_on), matching_rule(*)')
				.eq('solicitation.nsn', data.solicitation_matched.solicitation.nsn.id)
				.not('solicitation.number', 'eq', data.solicitation_matched.solicitation.number);

			nsn_matches = n_data;
		}
		form = data;

		const { solicitation, matching_rule, ...rest } = data;
		values = rest;
	}

	onMount(() => {
		if (session) {
			loadData();
		}
	});

	async function handleSubmit() {
		isSubmitting = true; // show loading spinner
		const res = await fetch('/api/solicitations/form-submission', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ values, id: $page.data.id })
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
</script>

{#if !form?.submitted}
	<SolicitationForm
		solicitation_matched={form?.solicitation_matched}
		bind:values
		form={form?.form}
		bind:nsn_matches
		{handleSubmit}
		bind:isSubmitting
	/>
{:else}
	<p class="mt-12">Thank you for submitting form!</p>
{/if}
