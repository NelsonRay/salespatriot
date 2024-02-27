<script>
	// @ts-nocheck
	import { AppBar } from '@skeletonlabs/skeleton';
	import FeedbackIcon from '$lib/icons/FeedbackIcon.svg';

	export let handleFeedbackSubmit;

	let message = '';
	let submitted = false;
	let reset = false;

	async function handleSubmit() {
		if (submitted) return;

		submitted = true;
		setTimeout(() => {
			submitted = false;
			reset = true;
			message = '';
			setTimeout(() => (reset = false), 1000);
		}, 2000);
		handleFeedbackSubmit(message);
	}
</script>

<AppBar>
	<svelte:fragment slot="lead">
		<p class="font-bold text-xl">Sales Patriot</p>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<div class="dropdown dropdown-bottom dropdown-end dropdown-hover">
			<button>
				<div
					class="flex flex-row items-center capitalize space-x-2 border-2 py-1 px-2 rounded-lg border-gray-100 hover:bg-gray-50"
				>
					<img src={FeedbackIcon} alt="2" />
					<span class="text-gray-500 text-sm"> Feedback </span>
				</div>
			</button>
			<div class="dropdown-content relative z-10 menu p-4 shadow bg-base-100 rounded-box w-96">
				{#if !reset}
					<textarea
						name="feedback"
						bind:value={message}
						class="border border-blue-400 rounded-md text-sm py-1 px-2 min-h-32"
						placeholder="Ideas on how to improve this app."
					/>
					<button class="btn mt-2 text-sm" on:click={handleSubmit}
						>{submitted ? 'Thank you for the feedback!' : 'Submit'}</button
					>
				{:else}
					<div />
				{/if}
			</div>
		</div>
	</svelte:fragment>
</AppBar>
