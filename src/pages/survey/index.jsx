import React, { useEffect, useState, useRef } from "react";
import ReactDOM from 'react-dom/client';
import s from "./survey.module.scss";
import StyleSwiper from "./surveySwiper.module.scss";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MetaTitle from "@src/components/atoms/MetaTitle";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import ScrollContainer from "@src/components/atoms/ScrollContainer";
import SurveyInputRadio from './SurveyInputRadio'
import siblings from "@util/func/siblings";
import Image from 'next/image';



function Survey() {
  const [surveyValues, setSurveyValues] = useState({
    healthStatus: "",
  });

  return (
    <>
      <MetaTitle title="설문조사" />
      <Layout>
        <Wrapper>
          <SurveySwiper surveyValues={surveyValues} setSurveyValues={setSurveyValues}/>
        </Wrapper>
      </Layout>
    </>
  );
}

export default Survey;


const SurveyStep1 = ({surveyValues, setSurveyValues}) => {
  const [activeDogBreedSelect, setActiveDogBreedSelect] = useState(false);
  const [selectedDogBreed, setSelectedDogBreed] = useState(false);
  const onClickDogBreedSelectHandler = () => {
    setActiveDogBreedSelect((prevState) => !prevState);
  };


  return (
    <section className={s.step1Page}>

      <div className={s.item_box}>
        <label>
          <div className="input-row">
            <div className={s.input_title}>
              반려견 이름
            </div>
            <input className={s.input_box_1} type="text" name="survey" placeholder="이름을 입력해주세요" />
          </div>
        </label>
      </div>
      

      <div className={s.item_box}>
        <label>
          <div className="input-row">
            <div className={s.input_title}>
              반려견 성별
            </div>
            <SurveyInputRadio
              surveyValues={surveyValues.size}
              setSurveyValues={setSurveyValues}
              title="반려견 성별"
              className={s.radio_gender}
              name="healthStatus"
              idList={[
                "male",
                "female"
              ]}
              labelList={[
                "수컷",
                "암컷"
              ]}
            />
          </div>
        </label>
      </div>

      <div className="input-row">
        <label>
          <div className={s.input_title}>
            반려견 출생년월
          </div>
          <div className={s.flex_box}>
            <div className={s.inner}>
              <input type="text" name="survey" />년
            </div>
            <div className={s.inner}>
              <input type="text" name="survey" />월
            </div>
          </div>
        </label>

        <div className={s.radio_check}>
          <label className={s.radio}>
            <input type="checkbox" name="" id="" />
            <div className={s.text}>
              노령견입니다.
            </div>
          </label>
        </div>

      </div>

     
      <div className="input-row">
        <div className={s.input_title}>
          견종선택
        </div>
        
        <div className={s.selectDogBreed}>
          <div className={s.viewer} onClick={onClickDogBreedSelectHandler}>
            {selectedDogBreed || "견종을 선택해주세요."}
          </div>
          {activeDogBreedSelect && (
            <SurveyStep1_SelectOptions
              options={[
                { value: "프랜치불독" },
                { value: "말티즈" },
                { value: "요크셔테리어" },
                { value: "보더테리어" },
                { value: "요로시크" },
                { value: "진독개" },
                { value: "오터 하운드" },
                { value: "실키 테리어" },
                { value: "삽살개" },
              ]}
              onHideSelectOptions={setActiveDogBreedSelect}
              setSelectedDogBreed={setSelectedDogBreed}
            />
          )}
        </div>
      </div>

      <div className="input-row">
        <SurveyInputRadio
          surveyValues={surveyValues.size}
          setSurveyValues={setSurveyValues}
          title="강아지 체급"
          className={s.dog_choice}
          name="healthStatus"
          idList={[
            "size-SMALL",
            "size-MIDDLE",
            "size-HEAVY",
          ]}
          labelList={[
            "소형견",
            "중형견",
            "대형견",
          ]}
        />
      </div>
      

      <label>
        <div className={s.input_title}>
          반려견 몸무게
        </div>
        <div className={s.flex_box}>
          <div className={s.inner_kg}>
            <input type="text" name="survey" placeholder="몸무게를 입력해주세요"/>kg
          </div>
        </div>
      </label>

      <div className="input-row">
        <div className={s.input_title}>
          중성화 여부
        </div>
        <SurveyInputRadio
          surveyValues={surveyValues.size}
          setSurveyValues={setSurveyValues}
          title="중성화 여부"
          className={s.radio_gender}
          name="healthStatus"
          idList={[
            "yes",
            "no"
          ]}
          labelList={[
            "했습니다",
            "안했습니다"
          ]}
        />
      </div>

    </section>
  );
};




