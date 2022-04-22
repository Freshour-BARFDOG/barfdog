import React from 'react';
import MetaTitle from "/src/components/atoms/MetaTitle";
import Layout from '../../components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import Styles from '../../../styles/css/faq/faq.module.scss'
import { IoIosArrowForward  } from "react-icons/io";

function FAQindexPage() {
  return (
    <>
      <MetaTitle title="FAQ" />
      <Layout>
        <Wrapper>
          <section className={Styles.top}>
            <div className={Styles.inner}>
              <div className={Styles.title}>
                자주 묻는 질문
              </div>
            </div>
          </section>

        </Wrapper>
          <section className={Styles.mid}>
            <div className={Styles.inner}>
              <div className={Styles.boxes}>
                <div className={Styles.box}>
                  바프독
                </div>
                <div className={Styles.box}>
                  플랜
                </div>
                <div className={Styles.box}>
                  레시피
                </div>
                <div className={Styles.box}>
                  보관 및 급여
                </div>
                <div className={Styles.box}>
                  계정 관리
                </div>
              </div>
            </div>
          </section>  

        {/* 바프독 */}
        <Wrapper>
          <section className={Styles.bot}>
            <div className={Styles.whatsraw}>
              <div className={Styles.bot_boxes}>

                <div className={`${Styles.inner_box} clearfix`}>
                  <div className={Styles.title_box}>
                    생식이 뭔가요?
                  </div>
                  <div className={Styles.arrow}><IoIosArrowForward /></div>
                </div>
                <div className={Styles.text_box}>
                  <div className={Styles.text}>
                    반려동물(개, 고양이)이 육식동물이라는 전제하에 가장 알맞은 형태의 식이 방식으로 육류 및 내장류, 곡물, 채소, 과일, 등을 
                    혼합하여 급여하며 식재료만으로 부족한 영양소를 영양제, 보조제로 추가해 맞춰 완벽한 식단을 구성합니다. 반려동물 시장 선진국인 미국 및 유럽에서는 
                    많이 알려진 식이방법으로 바프독은 미국, 유럽 생식 영양학 전문가의 정기적인 피드백을 받습니다.
                    생식을 시작하면 나타나는 장점을 확인하세요<br/><br/>
                    1. 고온 및 압출 등의 공정과정을 거치지 않아 영양소, 효소, 유익균의 손상 및 파괴를 최소<br />
                    2. 탄수화물을 포함하지 않은 휴먼그레이드 등급보다 더 높은 단계의 신선한 단백질로 알레르기 유발 원인을 근본적으로 차단, 더 건강한 체질로의 개선<br />
                    3. 건사료 대비 더 높은 수분 함량으로 하부 요로계 질환을 예방<br />
                    4. 흡수율 95%이상으로 영양소를 무리 없이 흡수, 소화하는데 많은 에너지가 필요하지 않으므로 반려견의 건강한 활동량 증가<br />
                    5. 레시피를 유동적으로 구성 가능<br />
                    6. 상업 사료에 포함될 수 있는 질 낮은 비타민과 미네랄, 보존제 등을 급여하지 않음으로써 염증성 질환 및 장 질환 개선, 전반적인 면역력 증가<br />
                    7. 모질, 눈물, 알러지, 치아, 냄새 등을 개선<br />
                    8. 배변의 악취 개선, 적은 양의 변<br />
                  </div>
                </div>
                <div className={`${Styles.inner_box} clearfix`}>
                  <div className={Styles.title_box}>
                    왜 바프독으로 바꿔야 하나요?
                  </div>
                  <div className={Styles.arrow}><IoIosArrowForward /></div>
                </div>
                <div className={Styles.text_box}>
                  <div className={Styles.text}>
                    바프독은 반려견의 &lsquo;사료&rsquo;를 만들지 않습니다. 바프독은 반려견을 위한 &lsquo;음식&rsquo;을 만듭니다. 바프독의 모든 레시피는 유기농, 친환경, 휴먼그레이드 등급만 사용합니다. 
                    오히려 고기의 경우 익혀서 먹는 사람의 등급보다는 더 신선해야 하므로 당일 도축된 고기를 공급받아 국내 대형마트 급의 저온제조시설, iso 인증된 주방에서 체계적으로 
                    준비하고 요리됩니다. 이 모든 제조 시스템은 사람이 만들어지는 것과 동일한 시스템 점검을 받습니다. 우리 반려견 친구들이 먹는 모든 식사는 저온시설에서 조리되어 신선함을 보장하고,
                    신선하게 배송될 수 있도록 대형 냉동창고에서 급속 동결하여 전달 드립니다.
                  </div>
                </div>

                <div className={`${Styles.inner_box} clearfix`}>
                  <div className={Styles.title_box}>
                    구독은 어떻게 하나요?
                  </div>
                  <div className={Styles.arrow}><IoIosArrowForward /></div>
                </div>


                <div className={Styles.text_box}>
                  <div className={Styles.text}>
                    반려인이 바프독에서 작성한 자료를 통해 반려견에게 맞는 1:1 맞춤형 식사 레시피를 체계적으로 설계하여 생산합니다. 오직 당신의 반려견을 위해서 1:1 맞춤 제조된 생식을 
                    집 앞으로 배송해 드립니다. 더 이상 반려견 친구의 영양비율, 재료, 사료 고민 등을 하지 마세요 :) 각각의 식사는 완벽하게 구성, 분배되어 있어 반려인에게는 간편하지만 
                    우리 반려견 친구에게는 완벽한 영양분을 선물해 드릴 거예요.

                  </div>
                </div>
              </div>
            </div>
          </section>  
        </Wrapper>
        
        {/* 플랜 */}
        <Wrapper>
          <section className={Styles.bot}>
            <div className={Styles.plan}>
              <div className={Styles.bot_boxes}>
                <div className={`${Styles.inner_box} clearfix`}>
                  <div className={Styles.title_box}>
                  정기 배송(구독) 없이 바프독을 이용할 수 있나요?
                  </div>
                  <div className={Styles.arrow}><IoIosArrowForward /></div>
                </div>
                <div className={Styles.text_box}>
                  <div className={Styles.text}>
                  바프독은 반려견의 정보를 바탕으로 영양분을 완벽히 설계하여 플랜에 맞게 정기적으로 배송해드리는 서비스 입니다. 아직 구독이 망설여 지신다면 아래를 읽어 보시고 선택해 보세요.
                  선택1. 시존 사료에 토핑하여 바프독 생식을 급여할 수 있도록 1주일에 5팩으로 구성된 토핑플랜(4주에 20팩)을 선택해 보세요.<br />
                  선택2. 기존 사료와 바프독 생식을 아침, 저녁으로 번갈아 급여할 수 있도록 하루 한 팩 구성되어 있는 하프플랜(4주에 28팩)을 선택해 보세요.<br />
                  선택3. 반려견이 생식을 체험할 수 있도록 바프독 샵 내에 단품을 구입해 보세요.<br />
                  바프독은 반려견의 정보를 바탕으로 섭취해야 할 한달의 영양분을 체계적으로 설계하여 배송 드리는 서비스 입니다. 반려견이 성장하고 변화함에 따라 지속적인 건강한 체질로의 성장과
                  면역력 강화를 위해 꾸준한 생식 급여 후 각각의 반려견에게 맞는 적정 급여량을 찾기를 권장 드립니다.<br />
                  가입이 완료되면 바프독 계정페이지에서 반려견 정보를 수정하거나 미루거나, 언제든지 취소할 수 있습니다! 도움이 필요하다면 ‘마이페이지 - 문의하기’로 언제든 문의주세요 :)
                  </div>
                </div>
                <div className={`${Styles.inner_box} clearfix`}>
                  <div className={Styles.title_box}>
                    비용은 얼마인가요?
                  </div>
                  <div className={Styles.arrow}><IoIosArrowForward /></div>
                </div>
                <div className={Styles.text_box}>
                  <div className={Styles.text}>
                    바프독의 자세한 가격은 반려견의 나이, 몸무게, 활동, 체형 여부 등을 포함한 다양한 요인에 따라 달라집니다. 정기구독시 모든 제품은 무료로 발송됩니다. 정확한 비용을 알고 싶다면 
                    상단 정기구독 버튼을 통해 반려견 프로필을 작성하여 주세요.<br />
                    또한 적은 양으로 플랜을 계획 할 수 있도록 하프 플랜, 토핑플랜을 제공하므로 반려견 프로필 작성을 통해 결정할 수 있습니다.
                  </div>
                </div>

                <div className={`${Styles.inner_box} clearfix`}>
                  <div className={Styles.title_box}>
                    시작하기 전에 샘플을 신청할 수 있나요?
                  </div>
                  <div className={Styles.arrow}><IoIosArrowForward /></div>
                </div>

                <div className={Styles.text_box}>
                  <div className={Styles.text}>
                    현재 샘플이나 평가판 박스는 제공하지 않습니다. 대신 처음 생식을 접하는 반려동물을 위해 두가지 선택지가 있습니다.<br />
                    선택1. 시존 사료에 토핑하여 바프독 생식을 급여할 수 있도록 1주일에 5팩으로 구성된 토핑플랜(4주에 20팩)을 선택해 보세요.<br />
                    선택2. 기존 사료와 바프독 생식을 아침, 저녁으로 번갈아 급여할 수 있도록 하루 한 팩 구성되어 있는 하프플랜(4주에 28팩)을 선택해 보세요.<br />
                    선택3. 반려견이 생식을 체험할 수 있도록 바프독 샵 내에 단품을 구입해 보세요.
                  </div>
                </div>

                <div className={`${Styles.inner_box} clearfix`}>
                  <div className={Styles.title_box}>
                    풀 플랜(Full Plan)이 뭔가요?
                  </div>
                  <div className={Styles.arrow}><IoIosArrowForward /></div>
                </div>
                
                <div className={Styles.text_box}>
                  <div className={Styles.text}>
                    내 반려견의 좋은 변화를 가장 빠르게 체감 하고 싶으신 분에게 추천합니다. 풀 플랜은 바프독 생식 기준으로 하루 권장 칼로리 모두를 바프독 레시피로 채워진 플랜입니다. 
                    하루 두끼로 구성되어 있고, 다른 메뉴(화식, 사료) 없이 완벽한 식단 플랜으로 구성되어 있습니다.
                  </div>
                </div>
              </div>
            </div>
          </section>  
        </Wrapper>

        {/* 레시피 */}
        <Wrapper>
          <section className={Styles.bot}>
            <div className={Styles.recipe}>
              <div className={Styles.bot_boxes}>
                <div className={`${Styles.inner_box} clearfix`}>
                  <div className={Styles.title_box}>
                  까다로운 반려동물을 위한 팁
                  </div>
                  <div className={Styles.arrow}><IoIosArrowForward /></div>
                </div>
                <div className={Styles.text_box}>
                  <div className={Styles.text}>
                    완벽히 설계된 영양 한끼 생식을 100% 섭취하기 위해 간식을 줄여주세요. 새로운 음식에 익숙해 질 수 있도록 조용한 장소에서 급여하시고 급여시작 후 20분 후에는 바로 치우는 훈련을 해주세요.<br />
                    더 많은 정보와 다른 유용한 팁은 바프독 블로그 게시물에서 확인하세요
 
                  </div>
                </div>

                <div className={`${Styles.inner_box} clearfix`}>
                  <div className={Styles.title_box}>
                    생식이 처음인데 괜찮나요?
                  </div>
                  <div className={Styles.arrow}><IoIosArrowForward /></div>
                </div>

                <div className={Styles.text_box}>
                  <div className={Styles.text}>
                    반려견이 바프독 레시피로 전환할 수 있도록 첫 주문 시 바프독 안내 책자를 동봉하여 배송해 드립니다. 성공적인 전환을 위해 우선 바프독의 음식을 현재 음식과 섞어 먹이는 것 부터 시작하세요.<br />
                    기존 사료에 바프독 생식을 한 스푼 넣는 것을 시작으로 천천히 100%로 늘려 가시면 됩니다. 예민한 반려견의 경우, 생식이 처음일 경우 배탈, 묽은변, 구토증상이 나타날 수 있으나 그럴 땐 더욱 적은 양을 시작으로 새로운 음식에 적응할 때까지 천천히 생식의 양을 늘려주세요.<br />
                    전환에는 7~14일 정도 걸릴 수 있습니다. 그밖에 다양한 정보는 블로그 게시물에서 확인하세요 :)

                  </div>
                </div>

                <div className={`${Styles.inner_box} clearfix`}>
                  <div className={Styles.title_box}>
                    반려견 식단을 바프독으로 바꿀 때 수의사와 상의해야 하나요?
                  </div>
                  <div className={Styles.arrow}><IoIosArrowForward /></div>
                </div>
                
                <div className={Styles.text_box}>
                  <div className={Styles.text}>
                    바프독은 수의사님들의 의견을 적극적으로 반영하고 있으며 수의사, 영양 전문가의 의견을 적극 지지합니다. 또한 바프독 팀은 항상 반려동물의 식단을 바꿀 때 수의사에게 확인하는 것을 추천합니다.<br />
                    바프독은 레시피를 만들고 관리하기 위한 인증 받은 수의사 및 영양사와 함께 일하고 있으며 대부분의 수의사들은 신선하고 영양적 균형 잡힌 식단이 반려동물들에게 좋다는 것에 동의할 것 입니다.<br />
                    또 다른 궁금하신 점이 있다면 언제든 바프독으로 문의 주세요 :)
                  </div>
                </div>

                <div className={`${Styles.inner_box} clearfix`}>
                  <div className={Styles.title_box}>
                    반려견의 식단을 어떻게 맞추나요?
                  </div>
                  <div className={Styles.arrow}><IoIosArrowForward /></div>
                </div>

                <div className={Styles.text_box}>
                  <div className={Styles.text}>
                    모든 바프독의 레시피는 1:1 맞춤 균형 잡힌 영양 식단으로 반려견의 생활방식 및 알레르기 유무에 맞추어 이상적인 영양비율 생식을 제공합니다. 바프독의 레시피는 항생제, 호르몬, 충진제, 방부제 등 불필요하고 
                    건강하지 않은 재료는 들어가지 않습니다.
                  </div>
                </div>

                <div className={`${Styles.inner_box} clearfix`}>
                  <div className={Styles.title_box}>
                    바프독의 특별한 레시피
                  </div>
                  <div className={Styles.arrow}><IoIosArrowForward /></div>
                </div>
                
                <div className={Styles.text_box}>
                  <div className={Styles.text}>
                  1. STARTER PREMIUM(스타터 프리미엄) - 생식을 처음 접하는 반려견, 생식 경험이 적은 반려견<br />
                  2. TURKEY &amp; BEEF(터키 앤 비프) - 면역체계강화, 혈액순환 촉진, 기관지 염증 완화 레시피<br />
                  3. DUCK &amp; LAMB(덕 앤 램) - 피로회복, 신체능력강화, 고영양식 에너지 부스트 레시피<br />
                  4. LAMB &amp; BEEF(램 앤 비프) - 피부모질 강화, 면역력 강화, 체중 관리 식이요법 레시피<br />
                  반려동물의 프로필을 설문을 통해 공유해 주시면 전문 수의사와 함께 개발한 전용 알고리즘으로 정확하고 건강한 레시피의 식단을 제공합니다.
                  </div>
                </div>


                <div className={`${Styles.inner_box} clearfix`}>
                  <div className={Styles.title_box}>
                    바프독 식단은 어떻게 만들어 지나요?
                  </div>
                  <div className={Styles.arrow}><IoIosArrowForward /></div>
                </div>

                <div className={Styles.text_box}>
                  <div className={Styles.text}>
                    바프독의 모든 레시피는 ISO 9001(품질경영시스템), ISO 14001(환경경영시스템) 인증된 15도씨 이하의 저온실에서 제조 및 포장이 이루어집니다. 
                    따라서 제조 및 포장 단계에서 생길 수 있는 문제를 최소화 하기위해 노력하고 있습니다. 
                    바프독 팀은 ISO 지침에 따라 모든 시설 및 서비스를 검사하고 신선도와 영양분을 함유하기 위해 동결되어 전달됩니다.
                  </div>
                </div>


                <div className={`${Styles.inner_box} clearfix`}>
                  <div className={Styles.title_box}>
                    고양이와 같은 다른 반려동물을 위한 레시피는 없나요?
                  </div>
                  <div className={Styles.arrow}><IoIosArrowForward /></div>
                </div>

                <div className={Styles.text_box}>
                  <div className={Styles.text}>
                    바프독 팀은 현재 반려견을 위한 레시피만 제공하고 있습니다. 현재 BARFCAT (바프캣), 고양이를 위한 레시피가 준비중이오니 조금만 기다려주세요 :)
                   </div>
                </div>
              </div>
            </div>
          </section>  
        </Wrapper>

        {/* 보관 및 급여 */}
        <Wrapper>
          <section className={Styles.bot}>
            <div className={Styles.keep}>
              <div className={Styles.bot_boxes}>
                <div className={`${Styles.inner_box} clearfix`}>
                  <div className={Styles.title_box}>
                  바프독 레시피는 얼마나 오래 보관 가능한가요?
                  </div>
                  <div className={Styles.arrow}><IoIosArrowForward /></div>
                </div>
                
                <div className={Styles.text_box}>
                  <div className={Styles.text}>
                    바프독의 레시피는 신선식품이기 때문에 냉동 보관은 필수입니다. 전달되는 택배박스에 제품들이 동결된 상태로 도착하므로 즉시 냉동 보관 해주세요. 유통기한은 제조일로 부터 3개월입니다.<br />
                    급여하기 하루 전 냉장실에서 해동 또는 급여전 미지근한 물로 해동하시면 됩니다. 
                    자세한 내용은 배송에 동봉된 바프독 급여가이드 책자를 확인하세요. 한번 실온해서 급여한 제품을 다시 동결해 제품을 급여하면 심각한 문제를 만들 수 있어 재냉동 재급여를 절대 금지합니다. 
                    그리고 급여 후 반려동물이 바로 먹지 않고 남기게 된다면 바로 치워 세균번식을 막아주는 것이 중요합니다.
                  </div>
                </div>

                <div className={`${Styles.inner_box} clearfix`}>
                  <div className={Styles.title_box}>
                    반려견에게 얼마나 급여해야 하나요?
                  </div>
                  <div className={Styles.arrow}><IoIosArrowForward /></div>
                </div>

                <div className={Styles.text_box}>
                  <div className={Styles.text}>
                    바프독 레시피는 입력해 주신 반려견 프로필을 통한 알고리즘에 따라 각각 1:1 맞춤형으로 조리됩니다. 바프독 레시피는 하루 두 끼를 기준으로 하며, 타 자연식 및 사료와 혼합 급여를 원하시는 경우 주문시에 
                    하루 한끼를 선택할 수도 있습니다. 
                    계정에서 반려인이 입력한 내 반려견이 소비하는 이상적인 칼로리 범위 및 일일 급여량을 확인하실 수 있습니다. 다만 아이들의 활동량, 체격, 타고난 체질에 따라 급여량이 달라질 수 있습니다. 바프독은 1:1 
                    맞춤형 제조 서비스로 매일매일 반려견 친구를 지켜봐 주시고 급여하시면서 적정 급여량을 맞추어 주시는 것이 가장 좋은 방법입니다. 그리고 그 내용을 저희에게 주시면 충분한 상담을 통해 급여량 및 영양을 조절해 
                    드리도록 하겠습니다.
                  </div>
                </div>

                <div className={`${Styles.inner_box} clearfix`}>
                  <div className={Styles.title_box}>
                    생식은 균때문에 위험하다고 하는데, 위험하진 않을까요? (수정예정)
                  </div>
                  <div className={Styles.arrow}><IoIosArrowForward /></div>
                </div>
                
                <div className={Styles.text_box}>
                  <div className={Styles.text}>
                    내용내용내용내용내용내용
                  </div>
                </div>

              </div>
            </div>
          </section>  
        </Wrapper>

        {/* 계정 관리 */}
        <Wrapper>
          <section className={Styles.bot}>
            <div className={Styles.account}>
              <div className={Styles.bot_boxes}>
                <div className={`${Styles.inner_box} clearfix`}>
                  <div className={Styles.title_box}>
                  계정에 반려동물을 추가할 수 있나요?
                  </div>
                  <div className={Styles.arrow}><IoIosArrowForward /></div>
                </div>

                <div className={Styles.text_box}>
                  <div className={Styles.text}>
                    물론입니다. 반려동물 프로필을 작성하시고 추가 반려동물을 원하시면 계정 내에 있는 반려견 정보 &lsquo;반려견 추가하기&rsquo; 버튼으로 새로운 프로필을 작성해 주세요.
                  </div>
                </div>


                <div className={`${Styles.inner_box} clearfix`}>
                  <div className={Styles.title_box}>
                    구독료는 언제 청구되나요?
                  </div>
                  <div className={Styles.arrow}><IoIosArrowForward /></div>
                </div>
                
                <div className={Styles.text_box}>
                  <div className={Styles.text}>
                    바프독 팀은 항상 금,토,일요일에 생산되어 수요일에 주문 발송됩니다. (수요일이 휴일인 경우 목요일 발송) 결제는 첫 결제 후 2주(풀플랜), 4주(하프,토핑플랜) 마다 정기 청구 됩니다. 
                    보다 자세한 정보는 계정 내에서 확인 가능합니다. 그리고 배송 전 일요일까지 계정 페이지에서 정보를 바꿀 수 있습니다.
                  </div>
                </div>

                <div className={`${Styles.inner_box} clearfix`}>
                  <div className={Styles.title_box}>
                    배송 일정을 변경하려면 어떻게 해야 하나요?
                  </div>
                  <div className={Styles.arrow}><IoIosArrowForward /></div>
                </div>
                
                <div className={Styles.text_box}>
                  <div className={Styles.text}>
                    여러분의 반려견 구독을 관리하고 변경하는 것은 매우 쉽습니다. 매주 컷오프(다음 주문의 배송 전 일요일 오후 12시) 전에 귀하의 계정에 로그인해 변경하거나 문의를 통해 담당 바프독 팀이 수정을 도와드릴 수 있습니다.
                  </div>
                </div>

                <div className={`${Styles.inner_box} clearfix`}>
                  <div className={Styles.title_box}>
                    구독을 일시 중지하려면 어떻게 하나요?
                  </div>
                  <div className={Styles.arrow}><IoIosArrowForward /></div>
                </div>
                
                <div className={Styles.text_box}>
                  <div className={Styles.text}>
                    바프독에서는 현재 일시정지 기능을 제공하고 있지 않습니다. 다만 계정에서 필요에 따라 구독을 쉽게 건너 뛰기 할 수 있습니다. 1주 혹은 1회를 제한 없이 건너 뛸 수 있고, 미룬 시기 까지 바프독에서 청구되지 않습니다. 
                    추가로 궁금한 점이나 어려운 점이 있다면 언제든지 문의주세요.
                  </div>
                </div>
                
                <div className={`${Styles.inner_box} clearfix`}>
                  <div className={Styles.title_box}>
                    구독을 취소하려면 어떻게 해야 하나요?
                  </div>
                  <div className={Styles.arrow}><IoIosArrowForward /></div>
                </div>

                <div className={Styles.text_box}>
                  <div className={Styles.text}>
                    언제든지 계정에서 구독을 취소할 수 있습니다. 주문이 이미 처리 중인 경우 이미 제조를 위한 과정이 시작되었으므로 해당 주문 배송 후 취소가 완료 됩니다. 미리 취소를 원하시는 경우 다음 주문이 발송되기 전 일요일까지 
                    계정에서 변경하세요. 취소에 어려움이 있다면 언제든 문의주세요. 바프독 팀이 도와드리겠습니다.<br />
                    바프독은 더 좋은 서비스를 제공하기 위해 반려인, 견주님께서 시간을 내어 말씀해주시는 고민과 조언을 언제든지 들을 준비가 되어 있습니다. 불편한 사항 등 여러가지 문제점을 말씀주시면 경청하고 개선하며 끊임없이 더 나아가고자 
                    노력하겠습니다. 늘 감사드립니다.
                  </div>
                </div>

                <div className={`${Styles.inner_box} clearfix`}>
                  <div className={Styles.title_box}>
                    바프독과 함께하고 싶나요?
                  </div>
                  <div className={Styles.arrow}><IoIosArrowForward /></div>
                </div>
                
                <div className={Styles.text_box}>
                  <div className={Styles.text}>
                    반려동물에 대한 아이디어가 떠오르고 바프독 팀과 함께하고 싶나요? 저희도 들어보고 싶어요! info@freshour.co.kr 으로 이메일 주시면 담당자가 연락 드리겠습니다.
                  </div>
                </div>

              </div>
            </div>
          </section>  
        </Wrapper>

      </Layout>
    </>
  );
}
export default FAQindexPage
