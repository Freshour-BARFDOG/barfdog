import MetaTitle from '/src/components/atoms/MetaTitle';
import React, { useState } from 'react';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import AdminLayout from '/src/components/admin/AdminLayout';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import { useRouter } from 'next/router';
import { useModalContext } from '/store/modal-context';
import Spinner from '/src/components/atoms/Spinner';
import { validate } from '/util/func/validation/validation_reply';
import { valid_hasFormErrors } from '/util/func/validation/validationPackage';
import { postObjData } from '/src/pages/api/reqData';
import Tooltip from '/src/components/atoms/Tooltip';
import popupWindow from '/util/func/popupWindow';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import FileInput from '/src/components/admin/form/FileInput';
import s from '/src/pages/mypage/inquiry/createInquiry.module.scss';
import { getDtataSSR_inquiryAuthorType } from '/util/func/getDtataSSR_inquiryAuthorType';
import transformLocalCurrency from "/util/func/transformLocalCurrency";

const initialFormValues = {
  title: '',
  contents: '',
  questionImgIdList: [],
};

export default function CreateInquiryAnswerPage({ id }) {
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const router = useRouter();
  const postThumbFileApiUrl = '/api/admin/questions/file';
  const maxFileUploadSize = 5000000; //
  const maxContentsLength = 1000;
  const [isLoading, setIsLoading] = useState({});
  const [form, setForm] = useState(initialFormValues);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // // console.log(form);
  const onInputChangeHandler = (e) => {
    const { id, value } = e.currentTarget;
    setForm({
      ...form,
      [id]: value,
    });
  };

  const onSubmit = async () => {
    if (submitted) return;

    const errObj = validate(form, {
      contents: { maxLength: maxContentsLength },
    });
    // // console.log(errObj);
    setErrors(errObj);
    const isPassed = valid_hasFormErrors(errObj);
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      if (isPassed) {
        const body = {
          targetId: id,
          title: form.title,
          contents: form.contents,
          questionImgIdList: form.questionImgIdList.map((img)=>img.id)
        };
        const apiUrl = '/api/admin/questions';
        const res = await postObjData(apiUrl, body);
        // console.log(res);
        if (res.isDone) {
          mct.alertShow('답글이 생성되었습니다.', onSuccessCallback);
          setSubmitted(true);
        } else {
          mct.alertShow(res.error, '\n내부 통신장애입니다. 잠시 후 다시 시도해주세요.', onFailCallback);
        }
      }
    } catch (err) {
      mct.alertShow('API통신 오류가 발생했습니다. 서버관리자에게 문의하세요.', onFailCallback);
      console.error('API통신 오류 : ', err);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: false,
      }));
    }
  };
  
  
  const onSuccessCallback = ()=>{
    window.location.href = '/bf-admin/community/inquiry';
  }
  
  const onFailCallback = ()=>{
    window.location.reload();
  }

  const onPrevPage = () => {
    if (confirm('이전 페이지로 돌아가시겠습니까?')) {
      router.back();
    }
  };

  const onPopupHandler = (e) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;
    const href = e.currentTarget.href;
    popupWindow(href, { width: 1000, height: 716 });
  };

  return (
    <>
      <MetaTitle title="1:1문의 답글 작성" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>1:1문의 답글 작성</h1>
            <Tooltip
              wordBreaking={true}
              message={
                '- 작성된 답변 및 문의내용은 원문 보존을 위해 수정할 수 없습니다.\n- 답글 작성 시, 알림톡 수신에 동의한 유저에게 알림톡이 발송됩니다.'
              }
              width={400}
            />
          </div>
          <main className="cont">
            <section className="cont_body">
              <div className="cont-row">
                <div className="left-box">
                  <p className="title">원글 링크</p>
                </div>
                <div className="right-box">
                  <a
                    href={`/bf-admin/popup/inquiry/${id}`}
                    type={'button'}
                    className={'admin_btn line basic_m pointColor'}
                    onClick={onPopupHandler}
                  >
                    원글 보기
                  </a>
                </div>
              </div>
              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor={'title'}>
                      제목
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <input
                        id={'title'}
                        type="text"
                        name="title"
                        placeholder={'제목을 입력해주세요.'}
                        className="fullWidth"
                        onChange={onInputChangeHandler}
                      />
                    </div>
                    {errors.title && (
                      <ErrorMessage>{errors.title}</ErrorMessage>
                    )}
                  </div>
                </div>
              </div>
              {/* cont_divider */}
              <div className="cont_divider">
                <div className="input_row multipleLines">
                  <div className="title_section fixedHeight">
                    <label className="contents" htmlFor={'contents'}>
                      내용
                    </label>
                  </div>
                  <div className={`inp_section`}>
                    <div className={`${s['input-wrap']} ${s['contents']} inp_box`}>
                      <textarea
                        id={'contents'}
                        name="title"
                        className="fullWidth"
                        placeholder={
                          '답글을 10자 이상 입력해주세요주세요.'
                        }
                        onChange={onInputChangeHandler}
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
              </div>
              {/* cont_divider */}
              <div className="cont_divider">
                <div className="input_row multipleLines">
                  <div className="title_section fixedHeight">
                    <label className="contents" htmlFor={'contents'}>
                      파일첨부
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <FileInput
                        id={'questionImgIdList'}
                        apiUrl={postThumbFileApiUrl}
                        setFormValues={setForm}
                        formErrors={errors}
                        setFormErrors={setErrors}
                        originImageDatas={[]}
                        maxImageCount={5}
                        maxFileSize={maxFileUploadSize}
                        mode={'create'}
                        required={false}
                        theme={'modern'}
                        className={s.fileInput}
                        option={{ descriptionHTML: '' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* cont_divider */}
            </section>
            <div className="cont_bottom">
              <div className="btn_section">
                <button
                  type="button"
                  id="btn-cancle"
                  className="admin_btn confirm_l line"
                  onClick={onPrevPage}
                >
                  취소
                </button>
                <button
                  type="button"
                  id="btn-create"
                  className="admin_btn confirm_l solid"
                  onClick={onSubmit}
                >
                  {isLoading.submit ? (
                    <Spinner
                      style={{ color: '#fff', width: '15', height: '15' }}
                      speed={0.6}
                    />
                  ) : (
                    '등록'
                  )}
                </button>
              </div>
            </div>
          </main>
        </AdminContentWrapper>
      </AdminLayout>
      {hasAlert && <Modal_global_alert background />}
    </>
  );
}

export async function getServerSideProps({ req, query }) {
  const { id } = query;
  let DATA = null;

  const inValid = isNaN(id);
  let AUTHOR_TYPE = await getDtataSSR_inquiryAuthorType(req, id);
  // // console.log('inValid: ', inValid, 'AUTHOR_TYPE: ', AUTHOR_TYPE);
  if (inValid || !AUTHOR_TYPE) {
    // !PROD;
    return {
      redirect: {
        destination: '/bf-admin/community/inquiry',
      },
    };
  }

  return {
    props: { id },
  };
}
