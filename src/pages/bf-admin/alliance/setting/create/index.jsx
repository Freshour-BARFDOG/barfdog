import React, { useState } from "react";
import { useRouter } from "next/router";
import * as s from '/src/components/admin/alliance/coupon/allianceCoupon.module.scss';
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import InputItem from "/src/components/admin/alliance/coupon/create/InputItem";
import Tooltip from "/src/components/atoms/Tooltip";
import InputWrapper from "/src/components/admin/alliance/coupon/create/InputWrapper";
import Spinner from "/src/components/atoms/Spinner";
import AllianceEventAddInput from "/src/components/admin/alliance/setting/AllianceEventAddInput";
import Modal_global_alert from "/src/components/modal/Modal_global_alert";
import { useModalContext } from "/store/modal-context";
import { createAlliance } from "/service/admin";

const Index = () => {
  const router = useRouter();
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;

  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    allianceName: '',
    allianceCode: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [eventNameList, setEventNameList] = useState([]);

  const isPassed = formValues.allianceName && formValues.allianceCode;

  const handleChange = (id, value) => {
    if (formErrors[id]) {
      setFormErrors((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    }
    if (id === 'allianceCode') {
      const filteredValue = value.replace(/[^a-zA-Z]/g, '').slice(0, 2);
      setFormValues({...formValues, allianceCode: filteredValue});
    } else {
      setFormValues({...formValues, [id]: value});
    }
  }

  const handleSubmit = async () => {
    const body = {
      allianceName: formValues.allianceName,
      allianceCode: formValues.allianceCode,
      eventNameList,
    };

    try {
      const response = await createAlliance(body);
      setIsLoading(true);

      if (response.data) {
        alert('제휴사 등록이 완료됐습니다.');
        router.back();
      }
    } catch (err) {
      const errorMessage = err?.data.message;
      const key = err?.data?.errorCode === '4002' ? 'allianceName' : 'allianceCode';
      setFormErrors({ [key]: errorMessage });
      if (err?.status === 500) {
        mct.alertShow('제휴사 등록에 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div>
      <MetaTitle title="제휴사 등록" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className='title_main'>
            제휴사 등록
          </h1>
          <span className={s.pointCaption}>입력된 사항은 수정이 불가능하니 정확한 값을 입력해주세요</span>
          <section className="cont">
            <div className="cont_body">
              <InputItem
                label='제휴사'
                id='allianceName'
                formValues={formValues}
                formErrors={formErrors}
                handleChange={handleChange}
                fullWidth
              />
              <InputItem
                label={
                  <>
                    <span>Prefix</span>
                    <Tooltip
                      message={`입력한 항목이 쿠폰 코드의 앞자리에\n기입되어 난수쿠폰이 생성됩니다.\nPrefix는 영문만 입력이 가능합니다.\n예) TU 입력 시\n난수쿠폰 코드 : TUOOOOOOOO`}
                      messagePosition='left'
                      wordBreaking
                    />
                  </>
                }
                id='allianceCode'
                formValues={formValues}
                formErrors={formErrors}
                handleChange={handleChange}
                fullWidth
              />
              <InputWrapper
                id='eventName'
                label={
                  <>
                    <span>행사</span>
                    <Tooltip
                      message={`제휴사마다 행사를 여러 개 등록할 수 있습니다.\n행사 추가 및 삭제는 제휴사 상세보기에서 가능합니다.`}
                      messagePosition='center'
                      wordBreaking
                    />
                  </>
                }
              >
                <div style={{ minWidth: '50%' }}>
                  <AllianceEventAddInput
                    eventNameList={eventNameList}
                    setEventNameList={setEventNameList}
                  />
                </div>
              </InputWrapper>
            </div>
          </section>
          <div className="btn_section outer">
            <button
              type="button"
              className='admin_btn confirm_l line'
              onClick={() => router.back()}
            >
              취소
            </button>
            <button
              type="button"
              className={`admin_btn confirm_l solid ${!isPassed ? 'disabled' : ''}`}
              onClick={handleSubmit}
              disabled={!isPassed}
            >
              {isLoading ? (
                <Spinner style={{ color: '#fff' }} />
              ) : (
                '등록'
              )}
            </button>
          </div>
        </AdminContentWrapper>
      </AdminLayout>
      {hasAlert && (
        <Modal_global_alert onClick={() => mct.alertHide()} background />
      )}
    </div>

  );
};

export default Index;