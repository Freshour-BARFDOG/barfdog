import React from 'react';
import { useDispatch } from "react-redux";
import { authAction } from "/store/auth-slice";
import AdminWrapper from '/src/components/admin/AdminWrapper';
import Image from 'next/image';
import s from "./adminHeader.module.scss";
import Link from 'next/link';
import {IoMenuSharp} from "react-icons/io5";
import {userStateAction} from "@store/userState-slice";
import useUserData from "@util/hook/useUserData";

function AdminHeader({folded}) {
  const userData = useUserData();
  console.log(userData)
  const dispatch = useDispatch();
  const onLogoutHandler = () => {
    dispatch(authAction.adminLogout());
  }

  const onChangeGnbMode = ()=>{
    dispatch(folded ? userStateAction.unfold() : userStateAction.fold());
  }

  return (
    <header id={s.admin_header}>
      <AdminWrapper>
        <div className={`${s.inner}`}>
          <button type={"button"} className={`${s['gnb-toggle-fold-button']}`} onClick={onChangeGnbMode}>
            <IoMenuSharp size={'24'}/>
          </button>
          <div className={s.logo}>
            <Link href="/" passHref>
              <a>
                <Image
                  src={require("/public/img/logo(admin).png")}
                  srcSet={require("/public/img/logo(admin)@2x.png")}
                  alt="어드민 로고"
                  layout="responsive"
                  objectfit="contains"
                  priority
                ></Image>
              </a>
            </Link>
          </div>
          <ul className={s.header_menus}>
            <li className={s.admin_info}>
              
              <b className={s.admin_name}>{userData?.name}
                <span className={s.admin_email}>{userData?.email}</span>
              </b>님 반갑습니다.
            </li>
            <li>
              <button
                type="button"
                id="logout"
                className={s.btn_logout}
                onClick={onLogoutHandler}
              >
                로그아웃
              </button>
            </li>
          </ul>
        </div>
      </AdminWrapper>
    </header>
  );
}

export default AdminHeader