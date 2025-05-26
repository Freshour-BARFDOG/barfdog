import React, { useEffect, useState } from 'react';
import Layout from '/src/components/common/Layout';
import MetaTitle from '/src/components/atoms/MetaTitle';
import s from './ordersheet.module.scss';
import Modal_termsOfSerivce from '/src/components/modal/Modal_termsOfSerivce';
import { Modal_coupon } from '/src/components/modal/Modal_coupon';
import { postUserObjData } from '/src/pages/api/reqData';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import transformDate from '/util/func/transformDate';
import { OrdersheetItemList } from '/src/components/order/OrdersheetItemList';
import { OrdersheetMemberInfo } from '/src/components/order/OrdersheetMemberInfo';
import { OrdersheetDeliveryForm } from '/src/components/order/OrdersheetDeliveryForm';
import { Payment } from '/src/components/order/Payment';
import { OrdersheetReward } from '/src/components/order/OrdersheetReward';
import { OrdersheetMethodOfPayment } from '/src/components/order/OrdersheetMethodOfPayment';
import { OrdersheetAmountOfPayment } from '/src/components/order/OrdersheetAmountOfPayment';
import { getCookie } from '/util/func/cookie';
import OrdersheetCouponSelector from '../../../components/order/OrdersheetCouponSelector';
import { loadOrderItems } from '../../../../store/cart-slice';

