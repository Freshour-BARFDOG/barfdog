import React, { useEffect, useState } from 'react';
import Layout from '/src/components/common/Layout';
import MetaTitle from '/src/components/atoms/MetaTitle';
import s from '../ordersheet.module.scss';
import Modal_termsOfSerivce from '/src/components/modal/Modal_termsOfSerivce';
import { Modal_coupon } from '/src/components/modal/Modal_coupon';
import { getData } from '/src/pages/api/reqData';
import transformDate, { transformToday } from '/util/func/transformDate';
import { OrdersheetSubscribeItemList } from '/src/components/order/OrdersheetSubscribeItemList';
import { OrdersheetMemberInfo } from '/src/components/order/OrdersheetMemberInfo';
import { OrdersheetDeliveryForm } from '/src/components/order/OrdersheetDeliveryForm';
import { Payment } from '/src/components/order/Payment';
import { OrdersheetReward } from '/src/components/order/OrdersheetReward';
import { OrdersheetMethodOfPayment } from '/src/components/order/OrdersheetMethodOfPayment';
import { OrdersheetAmountOfPayment } from '/src/components/order/OrdersheetAmountOfPayment';
import { calcNextSubscribeDeliveryDate } from '/util/func/calcNextSubscribeDeliveryDate';
import { subscribePriceCutOffUnit } from '/util/func/subscribe/calcSubscribePrices';
import { seperateStringViaComma } from '/util/func/seperateStringViaComma';
import { subscribePlanType } from '../../../../../store/TYPE/subscribePlanType';
import { FullScreenRunningDog } from '../../../../components/atoms/FullScreenLoading';
import { useRouter } from 'next/router';
import { redirectTo } from 'util/func/redirectTo';

const initInfo = {};