const SurveyStep1_SelectOptions = ({
  options,
  onHideSelectOptions,
  setSelectedDogBreed,
}) => {



  const activeScrollContainer = options.length > 4;

  const onClickHandler = (e) => {
    const value = e.currentTarget.dataset.value;
    setSelectedDogBreed(value);
    onHideSelectOptions((prevstate) => !prevstate);
  };

  const [keyword, setKeyword] = useState("");

  const onSeachHandler = (e) => {
    // ! TODO : 검색기능 추가
    // keyup이벤트
    // 값이 없을 경우: 모든 데이터
    // 값이 있을 경우 : 있는 데이터만
    const value = e.currentTarget.value;
    setKeyword(value);
  };


  
  const Options = ({ value, className}) => {
    return (
      <p
        data-value={value}
        className={className}
        onClick={onClickHandler}
      >
        {value}
      </p>
    );
  };


  return (
    <>
      <div className={s["modal-selectDogBreed"]}>
        <input
          type="text"
          placeholder="견종을 입력하세요"
          className={s.search}
          value={keyword}
          onChange={onSeachHandler}
        />
        <ScrollContainer
          height={activeScrollContainer ? 143 : ""}
          scrollBarWidth={activeScrollContainer ? "12" : "0"}
          className={s.scrollContainer}
        >
          {options.map((option, i) => {
            const searchResult = option.value.includes(keyword);
            return (
              <div key={`${option.value}-${i}`}>
                {keyword.length ? (
                  <>
                    {searchResult && (
                      <Options
                        value={option.value}
                        className={s.searchResult}
                      />
                    )}
                  </>
                ) : (
                  <Options value={option.value} />
                )}
              </div>
            );
          })}
        </ScrollContainer>
      </div>
    </>
  );
};




const SurveyStep2 = ({ surveyValues, setSurveyValues }) => {

  return (
    <section className={s.step2page}>

      <div className={s.input_title}>
        반려견의 활동량은
      </div>


      <div className="input-row">
        <SurveyInputRadio
          surveyValues={surveyValues.healthStatus}
          setSurveyValues={setSurveyValues}
          title="종류"
          className={s.activity}
          name="activity"
          idList={[
            "healthStatus-TOO LITTLE",
            "healthStatus-LTTIEL",
            "healthStatus-USUALLY",
            "healthStatus-MUCH",
            "healthStatus-TOO MUCH",
          ]}
          labelList={[
            "매우 적어요",
            "",
            "보통",
            "",
            "매우 많아요",
          ]}
          defaultStyle
        />
      </div>


      <div className={s.input_title}>
        일주일 산책 횟수
      </div>

      <div className={s.flex_box2}>
        <div className={s.inner_flex_box}>
          평균
          <div className={s.inner}>
            <input className={s.input_1} type="text" name="survey" />회
          </div>
        </div>
        <div className={s.inner_flex_box}>
          1회당
          <div className={s.inner}>
            <input type="text" name="survey" />시간
          </div>
        </div>
      </div>

      
      <div className={s.input_title}>
        현재 상태는
      </div>

      <div className="input-row">
        <SurveyInputRadio
          surveyValues={surveyValues.healthStatus}
          setSurveyValues={setSurveyValues}
          title="종류"
          className={s.healthStatus}
          name="healthStatus"
          idList={[
            "healthStatus-HEALTH",
            "healthStatus-NEED DIET",
            "healthStatus-SERIOUS FAT",
            "healthStatus-PRAGNENT",
            "healthStatus-LACATATING",
          ]}
          labelList={[
            "건강해요",
            "다이어트 필요",
            "심각한 비만",
            "임신한 상태",
            "수유 중",
          ]}
        />
      </div>
    </section>
  );
};




