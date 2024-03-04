import { z } from 'zod';

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
				.min(1, { message: 'Quote Number is required.' })
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
