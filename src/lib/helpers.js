import { govTags } from './tags';

// @ts-ignore
export const solColumns =
	'id, created_at, description, estimated_value, issued_on, expires_on, contract_status, days_to_deliver, quantity, solicitation_url, first_article, contact_name, contact_phone, contact_email, line_number, quantity_units, amsc, company_awarded, price_won_at, date_awarded, higher_quality, fob, inspection_location';

// @ts-ignore
export function formatDate(date) {
	const year = date.getFullYear();
	const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
	const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();

	return `${year}-${month}-${day}`;
}

// @ts-ignore
export function formatDateWithTime(created_at, withOutTime) {
	let dateWithTime = new Date(new Date(created_at).toISOString());
	let date = new Date(formatDate(dateWithTime));
	const today = new Date(formatDate(new Date()));

	// @ts-ignore
	const diffInDays = (today - date) / (1000 * 60 * 60 * 24);

	if (diffInDays === 0) {
		let dateString = 'Today';

		if (!withOutTime) {
			dateString +=
				' ' +
				dateWithTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase();
		}

		return dateString;
	} else if (diffInDays === 1) {
		let dateString = 'Yesterday';

		if (!withOutTime) {
			dateString +=
				' ' +
				dateWithTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase();
		}

		return dateString;
	} else if (diffInDays === -1) {
		let dateString = 'Tomorrow';

		if (!withOutTime) {
			dateString +=
				' ' +
				dateWithTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase();
		}

		return dateString;
	} else if (diffInDays >= 6 || diffInDays <= 6) {
		if (withOutTime) return formatMonthDayYearDate(dateWithTime);
		return dateWithTime
			.toLocaleDateString('en-US', { weekday: 'long', hour: 'numeric', minute: '2-digit' })
			.replace(',', '');
	} else {
		if (withOutTime) return formatMonthDayYearDate(dateWithTime);
		return dateWithTime.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}
}

// @ts-ignore
export function calculateDaysDifference(date) {
	const givenDate = new Date(formatDate(new Date(date)));
	const currentDate = new Date(formatDate(new Date()));

	// Calculate the difference in milliseconds
	// @ts-ignore
	const differenceInMilliseconds = givenDate - currentDate;
	// Convert the difference to days
	const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
	const differenceInDays = differenceInMilliseconds / oneDay;

	return differenceInDays;
}

// @ts-ignore
export function formatCurrency(number) {
	if (!number) return '';

	let formatted = '$' + Math.abs(number).toLocaleString('en-US', { minimumFractionDigits: 2 });

	if (number < 0) {
		formatted = '(' + formatted + ')';
	}

	return formatted;
}

// @ts-ignore
export function capitalizeFirstLetter(sentence) {
	// @ts-ignore
	return sentence.replace(/\b\w/g, function (char) {
		return char.toUpperCase();
	});
}

// @ts-ignore
export function addCommasToNumber(number) {
	// Convert number to string and split it at the decimal point (if any)
	let parts = number.toString().split('.');

	// Add commas to the integer part
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

	// Join integer and decimal parts (if any) with a dot
	return parts.join('.');
}

export const removeOptions = [
	{ id: '5df8b8f5-0351-41d3-85d4-f9761f3986cd', name: 'Chose Not to Review', color: 'orange' },
	{ id: '6c197796-b1e1-41b0-ad97-f93565fec17e', name: 'No Tech Docs', color: 'blue' },
	{ id: '9a449b49-a64e-4c90-9498-87bf7db2cde5', name: 'Cancelled', color: 'gray' },
	{ id: '0d5b57e3-2a33-497e-9962-5b0a7a66a91d', name: 'Expired', color: 'gray' },
	{ id: 'd8bc4e06-ef4f-403e-97aa-8f5a97888de8', name: 'Unauthorized Access', color: 'blue' },
	{ id: 'c714e8d7-277e-4f39-8e9e-b92352b1c26e', name: 'Not Pursue', color: 'red' },
	{ id: '45c9d55c-dd2b-4bd9-b53d-be65bd70863f', name: 'Cannot Build', color: 'red' },
	{ id: '24b3d87a-1b2f-4a2c-b4b2-1cf223f9496f', name: 'Material Cost', color: 'red' },
	{ id: 'c27c1a72-04a6-4c23-bdaa-d9e2233feddf', name: 'Labor Time', color: 'red' },
	{ id: 'f6ae8ba7-1ede-4dc6-8de6-7f8367a9c53f', name: 'Other', color: 'gray' }
];

// @ts-ignore
export function getRemoveOptionName(id) {
	const option = removeOptions.filter((r) => r.id === id)[0];

	return option?.name;
}