export default function SubscribeOrderSheetPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState({ fetching: true });
  const [isRendered, setIsRendered] = useState(false);
  const [info, setInfo] = useState(initInfo);
  const [form, setForm] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [activeModal, setActiveModal] = useState({
    termsOfService: false,
    coupon: false,
  });

  useEffect(() => {
    if (window && typeof window !== 'undefined') {
      setIsRendered(true);
    }
  }, []);

  useEffect(() => {
    // Validation - 구독 결제정보가 불충분한 경우
    const invalidPaymentPrice = info.subscribeDto?.nextPaymentPrice === 0;
    const afterInitialize = info !== initInfo;
    if (afterInitialize && invalidPaymentPrice) {
      alert(
        '[ERROR] 구독상품 결제금액이 설정되지 않았습니다. `맞춤레시피 구매하기`를 진행해주세요.',
      );
      redirectTo('/mypage/dogs');
      return;
    }

    // Validation - 결제정보를 정상적으로 받은 후, 데이터요청 X (최초 1회만 request 실행.)
    if (afterInitialize) return; // console.log('[INFO] 구독결제 정보가 올바르게 설정되었습니다.');

    // Request Subscribe Data
    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: true,
        }));

        const url = `/api/planDiscount`;
        const planDiscountRes = await getData(url);
        // console.log('----- planDiscountRes: ', planDiscountRes);
        let subscribePlanInfo = {};
        if (planDiscountRes.data && planDiscountRes.status === 200) {
          // plan_discount 테이블 정보를 data 에 저장
          const data =
            planDiscountRes.data._embedded.planDiscountResponseDtoList[0];
          // 콕뱅크 할인율 할때 이부분 수정하면됨
          subscribePlanInfo[subscribePlanType.FULL.NAME] = data.full;
          subscribePlanInfo[subscribePlanType.HALF.NAME] = data.half;
          subscribePlanInfo[subscribePlanType.TOPPING.NAME] = data.topping;
        }

        const subscribeId = router.query.subscribeId;
        const apiUrl = `/api/orders/sheet/subscribe/${subscribeId}`;
        const body = {
          id: subscribeId,
        };
        const res = await getData(apiUrl, body);
        // console.log("/api/orders/sheet/subscribe/${subscribeId} = ",res.data)
        if (res.status !== 200) {
          alert('주문 정보를 확인할 수 없습니다.');
          return (window.location.href = '/');
        }
        const data = res.data;
        // console.log(data);

        //! [추가] 계산된 등급할인 (discountGrade)
        // discountGrade =nextPaymentPrice * gradeDiscountPercent / 100
        // 계산 후 소수점 1의자리에서 반올림 -> 정수값 리턴
        const calculatedDiscountGrade = Math.round(
          (data.subscribeDto.nextPaymentPrice * data.gradeDiscountPercent) /
            100,
        );

        // 주문에 대한 모든 데이터
        const initInfo = {
          subscribeDto: {
            id: data.subscribeDto.id,
            plan: data.subscribeDto.plan,
            nextPaymentPrice: data.subscribeDto.nextPaymentPrice,
            originPrice: calcSubscribePlanOriginPrice({
              discountPercent: subscribePlanInfo[data.subscribeDto.plan],
              paymentPrice: data.subscribeDto.nextPaymentPrice,
            }),
            // discountGrade: data.subscribeDto.discountGrade, // 등급할인 (할인표기에 사용)
            discountGrade: calculatedDiscountGrade, //! [수정] 계산된 등급할인 값
            oneMealGramsPerRecipeList: seperateStringViaComma(
              data.subscribeDto.oneMealGramsPerRecipe,
              'number',
            ), // 각 레시피별 한 팩 무게 (2개 이상 시, 콤마[(,]구분)
          },
          recipeNameList: data.recipeNameList, // [] 구독으로 선택한 레시피 이름 리스트 // FULL-PLAN일 경우, 최대 2개
          name: data.name, // 구매자
          email: data.email, // 연락처
          phone: data.phoneNumber,
          grade: data.grade, // ! SUBSCRIBE ONLY
          gradeDiscountPercent: data.gradeDiscountPercent, // ! SUBSCRIBE ONLY
          address: {
            city: data.address.city, // 시도
            street: data.address.street, // 도로명 주소
            detailAddress: data.address.detailAddress, // 상세주소
            zipcode: data.address.zipcode, // 우편번호
          },
          deliveryPrice: 0, // 정기구독 배송비: 무료
          reward: data.reward,
          brochure: data.brochure, // 브로슈어 받은 적 있는지 true/false => 브로슈어는 1번만 받을 수 있다.
        };

        // FormDatas
        const initForm = {
          selfInfo: {
            reward: data.reward,
            // discountGrade: data.subscribeDto?.discountGrade || null, // 등급할인 // 정기구독 할인금액 산출 시 사용
            discountGrade: calculatedDiscountGrade || null, //! [수정] 계산된 등급할인 값
          },
          coupons:
            data.coupons?.map((cp) => ({
              memberCouponId: cp.memberCouponId,
              name: cp.name,
              discountType: cp.discountType,
              discountDegree: cp.discountDegree,
              availableMaxDiscount: cp.availableMaxDiscount,
              availableMinPrice: cp.availableMinPrice,
              remaining: cp.remaining,
              expiredDate: transformDate(cp.expiredDate),
            })) || [],
          deliveryDto: {
            name: null, // 수령자 이름 ("정기배송과" 묶음 배송일 경우, null => 정기배송 수령자를 따름)
            phone: null, // 수령자 전화번호 (묶음 배송일 경우, null)
            zipcode: null, // 우편번호 (묶음 배송일 경우, null)
            street: null, // 도로명 주소 (묶음 배송일 경우, null)
            detailAddress: null, // 상세주소 (묶음 배송일 경우, null)
            request: null, // 배송 요청사항 (묶음 배송일 경우, null)
          },
          orderPrice: data.subscribeDto.nextPaymentPrice,
          deliveryPrice: 0, // 배송비
          discountTotal: 0, // 총 할인 합계
          discountReward: 0, // 사용할 적립금
          discountCoupon: 0, // 쿠폰 적용으로 인한 할인금
          overDiscount: 0, // 초과할인금 (23.02 바프독측 요구사항: 초과할인존재 시, 최소금액 결제 기능)
          paymentPrice: data.subscribeDto.nextPaymentPrice, // 최종 결제 금액
          paymentMethod: null, // 결제방법  [CREDIT_CARD, NAVER_PAY, KAKAO_PAY]
          // nextDeliveryDate: getDiffDate(1), // ! TEST CODE :  테스트로, 1일 이후 배송이 시작되는 것으로 설정함 (221020)
          //   ! PRODUCT CODE
          nextDeliveryDate: calcNextSubscribeDeliveryDate(
            transformToday(),
            null,
          ), // 배송 예정일 'yyyy-MM-dd', 첫 결제 배송날짜는 프론트에서 넘어온 값으로 저장함
          agreePrivacy: false, // 개인정보 제공 동의
          brochure: false, // 브로슈어 수령여부
        };
        setInfo(initInfo);
        setForm(initForm);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: false,
        }));
      }
    })();

    const calcSubscribePlanOriginPrice = ({
      discountPercent,
      paymentPrice,
    }) => {
      const originPrice = paymentPrice * (100 / (100 - discountPercent));
      return (
        Math.floor(originPrice / subscribePriceCutOffUnit) *
        subscribePriceCutOffUnit
      );
    };
  }, [info]);

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

  if (isLoading.fetching) {
    return <FullScreenRunningDog />;
  }

  return (
    <>
      <MetaTitle title="정기구독 주문서" />
      <Layout>
        <div className={s.container_outer}>
          <div className={s.Wrapper}>
            {form && (
              <OrdersheetSubscribeItemList
                orderType={'subscribe'}
                info={info}
                form={form}
                setForm={setForm}
                isLoading={isLoading}
                event={{ onActiveModal: onActivleModalHandler }}
              />
            )}
            <OrdersheetMemberInfo info={info} />
            {isRendered && (
              <OrdersheetDeliveryForm
                orderType={'subscribe'}
                info={info}
                form={form}
                setForm={setForm}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
              />
            )}
            <OrdersheetReward
              orderType={'subscribe'}
              id={'discountReward'}
              info={info}
              form={form}
              setForm={setForm}
              formErrors={formErrors}
              setFormErrors={setFormErrors}
            />
            <OrdersheetMethodOfPayment
              id={'paymentMethod'}
              orderType={'subscribe'}
              info={info}
              form={form}
              setForm={setForm}
              formErrors={formErrors}
            />
            <OrdersheetAmountOfPayment
              orderType={'subscribe'}
              info={info}
              form={form}
              setForm={setForm}
              event={{ onActiveModal: onActivleModalHandler }}
              formErrors={formErrors}
            />
            <section className={s.final_btn}>
              <p>
                위 주문 내용을 확인 하였으며, 회원 본인은 결제에 동의합니다.
              </p>
              <Payment
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                info={info}
                form={form}
                setFormErrors={setFormErrors}
                orderType={'subscribe'}
              />
              {/* 결제버튼 */}
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
          orderType={'subscribe'}
          onModalActive={setActiveModal}
          itemInfo={info.subscribeDto}
          info={info}
          form={form}
          setForm={setForm}
        />
      )}
    </>
  );
}
