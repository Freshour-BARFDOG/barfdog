import React, { useEffect, useState } from 'react';
import s from './dogs.module.scss';
import { dogGenderType } from '/store/TYPE/dogGenderType';
import { subscribeStatus } from '/store/TYPE/subscribeStatus';
import LayoutMypage from '/src/components/common/LayoutMypage';
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
      <LayoutMypage>
        <Wrapper bgColor={'#fff'}>
          {/* <MypageWrapper> */}
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
          {/* </MypageWrapper> */}
        </Wrapper>
      </LayoutMypage>
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

export async function getServerSideProps({ req }) {
  const getApiUrl = '/api/dogs';
  const res = await getDataSSR(req, getApiUrl);

  // console.log(res.data);

  if (res?.status !== 200) {
    return {
      redirect: {
        permanent: false,
        destination: '/account/login?prevPath=/mypage', // 로그인 성공 후, 이전 페이지로 돌아가기
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
