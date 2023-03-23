import React, {useState} from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import s from './invite.module.scss';
import filter_emptyValue from '/util/func/filter_emptyValue';
import Spinner from '/src/components/atoms/Spinner';
import {getData, putObjData} from '/src/pages/api/reqData';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import {EmptyContMessage} from '/src/components/atoms/emptyContMessage';
import transformDate from '/util/func/transformDate';
import {rewardStatusType} from '/store/TYPE/rewardStatusType';
import Modal_global_alert from "/src/components/modal/Modal_global_alert";
import {useModalContext} from "/store/modal-context";

import modal_s from '/src/components/modal/modal.module.scss';
import {IoMdLink, IoMdMail} from 'react-icons/io';
import Modal_sendPhoneMessage from '/src/components/modal/Modal_sendPhoneMessage';
import {useSelector} from 'react-redux';
import useDeviceState from '/util/hook/useDeviceState';
import Modal_alert from '/src/components/modal/Modal_alert';
import {filter_userIndexOnRewardName} from "/util/func/filter_userIndexOnRewardName";


export default function InvitePage() {
  const searchApiUrl = '/api/rewards/invite'; // 친구추천 적립금 내역 조회
  const searchPageSize = 10;
  
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [recommendCode, setRecommendCode] = useState(''); // 친구 추천 코드
  const [recommendInfo, setRecommendInfo] = useState({
    recommend: null, // 과거에 추천한 내역 (없으면 null // 있으면 , 해당 추천코드)
    joinedCount: null, // 본인의 추천코드로 친구가 가입한 수
    orderedCount: null, // 본인의 추천코드로 친구가 주문한 수
    totalRewards: null,
  });

  const isMobile = useDeviceState().isMobile;
  const auth = useSelector((s) => s.auth);
  const data = auth.userInfo;
  
  const [modalMessage, setModalMessage] = useState({});
  const [activeModal, setActiveModal] = useState({
    alert: false,
    message: false,
  });
  
  
  // console.log(itemList);

  const pageInterCeptor = async (res) => {
    // res = DUMMY_DATA; // ! TEST
    console.log(res);
    let newPageInfo = {
      totalPages: 1,
      size: searchPageSize,
      totalItems: 0,
      currentPageIndex: 0,
      newPageNumber: 1,
      newItemList: [],
    }
    
    if ( res.data ) {
      const data = res.data;
      const recommendData = {
        recommend: data.recommend,
        joinedCount: data.joinedCount, // 본인의 추천코드로 친구가 가입한 수
        orderedCount: data.orderedCount, // 본인의 추천코드로 친구가 주문한 수
        totalRewards: data.totalRewards, // 그로 인한 총 적립 포인트
      };
      // console.log(recommendData)
      setRecommendInfo(recommendData);
      const pageData = data.pagedModel?.page;
      let newItemList = data.pagedModel?._embedded?.queryRewardsDtoList || [];
      console.log("newItemList: ",newItemList);
      if(!newItemList.length){
        newItemList = await getAllRewardList();
      }
      newPageInfo = {
        totalPages: pageData.totalPages,
        size: pageData.size,
        totalItems: pageData.totalElements,
        currentPageIndex: pageData.number,
        newPageNumber: pageData.number + 1,
        newItemList: newItemList || [],
      };
    }
    
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
      console.log();
    } catch (err) {
        console.error(err)
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    }
    
    
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
      return mct.alertShow('친구추천코드를 입력해주세요.');
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
        } else if (res.status === 400) {
          mct.alertShow('본인코드는 입력할 수 없습니다.')
        } else {
          mct.alertShow('추천코드가 정확하지 않습니다.');
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
  

  const onCopyToClipboard = (value) => {
    let hostname;
    if (typeof window !== 'undefined') {
      hostname = window.location.hostname;
    }
    const copiedValue = value || hostname;
    const tempElem = document.createElement('textarea');
    tempElem.value = copiedValue;
    tempElem.setAttribute('readonly', '');
    tempElem.style.position = 'absolute';
    tempElem.style.left = '-9999px';
    document.body.append(tempElem);
    tempElem.select();
    const returnValue = document.execCommand('copy');
    if (!returnValue) {
      throw new Error('copied nothing');
    }
    document.body.removeChild(tempElem);
    setActiveModal((prev) => ({
      ...prev,
      alert: true,
    }));
    setModalMessage((prevState) => ({
      ...prevState,
      alert: `클립보드에 추천코드가 복사되었습니다. \n추천코드: ${copiedValue}`,
    }));
  };

  const onCopyUserRecommendCode = () => {
    const userRecommendCode = data.recommendCode;
    onCopyToClipboard(userRecommendCode);
  };

  const onShowSendMessageModal = () => {
    setActiveModal((prev) => ({
      ...prev,
      message: true,
    }));
  };

  const onHideGlobalAlert = () => {
    setActiveModal((prev) => ({
      ...prev,
      alert: false,
    }));
    setModalMessage((prev) => ({
      ...prev,
      message: '',
    }));
  };


  return (
    <>
      <MetaTitle title="마이페이지 친구초대" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={s.title}>
              <p>친구초대</p>
              {isLoading.fetching && <Spinner />}
            </section>
            {isMobile &&
            <div className={`${s.info_row} ${s.user_recommand}`}>
              <div className={`${s.recommand_code} ${s.info_col} flex-wrap`}>
                <span>나의 추천코드</span>
                <span className={s.code}>{data.recommendCode}</span>
              </div>
              <div className={`${s.sendMessage} ${s.info_col} flex-wrap`}>
                <button type="button" onClick={onShowSendMessageModal}>
                  <IoMdMail />
                  문자보내기
                </button>
              </div>
              <div className={`${s.copyLink} ${s.info_col} flex-wrap`}>
                <button type="button" onClick={onCopyUserRecommendCode}>
                  <IoMdLink />
                  코드복사
                </button>
              </div>
            </div>
            }

            <section className={s.text}>
              <div>
                친구가 내 추천코드로 가입하면 <span>친구와 나에게 3000 포인트,</span>
                <br />
                친구가 첫 주문하면 <span>친구와 나에게 3,000 포인트</span>를 드립니다!
                <br/>
                <em>( 추천코드는 계정 당 1회 입력할 수 있습니다. )</em>
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
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className={s.line}>
              <hr></hr>
            </section>
            <section className={s.content}>
              {isLoading.fetching
                ? <Spinner />
                : itemList.length === 0
                ? <EmptyContMessage message={'친구초대 적립내역이 없습니다.'} />
                : <ul className={s.coupon_content_grid_box}>
                  {itemList.map((item, index) => (
                    <li key={`invite-item-${index}`} className={s.grid_box}>
                      <div className={s.flex_box}>
                        <div className={s.day_text}>{transformDate(item.createdTime)}</div>
                        <div className={s.content_text}>{filter_userIndexOnRewardName(item.name)}</div>
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
                </ul>}
            </section>

            <div className={s.pagination_box}>
              <PaginationWithAPI
                apiURL={searchApiUrl}
                size={searchPageSize}
                setItemList={setItemList}
                setIsLoading={setIsLoading}
                pageInterceptor={pageInterCeptor}
              />
            </div>
          </MypageWrapper>
        </Wrapper>
      </Layout>
      {hasAlert && <Modal_global_alert background />}

      
      {activeModal.message && (
        <Modal_sendPhoneMessage
          id={'message'}
          setModalState={setActiveModal}
          data={data}
        />
      )}
      {activeModal.alert && (
        <Modal_alert
          onClick={onHideGlobalAlert}
          text={modalMessage.alert}
          className={modal_s['on-dashboard']}
        />
      )}
    </>
  );
}



//
// const DUMMY_DATA = {
//   data: {
//     recommend: '2BoaXmwIA',
//     joinedCount: 24,
//     orderedCount: 13,
//     totalRewards: 39000,
//     pagedModel: {
//       _embedded: {
//         queryRewardsDtoList: [
//           {
//             createdTime: '2022-07-22T09:57:05.945',
//             name: '초대 적립금10',
//             rewardStatus: 'USED',
//             tradeReward: 3000,
//           },
//           {
//             createdTime: '2022-07-22T09:57:05.945',
//             name: '초대 적립금6',
//             rewardStatus: 'SAVED',
//             tradeReward: 7000,
//           },
//           {
//             createdTime: '2022-07-22T09:57:05.945',
//             name: '초대 적립금3',
//             rewardStatus: 'SAVED',
//             tradeReward: 3000,
//           },
//         ],
//       },
//       _links: {
//         first: {
//           href: 'http://localhost:8080/api/rewards/invite?page=0&size=5',
//         },
//         prev: {
//           href: 'http://localhost:8080/api/rewards/invite?page=0&size=5',
//         },
//         self: {
//           href: 'http://localhost:8080/api/rewards/invite?page=1&size=5',
//         },
//         next: {
//           href: 'http://localhost:8080/api/rewards/invite?page=2&size=5',
//         },
//         last: {
//           href: 'http://localhost:8080/api/rewards/invite?page=2&size=5',
//         },
//       },
//       page: {
//         size: 5,
//         totalElements: 13,
//         totalPages: 3,
//         number: 1,
//       },
//     },
//     _links: {
//       recommend_friend: {
//         href: 'http://localhost:8080/api/rewards/recommend',
//       },
//       profile: {
//         href: '/docs/index.html#resources-query-rewards-invite',
//       },
//     },
//   },
// };
