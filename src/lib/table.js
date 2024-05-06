// @ts-nocheck
export function getColumns(pathname) {
	switch (pathname) {
		case '/sales/government/contracts-bid':
			return [
				{ type: 'position' },
				{ type: 'field', field: 'solicitation.id' },
				{ type: 'field', field: 'solicitation.description' },
				{ type: 'expires_on' },
				{ type: 'status', status: 'award' },
				{ type: 'bid_partners' },
				{ type: 'formula', field: 'market_value' },
				{ type: 'field', field: 'price_won_at' },
				{ type: 'formula', field: 'unit_price_won_at' },
				{ type: 'formula', field: 'diff_unit_price' },
				{ type: 'status', status: 'opportunity' },
				{ type: 'field', field: 'solicitation.nsn.id', header: 'NSN' },
				{
					type: 'parts',
					header: 'In-House PN'
				},
				{ type: 'field', field: 'first_article_waive_requested' },
				{ type: 'field', field: 'first_article_waive_request_honored' },
				{ type: 'matching_rule', status: 'matching_rule' },
				{ type: 'status', status: 'engineering' },
				{ type: 'status', status: 'bom' },
				{ type: 'status', status: 'purchasing' },
				{ type: 'status', status: 'labor' },
				{ type: 'status', status: 'final_pricing' },
				{ type: 'status', status: 'bid' },
				{ type: 'field', field: 'solicitation.estimated_value' },
				{ type: 'set_aside', field: 'solicitation.set_aside' },
				{ type: 'field', field: 'solicitation.issued_on' },
				{ type: 'field', field: 'solicitation.quantity' },
				{ type: 'field', field: 'solicitation.quantity_units' },
				{ type: 'field', field: 'solicitation.first_article' },
				{ type: 'field', field: 'solicitation.days_to_deliver' },
				{ type: 'link', field: 'bom_url' },
				{ type: 'field', field: 'unit_price' },
				{ type: 'link', field: 'solicitation.solicitation_url' },
				{ type: 'tech_docs' },
				{ type: 'field', field: 'flagged' }
			];
		default:
			return [
				{ type: 'position' },
				{ type: 'field', field: 'solicitation.id' },
				{ type: 'field', field: 'solicitation.description' },
				{ type: 'expires_on' },
				{ type: 'formula', field: 'market_value' },
				{ type: 'field', field: 'solicitation.estimated_value' },
				{ type: 'status', status: 'opportunity' },
				{ type: 'status', status: 'engineering' },
				{ type: 'status', status: 'bom' },
				{ type: 'status', status: 'purchasing' },
				{ type: 'status', status: 'labor' },
				{ type: 'status', status: 'final_pricing' },
				{ type: 'status', status: 'enter_quote' },
				{ type: 'status', status: 'bid' },
				{ type: 'status', status: 'award' },
				{ type: 'field', field: 'solicitation.nsn.id', header: 'NSN' },
				{ type: 'matching_rule', status: 'matching_rule' },
				{ type: 'set_aside', field: 'solicitation.set_aside' },
				{ type: 'field', field: 'solicitation.issued_on' },
				{ type: 'field', field: 'solicitation.quantity' },
				{ type: 'field', field: 'solicitation.quantity_units' },
				{ type: 'field', field: 'solicitation.first_article' },
				{
					type: 'parts',
					header: 'In-House PN'
				},
				{ type: 'field', field: 'solicitation.days_to_deliver' },
				{ type: 'link', field: 'bom_url' },
				{ type: 'field', field: 'unit_price' },
				{ type: 'link', field: 'solicitation.solicitation_url' },
				{ type: 'tech_docs' },
				{ type: 'field', field: 'solicitation.price_won_at' },
				{ type: 'formula', field: 'unit_price_won_at' },
				{ type: 'formula', field: 'diff_unit_price' },
				{ type: 'field', field: 'flagged' }
			];
	}
}

