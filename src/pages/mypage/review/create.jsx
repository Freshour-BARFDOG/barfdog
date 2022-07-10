import React, { useEffect, useState } from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import s from './create.module.scss';
import Image from 'next/image';
import RatingStars from '/src/components/atoms/RatingStars';
import Spinner from '../../../components/atoms/Spinner';
import { validate } from '/util/func/validation/validation_review';
import { valid_hasFormErrors } from '/util/func/validation/validationPackage';
import { postObjData } from '/api/reqData';
import { useRouter } from 'next/router';
import { transformToday } from '/util/func/transformDate';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import { useModalContext } from '/store/modal-context';
import FileInput from '/src/components/admin/form/FileInput';

const initialFormValues = {
  // type: '', // str
  // id: null, // num // 정기 구독 상품 또는 일반 상품의 id
  id: 1, // ! TEST
  writtenDate: transformToday(), // str (yyyy-mm-dd)
  star: 5, // num
  contents: '', // str
  reviewImageIdList: [], // array : 리뷰 이미지 id 리스트
};

function CreateReviewPage() {
  const router = useRouter();
  const postFormValuesApiUrl = '/api/reviews';
  const mct = useModalContext();
  const maxContentsLength = 1000;

  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState({});

  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const isPassed = valid_hasFormErrors(formErrors);
    if (!isPassed && Object.keys(formErrors).length) {
      onShowModalHandler('유효하지 않은 항목이 있습니다.');
    }
  }, [formErrors]);

  // console.log(formValues)
  const onInputChangeHandler = (e) => {
    const input = e.currentTarget;
    const { id, value } = input;
    // console.log(id, value);

    setFormValues((prevState) => ({
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

    const convertedFormValues = {
      ...formValues,
      id: Number(formValues.id),
    };
    console.log(formValues);
    console.log(convertedFormValues);
    const errObj = validate(convertedFormValues, { contents: maxContentsLength });
    setFormErrors(errObj);
    const isPassed = valid_hasFormErrors(errObj);
    if (!isPassed) return;

    alert('유효성 검증 완료');

    return;
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      const res = await postObjData(postFormValuesApiUrl, convertedFormValues);
      console.log(res);
      if (res.isDone) {
        onShowModalHandler('리뷰가 성공적으로 등록되었습니다.');
        setIsSubmitted(true);
      } else {
        alert(`Error: ${res.error}`);
      }
    } catch (err) {
      onShowModalHandler('장애가 발생했습니다. 잠시 후 다시 시도해주세요.');
      // alert('장애가 발생했습니다. 잠시 후 다시 시도해주세요.');
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
      router.push('/bf-admin/review/normal');
    }
  };

  return (
    <>
      <MetaTitle title="마이페이지 후기 작성" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={s.title_section}>
              <h1 className={s.title}>후기 작성</h1>
            </section>
            <section className={s.content_title}>
              <div className={s.title_flex_box}>
                <div className={s.left_box}>
                  <div className={`${s.image} img-wrap`}>
                    <Image
                      priority
                      src={require('public/img/mypage/review_create.png')}
                      objectFit="cover"
                      layout="fill"
                      alt="카드 이미지"
                    />
                  </div>
                </div>

                <div className={s.mid_box}>
                  바프레드
                  <p>정기구독 &middot; 3회차</p>
                </div>

                <div className={s.right_box}>
                  <p>2022.02.15 주문</p>
                </div>
              </div>
            </section>
            <section className={s.how_was}>
              <p className={s.text}>상품은 어떠셨나요?</p>
              <RatingStars
                id={'star'}
                count={formValues.star}
                margin={12}
                size={25}
                setFormValues={setFormValues}
              />
            </section>
            <section className={s.body}>
              <div className={s.flex}>
                <div className={s.left_side}>
                  <label htmlFor={'contents'} className={`${s.left_title} required`}>
                    상세리뷰
                  </label>
                </div>
                <div className={s.right_side}>
                  <div className={s.input_wrap}>
                    <textarea
                      id={'contents'}
                      placeholder="50자 이상 작성시 300원이 적립됩니다.&#13;상품에 대한 견주님의 의견을 남겨주시면 큰 힘이 됩니다."
                      onChange={onInputChangeHandler}
                      value={formValues.contents}
                    />
                    <span className={s['textLength-indicator']}>
                      {formValues.contents.length}/{maxContentsLength}
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
                    id={'reviewImageIdList'}
                    // apiUrl={postThumbFileApiUrl}
                    setFormValues={setFormValues}
                    formErrors={formErrors}
                    setFormErrors={setFormErrors}
                    // originImageDatas={originThumbDataList}
                    maxImageCount={10}
                    maxFileSize={20000000}
                    mode={'create'}
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

export default CreateReviewPage;
