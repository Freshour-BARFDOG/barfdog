import Image from 'next/image';
import React from 'react';




export default function MainBannerList({items}) {

  if(!items)return;

  return (
    <div className="cont_list">
      {items.map((data, index) => {
        return (
          <div key={index} className="item">
            <span>{data.order}</span>
            <span>{data.name}</span>
            <span>
              <figure className="img-wrap">
                <Image
                  src="https://images.unsplash.com/photo-1650210923764-ca790a46e632?ixlib=rb-1.2.1"
                  alt="메인배너 이미지"
                  objectFit="contain"
                  layout="fill"
                ></Image>
              </figure>
            </span>
            <span>{data.exp_target}</span>
            <span>{data.reg_date}</span>
            <span>
              <button className="admin_btn basic_s solid">수정</button>
            </span>
            <span>
              <button className="admin_btn basic_s solid">삭제</button>
            </span>
          </div>
        );
        
      })}
     
    </div>
  );
}