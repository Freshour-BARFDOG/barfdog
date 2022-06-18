import ModalWrapper from './ModalWrapper';
import React from 'react';
import s from './modal_previewRecipeThumb.module.scss';
import CloseButton from '../atoms/CloseButton';
import CustomInput from '../atoms/CustomInput';
import { ItemRecommendlabel } from '../atoms/ItemLabel';
import ScrollContainer from '/src/components/atoms/ScrollContainer';
import PreviewImage from '/src/components/atoms/PreviewImage';
import checkStringUnderConsonant from '/util/func/CheckStringUnderConsonant';



export default function Modal_previewRecipeThumb({ data, file, onModalHide }) {
  // console.log(file);
  // console.log(data);
  const hasRecipeNameUnderConsonant = checkStringUnderConsonant(data.descriptionForSurvey);

  return (
    <>
      <ModalWrapper
        background
        onBackgroundClick={onModalHide}
        positionCenter
        style={{ padding: 0 }}
        id={s.modal}
      >
        <header className={s.header}>
          <div className={s.row}>
            <div className={s.inner}>
              <h2 className={s.title}>레시피썸네일</h2>
              <span>
                <CloseButton
                  onClick={onModalHide}
                  lineColor={'#fff'}
                  style={{ width: '28px', height: '28px' }}
                />
              </span>
            </div>
          </div>
        </header>
        <ScrollContainer height={600} scrollBarWidth={10}>
          <main className={s.body}>
            <div className={s.row}>
              <section className={s.divider}>
                <h3 className={s.mainTitle}>썸네일1</h3>
                <div className={s.title_grid_box}>
                  <div className={s.grid_left}>
                    <figure className={`${s.image} img-wrap`}>
                      <PreviewImage
                        file={file.surveyResult.file}
                        backgroundColor={'transparent'}
                        style={{margin:'0'}}
                      />
                    </figure>
                    <figcaption className={s.recipe_title}>
                      <p className={s.title_en}>{data.uiNameEnglish}</p>
                      <p className={s.title_ko}>{data.uiNameKorean}</p>
                    </figcaption>
                  </div>

                  <div className={s.grid_right}>
                    <div className={s.result_title}>
                      <p>시호에게는</p>
                      <p>
                        <em className={s.accent}>{data.descriptionForSurvey}</em>
                        <span>{hasRecipeNameUnderConsonant ? '이' : '가'} </span>필요한
                      </p>
                      <p>
                        <b className={s.accent}>{data.name}</b> 레시피를 추천합니다.
                      </p>
                    </div>
                    <div className={s.recommend_data_wrap}>
                      <span className={s.title}>시호의 하루 권장 칼로리</span>
                      <span className={s.data}>479kcal</span>
                      <span className={s.title}>하루 권장 식사량</span>
                      <span className={s.data}>286g</span>
                      <span className={s.title}>
                        한끼 권장 식사량
                        <br />
                        <span>&#40;하루 두 끼 기준&#41;</span>
                      </span>
                      <span className={s.data}>143g</span>
                    </div>
                    <div className={s.desc}>바프독 생식기준 결과</div>
                  </div>
                </div>
              </section>
              <section className={s.divider}>
                <h3 className={s.mainTitle}>썸네일2</h3>
                <div className={s['item-box']}>
                  <CustomInput
                    id={`test-input`}
                    type={'checkbox'}
                    name={'test-input'}
                    setSelectedRadio={() => {}}
                    setSelectedCheckbox={() => {}}
                    backgroundColor={'#fff'}
                  >
                    <ItemRecommendlabel
                      label="추천!"
                      style={{
                        backgroundColor: '#000',
                      }}
                    />
                    <div className={s.recipe_choice_box}>
                      <div className={s.img_box}>
                        <div className={`${s.image} img-wrap`}>
                          <PreviewImage
                            file={file.recipeThumb.file}
                            ratio={'200/220'}
                            backgroundColor={'transparent'}
                          />
                        </div>
                      </div>
                      <div className={s.row_1}>{data.uiNameEnglish}</div>
                      <div className={s.row_2}>{data.uiNameKorean}</div>
                      <div className={s.row_3}>
                        <pre>
                          {data.description}
                        </pre>
                      </div>
                      <div className={s.row_4}>더 알아보기</div>
                    </div>
                  </CustomInput>
                </div>
              </section>
            </div>
          </main>
        </ScrollContainer>
      </ModalWrapper>
    </>
  );
}
