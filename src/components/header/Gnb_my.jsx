import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { setPreviousPath } from '/store/navigation-slice';
import s from './header.module.scss';
import Icon_cart from '../../../public/img/icon/cart.svg';
import Icon_mypage from '../../../public/img/icon/mypage.svg';
import DeadlineTimer from '../atoms/DeadlineTimer';
import React from 'react';

export const Gnb_my = ({ isMobile, setSidrOpen, authData, showDeadlineTimer = true }) => {
  const userInfo = authData?.userInfo;
  const cart = useSelector((s) => s.cart);
  const router = useRouter();
  const dispatch = useDispatch();

  const onShowMobileSideMenu = () => {
    setSidrOpen(true);
  };
  const onMovePage = async (e, page) => {
    e.preventDefault();
    if (!userInfo) {
      // 로그인 이후 바로 특정 페이지(마이페이지, 장바구니)로 이동
      dispatch(setPreviousPath(page));
      return await router.push('/account/login');
    }

    const btn = e.currentTarget;
    const link = btn.dataset.link;
    await router.push(link);
  };

  return (
    <>
      <div className={s.gnb_my}>
        <ul className="clearfix">
          <li>
            <button
              id="gnb_cart"
              data-link={'/cart'}
              onClick={(e) => onMovePage(e, '/cart')}
            >
              <div className={s.shop_wrap}>
                {/* <Icon_cart/> */}
                <span className={s.gnb_shop_count}>{cart.itemCount || 0}</span>
              </div>
            </button>
          </li>
          <li>
            {isMobile ? (
              <button type={'button'} onClick={onShowMobileSideMenu}>
                <div className={s.mypage_wrap}>{/* <Icon_mypage/> */}</div>
              </button>
            ) : (
              <button
                data-link={'/mypage/orderHistory'}
                onClick={(e) => onMovePage(e, '/mypage/orderHistory')}
              >
                <div className={s.mypage_wrap}>{/* <Icon_mypage/> */}</div>
              </button>
            )}
          </li>
        </ul>
      </div>
      {showDeadlineTimer && 
        <i id={'DeadlineTimer-wrapper'} className={'mobile'}>
          <DeadlineTimer />
        </i>
      }
    </>
  );
};
