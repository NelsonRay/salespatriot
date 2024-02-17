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
