import DaumPostcode from "react-daum-postcode";
import s from "/src/pages/api/daumPostCode/daumPostCode.module.scss";



function PostCode() {

  const onCompletePost = (data) => {
    const filteredDATA = {
      address: data.address,
      zonecode: data.zonecode,
      sido: data.sido,
      sigugun: data.sigugun,
    }
    window.opener.onSuccess(filteredDATA);
    window.close();
  };

  return (
    <>
      <DaumPostcode className={s.popup} autoClose onComplete={onCompletePost} />
    </>
  )
}

export default PostCode;