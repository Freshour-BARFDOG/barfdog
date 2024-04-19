import React, { useEffect, useState } from 'react';
import s from '/src/pages/survey/survey.module.scss';
import rem from '/util/func/rem';
import { IoClose } from 'react-icons/io5';

export default function SurveyStep17({
  formValues,
  setFormValues,
  onInputChangeHandler,
  surveyPageRef,
}) {
  const [inputValues, setInputValues] = useState(
    formValues.map((dog) => dog.favoriteIngredients || ''),
  );

  // UI '짤림 현상'해결
  useEffect(() => {
    const swiperWrap = surveyPageRef.current;
    const slideWithDependencyElem = swiperWrap.querySelector(
      '.swiper-slide-active',
    );
    const activeSlideHeight = slideWithDependencyElem.offsetHeight;
    const targetSwiperElem = swiperWrap.querySelector('.swiper-wrapper');
    targetSwiperElem.style.height = rem(activeSlideHeight);
  }, [formValues]);

  const onChangeHandler = (e, index) => {
    const { value } = e.target;

    setInputValues((prevInputValues) => {
      const newInputValues = [...prevInputValues];
      newInputValues[index] = value;
      return newInputValues;
    });
  };

  const addHandler = (index) => {
    const oldValue = formValues[index].favoriteIngredients;
    let newValue = '';

    if (oldValue === '') {
      newValue = inputValues[index];
    } else if (oldValue.includes(inputValues[index])) {
      newValue = oldValue;
    } else {
      newValue = `${oldValue},${inputValues[index]}`;
    }

    // 내용 업데이트
    setFormValues((prevFormValues) => {
      const newFormValues = prevFormValues.map((item, idx) => {
        if (idx === index) {
          return {
            ...item,
            favoriteIngredients: newValue,
          };
        }
        return item;
      });

      return newFormValues;
    });

    // 입력값 초기화
    setInputValues((prevInputValues) => {
      const newInputValues = [...prevInputValues];
      newInputValues[index] = '';
      return newInputValues;
    });
  };

  const removeHandler = (ingredient, ingredientIdx, index) => {
    // 내용 업데이트
    setFormValues((prevFormValues) => {
      const newFormValues = prevFormValues.map((item, idx) => {
        if (idx === index) {
          const ingredients = item.favoriteIngredients.split(',');
          const newIngredients = ingredients.filter(
            (_, index) => index !== ingredientIdx,
          );
          const newFavoriteIngredients = newIngredients.join(',');

          return {
            ...item,
            favoriteIngredients: newFavoriteIngredients,
          };
        }
        return item;
      });
      return newFormValues;
    });
  };

  return (
    <section id="surveyPage" className={s.step17Page}>
      {formValues?.map((dog, index) => (
        <div key={index} className={s.input_fav_container}>
          <p className={s.input_title_message}>
            {dog.name} (이)가 좋아하는 재료는 무엇인가요 ?{' '}
            <span>(선택사항)</span>
          </p>
          <div className={s.input_fav_box}>
            <input
              id={`favoriteIngredients`}
              className={s.input_name}
              type="text"
              placeholder="좋아하는 재료를 적어주세요"
              value={inputValues[index] || ''}
              onChange={(e) => onChangeHandler(e, index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addHandler(index);
                }
              }}
            />
            <button
              className={s.input_remove_button}
              onClick={() => addHandler(index)}
            >
              입력
            </button>
          </div>
          <div className={s.tag_button_box}>
            {dog.favoriteIngredients !== '' &&
              dog.favoriteIngredients
                ?.split(',')
                .map((ingredient, ingredientIdx) => (
                  <div key={ingredientIdx} className={s.tag_button}>
                    <p
                      onClick={() =>
                        removeHandler(ingredient, ingredientIdx, index)
                      }
                    >
                      {ingredient}
                      <IoClose className={s.tag_button_close} />
                    </p>
                  </div>
                ))}
          </div>

          {formValues.length >= 2 && index !== formValues.length - 1 && (
            <div className={s.input_line}></div>
          )}
        </div>
      ))}
    </section>
  );
}
