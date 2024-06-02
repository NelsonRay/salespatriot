// @ts-nocheck
import {
	addCommasToNumber,
	capitalizeFirstLetter,
	formatMonthDayYearDate,
	calculateDaysDifference
} from '$lib/helpers';

export function govMapper(field) {
	const map = {
		// solicitations table
		id: 'Solicitation Number',
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
		first_article: 'First Article',
		price_won_at: 'Won Price',

		// solicitations_matched table
		unit_price: 'Unit Price',
		bid_timestamp: 'Quote Date',
		bom_url: 'BOM URL',
		estimated_material_cost: 'Estimated Material Cost (Per Unit)',
		estimated_purchasing_days: 'Estimated Purchasing Days',
		estimated_labor_minutes: 'Estimated Labor Minutes',
		requires_special_equipment: 'Requires Special Equipment',
		special_equipment_notes: 'Special Equipment Notes',
		quote_number: 'Quote Number',
		quote_number_notes: 'Notes',
		bid_exception: 'Bid With Exception',
		exception_notes: 'Exception Notes',
		bid_partners: 'Bid Partner(s)',
		date_awarded: 'Date Awarded',
		company_awarded: 'Company Awarded',
		first_article_price: 'First Article Price',
		first_article_lead_time: 'First Article Lead Time',
		flagged: 'Flagged',
		first_article_waive_requested: 'First Article Waive Requested',
		first_article_waive_request_honored: 'First Article Waive Honored'
	};

	return map[field] ?? 'Error';
}

export function commercialFieldsMapper(field) {
	const map = {
		received_at: 'Date Received',
		requested_return_date: 'Requested Return Date',
		sent_quote_timestamp: 'Sent Quote',
		quote_number: 'Quote Number',
		'customer.name': 'Customer',
		'customer.email_addresses': 'Email',
		part_number: 'Part Number',
		nsn: 'NSN',
		cross_reference: 'Cross Reference',
		quantities: 'Quantities',
		material_cost: 'Material Cost',
		lead_time: 'Lead Time',
		labor_minutes: 'Labor Minutes',
		final_pricing: 'Final Pricing'
	};

	return map[field] ?? 'Error';
}

function formatCurrency(number) {
	if (number === 0) {
		return '$0.00';
	}
	if (!number) return '';
	if (number !== 0) {
		return (
			(number < 0 ? '-' : '') +
			'$' +
			Math.abs(number).toLocaleString('en-US', { minimumFractionDigits: 2 })
		);
	} else {
		return '$0.00';
	}
}

