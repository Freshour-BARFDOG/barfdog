import React, {useEffect, useState} from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import {AdminContentWrapper} from '/src/components/admin/AdminWrapper';
import {useRouter} from 'next/router';
import CustomSelect from '/src/components/admin/form/CustomSelect';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import CustomRadio from '/src/components/admin/form/CustomRadio';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import QuillEditor from './QuillEditor';
import SingleItemOptions from './SingleItemOptions';
import SingleItemDiscountOptions from './SingleItemDiscountOptions';
import transformClearLocalCurrency from '/util/func/transformClearLocalCurrency';
import Spinner from '/src/components/atoms/Spinner';
import {validate} from '/util/func/validation/validation_singleItem';
import {valid_hasFormErrors} from '/util/func/validation/validationPackage';
import {postObjData} from '/api/reqData';
import {useModalContext} from '/store/modal-context';
import dynamic from 'next/dynamic';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import CustomRadioTrueOrFalse from '/src/components/admin/form/CustomRadioTrueOrFalse';
import FileInput from '/src/components/admin/form/FileInput';
import Tooltip from '/src/components/atoms/Tooltip';
import CheckboxGroup from "/src/components/atoms/CheckboxGroup";
import transformClearLocalCurrencyInEveryObject from "/util/func/transformClearLocalCurrencyInEveryObject";

// - 할인적용 후 판매가격 -> N일 경우 그냥 판매가격이랑 동일하게 처리한다.
// - 아이템 아이콘

const initialFormValues = {
  itemType: '',
  name: '',
  description: '',
  originalPrice: 0, // 판매가격
  discountType: 'FLAT_RATE' || 'FIXED_RATE',
  discountDegree: 0, // 할인정도
  salePrice: 0, // 할인적용가
  inStock: true, // 일반상품 > 재고 여부
  remaining: 0, // 일반상품 > 재고 수량
  itemOptionSaveDtoList: [
    /*{
      name: '',
      price: 0,
      remaining: 0,
    }*/
  ],
  itemImageOrderDtoList: [
    /*{ id: null, leakOrder: null }*/
  ], // 썸네일 아이디 리스트
  contents: '', // 상품아이콘: 2개 이상일 경우 콤마로 구분.
  contentImageIdList: [], // 상품설명 내 이미지 리스트
  itemIcons: '',
  deliveryFree: true,
  itemStatus: 'LEAKED' || 'HIDDEN', // 노출여부
};

const initialFormErrors = {};

