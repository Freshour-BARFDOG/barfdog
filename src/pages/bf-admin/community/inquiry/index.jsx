import React, { useState, useCallback } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Spinner from '/src/components/atoms/Spinner';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import SearchBar from '../../../../components/admin/form/searchBar';
import SearchTerm from '../../../../components/admin/form/searchBar/SearchTerm';
import SearchTextWithCategory from '../../../../components/admin/form/searchBar/SearchTextWithCategory';

import SearchRadio from '../../../../components/admin/form/searchBar/SearchRadio';
import { useModalContext } from '../../../../../store/modal-context';
import Modal_global_alert from '../../../../components/modal/Modal_global_alert';
import { transformToday } from '../../../../../util/func/transformDate';

import s from './adminInquiryItems.module.scss';
import PaginationWithAPI from '../../../../components/atoms/PaginationWithAPI';

import AmdinErrorMessage from '../../../../components/atoms/AmdinErrorMessage';
import PureCheckbox from '../../../../components/atoms/PureCheckbox';
import { valid_isTheSameArray } from '../../../../../util/func/validation/validationPackage';
import { inquiryStatusType } from '/store/TYPE/inquiry/inquiryStatusType';
import { inquiryCategoryType } from '/store/TYPE/inquiry/inquiryCategoryType';
import InquiryItemList from "./InquiryItemList";

const initialSearchValues = {
  from: transformToday(),
  to: transformToday(),
  name: null,
  email: null,
  answerStatus: null,
};

