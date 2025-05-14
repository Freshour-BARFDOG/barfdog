import { useQueryParams } from "@util/hook/useQueryParams";

// 공통으로 사용할 searchParams 타입 정의: page를 필수로 포함하고, 나머지는 유연하게 받을 수 있도록 구성
type SearchParams = {
	page: number;
	[key: string]: any;
}

// useSearchParams 훅의 제네릭 타입 정의
type SearchParamsOptions<T extends SearchParams> = {
	initialSearchValue: T;
	searchValues: T;
	setSearchValues: (values: T) => void;
};

export function useSearchParams<T extends SearchParams>({
	initialSearchValue,
	searchValues,
	setSearchValues,
}: SearchParamsOptions<T>) {
	const { setParams } = useQueryParams();

	// 검색 상태 초기화, URL 쿼리도 초기 상태로 복원
	const handleResetSearchValue = () => {
		setParams(initialSearchValue);
		setSearchValues(initialSearchValue);
	};

	// 현재 검색 상태에서 `page`만 덮어쓴 새로운 파라미터 객체 생성 → 검색 시 사용될 쿼리 객체 빌드
	const buildParams = (overridePage?: number): T => {
		const { page, ...rest } = searchValues;
		return {
			...rest,  // 기본 검색 조건 유지
			page: overridePage ?? 0, // 페이지 override 값 또는 기본값 0
		} as T;
	};

	// 검색 실행 함수 - isReset이 true일 경우 전체 초기화 / 그 외 현재 상태 기준으로 쿼리 파라미터 재설정
	const handleSearch = (isReset = false, currentPage = 0) => {
		if (isReset) {
			handleResetSearchValue();
			return;
		}

		const newParams = buildParams(currentPage);
		setParams(newParams);

		// 검색 시 currentPage === 0이면 page 값을 초기화
		if (currentPage === 0) {
			setSearchValues({ ...searchValues, page: 0 });
		}
	};

	// 페이지 변경 핸들러 - 내부 상태 업데이트 및 변경된 페이지 기반으로 검색 실행
	const handlePageChange = (page: number) => {
		setSearchValues(({ ...searchValues, page }));
		handleSearch(false, page);
	};

	return {
		handleResetSearchValue,
		handleSearch,
		handlePageChange,
	}
}