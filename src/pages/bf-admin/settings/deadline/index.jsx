import React, { useEffect, useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import filter_extraIntegerNumberZero from '/util/func/filter_extraIntegerNumberZero';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import { useModalContext } from '/store/modal-context';
import { getData, putObjData } from '/src/pages/api/reqData';
import { validate } from '/util/func/validation/validation_siteSettings';
import { valid_hasFormErrors } from '/util/func/validation/validationPackage';
import Spinner from '/src/components/atoms/Spinner';
import transformDate from '/util/func/transformDate';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import transformClearLocalCurrency from '/util/func/transformClearLocalCurrency';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import Tooltip from '/src/components/atoms/Tooltip';
import s from '/src/components/admin/settings/adminSettings.module.scss';
import pc from '/src/components/atoms/pureCheckbox.module.scss';

function DeadlineSettingPage() {
  const getValueApiUrl = `/api/banners/deadline`;
  const putValueApiUrl = `/api/admin/deadline`;
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const [isLoading, setIsLoading] = useState({});
  const [value, setValue] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: true,
        }));
        const res = await getData(getValueApiUrl);
        // console.log(res);
        const initialValue = { orderDeadline: res.data.orderDeadline };
        setValue(initialValue);
      } catch (err) {
        console.error(err);
      }
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    })();
  }, []);

  const onChangeHandler = (e, day) => {
    setValue({ orderDeadline: day });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitted) return window.location.reload();

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      const res = await putObjData(putValueApiUrl, value);
      console.log(res);
      if (res.isDone) {
        mct.alertShow('주문마감일이 변경되었습니다.', onSuccessCallback);
        setIsSubmitted(true);
      } else {
        mct.alertShow('데이터 전송에 실패하였습니다.');
      }
    } catch (err) {
      mct.alertShow('API통신 오류가 발생했습니다. 서버관리자에게 문의하세요.');
      console.error(err);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: false,
      }));
    }
  };

  const onSuccessCallback = () => {
    window.location.reload();
  };

  const onClickModalButton = () => {
    mct.alertHide();
  };

  const dayList = [
    { label: '일', value: 'sun' },
    { label: '월', value: 'mon' },
    { label: '화', value: 'tue' },
    { label: '수', value: 'wed' },
    { label: '목', value: 'thu' },
    { label: '금', value: 'fri' },
    { label: '토', value: 'sat' },
  ];

  return (
    <>
      <MetaTitle title="주문마감일 변경" admin={true} />
      <AdminLayout>
        <AdminContentWrapper id={s.main}>
          <div className="title_main">
            <h1 className={s['main-title']}>주문마감일 변경</h1>
          </div>
          <form action="/" method="post">
            <div className="cont">
              <div className="cont_body">
                <div className="cont_divider">
                  <div className="input_row">
                    <div className="title_section fixedHeight">
                      <label className="title" htmlFor={`price`}>
                        주문마감일 요일 변경
                      </label>
                    </div>

                    <ul className={s.checkboxWrapper}>
                      {dayList.map((day, index) => {
                        const isChecked = day.value === value?.orderDeadline;
                        return (
                          <div
                            className={`${pc['checkbox-wrap']} day-list`}
                            key={index}
                          >
                            <label
                              htmlFor={day.value}
                              className={`${pc.checkbox}`}
                            >
                              <input
                                onChange={(e) => onChangeHandler(e, day.value)}
                                type="checkbox"
                                id={day.value}
                                checked={isChecked}
                              />
                              <span className={pc.fakeCheckBox} />
                              <span>{day.label}</span>
                            </label>
                          </div>
                        );
                      })}
                    </ul>

                    {/* <div className="inp_section">
                      <div className={`inp_box`}>
                        <input
                          id={`price`}
                          className={'text-align-right'}
                          type="text"
                          data-input-type={'number, currency'}
                          // value={formValues.price || ''}
                          // onChange={onInputChangeHandler}
                        />
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
            <section className="btn_section">
              <button
                type="button"
                id="btn-create"
                className="admin_btn confirm_l solid"
                onClick={onSubmit}
              >
                {isLoading.submit ? (
                  <Spinner style={{ color: '#fff' }} />
                ) : (
                  '설정 저장'
                )}
              </button>
            </section>
          </form>
        </AdminContentWrapper>
      </AdminLayout>
      {hasAlert && (
        <Modal_global_alert onClick={onClickModalButton} background />
      )}
    </>
  );
}

export default DeadlineSettingPage;
