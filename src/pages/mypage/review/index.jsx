import React, { useState } from "react";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import Styles from "./review.module.scss";
import Image from "next/image";
import RatingStars from "/src/components/atoms/RatingStars";
import TabContentContainer, {
  LeftContainer,
  RightContainer,
} from "/src/components/atoms/TabContentContainer";
import Tabmenu_TwoButton from "/src/components/atoms/Tabmenu_TwoButton";
import Pagination from "@src/components/atoms/Pagination";

const ModalExam = () => {
  return (
    <>
      <section className={Styles.review_del}>
        <div className={Styles.text}>후기를 삭제하시겠습니까?</div>

        <div className={Styles.btn_box}>
          <div className={Styles.btn}>확인</div>
        </div>
      </section>
    </>
  );
};

function ReviewPage() {
  const [activeMenu, setActiveMenu] = useState("left");

  return (
    <>
      <MetaTitle title="마이페이지 후기" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={Styles.title}>상품후기</section>
            <Tabmenu_TwoButton
              leftMenuName={"후기작성"}
              rightMenuName={"작성한 후기"}
              getPositionHandler={setActiveMenu}
            />
            <TabContentContainer>
              <LeftContainer activeMenu={activeMenu}>
                <section className={Styles.content}>
                  <div className={Styles.flex}>
                    <div className={Styles.left}>
                      <div className={`${Styles.image} img-wrap`}>
                        <Image
                          priority
                          src={require("public/img/mypage/review_pic_1.png")}
                          objectFit="cover"
                          layout="fill"
                          alt="카드 이미지"
                        />
                      </div>
                      <div className={Styles.title_text}>
                        <p>믹스 레시피</p>
                        <div className={Styles.mid_text}>
                          정기구독 &middot; 3회차
                        </div>
                        <div className={Styles.day_text}>2022.02.15</div>
                      </div>
                    </div>

                    <div className={Styles.right}>
                      <div className={Styles.btn}>후기 작성하기</div>
                    </div>
                  </div>
                </section>

                <section className={Styles.content}>
                  <div className={Styles.flex}>
                    <div className={Styles.left}>
                      <div className={`${Styles.image} img-wrap`}>
                        <Image
                          priority
                          src={require("public/img/mypage/review_pic_1.png")}
                          objectFit="cover"
                          layout="fill"
                          alt="카드 이미지"
                        />
                      </div>
                      <div className={Styles.title_text}>
                        <p>믹스 레시피</p>
                        <div className={Styles.mid_text}>
                          정기구독 &middot; 3회차
                        </div>
                        <div className={Styles.day_text}>2022.02.15</div>
                      </div>
                    </div>

                    <div className={Styles.right}>
                      <div className={Styles.btn}>후기 작성하기</div>
                    </div>
                  </div>
                </section>

                <section className={Styles.content}>
                  <div className={Styles.flex}>
                    <div className={Styles.left}>
                      <div className={`${Styles.image} img-wrap`}>
                        <Image
                          priority
                          src={require("public/img/mypage/review_pic_1.png")}
                          objectFit="cover"
                          layout="fill"
                          alt="카드 이미지"
                        />
                      </div>
                      <div className={Styles.title_text}>
                        <p>믹스 레시피</p>
                        <div className={Styles.mid_text}>
                          정기구독 &middot; 3회차
                        </div>
                        <div className={Styles.day_text}>2022.02.15</div>
                      </div>
                    </div>

                    <div className={Styles.right}>
                      <div className={Styles.btn}>후기 작성하기</div>
                    </div>
                  </div>
                </section>
                <div className={Styles.pagination_box}>
                  <Pagination itemCountPerGroup={5} itemTotalCount={30} />
                </div>
              </LeftContainer>
              <RightContainer activeMenu={activeMenu}>
                <section className={Styles.content}>
                  <div className={Styles.content_box}>
                    <div className={Styles.content}>
                      <div className={Styles.flex_box5}>
                        <div className={Styles.left_box}>
                          <div className={Styles.row_1}>
                            <div className={Styles.pic_box}>
                              <div className={`${Styles.image} img-wrap`}>
                                <Image
                                  priority
                                  src={require("public/img/mypage/review_pic_1.png")}
                                  objectFit="cover"
                                  layout="fill"
                                  alt="카드 이미지"
                                />
                              </div>
                            </div>

                            <div className={Styles.content_inner_title}>
                              믹스 레시피
                            </div>

                            <p> 정기구독 &middot; 3회차</p>
                          </div>

                          <div>
                            <RatingStars count={4} margin={5} size={15} />
                          </div>

                          <div className={Styles.row_3}>
                            늘 구매하는 상품입니다. 역시나 잘먹어요!
                          </div>

                          <div className={Styles.row_5}>2022.02.15</div>
                        </div>

                        <div className={Styles.mid_box}></div>

                        <div className={Styles.right_box}>
                          <div className={Styles.btn_box}>
                            <div className={Styles.red_btn}>수정</div>
                          </div>

                          <div className={Styles.btn_box}>
                            <div className={Styles.btn2}>삭제</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={Styles.content}>
                      <div className={Styles.flex_box5}>
                        <div className={Styles.left_box}>
                          <div className={Styles.row_1}>
                            <div className={Styles.pic_box}>
                              <div className={`${Styles.image} img-wrap`}>
                                <Image
                                  priority
                                  src={require("public/img/mypage/review_pic_1.png")}
                                  objectFit="cover"
                                  layout="fill"
                                  alt="카드 이미지"
                                />
                              </div>
                            </div>

                            <div className={Styles.content_inner_title}>
                              믹스 레시피
                            </div>

                            <p> 정기구독 &middot; 3회차</p>
                          </div>

                          <div>
                            <RatingStars count={4} margin={5} size={15} />
                          </div>

                          <div className={Styles.row_3}>
                            늘 구매하는 상품입니다. 역시나 잘먹어요!
                          </div>

                          <div className={Styles.row_5}>2022.02.15</div>
                        </div>

                        <div className={Styles.mid_box}>
                          <div className={Styles.mid_box_text}>
                            적립금 지급 완료
                          </div>
                        </div>

                        <div className={Styles.right_box}>
                          <div className={Styles.btn_box}>
                            <div className={Styles.grey_btn}>수정</div>
                          </div>

                          <div className={Styles.btn_box}>
                            <div className={Styles.grey_btn}>삭제</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={Styles.content}>
                      <div className={Styles.flex_box5}>
                        <div className={Styles.left_box}>
                          <div className={Styles.row_1}>
                            <div className={Styles.pic_box}>
                              <div className={`${Styles.image} img-wrap`}>
                                <Image
                                  priority
                                  src={require("public/img/mypage/review_pic_1.png")}
                                  objectFit="cover"
                                  layout="fill"
                                  alt="카드 이미지"
                                />
                              </div>
                            </div>

                            <div className={Styles.content_inner_title}>
                              믹스 레시피
                            </div>

                            {/* <p> 정기구독 &middot; 3회차</p> */}
                          </div>

                          <div>
                            <RatingStars count={4} margin={5} size={15} />
                          </div>

                          <div className={Styles.row_3}>
                            늘 구매하는 상품입니다. 역시나 잘먹어요!
                          </div>

                          <div className={Styles.row_4}>
                            <div className={Styles.pic_box}>
                              <div className={`${Styles.image} img-wrap`}>
                                <Image
                                  priority
                                  src={require("public/img/mypage/review_pic_2.png")}
                                  objectFit="cover"
                                  layout="fill"
                                  alt="카드 이미지"
                                />
                              </div>
                            </div>
                          </div>

                          <div className={Styles.row_5}>2022.02.15</div>
                        </div>

                        <div className={Styles.mid_box}>
                          <div className={Styles.mid_box_text}>
                            적립금 지급 완료
                          </div>
                        </div>

                        <div className={Styles.right_box}>
                          <div className={Styles.btn_box}>
                            <div className={Styles.grey_btn}>수정</div>
                          </div>

                          <div className={Styles.btn_box}>
                            <div className={Styles.grey_btn}>삭제</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <div className={Styles.pagination_box}>
                  <Pagination itemCountPerGroup={5} itemTotalCount={30} />
                </div>
              </RightContainer>
            </TabContentContainer>
          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

export default ReviewPage;
