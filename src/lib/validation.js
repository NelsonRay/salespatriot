import { z } from 'zod';

export const commercialFormsValidation = {
	labor: () => z.object({ labor_minutes: z.number().positive() }),
	purchasing: () =>
		z.object({
			material_cost_5: z.number().positive(),
			material_cost_25: z.number().positive(),
			material_cost_50: z.number().positive(),
			material_cost_100: z.number().positive(),
			material_cost_250: z.number().positive(),
			lead_time_5: z.number().positive(),
			lead_time_25: z.number().positive(),
			lead_time_50: z.number().positive(),
			lead_time_100: z.number().positive(),
			lead_time_250: z.number().positive()
		})
};

export const addRFQFormValidation = () =>
	z.object({
		received_at: z.string().min(1),
		customer: z.object({
			name: z.string().min(1)
		}),
		rfqs_products: z
			.object({
				product: z.object({
					number: z.string().min(1),
					nsn: z.number().nullable().optional()
				}),
				rfqs_products_quantities: z.object({ quantity: z.number().positive() }).array()
			})
			.array()
			.superRefine((fields, ctx) => {
				for (let i = 0; i < fields.length; i++) {
					if (fields[i].product.nsn != null && fields[i].product.nsn?.toString().length !== 13) {
						ctx.addIssue({
							code: 'custom',
							message: 'Not 13 digits',
							path: [i, 'product', 'nsn']
						});
					}
				}
			})
	});

export const masterFormValidation = (/** @type {Boolean} */ includeWaive) =>
	z
		.object({
			status: z.string().array(),
			unit_price: z.number().positive().nullable().optional(),
			bom_url: z.string().nullable().optional(),
			estimated_material_cost: z.number().nullable().optional(),
			estimated_purchasing_days: z.number().int().nullable().optional(),
			estimated_labor_minutes: z.number().nullable().optional(),
			requires_special_equipment: z.boolean().nullable().optional(),
			first_article_price: z.number().positive().nullable().optional(),
			first_article_lead_time: z.number().positive().nullable().optional(),
			quote_number: z.string().nullable().optional(),
			bid_partners: z.string().array().nullable().optional(),
			bid_exception: z.boolean().nullable().optional(),
			first_article_waive_requested: z.boolean().nullable().optional()
		})
		.superRefine((fields, ctx) => {
			const forceCheck = fields.status.includes('final_pricing:assigned');

			if (forceCheck || fields.status.includes('opportunity:pursue')) {
				if (!fields.unit_price)
					ctx.addIssue({
						code: 'custom',
						message: 'Unit Price is required.',
						path: ['unit_price']
					});
			}

			if (forceCheck || fields.status.includes('bom:created')) {
				if (!fields.bom_url)
					ctx.addIssue({
						code: 'custom',
						message: 'BOM URL is required.',
						path: ['bom_url']
					});
			}

			if (
				forceCheck ||
				(fields.status.some((s) => s.includes('purchasing')) &&
					!fields.status.includes('purchasing:in_progress'))
			) {
				if (!fields.estimated_material_cost)
					ctx.addIssue({
						code: 'custom',
						message: 'MAT Cost is required.',
						path: ['estimated_material_cost']
					});

				if (!fields.estimated_purchasing_days)
					ctx.addIssue({
						code: 'custom',
						message: 'Purchasing Days is required.',
						path: ['estimated_purchasing_days']
					});
			}

			if (
				forceCheck ||
				(fields.status.some((s) => s.includes('labor')) &&
					!fields.status.includes('labor:in_progress'))
			) {
				if (!fields.estimated_labor_minutes)
					ctx.addIssue({
						code: 'custom',
						message: 'Labor Mins are required.',
						path: ['estimated_labor_minutes']
					});

				if (fields.requires_special_equipment == null)
					ctx.addIssue({
						code: 'custom',
						message: 'Special Equipment is required.',
						path: ['requires_special_equipment']
					});
			}

			if (forceCheck && includeWaive) {
				if (!fields.first_article_price)
					ctx.addIssue({
						code: 'custom',
						message: 'Price is required.',
						path: ['first_article_price']
					});

				if (!fields.first_article_lead_time)
					ctx.addIssue({
						code: 'custom',
						message: 'Lead Time is required.',
						path: ['first_article_lead_time']
					});
			}

			if (fields.status.includes('enter_quote:entered')) {
				if (!fields.quote_number)
					ctx.addIssue({
						code: 'custom',
						message: 'Quote Number is required.',
						path: ['quote_number']
					});
			}

			if (fields.status.includes('bid:bid')) {
				if (!fields.bid_partners?.length)
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

				if (includeWaive && fields.first_article_waive_requested == null)
					ctx.addIssue({
						code: 'custom',
						message: 'Waive Request must be answered.',
						path: ['first_article_waive_requested']
					});
			}
		});

