import React, { useState, useRef, useEffect } from "react";
import MetaTitle from "@src/components/atoms/MetaTitle";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";

import Image from "next/image";
import Link from 'next/link';
import Styles from "/styles/css/shop/single.module.scss";
import RatingStars from "/src/components/atoms/RatingStars";
import { slideUp , slideDown } from "/util/func/slideToggle";



function BotBox ({title, children}) {
  const [visible, setVisible] = useState(false);
  const boxRef = useRef(null);

  const onClickHandler = (e) => {
    visible ? setVisible(false) : setVisible(true);
  }



  useEffect(() => {
    console.log(visible);
    const selectedElem = boxRef.current;
    if (!selectedElem) return;
    visible ? slideDown(selectedElem) : slideUp(selectedElem);
  }, [visible]);
  return (
    <li className={`${Styles.box_wrap} ${visible && Styles.active}`}>
      <div className={`${Styles.guide} clearfix`} onClick={onClickHandler}>
        <h2 className={Styles.box_text}>{title}</h2>
        <span className={`${Styles.image} img-wrap`}>
          <Image
            src={require("/public/img/shop/single/shop_main_guide_1.png")}
            objectFit="cover"
            layout="fill"
            alt="카드 이미지"
          />
        </span>
      </div>
      <div className={Styles.box_cont} ref={boxRef}>
        <div className={Styles.text}>{children}</div>
      </div>
    </li>
  );
}




