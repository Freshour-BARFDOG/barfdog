import React, { useEffect, useState } from 'react';
import s from './dogs.module.scss';
import { dogGenderType } from '/store/TYPE/dogGenderType';
import { subscribeStatus } from '/store/TYPE/subscribeStatus';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Image from 'next/image';
import Link from 'next/link';
import { Modal_uploadDogProfileImage } from '/src/components/modal/Modal_uploadDogProfileImage';
import {
  deleteObjData,
  getData,
  getDataSSR,
  putObjData,
} from '/src/pages/api/reqData';
import { EmptyContMessage } from '/src/components/atoms/emptyContMessage';
import { calcDogAge } from '/util/func/calcDogAge';
import Spinner from '/src/components/atoms/Spinner';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import { useModalContext } from '/store/modal-context';
import { useRouter } from 'next/router';

import { orderStatus } from '/store/TYPE/orderStatusTYPE';
import DeleteIcon from '/public/img/mypage/dog_info_delete.svg';
import { SubscribeStatusTag } from '../../components/subscribe/SubscribeStatusTag';
import Dashboard from '../../components/mypage/Dashboard';
import MypageBanner from '../../components/atoms/MypageBanner';
import BottomMenu from '../../components/mypage/BottomMenu';
import Modal_confirm from '/src/components/modal/Modal_confirm';

// import { SubscribeStatusTag } from '../../../components/subscribe/SubscribeStatusTag';
// import { postData } from '../../api/reqData';

export default function MypageDogInfoPage({ data }) {
  // console.log(data);
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const [selectedItemData, setSelectedItemData] = useState(null);
  const [itemList, setItemList] = useState(data);
  const [activeUploadDogProfileModal, setActiveUploadDogProfileModal] =
    useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [activeConfirmModal, setActiveConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState({}); // obj

  useEffect(() => {
    // 반려견 등록 후 , 해당 페이지 최초 접근 시, 모달메시지 나타나는 버그에 대한 일시적인 해결
    mct.alertHide();
  }, []);

  const onUploadImageModalHandler = (selectedItemData) => {
    setSelectedItemData(selectedItemData);
    onActiveModal();
  };

  const onShowModalHandler = (message) => {
    if (message) mct.alertShow();
    setModalMessage(message);
  };

  const onActiveModal = () => {
    setActiveUploadDogProfileModal(true);
  };

  const onHideModalHandler = () => {
    mct.alertHide();
    setActiveUploadDogProfileModal(false);
  };

  const onSetRepresentative = (confirm, data) => {
    if (!confirm) {
      setActiveConfirmModal(false);
      onShowModalHandler('취소되었습니다.');
      return;
    }

    const apiUrl = `/api/dogs/${data.id}/representative`;
    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          rep: true,
        }));
        const res = await putObjData(apiUrl, {
          id: data.id,
        });

        let resultMessage;
        if (res.isDone) {
          resultMessage = `선택하신 반려견(${data.name})으로\n대표견 설정되었습니다.`;
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else if (res.status === 401) {
          resultMessage = `토큰이 만료되었습니다. 로그인 페이지로 이동합니다.`;
          setTimeout(() => {
            router.push('/account/login');
            mct.alertHide();
          }, 2000);
        } else {
          resultMessage = `대표견 설정에 실패하였습니다.`;
        }

        onShowModalHandler(resultMessage);
        setActiveConfirmModal(false);
        // console.log(res);
      } catch (err) {
        console.error(err);
      }
      setIsLoading((prevState) => ({
        ...prevState,
        rep: false,
      }));
    })();
  };

  const onActiveConfirmModal = (e, data) => {
    const btn = e.currentTarget;
    const btnType = btn.dataset.buttonType;
    setActiveConfirmModal({ [btnType]: true, data });
  };

  const onDeleteItem = async (confirm, data) => {
    if (!confirm) {
      setActiveConfirmModal(false);
      return onShowModalHandler('취소되었습니다.');
    }

    // const subscribeStatus = data.subscribeStatus;
    // if (subscribeStatus == orderStatus.BEFORE_PAYMENT) {
    //   onShowModalHandler('구독 중인 반려견은 삭제할 수 없습니다.');
    //   setActiveConfirmModal(false);
    //   return;
    // }

    const isRepDog = data.representative;
    if (isRepDog) {
      onShowModalHandler('대표 반려견은 삭제할 수 없습니다.');
      setActiveConfirmModal(false);
      return;
    }

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        rep: true,
      }));
      const apiUrl = `/api/dogs/${data.id}`;
      const res = await deleteObjData(apiUrl);
      // console.log(res);
      if (res.isDone) {
        onShowModalHandler('선택하신 반려견이 삭제되었습니다.');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else if (res.status === 400) {
        onShowModalHandler('대표 반려견은 삭제할 수 없습니다.');
      } else if (res.status === 404) {
        onShowModalHandler('삭제할 반려견 정보가 존재하지 않습니다.');
      } else {
        onShowModalHandler('강아지를 삭제하는데 실패하였습니다.');
      }
      setActiveConfirmModal(false);
    } catch (err) {
      console.error(err);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      rep: false,
    }));
  };

  // console.log('itemList___', itemList);

  return (
    <>
      <MetaTitle title="마이페이지 반려견정보" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            {itemList && (
              <Dashboard
                className={s.dashboard}
                itemList={itemList}
                onUploadImageModalHandler={onUploadImageModalHandler}
                onShowModalHandler={onShowModalHandler}
                onActiveConfirmModal={onActiveConfirmModal}
                setIsLoading={setIsLoading}
                isLoading={isLoading}
              />
            )}
            <MypageBanner />
            <BottomMenu />
          </MypageWrapper>
        </Wrapper>
      </Layout>
      {activeUploadDogProfileModal && (
        <Modal_uploadDogProfileImage
          data={selectedItemData}
          onActiveModal={setActiveUploadDogProfileModal}
          setItemList={setItemList}
          setModalMessage={setModalMessage}
        />
      )}
      {(activeConfirmModal.setRep || activeConfirmModal.deleteItem) && (
        <Modal_confirm
          text={
            activeConfirmModal.setRep
              ? ' 대표견으로 설정하시겠습니까?'
              : `반려견(${activeConfirmModal.data.name})을 삭제 하시겠습니까?`
          }
          isConfirm={
            activeConfirmModal.setRep
              ? (e) => onSetRepresentative(e, activeConfirmModal.data)
              : (e) => onDeleteItem(e, activeConfirmModal.data)
          }
          positionCenter
        />
      )}
      {hasAlert && (
        <Modal_global_alert
          message={modalMessage}
          onClick={onHideModalHandler}
          background
        />
      )}
    </>
  );
}

