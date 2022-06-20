import React, { useState } from 'react';
import { useRouter } from 'next/router';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import s from './algorithm.module.scss';
import AlgorithmInput from './AlgorithmInput';

const activityConstKey = 'activityConst';
const snackConstKey = 'snackCountConst';

const initialFormValues = {
  [activityConstKey]: {
    VERY_LITTLE: 0,
    LITTLE: 0,
    NORMAL: 0,
    MUCH: 0,
    VERY_MUCH: 0,
  },
  [snackConstKey]: {
    VERY_LITTLE: 0,
    LITTLE: 0,
    NORMAL: 0,
    MUCH: 0,
    VERY_MUCH: 0,
  },
};

const initialFormErrors = {};

function AlgorithmPage() {
  const router = useRouter();
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState(initialFormErrors);

  console.log(formValues);

  const returnToPrevPage = () => {
    if (confirm('이전 페이지로 돌아가시겠습니까?')) {
      router.back();
    }
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log('제출!');
  }; // * onSubmitHandler

  return (
    <>
      <MetaTitle title="알고리즘 설정" admin={true} />
      <AdminLayout>
        <AdminContentWrapper id={s.main}>
          <div className="title_main">
            <h1>알고리즘 설정</h1>
          </div>
            <form
              action="/"
              encType="multipart/form-data"
              method="post"
              onSubmit={onSubmitHandler}
            >
              <div className="cont">
                <div className="cont_body">
                  <section className={s.section}>
                    <h2 className={s['title']}>활동량 상수</h2>
                    <AlgorithmInput
                      label={'매우 많아요'}
                      numberUnit={'+'}
                      name={activityConstKey}
                      formValues={formValues}
                      setFormValues={setFormValues}
                      formErrors={formErrors}
                      level={'VERY_MUCH'}
                    />
                    <AlgorithmInput
                      label={'많아요'}
                      numberUnit={'+'}
                      name={activityConstKey}
                      formValues={formValues}
                      setFormValues={setFormValues}
                      formErrors={formErrors}
                      level={'MUCH'}
                    />
                    <AlgorithmInput
                      label={'보통'}
                      numberUnit={''}
                      name={activityConstKey}
                      formValues={formValues}
                      setFormValues={setFormValues}
                      formErrors={formErrors}
                      level={'NORMAL'}
                    />
                    <AlgorithmInput
                      label={'적어요'}
                      numberUnit={'-'}
                      name={activityConstKey}
                      formValues={formValues}
                      setFormValues={setFormValues}
                      formErrors={formErrors}
                      level={'LITTLE'}
                    />
                    <AlgorithmInput
                      label={'매우 적어요'}
                      numberUnit={'-'}
                      name={activityConstKey}
                      formValues={formValues}
                      setFormValues={setFormValues}
                      formErrors={formErrors}
                      level={'VERY_LITTLE'}
                    />
                  </section>
                  <section>
                    <h2 className={s['title']}>간식량 상수</h2>
                    <AlgorithmInput
                      label={'매우 많아요'}
                      numberUnit={'+'}
                      name={snackConstKey}
                      formValues={formValues}
                      setFormValues={setFormValues}
                      formErrors={formErrors}
                      level={'VERY_MUCH'}
                    />
                    <AlgorithmInput
                      label={'많아요'}
                      numberUnit={'+'}
                      name={snackConstKey}
                      formValues={formValues}
                      setFormValues={setFormValues}
                      formErrors={formErrors}
                      level={'MUCH'}
                    />
                    <AlgorithmInput
                      label={'보통'}
                      numberUnit={''}
                      name={snackConstKey}
                      formValues={formValues}
                      setFormValues={setFormValues}
                      formErrors={formErrors}
                      level={'NORMAL'}
                    />
                    <AlgorithmInput
                      label={'적어요'}
                      numberUnit={'-'}
                      name={snackConstKey}
                      formValues={formValues}
                      setFormValues={setFormValues}
                      formErrors={formErrors}
                      level={'LITTLE'}
                    />
                    <AlgorithmInput
                      label={'매우 적어요'}
                      numberUnit={'-'}
                      name={snackConstKey}
                      formValues={formValues}
                      setFormValues={setFormValues}
                      formErrors={formErrors}
                      level={'VERY_LITTLE'}
                    />
                  </section>
                </div>
              </div>
              <section className="btn_section">
                <button
                  type="button"
                  id="btn-cancle"
                  className="admin_btn confirm_l line"
                  onClick={returnToPrevPage}
                >
                  취소
                </button>
                <button type="submit" id="btn-create" className="admin_btn confirm_l solid">
                  등록
                </button>
              </section>
            </form>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default AlgorithmPage;
