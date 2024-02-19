<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import SolicitationForm from '$lib/components/app/SolicitationForm/SolicitationForm.svelte';

	const submitted = $page.data.submitted;

	let values = { status: $page.data.solicitation_matched.status };

	async function handleSubmit() {
		const res = await fetch('/api/gov/form/submit', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ response: values, id: $page.data.id })
		});

		if (res.status === 200) {
			window.location.reload();
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
	/>
{:else}
	<p class="mt-12">Thank you for submitting form!</p>
{/if}
