import Link from 'next/link';
import React from 'react';
import AdminLayout from "@src/components/admin/AdminLayout";
import { AdminContentWrapper } from "@src/components/admin/AdminWrapper";
import MainBannerList from './MainBannerList';
// import { arrayMove, SortableContainer, SortableElement } from "react-sortable-hoc";

// console.log(arrayMove)
import Styled from 'styled-components';
import rem from '@src/components/atoms/rem';



// * 순서편집 클릭 -> 1. 저장버튼 2. 순서 변경 아이콘 등장

// * 순서편집 에로우 클릭 -> 전체 순서 중에서, 클릭한 아이의 위치를 한 칸 올린다 & 내린다.


export const Btn_LinkToPage = ({ href, name }) => {
  const Button = Styled.button`
    background-color: var(--color-primary04);
    padding: ${rem(11)} 0;
    text-align: center;
    color: #fff;
    font-size: ${rem(15)};
    display:inline-block;
    min-width: ${rem(160)};
    border-radius: ${rem(2)};
    height: ${rem(44)};
    cursor:pointer;
  `;
  return (
    <Link href={href} passHref>
      <a>
        <Button type="button">{name}</Button>
      </a>
    </Link>
  );
};


const Btn_editOrder = () => {
  return ;
}


// export const Btn_ToPage = ({ href, as, name }) => {
//   const Button = Styled.button`
//     background-color: var(--color-primary01);
//     padding: ${rem(11)} 0;
//     text-align: center;
//     color: #fff;
//     font-size: ${rem(15)};
//     display:inline-block;
//     min-width: ${rem(160)};
//     border-radius: ${rem(2)};
//     height: ${rem(44)};
//   `;

  
//   return (
//     <Link href={href} as={as ? as : ""} passHref>
//       <a>
//         <Button type="button">{name}</Button>
//       </a>
//     </Link>
//   );
// };




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
        <h1 className="title_main">메인배너</h1>
        <div className="cont">
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
              <button
                type="button"
                id="edit_order"
                className="admin_btn line basic_m"
              >
                순서편집
              </button>
              <button
                type="button"
                id="set_order"
                className="admin_btn line basic_m point"
              >
                저장
              </button>
            </div>
          </div>
          <div className="cont_viewer">
            <div className='table'>
              <ul>
                <li className='table_th'>순서</li>
                <li className='table_th'>배너이름</li>
                <li className='table_th'>이미지</li>
                <li className='table_th'>노출대상</li>
                <li className='table_th'>등록일</li>
                <li className='table_th'>수정</li>
                <li className='table_th'>삭제</li>
              </ul>
              <MainBannerList items={AllData} />
            </div>
          </div>
        </div>
        {/* inner */}
      </AdminContentWrapper>
    </AdminLayout>
  );
}

export default MainBannerIndexPage;