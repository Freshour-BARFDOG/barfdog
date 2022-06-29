import React, { useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import { useRouter } from 'next/router';
import CustomSelectForTwoSelects from '/src/components/admin/form/CustomSelectForTwoSelects';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import CustomRadio from '/src/components/admin/form/CustomRadio';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import transformClearLocalCurrency from "/util/func/transformClearLocalCurrency";
import QuillEditor from '../../createSingle/QuillEditor';
import SingleItemThumbnail from "../../createSingle/SingleItemThumnail";
import SingleItemOptions from "../../createSingle/SingleItemOptions";
import SingleItemDiscountOptions from "../../createSingle/SingleItemDiscountOptions";

/* TODO - 다중  이미지 처리 -> Preview && 업로드 즉시 API 통신
 */




const initialFormValues = {
  itemType: '',
  name: '',
  description: '',
  originalPrice: 0,
  discountType: 'FLAT_RATE' || 'FIXED_RATE',
  discountDegree: 0, // 할인정도
  salePrice: 0, // 할인적용 후 판매가격
  inStock: true,
  remaining: 9999,
  contents: '',
  deliveryFree: false,
  itemStatus: 'LEAKED',
  itemOptionSaveDtoList: [
    {
      name: '',
      price: 0,
      remaining: 9999,
    },
  ],
  contentImageIdList: [],
  itemImageOrderDtoList: [{ id: 0, leakOrder: 1 }],
};

const initialFormErrors = {};

function UpdateSingleItemPage() {
  const router = useRouter();

  const [fileList, setFileList] = useState([]);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState(initialFormErrors);

  // console.log(fileList);
  console.log(formValues);

  const returnToPrevPage = () => {
    if (confirm('이전 페이지로 돌아가시겠습니까?')) {
      router.back();
    }
  };

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



  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log('제출!');
  }; // * onSubmitHandler




  return (
    <>
      <MetaTitle title="단품 수정" admin={true} />
      <AdminLayout>
        <AdminContentWrapper id={'createSinglePage'}>
          <div className="title_main">
            <h1>단품 수정</h1>
          </div>
          <section className="cont">
            <div className="cont_body">
              <form
                action="/"
                encType="multipart/form-data"
                method="post"
                onSubmit={onSubmitHandler}
              >
                <div className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor="itemType">
                        카테고리
                      </label>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <CustomSelectForTwoSelects
                          name="itemType"
                          id="itemType"
                          options={[
                            { label: '선택', value: '' },
                            { label: '생식 (단품)', value: 'RAW' },
                            { label: '토핑 (간식 및 토핑류)', value: 'TOPPING' },
                            { label: '굿즈 (그 밖의 제품)', value: 'GOODS' },
                          ]}
                          onChange={setFormValues}
                        />
                        {formErrors.category && <ErrorMessage>{formErrors.category}</ErrorMessage>}
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
                        {formErrors.originalPrice && <ErrorMessage>{formErrors.originalPrice}</ErrorMessage>}
                      </div>
                    </div>
                  </div>
                </div>
                {/* cont_divider */}
                <div className="cont_divider">
                  <div className="input_row multipleLines">
                    <div className="title_section fixedHeight">
                      <label className="t정itle" htmlFor={'discountDegree'}>
                        할인설정
                      </label>
                    </div>
                    <SingleItemDiscountOptions formValues={formValues} setFormValues={setFormValues} onChange={onInputChangeHandler}/>
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
                    <SingleItemThumbnail fileList={fileList} setFileList={setFileList} formErrors={formErrors} />
                  </div>
                </div>
                {/* cont_divider */}

                <div className="cont_divider">
                  <div className="input_row multipleLines">
                    <div className="title_section fixedHeight">
                      <h5 className="title">상품설명</h5>
                    </div>
                    <div className="inp_section">
                      <QuillEditor />
                      {/*EDITOR--------------------------------*/}
                      {/*EDITOR--------------------------------*/}
                      {/*EDITOR--------------------------------*/}
                      {/*EDITOR--------------------------------*/}
                      {/*EDITOR--------------------------------*/}
                      {/*EDITOR--------------------------------*/}
                      {/*EDITOR--------------------------------*/}
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
                        <CustomRadio
                          setValue={setFormValues}
                          name="deliveryFree"
                          idList={['deliveryFree-FALSE', 'deliveryFree-TRUE']}
                          labelList={['선불', '무료배송']}
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
                          idList={['itemStatus-TRUE', 'itemStatus-FALSE']}
                          labelList={['노출', '숨김']}
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
              <button type="submit" id="btn-create" className="admin_btn confirm_l solid">
                등록
              </button>
            </div>
          </div>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default UpdateSingleItemPage;
