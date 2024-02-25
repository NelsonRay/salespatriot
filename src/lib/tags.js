export const govTags = {
	opportunity: {
		pursue: {
			name: 'Pursue',
			level: 1,
			color: 'green',
			key: 'opportunity:pursue'
		},
		maybe_pursue: {
			name: 'Maybe Pursue',
			level: 2,
			color: 'blue',
			key: 'opportunity:maybe_pursue'
		},
		in_progress: {
			name: 'In Progress',
			level: 3,
			color: 'yellow',
			key: 'opportunity:in_progress'
		},
		not_pursue: {
			name: 'Not Pursue',
			level: 4,
			color: 'red',
			key: 'opportunity:not_pursue'
		}
	},
	engineering: {
		can_build: {
			name: 'Can Build',
			level: 1,
			color: 'green',
			key: 'engineering:can_build'
		},
		maybe_can_build: {
			name: 'Maybe Can Build',
			level: 2,
			color: 'blue',
			key: 'engineering:maybe_can_build'
		},
		in_progress: {
			name: 'In Progress',
			level: 3,
			color: 'yellow',
			key: 'engineering:in_progress'
		},
		cannot_build: {
			name: 'Cannot Build',
			level: 4,
			color: 'red',
			key: 'engineering:cannot_build'
		}
	},
	bom: {
		in_house_part: {
			name: 'In House Part',
			level: 1,
			color: 'green',
			key: 'bom:in_house_part'
		},
		created: {
			name: 'Created',
			level: 2,
			color: 'green',
			key: 'bom:created'
		},
		in_progress: {
			name: 'In Progress',
			level: 3,
			color: 'yellow',
			key: 'bom:in_progress'
		},
		cannot_create: {
			name: 'Cannot Create',
			level: 4,
			color: 'red',
			key: 'bom:cannot_create'
		}
	},
	purchasing: {
		within_budget: {
			name: 'Within Budget',
			level: 1,
			color: 'green',
			key: 'purchasing:within_budget'
		},
		slightly_outside_budget: {
			name: 'Slightly Outside Budget',
			level: 2,
			color: 'blue',
			key: 'purchasing:slightly_outside_budget'
		},
		in_progress: {
			name: 'In Progress',
			level: 3,
			color: 'yellow',
			key: 'purchasing:in_progress'
		},
		out_of_budget: {
			name: 'Out of Budget',
			level: 4,
			color: 'red',
			key: 'purchasing:out_of_budget'
		}
	},
	labor: {
		within_time: {
			name: 'Within Time',
			level: 1,
			color: 'green',
			key: 'labor:within_time'
		},
		slightly_outside_time: {
			name: 'Slightly Outside Time',
			level: 2,
			color: 'blue',
			key: 'labor:slightly_outside_time'
		},
		in_progress: {
			name: 'In Progress',
			level: 3,
			color: 'yellow',
			key: 'labor:in_progress'
		},
		not_within_time: {
			name: 'Not Within Time',
			level: 4,
			color: 'red',
			key: 'labor:not_within_time'
		}
	},
	review: {
		approved: {
			name: 'Approved',
			level: 1,
			color: 'green',
			key: 'review:approved'
		},
		in_progress: {
			name: 'In Progress',
			level: 3,
			color: 'yellow',
			key: 'review:in_progress'
		},
		not_approved: {
			name: 'Not Approved',
			level: 4,
			color: 'red',
			key: 'review:not_approved'
		}
	},
	bid: {
		bid: {
			name: 'Bid',
			level: 1,
			color: 'green',
			key: 'bid:bid'
		},
		in_progress: {
			name: 'In Progress',
			level: 3,
			color: 'yellow',
			key: 'bid:in_progress'
		},
		no_bid: {
			name: 'No Bid',
			level: 4,
			color: 'red',
			key: 'bid:no_bid'
		}
	},
	award: {
		won: {
			name: 'Bid',
			level: 1,
			color: 'green',
			key: 'award:won'
		},
		waiting: {
			name: 'Waiting',
			level: 3,
			color: 'yellow',
			key: 'award:waiting'
		},
		lost: {
			name: 'Lost',
			level: 4,
			color: 'red',
			key: 'award:lost'
		},
		removed: {
			name: 'Removed',
			level: 5,
			color: 'gray',
			key: 'award:removed'
		}
	}
};

export const oemTags = {
	purchasing: {
		complete: {
			name: 'Complete',
			level: 1,
			color: 'green',
			key: 'purchasing:complete'
		},
		waiting: {
			name: 'Waiting',
			level: 2,
			color: 'orange',
			key: 'purchasing:waiting'
		},
		in_progress: {
			name: 'In Progress',
			level: 3,
			color: 'yellow',
			key: 'purchasing:in_progress'
		}
	},
	labor: {
		complete: {
			name: 'Complete',
			level: 1,
			color: 'green',
			key: 'labor:complete'
		},
		in_progress: {
			name: 'In Progress',
			level: 3,
			color: 'yellow',
			key: 'labor:in_progress'
		}
	},
	final_pricing: {
		complete: {
			name: 'Complete',
			level: 1,
			color: 'green',
			key: 'final_pricing:complete'
		},
		in_progress: {
			name: 'In Progress',
			level: 3,
			color: 'yellow',
			key: 'final_pricing:in_progress'
		}
	},
	enter_quote: {
		complete: {
			name: 'Complete',
			level: 1,
			color: 'green',
			key: 'enter_quote:complete'
		},
		in_progress: {
			name: 'In Progress',
			level: 3,
			color: 'yellow',
			key: 'enter_quote:in_progress'
		}
	},
	send_quote: {
		complete: {
			name: 'Complete',
			level: 1,
			color: 'green',
			key: 'send_quote:complete'
		},
		in_progress: {
			name: 'In Progress',
			level: 3,
			color: 'yellow',
			key: 'send_quote:in_progress'
		}
	},
	response: {
		placed_order: {
			name: 'Placed Order',
			level: 1,
			color: 'green',
			key: 'response:placed_order'
		},
		in_negotiation: {
			name: 'In Negotiation',
			level: 2,
			color: 'blue',
			key: 'response:in_negotiation'
		},
		waiting: {
			name: 'Waiting',
			level: 3,
			color: 'yellow',
			key: 'response:waiting'
		},
		assumed_lost: {
			name: 'Assumed Lost',
			level: 4,
			color: 'red',
			key: 'response:assumed_lost'
		},
		removed: {
			name: 'Removed',
			level: 5,
			color: 'red',
			key: 'response:removed'
		}
	}
};
