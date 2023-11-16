import {valid_isEmpty, valid_link} from "./validationPackage";

export const validate = (obj) => {
  let errors = {};
  const keys = Object.keys(obj);
  
  keys.forEach((key) => {
    const val = obj[key];
    
    switch (key) {
      case "name":
        valid_isEmpty(val) && (errors[key] = "필수항목입니다.");
        break;
      case "pcLinkUrl":
        valid_link(val) && (errors[key] = valid_link(val));
        break;
      case "mobileLinkUrl":
        valid_link(val) && (errors[key] = valid_link(val));
        break;
      
      default:
        break;
    }
  });
  // * 파일 유효성검사 불필요
  // * 파일 empty: 기존 파일 유지 (파일 전송 X)
  // * 파일 exist: 파일 전송
  // console.log("Validation Result: ", errors);
  
  return errors;
};
