import React, { useCallback, useEffect, useState } from 'react';
import Checkbox from '/src/components/atoms/Checkbox';
import AdminErrorMessage from '/src/components/atoms/AdminErrorMessage';
import dynamic from 'next/dynamic';
import UserList from '/src/pages/popup/searchUser/UserList';
import s from '/src/pages/popup/searchUser/searchUser.module.scss';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import { valid_isTheSameArray } from '/util/func/validation/validationPackage';
import Spinner from '/src/components/atoms/Spinner';
import { getMemberList } from '/src/pages/api/getMemberList';
import Tooltip from '../../atoms/Tooltip';
import { useModalContext } from '/store/modal-context';
import { postData } from '../../../pages/api/reqData';

const WindowOpener = dynamic(() => import('/util/func/window-opener'), {
  ssr: false,
});

export default function SearchPersonalForm({ id, setFormValues, formErrors }) {
  const mct = useModalContext();
  const [isLoading, setIsLoading] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [selectedItemList, setSelectedItemList] = useState([]);

  useEffect(() => {
    setFormValues((prevState) => ({
      ...prevState,
      memberIdList: itemList.map((item) => item.id),
    }));
  }, [itemList]);

  const onReceivePopupData = async (err, receivedIds) => {
    // ! windowOpener로 전달되는 함수에선 다른 함수와 다르게
    //  "itemList"값을 올바르게 받을 수 없는 이슈가 있다.
    if (err) return mct.alertShow('회원검색 데이터를 불러오는데 실패했습니다.');
    if (!Array.isArray(receivedIds)) return; // recievedIds

    try {
      setIsLoading(true);

      const receivedMembers = await getMemberList(receivedIds);

      setItemList((prevItems) => {
        const addedMembers = receivedMembers.filter(
          (member) => prevItems.map((item) => item.id).indexOf(member.id) < 0,
        );
        // // console.log( "rcv: ", receivedIds, "\addedMembers: ", receivedMembers, "addedMembers: ", addedMembers );
        if (!addedMembers.length)
          alert('이미 발행 대상에 포함되어있습니다. 추가된 회원은 없습니다.');
        return prevItems.concat(addedMembers);
      });
    } catch (err) {
      mct.alertShow(err);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onAllSelectItemsList = useCallback(
    (checked) => {
      if (checked) {
        setSelectedItemList(itemList.map((item) => item.id)); // 모두 선택
      } else {
        setSelectedItemList([]); //초기화
      }
    },
    [itemList],
  );

  const onDeleteItemList = () => {
    if (!selectedItemList.length) return alert('선택된 항목이 없습니다.');
    if (
      confirm(`선택된 ${selectedItemList.length}개의 항목을 삭제하시겠습니까?`)
    ) {
      setItemList((prevState) => {
        return prevState.filter(
          (item) => selectedItemList.indexOf(item.id) < 0,
        );
      });
      setSelectedItemList([]);
    }
  };

  const valid_allCheckboxesChecked = () => {
    if (
      !Array.isArray(itemList) ||
      !Array.isArray(selectedItemList) ||
      itemList.length === 0
    )
      return;
    const allSelectedList = itemList.map((item) => item.id);
    return valid_isTheSameArray(allSelectedList, selectedItemList);
  };

  const [file, setFile] = useState(null);

  const excelUploadHandler = async (selectedFile) => {
    if (!selectedFile) {
      console.error('파일이 선택되지 않았습니다.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    const url = `/api/admin/members/excel`;

    try {
      setIsLoading(true);
      const res = await postData(url, formData);
      console.log('엑셀 파일 업로드 성공:', res.data);
      setItemList(res.data._embedded.queryMembersDtoList);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile); // 파일 상태 업데이트
    if (selectedFile) {
      excelUploadHandler(selectedFile);
    }
  };

  return (
    <>
      <div className="optional-section">
        <div className="search-box">
          <div className="controls">
            <WindowOpener
              url={'/popup/searchUser'}
              bridge={onReceivePopupData}
              options={{ width: 825, height: 642 }}
            >
              <span className={'admin_btn solid basic_m'} type={'button'}>
                회원검색
              </span>
            </WindowOpener>
            <button
              className={'admin_btn line basic_m'}
              type={'button'}
              onClick={onDeleteItemList}
            >
              선택삭제
            </button>

            <div>
              <label className={'admin_btn line basic_m'} htmlFor="excelFile">
                {isLoading ? <Spinner /> : '엑셀업로드'}
              </label>
              <input
                type="file"
                id="excelFile"
                name="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>

            <Tooltip
              message={`1. 아래에 추가된 모든 회원에게 쿠폰이 발급됩니다.\n2. 체크박스는 발행할 회원목록을 삭제하는데 사용됩니다.\n3. 엑셀 업로드는 첫 번째 열의 숫자로 검색합니다.`}
              messagePosition={'center'}
              wordBreaking={true}
              width={'360px'}
              theme={'white'}
            />
            {formErrors[id] && <ErrorMessage>{formErrors[id]}</ErrorMessage>}
          </div>
          <div className={`${s.cont_viewer} ${s.fullWidth} ${s.fixedHeight}`}>
            <div className={s.table}>
              <ul className={`${s.table_header}`}>
                <li className={s.table_th}>
                  <Checkbox
                    onClick={onAllSelectItemsList}
                    checked={valid_allCheckboxesChecked() || ''}
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
              {itemList?.length ? (
                <UserList
                  items={itemList}
                  setSelectedItems={setSelectedItemList}
                  selectedItems={selectedItemList}
                />
              ) : isLoading ? (
                <AdminErrorMessage loading={<Spinner />} />
              ) : (
                <AdminErrorMessage text={'발급대상인 회원이 없습니다.'} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
