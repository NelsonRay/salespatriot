<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import SolicitationForm from '$lib/components/app/SolicitationForm/SolicitationForm.svelte';

	const submitted = $page.data.submitted;

	let isSubmitting = false;

	let values = { status: $page.data.solicitation_matched.status };

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

	$: if ($page.data.form.type === 'opportunity') {
		if (!values.status.includes('opportunity:pursue')) {
			delete values.skip_engineering;
			values.status = values.status.filter((e) => !e.toString().includes('engineering'));
		}
		if (!values.skip_engineering) {
			values.status = values.status.filter((e) => !e.toString().includes('engineering'));
		}
	}
</script>

{#if !submitted}
	<SolicitationForm
		solicitation_matched={$page.data.solicitation_matched}
		bind:values
		form={$page.data.form}
		nsn_matches={null}
		{handleSubmit}
		bind:isSubmitting
	/>
{:else}
	<p class="mt-12">Thank you for submitting form!</p>
{/if}
