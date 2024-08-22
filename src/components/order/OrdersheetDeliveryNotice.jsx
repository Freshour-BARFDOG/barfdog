import s from '/src/pages/order/ordersheet/ordersheet.module.scss';
import Spinner from '/src/components/atoms/Spinner';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import React, { useEffect, useState } from 'react';
import ErrorMessage from '../atoms/ErrorMessage';
import Image from 'next/image';
import CustomRadioTrueOrFalse from '/src/components/admin/form/CustomRadioTrueOrFalse';

export const OrdersheetDeliveryNotice = ({
  info,
  form,
  setForm,
  itemImgUrlList,
  orderType = 'general',
}) => {
  const initialDeliveryInfos = {
    name: null, // 수령자 이름 ("정기배송과" 묶음 배송일 경우, null => 정기배송 수령자를 따름)
    phone: null, // 수령자 전화번호 (묶음 배송일 경우, null)
    zipcode: null, // 우편번호 (묶음 배송일 경우, null)
    street: null, // 도로명 주소 (묶음 배송일 경우, null)
    city: null,
    detailAddress: null, // 상세주소 (묶음 배송일 경우, null)
    request: null, // 배송 요청사항 (묶음 배송일 경우, null)
  };

  // 묶음배송여부 ! Client ONLY  (cf. 묶음배송아닐 경우, form.deliveryId = null) // 정기구독중이지 않을 경우, 묶음배송기능 아예 작동하지 않게함
  const [bundle, setBundle] = useState(false);
  // 배송정보
  const [deliveryInfo, setDeliveryInfo] = useState(initialDeliveryInfos);

  useEffect(() => {
    const deliveryDto = {};
    for (const key in deliveryInfo) {
      const val = deliveryInfo[key];
      deliveryDto[key] = bundle ? null : val;
    }

    setForm((prevState) => ({
      ...prevState,
      deliveryDto,
      deliveryId: bundle ? info.deliveryId : null,
      deliveryPrice: bundle ? 0 : info.deliveryPrice,
      bundle,
    }));
  }, [deliveryInfo]);

  useEffect(() => {
    // !bundle && form.sameUserInfo ? info.phoneNumber : deliveryInfo.phone || ''
    // // console.log('배송정버 뱐걍 ')
    // {!bundle && form.sameUserInfo ? info.name : deliveryInfo.name || ''}
    if (!info.nextSubscribeDeliveryDate && bundle) {
      alert('묶음배송은 정기배송 중인 상품이 있을 경우에만 가능합니다.');
      setBundle(false);
    }

    setDeliveryInfo((prevState) => ({
      ...prevState,
      name: bundle ? null : info.name,
      phone: bundle ? null : info.phone, // 수령자 전화번호 (묶음 배송일 경우, null)
      zipcode: bundle ? null : info.address?.zipcode, // 우편번호 (묶음 배송일 경우, null)
      street: bundle ? null : info.address?.street, // 도로명 주소 (묶음 배송일 경우, null)
      city: bundle ? null : info.address?.city,
      detailAddress: bundle ? null : info.address?.detailAddress,
      // 상세주소 (묶음 배송일 경우, null)
      request: bundle ? null : info.address?.request, // 배송 요청사항 (묶음 배송일 경우, null)
    }));
    if (bundle) {
      setDeliveryInfo(initialDeliveryInfos);
    }
  }, [bundle, info]);

  return (
    <>
      <div className={s.order_btn}>
        <div className={s.order_btn_title}>
          <div>배송 예정일 안내</div>
        </div>
        <div className={s.delivery_notice_text}>
          <div>
            - 일반 상품(냉동)은 <span>출고까지 최대 7일 소요</span> <br />- 일반
            상품(상온)은 <span>주문 후 1~2일 이내 발송</span> 예정
          </div>
          <p>모든 제품은 출고 후 알림톡이 발송</p>
        </div>
      </div>

      <section className={s.shipping}>
        {/* <h3 className={s.title}>배송 정보</h3>
        <div className={s.box}>
          <ul className={s.grid_box}>
            <li className={s.left_box}>
              <span>{orderType === 'general' ? '일반 상품' : '구독 상품'}</span>
              {orderType === 'general' && form?.orderItemDtoList && (
                <p>
                  {form.orderItemDtoList[0].name}
                  {form.orderItemDtoList.length >= 2 &&
                    ` 외 ${form?.orderItemDtoList.length - 2}건`}
                </p>
              )}
              {orderType === 'subscribe' && (
                <p>{info.recipeNameList?.join(', ')}</p>
              )}
            </li>
            <li className={s.mid_box}>
              <span>배송방법</span>
              <p>배송 예정 일시</p>
            </li>

            <li className={s.right_box}>
              <span>{orderType === 'general' ? '단품주문' : '정기구독'}</span>
              <p> */}
        {/*정기구독 묶음 배송이 true인 경우, 최근 정기배송일자 //// false인 경우,, 단품배송일자*/}
        {/* {orderType === 'general' && (
                  <span>
                    {form.deliveryId
                      ? info.nextSubscribeDeliveryDate
                      : '주문 후 1~2일 이내 배송예정'}
                  </span>
                )}
                {orderType === 'subscribe' && (
                  <span>{form.nextDeliveryDate}&nbsp;</span>
                )}
                (배송 후 카톡 안내)
              </p>
            </li>
          </ul>
        </div> */}
        {info.deliveryId && orderType !== 'subscribe' && (
          <CustomRadioTrueOrFalse
            name="bundle"
            returnBooleanValue
            value={bundle}
            setValue={setBundle}
            labelList={['HIDDEN-LABEL-TRUE', 'HIDDEN_LABEL-FALSE']}
            className={`${s.bundleShipping} ${bundle ? s.active : s.inActive}`}
            components={[
              <div className={s.text} key={'delivery-message-subscribe'}>
                정기구독 배송 시 묶음 배송 신청
                <p>배송비가 추가 되지 않아요</p>
              </div>,
              <div className={s.text} key={'delivery-message-general'}>
                단품 주문으로 별도 배송 요청
                <p>배송비가 추가 됩니다</p>
              </div>,
            ]}
          />
        )}
      </section>
    </>
  );
};