export function getReportColumns() {
	return [
		{ type: 'position' },
		{ type: 'field', field: 'bid_timestamp' },
		{ type: 'field', field: 'solicitation.id' },
		{ type: 'field', field: 'solicitation.description' },
		{ type: 'status', status: 'award' },
		{ type: 'formula', field: 'market_value' },
		{ type: 'field', field: 'unit_price' },
		{ type: 'field', field: 'solicitation.price_won_at' },
		{ type: 'formula', field: 'unit_price_won_at' },
		{ type: 'formula', field: 'diff_unit_price' },
		{ type: 'field', field: 'solicitation.nsn.id', header: 'NSN' },
		{
			type: 'parts',
			header: 'In-House PN'
		},
		{ type: 'field', field: 'solicitation.issued_on' },
		{ type: 'field', field: 'solicitation.quantity' },
		{ type: 'field', field: 'solicitation.quantity_units' },
		{ type: 'link', field: 'solicitation.solicitation_url' }
	];
}

export function getReportRfqColumns() {
	return [
		{ type: 'position' },
		{ type: 'name' },
		{ type: 'value' },
		{ type: 'status', status: 'send_quote' },
		{ type: 'status', status: 'response' },
		{ type: 'parts' },
		{ type: 'date', field: 'received_at' },
		{ type: 'date', field: 'sent_quote_timestamp' },
		{ type: 'field', field: 'quote_number' },
		{ type: 'field', field: 'customer.name' },
		{ type: 'email' }
	];
}

export function getNSNColumns(oppForm) {
	let statuses = [
		{ type: 'status', status: 'opportunity' },
		{ type: 'status', status: 'engineering' },
		{ type: 'status', status: 'bom' },
		{ type: 'status', status: 'purchasing' },
		{ type: 'status', status: 'labor' },
		{ type: 'status', status: 'final_pricing' }
	];
	let nsnColumns = [
		{ type: 'position' },
		{ type: 'expires_on' },
		{ type: 'field', field: 'solicitation.id' },
		{ type: 'field', field: 'solicitation.quantity' },
		{ type: 'field', field: 'unit_price' },
		{ type: 'status', status: 'bid' },
		{ type: 'status', status: 'award' }
	];

	if (oppForm) nsnColumns = [...nsnColumns, ...statuses];

	nsnColumns = [
		...nsnColumns,
		{ type: 'bid_partners' },
		{ type: 'formula', field: 'market_value' },
		{ type: 'field', field: 'solicitation.price_won_at' },
		{ type: 'formula', field: 'unit_price_won_at' },
		{ type: 'formula', field: 'diff_unit_price' },
		{ type: 'field', field: 'solicitation.company_awarded' },
		{ type: 'field', field: 'solicitation.date_awarded' },
		{ type: 'field', field: 'estimated_labor_minutes' },
		{ type: 'field', field: 'estimated_material_cost' },
		{ type: 'field', field: 'estimated_purchasing_days' },
		{ type: 'set_aside', field: 'solicitation.set_aside' },
		{ type: 'field', field: 'solicitation.first_article' },
		{ type: 'link', field: 'bom_url' }
	];

	if (!oppForm) nsnColumns = [...nsnColumns, ...statuses];

	nsnColumns = [
		...nsnColumns,
		{ type: 'field', field: 'solicitation.nsn.id', header: 'NSN' },
		{ type: 'field', field: 'solicitation.description' },
		{ type: 'field', field: 'solicitation.estimated_value' },
		{
			type: 'parts',
			header: 'In-House PN'
		},
		{ type: 'matching_rule', status: 'matching_rule' },
		{ type: 'field', field: 'solicitation.issued_on' },
		{ type: 'field', field: 'solicitation.quantity_units' },
		{ type: 'field', field: 'solicitation.days_to_deliver' },
		{ type: 'link', field: 'solicitation.solicitation_url' },
		{ type: 'tech_docs' }
	];

	return nsnColumns;
}
