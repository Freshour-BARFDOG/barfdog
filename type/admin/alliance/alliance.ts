import { couponUseType } from "@store/TYPE/couponType";
import { discountUnitType } from "@store/TYPE/discountUnitType";

export type {
	CreateAllianceFormValues,
	AllianceItem,
	AllianceEventItem,
	ExcelDownloadAllianceCoupon,
	CreateCouponFormValues,
	AllianceManagementItem,
	AllianceManagementResponse,
	AllianceManagementQueryParams,
	ExtendedAlliance,
	AllianceCouponListQueryParams,
	AllianceCouponResponse,
	ExcelDownloadIssuedAllianceCoupon,
	AllianceCouponDetail,
	AllianceDetail,
	CreateAllianceEvent,
};

interface CreateAllianceFormValues {
	allianceName: string;
	allianceCode: string;
	eventNameList: string[];
}

interface AllianceItem {
	label: string;
	value: string;
	inStock: boolean;
}

interface AllianceEventItem {
	label: string;
	value: string;
	eventNameList: string[];
}

interface ExcelDownloadAllianceCoupon {
	bundle: string;
	useStartDate: string;
	useExpiredDate: string;
	couponPublishCount: number;
}

interface CreateCouponFormValues {
	allianceId: string;
	eventName: string;
	name: string;
	description: string;
	couponTarget: Exclude<keyof typeof couponUseType, 'KOR'>;
	discountDegree: number;
	discountType: Exclude<keyof typeof discountUnitType, 'KOR'>;
	availableMaxDiscount: number;
	availableMinPrice: number;
	createCouponCount: number;
	codeLength: number;
	useStartDate: string;
	useExpiredDate: string;
}

interface Page {
	size: number;
	totalElements: number;
	totalPages: number;
	number: number;
}

interface EventInfos {
	allianceEventId: number;
	eventName: string;
}

interface AllianceManagementItem {
	allianceName: string;
	eventCount: number;
	allianceCode: string;
	createdCouponCount: number;
	registeredCount: number;
	usedCount: number;
	allianceId: number;
	eventInfos: EventInfos[];
}

interface AllianceManagementQueryParams {
	page: number;
	size?: number;
	allianceName?: string;
}

interface AllianceManagementResponse {
	allianceManagementList: AllianceManagementItem[];
	page: Page;
}


interface ExtendedAlliance {
	allianceId: number;
	allianceCode: string;
	allianceName: string;
	eventInfos: string[];
};

type AllianceCouponListSearchType = 'ALLIANCE' | 'ALLIANCE_COUPON_NAME' | 'EVENT';
type CouponTarget = 'ALL' | 'GENERAL' | 'SUBSCRIBE';

interface AllianceCouponListQueryParams {
	page: number;
	size?: number;
	from: string;
	to: string;
	searchType?: AllianceCouponListSearchType;
	search?: string;
	couponTarget: CouponTarget;
}

interface AllianceCouponItem {
	allianceId: number;
	allianceEventId: number;
	allianceName: string;
	eventName: string;
	couponName: string;
	discountDegree: string;
	couponCount: number;
	useStartDate: string;
	useExpiredDate: string;
	registrationCount: number;
	usedCount: number;
	bundle: string;
}

interface AllianceCouponResponse {
	allianceCouponList: AllianceCouponItem[];
	page: Page;
}

interface ExcelDownloadIssuedAllianceCoupon {
	allianceCouponBundle: string;
	couponStatus: 'ACTIVE' | 'INACTIVE';
}

interface AllianceCouponInfo {
	createdCouponDate: string;
	allianceName: string;
	eventName: string;
	couponName: string;
	couponDescription: string;
	couponTarget: string;
	discountDegree: string;
	availableMaxDiscount: number;
	availableMinPrice: number;
	couponCount: number;
	couponCodeLength: number;
	useStartDate: string;
	useExpiredDate: string;
}
interface AllianceCouponUsedHistory {
	couponCreatedCount: number;
	usedCouponCount: number;
	generalItemCount: number;
	subscriptionItemCount: number;
}

interface AllianceCouponDetail {
	couponInfo: AllianceCouponInfo;
	couponUsedHistory: AllianceCouponUsedHistory;
}

interface AllianceInfo extends CreateAllianceFormValues {
	createdCouponCount: number;
}

type AllianceCouponUsedInfo = Omit<AllianceCouponUsedHistory, 'couponCreatedCount'> & {
	registeredCouponCount: number;
};

interface AllianceEventInfo {
	allianceEventId: number;
	createdEventDate: string;
	eventName: string;
	eventCouponCreatedCount: number;
	eventCouponRegisteredCount: number;
	eventUsedCount: number;
	eventGeneralItemCount: number;
	eventSubscriptionItemCount: number;
	eventStatus: 'ACTIVE' | 'INACTIVE';
}

interface AllianceDetail {
	allianceInfo: AllianceInfo;
	allianceCouponUsedInfo: AllianceCouponUsedInfo;
	allianceEventInfos: AllianceEventInfo[];
}

interface CreateAllianceEvent {
	allianceEventName: string;
	allianceId: string;
}