export const ssr = false;

export const load = async ({ locals: { session } }) => {
	return {
		session
	};
};
