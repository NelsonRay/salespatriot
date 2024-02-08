// @ts-nocheck

export default {
	gov_mapper
};

export function gov_mapper(field) {
	const map = {
		// solicitations table
		issued_on: 'Issued',
		expires_on: 'Expires',
		award_history: 'Award History',
		solicitation_url: 'Solicitation URL',
		tech_docs: 'Tech Docs URL',
		quantity: 'Quantity',
		quantity_units: 'Units',
		days_to_deliver: 'Days to Deliver',
		set_aside: 'Set Aside',
		nsn: 'NSN',
		contract_status: 'Status',
		estimated_value: 'Estimated Value',
		description: 'Description',
		number: 'Solicitation Number',
		first_article: 'First Article',

		// solicitations_matched table
		opportunity_status: 'Opportunity Status',
		price_per_unit: 'Price Per Unit',
		opportunity_notes: 'Opportunity Notes',
		engineering_status: 'Engineering Status',
		engineering_notes: 'Engineering Notes',
		bom_status: 'BOM Status',
		bom_url: 'BOM URL',
		bom_notes: 'BOM Notes',
		purchasing_status: 'Purchasing Status',
		estimated_purchasing_budget: 'Estimated Purchasing Budget',
		estimated_purchasing_days: 'Estimated Purchasing Days',
		purchasing_notes: 'Purchasing Notes',
		labor_status: 'Labor Status',
		estimated_labor_hours: 'Estimated Labor Hours',
		special_equipment: 'Special Equipment',
		labor_notes: 'Labor Notes',
		review_status: 'Review Status',
		review_notes: 'Review Notes',
		bid_status: 'Bid Status',
		quote_number: 'Quote Number',
		bid_exception: 'Bid With Exception',
		exception_notes: 'Exception Notes',
		bid_notes: 'Bid Notes'
	};

	return map[field] ?? 'Error';
}

function capitalizeFirstLetter(sentence) {
	return sentence.replace(/\b\w/g, function (char) {
		return char.toUpperCase();
	});
}

function formatCurrency(number) {
	if (!number) return '';
	return '$' + number.toLocaleString('en-US', { minimumFractionDigits: 2 });
}

export function tableFieldMapper(obj, column) {
	if (column.type === 'status') {
		const containsStatus = (obj?.status ?? []).filter((e) => e.includes(column.status));

		let value;
		if (containsStatus.length > 0) {
			value = containsStatus[0];
		}

		return { header: capitalizeFirstLetter(column.status) + ' Status', value };
	} else if (column.type === 'matching_rule') {
		return { header: 'Matching Rule', value: obj?.matching_rule?.name };
	} else if (column.type === 'formula') {
		if (column.field === 'market_value') {
			let value;
			if (obj?.price_per_unit && obj?.solicitation?.quantity) {
				value = formatCurrency(obj?.price_per_unit * obj?.solicitation?.quantity);
			}
			return { header: 'Market Value', value: value ?? '' };
		}

		return { header: 'Error', value: '' };
	} else {
		const header =
			column.header ??
			gov_mapper(
				column?.field?.toString().includes('solicitation.')
					? column?.field?.split('.')[1]
					: column?.field
			);

		let value;
		if (obj) {
			value = obj;
			for (let key of column.field.split('.')) {
				value = value[key];
			}

			if (column.array_selector) {
				value = value.length > 0 ? value[0][column.array_selector] : '';
			}
		}

		if (['solicitation.estimated_value'].includes(column.field)) {
			value = formatCurrency(value);
		}

		return { header, value };
	}
}
