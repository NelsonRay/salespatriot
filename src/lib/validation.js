import { z } from 'zod';

export const awardModalValidation = z
	.object({
		status: z.string().array().nonempty({ message: 'Status is required.' }),
		company_awarded: z.string().nullable().optional(),
		price_won_at: z.number().positive().nullable().optional(),
		date_awarded: z.string().nullable().optional()
	})
	.superRefine((fields, ctx) => {
		if (fields.status.filter((s) => s.includes('award') && s !== 'award:waiting').length === 0) {
			ctx.addIssue({
				code: 'custom',
				message: 'Status is required.',
				path: ['status']
			});
		}

		if (fields.status.filter((s) => s === 'award:won')?.length > 0) {
			if (!fields.date_awarded) {
				ctx.addIssue({
					code: 'custom',
					message: 'Date is required.',
					path: ['date_awarded']
				});
			}
		}

		if (fields.status.filter((s) => s === 'award:lost')?.length > 0) {
			if (!fields.company_awarded) {
				ctx.addIssue({
					code: 'custom',
					message: 'Company Awarded is required.',
					path: ['company_awarded']
				});
			}
			if (!fields.price_won_at) {
				ctx.addIssue({
					code: 'custom',
					message: 'Price is required.',
					path: ['price_won_at']
				});
			}
			if (!fields.date_awarded) {
				ctx.addIssue({
					code: 'custom',
					message: 'Date is required.',
					path: ['date_awarded']
				});
			}
		}
	});

export const formsValidation = {
	opportunity: z
		.object({
			status: z.string().array().nonempty({ message: 'Status is required.' }),
			unit_price: z.number().positive().nullable().optional(),
			skip_engineering: z.boolean().nullable().optional()
		})
		.superRefine((fields, ctx) => {
			// if no opportunity status
			if (fields.status.filter((s) => s.includes('opportunity')).length === 0) {
				ctx.addIssue({
					code: 'custom',
					message: 'Status is required.',
					path: ['status']
				});
			}
			// meet conditions if pursue
			if (fields.status.includes('opportunity:pursue')) {
				if (!fields.unit_price)
					ctx.addIssue({
						code: 'custom',
						message: 'Unit Price is required.',
						path: ['unit_price']
					});

				if (fields.skip_engineering == null)
					ctx.addIssue({
						code: 'custom',
						message: 'Field is required.',
						path: ['skip_engineering']
					});
			}
		}),

	engineering: z
		.object({
			status: z.string().array().nonempty({ message: 'Status is required.' })
		})
		.superRefine((fields, ctx) => {
			// if no engineering status
			if (fields.status.filter((s) => s.includes('engineering')).length === 0) {
				ctx.addIssue({
					code: 'custom',
					message: 'Status is required.',
					path: ['status']
				});
			}
		}),

	bom: z
		.object({
			status: z.string().array().nonempty({ message: 'Status is required.' }),
			bom_url: z.string().nullable().optional()
		})
		.superRefine((fields, ctx) => {
			// if no engineering status
			if (fields.status.filter((s) => s.includes('bom')).length === 0) {
				ctx.addIssue({
					code: 'custom',
					message: 'Status is required.',
					path: ['status']
				});
			}

			if (fields.status.includes('bom:created') && !fields.bom_url) {
				ctx.addIssue({
					code: 'custom',
					message: 'BOM URL is required.',
					path: ['bom_url']
				});
			}
		}),
	purchasing: z
		.object({
			status: z.string().array().nonempty({ message: 'Status is required.' }),
			estimated_material_cost: z.number(),
			estimated_purchasing_days: z.number().int()
		})
		.superRefine((fields, ctx) => {
			// if no engineering status

			if (fields.status.filter((s) => s.includes('purchasing')).length === 0) {
				ctx.addIssue({
					code: 'custom',
					message: 'Status is required.',
					path: ['status']
				});
			}
		}),
	labor: z
		.object({
			status: z.string().array().nonempty({ message: 'Status is required.' }),
			estimated_labor_minutes: z.number()
		})
		.superRefine((fields, ctx) => {
			// if no engineering status

			if (fields.status.filter((s) => s.includes('labor')).length === 0) {
				ctx.addIssue({
					code: 'custom',
					message: 'Status is required.',
					path: ['status']
				});
			}
		}),
	review: z
		.object({
			status: z.string().array().nonempty({ message: 'Status is required.' })
		})
		.superRefine((fields, ctx) => {
			// if no engineering status

			if (fields.status.filter((s) => s.includes('review')).length === 0) {
				ctx.addIssue({
					code: 'custom',
					message: 'Status is required.',
					path: ['status']
				});
			}
		}),
	enter_quote: z
		.object({
			status: z.string().array().nonempty({ message: 'Status is required.' }),
			quote_number: z
				.string({ invalid_type_error: 'Quote Number is required.' })
				.nullable()
				.optional()
		})
		.superRefine((fields, ctx) => {
			// if no engineering status

			if (fields.status.filter((s) => s.includes('enter_quote')).length === 0) {
				ctx.addIssue({
					code: 'custom',
					message: 'Status is required.',
					path: ['status']
				});
			}

			if (fields.status.includes('enter_quote:entered')) {
				ctx.addIssue({
					code: 'custom',
					message: 'Quote Number is required.',
					path: ['quote_number']
				});
			}
		}),
	bid: z
		.object({
			status: z.string().array().nonempty({ message: 'Status is required.' }),
			bid_partners: z.string().array().nullable().optional(),
			bid_exception: z.boolean().nullable().optional()
		})
		.superRefine((fields, ctx) => {
			// if no engineering status

			if (fields.status.filter((s) => s.includes('bid')).length === 0) {
				ctx.addIssue({
					code: 'custom',
					message: 'Status is required.',
					path: ['status']
				});
			}

			if (fields.status.includes('bid:bid')) {
				if ((fields.bid_partners ?? []).length === 0)
					ctx.addIssue({
						code: 'custom',
						message: 'Bid Partner(s) is required.',
						path: ['bid_partners']
					});

				if (fields.bid_exception == null)
					ctx.addIssue({
						code: 'custom',
						message: 'Bid Exception is required.',
						path: ['bid_exception']
					});
			}
		})
};