const ShopBoard = () => {
  return (
    <section className={Styles.top}>
      <div className={Styles.inner}>
        <div className={Styles.top_box}>
          <div className={Styles.left_box}>
            <div className={`${Styles.image} img-wrap`}>
              <Image
                priority
                src={require("/public/img/shop/single/shop_single_top.png")}
                objectFit="cover"
                layout="fill"
                alt="카드 이미지"
              />
            </div>
          </div>

          <div className={Styles.right_box}>
            <div className={Styles.content_title}>
              강아지 고양이 냄새제거 살균 소독 탈취제 바프레쉬 BARF, FRESH 500ml
            </div>

            <div className={Styles.price_box}>
              <span className={Styles.price}>52,500</span>
              <span className={Styles.won}>원</span>
            </div>

            <div className={Styles.mid_box}>
              <div>Tip</div>

              <div>
                생식을 처음 적응하는 단계에서는 식단에 너무 많은 재료를 넣지
                않는 것이 좋습니다. 아이들이 처음 생식을 먹는 단계에서 소화에
                부담없이 적응할 수 있도록 흰살고기 칠면조와 닭고기를 활용한
                완벽한 비율의 스타트 프리미엄을 이용해보세요.
              </div>

              <div>배송정보</div>

              <div>
                택배배송 3,000원 (50,000원 이상 구매 시 무료)
                <br />
                <div className={Styles.text}>
                  제주 및 도서산간 지역은 배송이 불가능합니다
                </div>
              </div>

              <div>
                <div>수량선택</div>
              </div>

              <div className={Styles.count_box}>
                <div>
                  <div>-</div>
                </div>
                <div>
                  <input classtype="text" id="count" placeholder="99"></input>
                </div>
                <div>+</div>
              </div>
            </div>

            {/* 총 상품금액 */}
            <div className={Styles.total_price}>
              <div>
                <span className={Styles.left_text}>총 상품금액 :</span>
                <span className={Styles.mid_text}>52,500</span>
                <span className={Styles.last_text}>원</span>
              </div>
            </div>

            {/* 장바구니 버튼 */}
            <div className={Styles.shop_button_box}>
              <div className={Styles.basket_button}>장바구니</div>

              <div className={Styles.buy_button}>구매하기</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}




const ReturnExchageGuideBox = () => {
  return (
    <section className={Styles.tab_slide_box}>
      <div className={Styles.flex_box}>
        <div className={Styles.title}>바프독 반품/교환 안내</div>
      </div>

      <div className={Styles.flex_box2}>
        <div className={Styles.left}>판매자 지정 택배사</div>
        <div className={Styles.right}>CJ 대한통운</div>
      </div>

      <div className={Styles.flex_box2}>
        <div className={Styles.left}>반품 배송비</div>
        <div className={Styles.right}>
          편도 3,000원 (최소 배송비 무료인 경우 6,000원 부과)
        </div>
      </div>

      <div className={Styles.flex_box2}>
        <div className={Styles.left}>
          반품/교환 사유에 따른요청
          <br /> 가능 기간
        </div>
        <div className={Styles.right}>
          선식품, 맞춤제작식품: 불가 / 일반상품: 7일
          <br />
          단, 주문이 생산되기 전 컷오프(다음 주문의 배송 전 금요일 24시) 전 까지
          고객님이 직접 취소 가능.
          <br />
          (바프독은 항상 금 , 토, 일, 월요일에 생산되어 수요일 일괄 발송 됩니다)
        </div>
      </div>

      <div className={Styles.flex_box2}>
        <div className={Styles.left}>반품/교환 불가능 사유</div>
        <div className={Styles.right}>
          - 반품요청기간이 지난 경우
          <br />
          - 구매자의 책임 있는 사유로 상품 등이 멸실 또는 훼손된 경우
          <br />
          - 구매자의 책임 있는 사유로 포장이 훼손되어 상품 가치가 현저히 상실된
          경우
          <br />
          - 구매자의 사용 또는 일부 소비에 의하여 상품의 가치가 현저히 감소한
          경우
          <br />
          - 시간의 경과에 의하여 재판매가 곤란할 정도로 상품 등의 가치가 현저히
          감소한 경우
          <br />
          - 고객의 요청 사항에 맞춰 제작에 들어가는 맞춤 제작 식품의 경우
          <br />- 고객의 부주의 혹은 잘못된 보관 방법으로 인한 상품 변질된 경우
        </div>
      </div>

      <div className={Styles.flex_box2}>
        <div className={Styles.left}>판매자 정보</div>
        <div className={Styles.right}>
          상호명 &#58; 프레쉬아워 &#47; 대표자 &#58; 임경호
          <br />
          사업자등록번호 &#58; 4861801232
          <br />
          통신판매업번호 &#58; 2020-충북충주-0634
          <br />
          사업장 소재지 &#58; 충청북도 충주시 번영대로 214 1층 프레쉬아워 (우
          &#58; 27352)
          <br />
          고객센터 &#58; 043-855-4995
        </div>
      </div>
    </section>
  );
}



const ReviewBox = () => {

  const ReviewList = () => {
    const reviewTotalCount = 7;
    const reviewList = [];
    for(let i =0; i < reviewTotalCount; i++){
      reviewList.push(<ReviewItem key={`reviewTotalCount-${i}`} />);
    }

    return <ul>{reviewList}</ul>;
    
  }

  const ReviewItem = () => {

    const [visible, setVisible ] =useState(false);
    const boxRef = useRef(null);
    const onClickHandler = (e) => {
      visible ? setVisible(false) : setVisible(true);
    };
    


    useEffect(() => {
      const selectedElem = boxRef.current;
      if (!selectedElem) return;
      visible ? slideDown(selectedElem) : slideUp(selectedElem);
    }, [visible]);

    return (
      <li>
        <figure className={Styles.grid_box} onClick={onClickHandler}>
          {/* 그리드 1 시작지점 */}
          <span>48</span>
          <i className={Styles.star_box}>
            <RatingStars count={3} margin={0} />
          </i>
          <p className={Styles.content}>
            <i className={`${Styles.image} img-wrap`}>
              <Image
                src={require("public/img/pages/review/review_slide_sample.png")}
                objectFit="contain"
                layout="fill"
                alt="카드 이미지"
              />
            </i>
            사진 굿굿 너무 좋아요
          </p>
          <span> 바&#42;독</span>
          <span> 2022.01.20</span>
        </figure>
        <div className={Styles.review_box} ref={boxRef}>
          <p className={Styles.text}>
            너무 잘먹고요. 모질이 좋아지는게 눈에 보여요.
          </p>
        </div>
      </li>
    );
  }


  return (
    <section className={Styles.tab_slide_box2}>
      {/* 리뷰별점박스 */}
      <div className={Styles.flex_box}>
        <div className={Styles.content}>
          <div className={Styles.title}>59개의 리뷰</div>

          <div className={Styles.grade}>
            4.0 /<span className={Styles.red}>5.0</span>
          </div>
          <RatingStars count={4} size={27} />
        </div>
      </div>

      <div className={Styles.notice_board}>
        <div className={Styles.flex_title}>
          <div>No</div>
          <div>별점</div>
          <div className={Styles.px16_title_content}>제목</div>
          <div></div>
          <div>등록일</div>
        </div>
        <ul className="reviewBox">
          <ReviewList />
        </ul>
      </div>


      {/* // * B! Ventures > News Page > Pagination 사용예정  */}
      <div className={Styles.pagination_box}>
        <div className={Styles.content}>
          <div> &#60;</div>
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
          <div>5</div>
          <div>...</div>
          <div>11</div>
          <div> &#62;</div>
        </div>
      </div>
    </section>
  );
};
//////////////////////////////////


const ItemInfoBox = () => {

  return (
    <>
      <section className={Styles.body_top_content}>
        <p className={Styles.top_content}>
          바프독은 15도 이하의 저온 살균 자체 시설에서 제조되어
          <br />
          모든 레시피를 안전하고 신선하게 보내드립니다.
        </p>
        <div className={Styles.line}>
          <hr />
        </div>

        <p className={Styles.red_title}>믿고 먹일 수 있는</p>

        <div className={Styles.title_box}>BARFDOG</div>
        <div className={Styles.title_contnet}>
          여러분은 삼시세끼 ‘라면’만 드실 수 있나요?
          <br />
          <br />
          반려견이 다양한 ‘사료’만 먹는다는 것은 곧 인스턴트 라면 혹은 건빵을
          먹는 것과 같습니다.
          <br />
          그래서 바프독은 고민했습니다. 진짜 반려견을 위한 음식은 무엇일지
          연구하고 진짜 음식의 본질에 집중했습니다. <br />
          영양을 골고루 섭취할 수 있는 국내 최초 더블 고기 레시피에 리얼
          바프식(barf) 생식을 반영한 적절한 야채비율까지 더 했습니다.
          <br />
          <br />
          이제는 매일 먹는 ‘라면’과 ‘건빵’이 아닌
          <br />
          신선하고 영양이 풍부한 생자연식을 골고루 선물해주세요.
        </div>
      </section>
      {/* 바디사진부분 */}
      <section className={Styles.body_image}>
        <div className={Styles.image_box}>
          <div className={`${Styles.image} img-wrap`}>
            <Image
              src={require("/public/img/shop/single/shop_single_main_1.png")}
              objectFit="cover"
              layout="fill"
              alt="카드 이미지"
            />
          </div>

          <p>함께 급여하면 좋아요</p>

          <div className={`${Styles.image2} img-wrap`}>
            <Image
              src={require("/public/img/shop/single/shop_single_main_2.png")}
              objectFit="cover"
              layout="fill"
              alt="카드 이미지"
            />
          </div>
        </div>
      </section>
      <section className={Styles.why_barf}>
        <p>왜 바프독일까요?</p>
        <div className={Styles.why_content_box}>
          <div className={Styles.left}>
            <div className={Styles.title_num}>01</div>
            <div className={Styles.title}>진짜 생식</div>
            <p>올바른 바프(BARF)식 영양구성</p>
            <div className={Styles.title_content}>
              한 팩에 완벽한 영양을 담았습니다.
            </div>
            <div className={Styles.left_box_content}>
              <div>70%</div>
              <div>풍부하게 담은 두가지 고기</div>
              <div>10%</div>
              <div>풍부한 칼슘</div>
              <div>10%</div>
              <div>안전하게 맞춤 제조된 내장</div>
              <div>10%</div>
              <div>유기농 야채와 신선한 과일</div>
            </div>
            <div className={Styles.last_contain}>
              그리고 유기농 씨앗과 켈프, 스피루리나의 프리미엄 영양소로 구성되어
              있습니다.
              <br /> 바프독은 AAFCO, NRC, fediaf의
              <br />
              가이드라인을 준수합니다.
            </div>
          </div>

          <div className={Styles.mid}>
            <div className={Styles.title_num}>01</div>
            <div className={Styles.title}>두가지 고기</div>
            <p>한가지 고기가 아닙니다</p>
            <div className={Styles.title_content}>
              바프독은 모든 레시피에 두가지 고기를 풍부하게 담았습니다.
            </div>

            <div className={Styles.last_contain}>
              영양학 전문가들은 반려견 생식 급여시,
              <br />
              한끼당 두가지 이상의고기를 섭취하도록
              <br />
              권장합니다. 다양한 고기가 갖고있는 필수
              <br />
              지방산 및 비타민 등을 골고루 섭취하면서
              <br />
              균형잡힌 식사를 만들어주기 때문입니다.
              <br />
              <br />
              그래서 바프독은 모든 레시피에 두 가지 고기를 담아, 충분한
              영양섭취를 돕습니다.
            </div>
          </div>
          <div className={Styles.right}>
            <div className={Styles.title_num}>01</div>
            <div className={Styles.title}>휴먼그레이드</div>
            <p>사람이 먹을 수 있는 음식</p>
            <div className={Styles.title_content}>
              바프독은 일반 고기보다 영양소가
              <br /> 많은 방목고기를 사용합니다.
            </div>

            <div className={Styles.last_contain}>
              호주의 드넓은 초지에서 자유롭게
              <br /> 자라 유기농 인증을 받은 소고기와,
              <br />
              뉴질랜드 천혜의 자연 환경에서 자유롭게
              <br />
              자란 양고기를 사용합니다.
              <br />
              <br />
              바프독의 생자연식은 최고등급의 유기농 방목고기, 채소를 사용하여
              골고루 영양분을 섭취할 수있습니다.
            </div>
          </div>
        </div>
      </section>
      <section className={Styles.barf_note}>
        <div className={Styles.title}>BARFDOG’s Note</div>
        <p>
          진짜 펫푸드에 대한 바프독의 생각. 바프독이 생각하는 본질을
          그대로담았습니다.
        </p>

        <div className={Styles.content_box}>
          <div className={Styles.box_title}>
            우리가 먹을 수 있는 재료로만 만듭니다
          </div>

          <div className={Styles.image_box}>
            <div className={`${Styles.image} img-wrap`}>
              <Image
                src={require("/public/img/shop/single/shop_main_note_1.png")}
                objectFit="cover"
                layout="fill"
                alt="카드 이미지"
              />
            </div>
            <div className={`${Styles.image} img-wrap`}>
              <Image
                src={require("/public/img/shop/single/shop_main_note_1-1.png")}
                objectFit="cover"
                layout="fill"
                alt="카드 이미지"
              />
            </div>
          </div>
        </div>

        <div className={Styles.content_box}>
          <div className={Styles.box_title}>
            100% 휴먼그레이드 프리미엄 생식
          </div>
          <div className={Styles.image2_box}>
            <div className={`${Styles.image} img-wrap`}>
              <Image
                src={require("/public/img/shop/single/shop_main_note_2-1.png")}
                objectFit="cover"
                layout="fill"
                alt="카드 이미지"
              />
            </div>
            <div className={`${Styles.image} img-wrap`}>
              <Image
                src={require("/public/img/shop/single/shop_main_note_2-2.png")}
                objectFit="cover"
                layout="fill"
                alt="카드 이미지"
              />
            </div>
            <div className={`${Styles.image} img-wrap`}>
              <Image
                src={require("/public/img/shop/single/shop_main_note_2-3.png")}
                objectFit="cover"
                layout="fill"
                alt="카드 이미지"
              />
            </div>
            <div className={`${Styles.image} img-wrap`}>
              <Image
                src={require("/public/img/shop/single/shop_main_note_2-4.png")}
                objectFit="cover"
                layout="fill"
                alt="카드 이미지"
              />
            </div>
            <div className={`${Styles.image} img-wrap`}>
              <Image
                src={require("/public/img/shop/single/shop_main_note_2-5.png")}
                objectFit="cover"
                layout="fill"
                alt="카드 이미지"
              />
            </div>
            <div className={`${Styles.image} img-wrap`}>
              <Image
                src={require("/public/img/shop/single/shop_main_note_2-6.png")}
                objectFit="cover"
                layout="fill"
                alt="카드 이미지"
              />
            </div>
          </div>
        </div>
      </section>


      <section className={Styles.barf_guide}>
        <div className={Styles.title}>BARFDOG’s Guide</div>
        <p>
          권장급여량은 걱정하지 마세요.
          <br />
          입력해주신 아이들의 정보에 맞추어 나누어 담아 드립니다.
        </p>
        <div className={Styles.red_word}>
          생식이 처음이라면 가이드라인과 급여가이드를 먼저 참고하세요!
        </div>
        <div className={Styles.mid_box}>
          <ul className={Styles.guide_box}>
            {/* ////// */}
            <BotBox title="급여가이드 보러가기">
              <div className={`${Styles.image_slide} img-wrap`}>
                <Image
                  src={require("/public/img/shop/single/shop_main_guide_slide_1.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="카드 이미지"
                />
              </div>
            </BotBox>
            <BotBox title="생식 적응기간을 위한 가이드라인 보러가기">
              <div className={`${Styles.image_slide2} img-wrap`}>
                <Image
                  src={require("/public/img/shop/single/shop_main_guide_slide_2.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="카드 이미지"
                />
              </div>
            </BotBox>

            {/* 
            <div className={Styles.guide}>
              <p className={Styles.box_text}>급여가이드 보러가기</p>
              <div className={`${Styles.image} img-wrap`}>
                <Image
                  src={require("/public/img/shop/single/shop_main_guide_1.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="카드 이미지"
                />
              </div>
            </div>

            <div className={Styles.guide}>
              <p className={Styles.box_text}>
                생식 적응기간을 위한 가이드라인 보러가기
              </p>
              <div className={`${Styles.image} img-wrap`}>
                <Image
                  src={require("/public/img/shop/single/shop_main_guide_1.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="카드 이미지"
                />
              </div>
            </div> */}
          </ul>
        </div>
      </section>
      <section className={Styles.barf_tip}>
        <div className={Styles.title}>BARFDOG’s Tip</div>
        <div className={Styles.content_box}>
          <div className={Styles.left_box}>
            <div className={Styles.text_box}>
              레시피 <span>두가지를 골고루 급여</span>하여
              <br />
              다양한 영양성분을 섭취 할 수 있도록 해주세요!
            </div>
            <div className={`${Styles.image} img-wrap`}>
              <Image
                src={require("/public/img/shop/single/shop_main_tip_left.png")}
                objectFit="cover"
                layout="fill"
                alt="카드 이미지"
              />
            </div>

            <div className={Styles.last_contain}>
              바프독의 모든 레시피는 반려견 생식 관련 역사가 오래된 미국
              생식관련 반려동물 협회 및 미국 생식 전문사이트 영양수의사에게
              정기적인 미팅을 통해 레시피를 검토하고 있으며 모든 전문가들의
              공통된 의견을 존중하고 있습니다.
              <br />
              <br />
              따라서 각 바프독 레시피가 가지고 있는 장점을 골고루 섭취하기 위해
              정기구독 서비스로 반려견 친구들이 다양한 영양을 골고루 섭취할 수
              있도록 다양한 레시피를 급여하시기를 추천드립니다.
            </div>
          </div>
          <div className={Styles.right_box}>
            <div className={`${Styles.image} img-wrap`}>
              <Image
                priority="false"
                src={require("/public/img/shop/single/shop_main_tip_right.png")}
                objectFit="cover"
                layout="fill"
                alt="카드 이미지"
              />
            </div>
          </div>
        </div>
      </section>
      <div className={Styles.mid_box}>
        <hr className={Styles.line} />
      </div>
      <section className={Styles.barf_subscription}>
        <p className={Styles.title}>특별함을 일상처럼 매일먹는 특식,</p>
        <p className={Styles.title2}>Real Barf</p>

        <div className={`${Styles.image} img-wrap`}>
          <Image
            src={require("/public/img/shop/single/shop_main_subscription.png")}
            objectFit="cover"
            layout="fill"
            alt="카드 이미지"
          />
        </div>
      </section>





      {/* // ! ---------------------------------------------------- */}
      {/* // ! ---------------------급여가이드------------------------------- */}
      {/* // ! ---------------------------------------------------- // */}


      {/*
      <section className={`${Styles.bot} ${visible && Styles.active}`}>
        <BotBox title="급여가이드 보러가기">
          <div className={Styles.title_box}>
            <div className={Styles.title}>급여가이드</div>
          </div>

          <div className={Styles.content_title_box}>
            <div className={Styles.title}>올바르게 ‘급여’ 하기</div>
          </div>

          <div className={Styles.content}>
            <div className={Styles.grid}>
              <div>1</div>
              <div>
                생식이 너무 차가울경우 미지근한 물을 조금 넣어 찬기를 없애주세요
              </div>
              <div>2</div>
              <div>
                상온에서 20분 이내 급여하시고 20분이상 경과된 생식은 폐기하여
                주세요
              </div>
              <div>3</div>
              <div>
                급여 후 식사자리를 깨끗이 닦아 정리해주시고 위생적으로 관리하여
                주세요
              </div>
            </div>
          </div>

          <div className={Styles.content_title_box}>
            <div className={Styles.title}>올바르지 않은 해동법</div>
          </div>

          <div className={Styles.content2}>
            <div className={Styles.image_box}>
              <div className={Styles.left_box}>
                <div className={`${Styles.image} img-wrap`}>
                  <Image
                    src={require("/public/img/shop/single/shop_main_slide_1.png")}
                    objectFit="contain"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>
              </div>
              <div className={Styles.image_text}>
                전자레인지, 뜨거운 물, 실온에서의 해동은 삼가주세요!
              </div>
            </div>

            <div className={Styles.content_text}>
              뼈가 들어간 제품이므로 절대로 열을 가하여 익히지 마세요
            </div>
          </div>

          <div className={Styles.content_title_box}>
            <div className={Styles.title}>신선하게 ‘보관’ 하기</div>
          </div>

          <div className={Styles.content3}>
            <div className={Styles.grid}>
              <div className={`${Styles.image} img-wrap`}>
                <Image
                  src={require("/public/img/shop/single/shop_main_slide_2-1.png")}
                  objectFit="contain"
                  layout="fill"
                  alt="카드 이미지"
                />
              </div>
              <div className={`${Styles.image} img-wrap`}>
                <Image
                  src={require("/public/img/shop/single/shop_main_slide_2-2.png")}
                  objectFit="contain"
                  layout="fill"
                  alt="카드 이미지"
                />
              </div>
              <div className={`${Styles.image} img-wrap`}>
                <Image
                  src={require("/public/img/shop/single/shop_main_slide_2-3.png")}
                  objectFit="contain"
                  layout="fill"
                  alt="카드 이미지"
                />
              </div>
              <div className={`${Styles.image} img-wrap`}>
                <Image
                  src={require("/public/img/shop/single/shop_main_slide_2-4.png")}
                  objectFit="contain"
                  layout="fill"
                  alt="카드 이미지"
                />
              </div>
              <div className={`${Styles.image} img-wrap`}>
                <Image
                  src={require("/public/img/shop/single/shop_main_slide_2-5.png")}
                  objectFit="contain"
                  layout="fill"
                  alt="카드 이미지"
                />
              </div>

              <div>식사는 도착 후 바로 냉동 보관 해주세요</div>
              <div>
                급여 하루 전 냉장실에서 해동 또는 급여 전 미지근한 물로
                해동해주세요
              </div>
              <div>한번 해동된 식사는 재냉동하지 마세요</div>
              <div>30시간 이상 지난 제품은 급여하지 마시고 폐기해주세요</div>
              <div>유통기한은 제조일로부터 3개월입니다, 꼭 지켜주세요!</div>
            </div>
          </div>
        </BotBox>
        <BotBox title="생식 적응기간을 위한 가이드라인 보러가기">
          <div className={Styles.title_box}>
            <div className={Styles.title}>
              생식 적응기간을 위한 가이드라인sss
            </div>
          </div>

          <div className={Styles.content4}>
            <div className={Styles.content}>
              <div className={Styles.grid}>
                <div className={Styles.mid_box}>
                  <div className={`${Styles.image} img-wrap`}>
                    <Image
                      src={require("/public/img/shop/single/shop_main_slide_3-1.png")}
                      objectFit="contain"
                      layout="fill"
                      alt="카드 이미지"
                    />
                  </div>
                </div>
                <div>
                  <p>DAY 1~2</p>
                  <br />

                  <div>
                    기존 사료에 바프독 레시피 두스푼을 넣어 급여해주세요.
                  </div>
                </div>

                <div className={Styles.mid_box}>
                  <div className={`${Styles.image} img-wrap`}>
                    <Image
                      src={require("/public/img/shop/single/shop_main_slide_3-2.png")}
                      objectFit="contain"
                      layout="fill"
                      alt="카드 이미지"
                    />
                  </div>
                </div>
                <div>
                  <p>DAY 3~5</p>
                  <br />

                  <div>
                    기존 사료에 바프독 레시피 25%정도를 섞어 급여해주세요.{" "}
                    <br />
                    (기존 식단 75%, 바프독 레시피 25%)
                  </div>
                </div>
                <div className={Styles.mid_box}>
                  <div className={`${Styles.image} img-wrap`}>
                    <Image
                      src={require("/public/img/shop/single/shop_main_slide_3-3.png")}
                      objectFit="contain"
                      layout="fill"
                      alt="카드 이미지"
                    />
                  </div>
                </div>
                <div>
                  <p>DAY 6~7</p>
                  <br />

                  <div>
                    기존 사료에 바프독 레시피 50%정도를 섞어 급여해주세요.{" "}
                    <br />
                    (기존 식단 50%, 바프독 레시피 50%)
                  </div>
                </div>

                <div className={Styles.mid_box}>
                  <div className={`${Styles.image} img-wrap`}>
                    <Image
                      src={require("/public/img/shop/single/shop_main_slide_3-4.png")}
                      objectFit="contain"
                      layout="fill"
                      alt="카드 이미지"
                    />
                  </div>
                </div>
                <div>
                  <p>DAY 8~9</p>
                  <br />

                  <div>
                    기존 사료에 바프독 레시피 75%정도를 섞어 급여해주세요.{" "}
                    <br />
                    (기존 식단 25%, 바프독 레시피 75%)
                  </div>
                </div>

                <div className={Styles.mid_box}>
                  <div className={`${Styles.image} img-wrap`}>
                    <Image
                      src={require("/public/img/shop/single/shop_main_slide_3-5.png")}
                      objectFit="contain"
                      layout="fill"
                      alt="카드 이미지"
                    />
                  </div>
                </div>
                <div>
                  <p>DAY 3~5</p>
                  <br />

                  <div>
                    기존 사료에 바프독 레시피 100%정도를 섞어 급여해주세요.{" "}
                    <br />
                    (기존 식단 0%, 바프독 레시피 100%)
                  </div>
                </div>
              </div>
              <div className={Styles.content5}>
                <div className={Styles.left_box}>
                  <div className={`${Styles.image} img-wrap`}>
                    <Image
                      src={require("/public/img/shop/single/shop_main_slide_4.png")}
                      objectFit="contain"
                      layout="fill"
                      alt="카드 이미지"
                    />
                  </div>
                </div>
                <div className={Styles.right_box}>
                  생식이 처음이거나 예민한 반려견의 경우 배탈, 묽은변, 구토
                  증상이 나타날 수 있으나 그럴땐 더욱 적은 양을 시작으로 새로운
                  음식에 적응할 때까지 천천히 생식의 양을 늘려주세요. 완벽한
                  전환에는 7~14일 정도 걸릴 수 있습니다 :)
                </div>
              </div>
            </div>
          </div>
        </BotBox>
      </section> */}
      {/* // ! ---------------------------------------------------- */}
      {/* // ! ---------------------급여가이드------------------------------- */}
      {/* // ! ---------------------------------------------------- */}
    </>
  );
}






const ShopTabMenus = ({ activeIndex, setActiveIndex }) => {
  const navClickHandler = (e) => {
    const thisMenu = e.currentTarget;
    const children = Array.from(thisMenu.parentNode.children);
    const thisIdx = children.indexOf(thisMenu);
    setActiveIndex(thisIdx);

    children.forEach((menu) => {
      const thisMenuIdx = children.indexOf(menu);
      if (thisMenuIdx !== thisIdx) {
        menu.classList.remove(`${Styles.active}`);
      } else {
        menu.classList.add(`${Styles.active}`);
      }
    });
  };
  return (
    <div className={Styles.tab_menu}>
      <ul className={Styles.tab_menu_box}>
        <li
          className={`${Styles.left_box} ${activeIndex === 0 && Styles.active}`}
          onClick={navClickHandler}
        >
          <button type="button" className={Styles.no1}>
            상세정보
          </button>
        </li>
        <li className={Styles.mid_box} onClick={navClickHandler}>
          <button type="button" className={Styles.no2}>
            반품/교환정보
          </button>
        </li>
        <li className={Styles.right_box} onClick={navClickHandler}>
          <button type="button" className={Styles.no3}>
            리뷰
          </button>
        </li>
      </ul>
    </div>
  );
};






export default function SingleItemPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const contentRef = useRef();

  useEffect(() => {
    const contentList = Array.from(contentRef.current.children);
    contentList.forEach((thisCont) => {
      const thisContentIdx = contentList.indexOf(thisCont);
      if (thisContentIdx === activeIndex) {
        thisCont.classList.add(Styles.active);
        // slideDown(thisCont);
      }else{
        // slideUp(thisCont);
        thisCont.classList.remove(Styles.active);
      }
    });
  }, [activeIndex]);
  


  return (
    <>
      <MetaTitle title="샵" />
      <Layout>
        <Wrapper>
          <ShopBoard />
          <ShopTabMenus
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
          <ul id={Styles.content} ref={contentRef}>
            <li className={Styles.cont_list}>
              <ItemInfoBox />
            </li>
            <li className={Styles.cont_list}>
              <ReturnExchageGuideBox />
            </li>
            <li className={Styles.cont_list}>
              <ReviewBox />
            </li>
          </ul>
        </Wrapper>
      </Layout>
    </>
  );
}