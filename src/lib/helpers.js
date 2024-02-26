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
