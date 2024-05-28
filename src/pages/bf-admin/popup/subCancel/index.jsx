import React, { useCallback, useEffect, useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import PopupWrapper from '/src/components/popup/PopupWrapper';
import { PopupCloseButton_typeX } from '/src/components/popup/PopupCloseButton';
import s from './subCancel.module.scss';
import UserList from './UserList';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import {
  transformDateWithHyphen,
  transformToday,
} from '/util/func/transformDate';
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import Spinner from '/src/components/atoms/Spinner';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, ConfigProvider } from 'antd';
import { postDataBlob } from '../../../api/reqData';
import axios from 'axios';

const searchPageSize = 10;
const getListApiUrl = '/api/admin/dashBoard/subscribeCancelReason';
const apiDataQueryString = 'querySubscribeCancelReasonDtoList';

export default function SubCancelPopup() {
  const [isLoading, setIsLoading] = useState({});
  const [isExcelLoading, setIsExcelLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemList, setItemList] = useState([]);
  const [selectedMemberIdList, setSelectedMemberIdList] = useState([]);

  // export excel
  const onExcelDownloadHandler = async () => {
    const url = `/api/admin/dashBoard/subscribeCancelReason`;

    try {
      const res = await postDataBlob(url);
      console.log('엑셀 파일 업로드 성공:', res.data);

      if (res && res.data instanceof Blob) {
        const downloadUrl = URL.createObjectURL(res.data);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', '구독취소사유.xlsx');
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(downloadUrl);
        link.remove();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <MetaTitle title="구독취소 기타 사유" />
      <div id={s.popup}>
        <PopupWrapper style={{ width: 820 }}>
          <header className={s.header}>
            <div className={s.row}>
              <div className={s.cont}>
                <h1 className={s['popup-title']}>구독취소 기타 사유</h1>
                <PopupCloseButton_typeX />
              </div>
            </div>
          </header>
          <main className={s.body}>
            <div className={s.row}>
              <div className={s['search-wrap']}></div>

              <div className={`${s.cont_viewer} ${s.fullWidth}`}>
                <div className={s.table}>
                  <ul className={`${s.table_header}`}>
                    <li className={s.table_th}>이름</li>
                    <li className={s.table_th}>이메일</li>
                    <li className={s.table_th}>연락처</li>
                    <li className={s.table_th}>반려견명</li>
                    <li className={s.table_th}>누적구매금액</li>
                    <li className={s.table_th}>취소 사유</li>
                  </ul>
                  {itemList.length ? (
                    <UserList
                      items={itemList}
                      setSelectedItems={setSelectedMemberIdList}
                      selectedItems={selectedMemberIdList}
                    />
                  ) : isLoading.fetching ? (
                    <AmdinErrorMessage loading={<Spinner />} />
                  ) : (
                    <AmdinErrorMessage text="검색결과가 존재하지 않습니다." />
                  )}
                </div>
                <div className={s['pagination-section']}>
                  <div className={s.pagination_wrapper}>
                    <div></div>
                    <PaginationWithAPI
                      apiURL={getListApiUrl}
                      urlQuery={searchQuery}
                      queryItemList={apiDataQueryString}
                      size={searchPageSize}
                      setItemList={setItemList}
                      setIsLoading={setIsLoading}
                    />

                    <div>
                      <ConfigProvider
                        theme={{
                          token: {
                            // Seed Token
                            colorPrimary: '#ca1011',
                          },
                        }}
                      >
                        <Button
                          icon={<DownloadOutlined />}
                          onClick={onExcelDownloadHandler}
                        >
                          액셀 다운로드
                        </Button>
                      </ConfigProvider>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </PopupWrapper>
      </div>
    </>
  );
}
