import React, { useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import PopupWrapper from '/src/components/popup/PopupWrapper';
import { PopupCloseButton_typeX } from '/src/components/popup/PopupCloseButton';
import s from './searchUser.module.scss';
import Checkbox from '/src/components/atoms/Checkbox';
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import UserList from './UserList';
import SearchTextWithCategory from "/src/components/admin/form/searchBar/SearchTextWithCategory";
import Spinner from "../../../components/atoms/Spinner";
import {FullScreenLoading} from "../../../components/admin/fullScreenLoading";
import PaginationWithAPI from "../../../components/atoms/PaginationWithAPI";
import {getData} from "../../../../api/reqData";




const TEST_ITEM = [1, 2, 3, 4, 5,1,1,2];

export default function SearchUserPopup() {
  
  const getListApiUrl = '/api/admin/members';
  const apiDataQueryString = 'queryMembersDtoList';
  const initialQuery = 'email=user%40gmail.com&name=&from=2020-05-11&to=2022-06-30';
 
  const [isLoading, setIsLoading] = useState({});
  const [urlQuery, setUrlQuery] = useState(initialQuery);
  const [searchValue, setSearchValue] = useState({});
  const [userList, setUserList] = useState(TEST_ITEM);

  // console.log(userList)

  const onCloseWindowHandler = () => {
    // 성공하고나서, window 닫는다.
    if (confirm('선택된 고객을 추가하시겠습니까')) {
      window.opener.onSuccess('전송할 데이터');
      window.close();
    }
  };

  const onSearchHandler = async () => {
    // 검색어를 url query에다가 넣는다.
    const res = await getData(`/api/admin/members?page=1&size=5&email="admin@gmail.com"&name=""&from=2022-07-06&to=2022-07-06`);
    console.log(res);
  }
  
  
  
  //
  // if(isLoading){
  //   return <FullScreenLoading/>
  // }
  
  
  return (
    <>
      <MetaTitle title="회원 검색" />
      <div id={s.popup}>
        <PopupWrapper style={{ width: 820 }}>
          <header className={s.header}>
            <div className={s.row}>
              <div className={s.cont}>
                <h1 className={s['popup-title']}>회원검색</h1>
                <PopupCloseButton_typeX />
              </div>
            </div>
          </header>
          <main className={s.body}>
            <div className={s.row}>
              <div className={s['search-wrap']}>
                <SearchTextWithCategory
                  className={s.searchBar}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  title="회원검색"
                  name="keyword"
                  id="keyword"
                  options={[
                    { label: "이메일", value: "email" },
                    { label: "이름", value: "name" },
                  ]}
                  searchButton={<button className={'admin_btn solid basic_l'} type={'button'} onClick={onSearchHandler}>검색</button>}
                />
              </div>
              <div className={s.cont_viewer}>
                <div className={s.table}>
                  <ul className={s.table_header}>
                    <li className={s.table_th}>
                      <Checkbox
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
                  <div className={s['pagination-section']}>
                    <PaginationWithAPI
                      apiURL={getListApiUrl}
                      size={1}
                      queryItemList={apiDataQueryString}
                      setItemList={setUserList}
                      setIsLoading={setIsLoading}
                      />
                  </div>
                </div>
              </div>
              
            </div>
          </main>
          <section className={s['btn-section']}>
            <button
              type={'button'}
              onClick={onCloseWindowHandler}
              className={'admin_btn solid confirm_l'}
            >
              고객추가
            </button>
          </section>
        </PopupWrapper>
      </div>
    </>
  );
}

//
// export async function getServerSideProps (ctx) {
//   const { params, req, res} = ctx;
//   console.log(params)
//   console.log('REQUEST: ',req)
//   console.log('RESPONSE: ', res);
//
//   return {
//     props: {
//       id: 'user1'   }
//   }
//
// }
