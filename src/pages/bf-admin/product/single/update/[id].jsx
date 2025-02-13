import React, { useEffect, useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import { useRouter } from 'next/router';
import CustomSelect from '/src/components/admin/form/CustomSelect';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import CustomRadio from '/src/components/admin/form/CustomRadio';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import QuillEditor from '/src/components/admin/form/QuillEditor';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import Spinner from '/src/components/atoms/Spinner';
import { validate } from '/util/func/validation/validation_singleItem';
import { valid_hasFormErrors } from '/util/func/validation/validationPackage';
import { getData, putObjData } from '/src/pages/api/reqData';
import { useModalContext } from '/store/modal-context';
import dynamic from 'next/dynamic';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import CustomRadioTrueOrFalse from '/src/components/admin/form/CustomRadioTrueOrFalse';
import FileInput from '/src/components/admin/form/FileInput';
import Tooltip from '/src/components/atoms/Tooltip';
import CheckboxGroup from '/src/components/atoms/CheckboxGroup';
import transformClearLocalCurrencyInEveryObject from '/util/func/transformClearLocalCurrencyInEveryObject';
import SingleItemOptions from '/src/components/admin/product/SingleItemOptions';
import { general_itemType } from '/store/TYPE/itemType';
import { itemHealthTypeList } from '/store/TYPE/itemHealthType';
import pc from '/src/components/atoms/pureCheckbox.module.scss';
import DiscountSettings from "/src/components/admin/product/DiscountSection";
import { getAllianceList } from "/service/admin";

export default function UpdateSingleItemPage({ id, allianceList }) {
  const getFormValuesApiUrl = `/api/admin/items/${id}`;
  const putFormValuesApiUrl = `/api/admin/items/${id}`;
  const postThumbFileApiUrl = '/api/admin/items/image/upload';
  const postContentImageApiUrl = '/api/admin/items/contentImage/upload';
  const router = useRouter();
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;

  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState({});
  const [originContentImageIdList, setOriginContentImageIdList] = useState([]); // Editor내부이미지 원본
  const [originThumbDataList, setOriginThumbDataList] = useState([]); // 썸네일 데이터 원본
  const [originOptionList, setOriginOptionList] = useState([]); // 옵션 원본
  const [QuillEditor, setQuillEditor] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: true,
        }));
        const res = await getData(getFormValuesApiUrl);

        const originOptionDataListFromServer = res.data.itemOptionAdminDtoList; // 에디터 >  원본아이디리스트
        setOriginOptionList(originOptionDataListFromServer); // 원본 option list

        const originthumbDataListFromServer = res.data.itemImageAdminDtoList;
        setOriginThumbDataList(originthumbDataListFromServer); // 원본 thumnail ID list

        const originContentImageIdListFromServer =
          res.data.itemContentImageDtoList?.map((list) => list.id);
        setOriginContentImageIdList(originContentImageIdListFromServer); // 원본 상세설명 내의 이미지 ID list

        const DATA = res.data.itemAdminDto;

        const initialFormValues = {
          itemType: DATA.itemType, // 카테고리
          itemHealthType: DATA.itemHealthType.split(','), // 건강 카테고리
          name: DATA.name, // 상품명
          description: DATA.description, // 상품설명
          originalPrice: transformLocalCurrency(DATA.originalPrice), // 판매가격
          discountType: DATA.discountType, // 할인 단위 ( % , 원)
          discountDegree: transformLocalCurrency(DATA.discountDegree), // 할인 정도
          salePrice: transformLocalCurrency(DATA.salePrice), // 할인 적용 후 판매가격
          inStock: DATA.inStock, // 재고 여부
          remaining: transformLocalCurrency(DATA.remaining), // 재고 수량

          itemOptionSaveDtoList: [], // 옵션 > 추가 List
          itemOptionUpdateDtoList: res.data.itemOptionAdminDtoList, // 옵션 > 수정 List
          deleteOptionIdList: [], // 옵션 > 삭제 List

          deleteImageIdList: [], // 썸네일 > 삭제 List
          addImageIdList: [], // 썸네일 > 추가 List
          imageOrderDtoList: originthumbDataListFromServer.map((data) => ({
            id: data.id,
            learkOrder: data.leakOrder,
          })), // 썸네일 {id, leakOrder } list

          contents: DATA.contents, // 상품 설명
          addContentImageIdList: [], // 에디터 > 추가 이미지 List
          deleteContentImageIdList: [], // 에디터 > 삭제 이미지List

          itemIcons: DATA.itemIcons,
          deliveryFree: DATA.deliveryFree, // 배송비무료
          itemStatus: DATA.status, // 노출 여부

          allianceDtoList: res.data.allianceDtoList.map(item => ({
            ...item,
            allianceDegree: transformLocalCurrency(item.allianceDegree),
            allianceSalePrice: transformLocalCurrency(item.allianceSalePrice),
          })) || [],
        };

        setFormValues(initialFormValues);
        if (document) {
          const QuillEditor = dynamic(() =>
            import('/src/components/admin/form/QuillEditor'),
          );
          setQuillEditor(QuillEditor);
        }
      } catch (err) {
        console.error(err);
      }
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    })();
  }, []);

  useEffect(() => {
    // - 품절일 경우, 재고수량 초기화
    if (formValues.inStock === false) {
      setFormValues((prevState) => ({
        ...prevState,
        remaining: 0,
      }));
    }
  }, [formValues?.inStock]);

  const onInputChangeHandler = (e) => {
    // 만약에 할인옵션이 false면, ..... 할인적용후 가격 -> 판매가격과 동일하게 설정한다.
    const input = e.currentTarget;
    const { id, value } = input;
    const filteredType = input.dataset.inputType;
    let filteredValue = value;

    if (filteredType) {
      filteredValue = filter_emptyValue(value);
    }

    if (filteredType && filteredType.indexOf('number') >= 0) {
      filteredValue = filter_onlyNumber(filteredValue);
    }

    if (filteredType && filteredType.indexOf('currency') >= 0) {
      filteredValue = transformLocalCurrency(filteredValue);
    }

    setFormValues((prevState) => ({
      ...prevState,
      [id]: filteredValue,
    }));
  };

  const onChangeHandler = (e, label) => {
    let updatedItemHealthTypeList = [...formValues.itemHealthType];
    const labelIndex = updatedItemHealthTypeList.indexOf(label);

    // "NONE"이 있을 경우 제거
    const noneIndex = updatedItemHealthTypeList.indexOf('NONE');
    if (noneIndex !== -1) {
      updatedItemHealthTypeList.splice(noneIndex, 1);
    }

    if (labelIndex === -1) {
      updatedItemHealthTypeList.push(label);
    } else {
      updatedItemHealthTypeList.splice(labelIndex, 1);
    }

    setFormValues((prevState) => ({
      ...prevState,
      itemHealthType: updatedItemHealthTypeList,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitted) return;
    const errObj = validate(formValues);
    setFormErrors(errObj);
    const isPassed = valid_hasFormErrors(errObj, 'array', 'itemHealthType');

    let filteredFormValues = formValues;
    const filterStringObj = {
      originalPrice: 'originalPrice',
      salePrice: 'salePrice',
      remaining: 'remaining',
      discountDegree: 'discountDegree',
      itemOptionSaveDtoList: { price: 'price', remaining: 'remaining' },
      itemOptionUpdateDtoList: { price: 'price', remaining: 'remaining' },
      allianceDtoList: { allianceDegree: 'allianceDegree', allianceSalePrice: 'allianceSalePrice'}
    };
    filteredFormValues = transformClearLocalCurrencyInEveryObject(
      filteredFormValues,
      filterStringObj,
    );

    // 문자열로 변환. 컴마(,)로 구분
    if (!filteredFormValues.itemHealthType) {
      filteredFormValues.itemHealthType = 'NONE';
    } else
      filteredFormValues.itemHealthType =
        filteredFormValues.itemHealthType?.join(',');

    // 제휴사 할인 설정을 클릭 또는 제휴사를 선택했으나 degree 값을 입력하지 않았을 경우 필터링
    if (filteredFormValues.allianceDtoList) {
      filteredFormValues.allianceDtoList = filteredFormValues.allianceDtoList.filter(item => item.allianceDegree !== 0)
    }

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));

      if (isPassed) {
        const res = await putObjData(putFormValuesApiUrl, filteredFormValues);
        if (res.isDone) {
          onShowModalHandler('일반상품이 수정되었습니다.');
          setIsSubmitted(true);
        } else {
          alert(res.error, '\n내부 통신장애입니다. 잠시 후 다시 시도해주세요.');
        }
      } else {
        alert('유효하지 않은 항목이 있습니다.');
      }
    } catch (err) {
      alert('API통신 오류가 발생했습니다. 서버관리자에게 문의하세요.');
      console.error('API통신 오류 : ', err);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      submit: false,
    }));
  };

  const returnToPrevPage = () => {
    if (confirm('이전 페이지로 돌아가시겠습니까?')) {
      router.back();
    }
  };

  const onShowModalHandler = (message) => {
    mct.alertShow();
    setModalMessage(message);
  };

  const onGlobalModalCallback = () => {
    mct.alertHide();
    router.push('/bf-admin/product/single');
  };

  return (
    <>
      <MetaTitle title="일반상품 수정" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>
              일반상품 수정
              {isLoading.fetching && <Spinner />}
            </h1>
          </div>
          <section className="cont">
            <div className="cont_body">
              <form action="/" encType="multipart/form-data" method="post">
                <div className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor="itemType">
                        카테고리
                      </label>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <CustomSelect
                          id="itemType"
                          options={[
                            { label: '선택', value: '' },
                            {
                              label: '생식 (일반상품)',
                              value: general_itemType.RAW,
                            },
                            {
                              label: '토핑 (간식 및 토핑류)',
                              value: general_itemType.TOPPING,
                            },
                            {
                              label: '굿즈 (그 밖의 제품)',
                              value: general_itemType.GOODS,
                            },
                          ]}
                          value={formValues.itemType}
                          setFormValues={setFormValues}
                        />
                        {formErrors.itemType && (
                          <ErrorMessage>{formErrors.itemType}</ErrorMessage>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor="itemHealthType">
                        추천 상품
                      </label>
                    </div>

                    <ul className={'grid-checkbox-health-type'}>
                      {itemHealthTypeList.map((type, index) => {
                        const isChecked = formValues.itemHealthType?.includes(
                          type.value,
                        );
                        return (
                          <div className={`${pc['checkbox-wrap']}`} key={index}>
                            <label
                              htmlFor={type.value}
                              className={`${pc.checkbox}`}
                            >
                              <input
                                onChange={(e) => onChangeHandler(e, type.value)}
                                type="checkbox"
                                id={type.value}
                                value={type.value}
                                checked={isChecked}
                              />
                              <span className={pc.fakeCheckBox} />
                              <span>{type.label}</span>
                            </label>
                          </div>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                {/* cont_divider */}
                <div className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor="name">
                        상품명
                      </label>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <input
                          id={'name'}
                          type="text"
                          name="name"
                          className="fullWidth"
                          value={formValues.name || ''}
                          onChange={onInputChangeHandler}
                        />
                        {formErrors.name && (
                          <ErrorMessage>{formErrors.name}</ErrorMessage>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* cont_divider */}
                <div className="cont_divider">
                  <div className="input_row multipleLines">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor="description">
                        상품 설명
                      </label>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <textarea
                          id={'description'}
                          name="description"
                          className="fullWidth"
                          value={formValues.description || ''}
                          onChange={onInputChangeHandler}
                        />
                        {formErrors.name && (
                          <ErrorMessage>{formErrors.description}</ErrorMessage>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* cont_divider */}
                <div className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor="originalPrice">
                        상품가격
                      </label>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <input
                          id={'originalPrice'}
                          type="text"
                          name="originalPrice"
                          className={'text-align-right'}
                          value={formValues.originalPrice || ''}
                          data-input-type={'currency, number'}
                          onChange={onInputChangeHandler}
                        />
                        <em className="unit">원</em>
                        {formErrors.originalPrice && (
                          <ErrorMessage>
                            {formErrors.originalPrice}
                          </ErrorMessage>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* cont_divider */}
                <DiscountSettings
                  formValues={formValues}
                  setFormValues={setFormValues}
                  formErrors={formErrors}
                  allianceList={allianceList}
                />
                {/* cont_divider */}
                <div className="cont_divider">
                  <div className="input_row multipleLines">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor={'inStock'}>
                        재고여부
                        <Tooltip
                          message={
                            '1. 품절된 상품은 아이템리스트 내에 품절처리 UI로 나타납니다.\n2. 품절된 상품은 상세페이지로 접근할 수 없습니다.'
                          }
                          wordBreaking={true}
                          messagePosition={'left'}
                          style={{ width: '400px' }}
                        />
                      </label>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <CustomRadioTrueOrFalse
                          name="inStock"
                          value={formValues.inStock}
                          setValue={setFormValues}
                          labelList={['Y', 'N (품절)']}
                        />
                      </div>
                      {formValues.inStock && (
                        <div className={'inp_box'}>
                          <input
                            id={'remaining'}
                            type="text"
                            className={'text-align-right'}
                            value={formValues.remaining}
                            data-input-type={'number'}
                            onChange={onInputChangeHandler}
                          />
                          <em className="unit">개</em>
                          {formErrors.remaining && (
                            <ErrorMessage>{formErrors.remaining}</ErrorMessage>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* cont_divider */}
                <div className="cont_divider">
                  <div className="input_row multipleLines">
                    <div className="title_section fixedHeight">
                      <div className="title">
                        옵션 추가
                        <Tooltip
                          message={`1. 옵션명, 재고수량은 필수항목입니다.\n2. 사용하지 않는 옵션항목은 삭제하세요.`}
                          messagePosition={'left'}
                          wordBreaking
                          width={'240px'}
                        />
                      </div>
                    </div>
                    <SingleItemOptions
                      id={'itemOptionSaveDtoList'}
                      formErrors={formErrors}
                      setFormValues={setFormValues}
                      originDataList={originOptionList}
                      mode={'update'}
                    />
                  </div>
                </div>
                {/* cont_divider */}
                <div className="cont_divider">
                  <div className="input_row multipleLines">
                    <div className="title_section fixedHeight">
                      <div className="title">
                        썸네일
                        <Tooltip
                          message={
                            '새로운 썸네일 파일을 첨부한 이력이 있다면, 반드시 기존 썸네일 외에 새로운 파일을 첨부해야합니다. 기존 파일을 사용하고자 할 경우에는 새로고침 후 다시 시도하시기 바랍니다.'
                          }
                          messagePosition={'left'}
                          wordBreaking={true}
                        />
                      </div>
                    </div>
                    <FileInput
                      id={'imageOrderDtoList'}
                      apiUrl={postThumbFileApiUrl}
                      setFormValues={setFormValues}
                      formErrors={formErrors}
                      setFormErrors={setFormErrors}
                      originImageDatas={originThumbDataList}
                      maxImageCount={10}
                      maxFileSize={10000000}
                      mode={'update'}
                    />
                    {/*썸네일 이미지 아이디 리스트가 존재할 경우. */}
                  </div>
                </div>
                {/* cont_divider */}
                <div className="cont_divider">
                  <div className="input_row multipleLines">
                    <div className="title_section fixedHeight">
                      <h5 className="title">상세정보</h5>
                    </div>
                    <div className="inp_section">
                      {formErrors.contents && (
                        <ErrorMessage>{formErrors.contents}</ErrorMessage>
                      )}
                      {/* // * --------- QUILL EDITOR --------- * // */}
                      {QuillEditor && (
                        <QuillEditor
                          id={'contents'}
                          mode={'update'}
                          formValuesKey={{
                            addImageKey: 'addContentImageIdList',
                            delImageKey: 'deleteContentImageIdList',
                          }}
                          imageId={'contentImageIdList'}
                          originImageIdList={originContentImageIdList}
                          setFormValues={setFormValues}
                          imageUploadApiURL={postContentImageApiUrl}
                          initialValue={formValues.contents}
                        />
                      )}
                      {/* // * --------- QUILL EDITOR --------- * // */}
                    </div>
                  </div>
                </div>
                {/* cont_divider */}
                <div className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <h5 className="title">
                        상품아이콘
                        <Tooltip
                          message={
                            'SHOP페이지 일반상품 목록에 노출될 아이콘입니다.'
                          }
                          messagePosition={'left'}
                        />
                      </h5>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <CheckboxGroup
                          id={'itemIcons'}
                          items={[
                            { label: 'BEST', value: 'BEST' },
                            { label: 'NEW', value: 'NEW' },
                          ]}
                          formValues={formValues}
                          setFormValues={setFormValues}
                          mode={'update'}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* cont_divider */}
                <div className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <h5 className="title">배송비</h5>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <CustomRadioTrueOrFalse
                          name="deliveryFree"
                          value={formValues.deliveryFree}
                          setValue={setFormValues}
                          labelList={['무료', '선불']}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* cont_divider */}
                <div className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <h5 className="title">노출여부</h5>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <CustomRadio
                          setValue={setFormValues}
                          name="itemStatus"
                          idList={['LEAKED', 'HIDDEN']}
                          labelList={['노출', '숨김']}
                          value={formValues.itemStatus}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* cont_divider */}
              </form>
            </div>
          </section>
          <div className="cont_bottom">
            <div className="btn_section">
              <button
                type="button"
                id="btn-cancle"
                className="admin_btn confirm_l line"
                onClick={returnToPrevPage}
              >
                취소
              </button>
              <button
                type="submit"
                id="btn-create"
                className="admin_btn confirm_l solid"
                onClick={onSubmit}
              >
                {isLoading.submit ? (
                  <Spinner style={{ color: '#fff' }} />
                ) : (
                  '수정'
                )}
              </button>
            </div>
          </div>
        </AdminContentWrapper>
      </AdminLayout>
      {hasAlert && (
        <Modal_global_alert
          message={modalMessage}
          onClick={onGlobalModalCallback}
          background
        />
      )}
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { query, req } = ctx;
  const { id } = query;

  const allianceList = await getAllianceList(req);

  return {
    props: {
      id: id || null,
      allianceList,
    }
  };
}
