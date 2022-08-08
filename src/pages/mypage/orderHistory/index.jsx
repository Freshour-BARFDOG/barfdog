import React, { useState } from 'react';
import s from './orderHistory.module.scss';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import Pagination from '@src/components/atoms/Pagination';
import MetaTitle from '/src/components/atoms/MetaTitle';
import TabContentContainer, {
  LeftContainer,
  RightContainer,
} from '/src/components/atoms/TabContentContainer';
import Tabmenu_TwoButton from '/src/components/atoms/Tabmenu_TwoButton';
import Image from 'next/image';
import Link from 'next/link';
import { EmptyContMessage } from '/src/components/atoms/emptyContMessage';

export default function OrderHistoryPage() {
  const [activeMenu, setActiveMenu] = useState('left');

  return (
    <>
      <MetaTitle title="마이페이지 주문내역" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={s.title}>주문내역</section>
            <Tabmenu_TwoButton
              leftMenuName={'정기구독'}
              rightMenuName={'일반상품'}
              getPositionHandler={setActiveMenu}
            />
            <TabContentContainer>
              <LeftContainer activeMenu={activeMenu}>
                <section className={s.content}>
                  {true && (
                    <EmptyContMessage
                      message={'구독 중인 상품이 없습니다.'}
                      options={{ button: { url: '/surveyGuide', label: '정기구독 시작하기' } }}
                    />
                  )}
                  {true && <SubscribeItemList />}
                </section>
              </LeftContainer>
              <RightContainer activeMenu={activeMenu}>
                <section className={s.content}>
                  {true && (
                    <EmptyContMessage
                      message={'주문한 상품내역이 없습니다.'}
                      options={{ button: { url: '/shop?itemType=ALL', label: '숍 시작하기' } }}
                    />
                  )}
                  {true && <SingleItemList />}
                </section>
              </RightContainer>
            </TabContentContainer>
          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}





const SubscribeItemList = () => {
  return (
    <div className={s['subscribeItem-container']}>
      {/* Styles["subscribeItem-container" 는 여러개X Styles.day부터 개체 복사 */}
      <div className={s.day}>2022.02.14</div>
      
      <hr className={s.hr1} />
      
      <div className={s.content_body}>
        <div className={s.left_box}>
          <div className={`${s.image} img-wrap`}>
            <Image
              priority
              src={require('public/img/mypage/order_history/subscribe_order_detail_1.png')}
              objectFit="cover"
              layout="fill"
              alt="카드 이미지"
            />
          </div>
          
          <div className={s.flex_box}>
            <div className={s.text}>
              <p>시호</p>
              <div className={s.line_box}>
                <hr />
              </div>
              <div className={s.last_text}>믹스레시피 (8회차)</div>
            </div>
            
            <div className={s.text2}>
              <div>주문번호</div>
              <div>10000826742324</div>
              <div>결제금액</div>
              <div>84,000원</div>
            </div>
          </div>
        </div>
        
        <div className={s.mid_box}>배송중</div>
        
        <div className={s.right_box}>
          <Link href="/mypage/orderHistory/subscribe/1" passHref>
            <a className={s.btn}>주문상세 </a>
          </Link>
          <a className={s.btn2}>구독관리</a>
        </div>
      </div>
      <div className={s.day}>2022.02.14</div>
      
      <hr className={s.hr1} />
      
      <div className={s.content_body}>
        <div className={s.left_box}>
          <div className={`${s.image} img-wrap`}>
            <Image
              priority
              src={require('public/img/mypage/order_history/subscribe_order_detail_1.png')}
              objectFit="cover"
              layout="fill"
              alt="카드 이미지"
            />
          </div>
          
          <div className={s.flex_box}>
            <div className={s.text}>
              <p>시호</p>
              <div className={s.line_box}>
                <hr />
              </div>
              <div className={s.last_text}>믹스레시피 (8회차)</div>
            </div>
            
            <div className={s.text2}>
              <div>주문번호</div>
              <div>10000826742324</div>
              <div>결제금액</div>
              <div>84,000원</div>
            </div>
          </div>
        </div>
        
        <div className={s.mid_box}>배송중</div>
        
        <div className={s.right_box}>
          <Link href="/mypage/orderHistory/subscribe/1" passHref>
            <a className={s.btn}>주문상세 </a>
          </Link>
          <a className={s.btn2}>구독관리</a>
        </div>
      </div>
      <div className={s.day}>2022.02.14</div>
      
      <hr className={s.hr1} />
      
      <div className={s.content_body}>
        <div className={s.left_box}>
          <div className={`${s.image} img-wrap`}>
            <Image
              priority
              src={require('public/img/mypage/order_history/subscribe_order_detail_1.png')}
              objectFit="cover"
              layout="fill"
              alt="카드 이미지"
            />
          </div>
          
          <div className={s.flex_box}>
            <div className={s.text}>
              <p>시호</p>
              <div className={s.line_box}>
                <hr />
              </div>
              <div className={s.last_text}>믹스레시피 (8회차)</div>
            </div>
            
            <div className={s.text2}>
              <div>주문번호</div>
              <div>10000826742324</div>
              <div>결제금액</div>
              <div>84,000원</div>
            </div>
          </div>
        </div>
        
        <div className={s.mid_box}>배송중</div>
        
        <div className={s.right_box}>
          <Link href="/mypage/orderHistory/subscribe/1" passHref>
            <a className={s.btn}>주문상세 </a>
          </Link>
          <a className={s.btn2}>구독관리</a>
        </div>
      </div>
      
      <hr className={s.hr2} />
      
      <div className={s.pagination_box}>
        <Pagination itemCountPerGroup={5} itemTotalCount={100} />
      </div>
    </div>
  );
};

const SingleItemList = () => {
  return (
    <div className={s['subscribeItem-container']}>
      <div className={s.day}>2022.02.14</div>
      
      <hr className={s.hr1} />
      
      <div className={s['item-container']}>
        <div className={s.left_box}>
          <div className={`${s.image} img-wrap`}>
            <Image
              priority
              src={require('public/img/mypage/order_history/subscribe_sample_1.png')}
              objectFit="cover"
              layout="fill"
              alt="카드 이미지"
            />
          </div>
          
          <div className={s.flex_box}>
            <div className={s.text}>
              <div className={s.last_text}>바프레드 외 8건</div>
            </div>
            
            <div className={s.text2}>
              <div>주문번호</div>
              <div>10000826742324</div>
              <div>결제금액</div>
              <div>84,000원</div>
            </div>
          </div>
        </div>
        
        <div className={s.mid_box}>배송중</div>
        
        <div className={s.right_box}>
          <Link href="/mypage/orderHistory/single/1" passHref>
            <a className={s.btn}>주문상세</a>
          </Link>
        </div>
      </div>
      
      <div className={s.day}>2022.02.14</div>
      
      <hr className={s.hr1} />
      
      <div className={s['item-container']}>
        <div className={s.left_box}>
          <div className={`${s.image} img-wrap`}>
            <Image
              priority
              src={require('public/img/mypage/order_history/subscribe_sample_1.png')}
              objectFit="cover"
              layout="fill"
              alt="카드 이미지"
            />
          </div>
          
          <div className={s.flex_box}>
            <div className={s.text}>
              <div className={s.last_text}>바프레드 외 8건</div>
            </div>
            
            <div className={s.text2}>
              <div>주문번호</div>
              <div>10000826742324</div>
              <div>결제금액</div>
              <div>84,000원</div>
            </div>
          </div>
        </div>
        
        <div className={s.mid_box}>배송중</div>
        
        <div className={s.right_box}>
          <Link href="/mypage/orderHistory/single/1" passHref>
            <a className={s.btn}>주문상세</a>
          </Link>
        </div>
      </div>
      
      <hr className={s.hr2} />
      
      <div className={s.pagination_box}>
        <Pagination itemCountPerGroup={5} itemTotalCount={100} />
      </div>
    </div>
  );
};


