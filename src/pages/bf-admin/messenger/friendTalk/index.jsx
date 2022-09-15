import React, { useEffect, useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import CustomRadio from '/src/components/admin/form/CustomRadio';
import FormOfGroupType from '/src/components/admin/messenger/friendTalk/FormOfGroupType';
import Link from 'next/link';
import popupWindow from "/util/func/popupWindow";
import ErrorMessage from "/src/components/atoms/ErrorMessage";
import filter_emptyValue from "/util/func/filter_emptyValue";
import filter_onlyNumber from "/util/func/filter_onlyNumber";
import ToolTip from "/src/components/atoms/Tooltip";
import { postObjData, getDataSSR ,postDataSSR} from '/src/pages/api/reqData';
import { gradeTransferFilter } from '/util/func/filter_gradeTransfer';



function FriendTalkPage() {
  const [isModalActive, setIsModalActive] = useState(false);
  
  const initialValues = {
    template: '템플릿 정보를 전달합니다.',
    exposedTarget: 'ALL',
  };
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  
  // const onShowModal = () => {
  //   setIsModalActive(true);
  // };
  
  const onInputChangeHandler = (e)=>{
    const input = e.currentTarget;
    const { id, value } = input;
    let filteredValue = value;
    const filteredType = input.dataset.inputType;
    if (filteredType) {
      filteredValue = filter_emptyValue(value);
      if (filteredType.indexOf('number') >= 0) {
        filteredValue = filter_onlyNumber(filteredValue);
      }
    }
    setFormValues((prevState) => ({
      ...prevState,
      [id]: filteredValue,
    }));
  }
  
  
  const onPopupHandler = (e) => {
    e.preventDefault();
    if(typeof window === 'undefined') return;
    const href = e.currentTarget.href;
    popupWindow(href, {width:1000, height:716});
  }
  
  const sendFriendTalk = async() => {
    if(formValues.template=== undefined){
      alert('템플릿 번호를 선택해주세요');
      return;
    }

    // console.log(formValues);

    if(formValues?.exposedTarget === 'GROUP'){

    if(formValues.gradeStart.value === undefined){
      alert('회원등급을 선택해주세요');
      return;

    }else if(formValues.ageStart.value === undefined){
      alert('연령을 선택해주세요');
      return;
    }
      const ageEnd = formValues.ageEnd === undefined ? formValues.ageStart.value:formValues.ageEnd.value;
      // const gradeList = formValues.gradeEnd === undefined ? [formValues.gradeStart.value] : [formValues.gradeStart.value, formValues.gradeEnd.value];
      const gradeList = [...new Set(formValues.gradeEnd === undefined ? [gradeTransferFilter(formValues.gradeStart.value)] : [gradeTransferFilter(formValues.gradeStart.value), gradeTransferFilter(formValues.gradeEnd.value)])];
// 브론즈, 실버, 골드, 플래티넘, 다이아몬드, 더바프

      const body = {
        templateNum : formValues.template,
        gradeList : gradeList,
        subscribe : formValues.subscribeYN === 'subscrib-N' ? false:true,
        birthYearFrom : formValues.ageStart.value,
        birthYearTo : ageEnd,
        area : formValues.area === undefined?'ALL':formValues.area,
        longUnconnected : formValues.unconnectedTerm === 'term-NO' ? false : true,
        };

      // console.log(formValues.unconnectedTerm);
      // console.log(body);

      const res = await postObjData(`/api/admin/friendTalk/group`,body);
      // console.log(res);
      
      if(res.isDone){
        // console.log(res.data.data);

        // 다이렉트 센드 responseCode, 200이 아니면 다이렉트센드 내부 문제
        const responseCode = res.data.data.responseCode;
        // 다이렉트센드 status
        const status = res.data.data.status;
        
        if(responseCode != 200){
          alert('다이렉트 센드 내부문제');
        }else if(status === 1 && responseCode === 200){
          alert('성공');
        }

        if(res.data.data.message!=null){
          alert(res.data.data.message);        
        }
        
      }

    }else{
      
      const res = await postObjData(`/api/admin/friendTalk/all`,{
        templateNum: formValues.template
      });
      // console.log(res);
      
      if(res.isDone){
      console.log(res.data.data);

        // 다이렉트 센드 responseCode, 200이 아니면 다이렉트센드 내부 문제
        const responseCode = res.data.data.responseCode;
        // 다이렉트센드 status
        const status = res.data.data.status;
  
        if(responseCode != 200){
          alert('다이렉트 센드 내부문제');
        }else if(status === 1 && responseCode === 200){
          alert('성공');
        }
        
        if(res.data.data.message!=null){
          alert(res.data.data.message);        
        }
        
      }
      
    }
  }

  return (
    <>
      <MetaTitle title="친구톡" admin={true} />
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
                      {/*<CustomSelectForTwoSelects*/}
                      {/*  name="template"*/}
                      {/*  id="template"*/}
                      {/*  options={[*/}
                      {/*    { label: '선택', value: '' },*/}
                      {/*    { label: 'template-1', value: 'template-1 정보' },*/}
                      {/*    { label: 'template-2', value: 'template-2 정보' },*/}
                      {/*    { label: 'template-3', value: 'template-3 정보' },*/}
                      {/*  ]}*/}
                      {/*  onChange={setFormValues}*/}
                      {/*/>*/}
                      <input id={"template"} className={'halfWidth'} type="text" onChange={onInputChangeHandler} data-input-type={'number'} value={formValues.template} placeholder={'템플릿 번호를 입력하세요.'}/>
                      {formErrors.name && (
                          <ErrorMessage>{formErrors.name}</ErrorMessage>
                      )}
                    </div>
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
                        setValue={setFormValues}
                        name="exposedTarget"
                        idList={['ALL', 'GROUP']}
                        labelList={['전체', '그룹']}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {formValues?.exposedTarget === 'GROUP' && (
                <FormOfGroupType setFormValues={setFormValues} />
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
                  전송하기
                </button>
              </div>
            </div>
          </article>
        </AdminContentWrapper>
      </AdminLayout>
      {/*{isModalActive && <Modal_alimTalk_Preview onModalActive={setIsModalActive} data={formValues.template}/> }*/}
    </>
  );
}

export default FriendTalkPage;
