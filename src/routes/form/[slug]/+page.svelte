<script>
	// @ts-nocheck
	import { page } from '$app/stores';
	import { gov_mapper } from '$lib/mappers';

	const submitted = $page.data.form.submitted;

	let values = {};

	let openDropdowns = {};

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

	function handleDropdownClick(field) {
		openDropdowns[field] = !(openDropdowns[field] ?? false);
	}

	function filterTags(type) {
		let tags = $page.data.tags.filter((t) => t.type === type);

		tags.sort((a, b) => (a.level > b.level ? 1 : -1));
		return tags;
	}

	function getSelectedTagName(id) {
		if (!id) return undefined;
		return $page.data.tags.filter((t) => t.id === id)[0].name;
	}

	function getSelectedTagColor(id) {
		if (!id) return undefined;
		return $page.data.tags.filter((t) => t.id === id)[0].color;
	}

	function getTagClass(color) {
		switch (color) {
			case 'green':
				return 'bg-green-400';
			case 'blue':
				return 'bg-blue-400';
			case 'red':
				return 'bg-red-400';
			default:
				return '';
		}
	}

	const handleDropdownFocusLoss = ({ relatedTarget, currentTarget }) => {
		// // use "focusout" event to ensure that we can close the dropdown when clicking outside or when we leave the dropdown with the "Tab" button
		if (relatedTarget instanceof HTMLElement && currentTarget.contains(relatedTarget)) return; // check if the new focus target doesn't present in the dropdown tree (exclude ul\li padding area because relatedTarget, in this case, will be null)
		openDropdowns = {};
	};
</script>

<div class="flex w-screen justify-center overflow-y-scroll">
	<div class="flex flex-col p-6">
		{#if !submitted}
			<h1 class="text-3xl mb-8 mt-8">{$page.data.form.name}</h1>
			<p class="text-lg text-center font-semibold mb-3">Solicitation Info</p>
			<div class="grid grid-cols-4 gap-5 px-2 mb-10">
				{#each $page.data.form.solicitation_fields as field}
					<div>
						<p class="text-xs">{gov_mapper(field)}</p>
						{#if !['solicitation_url', 'tech_docs'].includes(field)}
							<p class="text-sm">
								{$page.data.solicitation_matched.solicitation[field] ?? 'N/A'}
							</p>
						{:else}
							<a
								href={$page.data.solicitation_matched.solicitation[field]}
								class="text-sm text-blue-500"
								target="_blank"
							>
								{$page.data.solicitation_matched.solicitation[field] ? 'URL' : 'N/A'}
							</a>
						{/if}
					</div>
				{/each}
			</div>

			{#each $page.data.form.matched_fields as field}
				<p class="mb-1">{gov_mapper(field.field)}</p>
				{#if field.type === 'select'}
					<div class="dropdown mb-5" on:focusout={handleDropdownFocusLoss}>
						<button
							class="btn m-1 {values[field.field]
								? getTagClass(getSelectedTagColor(values?.opportunity_status))
								: 'bg-base-100'}"
							on:click={() => handleDropdownClick(field.field)}
						>
							{getSelectedTagName(values?.opportunity_status) ?? 'Select'}
						</button>
						<ul
							class="dropdown-content z-[10] menu p-2 shadow bg-base-100 rounded-box w-52"
							style:visibility={openDropdowns[field.field] ? 'visible' : 'hidden'}
						>
							{#each filterTags(field.field) as tag (tag.id)}
								<li>
									<button
										on:click={() => {
											values[field.field] = tag.id;
											handleDropdownClick(field.field);
										}}
										class={getTagClass(tag.color) + ' mb-1'}
									>
										{tag.name}
									</button>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
				{#if field.type === 'currency'}
					<input type="number" class="w-52 rounded-md mb-5" bind:value={values[field.field]} />
				{/if}
				{#if field.type === 'textarea'}
					<textarea
						class="flex min-h-16 overflow-y-auto border rounded-md"
						bind:value={values[field.field]}
					/>
				{/if}
			{/each}

			<div class="flex flex-row mt-2 text-lg font-medium">
				<button class="btn px-2 rounded-md -ml-2 mt-3" on:click={handleSubmit}>Submit</button>
			</div>
		{:else}
			<p class="mt-12">Thank you for submitting form!</p>
		{/if}
	</div>
</div>
