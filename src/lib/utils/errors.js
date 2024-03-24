// @ts-nocheck

export function hasErrors(issues, path) {
	for (let issue of issues ?? []) {
		if (arraysAreEqual(issue?.path, path)) return issue?.message || true;
	}

	return false;
}

function arraysAreEqual(array1, array2) {
	return JSON.stringify(array1) === JSON.stringify(array2);
}
