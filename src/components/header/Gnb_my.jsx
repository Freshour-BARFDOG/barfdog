import {useSelector} from "react-redux";
import {useRouter} from "next/router";
import s from "./header.module.scss";
import Icon_cart from "../../../public/img/icon/cart.svg";
import Icon_mypage from "../../../public/img/icon/mypage.svg";
import DeadlineTimer from "../atoms/DeadlineTimer";
import React from "react";

export const Gnb_my = ({isMobile, setSidrOpen, authData}) => {
  const userInfo = authData?.userInfo;
  const cart = useSelector( (s) => s.cart );
  const router = useRouter();
  
  const onShowMobileSideMenu = () => {
    setSidrOpen( true );
  };
  const onMovePage = async (e) => {
    e.preventDefault();
    if ( !userInfo ) {
      await router.push('/account/login');
      return alert( '로그인 후 이용가능합니다.' );
    }
    
    const btn = e.currentTarget;
    const link = btn.dataset.link;
    await router.push( link );
  };
  
  return (
    <>
      <div className={s.gnb_my}>
        <ul className="clearfix">
          <li>
            <button id="gnb_cart" data-link={'/cart'} onClick={onMovePage}>
              <div className={s.shop_wrap}>
                {/* <Icon_cart/> */}
                <span className={s.gnb_shop_count}>{cart.itemCount || 0}</span>
              </div>
            </button>
          </li>
          <li>
            {isMobile ? (
              <button type={'button'} onClick={onShowMobileSideMenu}>
                <div className={s.mypage_wrap}>
                  {/* <Icon_mypage/> */}
                </div>
              </button>
            ) : (
              <button data-link={'/mypage/orderHistory'} onClick={onMovePage}>
                <div className={s.mypage_wrap}>
                  {/* <Icon_mypage/> */}
                </div>
              </button>
            )}
          </li>
        </ul>
      </div>
      <i id={'DeadlineTimer-wrapper'} className={'mobile'}>
        <DeadlineTimer/>
      </i>
    </>
  );
};