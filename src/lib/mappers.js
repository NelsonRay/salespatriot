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

export function table_mapper(obj, column) {
	const header = gov_mapper(column.includes('solicitation.') ? column.split('.')[1] : column);

	let value;
	if (obj) {
		value = column.includes('solicitation.')
			? obj?.solicitation[column.split('.')[1]]
			: obj[column];
	}

	return { header, value };
}
