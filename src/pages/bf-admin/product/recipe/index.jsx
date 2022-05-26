import React, { useState } from "react";
import s from './recipe.module.scss';
import AdminLayout from "@src/components/admin/AdminLayout";
import { AdminContentWrapper } from "@src/components/admin/AdminWrapper";
import MetaTitle from "@src/components/atoms/MetaTitle";
import axios from "axios";
import axiosConfig from "/api/axios.config";
import AmdinErrorMessage from "@src/components/atoms/AmdinErrorMessage";
import sorting from "@util/func/sorting";
import Pagination from "@src/components/atoms/Pagination";
import RecipeList from "./RecipeList";




const TEST_ITEM = [1, 2, 3, 4, 5];



function RecipePage() {

  const [modalMessage, setModalMessage] = useState("");
  const [itemList, setItemList] = useState(TEST_ITEM);
  const [searchValue, setSearchValue] = useState({});

  console.log(searchValue);
  const onResetSearchValues = (e) => {
    setSearchValue("");
    console.log("초기화 실행");
  };

  const onSearchHandler = (e) => {
    console.log("검색 실행");
  };

  return (
    <>
      <MetaTitle title="레시피 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <h1 className="title_main">레시피 관리</h1>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">
                레시피 목록 &#40;총<em className={s["product-count"]}>4</em>
                개&#41;
              </p>
              <div className="controls cont-left"></div>
            </div>
            <div className={`${s.cont_viewer}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>레시피명</li>
                  <li className={s.table_th}>가격상수&#40;원/g&#41;</li>
                  <li className={s.table_th}>무게상수&#40;g/Kcal&#41;</li>
                  <li className={s.table_th}>품절여부</li>
                  <li className={s.table_th}>노출여부</li>
                  <li className={s.table_th}>최초 등록일</li>
                  <li className={s.table_th}>마지막 수정일</li>
                  <li className={s.table_th}>수정</li>
                  <li className={s.table_th}>삭제</li>
                </ul>
                {itemList.length ? (
                  <RecipeList
                    items={itemList}
                    // onDeleteItem={onDeleteItem}
                  />
                ) : (
                  <AmdinErrorMessage text="조회된 데이터가 없습니다." />
                )}
              </div>
            </div>
            <div className={s["pagination-section"]}>
              <Pagination
                itemCountPerGroup={10}
                itemTotalCount={100}
                className={"square"}
              />
            </div>
          </section>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default RecipePage;
