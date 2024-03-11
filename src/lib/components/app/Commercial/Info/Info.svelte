<script>
	// @ts-nocheck

	export let data;
</script>

<div class="space-y-2">
	<div class="mb-3">
		<div class="flex flex-row items-center space-x-2">
			<p class="text-lg font-semibold">{data?.customer?.name + ' / ' + data?.date_received}</p>
		</div>
	</div>

	<div>
		<div class="flex flex-row space-x-1">
			<p class="text-gray-400">Customer Name:</p>
			<p>
				{data?.customer?.name}
			</p>
		</div>

		<div class="flex flex-row space-x-1">
			<p class="text-gray-400">Customer Email:</p>
			<p>
				{data?.customer?.email_address}
			</p>
		</div>

		<div class="flex flex-row space-x-1">
			<p class="text-gray-400">Customer #:</p>
			<p>
				{data?.customer?.customer_number ?? 'N/A'}
			</p>
		</div>
	</div>

	<div>
		<div class="flex flex-row space-x-1">
			<p class="text-gray-400">Date Received:</p>
			<p>
				{data?.date_received}
			</p>
		</div>

		<div class="flex flex-row space-x-1">
			<p class="text-gray-400">Requested Return Date:</p>
			<p>
				{data?.requested_return_date ?? 'N/A'}
			</p>
		</div>
	</div>
</div>
