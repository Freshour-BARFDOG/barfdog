import React, {useState} from 'react';
// import s from "./coupon-release.module.scss";
import Checkbox from "/src/components/atoms/Checkbox";
import AmdinErrorMessage from "/src/components/atoms/AmdinErrorMessage";
import dynamic from "next/dynamic";
import UserList from "../../../popup/searchUser/UserList";
import s from "../../../popup/searchUser/searchUser.module.scss";
const WindowOpener = dynamic(() => import('/util/func/window-opener'), { ssr: false });



const TEST_ITEM = [1,2,3,4,5];

export default function CouponReleasePersonalForm (props)  {
  const {setFormValues} = props;

  const [selectedUser, setSelectedUser] = useState([]);
  const [userList, setUserList] = useState(TEST_ITEM);


  // MEMO 체크된 사람들리스트를 selectedUser  &&  setFormValues에 넣는다.

  const onReceivePopupData = (err, data) => {
    // MEMO DATA from POPUP
    console.log('err: ', err,'data: ', data);
    setSelectedUser(data);
    // if (err) {
    //   return setFormErrors((prevState) => ({
    //     ...prevState,
    //     address: err
    //   }));
    // }
    // setFormValues((prevState) => ({
    //   ...prevState,
    //   address: { street:address, zipcode:zonecode, city:sido },
    // }));
  };



  return (
    <>
      <div className="optional-section">
        <div className="search-box">
          <div className="controls">
            <WindowOpener url={'/popup/searchUser'} bridge={onReceivePopupData} options={{width:825,height:642}}>
              <span className={'admin_btn solid basic_m'} type={'button'}>회원검색</span>
            </WindowOpener>
            <button className={'admin_btn line basic_m'} type={'button'}>선택삭제</button>
          </div>
          <div className={s.cont_viewer}>
            <div className={s.table}>
              <ul className={s.table_header}>
                <li className={s.table_th}>
                  <Checkbox
                    id="checkAll"
                    onClick={(isChecked) => {
                      console.log(isChecked);
                    }}
                  />
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
              {userList.length ? (
                <UserList items={userList} />
              ) : (
                <AmdinErrorMessage text="쿠폰을 발행할 대상이 없습니다." />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
};