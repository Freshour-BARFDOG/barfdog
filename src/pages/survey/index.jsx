import React, { useEffect, useState, useRef } from "react";
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
import ScrollContainer from "@src/components/atoms/ScrollContainer";
import SurveyInputRadio from './SurveyInputRadio'
import siblings from "@util/func/siblings";





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
      <h1>스탭1 페이지</h1>
      <div className="input-row">
        반려견이름
        <input type="text" name="survey" />
      </div>

      <div className="input-row">
        반려견 성별
        <input type="text" name="survey" />
      </div>

      <div className="input-row">
        반려견 출생연월
        <div className="inner">
          <input type="text" name="survey" />년
        </div>
        <div className="inner">
          <input type="text" name="survey" />월
        </div>
        <label className="radio"> 
          <input type="checkbox" name="" id="" />
          노령견입니다.
        </label>
      </div>
      <div className="input-row">
        반려견 출생연월
        <input type="text" name="survey" />
      </div>
      <div className="input-row">
        견종선택
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
          className={s.size}
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
    <section>
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
            "매우적어요",
            "",
            "보통",
            "",
            "매우 많아요",
          ]}
          defaultStyle
        />
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
    <section>
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
      <div className={s.swiper_navigation_container}>
        <i className={s["swiper-button-prev"]} ref={navPrev_mainRef}>
          __[왼쪽페이지 버튼]__
        </i>

        <i className={s["swiper-button-next"]} ref={navNext_mainRef}>
          ___[다음페이지 버튼]___
        </i>
      </div>

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
          <SurveyStep1 surveyValues={surveyValues} setSurveyValues={setSurveyValues}/>
        </SwiperSlide>
        <SwiperSlide>
          <SurveyStep2 surveyValues={surveyValues} setSurveyValues={setSurveyValues}/>
        </SwiperSlide>
        <SwiperSlide>
          <SurveyStep3 surveyValues={surveyValues} setSurveyValues={setSurveyValues}/>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
