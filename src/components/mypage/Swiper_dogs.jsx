import React, { useEffect, useRef, useState } from 'react';
// import s from '../../pages/review/review.module.scss';
import s from './swiperDogs.module.scss';
import { Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import { EmptyContMessage } from '/src/components/atoms/emptyContMessage';
import Spinner from '../atoms/Spinner';
import DeleteIcon from '/public/img/mypage/dog_info_delete.svg';
import Link from 'next/link';
import Modal_confirm from '/src/components/modal/Modal_confirm';
import { useRouter } from 'next/router';
import { useModalContext } from '@store/modal-context';
import { calcDogAge } from '/util/func/calcDogAge';
import { dogGenderType } from '/store/TYPE/dogGenderType';
import { SubscribeStatusTag } from '../subscribe/SubscribeStatusTag';
import { subscribeStatus } from '/store/TYPE/subscribeStatus';
import CloseButton from '../atoms/CloseButton';
import { subscribePlanType } from '@store/TYPE/subscribePlanType';
import { getData, postData } from '@src/pages/api/reqData';
import { formattedProductionAndReceivingDate } from '/util/func/formattedProductionAndReceivingDate';

export function Swiper_dogs({
  itemList,
  onUploadImageModalHandler,
  onShowModalHandler,
  onActiveConfirmModal,
  setIsLoading,
  isLoading,
}) {
  const scrollbarRef = useRef(null);
  const mct = useModalContext();

  const [swiperInstance, setSwiperInstance] = useState(null);
  const [recipeInfoList, setRecipeInfoList] = useState([]);

  const swiperSettings_review = {
    className: `${s.swiper_dogs}`,
    slidesPerView: 'auto',
    spaceBetween: 20,
    scrollbar: {
      nextEl: scrollbarRef.current,
      draggable: true,
    },
    modules: [Scrollbar],
  };

  // 레시피 정보 불러오기
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const getRecipeInfoApiUrl = `/api/recipes`;
  //       const recipeInfoRes = await getData(getRecipeInfoApiUrl);
  //       const recipeInfoData =
  //         recipeInfoRes.data._embedded.recipeListResponseDtoList;
  //       setRecipeInfoList(recipeInfoData);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   })();
  // }, []);

  console.log('___', itemList);

  return (
    <div className={s.swiper_review_outerWrap}>
      <Swiper
        {...swiperSettings_review}
        onInit={(swiper) => {
          setSwiperInstance(swiper);
          swiper.params.scrollbar.nextEl = scrollbarRef.current;
        }}
      >
        {itemList?.length > 0 ? (
          itemList
            ?.sort((a, b) => {
              if (a.representative === b.representative) {
                return b.id - a.id;
              }
              return a.representative ? -1 : 1;
            })
            .map((item, index) => (
              <SwiperSlide
                className={s.slide}
                key={`bestReview-${item.id}`}
                data-id={item.id}
              >
                <div className={s.mid_box}>
                  <ItemList
                    key={`${item.id}-${index}`}
                    data={item}
                    onEditImage={onUploadImageModalHandler}
                    onShowModalHandler={onShowModalHandler}
                    onActiveConfirmModal={onActiveConfirmModal}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                  />
                </div>
              </SwiperSlide>
            ))
        ) : (
          <EmptyContMessage
            // message={
            //   '아직 등록된 반려견이 없습니다\n강아지 정보를 등록하고 맞춤 플랜을 확인하세요.'
            // }
            message={
              '아직 등록된 반려견이 없습니다.\n지금 설문하고 보호자님의 반려견만을 위한\n건강한 식사를 구독해보세요!'
            }
            options={{
              // button: { url: '/survey', label: '반려견 등록하기' },
              button: { url: '/survey', label: '설문하고 구독 시작하기' },
            }}
            bgColor={'rgba(99, 99, 99, 0.8)'}
            borderRadius={4}
            color={'white'}
          />
        )}
      </Swiper>
    </div>
  );
}

const ItemList = ({
  data,
  onEditImage,
  onShowModalHandler,
  onActiveConfirmModal,
  setIsLoading,
  isLoading,
}) => {
  // console.log(data)

  const router = useRouter();
  const mct = useModalContext();
  const dogId = data.id;
  let subscribeId = null; //  ! 값 확인하기
  const dogAge = calcDogAge(data.birth);
  const gender =
    data.gender === dogGenderType.MALE
      ? dogGenderType.KOR.MALE
      : dogGenderType.KOR.FEMALE;

  //* 구독 시작 날짜 계산
  const formatDateAndDaysPassed = (dateString) => {
    const targetDate = new Date(dateString);
    const currentDate = new Date();

    const timeDifference = currentDate - targetDate;
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    const formattedDate = `${targetDate.getFullYear()}.${String(
      targetDate.getMonth() + 1,
    ).padStart(2, '0')}.${String(targetDate.getDate()).padStart(2, '0')}`;

    return `${formattedDate}. (+${daysDifference}일)`;
  };

  const onEditProfileImage = () => {
    onEditImage(data);
  };

  // 주문서로 이동
  const nextPageHandler = (e, route) => {
    const dogId = e.currentTarget.dataset.id;
    const apiUrl = `api/orders/sheet/subscribe/dog/${dogId}`;

    // 주문서로 이동
    if (route === 'order') {
      (async () => {
        try {
          setIsLoading((prevState) => ({
            ...prevState,
            [dogId]: true,
          }));

          const res = await getData(apiUrl);
          subscribeId = res.data.subscribeDto.id;
          // console.log('subscribeId', subscribeId);

          if (subscribeId) {
            router.push(`/order/ordersheet/subscribe/${subscribeId}`);
          } else {
            // console.error('there is no Subscribe ID', info.subscribeId);
            alert('주문정보를 확인할 수 없습니다.');
            window.location.href = '/';
          }
        } catch (err) {
          console.error(err);
        }
      })();
      // 설문조사 수정
    } else if (route === 'updateSurvey') {
      router.push(`/mypage/dogs/${dogId}/updateSurvey`);
    }
  };

  // const moveToSubscribeShopHandler = (dogId) => {
  //   router.push(`/mypage/dogs/${dogId}/statistic`);
  //   // router.push(`/order/subscribeShop?dogId=${dogId}`);
  // };

  const onSuccessCallback = () => {
    window.location.reload();
  };

  //* 구독 중단 취소 (재활성화)
  const onReactiveHandler = async (subscribeId) => {
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        reactive: true,
      }));
      const apiUrl = `/api/subscribes/${subscribeId}/reactive`;
      const res = await postData(apiUrl);
      console.log(res);
      if (res.data) {
        mct.alertShow(`재구독이 정상적으로 완료되었습니다.`, onSuccessCallback);
      } else {
        mct.alertShow('재구독에 실패하였습니다.');
      }
    } catch (err) {
      mct.alertShow('서버 통신 장애 발생');
      console.error(err);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        reactive: false,
      }));
    }
  };

  return (
    <>
      {/* '구독 중' --> 빨간선으로 표시 */}
      <li
        className={`${s.dogInfo_wrap} ${
          data.subscribeStatus === subscribeStatus.SUBSCRIBING
            ? s.red_border
            : ''
        }`}
        data-id={dogId}
      >
        <div className={s.dog_info_top}>
          {/* 대표견 태그 */}
          {data.representative ? (
            <div className={s.representative_wrapper}>
              <Image
                src={`/img/mypage/flag_red.png`}
                alt="flag_red"
                width={35}
                height={45}
              />
            </div>
          ) : (
            <button
              type={'button'}
              data-button-type={'setRep'}
              onClick={(e) => onActiveConfirmModal(e, data)}
              className={s.representative_wrapper}
            >
              <Image
                src={`/img/mypage/flag_gray.png`}
                alt="flag_gray"
                width={35}
                height={45}
              />
            </button>
          )}
        </div>

        {/* 삭제 버튼 */}
        {data.subscribeStatus !== subscribeStatus.SUBSCRIBING && (
          <div
            className={`${s.image_close} img-wrap`}
            data-button-type={'deleteItem'}
            onClick={(e) => onActiveConfirmModal(e, data)}
            style={{ cursor: 'pointer' }}
          >
            <Image
              src={'/img/mypage/close_btn.svg'}
              alt="close_btn"
              width={14}
              height={14}
            />
          </div>
        )}

        {/* 구독 상태 */}
        <div className={s.tags}>
          <SubscribeStatusTag
            status={data.subscribeStatus}
            subscribeCount={data.subscribeCount}
          />
        </div>

        {/* 정보 */}
        <div className={s.left_box}>
          <div
            className={`${s.image} ${data.pictureUrl ? s.hasImage : ''}`}
            onClick={onEditProfileImage}
          >
            {data.pictureUrl && (
              <Image
                src={data.pictureUrl}
                objectFit="cover"
                layout="fill"
                alt={data.pictureName || '반려견 썸네일'}
              />
            )}
          </div>
          <div className={s.dog_name}>
            <h5 className={s.dog_name}>
              {data.name}
              {/* {data.name} ( {dogAge} / {gender} ) */}
            </h5>

            {/* SUBSCRIBING: '구독 중' */}
            {/* {data.subscribeStatus === subscribeStatus.SUBSCRIBING && ( */}
            <>
              <p>
                구독 플랜: {data.plan ? subscribePlanType[data.plan].KOR : '-'}
              </p>
              <p>선택 레시피: {data.recipeNames || '-'}</p>
              <span className={s.start_date}>
                구독 시작일:{' '}
                {data.subscribeStatus === subscribeStatus.SUBSCRIBING
                  ? formatDateAndDaysPassed(data.startDate)
                  : '-'}
              </span>
            </>
            {/* )} */}
          </div>
        </div>

        <div className={s.date_wrapper}>
          <p>
            생산 예정일:{' '}
            {
              formattedProductionAndReceivingDate(data.nextDeliveryDate)
                .formattedProductionDate
            }
          </p>
          <p className={s.divider}></p>
          <p>
            수령 예정일:{' '}
            {
              formattedProductionAndReceivingDate(data.nextDeliveryDate)
                .formattedReceivingDate
            }
          </p>
        </div>

        {/***  하단 버튼 섹션 ***/}
        <div className={s.select_box}>
          {/* 1. 설문 완료 */}
          {/* '구독하기' 클릭 시, 맞춤레시피 페이지로 이동 */}
          {data.subscribeStatus === subscribeStatus.SURVEY_COMPLETED && (
            <div className={s.btn_wrapper}>
              <button
                type={'button'}
                data-id={dogId}
                onClick={(e) => nextPageHandler(e, 'updateSurvey')}
              >
                {isLoading[dogId] ? (
                  <Spinner style={{ color: '#fff' }} />
                ) : (
                  '설문 확인하기'
                )}
              </button>
              <Link href={`/mypage/dogs/${dogId}/statistic`} passHref>
                <a className={s.move_to_plan_recipe} data-id={dogId}>
                  {isLoading[dogId] ? (
                    <Spinner style={{ color: '#fff' }} />
                  ) : (
                    '맞춤식단 시작하기'
                  )}
                </a>
              </Link>
            </div>
          )}

          {/* 2. "맞춤식단 시작"  버튼 생성 조건  */}
          {/*  결제전(구독전)  */}
          {data.subscribeStatus === subscribeStatus.BEFORE_PAYMENT && (
            <div className={s.btn_wrapper}>
              <button
                type={'button'}
                data-id={dogId}
                onClick={(e) => nextPageHandler(e, 'updateSurvey')}
              >
                {isLoading[dogId] ? (
                  <Spinner style={{ color: '#fff' }} />
                ) : (
                  '설문 확인하기'
                )}
              </button>

              <button
                type={'button'}
                className={s.payment}
                data-id={dogId}
                onClick={(e) => nextPageHandler(e, 'order')} // 주문서로 이동
              >
                {isLoading[dogId] ? (
                  <Spinner style={{ color: '#fff' }} />
                ) : (
                  '구독 결제하기'
                )}
              </button>
            </div>
          )}

          {/* 3. "재구독"  버튼 생성 조건  */}
          {/* 3-1. 구독 보류 ('구독 중' 상태가 아닌) / 구독 취소 */}
          {(data.subscribeStatus === subscribeStatus.SUBSCRIBE_PENDING ||
            data.subscribeStatus === subscribeStatus.SUBSCRIBE_CANCEL) && (
            <div className={s.btn_wrapper}>
              <button
                type={'button'}
                className={s.reactive}
                data-id={dogId}
                onClick={(e) => nextPageHandler(e, 'order')} // 주문서로 이동
              >
                {isLoading[dogId] ? (
                  <Spinner style={{ color: '#fff' }} />
                ) : (
                  '재구독하기'
                )}
              </button>
            </div>
          )}

          {/* 3-2. 구독 취소 예정  */}
          {data.subscribeStatus === subscribeStatus.SUBSCRIBE_WILL_CANCEL && (
            <div className={s.subscribe_will_cancel_wrapper}>
              <button
                type={'button'}
                className={s.reactive}
                data-id={dogId}
                onClick={() => onReactiveHandler(data.subscribeId)}
              >
                {isLoading[dogId] ? (
                  <Spinner style={{ color: '#fff' }} />
                ) : (
                  '재구독하기'
                )}
              </button>
              <Link href={`/mypage/subscribe/delivery`} passHref>
                <a>구독 배송지 관리</a>
              </Link>
              <Link href={`/mypage/subscribe/${data.subscribeId}`} passHref>
                <a>구독 관리</a>
              </Link>
            </div>
          )}

          {/* 4. SUBSCRIBING: '구독 중' */}
          {data.subscribeStatus === subscribeStatus.SUBSCRIBING && (
            <div className={s['btn-section']}>
              {/* <Link href={`/mypage/dogs/${dogId}/statistic`} passHref>
                  <a>맞춤레포트 확인</a>
                </Link>
              */}

              {data.nextDeliveryDate && (
                <Link
                  href={`/mypage/subscribe/skip/${data.subscribeId}`}
                  passHref
                >
                  <a>배송 미루기</a>
                </Link>
              )}

              <Link
                href={`/mypage/subscribe/delivery/${data.subscribeId}`}
                passHref
              >
                <a>구독 배송지 관리</a>
              </Link>
              <Link href={`/mypage/subscribe`} passHref>
                <a>구독 관리</a>
              </Link>
            </div>
          )}
        </div>
      </li>
    </>
  );
};
