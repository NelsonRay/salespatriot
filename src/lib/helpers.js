// @ts-ignore
export function formatDate(date) {
	const year = date.getFullYear();
	const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
	const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();

	return `${year}-${month}-${day}`;
}

// @ts-ignore
export function formatCurrency(number) {
	if (!number) return '';
	return '$' + number.toLocaleString('en-US', { minimumFractionDigits: 2 });
}

// @ts-ignore
export function capitalizeFirstLetter(sentence) {
	// @ts-ignore
	return sentence.replace(/\b\w/g, function (char) {
		return char.toUpperCase();
	});
}

// @ts-ignore
export function getMatchingClass(name) {
	let mClass = '';

	switch (name) {
		case 'ELC - 5A910':
			mClass = 'bg-green-500';
			break;
		case 'Various Cage Codes':
			mClass = 'bg-yellow-200';
			break;
		case '6250':
		case '6220':
		case '5995':
			mClass = 'bg-green-300';
			break;
		case 'Monitored NSN':
			mClass = 'bg-green-400';
			break;
		default:
			mClass = 'bg-gray-200';
			break;
	}

	return mClass;
}

// @ts-ignore
export function getSetAsideColor(setAside) {
	let cClass = '';

	switch (setAside) {
		case 'HUB Zone':
			cClass = 'bg-yellow-300';
			break;
		case 'Small Business':
			cClass = 'bg-blue-300';
			break;
		case 'Women Owned':
			cClass = 'bg-pink-300';
			break;
		case 'Veteran Owned':
			cClass = 'bg-purple-300';
			break;
		case '8A':
			cClass = 'bg-orange-300';
			break;
		default:
			cClass = 'bg-red-300';
			break;
	}

	return cClass;
}

export function getBidPartners() {
	return [
		{ id: '66ebce9c-66db-45cf-a91e-1425a45b47b2', name: 'ADG Bid Direct' },
		{ id: '0a47172d-8394-4f28-a4be-1606aa395380', name: 'QPI' },
		{ id: '297ca905-a9dd-48f5-9af3-306547997320', name: 'Janels' },
		{ id: '1c3ea0f7-a624-44b7-91fd-3efc82e982a8', name: 'Fortum Genus' },
		{ id: '36d12554-f91f-4e16-a2e1-018d15552a54', name: 'DTI' }
	];
}
