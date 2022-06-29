import React, {useState} from 'react';
import s from './couponSettingInput.module.scss';
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import AutoPublishedCouponSettingInput from "./AutoPublishedCouponSettingInput";
import GradeCouponSettingInput from "./GradeCouponSettingInput";


const autoCouponKey = 'autoPublishedCoupon';
const gradeCouponKey = 'gradeSaleCoupon';

const initialFormValues = {
  [autoCouponKey]: {
    describe: 0,
    userBirthday:0,
    dogBirthday: 0,
  },
  [gradeCouponKey]: {
    BRONZE: {discount:0, availableMinPrice:0},
    SILVER: {discount:0, availableMinPrice:0},
    GOLD: {discount:0, availableMinPrice:0},
    PLATINUM: {discount:0, availableMinPrice:0},
    DIA: {discount:0, availableMinPrice:0},
    THEBARF: {discount:0, availableMinPrice:0},
  },
};

const initialFormErrors = {};

function CouponSettingPage() {

  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState(initialFormErrors);

  console.log(formValues);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log('제출!');
    alert('위험성 경고')
  }; // * onSubmitHandler




  return (
    <>
      <MetaTitle title="쿠폰정책 설정" admin={true} />
      <AdminLayout>
        <AdminContentWrapper id={s.main}>
          <div className={'title_main'}>
            <h1>쿠폰정책 설정</h1>
          </div>
          <form action="/" method="post" onSubmit={onSubmitHandler}>
            <div className="cont">
              <div className="cont_body">
                <section className={s.section}>
                  <h2 className={s['title']}>자동발행 쿠폰</h2>
                  <AutoPublishedCouponSettingInput
                    label={'정기구독 할인 쿠폰'}
                    id={'describe'}
                    name={autoCouponKey}
                    formValues={formValues}
                    setFormValues={setFormValues}
                    formErrors={formErrors}
                  />
                  <AutoPublishedCouponSettingInput
                    label={'반려견 생일 쿠폰'}
                    id={'dogBirthday'}
                    name={autoCouponKey}
                    formValues={formValues}
                    setFormValues={setFormValues}
                    formErrors={formErrors}
                  />
                  <AutoPublishedCouponSettingInput
                    label={'견주 생일 쿠폰'}
                    id={'userBirthday'}
                    name={autoCouponKey}
                    formValues={formValues}
                    setFormValues={setFormValues}
                    formErrors={formErrors}
                  />
                </section>
                <section className={s.section}>
                  <h2 className={s['title']}>등급할인 쿠폰</h2>
                  <GradeCouponSettingInput
                    label={'브론즈'}
                    id={'BRONZE'}
                    type={['discount','availableMinPrice']}
                    name={gradeCouponKey}
                    formValues={formValues}
                    setFormValues={setFormValues}
                    formErrors={formErrors}
                  />
                  <GradeCouponSettingInput
                    label={'실버'}
                    id={'SILVER'}
                    type={['discount','availableMinPrice']}
                    name={gradeCouponKey}
                    formValues={formValues}
                    setFormValues={setFormValues}
                    formErrors={formErrors}
                  />
                  <GradeCouponSettingInput
                    label={'골드'}
                    id={'GOLD'}
                    type={['discount','availableMinPrice']}
                    name={gradeCouponKey}
                    formValues={formValues}
                    setFormValues={setFormValues}
                    formErrors={formErrors}
                  />
                  <GradeCouponSettingInput
                    label={'플래티넘'}
                    id={'PLATINUM'}
                    type={['discount','availableMinPrice']}
                    name={gradeCouponKey}
                    formValues={formValues}
                    setFormValues={setFormValues}
                    formErrors={formErrors}
                  />
                  <GradeCouponSettingInput
                    label={'다이아'}
                    id={'DIA'}
                    type={['discount','availableMinPrice']}
                    name={gradeCouponKey}
                    formValues={formValues}
                    setFormValues={setFormValues}
                    formErrors={formErrors}
                  />
                  <GradeCouponSettingInput
                    label={'더바프'}
                    id={'THEBARF'}
                    type={['discount','availableMinPrice']}
                    name={gradeCouponKey}
                    formValues={formValues}
                    setFormValues={setFormValues}
                    formErrors={formErrors}
                  />
                </section>
              </div>
            </div>

            <section className="btn_section">
              <button type="submit" id="btn-create" className="admin_btn confirm_l solid">
                설정 저장
              </button>
            </section>
          </form>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default CouponSettingPage;