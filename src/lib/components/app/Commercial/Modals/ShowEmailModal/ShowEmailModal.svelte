<script>
	// @ts-nocheck
	import Textarea from '$lib/components/form/Textarea.svelte';
	import { hasErrors } from '$lib/utils/errors';
	import { generatePDFHtml } from '$lib/pdfHelper';
	import Download from '$lib/icons/Download.svg';

	export let open;
	export let data;
	export let supabase;

	async function downloadFile(fileName) {
		const { data: file, error } = await supabase.storage
			.from('email_attachments')
			.download(data.email.id + '/' + fileName);

		if (error) {
			console.error('Error downloading file:', error);
			return;
		}

		const url = URL.createObjectURL(file);
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', fileName);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	function filterAttachments(attachments) {
		return attachments.filter(
			(a) => !['image/png', 'image/jpg', 'image/jpeg'].some((e) => a.metadata.mimetype == e)
		);
	}

	function formatEmailText(email) {
		let content = '';

		if (email.html && email.html != 'false') {
			content = email.html;
		} else if (email.text_as_html) {
			content = email.text_as_html;
		} else {
			content = email.text;
		}

		return content;
	}

	$: console.log(data);
</script>

{#if open}
	<div
		class="overflow-x-hidden overflow-y-hidden fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
	>
		<div class="relative w-3/4 h-2/3 overflow-y-auto">
			<div
				class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
			>
				<div class="flex items-start justify-between pt-5 px-5 rounded-t">
					<h3 class="text-3xl text-gray-600 font-semibold">Customer Email</h3>
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
				<div class="p-4">
					{#if data?.email}
						<p class="mb-5 font-bold">Subject: {data.email.subject}</p>
						<p class="text-sm">
							{@html formatEmailText(data.email)}
						</p>
						{#if filterAttachments(data.email.attachments)?.length > 0}
							<p class="font-medium">Download files from email:</p>
							<ul>
								{#each filterAttachments(data.email.attachments) as attachment}
									<li>
										<button
											class="bg-neutral-100 p-2 rounded-md"
											on:click={() => downloadFile(attachment.name)}
										>
											<div class="flex flex-row justify-center items-center space-x-2">
												<p>
													{attachment.name}
												</p>
												<img src={Download} alt="download" class="w-4 h-4" />
											</div>
										</button>
									</li>
								{/each}
							</ul>
						{/if}
					{/if}
				</div>
			</div>
		</div>
	</div>
	<div class="opacity-25 fixed inset-0 z-40 bg-black"></div>
{/if}
