import React from 'react'
import styledComponents from 'styled-components'
import rem from "/src/components/atoms/rem";
import { useRouter } from 'next/router';
import PopupCloseButton from "./PopupCloseButton";
import s from './popup.module.scss';

// width 값
// margin :0 auto;
// * PC: 1000 x 688
// * 회원 데이터 받은 값을 뿌려준다.
const Wrap = styledComponents.div`
  max-width: ${(props) => {
    console.log(props);
    rem(props.width) || "auto";
  }};
  background-color:#fff;
  margin:0 auto;
  min-height: 100vh;
`;


 const PopupWrapper = ({children, style, ...props}) => {
   return (
     <>
       <Wrap style={style} {...props}>
         {children}
       </Wrap>
     </>
   );

 }





function Popup_MemeberDetailPage() {
  const router = useRouter();

  return (
    <div id={s.popup}>
      <PopupWrapper style={{ width: 1000 }}>
        <header className={s.header}>
          <div className={s.row}>
            <div className={s.cont}>
              <h1 className={s["popup-title"]}>회원정보 조회</h1>
              <PopupCloseButton />
            </div>
          </div>
        </header>
        <main className={s.body}>
          <div className={s.row}>
            <section className={s.table}>
              <ul>
                <li>
                  <div className={s["t-header"]}>
                    <h4 className={s.title}>회원정보</h4>
                  </div>
                  <div className={s["t-body"]}>
                    <div className={s["t-box"]}>
                      <div className={`${s.innerBox} ${s.label}`}>
                        <p>이름</p>
                      </div>
                      <div className={`${s.innerBox} ${s.cont}`}>
                        <div>김바프</div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </section>
          </div>
        </main>
      </PopupWrapper>
    </div>
  );
}

export default Popup_MemeberDetailPage