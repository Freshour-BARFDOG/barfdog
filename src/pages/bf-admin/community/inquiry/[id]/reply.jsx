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
import Tooltip from "../../../../../components/atoms/Tooltip";
import popupWindow from "../../../../../../util/func/popupWindow";

const initialFormValues = {
  title: '',
  content: '',
};

export default function ReplyInquiryPage({id}) {
  console.log(id)
  const mct = useModalContext();

  const router = useRouter();
    const maxContentsLength = 1000;
  const [isLoading, setIsLoading] = useState({});
  const [form, setForm] = useState(initialFormValues);
  const [error, setError] = useState({});
  const [submitted, setSubmitted] = useState(false);

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
        contents: { maxContentsLength: maxContentsLength },
    });
    console.log(errObj);
    setError(errObj);
    const isPassed = valid_hasFormErrors(errObj);
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      if (isPassed) {
        const objData = form;
        const res = await postObjData(postFormValuesApiUrl, objData);
        console.log(res);
        // const res = { // TESTTESTTESTTESTTESTTESTTESTTESTTEST
        //   isDone : true,
        //   error: ''
        // }
        if (res.isDone) {
          onShowModalHandler('이벤트가 생성되었습니다.');
          setSubmitted(true);
        } else {
          alert(res.error, '\n내부 통신장애입니다. 잠시 후 다시 시도해주세요.');
        }
      }
    } catch (err) {
      alert('API통신 오류가 발생했습니다. 서버관리자에게 문의하세요.');
      console.error('API통신 오류 : ', err);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: false,
      }));
    }
  };

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
              <Tooltip wordBreaking={true} message={'- 작성된 답변 및 문의내용은 원문 보존을 위해 수정할 수 없습니다.\n- 답글 작성 시, 알림톡 수신에 동의한 유저에게 알림톡이 발송됩니다.'} width={400}/>
          </div>
          <main className="cont">
            <section className="cont-top">
              <div className="cont-row">
                <div className="left-box">
                  <p className="title">원글 제목</p>
                </div>
                <div className="right-box">
                  <span>lorem ipsum dolor sit amet</span>
                  <a href={`/bf-admin/popup/inquiry/${id}`} type={'button'} className={'admin_btn line basic_m'} onClick={onPopupHandler}>원글보기</a>
                </div>
              </div>
              <div className="cont-row">
                <div className="left-box">
                  <p className="title">원글 작성자ID</p>
                </div>
                <div className="right-box">
                  <span>user@email.com</span>
                </div>
              </div>
            
            </section>
            <section className="cont_body">
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
                        className="fullWidth"
                        onChange={onInputChangeHandler}
                      />
                    </div>
                      {error.title && (
                        <ErrorMessage>{error.title}</ErrorMessage>
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
                  <div className="inp_section">
                    <div className="inp_box">
                      <textarea
                        id={'contents'}
                        name="title"
                        className="fullWidth"
                        placeholder={'문의글에 대한 답글을 10자 이상 적어주세요.'}
                        onChange={onInputChangeHandler}
                      />
                    </div>
                      {error.contents && (
                        <ErrorMessage>{error.contents}</ErrorMessage>
                      )}
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
    </>
  );
}


export async function getServerSideProps ({query}) {
  
  const { id } = query;
  const inValid = isNaN(id);
  if(inValid){
    return {
      redirect:{
        destination: '/bf-admin/community/inquiry'
      }
    }
  }
  
  return {
    props: { id }
  }
}