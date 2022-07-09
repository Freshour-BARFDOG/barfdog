import React, { useEffect, useState } from 'react';
import Checkbox from '/src/components/atoms/Checkbox';
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import dynamic from 'next/dynamic';
import UserList from '/src/pages/bf-admin/popup/searchUser/UserList';
import s from '/src/pages/bf-admin/popup/searchUser/searchUser.module.scss';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import { valid_isTheSameArray } from '/util/func/validation/validationPackage';
import Spinner from '/src/components/atoms/Spinner';
import { getMemberList } from '/api/getMemberList';
import Tooltip from "../../atoms/Tooltip";

const WindowOpener = dynamic(() => import('/util/func/window-opener'), { ssr: false });


export default function SearchPersonalForm({ id, setFormValues, formErrors }) {

  const [isLoading, setIsLoading] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [selectedItemList, setSelectedItemList] = useState([]);

  
  
  useEffect(() => {
    // console.log('선택된 회원의 ID LIST',selectedItems);
    setFormValues((prevState) => ({
      ...prevState,
      memberIdList: itemList.map(item=>item.id),
    }));
  }, [itemList]);

  const onReceivePopupData = async (err, idList) => {
    // console.log('err: ', err, 'idList: ', idList);
  
    setIsLoading(true);
    const targetMemberIdList = idList;
    if (err) {
      return alert(err);
    } else if (!Array.isArray(targetMemberIdList) || !targetMemberIdList.length) {
      return alert('데이터가 없거나, 불러오는데 실패했습니다.');
    }

    const newMemberList = await getMemberList(targetMemberIdList);
    setItemList(prevState => prevState.concat(newMemberList))
    setIsLoading(false);

  };


  const onAllSelectItemsList = (checked) => {
    if (checked) {
      setSelectedItemList(itemList.map((item) => item.id)); // 모두 선택
    } else {
      setSelectedItemList([]); //초기화
    }
  };
  
  
  const onDeleteItemList = ()=>{
    if(!selectedItemList.length) return alert('선택된 항목이 없습니다.');
    if(confirm(`선택된 ${selectedItemList.length}개의 항목을 삭제하시겠습니까?`)){
      setItemList(prevState => {
        return prevState.filter((item)=> selectedItemList.indexOf(item.id) < 0);
      })
      setSelectedItemList([]);
    }
  }

  const valid_allCheckboxesChecked = () => {
    if (!Array.isArray(itemList) || !Array.isArray(selectedItemList) || itemList.length === 0) return;
    const allSelectedList = itemList.map((item) => item.id);
    return valid_isTheSameArray(allSelectedList, selectedItemList);
  };

  return (
    <>
      <div className="optional-section">
        <div className="search-box">
          <div className="controls">
            <WindowOpener
              url={'/bf-admin/popup/searchUser'}
              bridge={onReceivePopupData}
              options={{ width: 825, height: 642 }}
            >
              <span className={'admin_btn solid basic_m'} type={'button'}>
                회원검색
              </span>
            </WindowOpener>
            <button className={'admin_btn line basic_m'} type={'button'} onClick={onDeleteItemList}>
              선택삭제
            </button>
            <Tooltip message={`1.아래에 추가된 모든 회원에게 쿠폰이 발급됩니다.\n2. 체크박스는 발행할 회원목록을 삭제하는데 사용됩니다.`} messagePosition={'center'} wordBreaking={true} width={'320px'} theme={'white'}/>
            {formErrors[id] && <ErrorMessage>{formErrors[id]}</ErrorMessage>}
          </div>
          <div className={`${s.cont_viewer} ${s.fullWidth} ${s.fixedHeight}`}>
            <div className={s.table}>
              <ul className={`${s.table_header}`}>
                <li className={s.table_th}>
                  <Checkbox onClick={onAllSelectItemsList} checked={valid_allCheckboxesChecked() || ''} />
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
                if (isLoading) {
                  return <Spinner floating={true} />;
                } else if (!itemList.length) {
                  return <AmdinErrorMessage text="발급대상인 회원이 없습니다."/>;
                } else {
                  return (
                    <UserList
                      items={itemList}
                      setSelectedItems={setSelectedItemList}
                      selectedItems={selectedItemList}
                    />
                  );
                }
              })()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
