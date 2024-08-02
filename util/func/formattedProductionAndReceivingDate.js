//* 생산 예정일 날짜 계산
// 화 : 배송 시작일
// -> 전 주의 토요일 : 생산 예정일
// -> 그 주의 수요일 : 수령 예정일

export const formattedProductionAndReceivingDate = (dateString) => {
  const getFormattedDate = (date) =>
    `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}.${String(date.getDate()).padStart(2, '0')}.`;

  let productionDate, receivingDate, shipmentDate;

  // 1. 다음 배송일(data.nextDeliveryDate)이 있을 경우
  if (dateString) {
    // 1) 생산 예정일 : 전 주의 토요일
    productionDate = new Date(dateString);
    // Tuesday (day 2)
    if (productionDate.getDay() === 2) {
      // previous Friday
      const daysToSubtract = 4;
      productionDate.setDate(productionDate.getDate() - daysToSubtract);
    }

    // 2) 수령 예정일 : 다음 배송일의 다음날
    receivingDate = new Date(dateString);
    receivingDate.setDate(receivingDate.getDate() + 1); // Next day
  } else {
    // 2. 다음 배송일이 없을 경우 (구독중X)
    const today = new Date();
    const dayOfWeek = today.getDay();

    // 1) 생산 예정일
    // (1) 월 ~ 목 : 그 주의 토요일
    if (dayOfWeek >= 1 && dayOfWeek <= 4) {
      productionDate = new Date(today);
      productionDate.setDate(today.getDate() + (6 - dayOfWeek));
    } else {
      // (2) 금 ~ 일 : 다음주의 토요일
      productionDate = new Date(today);
      productionDate.setDate(today.getDate() + (13 - dayOfWeek));
    }

    // 2) 출고 예정일 : 생산 예정일의 다음 화요일
    shipmentDate = new Date(productionDate);
    shipmentDate.setDate(shipmentDate.getDate() + 4); // Next Tuesday

    // 3) 수령 예정일 : 생산 예정일의 다음 수요일
    receivingDate = new Date(productionDate);
    receivingDate.setDate(receivingDate.getDate() + 5); // Next Wednesday
  }

  return {
    formattedProductionDate: getFormattedDate(productionDate),
    formattedShipmentDate: shipmentDate && getFormattedDate(shipmentDate),
    formattedReceivingDate: getFormattedDate(receivingDate),
  };
};
