<script>
	// @ts-nocheck
	import { formatDateWithTime } from '$lib/helpers';
	import Send from '$lib/icons/Send.svg';

	export let comments;
	comments = comments?.sort((b, a) => new Date(a.created_at) - new Date(b.created_at));
	export let commentSubmitCallback;

	let message = '';
	let isLoading = false;

	async function handleSubmit() {
		if (message?.length > 0 && !isLoading) {
			isLoading = true;
			await commentSubmitCallback(message);
			isLoading = false;
			message = '';
			addComment = false;
		}
	}

	function handleKeyPress(event) {
		if (event.key === 'Enter') {
			handleSubmit();
		}
	}

	let addComment = false;
</script>

{#if comments?.length > 0}
	<div class="space-y-2">
		{#each comments as comment (comment.id)}
			<div class="flex flex-col bg-neutral-50 rounded-md p-2 mr-4">
				<div class="flex flex-row items-end space-x-2">
					<p class="text-base font-medium">
						{comment.user.name}
					</p>
					<div class="flex flex-row">
						<p class="text-xs mb-[2px] text-gray-300">
							{formatDateWithTime(comment.created_at) +
								(comment.form?.form?.name ? ' · ' + comment.form?.form?.name : '') +
								(comment?.rfq
									? ' · ' + comment.rfq?.customer?.name + ' / ' + comment.rfq?.received_at
									: '') +
								(comment?.product ? ' · ' + comment.product?.number : '')}
						</p>
					</div>
				</div>
				<p>{comment.message}</p>
			</div>
		{/each}
	</div>
{/if}

{#if addComment}
	<div class="flex flex-row space-x-2 mr-4 {comments?.length > 0 ? 'mt-3' : ''}">
		<input class="w-full rounded-md border p-1" bind:value={message} on:keypress={handleKeyPress} />
		<button
			class="h-9 w-9 bg-neutral-100 rounded-md flex justify-center items-center"
			on:click={handleSubmit}
		>
			{#if !isLoading}
				<img src={Send} alt="send" class="h-5 w-5" />
			{:else}
				<span class="loading loading-spinner loading-sm"></span>
			{/if}
		</button>
	</div>
{:else}
	<button
		class="bg-neutral-100 rounded-md py-1 px-2 text-sm {comments?.length > 0 ? 'mt-3' : ''}"
		on:click={() => (addComment = !addComment)}>Add Comment</button
	>
{/if}
