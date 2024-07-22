import s from './modal_delivery.module.scss';
import React, { useCallback, useEffect, useState } from 'react';
import ModalWrapper from './ModalWrapper';
import Image from 'next/image';
import { getData } from '/src/pages/api/reqData';
import AddressEdit from './delievery/AddressEdit';
import AddressAdd from './delievery/AddressAdd';
import CustomRadio from '/src/components/admin/form/CustomRadio';
import { transformPhoneNumber } from '/util/func/transformPhoneNumber';
import { deleteData, postData, putObjData } from '../../pages/api/reqData';
import CloseButton from '../atoms/CloseButton';

export const Modal_delivery = ({
  onModalActive,
  itemInfo,
  info,
  form,
  setForm,
  orderType = 'general',
}) => {
  const initialDeliveryInfos = {
    zipcode: null, // 우편번호 (묶음 배송일 경우, null)
    street: null, // 도로명 주소 (묶음 배송일 경우, null)
    city: null,
    detailAddress: null, // 상세주소 (묶음 배송일 경우, null)
    recipientName: '',
    deliveryName: '',
    phoneNumber: '',
    request: '',
  };

  const [isLoading, setIsLoading] = useState({ fetching: false });
  const [addressList, setAddressList] = useState([]);
  const [addressStatus, setAddressStatus] = useState('default');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedItem, setSelectedItem] = useState({});
  const [isActive, setIsActive] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: true,
        }));
        const apiUrl = `/api/address`;
        const res = await getData(apiUrl);

        const addresses = res.data._embedded.addressResponseDtoList;

        // console.log(res);

        if (res.status === 200) {
          setAddressList(addresses);
          // 기본 주소 체크
          const defaultAddress = addresses.find((address) => address.default);
          if (defaultAddress) {
            setSelectedItemId(defaultAddress.id);
            setIsActive(true);
          }
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
  }, [form, addressStatus]);

  const onAddAddressHandler = () => {
    setAddressStatus('add');
  };

  const onEditAddressHandler = (address) => {
    setAddressStatus(address.id);
    setSelectedItem(address);
  };

  const onDeleteHandler = async (address) => {
    const isConfirmed = window.confirm('정말 삭제하시겠습니까?');

    if (!isConfirmed) {
      return;
    }
    const url = `/api/address/${address.id}`;
    try {
      const res = await deleteData(url);

      if (res.status === 200) {
        setAddressStatus('default');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onMoveToPreviousHandler = () => {
    setAddressStatus('default');
  };

  const checkHandler = (id) => {
    setSelectedItemId(id);
  };

  const onSaveHandler = async () => {
    // 1. 기본 주소 등록
    if (addressStatus === 'default') {
      const url = `/api/address/default/${selectedItemId}`;
      try {
        const res = await postData(url);
        // console.log(res);

        if (res.status === 200) {
          alert('배송지를 설정했습니다.');
          onHideModal();
        }
      } catch (err) {
        console.error(err);
      }
    }

    // 2. 주소 입력
    else if (addressStatus === 'add') {
      const url = `/api/address`;
      const body = {
        zipcode: form.zipcode,
        street: form.street,
        city: form.city,
        detailAddress: form.detailAddress,
        phoneNumber: form.phoneNumber,
        deliveryName: form.deliveryName,
        recipientName: form.recipientName,
        request: form.request,
      };
      try {
        const res = await postData(url, body);
        setAddressStatus('default');
        console.log(res);
      } catch (err) {
        console.error(err);
      }
    }

    // 3. 주소 변경
    else if (typeof addressStatus === 'number') {
      const url = `/api/address/${addressStatus}`;
      const body = {
        zipcode: form.zipcode,
        street: form.street,
        city: form.city,
        detailAddress: form.detailAddress,
        phoneNumber: form.phoneNumber,
        deliveryName: form.deliveryName,
        recipientName: form.recipientName,
        request: form.request,
      };
      try {
        const res = await putObjData(url, body);
        setAddressStatus('default');
      } catch (err) {
        console.error(err);
      }
    }
  };

  // console.log('addressStatus>>>', addressStatus);
  // console.log('selectedItemId>>>', selectedItemId);
  // console.log('form', form);
  // console.log('addressList', addressList);

  const onHideModal = () => {
    onModalActive((prevState) => ({
      ...prevState,
      delivery: false,
    }));
  };

  const onClickArrowIcon = () => {
    if (addressStatus === 'default') {
      onHideModal();
    } else {
      onMoveToPreviousHandler();
    }
  };

  return (
    <>
      <ModalWrapper
        background
        onBackgroundClick={onHideModal}
        className={s['modal-container']}
        positionCenter
      >
        <main className={s.main}>
          <div className={s.delivery_container}>
            <header>
              <div className={s.img_wrapper}>
                <Image
                  src={'/img/order/left_arrow.svg'}
                  alt="left_arrow"
                  width={24}
                  height={24}
                  onClick={onClickArrowIcon}
                />
              </div>
            </header>

            {/*  조회 */}
            {addressStatus === 'default' && (
              <>
                <h1>배송지 선택</h1>
                <h3>배송 받기 원하는 곳의 주소를 선택하여 주세요</h3>

                <div className={s.address_list}>
                  <ul>
                    {addressList.length < 1 ? (
                      <div className={s.address_none}>
                        배송지를 추가해주세요
                      </div>
                    ) : (
                      addressList.map((address, i) => {
                        return (
                          <li
                            key={i}
                            className={
                              address.id === selectedItemId ? s.isClick : ''
                            }
                          >
                            {address.id === selectedItemId ? (
                              <Image
                                src={'/img/order/delivery_check.svg'}
                                alt="delivery_check"
                                width={24}
                                height={24}
                                onClick={() => checkHandler(1)}
                                style={{ cursor: 'pointer' }}
                              />
                            ) : (
                              <button
                                className={s.check_btn}
                                onClick={() => checkHandler(address.id)}
                              ></button>
                            )}

                            <div className={s.address_info}>
                              <div className={s.address_info_title}>
                                <h5>{address.deliveryName}</h5>
                                <CloseButton
                                  onClick={() => onDeleteHandler(address)}
                                />
                              </div>
                              <div className={s.address_detail}>
                                ({address.zipcode}) {address.street},{' '}
                                {address.detailAddress}
                              </div>
                              <div className={s.recipient_info}>
                                <div>
                                  {address.recipientName}{' '}
                                  {transformPhoneNumber(address.phoneNumber)}
                                </div>

                                <Image
                                  src={'/img/order/edit_btn.svg'}
                                  alt="edit_btn"
                                  width={20}
                                  height={20}
                                  onClick={() => onEditAddressHandler(address)}
                                  style={{ cursor: 'pointer' }}
                                />
                              </div>
                            </div>
                          </li>
                        );
                      })
                    )}
                  </ul>
                  <button className={s.add_btn} onClick={onAddAddressHandler}>
                    + 신규 배송지 추가
                  </button>
                </div>
              </>
            )}

            {/*  추가  */}
            {addressStatus === 'add' && (
              <AddressAdd
                form={form}
                setForm={setForm}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
                setIsActive={setIsActive}
              />
            )}

            {/*  수정  */}
            {typeof addressStatus === 'number' && (
              <AddressEdit
                selectedItem={selectedItem}
                form={form}
                setForm={setForm}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
                setIsActive={setIsActive}
              />
            )}
          </div>
        </main>
        <div className={s.save_btn_wrapper}>
          <button
            className={`${s.save_btn}  ${isActive ? s.isActive : ''}`}
            onClick={onSaveHandler}
          >
            저장
          </button>
        </div>
      </ModalWrapper>
    </>
  );
};
