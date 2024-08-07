import s from '/src/pages/mypage/subscribe/[subscribeId].module.scss';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import { useModalContext } from '/store/modal-context';
import { ToggleBoxContext } from '/src/components/atoms/ToggleBox';
import { FullScreenLoading } from '/src/components/atoms/FullScreenLoading';
import { postObjData } from '/src/pages/api/reqData';
import Modal_confirm from '/src/components/modal/Modal_confirm';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import CustomRadio from '/src/components/admin/form/CustomRadio';
import { subscribePlanType } from '/store/TYPE/subscribePlanType';
import transformDate, { transformToday } from '/util/func/transformDate';
import { calcChangedSubscribeDeliveryDate } from '/util/func/calcNextSubscribeDeliveryDate';
import { subscribeSkipType } from '/store/TYPE/subscribeSkipType';
import { getDiffDateNumber } from '/util/func/getDiffDate';
import { useSubscribeInfo } from '/util/hook/useSubscribeInfo';
import { useRouter } from 'next/router';
import LayoutWithoutFooter from '/src/components/common/LayoutWithoutFooter';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import { getData } from '../../../api/reqData';
import CheckboxGroup from '/src/components/atoms/CheckboxGroup';

export default function SubscribeBenefitPage({ subscribeId }) {
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const router = useRouter();
  const [benefitInfo, setBenefitInfo] = useState();
  const [modalMessage, setModalMessage] = useState('');
  const [checkBoxItems, setCheckBoxItems] = useState([]);
  const [selectedBenefitId, setSelectedBenefitId] = useState('');
  const [benefitData, setBenefitData] = useState({
    availableDiagnosticDeviceLength: null,
    totalDiagnosticDeviceLength: null,
    availableTopperLength: null,
    totalTopperLength: null,
  });

  useEffect(() => {
    (async () => {
      try {
        const apiUrl = `/api/subscribes/benefits/${subscribeId}`;
        const res = await getData(apiUrl);

        const benefitData = res.data._embedded.subscribeBenefitDtoList;

        console.log(res);

        if (res.status === 200) {
          const availableDiagnosticDeviceLength = benefitData.filter(
            (benefit) =>
              benefit.benefitName === 'DIAGNOSTIC_DEVICE' &&
              benefit.benefitStatus === 'AVAILABLE',
          ).length;
          const totalDiagnosticDeviceLength = benefitData.filter(
            (benefit) => benefit.benefitName === 'DIAGNOSTIC_DEVICE',
          ).length;
          const requestedDiagnosticDeviceLength = benefitData.filter(
            (benefit) =>
              benefit.benefitName === 'DIAGNOSTIC_DEVICE' &&
              benefit.benefitStatus === 'REQUESTED',
          ).length;
          const requestedDiagnosticDeviceId =
            benefitData.filter(
              (benefit) =>
                benefit.benefitName === 'DIAGNOSTIC_DEVICE' &&
                benefit.benefitStatus === 'REQUESTED',
            )[0]?.benefitId || null;
          const usedDiagnosticDeviceLength = benefitData.filter(
            (benefit) =>
              benefit.benefitName === 'DIAGNOSTIC_DEVICE' &&
              benefit.benefitStatus === 'USED',
          ).length;

          const availableTopperLength = benefitData.filter(
            (benefit) =>
              benefit.benefitName === 'TOPPER_RANDOM' &&
              benefit.benefitStatus === 'AVAILABLE',
          ).length;
          const totalTopperLength = benefitData.filter(
            (benefit) => benefit.benefitName === 'TOPPER_RANDOM',
          ).length;
          const requestedTopperLength = benefitData.filter(
            (benefit) =>
              benefit.benefitName === 'TOPPER_RANDOM' &&
              benefit.benefitStatus === 'REQUESTED',
          ).length;
          const requestedTopperId =
            benefitData.filter(
              (benefit) =>
                benefit.benefitName === 'TOPPER_RANDOM' &&
                benefit.benefitStatus === 'REQUESTED',
            )[0]?.benefitId || null;
          const usedTopperLength = benefitData.filter(
            (benefit) =>
              benefit.benefitName === 'TOPPER_RANDOM' &&
              benefit.benefitStatus === 'USED',
          ).length;

          setBenefitInfo(benefitData);

          setBenefitData({
            availableDiagnosticDeviceLength,
            totalDiagnosticDeviceLength,
            requestedDiagnosticDeviceLength,
            requestedDiagnosticDeviceId,
            availableTopperLength,
            totalTopperLength,
            requestedTopperLength,
            requestedTopperId,
            usedDiagnosticDeviceLength,
            usedTopperLength,
          });

          const items = [];
          if (availableDiagnosticDeviceLength) {
            const availableDiagnosticDeviceId = benefitData.filter(
              (benefit) =>
                benefit.benefitName === 'DIAGNOSTIC_DEVICE' &&
                benefit.benefitStatus === 'AVAILABLE',
            )[0].benefitId;

            items.push({
              label: '진단기기 체험',
              value: availableDiagnosticDeviceId,
            });
          }
          if (availableTopperLength) {
            const availableTopperId = benefitData.filter(
              (benefit) =>
                benefit.benefitName === 'TOPPER_RANDOM' &&
                benefit.benefitStatus === 'AVAILABLE',
            )[0].benefitId;
            items.push({
              label: '토퍼 발송 (랜덤)',
              value: availableTopperId,
            });
          }
          setCheckBoxItems(items);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  console.log(benefitInfo);
  console.log(benefitData);

  const [isLoading, setIsLoading] = useState(false);
  const [activeConfirmModal, setActiveConfirmModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const onSubmit = async () => {
    if (submitted) return console.error('이미 제출된 양식입니다.');
    const benefitIds = selectedBenefitId.benefitId.split(',');
    try {
      setIsLoading(true);
      setSubmitted(true);
      await Promise.all(
        benefitIds.map(async (benefitId) => {
          const url = `/api/subscribes/benefits/${benefitId.trim()}`;
          const res = await postObjData(url);
          console.log(res);

          if (!res.isDone) {
            mct.alertShow(`데이터 전송 실패\n${res.error}`);
          }
        }),
      );

      mct.alertShow('신청되었습니다.', onGlobalModalCallback);
    } catch (err) {
      console.error('err: ', err);
    }
    setIsLoading(false);
  };

  const onGlobalModalCallback = () => {
    mct.alertHide();
    window.location.reload();
  };

  const onCancelHandler = async (item) => {
    const benefitId =
      item === 'diagnosticDevice'
        ? benefitData.requestedDiagnosticDeviceId
        : benefitData.requestedTopperId;
    try {
      const url = `/api/subscribes/benefits/${benefitId}/cancel`;
      const res = await postObjData(url);
      console.log(res);
      if (res.isDone) {
        mct.alertShow('취소되었습니다.', onGlobalModalCallback);
      } else {
        mct.alertShow(`데이터 전송 실패\n${res.error}`);
      }
    } catch (err) {
      console.error('err: ', err);
    }
  };

  const onPrevPage = () => {
    router.push('/mypage');
  };

  console.log(selectedBenefitId);
  console.log(checkBoxItems);

  return (
    <>
      <MetaTitle title="마이페이지 패키지혜택" />
      <LayoutWithoutFooter>
        <Wrapper>
          <MypageWrapper>
            <header>
              <div className={s.prev_btn} style={{ cursor: 'pointer' }}>
                <Image
                  src={'/img/order/left_arrow.svg'}
                  alt="left_arrow"
                  width={24}
                  height={24}
                  onClick={onPrevPage}
                />
              </div>
            </header>
            <section className={s.title_delivery_skip}>
              <div className={s.title_text}>패키지혜택</div>
              <div className={s.title_benefit_info}>
                이 패키지에 포함된 혜택을 선택하여주세요
                <br />
                <span>혜택 선택 시 다음 출고 시 포함되어 발송됩니다</span>
              </div>
            </section>
            <section>
              <div className={`${s.content_inner_box4}`}>
                <div className={s.benefit_box}>
                  <strong>남은 횟수 </strong>
                  <div>
                    진단기기 ( {benefitData.availableDiagnosticDeviceLength} /{' '}
                    {benefitData.totalDiagnosticDeviceLength} 회 )
                  </div>
                  <div>
                    토퍼 ( {benefitData.availableTopperLength} /{' '}
                    {benefitData.totalTopperLength} 회 )
                  </div>
                  <br />

                  <strong>신청 대기중 </strong>
                  <div>
                    진단기기 :{' '}
                    {benefitData.requestedDiagnosticDeviceLength || '0'} 회
                    {benefitData.requestedDiagnosticDeviceLength !== 0 && (
                      <button
                        onClick={() => onCancelHandler('diagnosticDevice')}
                      >
                        취소
                      </button>
                    )}
                  </div>
                  <div>
                    토퍼 : {benefitData.requestedTopperLength || '0'} 회{' '}
                    {benefitData.requestedTopperLength !== 0 && (
                      <button onClick={() => onCancelHandler('topper')}>
                        취소
                      </button>
                    )}
                  </div>
                  <br />

                  <strong>신청 완료</strong>
                  <div>
                    진단기기 : {benefitData.usedDiagnosticDeviceLength || '0'}{' '}
                    회
                  </div>
                  <div>토퍼 : {benefitData.usedTopperLength || '0'} 회</div>
                </div>

                {checkBoxItems.length === 0 ? (
                  <div className={s.no_package}>
                    신청할 수 있는 패키지 혜택이 없습니다.
                  </div>
                ) : (
                  <>
                    {' '}
                    <div className={s.radio_box}>
                      <CheckboxGroup
                        id={'benefitId'}
                        items={checkBoxItems}
                        formValues={selectedBenefitId}
                        setFormValues={setSelectedBenefitId}
                      />
                    </div>
                    <div className={s.btn_box}>
                      <button
                        type={'button'}
                        className={s.btn}
                        onClick={onSubmit}
                      >
                        신청하기
                      </button>
                    </div>
                  </>
                )}
              </div>
            </section>
          </MypageWrapper>
        </Wrapper>
      </LayoutWithoutFooter>
      {hasAlert && (
        <Modal_global_alert
          message={modalMessage}
          onClick={onGlobalModalCallback}
          background
        />
      )}

      {/* {isLoading.reload && <FullScreenLoading />} */}
    </>
  );
}

export async function getServerSideProps({ query }) {
  const { subscribeId } = query;

  return { props: { subscribeId } };
}
