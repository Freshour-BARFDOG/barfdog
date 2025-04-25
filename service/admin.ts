import { getData, getDataSSR, postData, postDataBlob } from "@src/pages/api/reqData";
import {
	AllianceItem,
	AllianceEventItem,
	ExcelDownloadAllianceCoupon,
	CreateCouponFormValues,
	CreateAllianceFormValues,
	AllianceManagementResponse,
	AllianceManagementQueryParams,
	ExtendedAlliance,
	AllianceCouponListQueryParams,
	AllianceCouponResponse,
	ExcelDownloadIssuedAllianceCoupon,
	AllianceCouponDetail, AllianceDetail, CreateAllianceEvent
} from "../type/admin/alliance/alliance";
import { AxiosResponse } from "axios";

export {
	createAlliance,
	getAllianceList,
	getAllianceEventList,
	createAllianceCoupon,
	downloadExcelAllianceCoupon,
	getAllianceManagementList,
	getAllianceCouponList,
	downloadExcelIssuedAllianceCoupon,
	getAllianceCouponDetail,
	deleteAlliance,
	deleteAllianceCoupon,
	getAllianceDetail,
	createAllianceEvent,
	deleteAllianceEventIds,
};

const createAlliance = async (body: CreateAllianceFormValues) => {
	try {
		const response = await postData('/api/admin/alliance/create', body);
		return response;
	} catch (err) {
		console.log(err)
		throw err.response;
	}
}

const getAllianceList = async (req): Promise<AllianceItem[]> => {
	const { data } = await getDataSSR(req, '/api/admin/alliance');
	// select - options 로 관리하기 위한 데이터 가공
	return data?._embedded?.allianceResponseList.map(item => ({
		label: item.allianceName,
		value: item.allianceId,
		inStock: true,
	})) || [];
}

const getAllianceEventList = async (req): Promise<AllianceEventItem[]> => {
	const { data } = await getDataSSR(req, '/api/admin/alliance/event');
	return data?._embedded?.allianceEventResponseList.map(item => ({
		label: item.allianceName,
		value: item.allianceId,
		eventInfos: item?.eventInfos.map(event => ({ label: event.eventName, value: event.allianceEventId })) || [],
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

function mergeAllianceAndEventInfos(baseList, extendedList) {
	const map = new Map<string, ExtendedAlliance>(extendedList?.map(e => [e.allianceCode, e]));
	return baseList?.map(item => {
		const ext = map.get(item.allianceCode);
		return {
			...item,
			allianceId: ext?.allianceId ?? null,
			eventInfos: ext?.eventInfos ?? [],
		};
	}) || [];
}

const getAllianceManagementList = async (params: AllianceManagementQueryParams): Promise<AllianceManagementResponse> => {
	const searchParams = new URLSearchParams();
	searchParams.set('page', String(params.page));
	searchParams.set('size', String(params.size));

	if (params.allianceName?.trim()) {
		searchParams.set('allianceName', params.allianceName.trim());
	}
	const search = searchParams.toString();

	const { data: data } = await getData(`/api/admin/alliance/management?${search}`);
	const { data: eventData } = await getData('/api/admin/alliance/event');

	const baseList = data?._embedded?.allianceCouponManagementResponseList;
	const extendedList = eventData?._embedded?.allianceEventResponseList;
	const mergedList = mergeAllianceAndEventInfos(baseList, extendedList);

	console.log(mergedList)
	return {
		page: data.page,
		allianceManagementList: mergedList || []
	}
}

const getAllianceCouponList = async (params: AllianceCouponListQueryParams, status: 'ACTIVE' | 'INACTIVE'): Promise<AllianceCouponResponse> => {
	const searchParams = new URLSearchParams();
	searchParams.set('page', String(params.page));
	searchParams.set('size', String(params.size));
	searchParams.set('from', String(params.from));
	searchParams.set('to', String(params.to));
	searchParams.set('couponTarget', String(params.couponTarget));

	if (params.searchType && params.search?.trim()) {
		searchParams.set('searchType', params.searchType);
		searchParams.set('search', params.search.trim());
	}
	const search = searchParams.toString();

	const { data: data } = await getData(`/api/admin/alliance/coupon/${status === 'ACTIVE' ? 'created' : 'deleted'}/history?${search}`);
	return {
		page: data.page,
		allianceCouponList: data?._embedded?.queryAdminAllianceCouponEventResponseList || []
	}
}


const downloadExcelIssuedAllianceCoupon = async (body: ExcelDownloadIssuedAllianceCoupon) => {
	const { allianceCouponBundle, couponStatus } = body;
	const query = new URLSearchParams({
		allianceCouponBundle: allianceCouponBundle,
		couponStatus,
	}).toString();
	const response = await getData(`/api/admin/alliance/coupon/excel-download?${query}`, 'admin', {
		responseType: 'blob',
	});

	if (response?.data) {
		return response?.data;
	} else {
		console.log(response);
	}
}

const getAllianceCouponDetail = async (req, allianceCouponBundle): Promise<AllianceCouponDetail> => {
	const { data } = await getDataSSR(req, `/api/admin/alliance/coupon/created/detail?allianceCouponBundle=${allianceCouponBundle}`);
	return data || {};
}

const getAllianceDetail = async (req, allianceId) => {
	let response;
	if (req) {
		response = await getDataSSR(req, `/api/admin/alliance/${allianceId}/detail`);
	} else {
		response = await getData(`/api/admin/alliance/${allianceId}/detail`);
	}
	return response.data || {};
}

const createAllianceEvent = async (body: CreateAllianceEvent) => {
	const query = new URLSearchParams({
		allianceEventName: body.allianceEventName,
		allianceId: body.allianceId,
	}).toString();
	try {
		const response = await postData(`/api/admin/alliance/allianceEvent/create?${query}`);
		return response;
	} catch (err) {
		throw err.response.data.errors[0];
	}
}

const deleteAlliance = async (allianceIdList: number[]) => {
	const body = {
		allianceIdList: allianceIdList
	};
	const { data } = await postData('/api/admin/alliance/delete', body);
	return data;
}

const deleteAllianceCoupon = async (allianceBundleList: string[]) => {
	const body = {
		allianceBundleList: allianceBundleList
	};
	const { data } = await postData('/api/admin/alliance/coupon/delete', body);
	return data;
}

const deleteAllianceEventIds = async (allianceEventIds: number[]) => {
	const body = {
		allianceEventIds: allianceEventIds
	};
	const { data } = await postData('/api/admin/alliance/allianceEvent/delete', body);
	return data;
}