<script>
	// @ts-nocheck
	import { onMount } from 'svelte';

	export let data;

	$: ({ supabase, session } = data);

	let workflows;
	let showSubmitted = {};

	async function loadData() {
		const { data, error } = await supabase
			.from('forms')
			.select(
				'id, submitted, response_timestamp, form, solicitation_matched(solicitation(number, description, quantity, quantity_units, expires_on)), created_at'
			);

		console.log(data, error);
		const { data: f_data, error: f_error } = await supabase
			.from('form')
			.select('id, name, user(name), step');
		workflows = {};
		workflows.forms = data;
		workflows.form = f_data.sort((a, b) => (a.step > b.step ? 1 : -1));
	}

	onMount(() => {
		if (session) {
			loadData();
		}
	});

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
</script>

{#if workflows}
	<article
		class="bg-neutral-50 w-[100%] h-[100%] p-5 overflow-y-auto overflow-x-auto border-l-[0.2px] border-l-gainsboro flex flex-row overflow-auto space-x-5"
		style="direction: ltr;"
	>
		{#each workflows.form.sort((a, b) => (a.step > b.step ? 1 : -1)) as form (form.id)}
			<div class="flex flex-col space-y-3">
				<div class="flex flex-row justify-between w-96">
					<p class="font-semibold text-lg">
						{`${form.name} (${workflows.forms.filter((e) => e.form === form.id && !e.submitted).length})`}
					</p>
					<p class="font-medium text-base">{form.user.name}</p>
				</div>
				{#each workflows.forms.filter((e) => e.form === form.id && !e.submitted) as forms (forms.id)}
					<a href={window.location.origin + '/form/' + forms.id} target="_blank">
						<div class="flex flex-col shadow-md mt-3 rounded-md bg-white p-2">
							<p class="font-semibold text-[16px]">
								{forms.solicitation_matched.solicitation.number}
							</p>
							<p>{forms.solicitation_matched.solicitation.description}</p>
							<p class="text-sm">
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
	</article>
{:else}
	<div class="flex flex-col gap-4 p-5">
		<div class="skeleton h-8 w-full"></div>
		<div class="skeleton h-4 w-full"></div>
		<div class="skeleton h-4 w-full"></div>
	</div>
{/if}
