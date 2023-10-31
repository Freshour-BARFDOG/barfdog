import React, {useCallback, useEffect, useState} from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import {AdminContentWrapper} from '/src/components/admin/AdminWrapper';
import SearchTextWithCategory from '/src/components/admin/form/searchBar/SearchTextWithCategory';
import s from './channelTalk.module.scss';
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import ChannelTalkMemberList from './ChannelTalkMemberList';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import Spinner from '/src/components/atoms/Spinner';
import enterKey from "/util/func/enterKey";
import Tooltip from "/src/components/atoms/Tooltip";
import {getDefaultPagenationInfo} from "/util/func/getDefaultPagenationInfo";
import {MirrorTextOnHoverEvent} from "/util/func/MirrorTextOnHoverEvent";


export default function ChannelTalkPage () {
  
  const searchApiUrl = `/api/admin/guests`;
  const searchPageSize = 10;
  const [isLoading, setIsLoading] = useState( {} );
  const [searchValues, setSearchValues] = useState( {} );
  const [searchQuery, setSearchQuery] = useState( null );
  const [itemList, setItemList] = useState( [] );
  const [searchQueryInitialize, setSearchQueryInitialize] = useState( false );
  
  useEffect( () => {
    MirrorTextOnHoverEvent( window );
  }, [itemList] )
  
  
  const pageInterceptor = useCallback( (res, option = {itemQuery: null}) => {
    // res = DUMMY_RES; // ! TEST
    // console.log( res );
    return getDefaultPagenationInfo( res?.data, 'queryAdminGuestDtoList', {pageSize: searchPageSize, setInitialize: setSearchQueryInitialize} );
  }, [] );
  
  
  const onSearchHandler = () => {
    let type = 'name';
    let value = '';
    for (const key in searchValues) {
      const val = searchValues[key];
      if ( val ) {
        type = key;
        value = val;
        break;
      }
    }
    const query = `value=${value}&type=${type}`;
    setSearchQuery( query );
  };
  
  const onResetSearchValues = (e) => {
    setSearchValues( '' );
  };
  
  const onEnterKeyHandler = (e) => {
    enterKey( e, onSearchHandler );
  }
  
  
  return (
    <>
      <MetaTitle title="채널톡" admin={true}/>
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">채널톡</h1>
          <section className="cont">
            <SearchTextWithCategory
              searchValue={searchValues}
              setSearchValue={setSearchValues}
              events={{onKeydown: onEnterKeyHandler}}
              title="회원검색"
              name="content"
              className={'fullWidth'}
              id="content"
              options={[
                {label: '이름', value: 'name'},
                {label: '아이디', value: 'email'},
                {label: '휴대폰 번호', value: 'phoneNumber'},
              ]}
            />
            <div className={'btn_section mt-20'}>
              <button className="admin_btn solid confirm_m" onClick={onSearchHandler}>
                검색
              </button>
              <button className="admin_btn line confirm_m" onClick={onResetSearchValues}>
                초기화
              </button>
            </div>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <h3 className="cont_title cont-left">상담 고객 목록
                <Tooltip message={'비회원 시 입력한 "이메일, 연락처"가 회원가입 후 하나라도 일치할 경우, 회원매칭됩니다.'} messagePosition={'left'}/>
              </h3>
            </div>
            <div className={`${s.cont_viewer} ${s.fullWidth}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>최초 상담일</li>
                  <li className={s.table_th}>상담 이름</li>
                  <li className={s.table_th}>상담 이메일</li>
                  <li className={s.table_th}>상담 연락처</li>
                  <li className={s.table_th}>회원 가입일</li>
                  <li className={s.table_th}>회원 이름</li>
                  <li className={s.table_th}>회원 이메일</li>
                  <li className={s.table_th}>회원 연락처</li>
                  <li className={s.table_th}>최초 결제일</li>
                  <li className={s.table_th}>상세보기</li>
                </ul>
                {isLoading.fetching ? (
                  <AmdinErrorMessage loading={<Spinner/>}/>
                ) : itemList.length === 0 ? (
                  <AmdinErrorMessage text="조회된 데이터가 없습니다."/>
                ) : (
                  <ChannelTalkMemberList items={itemList}/>
                )}
              </div>
            </div>
            <div className={s['pagination-section']}>
              <PaginationWithAPI
                apiURL={searchApiUrl}
                size={searchPageSize}
                pageInterceptor={pageInterceptor}
                setItemList={setItemList}
                setIsLoading={setIsLoading}
                option={{apiMethod: 'GET', body: null, initialize: searchQueryInitialize}}
                urlQuery={searchQuery}
              />
            </div>
          </section>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}