export const removeModalValidation = () =>
	z
		.object({
			removed: z.boolean({ required_error: 'Removed is required.' }),
			removed_option: z.string().nullable().optional(),
			removed_notes: z.string().nullable().optional(),
			flagged: z.boolean().nullable().optional()
		})
		.superRefine((fields, ctx) => {
			if (fields.removed && !fields.removed_option) {
				ctx.addIssue({
					code: 'custom',
					message: 'Reason is required.',
					path: ['removed_option']
				});
			}

			if (
				fields.removed_option === 'f6ae8ba7-1ede-4dc6-8de6-7f8367a9c53f' &&
				!fields.removed_notes
			) {
				ctx.addIssue({
					code: 'custom',
					message: 'Comment is required.',
					path: ['removed_notes']
				});
			}

			if (fields.removed && fields.flagged == null) {
				ctx.addIssue({
					code: 'custom',
					message: 'Flagged is required.',
					path: ['flagged']
				});
			}
		});

export const awardModalValidation = (/** @type {Boolean} */ includeWaive) =>
	z
		.object({
			status: z.string().array().nonempty({ message: 'Status is required.' }),
			company_awarded: z.string().nullable().optional(),
			price_won_at: z.number().nullable().optional(),
			date_awarded: z.string().nullable().optional(),
			first_article_waive_request_honored: z.boolean().nullable().optional()
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

				if (includeWaive && fields.first_article_waive_request_honored == null) {
					ctx.addIssue({
						code: 'custom',
						message: 'Request Honored must be answered.',
						path: ['first_article_waive_request_honored']
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
	opportunity: () =>
		z
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

					if (
						fields.skip_engineering &&
						fields.status.filter((s) => s.includes('bom')).length === 0
					)
						ctx.addIssue({
							code: 'custom',
							message: 'BOM Status is required.',
							path: ['bom_status']
						});
				}
			}),

	engineering: () =>
		z
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

	bom: () =>
		z
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
	purchasing: () =>
		z
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
	labor: () =>
		z
			.object({
				status: z.string().array().nonempty({ message: 'Status is required.' }),
				estimated_labor_minutes: z.number(),
				requires_special_equipment: z.boolean({
					invalid_type_error: 'Special Equipment is required.'
				})
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
	final_pricing: () =>
		z
			.object({
				status: z.string().array().nonempty({ message: 'Status is required.' })
			})
			.superRefine((fields, ctx) => {
				// if no engineering status

				if (fields.status.filter((s) => s.includes('final_pricing')).length === 0) {
					ctx.addIssue({
						code: 'custom',
						message: 'Status is required.',
						path: ['status']
					});
				}
			}),
	enter_quote: () =>
		z
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
	bid: (/** @type {Boolean} */ includeWaive) =>
		z
			.object({
				status: z.string().array().nonempty({ message: 'Status is required.' }),
				bid_partners: z.string().array().nullable().optional(),
				bid_exception: z.boolean().nullable().optional(),
				first_article_waive_requested: z.boolean().nullable().optional()
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

					if (includeWaive && fields.first_article_waive_requested == null) {
						ctx.addIssue({
							code: 'custom',
							message: 'Waive Request must be answered.',
							path: ['first_article_waive_requested']
						});
					}
				}
			})
};