// const ItemList = ({ data, onEditImage, onShowModalHandler }) => {
//   // console.log(data)

//   const router = useRouter();
//   const mct = useModalContext();
//   const dogId = data.id;
//   let subscribeId = null; //  ! 값 확인하기
//   const dogAge = calcDogAge(data.birth);
//   const gender =
//     data.gender === dogGenderType.MALE
//       ? dogGenderType.KOR.MALE
//       : dogGenderType.KOR.FEMALE;

//   const [isLoading, setIsLoading] = useState({}); // obj

//   const onSetRepresentative = (confirm) => {
//     if (!confirm) {
//       setActiveConfirmModal(false);
//       onShowModalHandler('취소되었습니다.');
//       return;
//     }

//     const apiUrl = `/api/dogs/${dogId}/representative`;
//     (async () => {
//       try {
//         setIsLoading((prevState) => ({
//           ...prevState,
//           rep: true,
//         }));
//         const res = await putObjData(apiUrl, {
//           id: dogId,
//         });

//         let resultMessage;
//         if (res.isDone) {
//           resultMessage = `선택하신 반려견(${data.name})으로\n대표견 설정되었습니다.`;
//           setTimeout(() => {
//             window.location.reload();
//           }, 500);
//         } else if (res.status === 401) {
//           resultMessage = `토큰이 만료되었습니다. 로그인 페이지로 이동합니다.`;
//           setTimeout(() => {
//             router.push('/account/login');
//             mct.alertHide();
//           }, 2000);
//         } else {
//           resultMessage = `대표견 설정에 실패하였습니다.`;
//         }

//         onShowModalHandler(resultMessage);
//         setActiveConfirmModal(false);
//         // console.log(res);
//       } catch (err) {
//         console.error(err);
//       }
//       setIsLoading((prevState) => ({
//         ...prevState,
//         rep: false,
//       }));
//     })();
//   };

//   const onActiveConfirmModal = (e) => {
//     const btn = e.currentTarget;
//     const btnType = btn.dataset.buttonType;
//     setActiveConfirmModal({ [btnType]: true });
//   };

//   const onEditProfileImage = () => {
//     onEditImage(data);
//   };

//   const onDeleteItem = async (confirm) => {
//     if (!confirm) {
//       setActiveConfirmModal(false);
//       return onShowModalHandler('취소되었습니다.');
//     }

//     // const subscribeStatus = data.subscribeStatus;
//     // if (subscribeStatus == orderStatus.BEFORE_PAYMENT) {
//     //   onShowModalHandler('구독 중인 반려견은 삭제할 수 없습니다.');
//     //   setActiveConfirmModal(false);
//     //   return;
//     // }

//     const isRepDog = data.representative;
//     if (isRepDog) {
//       onShowModalHandler('대표 반려견은 삭제할 수 없습니다.');
//       setActiveConfirmModal(false);
//       return;
//     }

