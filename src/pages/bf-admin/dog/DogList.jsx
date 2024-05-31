import Link from 'next/link';
import s from './dog.module.scss';
import popupWindow from '@util/func/popupWindow';
import { transformBirthDayYM } from '../../../../util/func/transformBirthDay';

export default function DogList({ items, currentPage }) {
  if (!items || !items.length) return;
  return (
    <ul className="table_body">
      {items.map((item, index) => (
        <ItemList
          key={`item-${item.dogId}`}
          number={index + 1 + (currentPage - 1) * 10}
          index={item.id}
          item={item}
        />
      ))}
    </ul>
  );
}

const ItemList = ({ item, number }) => {
  const DATA = {
    number,
    memberName: item.memberName,
    email: item.email,
    dogId: item.dogId,
    dogName: item.dogName,
    subscribeStatus: item.subscribeStatus === 'SUBSCRIBING' ? 'Y' : 'N',
    // subscribeStatus:
    //   item.subscribeStatus === 'BEFORE_PAYMENT'
    //     ? '구독 전'
    //     : item.subscribeStatus === 'SURVEY_COMPLETED'
    //     ? '설문 완료'
    //     : item.subscribeStatus === 'SUBSCRIBE_CANCEL'
    //     ? '구독 취소'
    //     : item.subscribeStatus === 'SUBSCRIBING'
    //     ? '구독 중'
    //     : item.subscribeStatus === 'SUBSCRIBE_PENDING'
    //     ? '구독 보류'
    //     : '관리자 구독',
    dogType: item.dogType,
    dogGender: item.dogGender === 'FEMALE' ? '암컷' : '수컷',
    dogBirth: transformBirthDayYM(item.dogBirth),
    dogSize:
      item.dogSize === 'SMALL' ? '소형견' : 'MIDDLE' ? '중형견' : '대형견', // [LARGE, MIDDLE, SMALL]
    weight: item.weight,
    dogStatus:
      item.dogStatus === 'HEALTHY'
        ? '건강'
        : 'NEED_DIET'
        ? '다이어트 필요'
        : 'OBESITY'
        ? '비만'
        : 'PREGNANT'
        ? '임신'
        : '수유 중', // [HEALTHY, NEED_DIET, OBESITY, PREGNANT, LACTATING]
    oldDog: item.oldDog ? 'Y' : 'N',
    neutralization: item.neutralization ? 'Y' : 'N',
    representative: item.representative ? 'Y' : 'N',
  };

  const onPopupHandler = (e) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;
    const href = e.currentTarget.href;
    popupWindow(href, { width: 1000, height: 716 });
  };

  return (
    <li className={s.item} key={`item-${DATA.dogId}`}>
      <span>{DATA.number}</span>

      <span>
        <Link href={`/bf-admin/popup/dogInfo/${DATA.dogId}`} passHref>
          <a
            target="_blank"
            className="admin_btn basic_s solid"
            onClick={onPopupHandler}
          >
            상세보기
          </a>
        </Link>
      </span>
      <span>{DATA.memberName}</span>
      <span>{DATA.email}</span>
      <span>{DATA.dogName}</span>
      <span>{DATA.subscribeStatus}</span>
      <span>{DATA.dogType}</span>
      <span>{DATA.dogGender}</span>
      <span>{DATA.dogBirth}</span>
      <span>{DATA.dogSize}</span>
      <span>{DATA.weight}</span>
      <span>{DATA.dogStatus}</span>
      <span>{DATA.oldDog}</span>
      <span>{DATA.representative}</span>
    </li>
  );
};
