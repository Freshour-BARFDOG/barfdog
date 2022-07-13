import React, { useEffect, useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import { useRouter } from 'next/router';
import { useModalContext } from '/store/modal-context';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import Tooltip from '/src/components/atoms/Tooltip';
import CustomRadio from '/src/components/admin/form/CustomRadio';
import Fake_input from '/src/components/atoms/fake_input';
import Modal_previewRecipeThumb from '/src/components/modal/Modal_previewRecipeThumb';
import IngredientsItemList from '/src/components/admin/product/ingredientsItemList';
import PreviewImage from '/src/components/atoms/PreviewImage';
import Spinner from '/src/components/atoms/Spinner';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import filter_extraIntegerNumberZeo from '/util/func/filter_extraIntegerNumberZeo';
import CustomRadioTrueOrFalse from '/src/components/admin/form/CustomRadioTrueOrFalse';
import { validate } from '/util/func/validation/validation_recipe';
import { valid_hasFormErrors } from '/util/func/validation/validationPackage';
import {getData, postObjData} from '/src/pages/api/reqData';



const initialFormValues = {
  name: '',
  description: '',
  uiNameKorean: '',
  uiNameEnglish: '',
  pricePerGram: '',
  gramPerKcal: '',
  ingredients: '', // 띄어쓰기 없이 콤마로 전송
  descriptionForSurvey: '',
  leaked: 'LEAKED',
  inStock: true,
};

const initialFileValues = {
  surveyResult: {
    file: '',
    filename: '',
    thumbnailUri: '',
  },
  recipeThumb: {
    file: '',
    filename: '',
    thumbnailUri: '',
  },
};


function UpdateRecipePage( { id }) {
  const getFormValuesApiUrl = `/api/recipes/${id}`;
  const postFormValuesApiUrl = `/api/recipes/${id}`;
  // - cf.) 파일 업로드 : post할 때, JSON파일과  IMAGE파일을 한 번에 전송 ( REST API 초기: 이미지를 업로드하는 시점에 upload하는 방식을 도입하기 전이었음)
  const router = useRouter();
  const mct = useModalContext();
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState({});
  const [activePreviewModal, setActivePreviewModal] = useState(false);
  const [thumbFile, setThumbFile] = useState(initialFileValues);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // console.log(thumbFile)
  // console.log(formValues);
  
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: true,
        }));
        const res = await getData(getFormValuesApiUrl);
        console.log(res);
 
       
        const DATA = res.data;
        
        const initialFormValues = {
          name: DATA.name,
          description: DATA.description,
          uiNameKorean: DATA.uiNameKorean,
          uiNameEnglish: DATA.uiNameEnglish,
          pricePerGram: DATA.pricePerGram,
          gramPerKcal: DATA.gramPerKcal,
          ingredients: DATA.ingredientList.join(','),
          descriptionForSurvey: DATA.descriptionForSurvey,
          leaked: DATA.leaked,
          inStock: DATA.inStock,
        };
        setFormValues(initialFormValues);
  
  
        const thumbFileData = {
          surveyResult: {
            file:null,
            filename: DATA.filename1,
            thumbnailUri: DATA.thumbnailUri1
          },
          recipeThumb: {
            file:null,
            filename: DATA.filename2,
            thumbnailUri: DATA.thumbnailUri2
      
          },
        }
        setThumbFile(thumbFileData)// 원본 thumnail ID list
      
      } catch (err) {
        console.error(err);
      }
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    })();
  }, []);
  
  
  
  const onShowPreviewModalHandler = () => {
    setActivePreviewModal(true);
  };
  const onHidePreviewModalHandler = () => {
    setActivePreviewModal(false);
  };
  
  const onInputChangeHandler = (event) => {
    const input = event.currentTarget;
    const { id, value } = input;
    const filteredType = input.dataset.inputType;
    let filteredValue = value;
    
    if (filteredType) {
      filteredValue = filter_emptyValue(value);
      if (filteredType.indexOf('number') >= 0) {
        filteredValue = filter_onlyNumber(filteredValue);
      }
      if (filteredType.indexOf('demicals') >= 0) {
        filteredValue = filter_extraIntegerNumberZeo(filteredValue);
      }
    }
    setFormValues((prevState) => ({
      ...prevState,
      [id]: filteredValue,
    }));
  };
  
  const imageFileChangeHandler = (e) => {
    const { id, files } = e.currentTarget;
    const file = files[0];
    const filename = file && file.name;
    setThumbFile((prevState) => ({
      ...prevState,
      [id]: { file, filename },
    }));
  };
  
  
  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitted) return;
    // ! IMPORTANT : submit 이후 enterKey event로 trigger되는 중복submit 방지
    console.log(formValues);
    const errObj = validate(formValues, thumbFile);
    setFormErrors(errObj);
    
    const isPassed = valid_hasFormErrors(errObj);
    
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      if (isPassed) {
        const jsonData = JSON.stringify(formValues);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const formData = new FormData();
        formData.append('requestDto', blob);
        formData.append('file1', thumbFile.surveyResult.file);
        formData.append('file2', thumbFile.recipeThumb.file);
        const res = await postObjData(postFormValuesApiUrl, formData, 'multipart/form-data');
        console.log(res);
        if (res.isDone) {
          onShowModalHandler('레시피가 성공적으로 생성되었습니다.');
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
    router.push('/bf-admin/product/recipe');
  };
  
  return (
    <>
      <MetaTitle title="레시피 수정" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>
              레시피 수정
              {isLoading.fetching && <Spinner />}
            </h1>
          </div>
          <section className="cont">
            <div className="cont_body">
              <form action="/" encType="multipart/form-data" method="post">
                <div className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor="name">
                        레시피 이름
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
                        레시피 설명
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
                        {formErrors.name && <ErrorMessage>{formErrors.description}</ErrorMessage>}
                      </div>
                    </div>
                  </div>
                </div>
                {/* cont_divider */}
                <div className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor="uiNameKorean">
                        한글 노출명
                      </label>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <input
                          id={'uiNameKorean'}
                          type="text"
                          name="uiNameKorean"
                          className="fullWidth"
                          value={formValues.uiNameKorean || ''}
                          onChange={onInputChangeHandler}
                        />
                        {formErrors.uiNameKorean && (
                          <ErrorMessage>{formErrors.uiNameKorean}</ErrorMessage>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* cont_divider */}
                <div className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor="uiNameEnglish">
                        영어 노출명
                      </label>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <input
                          id={'uiNameEnglish'}
                          type="text"
                          name="uiNameEnglish"
                          className="fullWidth"
                          value={formValues.uiNameEnglish || ''}
                          onChange={onInputChangeHandler}
                        />
                        {formErrors.uiNameEnglish && (
                          <ErrorMessage>{formErrors.uiNameEnglish}</ErrorMessage>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* cont_divider */}
                <div className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor="pricePerGram">
                        가격 상수
                      </label>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <input
                          id={'pricePerGram'}
                          type="text"
                          className={'text-align-right'}
                          data-input-type={'number, demicals'}
                          name="pricePerGram"
                          value={formValues.pricePerGram}
                          onChange={onInputChangeHandler}
                        />
                        <em className="unit">원 / g</em>
                        {formErrors.uiNameEnglish && (
                          <ErrorMessage>{formErrors.uiNameEnglish}</ErrorMessage>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* cont_divider */}
                <div className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor="gramPerKcal">
                        무게 상수
                      </label>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <input
                          id={'gramPerKcal'}
                          type="text"
                          data-input-type={'number, demicals'}
                          className={'text-align-right'}
                          value={formValues.gramPerKcal}
                          onChange={onInputChangeHandler}
                        />
                        <em className="unit">g / Kcal</em>
                        {formErrors.uiNameEnglish && (
                          <ErrorMessage>{formErrors.uiNameEnglish}</ErrorMessage>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* cont_divider */}
                <div className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor="descriptionForSurvey">
                        추천 문구
                        <Tooltip
                          message={`- 노출 위치\n1. 설문조사 ‘특별히 챙겨주고 싶은 부분’ \n2. 플랜, 레시피 선택페이지의 설문결과 설명란`}
                          messagePosition={'left'}
                          wordBreaking={true}
                          style={{ width: '270px' }}
                        />
                      </label>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <input
                          id={'descriptionForSurvey'}
                          type="text"
                          name="descriptionForSurvey"
                          onChange={onInputChangeHandler}
                          value={formValues.descriptionForSurvey || ''}
                          style={{ width: '286px' }}
                        />
                        {formErrors.descriptionForSurvey && (
                          <ErrorMessage>{formErrors.descriptionForSurvey}</ErrorMessage>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="cont_divider">
                  <div className="input_row multipleLines">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor="ingredients">
                        재료
                        <Tooltip
                          message={
                            '1. 설문조사 ‘못 먹는 음식’에 추가됩니다.\n2. 레시피에 등록된 모든 재료리스트가 노출되며, 새로 추가된 레시피재료만 삭제가능합니다.'
                          }
                          messagePosition={'left'}
                          wordBreaking
                          style={{ width: '280px' }}
                        />
                      </label>
                    </div>
                    <div className="inp_section">
                      <IngredientsItemList
                        id={'ingredients'}
                        formValues={formValues}
                        mode={'update'}
                        setFormValues={setFormValues}
                      />
                      {formErrors.ingredients && <ErrorMessage>{formErrors.ingredients}</ErrorMessage>
                      }
                    </div>
                  </div>
                </div>
                {/* cont_divider */}
                <div className="cont_divider">
                  <div className="input_row multipleLines">
                    <div className="title_section">
                      <label className="title">
                        썸네일 (설문결과)
                        <Tooltip
                          message={'플랜, 레시피 페이지의 설문결과에 노출'}
                          messagePosition={'left'}
                        />
                      </label>
                    </div>
                    <div className="inp_section">
                      <label className="inp_wrap file" htmlFor="surveyResult">
                        {(thumbFile.surveyResult.file || thumbFile.surveyResult.thumbnailUri) && (
                          <PreviewImage
                            file={thumbFile.surveyResult.file}
                            thumbLink={thumbFile.surveyResult?.thumbnailUri}
                            backgroundColor={'transparent'}
                            style={{ margin: '0', maxWidth: '200px', marginBottom: '10px' }}
                          />
                        )}
                        <div className="inp_box">
                          <input
                            id={'surveyResult'}
                            type="file"
                            accept="image/*"
                            className="hide"
                            multiple={false}
                            onChange={imageFileChangeHandler}
                          />
                          <Fake_input filename={thumbFile.surveyResult.filename} />
                          {formErrors.surveyResult && (
                            <ErrorMessage>{formErrors.surveyResult}</ErrorMessage>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                {/* cont_divider */}
                <div className="cont_divider">
                  <div className="input_row multipleLines">
                    <div className="title_section">
                      <label className="title">
                        썸네일 (레시피)
                        <Tooltip
                          message={
                            '1. 썸네일 상단의 글자는 이미지로 삽입해야합니다.\n2. 플랜, 레시피 페이지의 레시피 썸네일에 노출 '
                          }
                          wordBreaking
                          messagePosition={'left'}
                        />
                      </label>
                    </div>
                    <div className="inp_section">
                      <label className="inp_wrap file" htmlFor="recipeThumb">
                        {(thumbFile.recipeThumb.file || thumbFile.recipeThumb.thumbnailUri) && (
                          <PreviewImage
                            file={thumbFile.recipeThumb.file}
                            thumbLink={thumbFile.recipeThumb?.thumbnailUri}
                            backgroundColor={'transparent'}
                            style={{ margin: '0', maxWidth: '200px', marginBottom: '10px' }}
                          />
                        )}
                        <div className="inp_box">
                          <input
                            id={'recipeThumb'}
                            type="file"
                            accept="image/*"
                            className="hide"
                            multiple={false}
                            onChange={imageFileChangeHandler}
                          />
                          <Fake_input filename={thumbFile.recipeThumb.filename} />
                          {formErrors.recipeThumb && (
                            <ErrorMessage>{formErrors.recipeThumb}</ErrorMessage>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                {/* cont_divider */}
                <div className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <div className="title">
                        노출 여부
                        <Tooltip
                          message={'플랜,레시피 페이지의 목록에 노출합니다.'}
                          messagePosition={'left'}
                        />
                      </div>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <CustomRadio
                          name="leaked"
                          idList={['LEAKED', 'HIDDEN']}
                          labelList={['노출', '숨김']}
                          value={formValues.leaked}
                          setValue={setFormValues}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* cont_divider */}
                <div className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <div className="title">
                        재고 여부
                        <Tooltip
                          message={
                            '1. 품절된 레시피는 신규설문조사에서 구입 불가능합니다.\n2. 품절된 레시피를 구독 중인 고객은 결제 중지됩니다. \n3. 알림톡으로 품절안내 메시지가 전송됩니다. \n4. 유저는 사이트 접속 시, 안내창을 통해 품절상태를 확인하게 됩니다.'
                          }
                          wordBreaking={true}
                          messagePosition={'center'}
                          width={'400px'}/>
                      </div>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <CustomRadioTrueOrFalse
                          name="inStock"
                          value={formValues.inStock}
                          setValue={setFormValues}
                          labelList={['예', '품절']}
                        />
                        <em className={'errorMSG'}>( *품절 처리된 레시피를 구독 중인 고객은 결제 중지됩니다. )</em>
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
                className="admin_btn confirm_l line"
                onClick={onShowPreviewModalHandler}
              >
                미리보기
              </button>
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
                {isLoading.submit ? <Spinner style={{color:'#fff'}}/> : '등록'}
              </button>
            </div>
          </div>
        </AdminContentWrapper>
      </AdminLayout>
      {activePreviewModal && (
        <Modal_previewRecipeThumb
          data={formValues}
          file={thumbFile}
          onModalHide={onHidePreviewModalHandler}
        />
      )}
      <Modal_global_alert message={modalMessage} onClick={onGlobalModalCallback} background />
    </>
  );
}

export default UpdateRecipePage;




UpdateRecipePage.getInitialProps = async ({ query }) => {
  const { id } = query
  return { id : id};
  
}