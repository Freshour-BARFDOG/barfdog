import { getDataSSR, postData, postDataBlob } from "@src/pages/api/reqData";
import {
	AllianceItem,
	AllianceEventItem,
	ExcelDownloadAllianceCoupon,
	CreateCouponFormValues
} from "../type/admin/alliance/alliance";
import { AxiosResponse } from "axios";

export { getAllianceList, getAllianceEventList, createAllianceCoupon, downloadExcelAllianceCoupon };

const getAllianceList = async (req): Promise<AllianceItem[]> => {
	const { data } = await getDataSSR(req, '/api/alliance');
	// select - options 로 관리하기 위한 데이터 가공
	return data._embedded.allianceResponseDtoList.map(item => ({
		label: item.allianceName,
		value: item.allianceId,
		inStock: true,
	})) || [];
}

const getAllianceEventList = async (req): Promise<AllianceEventItem[]> => {
	const { data } = await getDataSSR(req, '/api/alliance/event');
	return data?._embedded?.allianceEventResponseList.map(item => ({
		label: item.allianceName,
		value: item.allianceId,
		eventNameList: item?.eventNameList || [],
	})) || [];
}

const createAllianceCoupon = async (body: CreateCouponFormValues) => {
	try {
		const response = await postData('/api/admin/coupons/alliance/create', body);
		return response;
	} catch (err) {
		throw err.response.data.errors[0];
	}
}

const downloadExcelAllianceCoupon = async (body: ExcelDownloadAllianceCoupon ) => {
	const { bundle, couponPublishCount, useExpiredDate, useStartDate } = body;
	const query = new URLSearchParams({
		bundle,
		couponPublishCount: String(couponPublishCount),
		useExpiredDate: useExpiredDate,
		useStartDate,
	}).toString();
	const response = await postDataBlob(`/api/admin/coupons/excel-download?${query}`) as AxiosResponse<Blob> | undefined;

	if (response?.data && response?.data instanceof Blob) {
		return response?.data;
	} else {
		console.error('다운로드 응답이 유효하지 않습니다.');
	}
}