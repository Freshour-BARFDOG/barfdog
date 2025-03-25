import React, {useState} from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import {AdminContentWrapper} from '/src/components/admin/AdminWrapper';
import CustomRadio from '/src/components/admin/form/CustomRadio';
import FormOfGroupType from '/src/components/admin/messenger/friendTalk/FormOfGroupType';
import Link from 'next/link';
import popupWindow from "/util/func/popupWindow";
import ErrorMessage from "/src/components/atoms/ErrorMessage";
import filter_emptyValue from "/util/func/filter_emptyValue";
import filter_onlyNumber from "/util/func/filter_onlyNumber";
import ToolTip from "/src/components/atoms/Tooltip";
import {postObjData} from '/src/pages/api/reqData';
import Spinner from "/src/components/atoms/Spinner";
import {useModalContext} from "/store/modal-context";
import Modal_global_alert from "/src/components/modal/Modal_global_alert";
import {global_areaType} from "/store/TYPE/areaType";
import {validateExposedAllTarget, validateExposedGroupTarget} from "/util/func/validation/validation_friendTalk";
import {valid_hasFormErrors} from "/util/func/validation/validationPackage";
import {getGradeList} from "/store/TYPE/gradeType";


const initFormValues = {
  templateNum: '', // string
  exposedTarget: "GROUP", // ALL, GROUP
  gradeStart: '',  //  현재 초기값 할당 불가 // select 태그에서 선택
  gradeEnd: '', //  현재 초기값 할당 불가 // select 태그에서 선택
  subscribe: "subscribe-Y", // subscribe-N, subscribe-Y
  birthYearFrom: '', //  현재 초기값 할당 불가 // select 태그에서 선택
  birthYearTo: '', //  현재 초기값 할당 불가 // select 태그에서 선택
  area: global_areaType.ALL,
  longUnconnected: "term-YES", // term-YES', 'term-NO'
}

