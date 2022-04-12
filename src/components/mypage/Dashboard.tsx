import React, { useEffect } from "react";
import s from "/styles/css/mypage/dashboard.module.scss";
import User_counter_viewer from "./User_counter_viewer";
import Image from "next/image";
import { IoMdMail } from "react-icons/io";
import { IoMdLink } from "react-icons/io";





function Dashboard({ className, ...props }) {

  

  const dogName:string = '바둑이'; 
  const userName:string = '김바프'; 
  const userClass:string = '웰컴';
  const userRecommandCode: string = "6SE7855FA";
  const numberOfdeliveries: number = 7;
  const earnPoint: number = 3200;
  const numberOfCoupons: number = 1;


  return (
    <section className={`${className} ${s.dashboard}`} {...props}>
      <div className={s.user_info}>
        <div className={s.info_row}>
          <div className={s.info_col}>
            <figure className={`${s.user_photo} img-wrap`}>
              <Image
                alt="반려견 대표 이미지"
                src="https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                objectFit="cover"
                layout="fill"
              />
            </figure>
            <figcaption className={s.user_names}>
              <em className={s.user_name}>
                <span>{dogName}</span> 견주
              </em>
              <em className={s.dog_name}>
                <span>{userName}</span>님
              </em>
            </figcaption>
          </div>
          {/* info_col */}
          <div className={`${s.info_col}`}>
            <div className={s.user_class}>
              <p>회원님은</p>
              <p>
                <span>{userClass}</span>등급 입니다.
              </p>
            </div>
          </div>
        </div>
        <div className={`${s.info_row} ${s.user_recommand}`}>
          <div className={`${s.recommand_code} ${s.info_col} flex-wrap`}>
            <span>추천코드</span>
            <span className={s.code}>{userRecommandCode}</span>
          </div>
          <div className={`${s.send_sms} ${s.info_col} flex-wrap`}>
            <button type="button">
              <IoMdMail />
              문자보내기
            </button>
          </div>
          <div className={`${s.copy_site_link} ${s.info_col} flex-wrap`}>
            <button type="button">
              <IoMdLink />
              링크복사
            </button>
          </div>
        </div>
      </div>
      {/* user_info */}

      <div className={s.user_counter}>
        <ul>
          <User_counter_viewer
            title="배송예정"
            counter={numberOfdeliveries}
            unit="건"
          />
          <User_counter_viewer title="적립금" counter={earnPoint} unit="원" />
          <User_counter_viewer
            title="보유쿠폰"
            counter={numberOfCoupons}
            unit="개"
          />
        </ul>
      </div>
      {/* user_counter */}
    </section>
  );
}

export default Dashboard;
