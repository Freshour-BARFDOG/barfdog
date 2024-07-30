import React, { useCallback, useEffect, useState } from 'react';
import s from '../../subscribe.module.scss';
import LayoutWithoutFooter from '/src/components/common/LayoutWithoutFooter';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Image from 'next/image';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import Spinner from '/src/components/atoms/Spinner';
import { EmptyContMessage } from '/src/components/atoms/emptyContMessage';
import Link from 'next/link';
import { subscribePlanType } from '/store/TYPE/subscribePlanType';
import transformDate from '/util/func/transformDate';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import { subscribeStatus } from '/store/TYPE/subscribeStatus';
import { calcSubscribeNextPaymentPrice } from '/util/func/subscribe/calcSubscribeNextPaymentPrice';
import { getDefaultPagenationInfo } from '/util/func/getDefaultPagenationInfo';
import { useRouter } from 'next/router';
import { SubscribeStatusTag } from '/src/components/subscribe/SubscribeStatusTag';
import { transformPhoneNumber } from '/util/func/transformPhoneNumber';
import { getData } from '../../../../api/reqData';
import { formattedProductionAndReceivingDate } from '../../../../../../util/func/formattedProductionAndReceivingDate';

export default function SubscribeDeliveryPage({ data }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState({});
  const [addressInfo, setAddressInfo] = useState();

  useEffect(() => {
    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: true,
        }));
        const apiUrl = `/api/address/subscribe/${data.subscribeId}`;
        const res = await getData(apiUrl);

        const addressInfo = res.data;

        console.log(res);

        if (res.status === 200) {
          setAddressInfo(addressInfo);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: false,
        }));
      }
    })();
  }, []);

  const onSaveHandler = async () => {
    // 1. 기본 주소 등록
    // if (addressStatus === 'default') {
    //   if (!selectedItemId) {
    //     return alert('배송지를 선택해주세요.');
    //   } else if (selectedItemId) {
    //     const url = `/api/address/default/${selectedItemId}`;
    //     try {
    //       const res = await postData(url);
    //       // console.log(res);
    //       if (res.status === 200) {
    //         // POST req body update
    //         setForm((prev) => ({
    //           ...prev,
    //           deliveryDto: {
    //             name: deliveryInfo.recipientName,
    //             phone: deliveryInfo.phoneNumber,
    //             zipcode: deliveryInfo.zipcode,
    //             street: deliveryInfo.street,
    //             detailAddress: deliveryInfo.detailAddress,
    //             request: deliveryInfo.request,
    //           },
    //         }));
    //         alert('배송지를 설정했습니다.');
    //         onHideModal();
    //       }
    //     } catch (err) {
    //       console.error(err);
    //     }
    //   }
    // }
    // // 2. 주소 입력
    // else if (addressStatus === 'add') {
    //   const isValid = await validateForm();
    //   if (!isValid) return; // 유효성 검사 실패 시 종료
    //   const url = `/api/address`;
    //   const body = {
    //     zipcode: deliveryInfo.zipcode,
    //     street: deliveryInfo.street,
    //     city: deliveryInfo.city,
    //     detailAddress: deliveryInfo.detailAddress,
    //     phoneNumber: deliveryInfo.phoneNumber,
    //     deliveryName: deliveryInfo.deliveryName,
    //     recipientName: deliveryInfo.recipientName,
    //     request: deliveryInfo.request,
    //   };
    //   try {
    //     const res = await postData(url, body);
    //     setAddressStatus('default');
    //     console.log(res);
    //   } catch (err) {
    //     console.error(err);
    //   }
    // }
    // // 3. 주소 변경
    // else if (typeof addressStatus === 'number') {
    //   const isValid = await validateForm();
    //   if (!isValid) return; // 유효성 검사 실패 시 종료
    //   const url = `/api/address/${addressStatus}`;
    //   const body = {
    //     zipcode: deliveryInfo.zipcode,
    //     street: deliveryInfo.street,
    //     city: deliveryInfo.city,
    //     detailAddress: deliveryInfo.detailAddress,
    //     phoneNumber: deliveryInfo.phoneNumber,
    //     deliveryName: deliveryInfo.deliveryName,
    //     recipientName: deliveryInfo.recipientName,
    //     request: deliveryInfo.request,
    //   };
    //   try {
    //     const res = await putObjData(url, body);
    //     setAddressStatus('default');
    //   } catch (err) {
    //     console.error(err);
    //   }
    // }
  };

  const onMovePageLoading = (e) => {
    e.propertyIsEnumerable();
    const btn = e.currentTarget;
    const targetId = btn.dataset.deliveryId;
    console.log(btn.dataset);
    console.log(btn);
    setIsLoading((prevState) => ({
      ...prevState,
      [targetId]: true,
    }));
  };

  const onPrevPage = () => {
    router.push('/mypage');
  };

  console.log('addressInfo>>>', addressInfo);

  return (
    <>
      <MetaTitle title="마이페이지 구독배송지 관리" />
      <LayoutWithoutFooter>
        <Wrapper>
          <MypageWrapper>
            <header>
              <div className={s.prev_btn} style={{ cursor: 'pointer' }}>
                <Image
                  src={'/img/order/left_arrow.svg'}
                  alt="left_arrow"
                  width={24}
                  height={24}
                  onClick={onPrevPage}
                />
              </div>
            </header>
            <section className={s.title}>
              <div>구독 배송지 관리</div>
              <div className={s.title_info}>
                <span> 반려견마다 다른 배송지를 설정할 수 있습니다.</span>
                {/* <br /> 변경 후 ‘최종 저장’을 눌러야 저장됩니다. */}
              </div>
            </section>
            <section className={s.subscribe_list}>
              {addressInfo && (
                <div className={s.address_content_container}>
                  <div className={s.title_box_text}>
                    <h3>{addressInfo.currentAddress.deliveryName || '-'}</h3>
                  </div>

                  <div className={s.address_info}>
                    <h3>현재 배송지</h3>
                    <div className={s.address_detail}>
                      ({addressInfo.currentAddress.zipcode}){' '}
                      {addressInfo.currentAddress.street},{' '}
                      {addressInfo.currentAddress.detailAddress}
                    </div>
                    <div className={s.recipient_info}>
                      <div>
                        {addressInfo.currentAddress.recipientName}{' '}
                        {transformPhoneNumber(
                          addressInfo.currentAddress.phoneNumber,
                        )}
                      </div>
                    </div>

                    {addressInfo.nextAddress && (
                      <div className={s.next_address_container}>
                        <h3>다음 배송지</h3>
                        <div className={s.address_detail}>
                          ({addressInfo.nextAddress.zipcode}){' '}
                          {addressInfo.nextAddress.street},{' '}
                          {addressInfo.nextAddress.detailAddress}
                        </div>
                        <div className={s.recipient_info}>
                          <div>
                            {addressInfo.nextAddress.recipientName}{' '}
                            {transformPhoneNumber(
                              addressInfo.nextAddress.phoneNumber,
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {addressInfo.nextDeliveryDate && (
                      <div className={s.delivery_info}>
                        정기구독
                        <br />
                        (생산 예정일 :{' '}
                        {
                          formattedProductionAndReceivingDate(
                            addressInfo.nextDeliveryDate,
                          ).formattedProductionDate
                        }{' '}
                        / 수령 예정일 :
                        {
                          formattedProductionAndReceivingDate(
                            addressInfo.nextDeliveryDate,
                          ).formattedReceivingDate
                        }
                        )
                      </div>
                    )}

                    {/* 다음 배송일(nextDeliveryDate)이 없으면, 오늘 구독했을 경우로 계산 */}
                    {/* <div className={s.date_wrapper}>
                          <p>
                            생산 예정일:{' '}
                            {
                              formattedProductionAndReceivingDate(
                                item.subscribeDto.nextDeliveryDate,
                              ).formattedProductionDate
                            }
                          </p>
                          <p>|</p>
                          <p>
                            수령 예정일:{' '}
                            {
                              formattedProductionAndReceivingDate(
                                item.subscribeDto.nextDeliveryDate,
                              ).formattedReceivingDate
                            }
                          </p>
                        </div> */}

                    {/* <div className={s.flex_box}></div> */}

                    <div className={s.col_4}>
                      <Link
                        href={`/mypage/subscribe/delivery/${data.subscribeId}/update?changeType=once`}
                        passHref
                      >
                        <a
                          className={s.btn}
                          onClick={onMovePageLoading}
                          data-delivery-id={data.subscribeId}
                        >
                          1회 변경
                          <Image
                            src={'/img/order/right_arrow.svg'}
                            alt="right_arrow"
                            width={12}
                            height={12}
                          />
                        </a>
                      </Link>

                      <Link
                        href={`/mypage/subscribe/delivery/${data.subscribeId}/update?changeType=permanent`}
                        passHref
                      >
                        <a
                          className={s.btn}
                          onClick={onMovePageLoading}
                          data-delivery-id={data.subscribeId}
                        >
                          영구 변경
                          <Image
                            src={'/img/order/right_arrow.svg'}
                            alt="right_arrow"
                            width={12}
                            height={12}
                          />
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </section>
            {/* <button
              // className={`${s.save_btn}  ${isActive ? s.isActive : ''}`}
              className={`${s.apply_btn}`}
              onClick={onSaveHandler}
              // disabled={!isActive}
            >
              최종 저장
            </button> */}
            {/* <section className={s.pagination_box}>
              <PaginationWithAPI
                apiURL={searchApiUrl}
                size={searchPageSize}
                setItemList={setItemList}
                setIsLoading={setIsLoading}
                pageInterceptor={pageInterceptor}
              />
            </section> */}
          </MypageWrapper>
        </Wrapper>
      </LayoutWithoutFooter>
    </>
  );
}

export async function getServerSideProps({ query }) {
  const { subscribeId } = query;

  const data = {
    subscribeId,
  };

  return { props: { data } };
}