export default function GeneralOrderSheetPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((s) => s.auth);
  const USER_TYPE = auth.userType;

  const cart = useSelector((state) => state.cart);
  const [isLoading, setIsLoading] = useState({ fetching: true });
  const [info, setInfo] = useState({});
  const [form, setForm] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [activeModal, setActiveModal] = useState({
    termsOfService: false,
    coupon: false,
  });

  useEffect(() => {
    dispatch(loadOrderItems());
  }, [dispatch]);

  // 콕뱅크 제휴사 할인 적용 검증
  const hasAllianceDiscount = getCookie('alliance') === 'cb';

  useEffect(() => {
    const raw =
      typeof window !== 'undefined'
        ? localStorage.getItem('orderItemList')
        : null;
    let curItems = [];

    if (raw) {
      try {
        curItems = JSON.parse(raw);
      } catch {
        console.error('orderItemList parse error');
      }
    }

    // 2) Redux 쪽에 값이 있으면 우선 쓰고, 없으면 로컬스토리지 값 사용
    const itemsToUse = cart.orderItemList.length
      ? cart.orderItemList
      : curItems;

    // 3) 둘 다 비어 있으면 /cart 로 리다이렉트
    if (!itemsToUse.length) {
      router.push('/cart');
      return;
    }

    const requestBody = {
      orderItemDtoList: curItems.map((item) => ({
        itemId: item.itemDto.itemId,
        amount: item.itemDto.amount,
        selectOptionDtoList: item.optionDtoList.map((option) => ({
          itemOptionId: option.itemOptionId,
          amount: option.amount,
        })),
      })),
      // allianceType: allianceType,
    };
    console.log('requestBody', requestBody);
    if (Object.keys(info).length > 0) return; // 최초 data fetching 후 Re-rendering 방지
    (async () => {
      setIsLoading((prevState) => ({
        ...prevState,
        item: true,
      }));
      try {
        // API: 상품 주문정보
        // 제휴사 쿼리 파라미터 추가
        const alliance = getCookie('alliance');
        const postItemInfoApiUrl = `/api/orders/sheet/general?alliance=${
          alliance || ''
        }`;

        const res = await postUserObjData(postItemInfoApiUrl, requestBody);
        // 요청 파라미터가 복잡하여 GET이 아닌 POST 사용
        // console.log(res);
        if (res.status !== 200) {
          alert('상품 정보를 확인할 수 없습니다.');
          return (window.location.href = '/cart');
        }
        const info = res.data.data;
        console.log('/api/orders/sheet/general', info);
        // 주문에 대한 모든 데이터
        // console.log('info:  ',info)
        const calcedReward = Number(info.reward) > 0 ? info.reward : 0;
        const initInfo = {
          name: info.name, // 구매자
          email: info.email, // 연락처
          phone: info.phoneNumber,
          defaultAddress: {
            city: info.defaultAddress.city, // 시도
            deliveryName: '',
            street: info.defaultAddress.street, // 도로명 주소
            detailAddress: info.defaultAddress.detailAddress, // 상세주소
            zipcode: info.defaultAddress.zipcode, // 우편번호
          },
          orderStatus: info.orderStatus, // 묶음 배송 관련 상태값: UNSUBSCRIBE_ORDER 구독중이 아닌 경우, TODAY_IS_NEXT_DELIVERY 오늘이 배송예정일인 경우, SUBSCRIBE_ORDER 묶음 배송이 가능한 경우
          deliveryId: info.deliveryId, // ! IMPORTANT : 묶음 배송할 정기구독 배송 ID (묶음배송 불가능할 경우 null / 묶음 배송 불가할 경우, 배송정보의 묶음배송 Radio input 비활성화)
          nextSubscribeDeliveryDate: info.nextSubscribeDeliveryDate, // ! IMPORTANT: 묶음배송할 배송 예정일 . 묶음배송 불가능한 경우 null
          coupons:
            // DUMMY_MEMEBER_COUPON_LIST ||
            info.coupons?.map((cp) => ({
              memberCouponId: cp.memberCouponId,
              name: cp.name,
              discountType: cp.discountType,
              discountDegree: cp.discountDegree,
              availableMaxDiscount: cp.availableMaxDiscount,
              availableMinPrice: cp.availableMinPrice,
              remaining: cp.remaining,
              expiredDate: transformDate(cp.expiredDate),
            })) || [], //////////// ! DUMMY DATA
          allianceCoupons:
            info.allianceCoupons?.map((cp) => ({
              memberCouponId: cp.memberCouponId,
              name: cp.name,
              discountType: cp.discountType,
              discountDegree: cp.discountDegree,
              availableMaxDiscount: cp.availableMaxDiscount,
              availableMinPrice: cp.availableMinPrice,
              expiredDate: transformDate(cp.expiredDate),
            })) || [],
          orderPrice: info.orderPrice, //  장바구니 또는 결제 전 상품의 "최종 가격" (기본 어드민 설정할인율 적용 / 결제페이지의 쿠폰 및 적립금 적용 전 가격)
          reward: calcedReward, // 적립금
          deliveryPrice: alliance ? 0 : getDeliveryPrice(info), // 배송비 : 장바구니에서, 최종 배송비
          freeCondition: info.freeCondition, // 사이트 > 배송비 무료 조건
          brochure: info.brochure, // 브로슈어 받은 적 있는지 true/false => 브로슈어는 1번만 받을 수 있다.
          totalOrderPrice: info.orderPrice,
          totalOriginalPrice: info.orderItemDtoList
            ?.map((item) => item.originalOrderLinePrice)
            .reduce((acc, cur) => acc + cur),
        };
        // FormDatas
        const initForm = {
          selfInfo: {
            reward: calcedReward, // ! CLIENT ONLY
            discountGrade: 0, // 일반주문일 경우, 등급할인 없음
          },
          coupons:
            info.coupons?.map((cp) => ({
              memberCouponId: cp.memberCouponId,
              name: cp.name,
              discountType: cp.discountType,
              discountDegree: cp.discountDegree,
              availableMaxDiscount: cp.availableMaxDiscount,
              availableMinPrice: cp.availableMinPrice,
              remaining: cp.remaining,
              expiredDate: transformDate(cp.expiredDate),
            })) || [],
          allianceCoupons:
            info.allianceCoupons?.map((cp) => ({
              memberCouponId: cp.memberCouponId,
              name: cp.name,
              discountType: cp.discountType,
              discountDegree: cp.discountDegree,
              availableMaxDiscount: cp.availableMaxDiscount,
              availableMinPrice: cp.availableMinPrice,
              expiredDate: transformDate(cp.expiredDate),
            })) || [],
          orderItemDtoList: info.orderItemDtoList?.map((item) => ({
            itemId: item.itemId, // 상품 ID
            amount: item.amount, // 상품 수량
            name: item.name, // 상품명
            itemType: item.itemType, // 상품 카테고리 [ RAW, TOPPING, GOODS ]
            selectOptionDtoList:
              item.optionDtoList.map((op) => ({
                itemOptionId: op.optionId, // 옵션 ID
                amount: op.amount, // 옵션 수량
                name: op.name, // 옵션 이름 ! CLIENT ONLY
                price: op.price, // 옵션 가격 ! CLIENT ONLY
              })) || [],
            memberCouponId: null, // 사용한 쿠폰 ID // 데이터뿌릴떄
            discountAmount: 0, // 쿠폰할인 총계
            originalOrderLinePrice: item.originalOrderLinePrice, // 관리자 페이지에서 설정한 '할인 전' "상품 + 옵션" 가격
            orderLinePrice: item.orderLinePrice, // 쿠폰 적용 후, 주문내역 내의 한 줄 "상품 + 옵션"에 대한 최종가격
            deliveryFree: item.deliveryFree, // 무료 배송 여부
          })),
          deliveryDto: {
            name: null, // 수령자 이름 ("정기배송과" 묶음 배송일 경우, null => 정기배송 수령자를 따름)
            phone: null, // 수령자 전화번호 (묶음 배송일 경우, null)
            zipcode: null, // 우편번호 (묶음 배송일 경우, null)
            street: null, // 도로명 주소 (묶음 배송일 경우, null)
            detailAddress: null, // 상세주소 (묶음 배송일 경우, null)
            deliveryName: null, // 배송지명 (묶음 배송일 경우, null)
            request: null, // 배송 요청사항 (묶음 배송일 경우, null)
          },
          deliveryId: info.deliveryId, // ! IMPORTANT : 묶음 배송일 경우 , info.deliveryId값 추가/ 일반배송: null)
          deliveryPrice: getDeliveryPrice(info), // 배송비
          discountTotal: 0, // 총 할인 합계
          discountReward: 0, // 사용할 적립금
          discountCoupon: 0, // 쿠폰 적용으로 인한 할인금
          overDiscount: 0, // 초과할인금 (23.02 바프독측 요구사항: 초과할인존재 시, 최소금액 결제 기능)
          paymentPrice: 0, // 최종 결제 금액
          paymentMethod: null, // 결제방법  [CREDIT_CARD, NAVER_PAY, KAKAO_PAY]
          agreePrivacy: false, // 개인정보 제공 동의
          brochure: false, // 브로슈어 수령여부
          orderPrice: info?.orderItemDtoList
            .map((item) => item.orderLinePrice)
            .reduce((acc, cur) => acc + cur), //  주문 상품 총 가격 ( 주문금액 -쿠폰할인 -적립금)
        };
        setInfo(initInfo);
        setForm(initForm);
      } catch (err) {
        console.error(err);
      }
      setIsLoading((prevState) => ({
        ...prevState,
        item: false,
      }));
    })();
    // }, [cart]);
  }, []);

  const onActivleModalHandler = (e) => {
    const button = e.currentTarget;
    const modalType = button.dataset.modalType;
    const selectedItemId = button.dataset.itemId;
    setSelectedItemId(selectedItemId);
    setActiveModal((prevState) => ({
      ...prevState,
      [modalType]: !prevState[modalType],
    }));
  };

  // validation
  // - 1. 상품정보 없이 , 해당 페이지에 접근했을 경우
  // - 2. 새로고침했을 경우 : REDUX정보 초기화됨
  //    > 이때, Shop Item Detail페이지에서 가져온 정보 초기화되어, 서버에서 데이터 가져올 수 없음)
  // if (!info || !USER_TYPE || USER_TYPE === userType.NON_MEMBER) return;

  return (
    <>
      <MetaTitle title="주문서" />
      <Layout>
        <div className={s.container_outer}>
          <div className={s.Wrapper}>
            <OrdersheetItemList
              form={form}
              setForm={setForm}
              isLoading={isLoading}
              event={{ onActiveModal: onActivleModalHandler }}
            />
            <OrdersheetMemberInfo info={info} />
            <OrdersheetDeliveryForm
              info={info}
              form={form}
              setForm={setForm}
              formErrors={formErrors}
              setFormErrors={setFormErrors}
            />
            <OrdersheetCouponSelector
              info={info}
              form={form}
              setForm={setForm}
              itemInfo={{ orderPrice: info.orderPrice }}
              event={{ onActiveModal: onActivleModalHandler }}
            />
            <OrdersheetReward
              id={'discountReward'}
              info={info}
              form={form}
              setForm={setForm}
              formErrors={formErrors}
              setFormErrors={setFormErrors}
            />
            <OrdersheetMethodOfPayment
              id={'paymentMethod'}
              info={info}
              form={form}
              setForm={setForm}
              formErrors={formErrors}
            />
            <OrdersheetAmountOfPayment
              info={info}
              form={form}
              setForm={setForm}
              event={{ onActiveModal: onActivleModalHandler }}
              formErrors={formErrors}
              hasAllianceDiscount={hasAllianceDiscount}
            />
            <section className={s.final_btn}>
              <p>
                위 주문 내용을 확인 하였으며, 회원 본인은 결제에 동의합니다.
              </p>
              {/* 결제버튼 */}
              <Payment
                hasAllianceDiscount={hasAllianceDiscount}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                info={info}
                form={form}
                setFormErrors={setFormErrors}
              />
            </section>
          </div>
        </div>
      </Layout>
      {activeModal.termsOfService && (
        <Modal_termsOfSerivce
          modalState={activeModal.termsOfService}
          setModalState={setActiveModal}
        />
      )}
      {activeModal.coupons && (
        <Modal_coupon
          onModalActive={setActiveModal}
          itemInfo={{ orderPrice: info.orderPrice }}
          info={info}
          form={form}
          setForm={setForm}
        />
      )}
    </>
  );
}

function getDeliveryPrice(info) {
  const isAllItemDeliveryFree =
    info.orderItemDtoList.filter((item) => !item.deliveryFree).length === 0;
  const isPaymentPriceFreeCondition = info.orderPrice >= info.freeCondition;
  return isAllItemDeliveryFree || isPaymentPriceFreeCondition
    ? 0
    : info.deliveryPrice;
}
