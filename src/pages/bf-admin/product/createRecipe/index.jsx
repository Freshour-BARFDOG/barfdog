import React, { useEffect, useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import { useRouter } from 'next/router';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import Tooltip from '/src/components/atoms/Tooltip';
import CustomRadio from '/src/components/admin/form/CustomRadio';
import Fake_input from '/src/components/atoms/fake_input';
import Modal_previewRecipeThumb from '/src/components/modal/Modal_previewRecipeThumb';
import IngredientsItemList from '/src/components/admin/product/ingredientsItemList';
import enterKey from '/util/func/enterKey';
import PreviewImage from "/src/components/atoms/PreviewImage";






const initialFormValues = {
  name: '',
  description: '',
  uiNameKorean: '',
  uiNameEnglish: '',
  pricePerGram: '',
  gramPerKcal: '',
  ingredients: '',
  descriptionForSurvey: '',
  leaked: 'LEAKED',
  inStock: true,
};

const initialFormErrors = {};

function CreateRecipePage() {


  const router = useRouter();
  const [createdItem, setCreatedItem] = useState({});
  const [isActiveModal, setIsActiveModal] = useState(false);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [file, setFile] = useState({
    surveyResult: {
      file: '',
      filename: '',
    },
    recipeThumb: {
      file: '',
      filename: '',
    },
  });


  // console.log(formValues);




  useEffect(() => {
    // MEMO 재료 등록 후 , 초기화시킴
    setFormValues(prevState=>({
      ...prevState,
      ingredients: ''
    }))
  }, [createdItem]);



  const onShowModalHandler = () => {
    setIsActiveModal(true);
  };
  const onHideModalHandler = () => {
    setIsActiveModal(false);
  };




  const onAddIngredients = () => {
    const id = formValues.ingredients;
    setFormErrors(prevState=>({
      ...prevState,
      ingredients: id ? '' : '입력된 값이 없습니다.'
    }))

    if(!id)return;

    setCreatedItem(prevState => ({
      ...prevState,
      id
    }))

  };

  const onInputChangeHandler = (event) => {
    const { id, value } = event.currentTarget;

    setFormValues((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };




  const imageFileChangeHandler = (e) => {
    const { id, files } = e.currentTarget;
    const file = files[0];
    const filename = file && file.name;
    setFile((prevState) => ({
      ...prevState,
      [id]: { file, filename },
    }));
  };

  



  const onKeyboardHandler = (event) => {
    enterKey(event, onAddIngredients)
  }

  const returnToPrevPage = () => {
    if (confirm('이전 페이지로 돌아가시겠습니까?')) {
      router.back();
    }
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log('제출!');
  }; // * onSubmitHandler

  return (
    <>
      <MetaTitle title="레시피 생성" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>레시피 등록</h1>
          </div>
          <section className="cont">
            <div className="cont_body">
              <form
                action="/a"
                encType="multipart/form-data"
                method="post"
                onSubmit={onSubmitHandler}
              >
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
                          name="pricePerGram"
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
                          name="gramPerKcal"
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
                          style={{ width: '286px' }}
                        />
                        {formErrors.uiNameEnglish && (
                          <ErrorMessage>{formErrors.uiNameEnglish}</ErrorMessage>
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
                      <div className="inp_box">
                        <input
                          id={'ingredients'}
                          type="text"
                          name="ingredients"
                          onChange={onInputChangeHandler}
                          value={formValues.ingredients}
                          onKeyDown={onKeyboardHandler}
                        />
                        <button
                          type={'button'}
                          className={'admin_btn solid basic_l'}
                          onClick={onAddIngredients}
                        >
                          추가
                        </button>
                        {formErrors.ingredients && (
                          <ErrorMessage>{formErrors.ingredients}</ErrorMessage>
                        )}
                      </div>
                      <IngredientsItemList newItemObj={createdItem} />
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
                        {
                          file.surveyResult.file && <PreviewImage
                            file={file.surveyResult.file}
                            backgroundColor={'transparent'}
                            style={{ margin: '0', maxWidth: '200px', marginBottom: '10px' }}
                          />
                        }
                        <div className="inp_box">
                          <input
                            id={'surveyResult'}
                            type="file"
                            accept="image/*"
                            className="hide"
                            multiple={false}
                            onChange={imageFileChangeHandler}
                          />
                          <Fake_input filename={file.surveyResult.filename} />
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
                        { file.recipeThumb.file && <PreviewImage
                          file={file.recipeThumb.file}
                          backgroundColor={'transparent'}
                          style={{ margin: '0', maxWidth: '200px', marginBottom: '10px' }}
                        />}
                        <div className="inp_box">
                          <input
                            id={'recipeThumb'}
                            type="file"
                            accept="image/*"
                            className="hide"
                            multiple={false}
                            onChange={imageFileChangeHandler}
                          />
                          <Fake_input filename={file.recipeThumb.filename} />
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
                        품절 여부
                        <Tooltip
                          message={
                            '1. 품절된 레시피는 신규설문조사에서 구입 불가능합니다.\n2. 품절된 레시피를 구독 중인 고객은 결제 중지됩니다. \n3. 알림톡으로 품절안내 메시지가 전송됩니다. \n4. 유저는 사이트 접속 시, 안내창을 통해 품절상태를 확인하게 됩니다.'
                          }
                          wordBreaking={true}
                          messagePosition={'left'}
                          style={{ width: '400px' }}
                        />
                      </div>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <CustomRadio
                          setValue={setFormValues}
                          name="inStock"
                          idList={['inStock-FALSE', 'inStock-TRUE']}
                          labelList={['아니오', '품절']}
                        />
                        <em className={'errorMSG'}>( *품절처리 시, 상품이 삭제됩니다. )</em>
                      </div>
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
                          setValue={setFormValues}
                          name="leaked"
                          idList={['leaked-FALSE', 'leaked-TRUE']}
                          labelList={['아니오', '노출']}
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
                className="admin_btn confirm_l line"
                onClick={onShowModalHandler}
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
              <button type="submit" id="btn-create" className="admin_btn confirm_l solid">
                등록
              </button>
            </div>
          </div>
        </AdminContentWrapper>
      </AdminLayout>
      {isActiveModal && (
        <Modal_previewRecipeThumb data={formValues} file={file} onModalHide={onHideModalHandler} />
      )}
    </>
  );
}

export default CreateRecipePage;
