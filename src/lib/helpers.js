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
export function getFamiliarityClass(status) {
	let pClass = '';
	switch (status) {
		case 'Prev Won':
			pClass = 'bg-green-600';
			break;
		case 'Prev Bid':
			pClass = 'bg-green-500';
			break;
		case 'Seen':
			pClass = 'bg-blue-300';
			break;
		case 'New':
			pClass = 'bg-green-300';
			break;
	}

	return pClass;
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
		{ id: '0a47172d-8394-4f28-a4be-1606aa395380', name: 'QPI', inactive: true },
		{ id: '297ca905-a9dd-48f5-9af3-306547997320', name: 'Janels' },
		{ id: '1c3ea0f7-a624-44b7-91fd-3efc82e982a8', name: 'Fortum Genus' },
		{ id: '36d12554-f91f-4e16-a2e1-018d15552a54', name: 'DTI' }
	];
}

// @ts-ignore
export function getPartnerColor(id) {
	let cClass = '';

	switch (id) {
		case 'ADG Bid Direct':
			cClass = 'bg-green-300';
			break;
		case 'QPI':
			cClass = 'bg-yellow-300';
			break;
		case 'Janels':
			cClass = 'bg-purple-300';
			break;
		case 'Fortum Genus':
			cClass = 'bg-orange-300';
			break;
		case 'DTI':
			cClass = 'bg-blue-300';
			break;
	}

	return cClass;
}

// @ts-ignore
export function getReviewValues(nsnMatches) {
	// @ts-ignore
	let values = [];
	let dates = [];

	let estimated_labor_minutes;

	for (let key of [
		'estimated_labor_minutes',
		'estimated_material_cost',
		'Estimated Total Cost',
		'Price Last Bid',
		'Previous Bid Outcome'
	]) {
		switch (key) {
			case 'estimated_labor_minutes':
				for (let match of nsnMatches) {
					if (match.estimated_labor_minutes) {
						estimated_labor_minutes = match.estimated_labor_minutes;
						values.push(parseFloat((estimated_labor_minutes / 60) * 18).toFixed(2));
						dates.push(formatMonthDayYearDate(match.solicitation.expires_on));
						break;
					}
				}
				if (values.length === 0) {
					values.push('N/A');
					dates.push('N/A');
				}
				break;
			case 'estimated_material_cost':
				for (let match of nsnMatches) {
					if (match.estimated_material_cost) {
						values.push(match.estimated_material_cost);
						dates.push(formatMonthDayYearDate(match.solicitation.expires_on));
						break;
					}
				}
				if (values.length === 1) {
					values.push('N/A');
					dates.push('N/A');
				}
				break;
			case 'Estimated Total Cost':
				if (!values.includes('N/A')) {
					values.push(values[0] + values[1]);
				} else {
					values.push('N/A');
				}
				dates.push('N/A');
				break;
			case 'Price Last Bid':
				for (let match of nsnMatches) {
					if (match.unit_price) {
						values.push(match.unit_price);
						dates.push(formatMonthDayYearDate(match.solicitation.expires_on));
						break;
					}
				}
				if (values.length === 3) {
					values.push('N/A');
					dates.push('N/A');
				}
				break;
			case 'Previous Bid Outcome':
				for (let match of nsnMatches) {
					if (match.status.some((s) => s.includes('award:won'))) {
						values.push('Won');
						dates.push(formatMonthDayYearDate(match.solicitation.expires_on));
						break;
					} else if (match.status.some((s) => s.includes('award:lost'))) {
						values.push('Lost');
						dates.push(formatMonthDayYearDate(match.solicitation.expires_on));
						break;
					}
				}
				if (values.length === 4) {
					values.push('N/A');
					dates.push('N/A');
				}
				break;
		}
	}

	for (let i of [0, 1, 2, 3]) {
		if (values[i] !== 'N/A') {
			values[i] = formatCurrency(values[i]);
		}
	}

	if (values[0] !== 'N/A') {
		values[0] = `${values[0]} / ${estimated_labor_minutes} mins`;
	}

	return { values, dates };
}

// @ts-ignore
export function formatMonthDayYearDate(date) {
	// Create a new Date object
	date = new Date(date);

	// Extract the components of the date
	var month = date.getMonth() + 1; // Adding 1 because getMonth() returns zero-based index
	var day = date.getDate();
	var year = date.getFullYear() % 100; // Extracting last two digits of the year

	// Concatenate the formatted components to get the desired format
	var formattedDate = month + '/' + day + '/' + year;

	return formattedDate;
}
