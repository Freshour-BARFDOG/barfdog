import React, { useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import { useRouter } from 'next/router';
import CustomSelect from '/src/components/admin/form/CustomSelect';
import ErrorMessage from '../../../../components/atoms/ErrorMessage';
import Tooltip from "../../../../components/atoms/Tooltip";
import CustomRadio from "../../../../components/admin/form/CustomRadio";
import UnitBox from "../../../../components/atoms/UnitBox";
import PreviewImage from "../../../../components/atoms/PreviewImage";
import Fake_input from "../../../../components/atoms/fake_input";
import filter_emptyValue from "../../../../../util/func/filter_emptyValue";
import filter_onlyNumber from "../../../../../util/func/filter_onlyNumber";
import transformLocalCurrency from "../../../../../util/func/transformLocalCurrency";
import QuillEditor from "./QuillEditor";




//
/*MEMO
*  다중  이미지 처리 -> Preview && 업로드 즉시 API 통신
*
*
*
* */



const initialFormValues = {
  itemType:'',
  name: '',
  description: '',
  originalPrice:0,
  discountType: 'FLAT_RATE' || 'FIXED_RATE',
  discountDegree: 0, // 할인정도
  salePrice:0, // 할인적용 후 판매가격
  inStock: true,
  remaining: 9999,
  contents: '',
  deliveryFree: false,
  itemStatus: 'LEAKED',
  itemOptionSaveDtoList: [{
    name:'',
    price:0,
    remaining:9999
  }],
  contentImageIdList: [],
  itemImageOrderDtoList:[{id:0, leakOrder:1}]
};

const initialFormErrors = {};




function CreateSingleItemPage() {
  const router = useRouter();

  const [fileList, setFileList] = useState([]);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState(initialFormErrors);

  console.log(fileList)
  console.log(formValues)

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
    // console.log(filteredValue);

    setFormValues((prevState) => ({
      ...prevState,
      [id]: filteredValue,
    }));
    // console.log('id:',id,' val:',filteredValue);
  };


  const imageFileChangeHandler = (e) => {
    const { files } = e.currentTarget;
    // 10개인지 검증한다.
    const maxImageCount = 10;
    if(files.length > maxImageCount){
      return  alert('이미지는 10개를 초과하여 업로드할 수 없습니다.')
    }


    // 단일파일 업로드
    if(files.length === 1){
      const file = files[0];
      return setFileList((prevState) => {
        if(prevState.length >= 10) {
          alert('이미지를 10개 이상 업로드할 수 없습니다.');
          return prevState;
        }else {
          return [...prevState, { file: file, filename: file.name }]
        }
      });
    }

    if( files.length > 1){
      let newFileList = [];
      for (const filesKey in files) {
        const file = files[filesKey];
        if(typeof file === "object"){
          newFileList.push({
            file: file,
            filename:file.filename
          })
        }

      }
      console.log([...newFileList])
      return setFileList((prevState) => [...prevState, ...newFileList]);
    }

  };



  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log('제출!');
  }; // * onSubmitHandler

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
                        <CustomSelect
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
                      <label className="title" htmlFor="price">
                        판매가격
                      </label>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <input
                          id={'price'}
                          type="text"
                          name="price"
                          className={'text-align-right'}
                          value={formValues.price}
                          data-input-type={'currency, number'}
                          onChange={onInputChangeHandler}
                        />
                        <em className="unit">원</em>
                        {formErrors.price && <ErrorMessage>{formErrors.price}</ErrorMessage>}
                      </div>
                    </div>
                  </div>
                </div>
                {/* cont_divider */}
                <div className="cont_divider">
                  <div className="input_row multipleLines">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor={'discountDegree'}>할인설정</label>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <CustomRadio
                          setValue={setFormValues}
                          name="setDiscount"
                          idList={['discount-FALSE', 'discount-TRUE']}
                          labelList={['N', 'Y']}
                          initIndex={0}
                        />
                      </div>
                      {!formValues.discount && (
                        <>
                          <div className="inp_box">
                            <input
                              id={'discountDegree'}
                              name="discountDegree"
                              type="text"
                              className={'text-align-right'}
                              data-input-type={'currency, number'}
                              value={formValues.discountDegree}
                              onChange={onInputChangeHandler}
                            />
                            {/*{formErrors.name && (*/}
                            {/*  <ErrorMessage>{formErrors.name}</ErrorMessage>*/}
                            {/*)}*/}
                            <UnitBox
                              name={'discountType'}
                              setValue={setFormValues}
                              unitList={[
                                { label: '%', value: 'FLAT_RATE' },
                                { label: '원', value: 'FIXED_RATE' },
                              ]}
                            />
                            <div className="unit">할인</div>
                          </div>
                          <div className="calculator">
                            <span>할인가</span>
                            <em className={'discountPrice'}>10,000</em>원
                            <span>
                              (<em className={'discountAmount'}>1,000</em>원 할인)
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {/* cont_divider */}
                <div className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <p className="title">옵션 추가</p>
                    </div>
                    <div className="inp_section">옵션명 / 옵션가 / 재고수량 삭제....</div>
                  </div>
                </div>
                {/* cont_divider */}
                <div className="cont_divider">
                  <div className="input_row multipleLines">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor={'thumbnails'}>썸네일</label>
                    </div>
                    <div className="inp_section">
                      {fileList.length > 0 && (
                        <div className="grid-box grid-column">
                          {fileList.map((file, index) => (
                            <PreviewImage
                              key={`${file.name}-${index}`}
                              file={file.file}
                              style={{ margin: '0', maxWidth: '200px', marginBottom: '10px' }}
                            />
                          ))}
                        </div>
                      )}

                      <label className="inp_wrap file" htmlFor="thumbnails">
                        <div className="inp_box">
                          <input
                            id={'thumbnails'}
                            type="file"
                            accept="image/*"
                            className="hide"
                            multiple={true}
                            onChange={imageFileChangeHandler}
                          />
                          <Fake_input filename={fileList.length && fileList[0].filename} />
                        </div>
                      </label>
                      <div className="desc">
                        <p>* 첫 번째 이미지가 단품 리스트의 대표 이미지로 노출됩니다.</p>
                        <p>* 이미지는 최소 1장, 최대 10장 등록가능합니다.</p>
                        <p>* 이미지는 1MB이하 / jpg, jpeg, png, gif 형식만 등록가능합니다.</p>
                        <p>* 이미지 비율 1:1</p>
                      </div>
                      {formErrors.thumbnails && (
                        <ErrorMessage>{formErrors.thumbnails}</ErrorMessage>
                      )}
                    </div>
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

export default CreateSingleItemPage;
