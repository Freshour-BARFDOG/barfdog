import React, { useEffect, useState } from 'react';
import s from './memberInfo.module.scss';
import PopupWrapper from '/src/components/popup/PopupWrapper';
import { PopupCloseButton, PopupCloseButton_typeX } from '/src/components/popup/PopupCloseButton';
import Modal_member_class from '/src/components/modal/Modal_member_class';
import Modal_member_subscribe from '/src/components/modal/Modal_member_subscribe';
import { getData, putObjData } from '/src/pages/api/reqData';
import { FullScreenLoading } from '/src/components/atoms/FullScreenLoading';
import { transformBirthDay } from '/util/func/transformBirthDay';
import { transformPhoneNumber } from '/util/func/transformPhoneNumber';
import transformDate from "../../../../../util/func/transformDate";
import transformLocalCurrency from "../../../../../util/func/transformLocalCurrency";
export default function Popup_MemberDetailPage({ id }) {
  const getReviewInfoApiUrl = `/api/admin/members/${id}`;
  const apiDataQuery = 'memberDto';
  const putMemberBirthdayApiUrl = `/api/admin/members/${id}/birthday`;
  const putMemberGradeApiUrl = `/api/admin/members/${id}/grade`;

  const [isLoading, setIsLoading] = useState({});
  const [formValues, setFormValues] = useState({});
  const [tempValues, setTempValues] = useState({});
  const [activeGradeModal, setActiveGradeModal] = useState(false);
  const [activeSubscribeModal, setActiveSubscribeModal] = useState(false);

  // console.log(tempValues)
  // console.log(formValues)
  useEffect(() => {
    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: true,
        }));
        const res = await getData(getReviewInfoApiUrl);
        console.log('GET DATA: ', res);
        let initialValues = [];
        if (res.data[apiDataQuery]) {
          const DATA = res.data[apiDataQuery];
          initialValues = {
            id: DATA.id,
            name: DATA.name,
            email: DATA.email,
            address: {
              zipcode: DATA.address.zipcode,
              city: DATA.address.city,
              street: DATA.address.street,
              detailAddress: DATA.address.detailAddress,
            },
            phoneNumber: transformPhoneNumber(DATA.phoneNumber),
            birthday: transformBirthDay(DATA.birthday),
            accumulatedAmount: transformLocalCurrency(DATA.accumulatedAmount) + '원',
            grade: DATA.grade,
            subscribe: DATA.subscribe === false ? 'N' : 'Y',
            accumulatedSubscribe: DATA.accumulatedSubscribe + '회',
            lastLoginDate: DATA.lastLoginDate || '로그인 정보가 없습니다.',
            longUnconnected: DATA.longUnconnected ? 'Y' : 'N',
            withdrawal: DATA.withdrawal ? 'Y' : 'N',
            dogNames:
              res.data.dogNames
                .map((dogname, index) => (index === 0 ? `${dogname} (대표견)` : dogname))
                .join(',') || '등록된 반려견이 없습니다.',
          };
        } else {
          alert('데이터를 가져올 수 없습니다.');
        }
        setFormValues(initialValues);
      } catch (err) {
        console.error(err);
        console.error(err.response);
        // alert('데이터를 가져올 수 없습니다.');
      }
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    })();
  }, [id, formValues.birthday, formValues.grade]);

  const onInputChange = (e) => {
    const { value } = e.currentTarget;
    setTempValues((prevState) => ({
      ...prevState,
      birthday: value,
    }));
  };

  const onChangeMemberBirthday = () => {
    if (!tempValues.birthday || formValues.birthday === tempValues.birthday) {
      alert('기존 생일과 동일합니다.');
    } else if (confirm('회원 생일을 정말 변경하시겠습니까?')) {
      (async () => {
        const newBirthday = tempValues.birthday;
        const data = {
          birthday: newBirthday,
        };
        const res = await putObjData(putMemberBirthdayApiUrl, data);
        console.log(res);
        if (res.isDone) {
          alert('회원 생일 변경이 완료되었습니다.');
          setFormValues((prevState) => ({
            ...prevState,
            birthday: newBirthday,
          }));
          setTempValues((prevState) => ({
            ...prevState,
            birthday: null,
          }));
        }
      })();
    }
  };

  const onChangeMemberGrade = () => {
    if (!tempValues.grade || formValues.grade === tempValues.grade) {
      alert('기존 등급과 동일합니다.');
    } else if (confirm('회원 등급을 정말 변경하시겠습니까?')) {
      (async () => {
        const newGrade = tempValues.grade;
        const data = {
          grade: newGrade,
        };
        const res = await putObjData(putMemberGradeApiUrl, data);
        if (res.isDone) {
          alert('회원 등급 변경이 완료되었습니다.');
          setFormValues((prevState) => ({
            ...prevState,
            grade: newGrade,
          }));
          setTempValues((prevState) => ({
            ...prevState,
            newGrade: null,
          }));
          onActiveGradeModal();
        }
      })();
    }
  };

  const onActiveGradeModal = () => {
    setActiveGradeModal((prevState) => !prevState);
    setTempValues((prevState) => ({
      ...prevState,
      grade: null,
    }));
  };

  const onActiveSubscribeModal = () => {
    setActiveSubscribeModal((prevState) => !prevState);
  };

  if (isLoading.fetching) {
    return <FullScreenLoading />;
  }

  return (
    <>
      <div id={s.popup}>
        <PopupWrapper style={{ width: 1000 }}>
          <header className={s.header}>
            <div className={s.row}>
              <div className={s.cont}>
                <h1 className={s['popup-title']}>회원정보 조회</h1>
                <PopupCloseButton_typeX />
              </div>
            </div>
          </header>
          <main className={s.body}>
            <div className={s.row}>
              <section className={s.table}>
                <ul>
                  <li className={s['table-list']}>
                    <div className={s['t-header']}>
                      <h4 className={s.title}>기본 정보</h4>
                    </div>
                    <ul className={s['t-body']}>
                      <li className={`${s['t-row']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>이름</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{formValues.name}</span>
                          </div>
                        </div>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>생일</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>
                              <input
                                type="date"
                                value={tempValues.birthday || formValues.birthday}
                                onChange={onInputChange}
                              />
                            </span>
                            <span>
                              <button
                                className="admin_btn line point basic_s"
                                onClick={onChangeMemberBirthday}
                              >
                                변경
                              </button>
                            </span>
                          </div>
                        </div>
                      </li>
                      <li className={`${s['t-row']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>아이디</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{formValues.email}</span>
                          </div>
                        </div>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>연락처</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{formValues.phoneNumber}</span>
                          </div>
                        </div>
                      </li>
                      <li className={`${s['t-row']} ${s['fullWidth']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>주소</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{formValues.address?.street}</span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li className={s['table-list']}>
                    <div className={s['t-header']}>
                      <h4 className={s.title}>구매 현황</h4>
                    </div>
                    <ul className={s['t-body']}>
                      <li className={`${s['t-row']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>누적구매금액</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{formValues.accumulatedAmount}</span>
                          </div>
                        </div>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>등급</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{formValues.grade}</span>
                            <span>
                              <button
                                className="admin_btn line point basic_s"
                                onClick={onActiveGradeModal}
                              >
                                변경
                              </button>
                            </span>
                          </div>
                        </div>
                      </li>
                      <li className={`${s['t-row']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>정기구독여부</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{formValues.subscribe}</span>
                            <span>
                              <button
                                className="admin_btn line point basic_s"
                                onClick={onActiveSubscribeModal}
                              >
                                구독정보보기
                              </button>
                            </span>
                          </div>
                        </div>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>누적구독횟수</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{formValues.accumulatedSubscribe}</span>
                          </div>
                        </div>
                      </li>
                      <li className={`${s['t-row']} ${s['fullWidth']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>반려견</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{formValues.dogNames}</span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>
                  <li className={s['table-list']}>
                    <div className={s['t-header']}>
                      <h4 className={s.title}>로그인 정보</h4>
                    </div>
                    <ul className={s['t-body']}>
                      <li className={`${s['t-row']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>장기미접속</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{formValues.longUnconnected}</span>
                          </div>
                        </div>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>마지막로그인</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{transformDate(formValues.lastLoginDate, 'time')}</span>
                          </div>
                        </div>
                      </li>
                      <li className={`${s['t-row']} ${s['fullWidth']}`}>
                        <div className={s['t-box']}>
                          <div className={`${s.innerBox} ${s.label}`}>
                            <span>탈퇴여부</span>
                          </div>
                          <div className={`${s.innerBox} ${s.cont}`}>
                            <span>{formValues.withdrawal}</span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </section>
              <section className={s['btn-section']}>
                <PopupCloseButton />
              </section>
            </div>
          </main>
        </PopupWrapper>
      </div>
      {activeGradeModal && (
        <Modal_member_class
          id={'grade'}
          value={tempValues.grade || formValues.grade}
          setValue={setTempValues}
          onCancel={onActiveGradeModal}
          onConfirm={onChangeMemberGrade}
        />
      )}
      {activeSubscribeModal && (
        <Modal_member_subscribe
          onClick={setActiveSubscribeModal}
          memberId={id}
          setIsLoading={setIsLoading}
        />
      )}
    </>
  );
}


export async function getServerSideProps({ query }) {
  const { id } = query;
  
  return { props: { id } };
}