//     try {
//       setIsLoading((prevState) => ({
//         ...prevState,
//         rep: true,
//       }));
//       const apiUrl = `/api/dogs/${dogId}`;
//       const res = await deleteObjData(apiUrl);
//       // console.log(res);
//       if (res.isDone) {
//         onShowModalHandler('선택하신 반려견이 삭제되었습니다.');
//         setTimeout(() => {
//           window.location.reload();
//         }, 500);
//       } else if (res.status === 400) {
//         onShowModalHandler('대표 반려견은 삭제할 수 없습니다.');
//       } else if (res.status === 404) {
//         onShowModalHandler('삭제할 반려견 정보가 존재하지 않습니다.');
//       } else {
//         onShowModalHandler('강아지를 삭제하는데 실패하였습니다.');
//       }
//       setActiveConfirmModal(false);
//     } catch (err) {
//       console.error(err);
//     }
//     setIsLoading((prevState) => ({
//       ...prevState,
//       rep: false,
//     }));
//   };

//   const nextPageHandler = (e) => {
//     const dogId = e.currentTarget.dataset.id;
//     const apiUrl = `api/orders/sheet/subscribe/dog/${dogId}`;

//     (async () => {
//       try {
//         setIsLoading((prevState) => ({
//           ...prevState,
//           [dogId]: true,
//         }));

//         const res = await getData(apiUrl);
//         subscribeId = res.data.subscribeDto.id;
//         // console.log('subscribeId', subscribeId);

//         if (subscribeId) {
//           router.push(`/order/ordersheet/subscribe/${subscribeId}`);
//         } else {
//           // console.error('there is no Subscribe ID', info.subscribeId);
//           alert('주문정보를 확인할 수 없습니다.');
//           window.location.href = '/';
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     })();
//   };

//   const moveToSubscribeShopHandler = (dogId) => {
//     router.push(`/order/subscribeShop?dogId=${dogId}`);
//   };

//   const onSuccessCallback = () => {
//     window.location.reload();
//   };

//   //* 구독 중단 취소 (재활성화)
//   const onReactiveHandler = async (subscribeId) => {
//     try {
//       setIsLoading((prevState) => ({
//         ...prevState,
//         reactive: true,
//       }));
//       const apiUrl = `/api/subscribes/${subscribeId}/reactive`;
//       const res = await postData(apiUrl);
//       console.log(res);
//       if (res.data) {
//         mct.alertShow(`재구독이 정상적으로 완료되었습니다.`, onSuccessCallback);
//       } else {
//         mct.alertShow('재구독에 실패하였습니다.');
//       }
//     } catch (err) {
//       mct.alertShow('서버 통신 장애 발생');
//       console.error(err);
//     } finally {
//       setIsLoading((prevState) => ({
//         ...prevState,
//         reactive: false,
//       }));
//     }
//   };

//   return (
//     <>
//       <li className={s['dogInfo-wrap']} data-id={dogId}>
//         <div className={s.left_box}>
//           <div className={`${s.image} ${data.pictureUrl ? s.hasImage : ''}`}>
//             {data.pictureUrl && (
//               <Image
//                 src={data.pictureUrl}
//                 objectFit="cover"
//                 layout="fill"
//                 alt={data.pictureName || '반려견 썸네일'}
//               />
//             )}
//           </div>
//         </div>
//         <div className={s.right_box}>
//           <div className={s['dog-info']}>
//             <div className={s.inner_flex}>
//               <h5 className={s.dog_name}>
//                 {data.name} ( {dogAge} / {gender} )
//               </h5>
//               <div className={s.tags}>
//                 <SubscribeStatusTag
//                   status={data.subscribeStatus}
//                   subscribeCount={data.subscribeCount}
//                 />
//                 {data.representative && (
//                   <i className={s.representative}>대표견</i>
//                 )}
//               </div>
//             </div>
//             {data.subscribeStatus !== subscribeStatus.SUBSCRIBING && (
//               <div
//                 className={`${s.image} img-wrap`}
//                 data-button-type={'deleteItem'}
//                 onClick={onActiveConfirmModal}
//               >
//                 <DeleteIcon width="100%" height="100%" viewBox="0 0 28 28" />
//               </div>
//             )}
//           </div>

