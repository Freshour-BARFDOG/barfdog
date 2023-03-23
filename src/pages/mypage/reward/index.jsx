import React, {useState} from "react";
import s from "./reward.module.scss";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MypageWrapper from "/src/components/mypage/MypageWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import PaginationWithAPI from "/src/components/atoms/PaginationWithAPI";
import Spinner from "/src/components/atoms/Spinner";
import {EmptyContMessage} from "/src/components/atoms/emptyContMessage";
import transformDate from "/util/func/transformDate";
import transformLocalCurrency from "/util/func/transformLocalCurrency";
import {rewardStatusType} from "/store/TYPE/rewardStatusType";
import {filter_userIndexOnRewardName} from "/util/func/filter_userIndexOnRewardName";



export default function RewardPage() {
  const searchApiUrl = '/api/rewards';
  const searchPageSize = 10;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [totalReward, setTotalReward] = useState( 0);
  
  
  const pageInterCeptor = (res) => {// SERVER pagination query가 변경되었을 경우 사용하는 function
    // console.log(res)
    setTotalReward(res.data.reward); // 서버에서 이미 rewardStatus.SAVED 값만 계산해서 나온 값 ==> 그대로 사용하면 됨
    const newItemList = res.data.pagedModel._embedded.queryRewardsDtoList || [];
    console.log(newItemList)
    const pageData = res.data.pagedModel.page;
    let newPageInfo = {
      totalPages: pageData.totalPages,
      size: pageData.size,
      totalItems: pageData.totalElements,
      currentPageIndex: pageData.number,
      newPageNumber: pageData.number + 1,
      newItemList,
    };
    return newPageInfo;
  };
  
  return (
    <>
      <MetaTitle title="마이페이지 적립금" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={s.title}>
              적립금 조회
            </section>
            <section className={s.reward_state}>
              <div className={s.box}>
                <div className={s.flex_box}>
                  <div className={s.left_box}>
                    사용 가능 적립금
                    <span>{transformLocalCurrency(totalReward)}원</span>
                  </div>
                </div>
              </div>
            </section>

            <section className={s.content}>
              {isLoading.fetching ? (
                <Spinner />
              ) : itemList.length === 0 ? (
                <EmptyContMessage message={'적립금 히스토리가 없습니다.'} />
              ) : (
                <ul className={s.coupon_content_grid_box}>
                  {itemList.map((item, index) => (
                      <li key={`item-list-${index}`} className={s.flex_box}>
                        <div className={s.grid_box}>
                          <div className={s.day_text}>
                            {transformDate(item.createdTime)}
                          </div>
                          <div className={s.content_text}>
                            {filter_userIndexOnRewardName(item.name)}
                          </div>
                        </div>
                        <div className={`${item.rewardStatus === rewardStatusType.SAVED ? s.price_text : s.price_text_grey}`}>
                          {item.rewardStatus === rewardStatusType.SAVED ? '+' : '-'}{transformLocalCurrency(item.tradeReward)}원
                        </div>
                      </li>
                    ))}
                </ul>
              )}
            </section>
  
            <section className={s.pagination_box}>
              <PaginationWithAPI
                apiURL={searchApiUrl}
                size={searchPageSize}
                setItemList={setItemList}
                // queryItemList={apiDataQueryString}
                setIsLoading={setIsLoading}
                pageInterceptor={pageInterCeptor}
              />
            </section>
          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}
