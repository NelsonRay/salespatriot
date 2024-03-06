<script>
	// @ts-nocheck
	import { formatDate } from '$lib/helpers';

	export let data;
	data = data?.sort((a, b) => a?.form?.step - b?.form?.step);
</script>

{#if data && data?.length > 0}
	<article
		class="bg-white w-[100%] overflow-scroll scrollbar-gutter-stable"
		style="direction: ltr;"
	>
		<table class="text-left w-[100%] border-separate border-spacing-0 overflow-scroll">
			<thead class="h-[32px] sticky bg-white" style="inset-block-start: 0;">
				{#each ['Form', 'Submitted', 'Submitted At', 'Submitted By', 'Sent', 'Deleted'] as header}
					<th class="text-sm">{header}</th>
				{/each}
			</thead>
			<tbody>
				{#each data as form}
					<tr class="text-sm">
						<td>{form.form.name}</td>
						<td>{form.submitted ? 'Yes' : 'No'}</td>
						<td>{form.submitted_timestamp ? formatDate(new Date(form.submitted_timestamp)) : ''}</td
						>
						<td>{form.submitted_by?.name ?? ''}</td>
						<td>{formatDate(new Date(form.created_at))}</td>
						<td>{form.deleted ? 'Yes' : 'No'}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</article>
{:else}
	<p class="text-gray-400">No Forms Sent</p>
{/if}

<style>
	th {
		border-bottom: 1px solid #e0e0e0;
		border-top: 1px solid #e0e0e0;
		white-space: nowrap;
		border: 0.2px solid gainsboro;
		padding: 4px;
	}

	td {
		border: 0.2px solid gainsboro;
		white-space: nowrap;
		padding: 4px;
	}
</style>
