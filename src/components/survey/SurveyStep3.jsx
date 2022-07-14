import s from '/src/pages/survey/survey.module.scss';
import SurveyInputRadio from './SurveyInputRadio';
import React from 'react';

export default function SurveyStep3 ({formValues, setFormValues}) {
  return (
    <section className={s.step3page}>
      <div className="input-row">
        <div className={s.input_title}>간식 급여 횟수는</div>
      </div>
      
      <div className="input-row">
        <SurveyInputRadio
          surveyValues={formValues.numberOfSnacks}
          setSurveyValues={setFormValues}
          title="종류"
          className={s.numberOfSnacks}
          name="numberOfSnacks"
          idList={['numberOfSnacks-LITTLE', 'numberOfSnacks-USUALLY', 'numberOfSnacks-MUCH']}
          labelList={['적어요', '적당해요', '많아요']}
          desc={[
            <span key={'desc-01'}>
              식사에 <br/> 상관없는 양
            </span>,
            <span key={'desc-02'}>
              식사에 어느정도
              <br/> 상관 있는 양
            </span>,
            <span key={'desc-03'}>
              식사에 상당한
              <br/> 영향이 있는 양
            </span>,
          ]}
        />
      </div>
      
      <div className="input-row">
        <div className={s.input_title}>반려견은 못먹는 음식이</div>
        <SurveyInputRadio
          surveyValues={formValues.size}
          setSurveyValues={setFormValues}
          title="못먹는음식"
          className={s.food_check}
          name="foodcheck"
          idList={['food_yes', 'food_no', 'chicken', 'turkey', 'cow', 'sheep', 'duck', 'etc']}
          labelList={['있어요', '없어요', '닭', '칠면조', '소', '양', '오리', '기타']}
        />
      </div>
      
      <div className="input-row">
        <div className={s.item_box}>
          <label>
            <div className="input-row">
              <div className={s.input_title}>반려견 이름</div>
              <input
                className={`${s.input_box_1} ${s['focus-underline']}`}
                type="text"
                name="survey"
                placeholder="직접 입력해주세요"
              />
            </div>
          </label>
        </div>
      </div>
      
      <div className="input-row">
        <div className={s.red_text}>
          ※ 바프독의 모든 생식 레시피에는
          <br/>
          영양분이 가득한 육고기, 뼈, 내장, 채소 등이 들어갑니다. <br/>
          육고기와 뼈의 경우 알러지 분류에 들어가지만
          <br/>
          내장의 경우 알러지 분류에 들어가지 않으니 참고해주세요.
          <br/>
        </div>
      </div>
      
      <div className="input-row">
        <div className={s.input_title}>특별히 챙겨주고 싶은 부분은</div>
        <SurveyInputRadio
          surveyValues={formValues.size}
          setSurveyValues={setFormValues}
          title="넣어둬넣어둬"
          className={s.take_care}
          name="take_care"
          idList={['생식스타트', '피로회복', '피부강화', '영양보충']}
          labelList={[
            '안정적인 첫 생식 적응',
            '피로회복 & 면역력 향상',
            '피부와 모질 강화 필요',
            '건강한 성장과 영양보충',
          ]}
        />
      </div>
      
      <div className="input-row">
        <div className={s.input_title}>기타 특이사항(질병 등)이</div>
        <SurveyInputRadio
          surveyValues={formValues.size}
          setSurveyValues={setFormValues}
          title="질병유무"
          className={s.disease_check}
          name="take_care"
          idList={['disease_yes', 'disease_no']}
          labelList={['있어요', '없어요']}
        />
      </div>
      
      <div className="input-row">
        <div className={s.item_box}>
          <label>
            <div className="input-row">
              <input
                className={`${s.input_box_1} ${s['focus-underline']}`}
                type="text"
                name="disease"
                placeholder="직접 입력해주세요"
              />
            </div>
          </label>
        </div>
      </div>
      
      <div className="input-row">
        <div className={s.red_text}>
          ※ 질병여부 필수 작성해주세요 <br/>
          ( 질병에 따라 급여가 불가 할 수 있습니다.) <br/>
          ex. 췌장염, 쿠싱, 심장병, 만성췌장, 고지혈 등 <br/>
        </div>
      </div>
    </section>
  );
};