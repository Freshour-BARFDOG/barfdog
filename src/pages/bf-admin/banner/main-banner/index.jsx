import Link from 'next/link';
import React from 'react';
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
// import s from "/styles/admin/adminCommon.module.scss";


import Styled from 'styled-components';
import rem from '/src/components/atoms/rem';
import Image from "next/image";


export const Btn_LinkToPage = ({ href, as, name }) => {
  const Button = Styled.button`
    background-color: var(--color-primary01);
    padding: ${rem(11)} 0;
    text-align: center;
    color: #fff;
    font-size: ${rem(15)};
    display:inline-block;
    min-width: ${rem(160)};
    border-radius: ${rem(2)};
    height: ${rem(44)};
  `;
  return (
    <Link href={href} as={as ? as : ""} passHref>
      <a>
        <Button type="button">{name}</Button>
      </a>
    </Link>
  );
};



export const Btn_ToPage = ({ href, as, name }) => {
  const Button = Styled.button`
    background-color: var(--color-primary01);
    padding: ${rem(11)} 0;
    text-align: center;
    color: #fff;
    font-size: ${rem(15)};
    display:inline-block;
    min-width: ${rem(160)};
    border-radius: ${rem(2)};
    height: ${rem(44)};
  `;
  return (
    <Link href={href} as={as ? as : ""} passHref>
      <a>
        <Button type="button">{name}</Button>
      </a>
    </Link>
  );
};









function MainBannerindex() {
  const data = {
    order: 1,
    name: '메인배너',
    img_link:
      "https://images.unsplash.com/photo-1650210923764-ca790a46e632?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    exp_target: "비회원",
    reg_date: "22/01/14",
  };
  return (
    <AdminLayout>
      <AdminContentWrapper>
        <h1 className="admin_title_main">메인배너</h1>
        <div className="inner">
          <section className="cont_header clearfix">
            <p className="cont_title cont-left" style={{ height: rem(44) }}>
              목록
            </p>
            <div className="cont-right">
              <Btn_LinkToPage
                href="/bf-admin/banner/main-banner/createMainBannerPage"
                as="/bf-admin/banner/main-banner/create"
                name="배너등록"
              />
            </div>
            <div className="controls cont-left">
              <ul>
                <li>
                  <button
                    type="button"
                    id="set_order"
                    className="admin_btn line basic_l"
                  >
                    순서편집
                  </button>
                </li>
              </ul>
            </div>
          </section>
          <section className="cont_viewer">
            <table>
              <caption className="hide">메인배너 리스트</caption>
              <tr>
                <th>순서</th>
                <th>배너이름</th>
                <th>이미지</th>
                <th>노출대상</th>
                <th>등록일</th>
                <th>수정</th>
                <th>삭제</th>
              </tr>
              <ul className="cont_list">
                <li>
                  <tr>
                    <td>{data.order}</td>
                    <td>{data.name}</td>
                    <td>
                      <div className="img-wrap">
                        <Image
                          src="https://images.unsplash.com/photo-1650210923764-ca790a46e632?ixlib=rb-1.2.1"
                          alt="메인배너 이미지"
                          objectFit="contain"
                          layout="fill"
                        ></Image>
                      </div>
                    </td>
                    <td>{data.exp_target}</td>
                    <td>{data.reg_date}</td>
                    <td>
                      <button className="admin_btn confirm_m solid">
                        수정
                      </button>
                    </td>
                    <td>
                      <button className="admin_btn confirm_m solid">
                        삭제
                      </button>
                    </td>
                  </tr>
                </li>
                <li>
                  <tr>
                    <td>{data.order}</td>
                    <td>{data.name}</td>
                    <td>
                      <div className="img-wrap">
                        <Image
                          src="https://images.unsplash.com/photo-1650210923764-ca790a46e632?ixlib=rb-1.2.1"
                          alt="메인배너 이미지"
                          objectFit="contain"
                          layout="fill"
                        ></Image>
                      </div>
                    </td>
                    <td>{data.exp_target}</td>
                    <td>{data.reg_date}</td>
                    <td>
                      <button className="admin_btn confirm_m solid">
                        수정
                      </button>
                    </td>
                    <td>
                      <button className="admin_btn confirm_m solid">
                        삭제
                      </button>
                    </td>
                  </tr>
                </li>
                <li>
                  <tr>
                    <td>{data.order}</td>
                    <td>{data.name}</td>
                    <td>
                      <div className="img-wrap">
                        <Image
                          src="https://images.unsplash.com/photo-1650210923764-ca790a46e632?ixlib=rb-1.2.1"
                          alt="메인배너 이미지"
                          objectFit="contain"
                          layout="fill"
                        ></Image>
                      </div>
                    </td>
                    <td>{data.exp_target}</td>
                    <td>{data.reg_date}</td>
                    <td>
                      <button className="admin_btn confirm_m solid">
                        수정
                      </button>
                    </td>
                    <td>
                      <button className="admin_btn confirm_m solid">
                        삭제
                      </button>
                    </td>
                  </tr>
                </li>
              </ul>
            </table>
          </section>
        </div>
        {/* inner */}
      </AdminContentWrapper>
    </AdminLayout>
  );
}

export default MainBannerindex;