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



export default function RewardPage() {
  const searchApiUrl = '/api/rewards';
  const searchPageSize = 10;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [totalReward, setTotalReward] = useState( 0); // // ! 문제 있는 값임 // 수정 후 , 사용할 것
   // console.log(totalReward)
  
  
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
  
  // console.log(itemList);
  // const availableItems = itemList?.filter(item=>item.rewardStatus === rewardStatusType.SAVED).map(item=>item.tradeReward);
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
                    {/* 적립금 => 직접계산 */}
                    {/*<span>{transformLocalCurrency(availableItems.length > 0 ? availableItems.reduce((acc, cur)=>acc+cur) : 0)}원</span>*/}
                    {/*적립금 => 서버에서 받은 값 (적립금 발행 후에도, 변하지 않음 22.07.29)*/}
                    <span>{transformLocalCurrency(totalReward)}원</span>
                  </div>
                  {/* 소멸예정 적립금 : 삭제됨(3월 2주 문서)*/}
                  {/*<div className={s.mid_box}>*/}
                  {/*  <hr className={s.line} />*/}
                  {/*</div>*/}
                  {/*<div className={s.right_box}>*/}
                  {/*  소멸 예정 적립금*/}
                  {/*  <span>0 원</span>*/}
                  {/*</div>*/}
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
                            {item.name}
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

