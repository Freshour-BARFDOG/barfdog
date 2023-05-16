export const promotionStatusType = {
    PAUSED:"PAUSED",
    ACTIVE:"ACTIVE",
    INACTIVE:"INACTIVE",
    KOR: {
        PAUSED:"대기",
        ACTIVE:"진행 중",
        INACTIVE:"종료"
    }
}

export const searchPromotionStatusType = {
    ALL: "ALL",
    ...promotionStatusType,
    KOR: {
        ALL: "전체",
        ...promotionStatusType.KOR
    }
}