function FriendTalkPage () {
  
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const [formValues, setFormValues] = useState( initFormValues );
  const [formErrors, setFormErrors] = useState( {} );
  const [isLoading, setIsLoading] = useState( {} );
  const [submitted, setSubmitted] = useState( false );
  
  const onInputChangeHandler = (e) => {
    const input = e.currentTarget;
    const {id, value} = input;
    let filteredValue = value;
    const filteredType = input.dataset.inputType;
    if ( filteredType ) {
      filteredValue = filter_emptyValue( value );
      if ( filteredType.indexOf( 'number' ) >= 0 ) {
        filteredValue = filter_onlyNumber( filteredValue );
      }
    }
    setFormValues( (prevState) => ({
      ...prevState,
      [id]: filteredValue,
    }) );
  }
  
  
  const onPopupHandler = (e) => {
    e.preventDefault();
    if ( typeof window === 'undefined' ) return;
    const href = e.currentTarget.href;
    popupWindow( href, {width: 1000, height: 716} );
  }
  
  
  const sendFriendTalk = async () => {
    if ( submitted ) {
      alert( '이미 처리된 양식입니다.' );
      return window.location.reload();
    }
    
    const errObj = formValues.exposedTarget === 'ALL'
      ? validateExposedAllTarget( formValues )
      : validateExposedGroupTarget( formValues );
    
    setFormErrors( errObj );
    const isPassed = valid_hasFormErrors( errObj );
    if ( !isPassed ) return mct.alertShow( '유효하지 않은 항목이 있습니다' );
    
    try {
      setIsLoading( {submit: true} );
      
      let body, res;
      
      if ( formValues.exposedTarget === 'ALL' ) {
        
        body = {
          templateNum: formValues.templateNum
        }
        
        res = await postObjData( `/api/admin/friendTalk/all`, body );
        
      } else if ( formValues.exposedTarget === 'GROUP' ) {
        
        const body = {
          templateNum: formValues.templateNum,
          gradeList: getGradeList(formValues.gradeStart, formValues.gradeEnd),
          subscribe: formValues.subscribe === 'subscribe-Y',
          birthYearFrom: formValues.birthYearFrom,
          birthYearTo: formValues.birthYearTo,
          area: formValues.area,
          longUnconnected: formValues.longUnconnected === 'term-YES',
        }
        
        res = await postObjData( `/api/admin/friendTalk/group`, body );
        
      }
      
      apiCallback( res );
      
    } catch (err) {
      mct.alertShow( "데이터를 전송할 수 없습니다." );
      console.error( err );
    } finally {
      setIsLoading( {submit: false} );
    }
    
  }

  
  
  const apiCallback = (res) => {
    if ( res && res.isDone && res.data ) {
      const data = res.data.data;
      // 다이렉트 센드 responseCode, 200이 아니면 다이렉트센드 내부 문제
      const responseCode = data.responseCode;
      // 다이렉트센드 status
      const status = data.status;
      if (responseCode === 200 && status === 1) {
        mct.alertShow( '친구톡 전송 완료.', onSuccessCallback );
      } else if ( status === 301 ) {
        mct.alertShow( '조건에 해당하는 회원이 없습니다.' );
      } else if ( status === 320 ) {
        mct.alertShow( '발송 가능한 시간이 아닙니다.' );
      } else if ( responseCode !== 200 ) {
        mct.alertShow( '다이렉트 센드 내부 문제로 발송에 실패하였습니다.' );
      } else if ( data.message ) {
        mct.alertShow( data.message );
      }
    } else {
      mct.alertShow( '데이터 처리 중 오류가 발생하였습니다.' );
    }
  };
  
  const onSuccessCallback = () => {
    setSubmitted( true );
    window.location.reload();
  };
  
  return (
    <>
      <MetaTitle title="친구톡" admin={true}/>
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">친구톡</h1>
          <article
            className="cont"
          >
            <div className="cont_body">
              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="templateList">
                      템플릿 번호
                      <ToolTip message={'다이렉트 샌드에서 템플릿 목록을 제공하지 않으므로, 직접 템플릿 번호를 확인하시기 바랍니다.'} messagePosition={'center'} width={'300px'} wordBreaking/>
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <input id={"templateNum"}
                             className={'halfWidth'}
                             type="text"
                             onChange={onInputChangeHandler}
                             data-input-type={'number'}
                             value={formValues.templateNum || ''}
                             placeholder={'템플릿 번호를 입력하세요.'}/>
                    </div>
                    {formErrors.templateNum && (
                      <ErrorMessage>{formErrors.templateNum}</ErrorMessage>
                    )}
                  </div>
                </div>
              </div>
              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="releaseTarget">
                      발행 대상
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <CustomRadio
                        value={formValues.exposedTarget}
                        setValue={setFormValues}
                        name="exposedTarget"
                        idList={['ALL', 'GROUP']}
                        labelList={['전체', '그룹']}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {formValues.exposedTarget === 'GROUP' && (
                <FormOfGroupType formValues={formValues} setFormValues={setFormValues} formErrors={formErrors}/>
              )}
            </div>
            <div className="cont_bottom">
              <div className="btn_section">
                <Link href={`https://directsend.co.kr/`} passHref>
                  <a target="_blank" className="admin_btn confirm_l line" onClick={onPopupHandler}>
                    템플릿 확인
                  </a>
                </Link>
                <button type="submit" id="btn-create" className="admin_btn confirm_l solid"
                        onClick={sendFriendTalk}>
                  {isLoading.submit ? <Spinner style={{color: '#fff'}}/> : "전송하기"}
                </button>
              </div>
            </div>
          </article>
        </AdminContentWrapper>
      </AdminLayout>
      {hasAlert && <Modal_global_alert onClick={submitted && onSuccessCallback} background/>}
    </>
  );
}

export default FriendTalkPage;
