import { formatCurrency } from '$lib/helpers';

// @ts-ignore
export function getCommercialValueCalculation(qty, part) {
	if (!qty || !part) return null;

	const estimated_labor_minutes = part?.labor_minutes;
	const unit_price = qty?.final_pricing;
	const estimated_material_cost = qty.material_cost;
	const quantity = qty.quantity;

	// @ts-ignore
	let calculation = {
		unit_price,
		estimated_material_cost,
		estimated_labor_cost: null,
		estimated_cost: null,
		estimated_profit: null,

		market_value: null,
		estimated_total_profit: null,
		quantity: quantity,
		profit_margin: null
	};

	// @ts-ignore
	calculation.estimated_labor_cost = estimated_labor_minutes
		? parseFloat((estimated_labor_minutes / 60) * 20).toFixed(2)
		: null;
	// @ts-ignore
	// calculation.estimated_labor_cost_date = formatMonthDayYearDate(
	// 	values.
	// );

	// @ts-ignore
	// calculation.estimated_material_cost_date = formatMonthDayYearDate(
	// 	match.solicitation.expires_on
	// );

	if (calculation.estimated_material_cost && calculation.estimated_labor_cost) {
		// @ts-ignore
		calculation.estimated_cost =
			parseFloat(calculation.estimated_material_cost) +
			parseFloat(calculation.estimated_labor_cost);
	}

	if (
		calculation.estimated_material_cost &&
		calculation.estimated_labor_cost &&
		calculation.unit_price
	) {
		// @ts-ignore
		calculation.estimated_profit =
			calculation.unit_price -
			// @ts-ignore
			calculation.estimated_cost;
	}

	if (calculation.estimated_profit) {
		// @ts-ignore
		calculation.estimated_total_profit = calculation.estimated_profit * calculation.quantity;
	}

	if (calculation.unit_price) {
		// @ts-ignore
		calculation.market_value = calculation.unit_price * calculation.quantity;
	}

	if (calculation.market_value && calculation.estimated_total_profit) {
		const margin = (calculation.estimated_total_profit / Math.abs(calculation.market_value)) * 100;

		// Round the margin to one decimal place
		const roundedMargin = Math.round(margin * 10) / 10;

		// @ts-ignore
		calculation.profit_margin = `${roundedMargin.toFixed(1)}%`;
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
		if (calculation[key]) {
			// @ts-ignore
			calculation[key] = formatCurrency(calculation[key]);
		}
	}

	// @ts-ignore
	if (estimated_labor_minutes) {
		// @ts-ignore
		calculation.estimated_labor_cost = `${calculation.estimated_labor_cost} / ${estimated_labor_minutes} mins`;
	}

	return calculation;
}
