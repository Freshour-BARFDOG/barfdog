import React from "react";
import DaumPostcode from "react-daum-postcode";
import s from "./daumPostCode.module.scss";
import {popupAction} from "/store/popup-slice";
import {useDispatch} from "react-redux";
import axios from "axios";
import {useRouter} from "next/router";



function PostCode({ getData }) {
  const dispatch = useDispatch();
  const router = useRouter();


  const onCompletePost = (data) => {
    if(typeof window === 'undefined') return;

    dispatch(popupAction.setData({
      address: data.address,
      addressZoneCode: data.zonecode
    }))

    window.close();


    return result;


    if(getData && typeof getData === 'function'){
      getData(data);
    }



  };

  const test = (e)=>{
    e.preventDefault();
    const host = window.location.origin;
    axios.defaults.baseURL = host;
    const API_URL = `/surveyGuide`;
    console.log(API_URL)
    axios
      .post(API_URL, {
        params: {
          data :'zzz',
        },
        headers: {
          'content-Type': 'application/json',
        }
      })
      .then((res) => {
        console.log(res.data)
      })
      .catch((err) => {
        console.error('_______중복 검사결과: ',err.request.status);
      });

  }
  return (<>
    <button onClick={test}>테스트 버튼</button>
    <DaumPostcode className={s.popup} autoClose onComplete={onCompletePost} />
  </>)
}

export default PostCode;





//
//
//
// function Postcode() {
//   // 주소 검색 팝업화면
//   const [popup, setPopup] = useState(false);
//   // 주소
//   const [address, setAddress] = useState("");
//   // 상세주소
//   const [detailAddress, setDetailAddress] =useState("");
//   // 우편번호
//   const [zonecode, setZonecode] = useState("");
//
//   return (
//     <>
//       {!address ?
//         <div className={`${s.btn} ${s.bigbtn}`}
//              onClick={() => {
//                setPopup(!popup);
//              }}
//         >주소 검색</div>
//         :
//         <div>
//           <label onClick={(e) => {
//             e.preventDefault();
//             setPopup(!popup);
//           }}>
//             주소 검색 버튼
//           </label>
//           <input readOnly={true} data-title="주소입력란" placeholder={'주소'} type="text" value={`${zonecode} ${address}`}/>
//         </div>
//       }
//       {
//         address &&
//         <input type="text" value={detailAddress} placeholder={'상세주소'}
//                onChange={(e) => {
//                  setDetailAddress(e.target.value)
//                }}
//         />
//       }
//       {popup && (
//         <section>
//           <Post setFormValues={setFormValues} />
//         </section>
//       )}
//     </>);
// }
