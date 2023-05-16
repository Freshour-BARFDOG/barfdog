export const valid_quantityForLimitedQuantity = (quantity: number, limit: number): string => {
    let errorMessage = "";
    if (quantity === 0) {
        errorMessage = "수량을 입력하세요.";
    } else if (quantity < limit) {
        errorMessage = "제한된 수량보다 적습니다.";
    }
    return errorMessage;
};
