import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";

interface UsePaginationProps {
	size: number;
	totalElements: number;
	initialPage: number;
	onChange?: (page: number) => void;
}

export function usePagination({
	size,
	totalElements,
	initialPage = 0,
	onChange,
}: UsePaginationProps) {
	const router = useRouter();

	const totalPages = useMemo(() => {
		return size > 0 ? Math.ceil(totalElements / size) : 0;
	}, [totalElements, size]);

	const currentPage = Number(router.query.page) || initialPage;

	const setCurrentPage = (newPage: number) => {
		router.push(
			{
				pathname: router.pathname,
				query: { ...router.query, page: newPage },
			},
			undefined,
			{ shallow: true }
		);
	};

	useEffect(() => {
		if (onChange) {
			onChange(currentPage);
		}
	}, [currentPage]);

	return {
		currentPage,
		setCurrentPage,
		totalPages,
	}
}