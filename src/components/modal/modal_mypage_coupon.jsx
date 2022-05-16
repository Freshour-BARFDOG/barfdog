import s from "./modal_mypage_coupon.module.scss";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import zIndex from "@styles/global/zIndex.module.scss";
import rem from "@src/components/atoms/rem";
import CloseButton from "@src/components/atoms/CloseButton";



function Modal_useCoupon({ isActiveModal, setIsActiveModal }) {



  useEffect(() => {
    const scrollYPos = window.scrollY;
    if (isActiveModal) {
      document.body.style.cssText = `
        overflow-y:scroll;
        position:fixed;
        width:100%;
        top : -${scrollYPos}px;
      `;
    }

    return () => {
      document.body.style.cssText = ``;
      window?.scrollTo(0, parseInt(-scrollYPos || 10) * -1);
    };
  }, [isActiveModal]);

  const onHideModalHandler = () => {
    setIsActiveModal(false);
  };

  return (
    <>
      <section
        className={`${s["modal-subscribe"]} ${zIndex["modal-subscribe"]}`}
      >
        <div className={s.background} onClick={onHideModalHandler}></div>
        <div className={s.body}>
          <div className={s.container}>
            <ModalCont onCloseModalHandler={onHideModalHandler} />
          </div>
        </div>
      </section>
    </>
  );
}

export default Modal_useCoupon;







const closeButtonStyles = (windowWidth) => {
  if(!windowWidth) return;

  let style;
  const triggeredWindowWidth = 600;

  style = {
    width: windowWidth > triggeredWindowWidth ? `${rem(40)}` : `${rem(20)}`,
    height: windowWidth > triggeredWindowWidth ? `${rem(40)}` : `${rem(20)}`,
  };
  return style;
};



const ModalCont = ({onCloseModalHandler}) => {
  const [btnStylesObj, setBtnStyleObj] = useState({});

  useEffect(() => {
    setBtnStyleObj(closeButtonStyles(window.innerWidth));
  }, []);


  return (
    <div className={s.cont}>
      <i className={s.btn_close_modal} onClick={onCloseModalHandler}>
        <CloseButton style={btnStylesObj} />
      </i>
      <ul>
        <li className={s.card}>
          <h3 className={s.title}>정기구독</h3>
          <figure className={`${s["img-main"]} img-wrap`}>
            <Image
              src={require("/public/img/modal-subscribeItem.png")}
              objectFit="cover"
              layout="fill"
              alt="정기구독 이미지"
            />
          </figure>
          <figcaption className={s.desc}>
            <p>반려견 정보를 작성하시면</p>
            <p>내 반려견에 딱 맞는 생식을 정기배송해드려요</p>
          </figcaption>
          <div className={s["btn-section"]}>
            <Link href="/survey" passHref>
              <a className="flex-wrap" onClick={onCloseModalHandler}>
                정기구독 시작하기
              </a>
            </Link>
          </div>
        </li>
        <li className={s.card}>
          <h3 className={s.title}>단품구매</h3>
          <figure className={`${s["img-main"]} img-wrap`}>
            <Image
              src={require("/public/img/modal-singleItem.png")}
              objectFit="cover"
              layout="fill"
              alt="정기구독 이미지"
            />
          </figure>
          <figcaption className={s.desc}>
            <p>바프독의 다양한 상품을 만나보세요</p>
          </figcaption>
          <div className={s["btn-section"]}>
            <Link href="/shop?category=all" passHref>
              <a className="flex-wrap" onClick={onCloseModalHandler}>
                상품 보러 가기
              </a>
            </Link>
          </div>
        </li>
      </ul>
    </div>
  );
  
}