export function commercialTableFieldMapper(obj, column) {
	if (column.type === 'position') return { header: '#' };
	if (column.type === 'status') {
		const containsStatus = (obj?.status ?? []).filter((e) => e.includes(column.status));

		let value;
		let header = `${column.status
			.split('_')
			.map((e) => capitalizeFirstLetter(e))
			.join(' ')} Status`;
		if (containsStatus.length > 0) {
			value = containsStatus[0];
		}

		return { header, value };
	} else if (column.type === 'email') {
		return { header: 'Email', value: obj?.email_address };
	} else if (column.type === 'parts') {
		return {
			header: 'Parts',
			value: obj?.rfqs_parts?.map((p) => p?.part?.number)?.join(', ')
		};
	} else if (column.type === 'name') {
		return {
			header: 'Name',
			value: `${obj?.customer?.name} - ${formatMonthDayYearDate(obj?.received_at)}`
		};
	} else if (column.type === 'value') {
		let value = 0;
		let avgParts = [];

		for (let rfqs_part of obj?.rfqs_parts ?? []) {
			const qtyPrices = rfqs_part.rfqs_parts_quantities.map((q) => q.quantity * q.final_pricing);

			let sumOfQtyPrices = 0;

			for (let qtyPrice of qtyPrices) {
				sumOfQtyPrices += qtyPrice;
			}

			let avgForPart = sumOfQtyPrices / rfqs_part.rfqs_parts_quantities?.length;

			avgParts = [...avgParts, avgForPart];
		}

		let avgValueForRfq = 0;

		for (let avgPart of avgParts) {
			avgValueForRfq += avgPart;
		}

		value += avgValueForRfq;
		return { header: 'Est. Value', value: value ? formatCurrency(value) : '---' };
	} else if (column.type === 'date') {
		const header = commercialFieldsMapper(column.field);

		let value;

		if (obj?.[column.field]) {
			value = formatMonthDayYearDate(obj?.[column.field]);

			if (column.field == 'sent_quote_timestamp') {
				value += ` (${Math.abs(calculateDaysDifference(value))}d)`;
			}
		}

		return { header, value };
	} else if (column.type == 'button') {
		return { value: null, header: column.header };
	} else {
		const header = commercialFieldsMapper(column.field);

		let value;
		if (obj) {
			value = obj;
			for (let key of column.field.split('.')) {
				value = value[key];
			}
		}

		return { header, value };
	}
}
export function tableFieldMapper(obj, column) {
	try {
		if (column.type === 'position') return { header: '#' };
		if (column.type === 'status') {
			const containsStatus = (obj?.status ?? []).filter((e) => e.includes(column.status));

			let value;
			if (containsStatus.length > 0) {
				value = containsStatus[0];
			}

			let header = `${column.status
				.split('_')
				.map((e) => capitalizeFirstLetter(e))
				.join(' ')} Status`;

			return { header, value };
		} else if (column.type === 'matching_rule') {
			return { header: 'Matching Rule', value: obj?.matching_rule?.name };
		} else if (column.type === 'tech_docs') {
			return {
				header: 'Tech Docs URL',
				value: 'https://pcf1x.bsm.dla.mil/cfolders/fol_de.htm?p_sol_no=' + obj?.solicitation?.id
			};
		} else if (column.type === 'expires_on') {
			let value;

			if (obj)
				value =
					formatMonthDayYearDate(obj?.solicitation.expires_on) +
					` (${calculateDaysDifference(obj?.solicitation.expires_on)}d)`;

			return { header: 'Expires On', value };
		} else if (column.type === 'formula') {
			if (column.field === 'market_value') {
				let value;
				if (obj?.unit_price && obj?.solicitation?.quantity) {
					value = formatCurrency(obj?.unit_price * obj?.solicitation?.quantity);
				}
				return { header: 'Bid Value', value: value ?? '' };
			} else if (column.field === 'unit_price_won_at') {
				let value;

				if (obj?.price_won_at && obj?.solicitation?.quantity) {
					value = formatCurrency(obj?.price_won_at / obj?.solicitation?.quantity);
				}
				return { header: 'Unit Price Won At', value: value ?? '' };
			} else if (column.field === 'diff_unit_price') {
				let value;

				if (obj?.price_won_at && obj?.solicitation?.quantity && obj?.unit_price) {
					value = formatCurrency(obj?.price_won_at / obj?.solicitation?.quantity - obj.unit_price);
				}
				return { header: 'Unit Price Difference', value: value ?? '' };
			}

			return { header: 'Error', value: '' };
		} else if (column.type === 'bid_partners') {
			return { header: 'Bid Partner(s)', value: obj?.bid_partners || null };
		} else if (column.type === 'parts') {
			let value = '';

			let skipComma = true;
			for (let match of obj?.solicitation.nsn?.parts ?? []) {
				value += match.number;
				if (!skipComma) value += ', ';
				skipComma = false;
			}

			return { header: 'In-House PN', value };
		} else {
			const header =
				column.header ??
				govMapper(
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

			if (['solicitation.estimated_value', 'price_won_at', 'unit_price'].includes(column.field)) {
				value = formatCurrency(value);
			}

			if (
				['solicitation.expires_on', 'solicitation.issued_on', 'bid_timestamp'].includes(
					column?.field
				)
			) {
				value = formatMonthDayYearDate(value);
			}

			if (column?.field === 'solicitation.quantity' && obj) value = addCommasToNumber(value);

			if (
				[
					'solicitation.first_article',
					'flagged',
					'first_article_waive_request_honored',
					'first_article_waive_requested'
				].includes(column?.field)
			) {
				value = value != null ? (value ? 'Yes' : 'No') : '';
			}
			return { header, value };
		}
	} catch (e) {
		console.error(e);
		console.log(column, obj);
	}
}
