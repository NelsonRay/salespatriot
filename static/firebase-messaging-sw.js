// @ts-nocheck

// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/<v9+>/firebase-app-compat.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/<v9+>/firebase-messaging-compat.js');

const firebaseConfig = {
	apiKey: 'AIzaSyC6zbaT6KMq2qpiA2X0JBKLVq7eLCbP2Dc',
	authDomain: 'sales-patriot.firebaseapp.com',
	projectId: 'sales-patriot',
	storageBucket: 'sales-patriot.appspot.com',
	messagingSenderId: '882639995466',
	appId: '1:882639995466:web:1645f546b86fe496325cb3'
};

// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);

// eslint-disable-next-line no-undef
const isSupported = firebase.messaging.isSupported();
if (isSupported) {
	// eslint-disable-next-line no-undef
	const messaging = firebase.messaging();
	messaging.onBackgroundMessage(({ notification: { title, body } }) => {
		self.registration.showNotification(title, {
			body
			// icon: image || '/assets/icons/icon-72x72.png'
		});
	});
}