//           <div className={s.controls}>
//             <button type={'button'} onClick={onEditProfileImage}>
//               프로필사진 편집
//             </button>
//             {!data.representative && (
//               <button
//                 type={'button'}
//                 data-button-type={'setRep'}
//                 onClick={onActiveConfirmModal}
//               >
//                 대표견 설정
//                 {isLoading.rep && <Spinner />}
//               </button>
//             )}
//           </div>
//           {/* 설문결과 설문수정 결제하기 버튼3개 */}
//         </div>
//         <div className={s.select_box}>
//           <div className={s['btn-section']}>
//             <Link href={`/mypage/dogs/${dogId}/statistic`} passHref>
//               <a>맞춤레포트 확인</a>
//             </Link>
//             <Link href={`/mypage/dogs/${dogId}/updateSurvey`} passHref>
//               <a>정보 수정</a>
//             </Link>
//             {/* 1. 설문 완료 */}
//             {/* '구독하기' 클릭 시, 맞춤레시피 페이지로 이동 */}
//             {data.subscribeStatus === subscribeStatus.SURVEY_COMPLETED && (
//               <Link href={`/order/subscribeShop?dogId=${dogId}`} passHref>
//                 <a
//                   className={s.payment}
//                   data-id={dogId}
//                   onClick={() => moveToSubscribeShopHandler(dogId)}
//                 >
//                   {isLoading[dogId] ? (
//                     <Spinner style={{ color: '#fff' }} />
//                   ) : (
//                     '맞춤식단 시작'
//                   )}
//                 </a>
//               </Link>
//             )}

//             {/* 2. "맞춤식단 시작"  버튼 생성 조건  */}
//             {/*  결제전(구독전)  */}
//             {data.subscribeStatus === subscribeStatus.BEFORE_PAYMENT && (
//               <button
//                 type={'button'}
//                 className={s.payment}
//                 data-id={dogId}
//                 onClick={nextPageHandler}
//               >
//                 {isLoading[dogId] ? (
//                   <Spinner style={{ color: '#fff' }} />
//                 ) : (
//                   '맞춤식단 시작'
//                 )}
//               </button>
//             )}

//             {/* 3. "재구독"  버튼 생성 조건  */}
//             {/* 3-1. 구독 보류 ('구독 중' 상태가 아닌) / 구독 취소 */}
//             {(data.subscribeStatus === subscribeStatus.SUBSCRIBE_PENDING ||
//               data.subscribeStatus === subscribeStatus.SUBSCRIBE_CANCEL) && (
//               <button
//                 type={'button'}
//                 className={s.payment}
//                 data-id={dogId}
//                 onClick={nextPageHandler}
//               >
//                 {isLoading[dogId] ? (
//                   <Spinner style={{ color: '#fff' }} />
//                 ) : (
//                   '재구독'
//                 )}
//               </button>
//             )}

//             {/* 3-2. 구독 취소 예정  */}
//             {data.subscribeStatus === subscribeStatus.SUBSCRIBE_WILL_CANCEL && (
//               <button
//                 type={'button'}
//                 className={s.payment}
//                 data-id={dogId}
//                 onClick={() => onReactiveHandler(data.subscribeId)}
//               >
//                 {isLoading[dogId] ? (
//                   <Spinner style={{ color: '#fff' }} />
//                 ) : (
//                   '재구독'
//                 )}
//               </button>
//             )}
//           </div>
//         </div>
//       </li>
//     </>
//   );
// };

export async function getServerSideProps({ req }) {
  const getApiUrl = '/api/dogs';
  const res = await getDataSSR(req, getApiUrl);

  // console.log(res.data);

  if (res?.status !== 200) {
    return {
      redirect: {
        permanent: false,
        destination: '/account/login?prevPath=/mypage/dogs', // 로그인 성공 후, 이전 페이지로 돌아가기
      },
    };
  }

  let DATA = null;
  const embeddedData = res?.data._embedded;
  // console.log(embeddedData);
  if (embeddedData) {
    const dataList = embeddedData?.queryDogsDtoList || [];
    // console.log('dataList', dataList);
    if (!dataList.length) return;
    DATA = dataList.map((data) => ({
      id: data.id,
      pictureName: data.pictureName, // 반려견 프로필 사진이름
      pictureUrl: data.pictureUrl, // 반려견 프로필 사진
      name: data.name, // 반려견 이름
      birth: data.birth, // 반려견 생년월 //YYYYMM
      gender: data.gender, // 반려견 성별
      representative: data.representative, // 대표견 여부
      subscribeStatus: data.subscribeStatus, // 구독상태
      subscribeCount: data.subscribeCount, // 구독 횟수
      subscribeId: data.subscribeId, // 구독 id
      startDate: data.startDate, // 구독 시작날짜
      nextDeliveryDate: data.nextDeliveryDate,
      plan: data.plan,
      recipeNames: data.recipeNames, //
      itemNames: data.itemNames, // 일반상품
      _links: {
        update_picture: {
          href: data._links.update_picture.href,
        },
        set_representative_dog: {
          href: data._links.set_representative_dog.href,
        },
        query_dog: {
          href: data._links.query_dog.href,
        },
        query_surveyReport: {
          href: data._links.query_surveyReport.href,
        },
        delete_dog: {
          href: data._links.delete_dog.href,
        },
      },
    }));
  }
  return { props: { data: DATA } };
}
