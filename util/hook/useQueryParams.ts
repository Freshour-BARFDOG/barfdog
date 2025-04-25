import { useRouter } from "next/router";

export function useQueryParams() {
	const router = useRouter();
	const query = router.query;

	const getParam = (key: string) => {
		const value = query[key];
		return Array.isArray(value) ? value[0] : value;
	};

	const setParams = (newParams) => {
		const updatedQuery = { ...query };

		Object.entries(newParams).forEach(([key, value]) => {
			if (String(value) === '' || value === undefined) {
				delete updatedQuery[key];
			} else {
				updatedQuery[key] = String(value);
			}
		});

		router.push(
			{
				pathname: router.pathname,
				query: updatedQuery,
			},
			undefined,
			{ shallow: true }
		);
	};
	const deleteParams = (keys: string[]) => {
		const rest = { ...router.query };

		keys.forEach((key) => {
			delete rest[key];
		});

		router.push(
			{
				pathname: router.pathname,
				query: rest,
			},
			undefined,
			{ shallow: true }
		);
	};

	const keepOnlyParams = (
		keysToKeep: string[],
		overrideParams?: Record<string, string | number>
	) => {
		const current = router.query;

		const newQuery = keysToKeep.reduce((acc, key) => {
			if (overrideParams?.[key] !== undefined) {
				acc[key] = overrideParams[key];
			} else if (current[key] !== undefined) {
				acc[key] = current[key];
			}
			return acc;
		}, {} as Record<string, any>);

		router.push({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true });
	};

	return {
		getParam,
		setParams,
		deleteParams,
		keepOnlyParams,
		rawQuery: query,
	}

}