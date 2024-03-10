<script>
	// @ts-nocheck
	import Boolean from '$lib/components/form/Boolean.svelte';
	import RemoveOptionSelect from '$lib/components/form/RemoveOptionSelect.svelte';
	import Textarea from '$lib/components/form/Textarea.svelte';
	import { removeModalValidation } from '$lib/validation';

	export let open;
	export let submitCallback;

	export let values;

	let errors;
	let isLoading = false;

	async function handleSubmit() {
		const results = removeModalValidation?.safeParse(values);
		errors = results?.error?.flatten()?.fieldErrors;

		if (!errors) {
			isLoading = true;
			await submitCallback(values);
		}
	}

	$: if (values.removed != null && !values.removed) {
		values.removed_option = null;
		values.removed_notes = null;
		values.flagged = null;
	}
</script>

{#if open}
	<div
		class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
	>
		<div class="relative w-1/3 my-6 mx-auto max-w-3xl">
			<!--content-->
			<div
				class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
			>
				<!--header-->
				<div class="flex items-start justify-between p-5 rounded-t">
					<h3 class="text-3xl text-gray-600 font-semibold">Remove</h3>
					<button
						class="p-1 ml-auto bg-transparent border-0 text-gray-500 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
						on:click={() => (open = false)}
					>
						<span
							class="bg-transparent text-gray-500 opacity-4 h-6 w-6 text-2xl block outline-none focus:outline-none"
						>
							×
						</span>
					</button>
				</div>
				<div class="flex flex-col items-center space-y-3">
					<div>
						<p class="mb-1 text-sm">Remove:</p>
						<Boolean bind:value={values.removed} />
					</div>
					{#if values.removed}
						<div>
							<p class="mb-1 text-sm">Reason:</p>
							<RemoveOptionSelect bind:value={values.removed_option} />
							{#if errors?.removed_option}
								<label for="trim" class="label">
									<span class="label-text-alt text-error">{errors?.removed_option[0]}</span>
								</label>
							{/if}
						</div>
						<div>
							<p class="mb-1 text-sm">Flag for later review:</p>
							<Boolean bind:value={values.flagged} />
						</div>
						<div>
							<p class="mb-1 text-sm">Add Comment:</p>
							<Textarea bind:value={values.removed_notes} autoCollapse={false} />
							{#if errors?.removed_notes}
								<label for="trim" class="label">
									<span class="label-text-alt text-error">{errors?.removed_notes[0]}</span>
								</label>
							{/if}
						</div>
					{/if}
				</div>
				<div class="flex items-center justify-center p-6">
					{#if !isLoading}
						<button
							class="btn px-6 py-2 rounded-md text-xs bg-white shadow-md"
							on:click={handleSubmit}
							>Submit
						</button>
					{:else}
						<span class="loading loading-spinner loading-md"></span>
					{/if}
				</div>
			</div>
		</div>
	</div>
	<div class="opacity-25 fixed inset-0 z-40 bg-black"></div>
{/if}
