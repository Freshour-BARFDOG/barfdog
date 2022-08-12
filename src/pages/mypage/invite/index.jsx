import React, { useEffect, useState } from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import s from './invite.module.scss';
import filter_emptyValue from '/util/func/filter_emptyValue';
import Spinner from '/src/components/atoms/Spinner';
import { getData, putObjData } from '/src/pages/api/reqData';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import { EmptyContMessage } from '/src/components/atoms/emptyContMessage';
import transformDate from '/util/func/transformDate';
import { rewardStatusType } from '/store/TYPE/rewardStatusType';

const DUMMY_DATA = {
  data: {
    recommend: '2BoaXmwIA',
    joinedCount: 24,
    orderedCount: 13,
    totalRewards: 39000,
    pagedModel: {
      _embedded: {
        queryRewardsDtoList: [
          {
            createdTime: '2022-07-22T09:57:05.945',
            name: '초대 적립금10',
            rewardStatus: 'USED',
            tradeReward: 3000,
          },
          {
            createdTime: '2022-07-22T09:57:05.945',
            name: '초대 적립금6',
            rewardStatus: 'SAVED',
            tradeReward: 7000,
          },
          {
            createdTime: '2022-07-22T09:57:05.945',
            name: '초대 적립금3',
            rewardStatus: 'SAVED',
            tradeReward: 3000,
          },
        ],
      },
      _links: {
        first: {
          href: 'http://localhost:8080/api/rewards/invite?page=0&size=5',
        },
        prev: {
          href: 'http://localhost:8080/api/rewards/invite?page=0&size=5',
        },
        self: {
          href: 'http://localhost:8080/api/rewards/invite?page=1&size=5',
        },
        next: {
          href: 'http://localhost:8080/api/rewards/invite?page=2&size=5',
        },
        last: {
          href: 'http://localhost:8080/api/rewards/invite?page=2&size=5',
        },
      },
      page: {
        size: 5,
        totalElements: 13,
        totalPages: 3,
        number: 1,
      },
    },
    _links: {
      recommend_friend: {
        href: 'http://localhost:8080/api/rewards/recommend',
      },
      profile: {
        href: '/docs/index.html#resources-query-rewards-invite',
      },
    },
  },
};

