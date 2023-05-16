import s from "./promotion.module.scss";
import {promotionStatusType} from "/store/TYPE/promotionStatusType";
import React from "react";

export const PromotionStatus = ({status}) => {
  return <span className={`${s.status} ${
    status === promotionStatusType.ACTIVE ? s.active
      : status === promotionStatusType.PAUSED ? s.paused
        : s.inactive
  }`}>{promotionStatusType.KOR[status]}</span>
};
