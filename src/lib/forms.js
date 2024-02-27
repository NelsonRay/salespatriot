export const fieldsForForms = {
	opportunity: [
		{
			type: 'status',
			status: 'opportunity'
		},
		{
			type: 'currency',
			field: 'unit_price'
		},
		{
			type: 'textarea',
			field: 'opportunity_notes'
		}
	],
	engineering: [
		{ type: 'status', status: 'engineering' },
		{ type: 'textarea', field: 'engineering_notes' }
	],
	bom: [
		{ type: 'status', status: 'bom' },
		{ type: 'link', field: 'bom_url' },
		{ type: 'textarea', field: 'bom_notes' }
	],
	purchasing: [
		{ type: 'status', status: 'purchasing' },
		{ type: 'currency', field: 'estimated_material_cost' },
		{ type: 'currency', field: 'estimated_purchasing_days' },
		{ type: 'textarea', field: 'purchasing_notes' }
	],
	labor: [
		{ type: 'status', status: 'labor' },
		{ type: 'currency', field: 'estimated_labor_hours' },
		{ type: 'textarea', field: 'special_equipment' },
		{ type: 'textarea', field: 'labor_notes' }
	],
	review: [
		{ type: 'status', status: 'review' },
		{ type: 'textarea', field: 'review_notes' }
	],
	bid: [
		{ type: 'status', status: 'bid' },
		{ type: 'partner', field: 'bid_partner' },
		{ type: 'link', field: 'quote_number' },
		{ type: 'checkbox', field: 'bid_exception' },
		{ type: 'textarea', field: 'exception_notes' },
		{ type: 'textarea', field: 'bid_notes' }
	]
};