export default function InquiryListPage() {
  const searchApiUrl = `/api/admin/questions`;
  const searchPageSize = 10;
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const [itemList, setItemList] = useState([]);
  const [isLoading, setIsLoading] = useState({});
  const [searchValues, setSearchValues] = useState(initialSearchValues);
  const [searchBody, setSearchBody] = useState({});
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const allItemIdList = itemList.map((item) => item.id);

  console.log(itemList);

  const onResetSearchValues = () => {
    setSearchValues(initialSearchValues);
  };

  const onSearch = useCallback(
    () => {
      const body = {
        from: searchValues.from,
        to: searchValues.to,
        name: searchValues.name,
        email: searchValues.email,
        answerStatus: searchValues.answerStatus,
      };
      setSearchBody(body);
    },
    [],
  );
  

  const pageInterceptor = useCallback((res) => {
    res = DUMMY__RESPONSE; // ! TEST
    console.log(res);
    let newPageInfo = {
      totalPages: 0,
      size: 0,
      totalItems: 0,
      currentPageIndex: 0,
      newPageNumber: 1,
      newItemList: [],
    };
    if (res.data._embedded) {
      const pageData = res.data.page;
      const itemQuery = 'questionItemDtoList';
      const curItemList = res.data._embedded[itemQuery];
      newPageInfo = {
        totalPages: pageData.totalPages,//
        size: pageData.size,//
        totalItems: pageData.totalElements,//
        currentPageIndex: pageData.number,//
        newPageNumber: pageData.number + 1,
        newItemList: curItemList,
      };
    }

    return newPageInfo;
  },[]);

  const onSelectedItem = (id, checked) => {
    const seletedId = Number(id);
    if (checked) {
      setSelectedItemIds((prevState) => prevState.concat(seletedId));
    } else {
      setSelectedItemIds((prevState) =>
        prevState.filter((id) => id !== seletedId),
      );
    }
  };

  const onSelectAllItems = (checked) => {
    const allItemsIdList = itemList.map((item) => item.id);
    setSelectedItemIds(checked ? allItemsIdList : []);
  };

  const onDeleteItem = () => {
    console.log('선택된 아이템 삭제');
  };

  const searchAllObj = { id: 'ALL', label: '전체' };
  const answerStatusOptionIdList = [
    ...Object.keys(inquiryStatusType).filter((key) => key !== 'KOR'),
    searchAllObj.id,
  ];
  const answerStatusOptionLabelList = [
    ...Object.values(inquiryStatusType.KOR),
    searchAllObj.label,
  ];

  return (
    <>
      <MetaTitle title="1:1 문의목록" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>1:1 문의 목록</h1>
          </div>
          <section className="cont">
            <SearchBar onReset={onResetSearchValues} onSearch={onSearch}>
              <SearchTerm
                title={'조회기간'}
                searchValue={searchValues}
                setSearchValue={setSearchValues}
              />
              <SearchTextWithCategory
                searchValue={searchValues}
                setSearchValue={setSearchValues}
                title="조건검색"
                name="detail"
                id="detail"
                options={[
                  { label: '제목', value: 'title' },
                  { label: '이름', value: 'memberName' },
                  { label: '아이디', value: 'email' },
                ]}
              />
              <SearchRadio
                searchValue={searchValues}
                setSearchValue={setSearchValues}
                title="응답상태"
                name="answerStatus"
                idList={answerStatusOptionIdList}
                labelList={answerStatusOptionLabelList}
                value={searchValues.answerStatus}
              />
            </SearchBar>
          </section>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">목록</p>
              <div className="controls cont-left">
                <button
                  className={'admin_btn line basic_m'}
                  onClick={onDeleteItem}
                >
                  {isLoading.delete ? <Spinner /> : '선택삭제'}
                </button>
              </div>
            </div>
            <div className={`${s.cont_viewer}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>
                    <PureCheckbox
                      eventHandler={onSelectAllItems}
                      value={valid_isTheSameArray(allItemIdList, selectedItemIds)}
                    />
                  </li>
                  <li className={s.table_th}>제목</li>
                  <li className={s.table_th}>작성자</li>
                  <li className={s.table_th}>아이디</li>
                  <li className={s.table_th}>답변상태</li>
                  <li className={s.table_th}>작성일시</li>
                </ul>
                {isLoading.fetching ? (
                  <AmdinErrorMessage loading={<Spinner />} />
                ) : itemList.length === 0 ? (
                  <AmdinErrorMessage text="조회된 데이터가 없습니다." />
                ) : (
                  <InquiryItemList items={itemList} onSelectedItem={onSelectedItem} selectedIdList={selectedItemIds}/>
                )}
              </div>
            </div>
            <div className={s['pagination-section']}>
              <PaginationWithAPI
                apiURL={searchApiUrl}
                size={searchPageSize}
                pageInterceptor={pageInterceptor}
                queryItemList={'queryAdminOrdersDtoList'}
                setItemList={setItemList}
                setIsLoading={setIsLoading}
                option={{ apiMethod: 'POST', body: searchBody }}
              />
            </div>
          </section>
        </AdminContentWrapper>
      </AdminLayout>
      {hasAlert && <Modal_global_alert background />}
    </>
  );
}

const DUMMY__RESPONSE = {
  data: {
    _embedded: {
      questionItemDtoList: [
        {
          id: 1,
          name: '홍길동',
          email: 'user@gmail.com',
          title: '유저문의제목',
          contents: '타이틀내용',
          createdDate: '2022-11-21T11:19:46.145',
          answerStatus: inquiryStatusType.ANSWERED,
          cateogory: inquiryCategoryType.GENERAL,
          questionImgDtoList: [
            {
              questionImageid: 4,
              filename: '111.jpg',
              url: 'http://192.168.0.4/display/questions?filname=111.jpg',
            },
            {
              questionImageid: 6,
              filename: '222.jpg',
              url: 'http://192.168.0.4/display/questions?filname=222.jpg',
            },
          ],
        },
        {
          id: 2,
          name: '홍길동2',
          email: 'user2@gmail.com',
          title: '유저문의제목2',
          contents: '타이틀내용',
          createdDate: '2022-11-21T11:19:46.145',
          answerStatus: inquiryStatusType.UNANSWERED,
          cateogory: inquiryCategoryType.GENERAL,
          questionImgDtoList: [
            {
              questionImageid: 4,
              filename: '111.jpg',
              url: 'http://192.168.0.4/display/questions?filname=111.jpg',
            },
            {
              questionImageid: 6,
              filename: '222.jpg',
              url: 'http://192.168.0.4/display/questions?filname=222.jpg',
            },
          ],
        },
        {
          id: 3,
          name: '홍길동3',
          email: 'user@gmail.com',
          title: '유저문의제목3',
          contents: '타이틀내용3',
          createdDate: '2022-11-21T11:19:46.145',
          answerStatus: inquiryStatusType.MULTIPLE_ANSWERED,
          cateogory: inquiryCategoryType.GENERAL,
          questionImgDtoList: [
            {
              questionImageid: 4,
              filename: '111.jpg',
              url: 'http://192.168.0.4/display/questions?filname=111.jpg',
            },
            {
              questionImageid: 6,
              filename: '222.jpg',
              url: 'http://192.168.0.4/display/questions?filname=222.jpg',
            },
          ],
        },
      ],
    },
    page: {
      size: 2,
      totalElements: 8,
      totalPages: 4,
      number: 1,
    },
  },
  status: 200,
};

