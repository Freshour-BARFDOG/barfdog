import React, { useEffect } from 'react';
import useDeviceState from '/util/hook/useDeviceState';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { IoIosArrowForward } from 'react-icons/io';
import s from './mobileUserInfoIndex.module.scss';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';



export default function MobileUserInfoIndexPage() {
  const router = useRouter();
  const isMobile = useDeviceState().isMobile;

  useEffect(() => {
    if (isMobile === false) {
      alert('모바일에서 접속 가능한 페이지입니다.');
      router.back();
    }
  }, [isMobile]);

  return (
    <>
      <MetaTitle title="마이페이지 계정정보" />
      <Layout>
        <Wrapper>
          <section className={s['routing-menu-section']}>
            <ul>
              <MenuList title={'회원정보 변경'} link={'/mypage/user/info'} />
              <MenuList title={'비밀번호 변경'} link={'/mypage/user/changePassword'} />
              <MenuList title={'연동 SNS'} link={'/mypage/user/sns'} />
            </ul>
          </section>
        </Wrapper>
      </Layout>
    </>
  );
}

const MenuList = ({ title, link, onClick, contClassName, removeIcon }) => {
  const onClickHandler = () => {
    if (onClick && typeof onClick === 'function') onClick();
  };
  return (
    <li>
      {link ? (
        <Link href={link} passHref>
          <a className={contClassName || ''}>{title}</a>
        </Link>
      ) : (
        <button className={contClassName || ''} type={'button'} onClick={onClickHandler}>
          {title}
        </button>
      )}
      {!removeIcon && <IoIosArrowForward />}
    </li>
  );
};
