import Image from 'next/image';
import React from 'react';




export default function MainBannerList({items}) {



  return (
    <ul className="cont_list">
      {items.map((data, index) => {
        return (
          <li key={index}>
            <tr>
              <td>{data.order}</td>
              <td>{data.name}</td>
              <td>
                <figure className="img-wrap">
                  <Image
                    src="https://images.unsplash.com/photo-1650210923764-ca790a46e632?ixlib=rb-1.2.1"
                    alt="메인배너 이미지"
                    objectFit="contain"
                    layout="fill"
                  ></Image>
                </figure>
              </td>
              <td>{data.exp_target}</td>
              <td>{data.reg_date}</td>
              <td>
                <button className="admin_btn confirm_m solid">수정</button>
              </td>
              <td>
                <button className="admin_btn confirm_m solid">삭제</button>
              </td>
            </tr>
          </li>
        );
        
      })}
     
    </ul>
  );
}