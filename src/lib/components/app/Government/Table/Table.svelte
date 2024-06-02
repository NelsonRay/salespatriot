<script>
	// @ts-nocheck
	import { tableFieldMapper } from '$lib/mappers';
	import {
		getMatchingClass,
		getPartnerColor,
		getSetAsideColor,
		getBidPartners,
		getStatusColor,
		getStatusName,
		calculateDaysDifference
	} from '$lib/helpers.js';
	import Open from '$lib/icons/Open.svg';
	import { page } from '$app/stores';

	export let data;
	export let columns;
	export let blockEditing = false;
	export let openNewTab = false;

	function getPartnerName(id) {
		const partners = getBidPartners();

		const partnerById = partners.filter((p) => p.id === id);

		if (partnerById.length > 0) {
			return partnerById[0].name;
		} else {
			return 'Error';
		}
	}

	function getFieldClass(obj, column) {
		if (
			column?.type === 'expires_on' &&
			calculateDaysDifference(obj?.solicitation?.expires_on) <= 2 &&
			$page.url.pathname.includes('bidding-funnel')
		) {
			return 'text-red-400';
		}
		return '';
	}
</script>

<article class="bg-white w-[100%] h-full scrollbar-gutter-stable" style="direction: ltr;">
	<table class="text-left w-[100%] border-separate border-spacing-0 text-xs">
		<thead class="h-[32px] sticky bg-white" style="inset-block-start: 0;">
			{#each columns as column}
				<th class={column.type === 'position' ? 'text-center' : ''}
					>{tableFieldMapper(undefined, column).header}</th
				>
			{/each}
		</thead>
		<tbody>
			{#each data as obj, index (obj.id)}
				<tr class={!blockEditing ? 'hover:bg-neutral-100' : ''}>
					{#each columns as column}
						{#if column.type === 'position'}
							<td class="text-center"> {index + 1}</td>
						{:else if column.type === 'status'}
							<td>
								<div
									class="p-2 rounded-md inline-block {getStatusColor(
										tableFieldMapper(obj, column).value
									) ?? ''}"
								>
									{getStatusName(tableFieldMapper(obj, column).value) ?? ''}
								</div>
							</td>
						{:else if column.type === 'matching_rule'}
							<td>
								{#if tableFieldMapper(obj, column).value}
									<div
										class="p-2 rounded-md inline-block {getMatchingClass(
											tableFieldMapper(obj, column).value
										)}"
									>
										{tableFieldMapper(obj, column).value ?? ''}
									</div>
								{/if}
							</td>
						{:else if column.type === 'bid_partners'}
							<td>
								<div class="flex flex-row space-x-1">
									{#each tableFieldMapper(obj, column).value ?? [] as partner}
										<div
											class="p-2 rounded-md inline-block {getPartnerColor(getPartnerName(partner))}"
										>
											{getPartnerName(partner)}
										</div>
									{/each}
								</div>
							</td>
						{:else if column.type === 'set_aside'}
							<td>
								{#if tableFieldMapper(obj, column).value}
									<div
										class="p-2 rounded-md inline-block {getSetAsideColor(
											tableFieldMapper(obj, column).value
										)}"
									>
										{tableFieldMapper(obj, column).value ?? ''}
									</div>
								{/if}
							</td>
						{:else if column.type === 'link'}
							<td>
								{#if tableFieldMapper(obj, column).value}
									<a
										href={tableFieldMapper(obj, column).value}
										target="_blank"
										class="mb-5 text-blue-500">URL</a
									>
								{/if}
							</td>
						{:else if column.field === 'solicitation.id'}
							<td>
								{#if !blockEditing}
									<a href={`/solicitation/${obj?.id}`} target={openNewTab ? '_blank' : '_self'}>
										<div class="flex flex-row justify-between pr-1 items-center">
											{tableFieldMapper(obj, column).value ?? ''}
											<img src={Open} alt="open" class="h-3 w-3" />
										</div>
									</a>
								{:else}
									{tableFieldMapper(obj, column).value ?? ''}
								{/if}
							</td>
						{:else}
							<td>
								<p class={getFieldClass(obj, column)}>
									{tableFieldMapper(obj, column).value ?? ''}
								</p>
							</td>
						{/if}
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</article>

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
