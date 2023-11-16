import React, { useEffect, useState } from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import s from './create.module.scss';
import Image from 'next/image';
import RatingStars from '/src/components/atoms/RatingStars';
import Spinner from '/src/components/atoms/Spinner';
import { validate } from '/util/func/validation/validation_review';
import { valid_hasFormErrors } from '/util/func/validation/validationPackage';
import {getData, putObjData} from '/src/pages/api/reqData';
import { useRouter } from 'next/router';
import transformDate from '/util/func/transformDate';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import { useModalContext } from '/store/modal-context';
import FileInput from '/src/components/admin/form/FileInput';
import { global_reviewType } from '/store/TYPE/reviewType';
import { useSelector } from 'react-redux';
import {userType} from "/store/TYPE/userAuthType";

// const DUMMY_DATA = {
//   data: {
//     reviewDto: {
//       id: 371,
//       title: '상품1',
//       name: '김회원',
//       thumbnailUrl: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=685&q=80',
//       writtenDate: '2022-07-22',
//       star: 0,
//       contents: '열글자 이상의 내용 작성',
//     },
//     reviewImageDtoList: [
//       {
//         id: 4331,
//         filename: 'filename1.jpg',
//         url: 'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80',
//       },
//       {
//         id: 4332,
//         filename: 'filename2.jpg',
//         url: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
//       },
//       {
//         id: 4333,
//         filename: 'filename3.jpg',
//         url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
//       },
//     ],
//     _links: {
//       self: {
//         href: 'http://localhost:8080/api/reviews/371',
//       },
//       update_review: {
//         href: 'http://localhost:8080/api/reviews/371',
//       },
//       profile: {
//         href: '/docs/index.html#resources-query-review',
//       },
//     },
//   },
// };

const initialFormValues = {
  reviewType: null, // 리뷰타입
  id: null, // 주문한 상품 id or 구독 id [orderItemId or subscribeId]
  targetId: null, // 리뷰 대상 id [itemId or recipeId]
  star: 5, // num
  contents: '', // str
  reviewImageIdList: [], // array : 리뷰 이미지 id 리스트
  // writtenDate: transformToday(), // str (yyyy-mm-dd)
};

