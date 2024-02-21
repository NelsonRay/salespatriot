<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { getMatchingClass } from '$lib/helpers.js';

	export let data;

	$: ({ supabase, session } = data);

	let workflows;
	let showSubmitted = {};

	async function loadData() {
		const { data, error } = await supabase
			.from('forms')
			.select(
				'id, submitted, response_timestamp, form, solicitation_matched(solicitation(number, description, quantity, quantity_units, expires_on), familiarity_status, matching_rule(name)), created_at'
			);

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

	function getForms(workflows, form) {
		let forms = workflows.forms.filter((e) => e.form === form.id && !e.submitted);

		return [
			...forms.filter((e) => e.solicitation_matched.familiarity_status === 'Prev Won'),
			...forms.filter((e) => e.solicitation_matched.familiarity_status === 'Prev Bid'),
			...forms.filter((e) => e.solicitation_matched.familiarity_status === 'Seen'),
			...forms.filter((e) => e.solicitation_matched.familiarity_status === 'New')
		];
	}

	function getFamiliarityClass(status) {
		let pClass = '';
		switch (status) {
			case 'Prev Won':
				pClass = 'bg-green-600';
				break;
			case 'Prev Bid':
				pClass = 'bg-green-500';
				break;
			case 'Seen':
				pClass = 'bg-blue-300';
				break;
			case 'New':
				pClass = 'bg-green-300';
				break;
		}

		return pClass;
	}
</script>

{#if workflows}
	<article
		class="bg-neutral-50 w-[100%] h-[100%] p-5 overflow-y-auto overflow-x-auto border-l-[0.2px] border-l-gainsboro flex flex-row overflow-auto space-x-5"
		style="direction: ltr;"
	>
		{#each workflows.form.sort((a, b) => (a.step > b.step ? 1 : -1)) as form (form.id)}
			<div class="flex flex-col">
				<div class="flex flex-row justify-between w-96 items-center">
					<p class="font-semibold text-base">
						{`${form.name} (${workflows.forms.filter((e) => e.form === form.id && !e.submitted).length})`}
					</p>
					<p class="font-medium text-base">{form.user.name}</p>
				</div>
				{#each getForms(workflows, form) as forms (forms.id)}
					<a href={window.location.origin + '/form/' + forms.id} target="_blank">
						<div class="relative flex flex-col shadow-md mt-3 rounded-md bg-white p-2 text-xs">
							<div class="flex flex-row justify-between items-center">
								<p class="font-semibold text-sm">
									{forms.solicitation_matched.solicitation.number}
								</p>
								<div class="flex flex-row items-center space-x-1">
									{#if forms.solicitation_matched?.matching_rule?.name}
										<div
											class="px-2 py-1 rounded-md {getMatchingClass(
												forms.solicitation_matched?.matching_rule?.name
											)}"
										>
											<p>{forms.solicitation_matched?.matching_rule?.name}</p>
										</div>
									{/if}
									<div
										class="px-2 py-1 rounded-md {getFamiliarityClass(
											forms.solicitation_matched.familiarity_status
										)}"
									>
										<p>
											{forms.solicitation_matched.familiarity_status}
										</p>
									</div>
								</div>
							</div>
							<p class="mt-2">{forms.solicitation_matched.solicitation.description}</p>
							<p>
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
