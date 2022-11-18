import React, { useState } from 'react';
import { useModalContext } from '/store/modal-context';
import { useRouter } from 'next/router';

import s from './createInquiry.module.scss';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import Wrapper from '/src/components/common/Wrapper';
import Layout from '/src/components/common/Layout';
import MetaTitle from '/src/components/atoms/MetaTitle';
import PureCheckbox from '/src/components/atoms/PureCheckbox';
import {inquiryCategoryOptions} from '/store/TYPE/inquiry/inquiryCategoryType';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import FileInput from '/src/components/admin/form/FileInput';
import Spinner from '/src/components/atoms/Spinner';
import Modal_global_alert from '../../../components/modal/Modal_global_alert';
import { validate } from '/util/func/validation/validation_inquiry';
import { valid_hasFormErrors } from '/util/func/validation/validationPackage';
import transformLocalCurrency from "/util/func/transformLocalCurrency";
import {postObjData} from "/src/pages/api/reqData";


////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
/*
! TODO:
  FILE첨부기능
  submit 기능
 
*/
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////


export default function CreateInquiryPage() {
  const postThumbFileApiUrl = '/api/reviews/upload';
  const maxContentsLength = 1000;

  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const router = useRouter();
  const intiFormValues = {};
  const [form, setForm] = useState(intiFormValues);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState({});

  // console.log(form);

  const onInputChangeHandler = (e) => {
    const elem = e.currentTarget;
    const val = elem.value;
    const id = elem.id;
    setForm((prevState) => ({
      ...prevState,
      [id]: val,
    }));
  };

  const returnToPrevPage = () => {
    if (confirm('이전 페이지로 돌아가시겠습니까?')) {
      router.back();
    }
  };

  const onSubmit = async () => {
    if (submitted) return console.error('이미 제출된 양식입니다.');
    const body = {
      receiveAlimTalk: form.receiveAlimTalk,
      inquiryType: form.category,
      title: form.title,
      contents: form.contents,
      // imageIdList: form.imageIdList.map((list) => list.id), // ! 현재 API 작업 중
    };

    const errObj = validate(body, {
      contents: { maxContentsLength: maxContentsLength },
    });
    setErrors(errObj);

    const isPassed = valid_hasFormErrors(errObj);
    if (!isPassed) return mct.alertShow('유효하지 않은 항목이 존재합니다.');
    const confirmMessage = '1:1 문의작성을 등록하시겠습니까?';
    if (!confirm(confirmMessage)) return;
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      // console.log(body);
      const apiUrl = '/api/____/____';
      const res = await postObjData(apiUrl, body);
      
      if (res.isDone) {
        setSubmitted(true);
        mct.alertShow('성공적으로 1:1 문의등록이 완료되었습니다.', onSuccessCallback);
      } else {
        mct.alertShow(res.error, '\n내부 통신장애입니다. 잠시 후 다시 시도해주세요.');
      }
    
    } catch (err) {
      mct.alertShow('API통신 오류가 발생했습니다. 서버관리자에게 문의하세요.', onFailPostApiCallback);
    
      console.error('API통신 오류 : ', err);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: false,
      }));
    }
  };
  
  const onSuccessCallback = ()=>{
    window.location.href = '/mypage/inquiry';
  }
  const onFailPostApiCallback = ()=>{
    window.location.href = '/mypage/inquiry';
  }

  return (
    <>
      <MetaTitle title="마이페이지 1:1 문의작성" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={s['form-section']}>
              <h1 className={s.create_title}>1:1 문의작성</h1>

              <ul>
                <div className={s['form-row']}>
                  <div className={s['form-row-title']}>
                    <span>알림</span>
                  </div>
                  <div className={s['form-row-cont']}>
                    <PureCheckbox
                      id={'receiveAlimTalk'}
                      value={form['alram'] || ''}
                      label={'알림톡 / SMS 답변받기'}
                      setValue={setForm}
                      option={{ position: 'right' }}
                    >
                      <div>알림톡 / SMS 답변받기</div>
                    </PureCheckbox>
                  </div>
                </div>
                {/* form-row */}
                <div className={s['form-row']}>
                  <div className={s['form-row-title']}>
                    <label htmlFor={'category'}>분류</label>
                  </div>
                  <div className={s['form-row-cont']}>
                    <select id={'category'} onChange={onInputChangeHandler}>
                      {inquiryCategoryOptions.map((op, i) => (
                        <option key={`category-option-${i}`} value={op.value}>
                          {op.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </ul>
              
              {/* form-row */}
              <div className={s['form-row']}>
                <div className={s['form-row-title']}>
                  <label htmlFor={'title'}>
                    <span>제목</span>
                  </label>
                </div>
                <div className={s['form-row-cont']}>
                  <input
                    id={'title'}
                    className={'fullWidth'}
                    type={'text'}
                    placeholder={'제목을 작성해주세요.'}
                    value={form['title'] || ''}
                    onChange={onInputChangeHandler}
                  />
                  {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
                </div>
              </div>
              {/* form-row */}
              <div className={s['form-row']}>
                <div className={s['form-row-title']}>
                  <label htmlFor={'contents'}>
                    <span>문의내용</span>
                  </label>
                </div>
                <div className={s['form-row-cont']}>
                  <div className={`${s['input-wrap']} ${s.contents}`}>
                    <textarea
                      id={'contents'}
                      className={'fullWidth'}
                      placeholder={`문의내용을 작성해주세요.\n문의내용은 최대 ${transformLocalCurrency(maxContentsLength)}자 이내로 작성 가능할 수 있습니다.`}
                      onChange={onInputChangeHandler}
                      value={form['contents']}
                    />
                    <span className={s['length-indicator']}>
                      {form?.contents?.length} / {transformLocalCurrency(maxContentsLength)}
                    </span>
                  </div>
                  {errors.contents && (
                    <ErrorMessage>{errors.contents}</ErrorMessage>
                  )}
                </div>
              </div>
              {/* form-row */}
              <div className={s['form-row']}>
                <div className={s['form-row-title']}>
                  <label htmlFor={'imageIdList'}>
                    <span>파일첨부</span>
                  </label>
                </div>
                <div className={s['form-row-cont']}>
                  <FileInput
                    id={'imageIdList'}
                    apiUrl={postThumbFileApiUrl}
                    setFormValues={setForm}
                    formErrors={errors}
                    setFormErrors={setErrors}
                    originImageDatas={[]}
                    maxImageCount={5}
                    maxFileSize={5000000}
                    mode={'create'}
                    required={false}
                    theme={'modern'}
                    className={s.fileInput}
                    option={{ descriptionHTML: '' }}
                  />
                </div>
              </div>
              {/* form-row */}
            </section>
            <section className={`${s['btn-section']}`}>
              <button
                type={'button'}
                className={`custom_btn line confirm_m ${s.cancel}`}
                onClick={returnToPrevPage}
              >
                취소
              </button>
              <button
                type={'button'}
                className={`custom_btn solid confirm_m ${s.confirm}`}
                onClick={onSubmit}
              >
                {isLoading.submit ? (
                  <Spinner style={{ color: '#fff' }} />
                ) : (
                  '등록하기'
                )}
              </button>
            </section>
          </MypageWrapper>
        </Wrapper>
      </Layout>
      {hasAlert && <Modal_global_alert background />}
    </>
  );
}