const SurveyStep3 = ({ surveyValues, setSurveyValues }) => {
  return (
    <section className={s.step3page}>
      <div className="input-row">
        <div className={s.input_title}>
          간식 급여 횟수는
        </div>
      </div>


      <div className="input-row">
        <SurveyInputRadio
          surveyValues={surveyValues.numberOfSnacks}
          setSurveyValues={setSurveyValues}
          title="종류"
          className={s.numberOfSnacks}
          name="numberOfSnacks"
          idList={[
            "numberOfSnacks-LITTLE",
            "numberOfSnacks-USUALLY",
            "numberOfSnacks-MUCH",
          ]}
          labelList={["적어요", "적당해요", "많아요"]}
          desc={[
            <span key={"desc-01"}>
              식사에 <br /> 상관없는 양
            </span>,
            <span key={"desc-02"}>
              식사에 어느정도
              <br /> 상관 있는 양
            </span>,
            <span key={"desc-03"}>
              식사에 상당한
              <br /> 영향이 있는 양
            </span>,
          ]}
        />
      </div>


        <div className="input-row">

          <div className={s.input_title}>
            반려견은 못먹는 음식이
          </div>
          <SurveyInputRadio
            surveyValues={surveyValues.size}
            setSurveyValues={setSurveyValues}
            title="못먹는음식"
            className={s.food_check}
            name="foodcheck"
            idList={[
              "food_yes",
              "food_no",
              "chicken",
              "turkey",
              "cow",
              "sheep",
              "duck",
              "etc"
            ]}
            labelList={[
              "있어요",
              "없어요",
              "닭",
              "칠면조",
              "소",
              "양",
              "오리",
              "기타"
            ]}
          />
        </div>


        <div className="input-row">
          <div className={s.item_box}>
            <label>
              <div className="input-row">
                <div className={s.input_title}>
                  반려견 이름
                </div>
                <input className={s.input_box_1} type="text" name="survey" placeholder="직접 입력해주세요" />
              </div>
            </label>
          </div>
        </div>

        <div className="input-row">
          <div className={s.red_text}>
            ※ 바프독의 모든 생식 레시피에는<br />
            영양분이 가득한 육고기, 뼈, 내장, 채소 등이 들어갑니다. <br />
            육고기와 뼈의 경우 알러지 분류에 들어가지만<br />
            내장의 경우 알러지 분류에 들어가지 않으니 참고해주세요.<br />
          </div>
        </div>

        <div className="input-row">

          <div className={s.input_title}>
            특별히 챙겨주고 싶은 부분은
          </div>
          <SurveyInputRadio
            surveyValues={surveyValues.size}
            setSurveyValues={setSurveyValues}
            title="넣어둬넣어둬"
            className={s.take_care}
            name="take_care"
            idList={[
              "생식스타트",
              "피로회복",
              "피부강화",
              "영양보충"
            ]}
            labelList={[
              "안정적인 첫 생식 적응",
              "피로회복 & 면역력 향상",
              "피부와 모질 강화 필요",
              "건강한 성장과 영양보충"
            ]}
          />
        </div>

        <div className="input-row">

          <div className={s.input_title}>
            기타 특이사항(질병 등)이
          </div>
          <SurveyInputRadio
            surveyValues={surveyValues.size}
            setSurveyValues={setSurveyValues}
            title="질병유무"
            className={s.disease_check}
            name="take_care"
            idList={[
              "disease_yes",
              "disease_no"
            ]}
            labelList={[
              "있어요",
              "없어요"
            ]}
          />
        </div>
        
        <div className="input-row">
          <div className={s.item_box}>
            <label>
              <div className="input-row">
                <input className={s.input_box_1} type="text" name="disease" placeholder="직접 입력해주세요" />
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




function SurveySwiper({surveyValues, setSurveyValues}) {

  const navPrev_mainRef = useRef(null);
  const navNext_mainRef = useRef(null);

  const swiperSettings = {
    className: StyleSwiper.swiperSurvey,
    spaceBetween: 0,
    loop: false,
    centeredSlides: true,
    autoplay: false,
    slidesPerView: 1,
    pagination: {
      clickable: false,
    },
    navigation: {
      prevEl: navPrev_mainRef.current,
      nextEl: navNext_mainRef.current,
    },
    modules: [Navigation, Pagination],
  };



  const onSwiperInitHandler =(el, idx) => {
    el.classList.add(
      `${StyleSwiper["swiper-pagination"]}`
    );
    const curSurveyStep = `${idx+1}`;
    el.dataset.step = curSurveyStep;
    const bullets = Array.from(el.children);
    bullets[0].classList.add(StyleSwiper["swiper-pagination-bullet-active"]);
    bullets.forEach((v, idx) => {
      v.classList.add(`${StyleSwiper["swiper-pagination-bullet"]}`);
      const desc = document.createElement('span');
      desc.classList.add(StyleSwiper['desc']);
      v.append(desc);
      if (idx === 0) desc.innerText = '기본정보 입력';
      if (idx === 1) desc.innerText = '활동량 입력';
      if (idx === 2) desc.innerText = '추가정보 입력';

      
    });
    // PaginationIndicator(el);
  }

  const onSwiperChangeIndexHandler = (el, idx) => {
    const curSurveyStep = `${idx + 1}`;
    el.dataset.step = curSurveyStep;
    const bullets = Array.from(el.children);
    bullets[idx].classList.add(
      StyleSwiper["swiper-pagination-bullet-active"]
    );
    siblings(bullets[idx]).forEach((sib) =>
      sib.classList.remove(StyleSwiper["swiper-pagination-bullet-active"])
    );
  }

  return (
    <div className={s.swiper_main_outerWrap}>
      <Swiper
        {...swiperSettings}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = navPrev_mainRef.current;
          swiper.params.navigation.nextEl = navNext_mainRef.current;
          swiper.navigation.destroy();
          swiper.navigation.init();
          swiper.navigation.update();
          onSwiperInitHandler(swiper.pagination.el, 0);
          swiper.pagination.destroy();
          swiper.pagination.init();
          swiper.pagination.update();
        }}
        onRealIndexChange={(swiper) => {
          onSwiperChangeIndexHandler(swiper.pagination.el, swiper.activeIndex);
        }}
      >
        <SwiperSlide>
          <SurveyStep1
            surveyValues={surveyValues}
            setSurveyValues={setSurveyValues}
          />
          <section className={s.swiper_navigation_container}>
            <i className={s["swiper-button-prev"]} ref={navPrev_mainRef}>
              <div className={s.left_side_btn}>
                <div className={s.left_btn}>
                  <div className={s.image_box}>
                    <div className={`${s.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/survey_left_arrow.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="이전 화살표"
                      />
                    </div>
                  </div>
                  이전
                </div>
              </div>
            </i>
            <i className={s["swiper-button-next"]} ref={navNext_mainRef}>
              <div className={s.right_side_btn}>
                <div className={s.right_btn}>
                  다음
                  <div className={s.image_box}>
                    <div className={`${s.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/survey_right_arrow.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="이전 화살표"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </i>
          </section>
        </SwiperSlide>
        <SwiperSlide>
          <SurveyStep2
            surveyValues={surveyValues}
            setSurveyValues={setSurveyValues}
          />
          <SwiperButtonWrapper
            refer={{ prev: navPrev_mainRef, next: navNext_mainRef }}
          />
        </SwiperSlide>
        <SwiperSlide>
          <SurveyStep3
            surveyValues={surveyValues}
            setSurveyValues={setSurveyValues}
          />
          <SwiperButtonWrapper
            refer={{ prev: navPrev_mainRef, next: navNext_mainRef }}
          />
        </SwiperSlide>
      </Swiper>
<<<<<<< HEAD
      <div className={s.swiper_navigation_container}>
        <i className={s["swiper-button-prev"]} ref={navPrev_mainRef}>
          <div className={s.left_side_btn}>
            <div className={s.left_btn}>
              <div className={s.image_box}>
                <div className={`${s.image} img-wrap`}>
                  <Image
                    priority
                    src={require("public/img/survey_left_arrow.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="이전 화살표"
                  />
                </div>
              </div>
              이전
            </div>
          </div>
          
        </i>

        <i className={s["swiper-button-next"]} ref={navNext_mainRef}>
          <div className={s.right_side_btn}>
            <div className={s.right_btn}>
              다음
              <div className={s.image_box}>
                <div className={`${s.image} img-wrap`}>
                  <Image
                    priority
                    src={require("public/img/survey_right_arrow.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="이전 화살표"
                  />
                </div>

              </div>
              
            </div>
          </div>
        </i>
      </div>
=======
>>>>>>> main
    </div>
  );
}


const SwiperButtonWrapper = ({ refer }) => {
  console.log(refer);
  return (
    <section className={s.swiper_navigation_container}>
      <i className={s["swiper-button-prev"]} ref={refer.prev}>
        <div className={s.left_side_btn}>
          <div className={s.left_btn}>
            <div className={s.image_box}>
              <div className={`${s.image} img-wrap`}>
                <Image
                  priority
                  src={require("public/img/survey_left_arrow.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="이전 화살표"
                />
              </div>
            </div>
            이전
          </div>
        </div>
      </i>
      <i className={s["swiper-button-next"]} ref={refer.next}>
        <div className={s.right_side_btn}>
          <div className={s.right_btn}>
            다음
            <div className={s.image_box}>
              <div className={`${s.image} img-wrap`}>
                <Image
                  priority
                  src={require("public/img/survey_right_arrow.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="이전 화살표"
                />
              </div>
            </div>
          </div>
        </div>
      </i>
    </section>
  );
};
