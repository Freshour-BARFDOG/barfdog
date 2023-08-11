import {general_itemType} from "@store/TYPE/itemType";


type NaverPayCategoryType = "PRODUCT" | "FOOD" | "ETC"; // 바프독에 알맞는 것만 추미
type NaverPayCategoryIdOfPRODUCT = "GENERAL"; // 바프독에 알맞는 것만 추림 (cf. https://developer.pay.naver.com/docs/v2/api#etc-etc_product)
type NaverPayCategoryIdOfFOOD = "DELIVERY"; // 바프독에 알맞는 것만 추림 (cf. https://developer.pay.naver.com/docs/v2/api#etc-etc_product)
type NaverPayCategoryIdOfETC = "ETC"; // 바프독에 알맞는 것만 추림 (cf. https://developer.pay.naver.com/docs/v2/api#etc-etc_product)

interface GeneralProductsInterface {
  categoryType: NaverPayCategoryType;
  categoryId: NaverPayCategoryIdOfPRODUCT | NaverPayCategoryIdOfFOOD | NaverPayCategoryIdOfETC;
  uid: string; // 가맹점 내부의 상품 고유 ID를 활용 (또는 지식쇼핑PID)
  name: string; // 상품명
  count: number; // 상품 주문 개수
}

type GeneralItemType = "RAW" | "GOODS" | "TOPPING";

interface GeneralItemInterface {
  itemId: number;
  amount: number;
  itemType: GeneralItemType;
  name: string;
  selectOptionDtoList: any[];
  memberCouponId: number | null;
  discountAmount: number;
  originalOrderLinePrice: number;
  orderLinePrice: number;
  deliveryFree: boolean;
}

interface GeneralPaymentParam {
  name: string,
  naverPopupMode: boolean; // m_redirect_url : 리디렉션 방식으로 진행(naverPopupMode: false)할 경우 결제 완료 후 리디렉션 될 URL.
  naverChainId: string; /// 네이버페이 그룹형 가맹점용 chain id
  naverProducts: GeneralProductsInterface[];
  // naverMerchantUserKey: string; // 결제 상품이 고위험 업종인 경우 입력 -> 비대상 가맹점은 입력하지 않습니다.
  // naverPurchaserName: string;  // 결제 상품이 고위험 업종인 경우 입력 -> 비대상 가맹점은 입력하지 않습니다.
  // naverPurchaserBirthday: string; // 결제 상품이 고위험 업종인 경우 입력 -> 비대상 가맹점은 입력하지 않습니다.
}


interface GeneralPaymentPropsInterface {
  items: GeneralItemInterface[];
  isMobile: boolean;
}

export const getNaverpayGeneralPaymentParam = ({
                                                items,
                                                isMobile
                                              }: GeneralPaymentPropsInterface): GeneralPaymentParam | null => {
  // Doc: https://github.com/iamport/iamport-manual/blob/master/NAVERPAY/sample/naverpay-pg.md#method
  if (items?.length === 0) return null;
  return {
    name: items[0].name,
    // ####################################################
    // PC = 팝업(IMp.request_pay(param, callback) 사용
    // MOBILE  = Redirect( m_redirect_url ) 사용
    naverPopupMode: !isMobile, // // PC와 모바일 모두 IMP.request_pay(param, callback) 호출 후 파라미터(naverPopupMode) 설정을 통해 팝업 방식(callback 호출) 또는 리디렉션 방식(m_redirect_url로 페이지 이동)으로 진행될 수 있습니다.
    // ####################################################
    naverChainId: process.env.NEXT_PUBLIC_NAVERPAY_GENERAL_CHAIN_ID,
    naverProducts: items.map((item, index) => ({
      categoryType: "PRODUCT", // 네이버페 검수 결과 -> 가맹점 취급 상품이 모두 일반상품으로 분류됨 -> `PRODUCT` 적용
      categoryId: "GENERAL", // 네이버페 검수 결과 -> 가맹점 취급 상품이 모두 일반상품으로 분류됨 -> `GENERAL` 적용
      count: item.amount,
      name: item.name,
      uid: `general-item-${item.itemId}`, // 상품 고유 ID
    }))
  };
}


interface SubsribePaymentParam {
  naverPopupMode: boolean; // m_redirect_url : 리디렉션 방식으로 진행(naverPopupMode: false)할 경우 결제 완료 후 리디렉션 될 URL.
  naverChainId: string; // 네이버페이 그룹형 가맹점용 chain id
  naverProductCode: string; // 기본값은 random으로 자동 생성되어 중복결제가 가능하므로 값을 지정해 주세요. 동일한 고객이 동일상품에 대해 중복으로 반복결제 등록하는 것을 방지하기 위한 파라미터입니다.
}


interface SubscribePaymentPropsInterface {
  subscribeId: number;
  isMobile: boolean;
}

export const getNaverpaySubscribePaymentParam = ({
                                                  subscribeId,
                                                  isMobile
                                                }: SubscribePaymentPropsInterface): SubsribePaymentParam | null => {
  // Doc: https://github.com/iamport/iamport-manual/blob/master/NAVERPAY/sample/naverpay-recurring.md
  if (!subscribeId) return null;
  const suffix = `-orderTime-${new Date().getTime()}`;
  return {
    naverPopupMode: !isMobile,
    naverChainId: process.env.NEXT_PUBLIC_NAVERPAY_SUBSCRIBE_CHAIN_ID,
    naverProductCode: `subscribe-item-${subscribeId}` + suffix // 항상 고유한 값이어야 함 (동일한 값 설정 시, 오류 발생함)
  };
}
