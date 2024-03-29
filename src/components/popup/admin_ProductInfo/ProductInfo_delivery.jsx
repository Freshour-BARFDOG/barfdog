import s from './popup_sell.module.scss';
import { transformPhoneNumber } from '/util/func/transformPhoneNumber';
import transformDate from '/util/func/transformDate';
import React from 'react';
import popupWindow from '../../../../util/func/popupWindow';

const ProductInfo_delivery = ({ deliveryInfo }) => {
  const onPopupHandler = (e) => {
    e.preventDefault();
    if (typeof window === 'undefined')
      return console.error('window is not defined');
    const href = e.currentTarget.href;
    popupWindow(href, { width: 540, height: 480, left: 200, top: 100 });
  };

  return (
    <>
      <div className={s['t-header']}>
        <h4 className={s.title}>배송정보</h4>
      </div>
      <ul className={s['t-body']}>
        <li className={`${s['t-row']}`}>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>수취인명</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{deliveryInfo.recipientName}</span>
            </div>
          </div>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>연락처</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{transformPhoneNumber(deliveryInfo.recipientPhone)}</span>
            </div>
          </div>
        </li>
        <li className={`${s['t-row']} ${s['fullWidth']}`}>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>배송지 주소</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{`${deliveryInfo.street} ${deliveryInfo.detailAddress} (우편번호: ${deliveryInfo.zipcode})`}</span>
            </div>
          </div>
        </li>
        <li className={`${s['t-row']} ${s['fullWidth']}`}>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>배송 요청사항</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{deliveryInfo.request || '-'}</span>
            </div>
          </div>
        </li>

        <li className={`${s['t-row']}`}>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>발송처리일</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>
                {transformDate(deliveryInfo.departureDate, 'time', {
                  seperator: '/',
                }) || '-'}
              </span>
            </div>
          </div>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>배송완료일</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>
                <span>
                  {transformDate(deliveryInfo.arrivalDate, 'time', {
                    seperator: '/',
                  }) || '-'}
                </span>
              </span>
            </div>
          </div>
        </li>
        <li className={`${s['t-row']} ${s.autoHeight}`}>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}  ${s['auto-height']}`}>
              <span>송장번호</span>
            </div>
            <div className={`${s.innerBox} ${s.cont} ${s['auto-height']}`}>
              {!deliveryInfo.deliveryNumber ? (
                '-'
              ) : (
                <>
                  <span>
                    {deliveryInfo.deliveryCode === 'EPOST'
                      ? '우체국 '
                      : '대한통운 '}
                    {deliveryInfo.deliveryNumber}
                  </span>
                  <span>
                    <a
                      // 배송지키미
                      href={`https://trace.goodsflow.com/VIEW/V1/whereis/${process.env.NEXT_PUBLIC_GOODSFLOW_SITECODE}/${deliveryInfo.deliveryCode}/${deliveryInfo.deliveryNumber}`}
                      // href={`http://nexs.cjgls.com/web/service02_01.jsp?slipno=${deliveryInfo.deliveryNumber}`}
                      target="_blank"
                      className="admin_btn line basic_s"
                      rel={'noreferrer'}
                      onClick={onPopupHandler}
                    >
                      배송조회
                    </a>
                  </span>
                </>
              )}
            </div>
          </div>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>구매확정일</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>
                {transformDate(deliveryInfo.orderConfirmDate, 'time', {
                  seperator: '/',
                }) || '-'}
              </span>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
};

export default ProductInfo_delivery;
