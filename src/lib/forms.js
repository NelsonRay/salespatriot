export const fieldsForForms = {
	opportunity: [
		{
			type: 'status',
			status: 'opportunity'
		},
		{
			type: 'currency',
			field: 'unit_price'
		}
	],
	engineering: [{ type: 'status', status: 'engineering' }],
	bom: [
		{ type: 'status', status: 'bom' },
		{ type: 'link', field: 'bom_url' }
	],
	purchasing: [
		{ type: 'status', status: 'purchasing' },
		{ type: 'currency', field: 'estimated_material_cost' },
		{ type: 'currency', field: 'estimated_purchasing_days' }
	],
	labor: [
		{ type: 'status', status: 'labor' },
		{ type: 'currency', field: 'estimated_labor_minutes' },
		{ type: 'textarea', field: 'special_equipment' }
	],
	review: [{ type: 'status', status: 'review' }],
	enter_quote: [
		{ type: 'status', status: 'enter_quote' },
		{ type: 'text', field: 'quote_number' }
	],
	bid: [
		{ type: 'bid_partners', field: 'bid_partners' },
		{ type: 'checkbox', field: 'bid_exception' },
		{ type: 'textarea', field: 'exception_notes' }
	],
	award: [
		{
			type: 'status',
			status: 'award'
		}
	]
};
