import React, {useEffect, useState} from 'react';
import Checkbox from "/src/components/atoms/Checkbox";
import AmdinErrorMessage from "/src/components/atoms/AmdinErrorMessage";
import dynamic from "next/dynamic";
import UserList from "/src/pages/bf-admin/popup/searchUser/UserList";
import s from "/src/pages/bf-admin/popup/searchUser/searchUser.module.scss";
import ErrorMessage from "/src/components/atoms/ErrorMessage";
import {valid_isTheSameArray} from "/util/func/validation/validationPackage";
import Spinner from "/src/components/atoms/Spinner";
import {getData} from "/api/reqData";
const WindowOpener = dynamic(() => import('/util/func/window-opener'), { ssr: false });
import {TEST_MEMBERS} from "/store/data/test/user";




/* ! TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST
*  회원검색결과 -> API 로 받아온 데이터 아님 // API테스트 후에 다시 제대로 진행하기
*  회원검색결과 -> API 로 받아온 데이터 아님 // API테스트 후에 다시 제대로 진행하기
*  회원검색결과 -> API 로 받아온 데이터 아님 // API테스트 후에 다시 제대로 진행하기
*  회원검색결과 -> API 로 받아온 데이터 아님 // API테스트 후에 다시 제대로 진행하기
*  ! TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST
* */




export default function SearchPersonalForm ({id, setFormValues, formErrors})  {
  const getListApiUrl = '/api/admin/members';
  const searchPageSize = 10;
  const apiDataQueryString = 'queryMembersDtoList';
  
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  
  useEffect( () => {
    // console.log('선택된 회원의 ID LIST',selectedItems);
    setFormValues(prevState => ({
      ...prevState,
      memberIdList: selectedItems
    }))
  }, [selectedItems] );
  
  


  const onReceivePopupData = (err, data) => {
    
    console.log('err: ', err,'data: ', data);
    const idList = data;
    if (!Array.isArray(idList) || !idList.length ) {
      return setItemList([]);
    }else {
      (async () => {
        try {
          setIsLoading((prevState) => ({
            ...prevState,
            fetching: true,
          }));
          const res = await getData(getListApiUrl);
          const data = res.data._embedded[apiDataQueryString];
          setItemList(data);
        } catch (err) {
          console.error(err);
          alert('데이터를 가져올 수 없습니다.');
        }
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: false,
        }));
      })();
    }
    
    // ! TESTTESTTESTTESTTESTTESTTESTTEST
    // ! TESTTESTTESTTESTTESTTESTTESTTEST
    // ! TESTTESTTESTTESTTESTTESTTESTTEST
    setItemList(TEST_MEMBERS)
   
  };
  
  
  
  const onAllSelectItemsList = (checked)=>{
    if(checked){
      setSelectedItems(itemList.map(item=> item.id)); // 모두 선택
    }else {
      setSelectedItems([]); //초기화
    }
  }
  
  const valid_allCheckboxexChecked = ()=>{
    if(!Array.isArray(itemList) || !Array.isArray(selectedItems) || itemList.length === 0) return;
    const allSelectedList = itemList.map(item=>item.id);
    return valid_isTheSameArray(allSelectedList, selectedItems);
  };

  
  
  
  
  return (
    <>
      <div className="optional-section">
        <div className="search-box">
          <div className="controls">
            <WindowOpener url={'/bf-admin/popup/searchUser'} bridge={onReceivePopupData} options={{width:825,height:642}}>
              <span className={'admin_btn solid basic_m'} type={'button'}>
                회원검색
              </span>
            </WindowOpener>
            <button className={'admin_btn line basic_m'} type={'button'}>선택삭제</button>
            {formErrors[id] && (
              <ErrorMessage>{formErrors[id]}</ErrorMessage>
            )}
          </div>
          <div className={`${s.cont_viewer} ${s.fullWidth}`}>
            <div className={s.table}>
              <ul className={`${s.table_header}`}>
                <li className={s.table_th}>
                  <Checkbox onClick={onAllSelectItemsList} checked={valid_allCheckboxexChecked()}/>
                </li>
                <li className={s.table_th}>상세보기</li>
                <li className={s.table_th}>등급</li>
                <li className={s.table_th}>이름</li>
                <li className={s.table_th}>아이디</li>
                <li className={s.table_th}>휴대폰 번호</li>
                <li className={s.table_th}>대표견명</li>
                <li className={s.table_th}>누적구매금액</li>
                <li className={s.table_th}>구독여부</li>
                <li className={s.table_th}>장기미접속</li>
              </ul>
              {(() => {
                if (isLoading.fetching) {
                  return <Spinner floating={true} />;
                } else if (!itemList.length) {
                  return <AmdinErrorMessage text="등록된 회원이 존재하지 않습니다." />;
                } else {
                  return <UserList items={itemList} setSelectedItems={setSelectedItems} selectedItems={selectedItems}/>;
                }
              })()}
            </div>
          </div>
        </div>
      </div>
    </>
  )
};