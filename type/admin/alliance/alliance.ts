import { couponUseType } from "@store/TYPE/couponType";
import { discountUnitType } from "@store/TYPE/discountUnitType";

export type {
	AllianceItem,
	AllianceEventItem,
	ExcelDownloadAllianceCoupon,
	CreateCouponFormValues,
};

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