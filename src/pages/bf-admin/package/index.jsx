import React, { useCallback, useEffect, useMemo, useState } from 'react';
import s from './package.module.scss';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import SearchBar from '/src/components/admin/form/searchBar';
import SearchPlainInput from '/src/components/admin/form/searchBar/SearchPlainInput';
import SearchRadio from '/src/components/admin/form/searchBar/SearchRadio';
import AmdinErrorMessage from '/src/components/atoms/AmdinErrorMessage';
import Spinner from '/src/components/atoms/Spinner';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import Tooltip from '/src/components/atoms/Tooltip';
import { getDefaultPagenationInfo } from '/util/func/getDefaultPagenationInfo';
import { MirrorTextOnHoverEvent } from '/util/func/MirrorTextOnHoverEvent';
import { useModalContext } from '/store/modal-context';
import { putObjData } from '/src/pages/api/reqData';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import { getData, postData, postObjData } from '../../api/reqData';
import PackageList from './PackageList';

export default function PackageBenefitListPage() {
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);

  // useEffect(() => {
  //   MirrorTextOnHoverEvent(window);
  // }, [itemList]);

  useEffect(() => {
    (async () => {
      try {
        const url = '/api/admin/subscribes/benefits';
        const res = await getData(url);
        if (res?.status === 200) {
          const data = res.data._embedded?.subscribeBenefitDtoList;

          // console.log('data', data);

          setItemList(data);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const onApproveItem = async (apiUrl, targetId) => {
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        approve: {
          [targetId]: true,
        },
      }));

      const res = await postObjData(apiUrl);
      console.log(res);
      if (res.isDone) {
        mct.alertShow(
          '패키지 혜택을 성공적으로 승인하였습니다.',
          onSubmitCallback,
        );
      } else if (res.status === 422) {
        const message = res.data.data;
        mct.alertShow(
          `승인할 수 없는 패키지 혜택입니다.\n(${message})`,
          onSubmitCallback,
        );
      } else {
        const serverErrorMessage = res.error;
        mct.alertShow(
          serverErrorMessage || '승인에 실패하였습니다.',
          onSubmitCallback,
        );
      }
    } catch (err) {
      mct.alertShow('승인 요청 중 에러가 발생하였습니다.');
      console.error(err);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        approve: {
          [targetId]: false,
        },
      }));
    }
  };

  const onRejectItem = async (apiUrl, targetId) => {
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        reject: {
          [targetId]: true,
        },
      }));

      const res = await postObjData(apiUrl);
      // console.log(res);
      if (res.isDone) {
        mct.alertShow('패키지 혜택을 거부하였습니다.', onSubmitCallback);
      } else if (res.status === 422) {
        const message = res.data.data;
        mct.alertShow(
          `거부할 수 없는 패키지 혜택입니다.\n(${message})`,
          onSubmitCallback,
        );
      } else {
        const serverErrorMessage = res.error;
        mct.alertShow(
          serverErrorMessage || '거부에 실패하였습니다.',
          onSubmitCallback,
        );
      }
    } catch (err) {
      mct.alertShow('거부 요청 중 에러가 발생하였습니다.');
      console.error(err);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        reject: {
          [targetId]: false,
        },
      }));
    }
  };

  const onSubmitCallback = () => {
    window.location.reload();
  };

  const onClickModalButton = () => {
    mct.alertHide();
  };

  console.log(itemList);

  return (
    <>
      <MetaTitle title="패키지 조회" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">패키지 조회</h1>

          <section className="cont">
            <div className="cont_header clearfix">
              <div className="cont_title cont-left">
                승인 대기 목록
                {/* <Tooltip
                  message={`1. 자동발행쿠폰은 생성 및 삭제할 수 없습니다.\n2. 자동발행쿠폰 중 등급별 쿠폰은 매달 1일, 생일 쿠폰은 해당 월 1일에 자동발급됩니다.\n3. 직접발행 쿠폰은 유효기간이 존재하는 항목만 목록에 나타납니다.\n4. 직접발행 쿠폰의 만료일자는 동일한 쿠폰을 2회 이상 발급했을 시,\n    가장 늦은 만료일자를 기준으로 표기됩니다.`}
                  messagePosition={'left'}
                  wordBreaking={true}
                  width={'480px'}
                /> */}
              </div>
              <div className="controls cont-left"></div>
            </div>
            <div className={`${s.cont_viewer} ${s.fullWidth}`}>
              <div className={`${s.table}`}>
                <ul className={`${s.table_header}`}>
                  <li className={s.table_th}>번호</li>
                  <li className={s.table_th}>구독번호</li>
                  <li className={s.table_th}>혜택명</li>
                  <li className={s.table_th}>상태</li>
                  <li className={s.table_th}>요청일</li>
                  <li className={s.table_th}>사용일</li>
                  <li className={s.table_th}>만료일</li>
                  <li className={s.table_th}>승인</li>
                  <li className={s.table_th}>거부</li>
                </ul>
                {itemList.length ? (
                  <PackageList
                    items={itemList}
                    onApproveItem={onApproveItem}
                    onRejectItem={onRejectItem}
                    isLoading={isLoading}
                  />
                ) : isLoading.fetching ? (
                  <AmdinErrorMessage loading={<Spinner />} />
                ) : (
                  <AmdinErrorMessage text="조회된 데이터가 없습니다." />
                )}
              </div>
            </div>
          </section>
        </AdminContentWrapper>
      </AdminLayout>
      {hasAlert && (
        <Modal_global_alert onClick={onClickModalButton} background />
      )}
    </>
  );
}
