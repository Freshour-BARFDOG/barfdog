import React from 'react';
import MetaTitle from "@src/components/atoms/MetaTitle";

import Layout from '@src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import Styles from './about.module.scss';
import Image from 'next/image';


function Index() {
  return (
    <>
      {" "}
      <MetaTitle title="어바웃" />
      <Layout>
        <Wrapper>
          <section className={Styles.top}>
            <div className={Styles.back_image}>
              <div className={`${Styles.img_wrap} img-wrap`}>
                <Image
                  src={require("/public/img/pages/community/community_1.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="카드 이미지"
                  priority
                />
              </div>

              <div className={`${Styles.img_wrap2} img-wrap`}>
                <Image
                  src={require("/public/img/pages/community/community_2.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="카드 이미지"
                  priority
                />
              </div>
            </div>

            <div className={Styles.inner}>
              <div className={Styles.letter_box}>
                <div className={`${Styles.title} img-wrap`}>
                  <Image
                    src={require("/public/img/pages/community/community_title.png")}
                    objectFit="contain"
                    layout="fill"
                    alt="카드 이미지"
                    priority
                  />
                </div>

                <div className={Styles.content1}>Fresh Life! fresh our</div>

                <div className={Styles.content2}>
                  우리는 반려동물과 아주 긴 시간을 함께 합니다.
                  <br />
                  때로는 이 여정이 고되고 지칠 때도 있지만 충분히 가치가 있는
                  일입니다.
                  <br />
                  시간이 한참 흐른 어느 날, 이 순간을 회상하는 날이 오면 우리는
                  주저없이 말할 것입니다.
                  <br />
                  내 인생 가장 가치 있고 행복한 시간이었다고 말입니다.
                  <br />
                  <br />
                  바프독이라는 브랜드를 만들며 조언을 구하고자 많은 반려인들을
                  만났습니다.
                  <br />
                  제가 그분들을 만나 뵙고 가장 많이 들었던 말은 ‘삶의
                  이유’였습니다.
                  <br />
                  <br />
                  “두부는 제가 왜 살아야 하는지를 알려줬어요”
                  <br />
                  “이 친구로 인해 사랑을 주고, 받는 기분이 무엇인지 알았어요”
                  <br />
                  “하루 종일 함께하지 못해 너무 미안해요. 그래도 주말은 오롯이
                  유미랑 함께 보낼 거예요”
                  <br />
                  <br />
                  이렇게 우리들은 ‘존재의 이유’가 된 내 소중한 반려동물들이
                  오랜시간 건강하게
                  <br />
                  내 옆에 머물러 주기를 간절히 원합니다. 이를 위해 보호자로서
                  많은 시간, 관심, 노력 등을
                  <br />
                  기울이지만 때로는 보살핌의 어려움과 올바름에 좌절감이 들기도
                  합니다.
                  <br />
                  <br />
                  이것이 소중한 반려동물과의 여정에 바프독이 함께 걷고자 하는
                  ‘이유’입니다.
                  <br />
                  이 여정은 반려인과 반려동물마다의 특성과 상황에 따라
                  달라야하고
                  <br />
                  특별한 요구사항에 따라서도 달라야 합니다.
                  <br />
                  <br />
                  그래서 바프독은 더 사려 깊어야 하고, 접근하기 쉬워야 하고,
                  맞춤형이어야 한다고 생각하여
                  <br />
                  반려동물들에게 가장 균형 잡힌 보살핌을 만들어 주고자 합니다.
                  <br />
                  바프독을 믿고 주문해주시는 반려인의 반려동물을 위한 맞춤형의
                  건강한 식사, 올바른 재료로
                  <br />
                  보답하겠습니다.
                  <br />
                  <br />
                  바프독은 당신의 반려동물에게
                  <br />
                  건강한 일년, 건강한 일생, 건강한 여정을 선물할 수 있도록
                  노력할 것 입니다.
                  <br />
                  <br />그 긴 여정을 응원합니다.
                </div>

                <div className={Styles.sign}>
                  <div className={Styles.ceo}>바프독 CEO 임경호</div>
                  <div className={`${Styles.img_sign} img-wrap`}>
                    <Image
                      src={require("/public/img/pages/community/community_sign.png")}
                      objectFit="cover"
                      layout="fill"
                      alt="카드 이미지"
                      priority
                    />
                  </div>
                </div>
              </div>

              <div className={Styles.letter_box2}>
                <div className={Styles.inner2}>
                  <div className={`${Styles.title} img-wrap`}>
                    <Image
                      src={require("/public/img/pages/community/community_title2.png")}
                      objectFit="contain"
                      layout="fill"
                      alt="카드 이미지"
                      priority
                    />
                  </div>

                  <div className={Styles.ulbox}>
                    <ul>
                      <li>
                        <div className={Styles.content3}>
                          휴먼그레이드 등급의 원재료 소싱
                        </div>
                        <p>
                          휴먼그레이드 등급의 원재료 소싱
                          <br />
                          모든 원재료들의 소싱과정부터
                          <br />
                          신선도, 영양성분, 안전성 등 다각도의 기준을 통과하여
                          배합니다.
                        </p>
                      </li>

                      <li>
                        <div className={Styles.content3}>
                          차별화된 맞춤형 1:1 생산
                        </div>
                        <p>
                          오직 한 반려견을 위한 1:1 맞춤형 레시피와 반려인의
                          고민을 반영하여
                          <br />
                          최고의 맞춤형 영양 구성의 비율을 만듭니다.
                        </p>
                      </li>

                      <li>
                        <div className={Styles.content3}>
                          철저한 위생과 품질 관리
                        </div>
                        <p>
                          바프독의 생산시설은 매일 위생테스트를 통해 관리하고
                          있으며
                          <br />
                          생산된 제품은 영양성분 테스트를 수행하고 데이터화
                          합니다.
                        </p>
                      </li>

                      <li>
                        <div className={Styles.content3}>
                          믿을 수 있는 안전성
                        </div>
                        <p>
                          최종 생산이 완료 된 후에도 포장된 제품의 신선도를
                          최적의 상태로 유지하기 위해
                          <br />
                          전자빔 멸균 처리에서 택배발송까지의 전 과정동안
                          <br />
                          냉동탑차, 15℃이하 저온 생산시설에서 포장 등
                          Full콜드체인시스템으로
                          <br />
                          신선함을 유지하고 있습니다.
                        </p>
                      </li>

                      <li>
                        <div className={Styles.content3}>환경을 위한 포장</div>
                        <p>
                          친환경 아이스팩 사용, 종이 아이스박스 사용 등, 바프독
                          뿐 아니라
                          <br />
                          구매 고객님, 반려동물이 살아가는 환경이 더 나아질 수
                          있도록 노력합니다.
                          <br />
                          (단, 한여름에는 더 신선하게 배송받으실 수 있도록
                          스트로폼 아이스박스로 배송됩니다.)
                          <br />
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Wrapper>

        <Wrapper>
          <section className={Styles.mid}>
            <div className={Styles.inner}>
              <div className={`${Styles.img_wrap4} img-wrap`}>
                <Image
                  src={require("/public/img/pages/community/community_welcome.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="Welcom"
                />
              </div>
              <div className={`${Styles.img_quotation} img-wrap`}>
                <Image
                  src={require("/public/img/pages/community/community_quotation.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="쌍 따옴표"
                />
              </div>

              <div className={Styles.title}>반갑습니다, 견주님!</div>

              <div className={Styles.text}>
                더 나은 견생을 위해 헌신해 주시는
                <br />
                훌륭한 반려인이 되어 주셔서 감사합니다
              </div>
            </div>
          </section>
        </Wrapper>

        <Wrapper>
          <section className={Styles.bottom}>
            <div className={Styles.inner}>
              <div className={Styles.left}>
                <div className={Styles.title}>INSTAGRAM</div>
                <p>인스타그램에서 바프독의 최신 소식을 확인해보세요</p>
              </div>

              <div className={Styles.right}>
                <div className={Styles.button}>
                  <p>인스타그램 구경하기</p>
                </div>
              </div>
            </div>
          </section>
        </Wrapper>
      </Layout>
    </>
  );
}
export default Index;
