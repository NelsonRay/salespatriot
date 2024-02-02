<script>
	// @ts-nocheck

	import '../app.postcss';

	// Import the onMount function from Svelte
	import { onMount } from 'svelte';

	// Function to load OneSignal script
	function loadOneSignalScript() {
		const script = document.createElement('script');
		script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
		script.defer = true;

		// Append the script to the document head
		document.head.appendChild(script);

		// Initialize OneSignal when the script is loaded
		script.onload = () => {
			window.OneSignalDeferred = window.OneSignalDeferred || [];
			window.OneSignalDeferred.push(function (OneSignal) {
				OneSignal.init({
					appId: '58a83d45-05f1-438a-878e-9e5830a4e90d',
					safari_web_id: 'web.onesignal.auto.5ccade99-0f35-4775-9ae0-5e2c3bfd110b',
					notifyButton: {
						enable: false
					}
				});

				OneSignal.push(function () {
					OneSignal.login('8d13fcfc-0c0e-45be-8c6b-7803fa8cb2e4');
				});
			});
		};
	}

	// Call the function when the component is mounted
	onMount(() => {
		loadOneSignalScript();
		Notification.requestPermission();
	});
</script>

<slot />
