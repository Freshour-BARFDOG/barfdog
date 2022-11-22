import React, {useCallback, useState} from 'react';
import s from './adminInquiryItems.module.scss';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Spinner from '/src/components/atoms/Spinner';
import AdminLayout from '/src/components/admin/AdminLayout';
import {AdminContentWrapper} from '/src/components/admin/AdminWrapper';
import SearchBar from '/src/components/admin/form/searchBar';
import SearchTerm from '/src/components/admin/form/searchBar/SearchTerm';
import SearchTextWithCategory from '/src/components/admin/form/searchBar/SearchTextWithCategory';
import SearchRadio from '/src/components/admin/form/searchBar/SearchRadio';
import {useModalContext} from '/store/modal-context';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import {transformToday} from '/util/func/transformDate';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import PureCheckbox from '/src/components/atoms/PureCheckbox';
import {valid_isTheSameArray} from '/util/func/validation/validationPackage';
import {inquiryStatusType} from '/store/TYPE/inquiry/inquiryStatusType';
import {inquiryCategoryType} from '/store/TYPE/inquiry/inquiryCategoryType';
import InquiryItemList from '/src/components/admin/community/InquiryItemList';
import {SearchTypeClass} from "/src/class/SearchTypeClass";
import enterKey from "/util/func/enterKey";
import {getAllItemIdList} from "/util/func/getAllItemIdList";
import {putObjData} from "/src/pages/api/reqData";


const initialSearchValues = {
  from: transformToday(),
  to: transformToday(),
  name: '',
  email: '',
  title: '',
  answerStatus: inquiryStatusType.ALL,
}

const getQueryObj = (valueobj, type)=>{
  const queryObj = {
    type: type,
    value: valueobj[type],
    answerStatus: valueobj.answerStatus,
    from: valueobj.from,
    to: valueobj.to,
  };
  
  return queryObj;
}

const getQueryString = (queryObj) => {
  let queryString = '';
  let arr = [];
  for (const key in queryObj) {
    const val = queryObj[key];
    arr.push(`${key}=${val}`);
  }
  queryString = arr.join('&');
  return queryString;
};


export default function InquiryListPage() {
  
  
  const initialSearchType = 'title';
  const searchTypeClass = new SearchTypeClass(initialSearchType);
  const searchApiUrl = `/api/admin/questions`;
  const searchPageSize = 10;
  const searchDataQuery = 'questionListSideAdminList';
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const [itemList, setItemList] = useState([]);
  const [isLoading, setIsLoading] = useState({});
  const [searchValues, setSearchValues] = useState(initialSearchValues);
  const [selectedSearchType, setSelectedSearchType] = useState(
    searchTypeClass.initialType,
  );
  const [searchQuery, setSearchQuery] = useState(getQueryString(getQueryObj(initialSearchValues, searchTypeClass.initialType)));
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const allItemIdList = getAllItemIdList(itemList);
  
 


  const onSearch = useCallback(() => {
    const queryObj = getQueryObj(searchValues, selectedSearchType)
    const queryString = getQueryString(queryObj);
    setSearchQuery(queryString);
  }, [searchValues]);
  
 

  const onResetSearchValues = () => {
    setSearchValues(initialSearchValues);
  };

  

  const pageInterceptor = useCallback((res) => {
    // res = DUMMY__RESPONSE; // ! TEST
    console.log('InquiryListPage: ',res);
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
      const itemQuery = 'questionListSideAdminList';
      const curItemList = res.data._embedded[itemQuery];
      newPageInfo = {
        totalPages: pageData.totalPages, //
        size: pageData.size, //
        totalItems: pageData.totalElements, //
        currentPageIndex: pageData.number, //
        newPageNumber: pageData.number + 1,
        newItemList: curItemList,
      };
    }

    return newPageInfo;
  }, []);

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
    setSelectedItemIds(checked ? allItemIdList : []);
  };

  const onDeleteItem =async (id) => {
    if(!selectedItemIds.length) return mct.alertShow('선택된 항목이 없습니다.');
    if(!confirm(`선택하신 ${selectedItemIds.length}개의 항목을 삭제하시겠습니까?`)) return;
    
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        delete: true,
      }));
      const url = `/api/admin/questions`;

      let isDone = true;
      for (const id of selectedItemIds) {
        const body = {
          id: id
        }
        const res = await putObjData(url, body)
        if(!res.isDone){
          return mct.alertShow(`삭제에 실패한 항목이 있습니다.`, onWindowReload);
        }
      }
      
      if(isDone){
        mct.alertShow(`선택하신 ${selectedItemIds.length}개의 항목이 삭제되었습니다.`, onWindowReload);
      }
      
      // console.log(res);
    } catch (err) {
      mct.alertShow('삭제에 실패하였습니다.', onWindowReload);
        console.error(err)
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        delete: false,
      }));
    }
  };

  const answerStatusOptionIdList = Object.keys(inquiryStatusType).filter(
    (key) => key !== 'KOR',
  );
  const answerStatusOptionLabelList = Object.values(inquiryStatusType.KOR);
  
  const onEnterKey = (e)=>{
    enterKey(e, onSearch);
  }
  const onWindowReload = (e)=>{
    if(typeof window !== 'undefined'){
    
    }
    window.location.reload();
  }

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
                options={searchTypeClass.options}
                events={{ onSelect: setSelectedSearchType, onKeydown: onEnterKey }}
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
                      value={valid_isTheSameArray(
                        allItemIdList,
                        selectedItemIds,
                      )}
                    />
                  </li>
                  <li className={s.table_th}>제목</li>
                  <li className={s.table_th}>작성자</li>
                  <li className={s.table_th}>이메일</li>
                  <li className={s.table_th}>답변상태</li>
                  <li className={s.table_th}>작성일시</li>
                </ul>
                {isLoading.fetching ? (
                  <AmdinErrorMessage loading={<Spinner />} />
                ) : itemList.length === 0 ? (
                  <AmdinErrorMessage text="조회된 데이터가 없습니다." />
                ) : (
                  <InquiryItemList
                    items={itemList}
                    onSelectedItem={onSelectedItem}
                    selectedIdList={selectedItemIds}
                  />
                )}
              </div>
            </div>
            <div className={s['pagination-section']}>
              <PaginationWithAPI
                apiURL={searchApiUrl}
                size={searchPageSize}
                setItemList={setItemList}
                urlQuery={searchQuery}
                queryItemList={searchDataQuery}
                pageInterceptor={pageInterceptor}
                setIsLoading={setIsLoading}
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
