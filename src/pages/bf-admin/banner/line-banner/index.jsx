import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import s from './admin-line-banner.module.scss';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import CustomRadio from '/src/components/admin/form/CustomRadio';
import ToolTip from '/src/components/atoms/Tooltip';
import { useModalContext } from '/store/modal-context';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import Spinner from '/src/components/atoms/Spinner';
import filter_emptyValue from '/util/func/filter_emptyValue';
import { SketchPicker } from 'react-color';
import { validate } from '/util/func/validation/validation_lineBanner';
import { valid_hasFormErrors } from '/util/func/validation/validationPackage';
import { getData, postObjData, putObjData } from '/src/pages/api/reqData';
import PreviewInnerHTML from '/src/components/atoms/PreviewInnerHTML';



const initialValues = {
  name: '',
  status: 'LEAKED',
  backgroundColor: '',
  fontColor: '',
  pcLinkUrl: '',
  mobileLinkUrl: '',
};

function LineBanner(props) {
  console.log(props)
  const router = useRouter();
  const { id } = router.query;
  const getFormValuesApiUrl = `/api/banners/top`;
  const postFormValuesApiUrl = `/api/banners/top`;
  const putFormValuesApiUrl = `/api/banners/top/${id}`;
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState({});
  const mct = useModalContext();
  const miniEditorFormRef = useRef(null);
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [activeColorPick, setActiveColorPick] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // console.log(formValues);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: true,
        }));
        const res = await getData(getFormValuesApiUrl);
        console.log(res);
        const DATA = res?.data;
        const thisItemId = DATA?.id;
        if (thisItemId) {
          await router.push(`/bf-admin/banner/line-banner?id=${thisItemId}`);
          const initialFormValues = {
            name: DATA.name,
            status: DATA.status,
            backgroundColor: DATA.backgroundColor,
            fontColor: DATA.fontColor,
            pcLinkUrl: DATA.pcLinkUrl,
            mobileLinkUrl: DATA.mobileLinkUrl,
          };
          setFormValues(initialFormValues);
          textField.document.querySelector('body').innerHTML = DATA.name;
        }
      } catch (err) {
        console.error('Failed Get Data:',err);
        alert(err);
      }
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    })();
  }, []);

  useEffect(() => {
    const miniEditor = miniEditorFormRef.current;
    if (document && miniEditor) {
      textField.document.designMode = 'On';
      const buttons = miniEditor.querySelectorAll('button');
      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const cmd = btn.dataset.cmd;
          if (cmd === 'insertImage' || cmd === 'createLink') {
            let url = prompt('Enter Link Here:', '');
            textField.document.execCommand(cmd, false, url);
          } else {
            textField.document.execCommand(cmd, false, null);
          }
        });
        textField.document.querySelector('body').addEventListener('keyup', (e) => {
          const innerHTML = e.currentTarget.innerHTML;
          setFormValues((prevState) => ({
            ...prevState,
            name: innerHTML,
          }));
        });
      });
    }
  }, [miniEditorFormRef]);

  const onInputChangeHandler = (e) => {
    const input = e.currentTarget;
    const { id, value } = input;
    const filteredType = input.dataset.filteredType;
    let filteredValue = value;
    if (filteredType === 'link') {
      filteredValue = filter_emptyValue(filteredValue);
    }
    setFormValues({
      ...formValues,
      [id]: filteredValue,
    });
  };

  const onChangeColorComplete = (color) => {
    const hexColor = color.hex;
    setFormValues((prevState) => ({
      ...prevState,
      fontColor: hexColor,
    }));
  };
  const onChangeBackgroundColorComplete = (color) => {
    const hexColor = color.hex;
    setFormValues((prevState) => ({
      ...prevState,
      backgroundColor: hexColor,
    }));
  };

  const onActiveColorPicker = (e) => {
    const button = e.currentTarget;
    const targetType = button.dataset.activeTarget;
    const typeList = ['backgroundColor', 'fontColor'];
    typeList.forEach((thisType) => {
      targetType === thisType &&
        setActiveColorPick((prevState) => ({
          [targetType]: !prevState[targetType],
        }));
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitted) return;
    // ! IMPORTANT : create Event후, 사용자가 enter를 쳤을 경우, 똑같은 요청이 전송되지 않게 하기 위해서 필요함.
    console.log(formValues);
    const errObj = validate(formValues);
    setFormErrors(errObj);
    const isPassed = valid_hasFormErrors(errObj);
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      if (isPassed) {
        const res = id
          ? await putObjData(putFormValuesApiUrl, formValues)
          : await postObjData(postFormValuesApiUrl, formValues);
        if (res.isDone) {
          mct.alertShow();
          setModalMessage('상단배너가 등록되었습니다.');
          setIsSubmitted(true);
        } else {
          alert(res.error, '\n내부 통신장애입니다. 잠시 후 다시 시도해주세요.');
        }
      }
    } catch (err) {
      alert('API통신 오류가 발생했습니다. 서버관리자에게 문의하세요.');
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

  const onGlobalModalCallback = () => {
    mct.alertHide();
    router.push('/bf-admin/banner/line-banner');
    //169 번 아이디
  };

  return (
    <>
      <MetaTitle title="상단 띠배너 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>
              상단 띠 배너
              {isLoading.fetching && (
                <Spinner
                  style={{ color: 'var(--color-main)', width: '15', height: '15' }}
                  speed={0.6}
                />
              )}
            </h1>
          </div>
          <div className={`${s.hasColorPicker} ${s.cont} cont`}>
            <div className="cont_body">
              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="name">
                      배너이름
                      <ToolTip
                        message={'띠 배너에 삽입될 텍스트입니다.'}
                        messagePosition={'left'}
                      />
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className={`${s['miniEditor-container']} inp_box`}>
                      <iframe
                        name="textField"
                        frameBorder="0"
                        className={`${s.miniEditor} fullWidth`}
                      ></iframe>
                      <form
                        id="name"
                        className={s['miniEditor-buttons']}
                        ref={miniEditorFormRef}
                        onChange={onInputChangeHandler}
                      >
                        <button type="button" className={'admin_btn line basic_m'} data-cmd="bold">
                          B
                        </button>
                        <button
                          type="button"
                          className={'admin_btn line basic_m'}
                          data-cmd="italic"
                        >
                          I
                        </button>
                      </form>

                      {formErrors.name && <ErrorMessage>{formErrors.name}</ErrorMessage>}
                    </div>
                  </div>
                </div>
              </div>
              {/* cont_divider */}
              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="fontColor">
                      글자색
                      <i
                        className={s['preview-color']}
                        style={{ backgroundColor: formValues.fontColor }}
                      />
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className={`${s.inp_box} inp_box`}>
                      <input id={'fontColor'} type="text" disabled value={formValues.fontColor} />
                      <div className={s['colorPicker-container']}>
                        <button
                          type={'button'}
                          data-active-target={'fontColor'}
                          className={'admin_btn line basic_l'}
                          onClick={onActiveColorPicker}
                        >
                          색상 선택
                        </button>
                        {activeColorPick.fontColor && (
                          <SketchPicker
                            data-desc={'글자 선택'}
                            className={s.colorPicker}
                            color={formValues.fontColor}
                            onChangeComplete={onChangeColorComplete}
                          />
                        )}
                      </div>
                      {formErrors.fontColor && <ErrorMessage>{formErrors.fontColor}</ErrorMessage>}
                    </div>
                  </div>
                </div>
              </div>
              {/* cont_divider */}
              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="banner-name">
                      배경색
                      <i
                        className={s['preview-color']}
                        style={{ backgroundColor: formValues.backgroundColor }}
                      />
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className={`${s.inp_box} inp_box`}>
                      <input
                        id={'backgroundColor'}
                        type="text"
                        disabled
                        value={formValues.backgroundColor}
                      />
                      <div className={s['colorPicker-container']}>
                        <button
                          type={'button'}
                          data-active-target={'backgroundColor'}
                          className={'admin_btn line basic_l'}
                          onClick={onActiveColorPicker}
                        >
                          색상 선택
                        </button>
                        {activeColorPick.backgroundColor && (
                          <SketchPicker
                            data-desc={'글자 선택'}
                            className={s.colorPicker}
                            color={formValues.backgroundColor}
                            onChangeComplete={onChangeBackgroundColorComplete}
                          />
                        )}
                      </div>
                      {formErrors.backgroundColor && (
                        <ErrorMessage>{formErrors.backgroundColor}</ErrorMessage>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* cont_divider */}
              <div className="cont_divider">
                <div className="input_row upload_image">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="pcLinkUrl">
                      연결링크(PC)
                      <ToolTip
                        message={'*링크가 없을 경우, 배너 클릭 이벤트가 발생하지 않습니다.'}
                        messagePosition={'left'}
                      />
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <input
                        type="text"
                        id="pcLinkUrl"
                        data-filtered-type={'link'}
                        className="halfWidth"
                        value={formValues.pcLinkUrl}
                        onChange={onInputChangeHandler}
                        placeholder="ex. https://barfdog.co.kr/path/PcLink"
                      />
                    </div>
                    {formErrors.pcLinkUrl && <ErrorMessage>{formErrors.pcLinkUrl}</ErrorMessage>}
                  </div>
                </div>
              </div>
              {/* cont_divider */}
              <div className="cont_divider">
                <div className="input_row upload_image">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="mobileLinkUrl">
                      연결링크(Mobile)
                      <ToolTip
                        message={'*링크가 없을 경우, 배너 클릭 이벤트가 발생하지 않습니다.'}
                        messagePosition={'left'}
                      />
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <input
                        type="text"
                        id="mobileLinkUrl"
                        data-filtered-type={'link'}
                        className="halfWidth"
                        onChange={onInputChangeHandler}
                        value={formValues.mobileLinkUrl}
                        placeholder="ex. https://barfdog.co.kr/path/MobileLink"
                      />
                    </div>
                    {formErrors.mobileLinkUrl && (
                      <ErrorMessage>{formErrors.mobileLinkUrl}</ErrorMessage>
                    )}
                  </div>
                </div>
              </div>
              {/* cont_divider */}
              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section">
                    <p className="title">노출여부</p>
                  </div>
                  <div className="inp_section">
                    <CustomRadio
                      setValue={setFormValues}
                      name="status"
                      idList={['LEAKED', 'HIDDEN']}
                      labelList={['Y', 'N']}
                      value={formValues.status}
                    />
                  </div>
                </div>
              </div>
              {/* cont_divider */}
              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section">
                    <p className="title">미리보기</p>
                  </div>
                  <div className="inp_section">
                    <PreviewInnerHTML
                      innerHTML={formValues.name}
                      style={{
                        backgroundColor: formValues.backgroundColor,
                        color: formValues.fontColor,
                      }}
                    />
                  </div>
                </div>
              </div>
              {/* cont_divider */}
            </div>
          </div>
          <div className="cont_bottom">
            <div className="btn_section">
              <button
                type="button"
                id="btn-cancle"
                className="admin_btn confirm_l line"
                onClick={returnToPrevPage}
              >
                취소
              </button>
              <button
                type="submit"
                id="btn-create"
                className="admin_btn confirm_l solid"
                onClick={onSubmit}
              >
                {isLoading.submit ? (
                  <Spinner style={{ color: '#fff', width: '15', height: '15' }} speed={0.6} />
                ) : (
                  '등록'
                )}
              </button>
            </div>
          </div>
        </AdminContentWrapper>
      </AdminLayout>
      <Modal_global_alert message={modalMessage} onClick={onGlobalModalCallback} background />
    </>
  );
}

export default LineBanner;


//
//
// export async function getStaticProps(context) {
//
//   const data = context;
//
//   // if (!params) {
//   //   return {
//   //     redirect: { destination: "/no-data" },
//   //   };
//   // }
//
//
//   return {
//     props: {
//       id: data,
//     },
//   };
// }
