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
		price_per_unit: 'Price Per Unit',

		// solicitations_matched table
		opportunity_status: 'Opportunity Status',
		opportunity_notes: 'Opportunity Notes'
	};

	return map[field] ?? 'Error';
}
