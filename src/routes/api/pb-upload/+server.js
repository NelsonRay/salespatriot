// @ts-nocheck

import xlsx from 'xlsx';
import Papa from 'papaparse';
import Airtable from 'airtable';
import { error, json } from '@sveltejs/kit';
import { AIRTABLE_API_KEY } from '$env/static/private';

/** @type {import('@sveltejs/adapter-vercel').Config} */
export const config = {
	runtime: 'nodejs18.x',
	split: true
};

export async function POST({ fetch, request }) {
	try {
		const payload = await request.json();

		const baseId = 'appofFwM8H9TnmK17';
		const tableName = 'Files';
		const recordId = payload.recordId; // Replace with the actual record ID

		// Airtable API endpoint
		const apiUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(
			tableName
		)}/${recordId}`;

		// Headers for the API request
		const headers = {
			Authorization: `Bearer ${AIRTABLE_API_KEY}`,
			'Content-Type': 'application/json'
		};

		const response = await fetch(apiUrl, { headers });

		const record = await response.json();

		// @ts-ignore
		const export_file = await downloadCSVAttachment(record.fields.Export[0].url);
		// @ts-ignore
		const batch_file = await downloadXLSXAttachment(record.fields.Batch[0].url);

		let solicitations = [];
		let missed_solicitations = [];

		const exported_solicitations = Papa.parse(export_file, {
			header: true
		}).data;

		const batch_wb = xlsx.read(batch_file, { type: 'array' });

		const sol_ws = batch_wb.Sheets['SOLICITATION'];
		const pro_ws = batch_wb.Sheets['PROCUREMENT'];

		const batched_solicitations = xlsx.utils.sheet_to_json(sol_ws);
		const batched_procurements = xlsx.utils.sheet_to_json(pro_ws);

		for (let solicitation of exported_solicitations) {
			let bs = batched_solicitations.find(
				(bs) => solicitation['SolicitationNumber'] === bs['SolicitationNumber']
			);

			if (bs) {
				solicitation['DaysToDeliveryFromAward'] = parseInt(bs['DaysToDeliveryFromAward']);
				solicitation['First Article'] = bs['FirstArticleIndicator'] === '-1' ? true : null;

				if (bs['HubZoneIndicator'] === '-1') solicitation['Set Aside'] = 'HUB Zone';
				if (bs['VeteranOwnedIndicator'] === '-1') solicitation['Set Aside'] = 'Veteran Owned';
				if (bs['SmallBusinessIndicator'] === '-1') solicitation['Set Aside'] = 'Small Business';

				solicitation['Previous Award History'] = get_past_wins(
					solicitation['LineNumberNSN'],
					batched_procurements
				);

				// fix fields
				solicitation['LineNumberQty'] = parseInt(solicitation['LineNumberQty']);
				solicitation['EstimatedValue'] = parseFloat(solicitation['EstimatedValue']);
				solicitation['NSN'] = solicitation['LineNumberNSN'];
				solicitation['Opportunity Status'] = 'In Progress';
				solicitation['SolicitationIssuedOn'] = formatDate(
					new Date(solicitation['SolicitationIssuedOn'])
				);

				solicitations.push(solicitation);
			} else {
				missed_solicitations.push(solicitation);
			}
		}

		const filtered_export = filterSolicitations(solicitations);

		const final_filtered_export = await upload_filtered_solications(filtered_export);

		const expired = await expire_solications();

		const data = {
			total: final_filtered_export.length,
			today: final_filtered_export.filter((e) => e.SolicitationIssuedOn === formatDate(new Date()))
				.length,
			missed: final_filtered_export.filter((e) => e.SolicitationIssuedOn !== formatDate(new Date()))
				.length,
			expired
		};

		return json(data, { status: 200 });
	} catch (e) {
		throw error(401, { message: e.toString() });
	}
}

async function upload_filtered_solications(filtered_export) {
	const date = new Date();
	date.setDate(date.getDate() - 8);

	// Format the date as 'YYYY-MM-DD' (Airtable's preferred date format)
	const formattedDate = formatDate(date);

	let offset;
	let skipFirst = true;

	let records = [];

	try {
		while (skipFirst || offset) {
			skipFirst = false; // no longer skip and only check for offset

			const data = await fetchCurrentRecords(formattedDate, offset);
			records = [...records, ...data.records];
			offset = data.offset;
		}

		for (let record of records) {
			filtered_export = filtered_export.filter((e) => {
				return !(
					e.SolicitationNumber === record.fields.SolicitationNumber &&
					e.SolicitationIssuedOn === record.fields.SolicitationIssuedOn
				);
			});
		}

		const final_filtered_export = await upload_solicitations(filtered_export);

		return final_filtered_export;
	} catch (e) {
		console.error(e);
	}
}

async function fetchCurrentRecords(formattedDate, offset) {
	let url = `https://api.airtable.com/v0/appwqhzuyZqLMZf19/Contract%20Tracker?fields%5B%5D=SolicitationNumber&fields%5B%5D=SolicitationIssuedOn&filterByFormula=IS_AFTER(%7BSolicitationIssuedOn%7D%2C'${formattedDate}')`;

	if (offset) {
		url += `&offset=${encodeURIComponent(offset)}`;
	}

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${AIRTABLE_API_KEY}`,
			'Content-Type': 'application/json'
		}
	});

	const data = await response.json();

	return data;
}

function filterSolicitations(solicitations) {
	let pastDate = new Date();
	pastDate.setDate(pastDate.getDate() - 8);
	pastDate = new Date(formatDate(pastDate));

	let futureDate = new Date();
	futureDate.setDate(futureDate.getDate() + 1);
	futureDate = new Date(formatDate(futureDate));

	const filtered = solicitations
		.filter((e) => e.SolicitationIssuedOn !== '')
		.filter((e) => {
			let date = new Date(new Date(e.SolicitationIssuedOn).toISOString().split('T')[0]);

			return date > pastDate && date < futureDate;
		});

	return filtered;
}

function formatDate(date) {
	const year = date.getFullYear();
	const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
	const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();

	return `${year}-${month}-${day}`;
}

function get_past_wins(nsn, procurements_json) {
	let procurements_for_nsn = procurements_json.filter((p) => p['NSN'] === nsn && 'AWARDDATE' in p);

	procurements_for_nsn.sort(function (a, b) {
		return new Date(b['AWARDDATE']).getMilliseconds() - new Date(a['AWARDDATE']).getMilliseconds();
	});

	// slice to 3 or less procurements
	if (procurements_for_nsn.length > 3) {
		procurements_for_nsn = procurements_for_nsn.slice(0, 3);
	}

	let past_wins_notes = '';

	for (let p of procurements_for_nsn) {
		past_wins_notes += `${p['QUANTITY']} @ $${p['UNITPRICE']} - ${p['VENDOR']} - ${p['AWARDDATE']}\n`;
	}

	return past_wins_notes;
}

async function upload_solicitations(solicitationObjs) {
	var base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base('appwqhzuyZqLMZf19');

	let records = solicitationObjs.map(function (s) {
		return { fields: s };
	});

	for (let i = 0; i < records.length / 10; i++) {
		const startIndex = i * 10;
		const endIndex = records.length - 1 < i * 10 + 9 ? records.length - 1 : i * 10 + 9;

		let batch = [];
		for (let index = startIndex; index <= endIndex; index++) {
			batch.push(records[index]);
		}

		await base('Contract Tracker').create(batch, {
			typecast: true
		});
	}

	return solicitationObjs;
}

async function downloadCSVAttachment(url) {
	let response = await fetch(url);
	let buffer = await response.arrayBuffer();
	// Convert the array buffer into a string using TextDecoder
	let decoder = new TextDecoder('utf-8');
	let csvContent = decoder.decode(buffer);

	return csvContent;
}

async function downloadXLSXAttachment(url) {
	let response = await fetch(url);
	let buffer = await response.arrayBuffer();
	return buffer;
}

async function expire_solications() {
	const date = new Date();
	date.setDate(date.getDate() - 1);

	// Format the date as 'YYYY-MM-DD' (Airtable's preferred date format)
	const formattedDate = formatDate(date);

	let offset;
	let skipFirst = true;

	let records = [];

	try {
		while (skipFirst || offset) {
			skipFirst = false; // no longer skip and only check for offset

			const data = await fetchExpiredRecords(formattedDate, offset);
			records = [...records, ...data.records];
			offset = data.offset;
		}

		records = records.map(function (r) {
			return { id: r.id, fields: { 'Opportunity Status': 'Expired' } };
		});

		for (let i = 0; i < records.length / 10; i++) {
			const startIndex = i * 10;
			const endIndex = records.length - 1 < i * 10 + 9 ? records.length - 1 : i * 10 + 9;

			let batch = [];
			for (let index = startIndex; index <= endIndex; index++) {
				batch.push(records[index]);
			}

			let url = 'https://api.airtable.com/v0/appwqhzuyZqLMZf19/Contract%20Tracker';

			await fetch(url, {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${AIRTABLE_API_KEY}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ records: batch })
			});
		}

		return records.length;
	} catch (e) {
		console.error(e);
	}
}

async function fetchExpiredRecords(formattedDate, offset) {
	let url = `https://api.airtable.com/v0/appwqhzuyZqLMZf19/Contract%20Tracker?fields%5B%5D=ID&filterByFormula=AND(IS_BEFORE(%7BSolicitationExpiresOn%7D%2C+'${formattedDate}')%2C+%7BOpportunity+Status%7D+%3D+'In+Progress')`;

	if (offset) {
		url += `&offset=${encodeURIComponent(offset)}`;
	}

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${AIRTABLE_API_KEY}`,
			'Content-Type': 'application/json'
		}
	});

	const data = await response.json();

	return data;
}