export default function InvitePage() {
  const searchApiUrl = '/api/rewards/invite'; // 친구추천 적립금 내역 조회
  const searchPageSize = 10;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [recommendCode, setRecommendCode] = useState(''); // 친구 추천 코드
  const [recommendInfo, setRecommendInfo] = useState({
    recommend: null, // 과거에 추천한 내역 (없으면 null // 있으면 , 해당 추천코드)
    joinedCount: null, // 본인의 추천코드로 친구가 가입한 수
    orderedCount: null, // 본인의 추천코드로 친구가 주문한 수
    totalRewards: null,
  });
  
  // console.log(itemList);

  const pageInterCeptor = async (res) => { // SERVER pagination query가 변경되엇을 경우 사용하는 FUNC
    // res = DUMMY_DATA; // ! TEST
    
    const recommendData = {
      recommend: res.data.recommend,
      joinedCount: res.data.joinedCount, // 본인의 추천코드로 친구가 가입한 수
      orderedCount: res.data.orderedCount, // 본인의 추천코드로 친구가 주문한 수
      totalRewards: res.data.totalRewards, // 그로 인한 총 적립 포인트
    };
    console.log(recommendData)
    setRecommendInfo(recommendData);
    const pageData = res.data?.pagedModel?.page;
    let newItemList = res.data?.pagedModel?._embedded?.queryRewardsDtoList || [];
    if(!newItemList.length){
      newItemList = await getAllRewardList();
    }
    const newPageInfo = {
      totalPages: pageData.totalPages,
      size: pageData.size,
      totalItems: pageData.totalElements,
      currentPageIndex: pageData.number,
      newPageNumber: pageData.number + 1,
      newItemList: newItemList || [],
    };
    return newPageInfo;
  };
  
  const getAllRewardList = async ()=>{
    let newItemList = [];
    setIsLoading((prevState) => ({
      ...prevState,
      fetching: true,
    }));
    try {
      const url = `/api/rewards`;
      const res = await getData(url);
      console.log(res);
      newItemList = res.data?.pagedModel?._embedded?.queryRewardsDtoList?.filter(item=>item.name.indexOf('[친구추천]') >= 0);
    } catch (err) {
        console.error(err)
    }
    setIsLoading((prevState) => ({
      ...prevState,
      fetching: false,
    }));
    
    return newItemList;
  }

  const onInputChangeHandler = (e) => {
    const input = e.currentTarget;
    const { value } = input;
    const filteredValue = filter_emptyValue(value);

    setRecommendCode(filteredValue);
  };

  const registerRecommendCodeHandler = () => {
    // 친구추천코드 등록
    if (!recommendCode) {
      return alert('친구추천코드를 입력해주세요.');
    }

    (async () => {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      try {
        const url = `/api/rewards/recommend`;
        const body = {
          recommendCode: recommendCode,
        };
        const res = await putObjData(url, body);
        if (res.isDone) {
          alert('친구추천코드가 등록되었습니다.');
          window.location.reload();
        } else {
          alert('추천코드가 정확하지 않습니다.');
        }
        console.log(res);
      } catch (err) {
        console.error(err);
      }
      setIsLoading((prevState) => ({
        ...prevState,
        submit: false,
      }));
    })();
  };
  
  console.log(itemList)

  return (
    <>
      <MetaTitle title="마이페이지 친구초대" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={s.title}>
              <p>친구초대</p>
              <p style={{fontSize:'13px'}}>(*****친구추천을 한적이 있고, 본아이디가 결제를 한 경우, 추천친구에게 적립금 적용여부 확인필요)</p>
              {isLoading.fetching && <Spinner />}
            </section>

            <section className={s.text}>
              <div>
                친구가 내 추천코드로 가입하면 <span>친구에게 3000 포인트,</span>
                <br />
                친구가 첫 주문하면 <span>나한테도 3,000 포인트</span> 선물을 드립니다!
                <br/>
                <em style={{fontSize:'12px'}}>( 추천코드는 계정 당 1회 입력할 수 있습니다. )</em>
              </div>
            </section>

            <section className={s.referral_code}>
              <div className={s.referral_code_row1}>추천코드</div>

              <div className={s.grid_box}>
                {recommendInfo.recommend ? <span className={s.fake_input}>{recommendInfo.recommend}</span> : (
                  <input
                    className={s.input_box}
                    type="text"
                    placeholder={recommendInfo.recommend || '친구의 추천코드를 입력해보세요.'}
                    onChange={onInputChangeHandler}
                    value={recommendCode}
                    disabled={recommendInfo.recommend}
                  />
                )}
                <button
                  type={'button'}
                  className={`${s.btn} ${recommendInfo.recommend ? 'disabled' : ''}`}
                  onClick={registerRecommendCodeHandler}
                  disabled={recommendInfo.recommend}
                >
                  {recommendInfo.recommend ? (
                    '등록됨'
                  ) : isLoading.submit ? (
                    <Spinner style={{ color: '#fff' }} />
                  ) : (
                    '등록'
                  )}
                </button>
              </div>
            </section>

            <section className={s.count_box}>
              <div className={s.mid}>
                <div className={s.count_grid_box}>
                  <div className={s.count_flex_box}>
                    <div className={s.left_box}>
                      <p>가입한 친구</p>
                      <div className={s.count_text}>
                        {transformLocalCurrency(recommendInfo.joinedCount)}
                      </div>
                    </div>

                    <div className={s.mid_box}>
                      <p>주문한 친구</p>
                      <div className={s.count_text}>
                        {transformLocalCurrency(recommendInfo.orderedCount)}
                      </div>
                    </div>
                  </div>

                  <div className={s.mid_box}>
                    <p>총 적립 포인트</p>
                    <div className={s.count_text}>
                      {transformLocalCurrency(recommendInfo.totalRewards)}
                      <span>&nbsp;P</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className={s.line}>
              <hr></hr>
            </section>
            <section className={s.content}>
              {isLoading.fetching ? (
                <Spinner />
              ) : itemList?.length === 0 ? (
                <EmptyContMessage message={'친구초대 적립내역이 없습니다.'} />
              ) : (
                <ul className={s.coupon_content_grid_box}>
                  {itemList?.map((item, index) => (
                    <li key={`invite-item-${index}`} className={s.grid_box}>
                      <div className={s.flex_box}>
                        <div className={s.day_text}>{transformDate(item.createdTime)}</div>
                        <div className={s.content_text}>{item.name}</div>
                      </div>
                      <div
                        className={`${
                          item.rewardStatus === rewardStatusType.SAVED
                            ? s.price_text
                            : s.price_text_grey
                        }`}
                      >
                        {item.rewardStatus === rewardStatusType.SAVED ? '+' : '-'}
                        {transformLocalCurrency(item.tradeReward)}원
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <div className={s.pagination_box}>
              <PaginationWithAPI
                apiURL={searchApiUrl}
                size={searchPageSize}
                setItemList={setItemList}
                // queryItemList={apiDataQueryString}
                setIsLoading={setIsLoading}
                pageInterceptor={pageInterCeptor}
              />
            </div>
          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}
