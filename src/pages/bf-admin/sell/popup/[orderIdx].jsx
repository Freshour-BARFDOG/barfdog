import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import s from "../popup_sell.module.scss";
import PopupWrapper from "@src/components/popup/PopupWrapper";
import {
  PopupCloseButton,
  PopupCloseButton_typeX,
} from "@src/components/popup/PopupCloseButton";



// * 테스트 후에, Component > 파일단위로 쪼개기
// * 테스트 후에, Component > 파일단위로 쪼개기
// * 테스트 후에, Component > 파일단위로 쪼개기
// * 테스트 후에, Component > 파일단위로 쪼개기
// * 테스트 후에, Component > 파일단위로 쪼개기


const ProductInfo_basicOrderInfo = () => {
  return (
    <>
      <div className={s["t-header"]}>
        <h4 className={s.title}>주문정보</h4>
      </div>
      <ul className={s["t-body"]}>
        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>주문번호</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>10000826742324</span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>주문&#40;결제&#41;일시</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>2022/02/14 14:19</span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>주문유형</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>일반주문</span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>묶음배송여부</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>Y</span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>구매자명</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>홍길동</span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>연락처</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>01053216549</span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>구매자ID</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>TEST_ID</span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>구독회원</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>Y</span>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
};







const ProductInfo_singleItemList = () => {

  return (
    <>
      <ul className={`${s["t-body"]} ${s["product-item-info"]}`}>
        <p className={s["t-top-row"]}>
          <span className={s["product-title"]}>상품주문정보</span>
          <span className={s["product-idx"]}>2022032540080871</span>
        </p>
        <li className={`${s["t-row"]} ${s["fullWidth"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>상품명</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>
                바프독 레시피 올인원 패키지 강아지 생식 닭 칠면조 오리 양 소 1kg
              </span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]} ${s["fullWidth"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>옵션</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>세트1&#41; 스타터4+터키비프2+덕램2+램비프2</span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>수량</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>1개</span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>주문금액</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>26,400원</span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>쿠폰사용</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>첫 구매 50%할인 쿠폰</span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>쿠폰할인금액</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>7,200원</span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]} ${s["fullWidth"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>처리상태</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>결제완료</span>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
}




const ProductInfo_dog = () => {
  return (
    <>
      <div className={s["t-header"]}>
        <h4 className={s.title}>반려견 정보</h4>
      </div>
      <ul className={s["t-body"]}>
        <li className={`${s["t-row"]} ${s["fullWidth"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>견명</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>바둑이</span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>못먹는 음식</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>Y&#40;닭&#41;</span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>특이사항</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>Y</span>
              <span> &#40;땅콩알러지 있어요&#41;</span>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
}



const ProductInfo_subscribe = ({ isChangedSubscribeInfo }) => {
  return (
    <>
      {isChangedSubscribeInfo ? (
        <div className={s["notice-message"]}>
          *구독정보 변경으로 주문 변경 내용이 있습니다. 이전 구독정보가 아래에
          표시됩니다.
        </div>
      ) : (
        <div className={s["t-header"]}>
          <h4 className={s.title}>구독 정보</h4>
        </div>
      )}
      <ul className={s["t-body"]}>
        <li className={`${s["t-row"]} ${s["fullWidth"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>구독회차</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>2회차</span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>플랜</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>풀플랜</span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>급여량</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>272g</span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]} ${s["fullWidth"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>레시피</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>스타터프리미엄 / 덕&amp;램</span>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
};







const ProductInfo_payment = () => {
  return (
    <>
      <div className={s["t-header"]}>
        <h4 className={s.title}>결제정보</h4>
      </div>
      <ul className={s["t-body"]}>
        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>총 상품금액</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>78,600원</span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>배송비</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>무료배송</span>
            </div>
          </div>
        </li>

        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>적립금사용</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>3,000원</span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>쿠폰할인금액</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>6,000원</span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>총 결제금액</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>69,600원</span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>결제방법</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>
                <span>결제방법</span>
              </span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]} ${s["fullWidth"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>결제방법</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>카드결제</span>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
  
}




const ProductInfo_delivery = () => {
  return (
    <>
      <div className={s["t-header"]}>
        <h4 className={s.title}>배송정보</h4>
      </div>
      <ul className={s["t-body"]}>
        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>수취인명</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>김바프</span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>연락처</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>010-1234-0000</span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]} ${s["fullWidth"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>배송지 주소</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>서울 서대문구 독립문로1길 9-12 503호</span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]} ${s["fullWidth"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>배송 요청사항</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>부재 시 문 앞</span>
            </div>
          </div>
        </li>

        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>발송처리일</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span></span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>배송완료일</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>
                <span></span>
              </span>
            </div>
          </div>
        </li>
        <li className={`${s["t-row"]}`}>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>송장번호</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span></span>
            </div>
          </div>
          <div className={s["t-box"]}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>구매확정일</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span></span>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
}










function Popup_MemeberDetailPage() {

  const test_itemList = [1,2,3];
  const [orderType, setfirst] = useState(second)


  return (
    <>
      <div id={s.popup}>
        <PopupWrapper style={{ width: 1000 }}>
          <header className={s.header}>
            <div className={s.row}>
              <div className={s.cont}>
                <h1 className={s["popup-title"]}>주문상세정보</h1>
                <PopupCloseButton_typeX />
              </div>
            </div>
          </header>
          <main className={s.body}>
            <div className={s.row}>
              <section className={s.table}>
                <ul>
                  <li className={s["table-list"]}>
                    <ProductInfo_dog />
                  </li>
                  <li className={s["table-list"]}>
                    <ProductInfo_subscribe />
                    <ProductInfo_subscribe isChangedSubscribeInfo={true} />
                  </li>
                  <li className={s["table-list"]}>
                    <ProductInfo_basicOrderInfo />
                  </li>
                  <li className={s["table-list"]}>
                    <div className={s["t-header"]}>
                      <h4 className={s.title}>주문상품</h4>
                    </div>
                    {test_itemList.map((data, index) => (
                      <ProductInfo_singleItemList
                        key={`product-items-list-${index}`}
                      />
                    ))}
                  </li>
                  <li className={s["table-list"]}>
                    <ProductInfo_payment />
                  </li>
                  <li className={s["table-list"]}>
                    <ProductInfo_delivery />
                  </li>
                </ul>
              </section>
              <section className={s["btn-section"]}>
                <PopupCloseButton />
              </section>
            </div>
          </main>
        </PopupWrapper>
      </div>
    </>
  );
}

export default Popup_MemeberDetailPage;
