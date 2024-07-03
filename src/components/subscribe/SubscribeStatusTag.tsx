import {
  subscribeStatus,
  subscribeStatusEnum,
} from '@store/TYPE/subscribeStatus';
import React from 'react';
import s from './subscribeStatusTag.module.scss';

interface Props {
  status: subscribeStatusEnum;
  subscribeCount: number;
}

export const SubscribeStatusTag = ({
  status,
  subscribeCount,
}: Props): JSX.Element => {
  let UIstatus: subscribeStatusEnum;
  if (status === subscribeStatus.BEFORE_PAYMENT && subscribeCount === 0) {
    UIstatus = subscribeStatusEnum.BEFORE_PAYMENT;
  } else if (
    status === subscribeStatus.SURVEY_COMPLETED &&
    subscribeCount === 0
  ) {
    UIstatus = subscribeStatusEnum.SURVEY_COMPLETED;
  } else if (status === subscribeStatus.SUBSCRIBE_WILL_CANCEL) {
    UIstatus = subscribeStatusEnum.SUBSCRIBE_WILL_CANCEL;
  } else if (status === subscribeStatus.SUBSCRIBE_CANCEL) {
    UIstatus = subscribeStatusEnum.SUBSCRIBE_CANCEL;
  } else if (
    // (status === subscribeStatus.BEFORE_PAYMENT && subscribeCount > 0) ||
    status === subscribeStatus.SUBSCRIBE_PENDING
  ) {
    UIstatus = subscribeStatusEnum.SUBSCRIBE_PENDING;
  } else if (
    status === subscribeStatus.SUBSCRIBING ||
    status === subscribeStatus.ADMIN
  ) {
    UIstatus = subscribeStatusEnum.SUBSCRIBING;
  }

  if (!UIstatus) return;

  return (
    <i className={`${s.tag} ${s[UIstatus]}`}>{subscribeStatus.KOR[UIstatus]}</i>
  );
};
