<script>
	import { page } from '$app/stores';

	export let text;
	export let href;
</script>

<a
	class="px-2 py-2 rounded-lg font-semibold pr-10 {$page.url.toString().includes(href)
		? 'bg-neutral-100 shadow-md'
		: 'bg-white shadow-sm'}"
	{href}>{text}</a
>
