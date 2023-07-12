export const createRandomMerchantUidByDateTime = ():string => {
  return new Date().getTime().toString(36);
}
