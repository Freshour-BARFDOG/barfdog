import axios from "axios";
import { ObesityDetailResponse } from "type/aiObesityAnalysis/aiObesityAnalysis";

const externalAxios = axios.create({
	baseURL: '',
});

const getObesityDetail = async (surveyId: number): Promise<ObesityDetailResponse> => {
	const res = await externalAxios.get(`/api/obesity`, {
		params: { surveyId },
	});
	return res.data;
};

const uploadObesityImage = async (file: File, weight: number) => {
	const formData = new FormData();
	formData.append('file', file);
	formData.append('weight', weight.toString());

	const { data } = await externalAxios.post('/api/obesity-upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

	return data;
};

/**
 * 단일 아이템 정보를 가져오는 함수
 * @param itemId - 아이템 ID
 * @returns 아이템 정보
 */
const getItemById = async (itemId: number) => {
	try {
		const { data } = await axios.get(`/api/items/${itemId}`);
		return {
			id: data.itemDto.id,
			name: data.itemDto.name,
			description: data.itemDto.description,
			originalPrice: data.itemDto.originalPrice,
			salePrice: data.itemDto.salePrice,
			inStock: data.itemDto.inStock,
			imageUrl: data.itemImageDtoList[0].url,
			discountDegree: data.itemDto.discountDegree,
			discountType: data.itemDto.discountType,
		};
	} catch (error) {
		console.error(`아이템 ${itemId} 조회 실패:`, error);
		return null; // 실패한 경우 null 반환
	}
};

/**
 * 여러 아이템 ID로 아이템 리스트를 병렬로 가져오는 함수
 * @param itemIds - 아이템 ID 배열
 * @returns 아이템 정보 배열 (실패한 아이템은 제외)
 */
const getItemsByIds = async (itemIds: number[]) => {
	try {
		const promises = itemIds.map(id => getItemById(id));
		const results = await Promise.allSettled(promises);
		
		return results
			.filter((result): result is PromiseFulfilledResult<any> => 
				result.status === 'fulfilled' && result.value !== null
			)
			.map(result => result.value);
	} catch (error) {
		console.error('아이템 리스트 조회 실패:', error);
		return [];
	}
};

export {
	getObesityDetail,
	uploadObesityImage,
	getItemById,
	getItemsByIds,
}