import React, { useState, useEffect } from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import s from "./updateOrder.module.scss";
import Image from 'next/image';
import ItemLabel, {ItemRecommendlabel} from "/src/components/atoms/ItemLabel";
import rem from '/util/func/rem';
import CustomInput from "/src/components/atoms/CustomInput";
import { useRouter } from "next/router";
import Link from 'next/link';




const CustomInputRadio_plan = ({name, handler}) => {

  const [selectedRadio , setSelectedRadio] = useState(null);
  useEffect(() => {
    if (selectedRadio && typeof handler === 'function') {
      handler(selectedRadio);
    }
  }, [selectedRadio, handler]);



  return (

      <div className={s.flex_box} data-input-title={name}>
        <CustomInput
            id={`FULLPLAN`}
            type="radio"
            name={name}
            selectedRadio={selectedRadio}
            setSelectedRadio={setSelectedRadio}
        >

          <ItemLabel
              label="BEST"
              style={{
                backgroundColor: "var(--color-main)",
                height: rem(34),
                left: rem(34),
                top: rem(14),
                width: rem(300),
                transform: "translate(-50%, 0)rotate(-45deg)",
              }}
          />

        <ul className={s.plan_box}>

        <li className={s.plan_grid_1}>
          <div className={s.img_box}>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/subscribe/subscribe_full_plan.png")}
                objectFit="cover"
                layout="fill"
                alt="카드 이미지"
              />
            </div>
          </div>
          <h2>풀플랜</h2>
        </li>

        <li>
          <p>하루에 <em>두 끼</em>를 바프독으로 먹어요</p>
        </li>

        <li>
          <div className={s.grid_box}>
            <div className={s.row_1}>
              하루에<span>&nbsp;2팩</span>
            </div>
            <div className={s.row_2}>
              <span>2주</span>&nbsp;정기배송
            </div>
            <div className={s.row_3}>
              <span>143g</span>&nbsp;(1팩기준)
            </div>
            <div className={s.row_4}>
              20팩 x <span>7,200원</span> 
            </div>
          </div>
        </li>

        <li>
          <div className={s.text1}>
            5%&nbsp; <span>144,000원</span>
          </div>

          <div className={s.text2}>
            142,560원
          </div>
        </li>

        </ul>

        </CustomInput>
        <CustomInput
            id={`HALFPLAN`}
            type="radio"
            name={name}
            selectedRadio={selectedRadio}
            setSelectedRadio={setSelectedRadio}
        >

          <ul className={s.plan_box}>

          <li>
            <div className={s.img_box}>
              <div className={`${s.image} img-wrap`}>
                <Image
                  priority
                  src={require("public/img/subscribe/subscribe_full_plan.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="카드 이미지"
                />
              </div>
            </div>
            <h2>하프플랜</h2>
          </li>

          <li>
            <p>하루에 <em>한 끼</em>를 바프독으로 먹어요</p>
          </li>

          <li>
            <div className={s.grid_box}>
              <div className={s.row_1}>
                하루에<span>&nbsp;2팩</span>
              </div>
              <div className={s.row_2}>
                <span>4주</span>&nbsp;정기배송
              </div>
              <div className={s.row_3}>
                <span>143g</span>&nbsp;(1팩기준)
              </div>
              <div className={s.row_4}>
                20팩 x <span>7,200원</span> 
              </div>
            </div>
          </li>

          <li>
            <div className={s.text1}>
              5%&nbsp; <span>144,000원</span>
            </div>

            <div className={s.text2}>
              142,560원
            </div>
          </li>

          </ul>


        </CustomInput>
        <CustomInput
            id={`TOPPINGPLAN`}
            type="radio"
            name={name}
            selectedRadio={selectedRadio}
            setSelectedRadio={setSelectedRadio}
        >
          <ItemLabel
              label="NEW"
              style={{
                backgroundColor: "#FF8C16",
                height: rem(34),
                left: rem(34),
                top: rem(14),
                width: rem(300),
                transform: "translate(-50%, 0)rotate(-45deg)",
              }}
          />


          <ul className={s.plan_box}>

          <li>
            <div className={s.img_box}>
              <div className={`${s.image} img-wrap`}>
                <Image
                  priority
                  src={require("public/img/subscribe/subscribe_full_plan.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="카드 이미지"
                />
              </div>
            </div>
            <h2>토핑플랜</h2>
          </li>

          <li>
            <p><em>토핑용</em>으로 바프독으로 섞어서 먹어요</p>
          </li>

          <li>
            <div className={s.grid_box}>
              <div className={s.row_1}>
                하루에<span>&nbsp;2팩</span>
              </div>
              <div className={s.row_2}>
                <span>4주</span>&nbsp;정기배송
              </div>
              <div className={s.row_3}>
                <span>143g</span>&nbsp;(1팩기준)
              </div>
              <div className={s.row_4}>
                20팩 x <span>7,200원</span> 
              </div>
            </div>
          </li>

          <li>
            <div className={s.text1}>
              5%&nbsp; <span>144,000원</span>
            </div>

            <div className={s.text2}>
              142,560원
            </div>
          </li>

          </ul>

        </CustomInput>
      </div>
  );
}









const CustomInputCheckbox_recipe = ({
                                      name,
                                      disabled,
                                      onSelected,
                                      dependency,
                                    }) => {



  // * 풀플랜: 최대 2가지 레시피 선택 가능
  // * 그 외 플랜: 1가지 레시피 선택 가능
  const inputTypeByDependency = dependency === "FULLPLAN" ? "checkbox" : "radio";
  const [selectedCheckbox, setSelectedCheckbox] = useState([]);
  const [selectedRadio, setSelectedRadio] = useState(null);
  const [initialize, setInitialize] = useState(false);



  useEffect(() => {
    if (selectedRadio && typeof handler === "function") {
      handler(selectedRadio);
    }
  }, [selectedRadio, onSelected]);



  useEffect(() => {
    let selectedCheckboxCount = 0;
    const keys = Object.keys(selectedCheckbox);
    keys.forEach((key) => {
      const val = selectedCheckbox[key];
      val && selectedCheckboxCount++;
    });
    const maxSelectedCheckboxCount = 2;
    if(selectedCheckboxCount > maxSelectedCheckboxCount){
      alert('풀플랜은 최대 2개 레시피까지 선택가능합니다.');
      setInitialize(true);
    }else{
      setInitialize(false);
    }
  }, [selectedCheckbox]);

  return (
      <div className={s.flex_box2} data-input-title={name}>
        <CustomInput
            id={`${name}-value-01`}
            type={inputTypeByDependency}
            name={name}
            dependency={dependency}
            initialize={initialize}
            disabled={disabled}
            setSelectedCheckbox={setSelectedCheckbox}
            selectedRadio={selectedRadio}
            setSelectedRadio={setSelectedRadio}
        >
          <ItemRecommendlabel className={s.ItemRecommendlabel}
            label="추천!"
            style={{
              backgroundColor: "#000",
            }}
          />
          <div className={s.recipe_choice_box}>
            <div className={s.img_box}>
              <div className={`${s.image} img-wrap`}>
                <Image
                    priority
                    src={require("public/img/mypage/subscribe/subscribe_recipe_1.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                />
              </div>
            </div>
            <div className={s.row_1}>TURKEY &amp; BEEF</div>
            <div className={s.row_2}>칠면조 &amp; 소</div>
            <div className={s.row_3}>
              우리 아이를 더 튼튼하게!
              <br />
              발육과 영양 보충을 위한 터키 앤 비프
            </div>
            <div className={s.row_4}>더 알아보기</div>
          </div>
        </CustomInput>

        <CustomInput
            id={`${name}-value-02`}
            type={inputTypeByDependency}
            name={name}
            disabled={disabled}
            dependency={dependency}
            initialize={initialize}
            setSelectedCheckbox={setSelectedCheckbox}
            selectedRadio={selectedRadio}
            setSelectedRadio={setSelectedRadio}
        >
          <div className={s.recipe_choice_box}>
            <div className={s.img_box}>
              <div className={`${s.image} img-wrap`}>
                <Image
                    priority
                    src={require("public/img/mypage/subscribe/subscribe_recipe_2.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                />
              </div>
            </div>
            <div className={s.row_1}>TURKEY &amp; BEEF</div>
            <div className={s.row_2}>칠면조 &amp; 소</div>
            <div className={s.row_3}>
              우리 아이를 더 튼튼하게!
              <br />
              발육과 영양 보충을 위한 터키 앤 비프
            </div>
            <div className={s.row_4}>더 알아보기</div>
          </div>
        </CustomInput>

        <CustomInput
            id={`${name}-value-03`}
            type={inputTypeByDependency}
            name={name}
            disabled={disabled}
            dependency={dependency}
            initialize={initialize}
            setSelectedCheckbox={setSelectedCheckbox}
            selectedRadio={selectedRadio}
            setSelectedRadio={setSelectedRadio}
        >
          <ItemRecommendlabel className={s.ItemRecommendlabel}
            label="추천!"
            style={{
              backgroundColor: "#000",
            }}
          />
          <div className={s.recipe_choice_box}>
            <div className={s.img_box}>
              <div className={`${s.image} img-wrap`}>
                <Image
                    priority
                    src={require("public/img/mypage/subscribe/subscribe_recipe_3.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                />
              </div>
            </div>
            <div className={s.row_1}>TURKEY &amp; BEEF</div>
            <div className={s.row_2}>칠면조 &amp; 소</div>
            <div className={s.row_3}>
              우리 아이를 더 튼튼하게!
              <br />
              발육과 영양 보충을 위한 터키 앤 비프
            </div>
            <div className={s.row_4}>더 알아보기</div>
          </div>
        </CustomInput>

        <CustomInput
            id={`${name}-value-04`}
            type={inputTypeByDependency}
            name={name}
            disabled={disabled}
            dependency={dependency}
            initialize={initialize}
            setSelectedCheckbox={setSelectedCheckbox}
            selectedRadio={selectedRadio}
            setSelectedRadio={setSelectedRadio}
        >
          <div className={s.recipe_choice_box}>
            <div className={s.img_box}>
              <div className={`${s.image} img-wrap`}>
                <Image
                    priority
                    src={require("public/img/mypage/subscribe/subscribe_recipe_4.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                />
              </div>
            </div>
            <div className={s.row_1}>TURKEY &amp; BEEF</div>
            <div className={s.row_2}>칠면조 &amp; 소</div>
            <div className={s.row_3}>
              우리 아이를 더 튼튼하게!
              <br />
              발육과 영양 보충을 위한 터키 앤 비프
            </div>
            <div className={s.row_4}>더 알아보기</div>
          </div>
        </CustomInput>
      </div>
  );
};










function MypageSubscribeProductPage() {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(0);
  const router = useRouter();

  const onRecipeInputClickHandler = () => {
    if (!selectedPlan) alert('플랜을 먼저 선택해주세요.');
  }

  const onPrevPage = () => {
    if(confirm(`이전 페이지로 돌아가시겠습니까?`))router.back();
  }

  const onUpdateMyRecipe = ()=>{
    // 업데이트 성공했을 경우
    router.push(`/mypage/dogs/[id]/updatedSurveyResult`);
  }

  return (
      <>
        <MetaTitle title="맞춤레시피 선택" />
        <Layout>
          <Wrapper>
            <section className={s.order_title}>
              <h1 className={s.text}>결과지를 종합해본 결과</h1>

              <div className={s.title_content_box}>
                <div className={s.title_grid_box}>
                  <div className={s.grid_left}>
                    <figure className={`${s.image} img-wrap`}>
                      <Image
                          priority
                          src={require("src/pages/order/subscribeShop/survey_order_title_left.png")}
                          objectFit="cover"
                          layout="fill"
                          alt="레시피 이미지"
                      />
                    </figure>
                    <figcaption className={s.recipe_title}>
                      <p className={s.title_ko}>STARTER PREMIUM</p>
                      <p className={s.title_en}>스타터프리미엄</p>
                    </figcaption>
                  </div>

                  <div className={s.grid}>
                    <div className={s.grid_left}>
                      <figure className={`${s.image} img-wrap`}>
                        <Image
                            priority
                            src={require("src/pages/order/subscribeShop/survey_order_title_left.png")}
                            objectFit="cover"
                            layout="fill"
                            alt="레시피 이미지"
                        />
                      </figure>
                      <figcaption className={s.recipe_title}>
                        <p className={s.title_ko}>STARTER PREMIUM</p>
                        <p className={s.title_en}>스타터프리미엄</p>
                      </figcaption>
                    </div>

                    <p className={s.result_title}>
                      시호에게는
                      <br />
                      안정적인 첫 생식 적응이 필요한
                      <br />
                      <b>스타터프리미엄</b> 레시피를 추천합니다. <br />
                    </p>

                    <div className={s.grid_bottom}>
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
                </div>
              </div>
            </section>

            <section className={s.regular_delivery}>
              <div className={s.regular_delivery_title}>
                급여량에 따른 <br /> 정기배송 수량을 선택해 주세요
              </div>

              <CustomInputRadio_plan name="plan" handler={setSelectedPlan} />
            </section>

            <section className={s.notice}>
              <h2 className={s.notice_row_1}>
                급여량에 따른 정기배송 수량을 선택해 주세요 
              </h2>
              <p className={s.notice_row_2}>
                <em>풀플랜</em>만 두 개의 레시피를 동시 선택할 수 있습니다.
              </p>
              <div className={s.notice_row_3}>
                <div className={s.color_box}>
                  <div className={s.color_box_row_1}>
                    <div className={s.picture_box}>
                      <div className={`${s.image} img-wrap`}>
                        <Image
                            priority
                            src={require("public/img/mypage/subscribe/alert_circle.png")}
                            objectFit="cover"
                            layout="fill"
                            alt="카드 이미지"
                        />
                      </div>
                    </div>
                    <span>&nbsp;잠깐!</span>
                  </div>
                  <div className={s.color_box_row_2}>
                    @에 못먹는 음식으로 체크해 주셨네요! #,# 레시피에는 @가 들어가
                    있습니다.
                    <br />
                    반려견에게 알레르기를 유발할 수 있으니 레시피 선택에 유의해
                    주시기 바랍니다.
                  </div>
                </div>
              </div>
              <div
                  className={s.recipeInputWrap}
                  onClick={onRecipeInputClickHandler}
              >
                <CustomInputCheckbox_recipe
                    name="recipe"
                    disabled={!selectedPlan}
                    dependency={selectedPlan}
                    onSelected={setSelectedRecipe}
                />
              </div>

              <div className={s.btn_box}>
                <button onClick={onPrevPage} className={s.prevPage}>
                  뒤로가기
                </button>

                <Link href="../../../order/ordersheet" passHref>
                  <button className={s.actionButton} type={'button'}>맞춤레시피 구매하기</button>
                </Link>

                <button className={s.actionButton} type={'button'} onClick={onUpdateMyRecipe}>맞춤레시피 적용하기</button>
              </div>
            </section>
          </Wrapper>
        </Layout>
      </>
  );
}

export default MypageSubscribeProductPage;

