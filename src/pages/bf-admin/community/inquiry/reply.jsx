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

const initialFormValues = {
  title: '',
  content: '',
};

export default function ReplyInquiryPage() {
  const mct = useModalContext();

  const router = useRouter();
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

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitted) return;

    const errObj = validate(form);
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

  return (
    <>
      <MetaTitle title="1:1문의 답글 작성" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>1:1문의 답글 작성</h1>
          </div>
          <main className="cont">
            <ul className="cont_body">
              <li className="cont_divider">
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
                      {error.title && (
                        <ErrorMessage>{error.title}</ErrorMessage>
                      )}
                    </div>
                  </div>
                </div>
              </li>
              <li className="cont_divider">
                <div className="input_row multipleLines">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor={'title'}>
                      내용
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <textarea
                        id={'title'}
                        name="title"
                        className="fullWidth"
                        placeholder={''}
                        onChange={onInputChangeHandler}
                      />
                      {error.title && (
                        <ErrorMessage>{error.title}</ErrorMessage>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            </ul>
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
