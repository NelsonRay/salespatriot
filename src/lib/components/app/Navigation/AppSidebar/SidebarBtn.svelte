<script>
	import { page } from '$app/stores';

	export let text;
	export let href;
</script>

<a
	class="py-[1px] px-2 rounded-lg {$page.url.toString().includes(href)
		? 'bg-neutral-200'
		: 'hover:bg-neutral-100'}"
	{href}>{text}</a
>
