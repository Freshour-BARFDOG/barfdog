import React from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import Styles from 'styles/css/mypage/dogs/index.module.scss';
import Image from 'next/image';

function Mypage() {
  return (
    <>
      <MetaTitle title="마이페이지 반려견정보"/>
      <Layout>
        <Wrapper>
          <MypageWrapper>

            <section className={Styles.title}>
              반려견정보
            </section>

            <section className={Styles.body}>
              <div className={Styles.flex_box}>
                <div className={Styles.text}>
                  아직 등록된 반려견이 없습니다<br />
                  내 강아지 정보를 입력하고 맞춤 플랜을 확인하세요
                </div>

                <div className={Styles.btn_box}>
                  <div className={Styles.btn}>
                    맞춤플랜 확인하기
                  </div>
                </div>
              </div >
            </section>


          </MypageWrapper>
        </Wrapper>

        <Wrapper>
          <MypageWrapper>
            <section className={Styles.title}>
              반려견정보
            </section>

            <section className={Styles.body2}>
              <div className={Styles.flex_box2}>
                
                <div className={Styles.left_box}>
                  <div className={`${Styles.image} img-wrap`}>
                    <Image
                      priority
                      src={require("/public/img/mypage/dogs_info.png")}
                      objectFit="cover"
                      layout="fill"
                      alt="카드 이미지"
                    />
                  </div>
                </div>

                <div className={Styles.right_box}>
                  <div className={Styles.flex_box3}>
                    <div className={Styles.inner_flex}>
                      <div className={Styles.dog_name}>
                        시호 ( 1세 / 수컷 )
                      </div>
                      <div className={Styles.representative}>
                        대표견
                      </div>
                      <div className={Styles.subscribe}>
                        구독중
                      </div>
                    </div>
                    
                    <div className={`${Styles.image} img-wrap`}>
                      <Image
                        priority
                        src={require("/public/img/mypage/dog_info_delete.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="카드 이미지"
                      />
                    </div>
                  </div>

                  <div className={Styles.flex_box4}>
                    <div>
                      프로필사진 편집 
                    </div>
                    <div className={Styles.line}>

                    </div>
                    <div>
                      대표견 설정
                    </div>
                  </div>

                  <div className={Styles.flex_box5}>
                    <div className={Styles.left_btn}>
                      설문결과
                    </div>
                    <div className={Styles.right_btn}>
                      설문수정
                    </div>

                  </div>
                </div>
              </div>

              <div className={Styles.flex_box2}>                
                <div className={Styles.left_box}>
                  <div className={`${Styles.image} img-wrap`}>
                    <Image
                      priority
                      src={require("/public/img/mypage/dogs_info2.png")}
                      objectFit="cover"
                      layout="fill"
                      alt="카드 이미지"
                    />
                  </div>
                </div>

                <div className={Styles.right_box}>
                  <div className={Styles.flex_box3}>
                    <div className={Styles.inner_flex}>
                      <div className={Styles.dog_name}>
                        불독이 ( 1세 / 수컷 )
                      </div>
                      {/* <div className={Styles.representative}>
                        대표견
                      </div> */}
                      <div className={Styles.subscribe}>
                        구독중
                      </div>
                    </div>
                    
                    <div className={`${Styles.image} img-wrap`}>
                      <Image
                        priority
                        src={require("/public/img/mypage/dog_info_delete.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="카드 이미지"
                      />
                    </div>
                  </div>

                  <div className={Styles.flex_box4}>
                    <div>
                      프로필사진 편집 
                    </div>
                    <div className={Styles.line}>

                    </div>
                    <div>
                      대표견 설정
                    </div>
                  </div>

                  <div className={Styles.flex_box5}>
                    <div className={Styles.left_btn}>
                      설문결과
                    </div>
                    <div className={Styles.right_btn}>
                      설문수정
                    </div>
                  </div>
                </div>
              </div>

              <div className={Styles.flex_box2}>                
                <div className={Styles.left_box}>
                  <div className={`${Styles.image} img-wrap`}>
                    <Image
                      priority
                      src={require("/public/img/mypage/dogs_info3.png")}
                      objectFit="cover"
                      layout="fill"
                      alt="카드 이미지"
                    />
                  </div>
                </div>

                <div className={Styles.right_box}>
                  <div className={Styles.flex_box3}>
                    <div className={Styles.inner_flex}>
                      <div className={Styles.dog_name}>
                        바둑이 ( 3세 / 암컷 )
                      </div>
                      {/* <div className={Styles.representative}>
                        대표견
                      </div> */}
                      <div className={Styles.before_pay}>
                        결제전
                      </div>
                    </div>
                    
                    <div className={`${Styles.image} img-wrap`}>
                      <Image
                        priority
                        src={require("/public/img/mypage/dog_info_delete.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="카드 이미지"
                      />
                    </div>
                  </div>

                  <div className={Styles.flex_box4}>
                    <div>
                      프로필사진 편집 
                    </div>
                    <div className={Styles.line}>

                    </div>
                    <div>
                      대표견 설정
                    </div>
                  </div>
                  
                  {/* 설문결과 설문수정 결제하기 버튼3개 */}
                  <div className={Styles.flex_box6}>
                    <div className={Styles.left_btn}>
                      설문결과
                    </div>
                    <div className={Styles.right_btn}>
                      설문수정
                    </div>
                    <div className={Styles.btn}>
                      결제하기
                    </div>
                  </div>
                </div>
              </div>
            </section>
            

          </MypageWrapper>
        </Wrapper>


      </Layout>
    </>
  );
}

export default Mypage;