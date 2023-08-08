import MetaTitle from "../../components/atoms/MetaTitle";
import React from "react";
import s from "./siteMaintenance.module.scss";
import RunningDog from "../../../public/img/barfdog_Loading.gif";
import Image from "next/image";
import MobileLogo from "../../../public/img/mobile_logo.svg";


export default function SiteMaintenance () {

  return <>
    <main className={s.main}>
      <header className={s.header}><MobileLogo width='100%' height='100%' viewBox="0 0 146 20" /></header>
      <MetaTitle title="사이트 점검 중" />
      <section className={s.titleSection}>
        <i className={s.dog}>
          <Image src={RunningDog} objectFit={'contains'} layout={'fill'}></Image>
        </i>
        <h1 className={s.title}>사이트 <em className={"pointColor"}>점검 중</em> 입니다.</h1>
        <div className={s.desc}>
          <p>서비스 이용에 불편을 드려 죄송합니다.</p>
          <p>서비스 안정화를 위해 시스템 점검이 진행되고 있습니다.</p>
          <p>보다 나은 서비스를 위해 노력하겠습니다.</p>
          <p>고객 여러분의 양해 부탁드립니다. 감사합니다.</p>
        </div>

      </section>

      <section className={s.infoSection}>
        <hr/>
        <h3 className={s['title']}>점검일시</h3>
        <p className={s['detail']}>
          <span>2023년 08월 09일 (화) 오전 9시까지</span>
        </p>
      </section>
    </main>
  </>;
}
