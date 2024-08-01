import React, { useState } from 'react';
import s from './package.module.scss';
import { packageBenefitType } from '/store/TYPE/packageBenefitType';
import Spinner from '/src/components/atoms/Spinner';
import transformDate from '/util/func/transformDate';
import { packageBenefitStatusType } from '../../../../store/TYPE/packageBenefitType';

export default function PackageList({
  items,
  onApproveItem,
  onRejectItem,
  isLoading,
}) {
  if (!items || !items.length) return;

  return (
    <ul className="table_body">
      {items.map((item, i) => (
        <ItemList
          key={`item-${item.id}-${i}`}
          item={item}
          onApproveItem={onApproveItem}
          onRejectItem={onRejectItem}
          isLoading={isLoading}
          number={i + 1}
        />
      ))}
    </ul>
  );
}

const ItemList = ({ item, number, onApproveItem, onRejectItem, isLoading }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const DATA = {
    id: item.benefitId,
    number,
    subscribeId: item.subscribeId,
    benefitName: packageBenefitType[item.benefitName],
    benefitStatus: packageBenefitStatusType[item.benefitStatus],
    benefitRequestDate: transformDate(item.benefitRequestDate) || '-',
    benefitUsedDate: transformDate(item.benefitUsedDate) || '-',
    benefitExpiredDate: transformDate(item.benefitExpiredDate) || '-',
    apiurl: {
      approve: `/api/admin/subscribes/benefits/${item.benefitId}/approve`,
      reject: `/api/admin/subscribes/benefits/${item.benefitId}/reject`,
    },
  };

  const onApprove = (e) => {
    if (isSubmitted) return console.error('이미 제출된 양식입니다.');
    if (
      !confirm(
        `선택된 패키지 혜택(${DATA.benefitName.KOR})을 승인하시겠습니까?`,
      )
    )
      return;
    const apiUrl = e.currentTarget.dataset.apiUrl;
    onApproveItem(apiUrl, DATA.id);
    setIsSubmitted(true);
  };

  const onReject = (e) => {
    if (isSubmitted) return console.error('이미 제출된 양식입니다.');
    if (
      !confirm(
        `선택된 패키지 혜택(${DATA.benefitName.KOR})을 거부하시겠습니까?`,
      )
    )
      return;
    const apiUrl = e.currentTarget.dataset.apiUrl;
    onRejectItem(apiUrl, DATA.id);
    setIsSubmitted(true);
  };

  return (
    <li className={s.item} key={`item-${DATA.id}`}>
      <span>{DATA.number}</span>
      <span>{DATA.subscribeId}</span>
      <span>{DATA.benefitName.KOR}</span>
      <span>{DATA.benefitStatus.KOR}</span>
      <span>{DATA.benefitRequestDate}</span>
      <span>{DATA.benefitUsedDate}</span>
      <span>{DATA.benefitExpiredDate}</span>
      <span>
        {DATA.benefitStatus.NAME === 'REQUESTED' ? (
          <button
            className="admin_btn basic_s solid"
            onClick={onApprove}
            data-api-url={DATA.apiurl.approve}
          >
            {isLoading?.approve && isLoading.approve[DATA.id] ? (
              <Spinner style={{ color: 'white' }} />
            ) : (
              '승인'
            )}
          </button>
        ) : (
          <em>-</em>
        )}
      </span>
      <span>
        {DATA.benefitStatus.NAME === 'REQUESTED' ? (
          <button
            className="admin_btn basic_s solid"
            onClick={onReject}
            data-api-url={DATA.apiurl.reject}
            style={{
              color: '#ca1011',
              border: '1px solid #ca1011',
              backgroundColor: '#fff',
            }}
          >
            {isLoading?.reject && isLoading.reject[DATA.id] ? (
              <Spinner style={{ color: 'white' }} />
            ) : (
              '거부'
            )}
          </button>
        ) : (
          <em>-</em>
        )}
      </span>
    </li>
  );
};
