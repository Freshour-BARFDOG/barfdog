import React, { useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import { useRouter } from 'next/router';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import Tooltip from '/src/components/atoms/Tooltip';
import Checkbox from '/src/components/atoms/Checkbox';
import CustomRadio from '/src/components/admin/form/CustomRadio';
import Fake_input from '/src/components/atoms/fake_input';
import PreviewImage from '../../../../components/atoms/PreviewImage';
import CloseButton from '../../../../components/atoms/CloseButton';

const initialFormValues = {};
const initialFormErrors = {};

function CreateRecipePage() {
  const router = useRouter();
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

  console.log(formValues);

  const onInputChangeHandler = (e) => {
    const { id, value } = e.currentTarget;

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
                          type="text"
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
                        레시피 이름(한글)
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
                        레시피 이름(영어)
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
                        추천 설명
                        <Tooltip
                          message={'설문조사 중 ‘특별히 못 먹는 음식’에 추가됩니다.'}
                          messagePosition={'left'}
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
                          message={'설문조사 중 ‘못 먹는 음식’에 추가됩니다.'}
                          messagePosition={'left'}
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
                        />
                        <button className={'admin_btn solid basic_l'}>추가</button>
                        {formErrors.ingredients && (
                          <ErrorMessage>{formErrors.ingredients}</ErrorMessage>
                        )}
                      </div>
                      <ul className={'grid-checkbox-wrap'} style={{ maxWidth: '400px' }}>
                        <li>
                          <Checkbox id="ox" onClick={''} />
                          <span>소</span>
                          <span className={'circle-btn-wrap'}>
                            <CloseButton
                              onClick={() => {
                                console.log('해당 재료 삭제하기');
                              }}
                              lineColor={'var(--color-line-02)'}
                              style={{ width: '14px', height: '14px' }}
                            />
                          </span>
                        </li>
                        <li>
                          <Checkbox id="duck" />
                          <span>오리</span>
                          <span className={'circle-btn-wrap'}>
                            <CloseButton
                              onClick={() => {
                                console.log('해당 재료 삭제하기');
                              }}
                              lineColor={'var(--color-line-02)'}
                              style={{ width: '14px', height: '14px' }}
                            />
                          </span>
                        </li>
                        <li>
                          <Checkbox id="lamb" />
                          <span>양</span>
                          <span className={'circle-btn-wrap'}>
                            <CloseButton
                              onClick={() => {
                                console.log('해당 재료 삭제하기');
                              }}
                              lineColor={'var(--color-line-02)'}
                              style={{ width: '14px', height: '14px' }}
                            />
                          </span>
                        </li>
                        <li>
                          <Checkbox id="turkey" onClick={''} />
                          <span>칠면조</span>
                          <CloseButton
                            onClick={() => {
                              console.log('해당 재료 삭제하기');
                            }}
                            lineColor={'var(--color-line-02)'}
                            style={{ width: '14px', height: '14px' }}
                          />
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* cont_divider */}

                <div className="cont_divider">
                  <div className="input_row">
                    <div className="title_section">
                      <label className="title">
                        썸네일 (설문결과)
                        <Tooltip
                          message={'클릭 시, 미리보기'}
                          iconStyle={{
                            color: 'var(--color-primary04)',
                            borderColor: 'var(--color-primary04)',
                          }}
                          onClick={() => {
                            console.log('썸네일 보여주는 모달');
                          }}
                        />
                      </label>
                    </div>
                    <div className="inp_section">
                      <label className="inp_wrap file" htmlFor="surveyResult">
                        {/*<PreviewImage file={file.surveyResult} ratio={1/1} />*/}
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
                  <div className="input_row">
                    <div className="title_section">
                      <label className="title">
                        썸네일 (레시피)
                        <Tooltip
                          message={'클릭 시, 미리보기'}
                          iconStyle={{
                            color: 'var(--color-primary04)',
                            borderColor: 'var(--color-primary04)',
                          }}
                          onClick={() => {
                            console.log('썸네일 보여주는 모달');
                          }}
                        />
                      </label>
                    </div>
                    <div className="inp_section">
                      <label className="inp_wrap file" htmlFor="recipeThumb">
                        {/*<PreviewImage file={file.surveyResult} ratio={1/1} />*/}
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
                      <label className="title" htmlFor="inStock">
                        품절 여부
                        <Tooltip
                          message={
                            '1. 품절된 레시피는 신규설문조사에서 구입 불가능합니다.\n2. 품절된 레시피를 구독 중인 고객은 결제 중지됩니다. \n3. 알림톡으로 품절안내 메시지가 전송됩니다. \n4. 유저는 사이트 접속 시, 안내창을 통해 품절상태를 확인하게 됩니다.'
                          }
                          wordBreaking={true}
                          messagePosition={'left'}
                          style={{ width: '400px' }}
                        />
                      </label>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <CustomRadio
                          setValue={setFormValues}
                          name="inStock"
                          idList={['TRUE', 'FALSE']}
                          labelList={['Y', 'N']}
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
                      <label className="title" htmlFor="leaked">
                        노출 여부
                        <Tooltip
                          message={'미노출 상품은 사용자의 레시피에 목록에서 제외됩니다.'}
                          messagePosition={'left'}
                        />
                      </label>
                    </div>
                    <div className="inp_section">
                      <div className="inp_box">
                        <CustomRadio
                          setValue={setFormValues}
                          name="leaked"
                          idList={['TRUE', 'FALSE']}
                          labelList={['Y', 'N']}
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

export default CreateRecipePage;