// @ts-ignore
export function getRemoveOptionClass(id) {
	const option = removeOptions.filter((r) => r.id === id)[0];

	let rClass = '';

	switch (option?.color) {
		case 'green':
			rClass = 'bg-green-400';
			break;
		case 'orange':
			rClass = 'bg-orange-400';
			break;
		case 'red':
			rClass = 'bg-red-400';
			break;
		case 'blue':
			rClass = 'bg-blue-400';
			break;
		case 'gray':
			rClass = 'bg-gray-300';
			break;
	}

	return rClass;
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

// @ts-ignore
export function getStatusColor(status) {
	if (!status) return '';
	let color = '';

	// @ts-ignore
	switch (govTags[status.toString().split(':')[0]][status.toString().split(':')[1]].color) {
		case 'green':
			color = 'bg-green-400';
			break;
		case 'yellow':
			color = 'bg-yellow-400';
			break;
		case 'red':
			color = 'bg-red-400';
			break;
		case 'blue':
			color = 'bg-blue-400';
			break;
		case 'gray':
			color = 'bg-gray-300';
			break;
	}
	return color;
}

// @ts-ignore
export function getStatusName(status) {
	if (!status) return '';
	// @ts-ignore
	return govTags[status.toString().split(':')[0]][status.toString().split(':')[1]].name;
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
	let values = {
		unit_price: null,
		unit_price_date: null,
		estimated_labor_cost: null,
		estimated_labor_cost_date: null,
		estimated_material_cost: null,
		estimated_material_cost_date: null,
		estimated_cost: null,
		estimated_profit: null,
		previous_bid_outcome: null,
		previous_bid_outcome_date: null,
		market_value: null,
		estimated_total_profit: null,
		quantity: nsnMatches[0].solicitation.quantity,
		profit_margin: null
	};

	let estimated_labor_minutes;
	let award_details;

	for (let key of [
		'unit_price',
		'estimated_labor_minutes',
		'estimated_material_cost',
		'estimated_purchasing_days',
		'estimated_cost',
		'price_last_bid',
		'previous_bid_outcome'
	]) {
		switch (key) {
			case 'unit_price':
				for (let match of nsnMatches) {
					if (match.unit_price) {
						// @ts-ignore
						values.unit_price = match.unit_price;

						// @ts-ignore
						values.unit_price_date = formatMonthDayYearDate(match.solicitation.expires_on);
						break;
					}
				}
				break;
			case 'estimated_labor_minutes':
				for (let match of nsnMatches) {
					if (match.estimated_labor_minutes) {
						estimated_labor_minutes = match.estimated_labor_minutes;
						// @ts-ignore
						values.estimated_labor_cost = parseFloat((estimated_labor_minutes / 60) * 20).toFixed(
							2
						);
						// @ts-ignore
						values.estimated_labor_cost_date = formatMonthDayYearDate(
							match.solicitation.expires_on
						);
						break;
					}
				}
				break;
			case 'estimated_material_cost':
				for (let match of nsnMatches) {
					if (match.estimated_material_cost) {
						values.estimated_material_cost = match.estimated_material_cost;
						// @ts-ignore
						values.estimated_material_cost_date = formatMonthDayYearDate(
							match.solicitation.expires_on
						);
						break;
					}
				}
				break;
			case 'estimated_cost':
				// @ts-ignore
				if (values.estimated_material_cost && values.estimated_labor_cost && values.unit_price) {
					// @ts-ignore
					values.estimated_cost =
						parseFloat(values.estimated_material_cost) + parseFloat(values.estimated_labor_cost);
					// @ts-ignore
					values.estimated_profit =
						nsnMatches[0].unit_price -
						// @ts-ignore
						values.estimated_cost;
				}
				break;
			case 'previous_bid_outcome':
				for (let match of (nsnMatches ?? []).slice(1)) {
					// @ts-ignore
					if (match.status.some((s) => s.includes('award'))) {
						// @ts-ignore
						values.previous_bid_outcome = match.status.filter((s) => s.includes('award'))[0];
						// @ts-ignore
						values.previous_bid_outcome_date = formatMonthDayYearDate(
							match.solicitation.expires_on
						);

						if (values.previous_bid_outcome === 'award:lost') {
							award_details = {};

							if (match?.solicitation.price_won_at && match?.solicitation?.quantity) {
								// @ts-ignore
								award_details.unit_price_won_at = formatCurrency(
									match?.solicitation.price_won_at / match?.solicitation?.quantity
								);
							}

							// @ts-ignore
							award_details.company_awarded = match.solicitation.company_awarded;
							// @ts-ignore
							award_details.date_awarded = formatMonthDayYearDate(match.solicitation.date_awarded);
						} else if (values.previous_bid_outcome === 'award:won') {
							award_details = {};
							// @ts-ignore
							award_details.price_won_at = match?.unit_price;
						}
						break;
					}
				}
				break;
		}
	}

	if (values.estimated_profit) {
		// @ts-ignore
		values.estimated_total_profit = values.estimated_profit * nsnMatches[0].solicitation.quantity;
	}

	if (values.unit_price) {
		// @ts-ignore
		values.market_value = values.unit_price * nsnMatches[0].solicitation.quantity;
	}

	if (values.market_value && values.estimated_total_profit) {
		const margin = (values.estimated_total_profit / Math.abs(values.market_value)) * 100;

		// Round the margin to one decimal place
		const roundedMargin = Math.round(margin * 10) / 10;

		// @ts-ignore
		values.profit_margin = `${roundedMargin.toFixed(1)}%`;
	}

	for (let key of [
		'unit_price',
		'estimated_labor_cost',
		'estimated_material_cost',
		'estimated_cost',
		'estimated_profit',
		'market_value',
		'estimated_total_profit'
	]) {
		// @ts-ignore
		if (values[key]) {
			// @ts-ignore
			values[key] = formatCurrency(values[key]);
		}
	}

	// @ts-ignore
	if (estimated_labor_minutes) {
		// @ts-ignore
		values.estimated_labor_cost = `${values.estimated_labor_cost} / ${estimated_labor_minutes} mins`;
	}

	return { values, award_details };
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
