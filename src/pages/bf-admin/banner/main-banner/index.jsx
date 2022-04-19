import Link from 'next/link';
import React from 'react';
import AdminLayout from "@src/components/admin/AdminLayout";
import { AdminContentWrapper } from "@src/components/admin/AdminWrapper";
import MainBannerList from './MainBannerList';


import Styled from 'styled-components';
import rem from '@src/components/atoms/rem';


export const Btn_LinkToPage = ({ href, name }) => {
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
    <Link href={href} passHref>
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




// interface BannerList {
//   order: number,
//   name: string,
//   link: string,
//   exp_target: string,
//   reg_date: string
// }



function MainBannerIndexPage() {

  // const exampleData: BannerList[] = [];

  const AllData= [
    {
      order: 1,
      name: "메인배너",
      link: "https://images.unsplash.com/photo-1650210923764-ca790a46e632?ixlib=rb-1.2.1",
      exp_target: "비회원",
      reg_date: "22/01/14",
    },
    {
      order: 2,
      name: "메인배너2",
      link: "https://images.unsplash.com/photo-1650210923764-ca790a46e632?ixlib=rb-1.2.1",
      exp_target: "회원",
      reg_date: "22/04/19",
    },
  ];


  return (
    <AdminLayout>
      <AdminContentWrapper>
        <h1 className="admin_title_main">메인배너</h1>
        <div className="inner">
          <div className="cont_header clearfix">
            <p className="cont_title cont-left" style={{ height: rem(44) }}>
              목록
            </p>
            <div className="cont-right">
              <Btn_LinkToPage
                href="/bf-admin/banner/main-banner/createMainBanner"
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
          </div>
          <div className="cont_viewer">
            <table>
              <tr>
                <th>순서</th>
                <th>배너이름</th>
                <th>이미지</th>
                <th>노출대상</th>
                <th>등록일</th>
                <th>수정</th>
                <th>삭제</th>
              </tr>
              <MainBannerList items={AllData} />
            </table>
          </div>
        </div>
        {/* inner */}
      </AdminContentWrapper>
    </AdminLayout>
  );
}

export default MainBannerIndexPage;