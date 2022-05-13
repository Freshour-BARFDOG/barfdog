import s from "./modal_subscribe.module.scss";
import React, {useEffect} from "react";
import { useModalContext } from "@store/modal-context";
import rem from "@src/components/atoms/rem";
import zIndex from "@styles/global/zIndex.module.scss";





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
      window.scrollTo(0, parseInt(-mcx.event.scrollY || 10) * -1);
    };

  }, [MODAL_ACTIVE_STATE, mcx.event.scrollY]);

  const onClickHandler = () => {
    mcx.subscribe.onHide();
  };

  return (
    <>
      {MODAL_ACTIVE_STATE && (
        <section className={`${s['modal-subscribe']} ${zIndex["modal-subscribe"]}`}>
          <div className={s.background}onClick={onClickHandler}></div>
          <div className={s.body}>
            <div className={s.container}>
              <div className={s.cont}>
                <ul>
                  <li>내용물</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default Modal_subscribe;
