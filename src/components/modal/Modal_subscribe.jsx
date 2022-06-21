import s from "./modal_subscribe.module.scss";
import React, {useEffect, useState} from "react";
import { useModalContext } from "@store/modal-context";
import Link from "next/link";
import Image from "next/image";
import zIndex from "/styles/global/zIndex.module.scss";
import rem from "/util/func/rem";
import CloseButton from "/src/components/atoms/CloseButton";





function Modal_subscribe() {
  const mcx = useModalContext();
  const MODAL_ACTIVE_STATE = mcx.subscribe?.isActive;


  
  
  useEffect(() => {
 
    if (MODAL_ACTIVE_STATE) {
      const scrollYPos = mcx.event.scrollY;
      document.body.style.cssText = `
        overflow-y:scroll;
        position:fixed;
        width:100%;
        top : -${scrollYPos}px;
      `;
    }
   
    return () => {
      document.body.style.cssText = ``;
      window?.scrollTo(0, parseInt(-mcx.event.scrollY || 10) * -1);
    };

  }, [MODAL_ACTIVE_STATE, mcx.event.scrollY]);
  
  const onCloseModalHandler = () => {
    mcx.subscribe.onHide();
  };

  return (
    <>
      {MODAL_ACTIVE_STATE && (
        <section
          className={`${s["modal-subscribe"]} ${zIndex["modal-subscribe"]}`}
        >
          <div className={s.background} onClick={onCloseModalHandler}></div>
          <div className={s.body}>
            <div className={s.container}>
              <ModalCont onCloseModalHandler={onCloseModalHandler} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default Modal_subscribe;







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
          <figure className={`${s["img-main"]} img-wrap`}>
            <i className={`${s["img-sale"]} img-wrap`}>
              <Image
                src={require("/public/img/modal-sale.png")}
                objectFit="contain"
                layout="fill"
                alt="세일 아이콘"
              />
            </i>
            <Image
              src={require("/public/img/modal-subscribeItem.png")}
              objectFit="cover"
              layout="fill"
              alt="정기구독 이미지"
            />
          </figure>
          <figcaption className={s["title-section"]}>
            <h3 className={s.title}>정기구독</h3>
            <p className={s.subtitle}>
              <b>정기구독</b>으로 더욱 저렴하고 간편하게!
            </p>
            <div className={s.desc}>
              <p>반려견 정보 작성으로</p>
              <p>완벽 맞춤 생식을 정기구독 할 수 있습니다</p>
            </div>
          </figcaption>
          <div className={s["btn-section"]}>
            <Link href="/surveyGuide" passHref>
              <a className="flex-wrap" onClick={onCloseModalHandler}>
                정기구독 시작하기
              </a>
            </Link>
          </div>
        </li>
        <li className={s.card}>
          <figure className={`${s["img-main"]} img-wrap`}>
            <Image
              src={require("/public/img/modal-singleItem.png")}
              objectFit="cover"
              layout="fill"
              alt="정기구독 이미지"
            />
          </figure>
          <figcaption className={s["title-section"]}>
            <h3 className={s.title}>단품구매</h3>
            <p className={s.subtitle}>
              바프독 <b>생식을 체험</b>하고 싶을 때!
            </p>
            <div className={s.desc}>
              <p>shop에서 바프독 비기너 세트를</p>
              <p>구입할 수 있습니다</p>
            </div>
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