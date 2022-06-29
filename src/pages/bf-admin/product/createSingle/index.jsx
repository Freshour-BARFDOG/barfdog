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
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import QuillEditor from './QuillEditor';
import SingleItemThumbnail from './SingleItemThumnail';
import SingleItemOptions from './SingleItemOptions';
import SingleItemDiscountOptions from './SingleItemDiscountOptions';
import transformClearLocalCurrency from '/util/func/transformClearLocalCurrency';
import Spinner from '/src/components/atoms/Spinner';
import { validate } from '/util/func/validation/validation_singleItem';
import { valid_hasFormErrors } from '/util/func/validation/validationPackage';
import { postObjData } from '/api/reqData';
import { useModalContext } from '/store/modal-context';
import dynamic from 'next/dynamic';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import CustomRadioTrueOrFalse from '/src/components/admin/form/CustomRadioTrueOrFalse';



/* - TODO
    ! 할인설정이 N돼있으면, 유효성에서 제외 -0--> ON이면 유효성에 포함 ((((( 오후에 할 것)))))
    ///--------------------------- 옵션추가 유효성 검사 (PM 6:09)
    [] 상품설명 > Editor추가
    [] 유효성 검사
* */
// 할인된 값이 존재할 경우에......... customRadioTrueOrFalse에게 true값을 전달한다.

const initialFormValues = {
  itemType: '',
  name: '',
  description: '',
  originalPrice: 0,
  discountType: 'FLAT_RATE' || 'FIXED_RATE',
  discountDegree: 0, // 할인정도
  salePrice: 0, // 할인적용 후 판매가격
  inStock: 'LEAKED',
  remaining: 9999,
  contents: '',
  deliveryFree: true,
  itemStatus: 'LEAKED',
  itemOptionSaveDtoList: [
    {
      name: '',
      price: 0,
      remaining: 0,
    },
  ],
  contentImageIdList: [], // 상품설명 내 이미지 리스트
  itemImageOrderDtoList: [{ id: 0, leakOrder: 1 }], // 썸네일 아이디 리스트
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

  const [thumbFileList, setThumbFileList] = useState([]);
  const [originImageIdList, setOriginImageIdList] = useState([]);
  const [QuillEditor, setQuillEditor] = useState(null);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeDiscountOption, setActiveDiscountOption] = useState(false);

  useEffect(() => {
    // 할인적용된 가격이 존재할 경우, 할인설정 option변경
    if (formValues.salePrice) {
      const active = !!formValues.salePrice;
      setActiveDiscountOption(active);
    }
  }, [formValues.salePrice]);

  console.log(formValues);
  // console.log(fileList);
  //  INIT QUILL EDITOR
  useEffect(() => {
    if (document) {
      const QuillEditor = dynamic(() => import('/src/components/admin/form/QuillEditor'));
      setQuillEditor(QuillEditor);
      console.log('Editor init is complete.');
    }
  }, []);

  const onInputChangeHandler = (e) => {
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
    console.log(formValues);
    // ! IMPORTANT : create Event후, 사용자가 enter를 쳤을 경우, 똑같은 요청이 전송되지 않게 하기 위해서 필요함.

    if (isSubmitted) return;

    const errObj = validate(formValues);
    setFormErrors(errObj);
    const isPassed = valid_hasFormErrors(errObj);

    return;

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      if (isPassed) {
        const res = await postObjData(postFormValuesApiUrl, formValues);
        console.log(res);
        // const res = { // TESTTESTTESTTESTTESTTESTTESTTESTTEST
        //   isDone : true,
        //   error: ''
        // }
        if (res.isDone) {
          onShowModalHandler('이벤트가 생성되었습니다.');
          setIsSubmitted(true);
        } else {
          alert(res.error, '\n내부 통신장애입니다. 잠시 후 다시 시도해주세요.');
        }
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
    router.push('/bf-admin/community/event');
  };

  return (
    <>
      <MetaTitle title="단품 생성" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>단품 등록</h1>
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
                        판매가격
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
                      <p className="title">옵션 추가</p>
                    </div>
                    <SingleItemOptions setFormValues={setFormValues} />
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
                    <SingleItemThumbnail
                      id={'itemImageOrderDtoList'}
                      fileList={thumbFileList}
                      setFileList={setThumbFileList}
                      formErrors={formErrors}
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
                      <h5 className="title">배송비</h5>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <CustomRadioTrueOrFalse
                          name="deliveryFree"
                          value={formValues.deliveryFree}
                          setValue={setFormValues}
                          labelList={['무료배송', '선불']}
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
                        {/*<CustomRadio*/}
                        {/*  name="itemStatus"*/}
                        {/*  idList={['itemStatus-FALSE', 'itemStatus-TRUE']}*/}
                        {/*  labelList={['노출', '숨김']}*/}
                        {/*  setValue={setFormValues}*/}
                        {/*/>*/}
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
                  <Spinner style={{ color: '#fff', width: '15', height: '15' }} speed={0.6} />
                ) : (
                  '등록'
                )}
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
