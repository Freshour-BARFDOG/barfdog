
export const generateCustomerUid = () => {
  
  const randomStr:string = new Date().getTime().toString(36);
  
  return `customer_Uid_${randomStr}`;
};
