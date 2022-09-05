import React, { useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import SearchTextWithCategory from '/src/components/admin/form/searchBar/SearchTextWithCategory';
import s from './channelTalk.module.scss';
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import ChannelTalkMemberList from './ChannelTalkMemberList';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import Spinner from '/src/components/atoms/Spinner';

export default function ChannelTalkPage() {
  const searchApiUrl = `/api/admin/guests`;
  const searchPageSize = 10;
  const [isLoading, setIsLoading] = useState({});
  const [searchValues, setSearchValues] = useState({});
  const [searchBody, setSearchBody] = useState(null);
  const [itemList, setItemList] = useState([]);
  
  
  
  const pageInterceptor = (res) => {
    res = DUMMY_RES; //  ! TEST
    console.log(res);
    const pageData = res.data.page;
    const curItemList = res.data?._embedded?.queryAdminGuestDtoList || [];
    let newPageInfo = {
      totalPages: pageData.totalPages,
      size: pageData.size,
      totalItems: pageData.totalElements,
      currentPageIndex: pageData.number,
      newPageNumber: pageData.number + 1,
      newItemList: curItemList,
    };
    return newPageInfo;
  };
  
  const onSearchHandler = () => {
    const body = {
      name: searchValues.memberName,
      email: searchValues.memberEmail,
      phoneNumber: searchValues.recipientName,
    };
    setSearchBody(body);
  };
  
  
  const onResetSearchValues = (e) => {
    setSearchValues('');
    console.log('초기화 실행');
  };



  return (
    <>
      <MetaTitle title="친구톡" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">채널톡</h1>
          <section className="cont">
            <SearchTextWithCategory
              searchValue={searchValues}
              title="회원검색"
              name="content"
              className={'fullWidth'}
              id="content"
              options={[
                { label: '이름', value: 'name' },
                { label: '아이디', value: 'email' },
                { label: '휴대폰 번호', value: 'phoneNumber' },
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
              <p className="cont_title cont-left">상담 고객 목록</p>
              <div className="controls cont-left">
                <button className="admin_btn line basic_m autoWidth">목록새로고침</button>
              </div>
            </div>
            <div className={`${s.cont_viewer}`}>
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
                  <AmdinErrorMessage loading={<Spinner />} />
                ) : itemList.length === 0 ? (
                  <AmdinErrorMessage text="조회된 데이터가 없습니다." />
                ) : (
                  <ChannelTalkMemberList items={itemList} />
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
                option={{ apiMethod: 'POST', body: searchBody }}
              />
            </div>
          </section>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}


const DUMMY_RES = {
  data: {
    _embedded: {
      queryAdminGuestDtoList: [
        {
          guestName: '나관리',
          guestEmail: 'admin@gmail.com',
          guestPhoneNumber: '01098761234',
          createdDate: '2022-08-24T10:05:44.308',
          memberId: 8,
          memberName: '관리자',
          memberEmail: 'admin@gmail.com',
          memberPhoneNumber: '01056785678',
          joinDate: '2022-08-24T10:05:42.562',
          firstPaymentDate: '2022-08-24T10:05:44.293',
          paid: true,
          _links: {
            query_member: {
              href: 'http://localhost:8080/api/admin/members/8',
            },
          },
        },
        {
          guestName: '나유저',
          guestEmail: 'user@gmail.com',
          guestPhoneNumber: '01011112222',
          createdDate: '2022-08-24T10:05:44.307',
          memberId: 10,
          memberName: '김회원',
          memberEmail: 'user@gmail.com',
          memberPhoneNumber: '01099038544',
          joinDate: '2022-08-24T10:05:42.718',
          firstPaymentDate: '2022-08-24T10:05:44.293',
          paid: true,
          _links: {
            query_member: {
              href: 'http://localhost:8080/api/admin/members/10',
            },
          },
        },
        {
          guestName: '나그네',
          guestEmail: 'nagne@gmail.com',
          guestPhoneNumber: null,
          createdDate: '2022-08-24T10:05:44.307',
          memberId: null,
          memberName: null,
          memberEmail: null,
          memberPhoneNumber: null,
          joinDate: null,
          firstPaymentDate: null,
          paid: false,
          _links: {
            query_member: {
              href: 'http://localhost:8080/api/admin/members/10',
            },
          },
        },
      ],
    },
    _links: {
      first: {
        href: 'http://localhost:8080/api/admin/guests?page=0&size=2',
      },
      prev: {
        href: 'http://localhost:8080/api/admin/guests?page=0&size=2',
      },
      self: {
        href: 'http://localhost:8080/api/admin/guests?page=1&size=2',
      },
      next: {
        href: 'http://localhost:8080/api/admin/guests?page=2&size=2',
      },
      last: {
        href: 'http://localhost:8080/api/admin/guests?page=3&size=2',
      },
      profile: {
        href: '/docs/index.html#resources-query-admin-guests',
      },
    },
    page: {
      size: 10,
      totalElements: 3,
      totalPages: 1,
      number: 1,
    },
  },
};
