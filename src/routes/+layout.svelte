<script>
	import '../app.postcss';
	import { initializeApp } from 'firebase/app';
	import { getMessaging, getToken } from 'firebase/messaging';
	import { onMount } from 'svelte';

	const firebaseConfig = {
		apiKey: 'AIzaSyC6zbaT6KMq2qpiA2X0JBKLVq7eLCbP2Dc',
		authDomain: 'sales-patriot.firebaseapp.com',
		projectId: 'sales-patriot',
		storageBucket: 'sales-patriot.appspot.com',
		messagingSenderId: '882639995466',
		appId: '1:882639995466:web:1645f546b86fe496325cb3'
	};

	onMount(() => {
		// Initialize Firebase
		const app = initializeApp(firebaseConfig);
		const messaging = getMessaging(app);

		Notification.requestPermission().then((permission) => {
			if (permission === 'granted') {
				console.log('Notification permission granted.');
				getToken(messaging, {
					vapidKey:
						'BAk_1AoMZvNHprzPdI9rHs6cFrx82cvn9E5lgEmpOw8eTcfbYl-HnqOLDqUk2A7H9XBOPhY56NDR6td-MRBYbGA'
				})
					.then((currentToken) => {
						if (currentToken) {
							console.log('t:', currentToken);
							// Send the token to your server and update the UI if necessary
							// ...
						} else {
							// Show permission request UI
							console.log('No registration token available. Request permission to generate one.');
							// ...
						}
					})
					.catch((err) => {
						console.log('An error occurred while retrieving token. ', err);
						// ...
					});
			}
		});
	});
</script>

<slot />