function CreateSingleItemPage() {
  const postFormValuesApiUrl = 'api/admin/items';
  const postThumbFileApiUrl = '/api/admin/items/image/upload';
  const postDetailImageFileApiUrl = '/api/admin/items/contentImage/upload';
  const router = useRouter();
  const mct = useModalContext();

  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState({});
  const [originImageIdList, setOriginImageIdList] = useState([]);
  const [QuillEditor, setQuillEditor] = useState(null);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeDiscountOption, setActiveDiscountOption] = useState(false);

  
  
  // console.log(formValues)
  useEffect(() => {
    // - 품절일 경우, 재고수량 초기화
    if (formValues.inStock === false) {
      setFormValues((prevState) => ({
        ...prevState,
        remaining: 0,
      }));
    }
  }, [formValues?.inStock]);

  useEffect(() => {
    // - 할인적용된 가격이 존재할 경우, 할인설정 option변경
    if (formValues.salePrice) {
      const active = !!formValues.salePrice;
      setActiveDiscountOption(active);
    }
  }, [formValues.salePrice]);

  useEffect(() => {
    // - INIT QUILL EDITOR
    if (document) {
      const QuillEditor = dynamic(() => import('/src/components/admin/form/QuillEditor'));
      setQuillEditor(QuillEditor);
      console.log('Editor init is complete.');
    }
  }, []);

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

    if (filteredType && filteredType.indexOf('discountPercent') >= 0) {
      filteredValue = transformClearLocalCurrency(filteredValue) > '100' ? '100' : filteredValue;
      // - MEMO 100 : string이어야함.
    }

    setFormValues((prevState) => ({
      ...prevState,
      [id]: filteredValue,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitted) return;
    // ! IMPORTANT : submit 이후 enterKey event로 trigger되는 중복submit 방지
    console.log(filteredFormValues);
    const errObj = validate(formValues);
    setFormErrors(errObj);
    const isPassed = valid_hasFormErrors(errObj);

    let filteredFormValues = formValues;
    const filterStringList = ['originalPrice', 'salePrice', 'discountDegree', {'itemOptionSaveDtoList':['price', 'remaining']}];
    filteredFormValues = transformClearLocalCurrencyInEveryObject(filteredFormValues, filterStringList);
    console.log(filteredFormValues);

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      if (isPassed) {
        const res = await postObjData(postFormValuesApiUrl, filteredFormValues);
        // console.log(res);
        if (res.isDone) {
          onShowModalHandler('일반상품이 생성되었습니다.');
          setIsSubmitted(true);
        } else {
          alert(res.error, '\n내부 통신장애입니다. 잠시 후 다시 시도해주세요.');
        }
      }else{
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
      <MetaTitle title="일반상품 생성" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>일반상품 등록</h1>
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
                            { label: '생식 (단품)', value: 'RAW' },
                            { label: '토핑 (간식 및 토핑류)', value: 'TOPPING' },
                            { label: '굿즈 (그 밖의 제품)', value: 'GOODS' },
                          ]}
                          value={formValues.itemType}
                          setFormValues={setFormValues}
                        />
                        {formErrors.itemType && <ErrorMessage>{formErrors.itemType}</ErrorMessage>}
                      </div>
                    </div>
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
                          value={formValues.name}
                          onChange={onInputChangeHandler}
                        />
                        {formErrors.name && <ErrorMessage>{formErrors.name}</ErrorMessage>}
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
                          value={formValues.description}
                          onChange={onInputChangeHandler}
                        />
                        {formErrors.name && <ErrorMessage>{formErrors.description}</ErrorMessage>}
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
                          value={formValues.originalPrice}
                          data-input-type={'currency, number'}
                          onChange={onInputChangeHandler}
                        />
                        <em className="unit">원</em>
                        {formErrors.originalPrice && (
                          <ErrorMessage>{formErrors.originalPrice}</ErrorMessage>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* cont_divider */}
                <div className="cont_divider">
                  <div className="input_row multipleLines">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor={'discountDegree'}>
                        할인설정
                      </label>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <CustomRadioTrueOrFalse
                          name="discount"
                          value={activeDiscountOption}
                          setValue={setActiveDiscountOption}
                          labelList={['Y', 'N']}
                          returnBooleanValue
                        />
                      </div>
                      {activeDiscountOption && (
                        <SingleItemDiscountOptions
                          id={'salePrice'}
                          formValues={formValues}
                          setFormValues={setFormValues}
                          formErrors={formErrors}
                          onChange={onInputChangeHandler}
                        />
                      )}
                    </div>
                  </div>
                </div>
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
                      {formValues?.inStock && (
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
                      mode={'create'}
                    />
                  </div>
                </div>
                {/* cont_divider */}
                <div className="cont_divider">
                  <div className="input_row multipleLines">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor={'thumbnails'}>
                        썸네일
                      </label>
                    </div>
                    <FileInput
                      id={'itemImageOrderDtoList'}
                      apiUrl={postThumbFileApiUrl}
                      setFormValues={setFormValues}
                      formErrors={formErrors}
                      setFormErrors={setFormErrors}
                      originImageDatas={[]}
                      mode={'create'}
                      maxFileSize={10000000}
                      maxImageCount={10}
                    />
                  </div>
                </div>
                {/* cont_divider */}
                <div className="cont_divider">
                  <div className="input_row multipleLines">
                    <div className="title_section fixedHeight">
                      <h5 className="title">상품설명</h5>
                    </div>
                    <div className="inp_section">
                      {formErrors.contents && <ErrorMessage>{formErrors.contents}</ErrorMessage>}
                      {/* // * --------- QUILL EDITOR --------- * // */}
                      {QuillEditor && (
                        <QuillEditor
                          id={'contents'}
                          mode={'create'}
                          imageId={'contentImageIdList'}
                          originImageIdList={originImageIdList}
                          setFormValues={setFormValues}
                          imageUploadApiURL={postDetailImageFileApiUrl}
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
                          message={'일반상품리스트 썸네일 상단에 노출된 아이콘입니다.'}
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
                {isLoading.submit ? <Spinner /> : '등록'}
              </button>
            </div>
          </div>
        </AdminContentWrapper>
      </AdminLayout>
      <Modal_global_alert message={modalMessage} onClick={onGlobalModalCallback} background />
    </>
  );
}

export default CreateSingleItemPage;
