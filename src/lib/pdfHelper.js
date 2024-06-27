import { formatMonthDayYearDate, formatCurrency } from './helpers';

export function generatePDFHtml(values) {
	let html = pdfTemplate;

	let partsTable = '';

	for (let part of values.rfqs_parts) {
		for (let qty of part.rfqs_parts_quantities) {
			partsTable += `<tr>
                <td class="border border-gray-300 p-2">${part.part.number}</td>
                <td class="border border-gray-300 p-2">${part.part.description}</td>
                <td class="border border-gray-300 p-2">${qty.quantity}</td>
                <td class="border border-gray-300 p-2">${formatCurrency(qty.final_pricing)}</td>
                <td class="border border-gray-300 p-2">${qty.lead_time}</td>
                <td class="border border-gray-300 p-2">${formatCurrency(qty.final_pricing * qty.quantity)}</td>
            </tr>`;
		}
	}

	let replaceValues = {
		'{{firm_name}}': '<p class="mb-1">Aurora Defense Group</p>',
		'{{firm_address}}': '<p class="mb-1">401 Hankes Ave. Aurora, Il USA 60505-1717</p>',
		'{{firm_contact_info}}': '<p class="mb-1">sales@auroradefensegroup.com</p>',
		'{{date}}': `<p class="mb-1">Date: ${formatMonthDayYearDate(new Date())}</p>`,
		'{{date_valid}}': `<p class="mb-1">Quote Valid Until: ${formatMonthDayYearDate(new Date(Date.now() + 60 * 24 * 60 * 60 * 1000))}</p>`,
		'{{person_name}}': values.person_name ?? '',
		'{{company_name}}': `<p class="">${values.customer.name}</p>`,
		'{{company_address}}': '',
		'{{company_contact_info}}':
			!!values.email_address || !!values.phone_number
				? `<p class="mb-1">${[values.email_address, values.phone_number].join(' · ')}</p>`
				: '',
		'{{parts}}': partsTable
	};

	for (let entry of Object.entries(replaceValues)) {
		html = html.replace(entry[0], entry[1]);
	}

	return html;
}

export const pdfTemplate = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quote</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>

<body class="container mx-auto p-4">
    <h1 class="text-center text-2xl font-bold mb-4">QUOTE</h1>
    <div class="mb-4 grid grid-cols-2 gap-4">
        <div>

            <div class="mb-4">
                {{firm_name}}
                {{firm_address}}
                {{firm_contact_info}}
            </div>
            <div>
                <h2 class="text-lg font-semibold mb-2">Quote for:</h2>
                {{person_name}}
                {{company_name}}
                {{company_address}}
                {{company_contact_info}}
            </div>
        </div>
        <div class="text-right">
            {{date}}
            {{date_valid}}
        </div>
    </div>
    <table class="w-full mb-4 border-collapse border border-gray-300">
        <thead>
            <tr>
                <th class="border border-gray-300 p-2">Part Number</th>
                <th class="border border-gray-300 p-2">Description</th>
                <th class="border border-gray-300 p-2">Quantity</th>
                <th class="border border-gray-300 p-2">Unit Price</th>
                <th class="border border-gray-300 p-2">Lead Time</th>
                <th class="border border-gray-300 p-2">Amount</th>
            </tr>
        </thead>
        <tbody>
           {{parts}}
        </tbody>
    </table>
    <div class="mb-4">
        <h2 class="text-lg font-semibold mb-2">Comments or Special Instructions:</h2>
        <textarea class="w-full border border-gray-300 rounded p-2" rows="3"></textarea>
    </div>
</body>

</html>`;