export default function UpdateReviewPage( ) {
  
  const postThumbFileApiUrl = '/api/reviews/upload';
  const mct = useModalContext();
  const maxContentsLength = 1000;

  const router = useRouter();
  const userState = useSelector((s) => s.userState);
  const auth = useSelector((s) => s.auth);

  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState({});
  const [originThumbDataList, setOriginThumbDataList] = useState([]); // 썸네일 데이터 원본
  const [form, setForm] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // // console.log(form);

  useEffect(() => {
    const reviewInfo = userState.reviewInfo;
    const { reviewType, id, title, itemThumbnailUrl } = reviewInfo;
    (async () => {
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: true,
      }));
      try {
        const apiUrl = `/api/reviews/${id}`;
        const res = await getData(apiUrl);
        if (res.status === 200) {
          const data = res.data;
          const DATA = {
            reviewType, // 리뷰 타입
            id, // 주문한 상품 id 또는 구독 id
            title, // 상품 타이틀
            itemThumbnailUrl, // 좌측 상단 상품이미지 썸네일
            writtenDate: data.reviewDto.writtenDate, // 작성일자
            contents: data.reviewDto.contents, // 상세리뷰 내용
            star: data.reviewDto.star, // 별점
          };

          // initialize DATA
          setForm(DATA);
          const originthumbDataListFromServer = res.data.reviewImageDtoList;
          setOriginThumbDataList(originthumbDataListFromServer); // 원본 thumnail ID list
        } else {
          alert('데이터를 가져올 수 없습니다.');
        }
        // console.log(res);
      } catch (err) {
        console.error(err);
      }

      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    })();
  }, [userState]);

  useEffect(() => {
    const isPassed = valid_hasFormErrors(formErrors);
    if (!isPassed && Object.keys(formErrors).length) {
      onShowModalHandler('유효하지 않은 항목이 있습니다.');
    }
  }, [formErrors]);

  // // console.log(formValues)
  const onInputChangeHandler = (e) => {
    const input = e.currentTarget;
    const { id, value } = input;

    setForm((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitted) {
      console.error('이미 제출된 양식입니다.');
      return onGlobalModalCallback();
    }

    const body = {
      star: form.star,
      contents: form.contents,
      addImageIdList: form.addImageIdList,
      deleteImageIdList: form.deleteImageIdList,
    };
    // console.log(body);
    const errObj = validate(body, { contents: maxContentsLength });
    setFormErrors(errObj);
    const isPassed = valid_hasFormErrors(errObj);
    if (!isPassed) return;

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      const apiUrl = `/api/reviews/${form.id}`;
      const res = await putObjData(apiUrl, body);
      // console.log(res);
      if (res.isDone) {
        
        onShowModalHandler('리뷰가 성공적으로 등록되었습니다.');
        setIsSubmitted(true);
      } else if(res.status)  {
        if (auth.userType === userType.ADMIN) {
          onShowModalHandler('사이트 관리자가 생성한 리뷰는\n관리자 페이지에서 수정할 수 있습니다.');
          // alert('사이트 관리자가 생성한 리뷰는 관리자 페이지에서 삭제할 수 있습니다.');
        } else {
          onShowModalHandler('본인이 작성한 리뷰가 아닐 경우 수정할 수 없습니다.');
        }
      } else {
        alert(`Error: ${res.error}`);
      }
    } catch (err) {
      onShowModalHandler('장애가 발생했습니다. 잠시 후 다시 시도해주세요.');
      console.error('API통신 오류 : ', err);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      submit: false,
    }));
  };

  const returnToPrevPage = () => {
    if (confirm('이전 페이지로 돌아가시겠습니까?')) {
      router.back();
    }
  };

  const onShowModalHandler = (message) => {
    mct.alertShow();
    setModalMessage(message);
  };

  const onGlobalModalCallback = () => {
    mct.alertHide();
    if (modalMessage === '리뷰가 성공적으로 등록되었습니다.') {
      // <-- modal상태 추가하는 것으로 추후에 코드 변경하기
      router.push('/mypage/review');
    }
  };

  return (
    <>
      <MetaTitle title="마이페이지 후기 작성" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={s.title_section}>
              <h1 className={s.title}>
                후기 작성
                {isLoading.fetching && <Spinner />}
              </h1>
            </section>
            <section className={s.content_title}>
              <div className={s.title_flex_box}>
                <div className={s.left_box}>
                  <div className={`${s.image} img-wrap`}>
                    {form.itemThumbnailUrl && (
                      <Image
                        src={form.itemThumbnailUrl}
                        objectFit="cover"
                        layout="fill"
                        alt="카드 이미지"
                      />
                    )}
                  </div>
                </div>
                <div className={s.mid_box}>
                  {form.title}
                  <div className={s.mid_text}>{global_reviewType.KOR[form.reviewType]}</div>
                </div>

                <div className={s.right_box}>
                  <p>{transformDate(form.writtenDate)} 작성</p>
                </div>
              </div>
            </section>
            <section className={s.how_was}>
              <p className={s.text}>상품은 어떠셨나요?</p>
              <RatingStars
                id={'star'}
                count={form.star}
                margin={12}
                size={25}
                setFormValues={setForm}
              />
            </section>
            <section className={s.body}>
              <div className={s.flex}>
                <div className={s.left_side}>
                  <label htmlFor={'contents'} className={`${s.left_title}`}>
                    {/* <label htmlFor={'contents'} className={`${s.left_title} required`}> required삭제, required:after 발생, 상세리뷰 옆에 붉은 점 찍힘  */}
                    상세리뷰
                  </label>
                </div>
                <div className={s.right_side}>
                  <div className={s.input_wrap}>
                    <textarea
                      id={'contents'}
                      placeholder="50자 이상 작성시 300원이 적립됩니다.&#13;상품에 대한 견주님의 의견을 남겨주시면 큰 힘이 됩니다."
                      onChange={onInputChangeHandler}
                      value={form.contents}
                    />
                    <span className={s['textLength-indicator']}>
                      {form.contents.length}/{maxContentsLength}
                    </span>
                  </div>
                  {formErrors.contents && <ErrorMessage>{formErrors.contents}</ErrorMessage>}
                </div>
              </div>
            </section>
            <section className={s.picture_attach}>
              <div className={s.flex}>
                <div className={s.left_side}>
                  <div htmlFor={'reviewImageIdList'} className={s.left_title}>
                    사진첨부
                  </div>
                  <div className={s.outer}>
                    <h6 className={s.red_text}>500원 추가적립!</h6>
                  </div>
                </div>
                <div className={s.right_side}>
                  <FileInput
                    id={'reviewImageDtoList'}
                    apiUrl={postThumbFileApiUrl}
                    setFormValues={setForm}
                    formErrors={formErrors}
                    setFormErrors={setFormErrors}
                    originImageDatas={originThumbDataList}
                    maxImageCount={10}
                    maxFileSize={20000000}
                    mode={'update'}
                    required={false}
                    theme={'modern'}
                  />
                </div>
              </div>
            </section>

            <section className={s['btn-section']}>
              <button type={'button'} className={s.cancel} onClick={returnToPrevPage}>
                취소
              </button>
              <button type={'button'} className={s.save} onClick={onSubmit}>
                {isLoading.submit ? <Spinner style={{ color: '#fff' }} /> : '등록'}
              </button>
            </section>
          </MypageWrapper>
        </Wrapper>
      </Layout>
      <Modal_global_alert message={modalMessage} onClick={onGlobalModalCallback} background />
    </>
  );
}

// export async function getServerSideProps({ query }) {
//   const { reviewId } = query;
//   return { props: { reviewId } };
// }
