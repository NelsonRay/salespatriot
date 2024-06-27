<script>
	// @ts-nocheck
	import Textarea from '$lib/components/form/Textarea.svelte';
	import { hasErrors } from '$lib/utils/errors';
	import { generatePDFHtml } from '$lib/pdfHelper';

	export let open;
	export let submitCallback;

	export let values;
	export let quote_email_text;

	let errors;
	let isLoading = false;

	async function handleSubmit() {
		isLoading = true;
		await submitCallback(values);
	}

	$: if (open)
		quote_email_text = `Good morning,

Thank you for patience as we prepared your quote. We have attached it above.
		
If you have any questions regarding this quote or any other items you'd like to quote, please feel free to reach out to sales@auroradefensegroup.com.

Best,
Sales Team @ Aurora Defense Group`;
</script>

{#if open}
	<div
		class="overflow-x-hidden overflow-y-hidden fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
	>
		<div class="relative w-3/4 h-2/3 overflow-y-auto">
			<!--content-->
			<div
				class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
			>
				<!--header-->
				<div class="flex items-start justify-between p-5 rounded-t">
					<h3 class="text-3xl text-gray-600 font-semibold">Send Quote Email</h3>
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

				<p class="font-semibold text-center">
					To: {values.email.from.value.map((v) => v.address).join(',')}, Subject: {values.email
						.subject}
				</p>

				<p class="ml-6 my-2 font-semibold">Email:</p>
				<textarea class="mx-6 border p-1 rounded-lg min-h-52" bind:value={quote_email_text} />
				<p class="ml-6 mt-4 mb-2 font-semibold">Attached PDF:</p>
				<div class="bg-white mx-6 p-3 border rounded-3xl shadow-sm">
					{@html generatePDFHtml(values)}
				</div>

				<div class="flex items-center justify-center p-6">
					{#if !isLoading}
						<button
							class="btn px-6 py-2 rounded-md text-xs bg-white shadow-md"
							on:click={handleSubmit}
							>Send
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
