import React, { useState, useEffect } from "react";
import s from './recipe.module.scss';
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AmdinErrorMessage from "/src/components/atoms/AmdinErrorMessage";
import RecipeList from "./RecipeList";
import Spinner from "/src/components/atoms/Spinner";
import {getData} from "/src/pages/api/reqData";
import {MirrorTextOnHoverEvent} from "/util/func/MirrorTextOnHoverEvent";







function RecipePage() {
  
  const getListApiUrl = '/api/recipes';
  const apiDataQueryString = 'recipeListResponseDtoList';
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);
  
  useEffect( () => {
    MirrorTextOnHoverEvent(window);
  }, [itemList] );
  

  useEffect( () => {
    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: true,
        }));
        const res = await getData(getListApiUrl);
        const data = res.data._embedded[apiDataQueryString];
        setItemList(data);
      } catch (err) {
        console.error(err);
        alert('데이터를 가져올 수 없습니다.');
      }
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    })();
  }, [] );
  
  

  return (
    <>
      <MetaTitle title="레시피 관리" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <div className="title_main">
            <h1>
              레시피 관리
              {isLoading.fetching && <Spinner />}
            </h1>
          </div>
          <section className="cont">
            <div className="cont_header clearfix">
              <p className="cont_title cont-left">
                레시피 목록 &#40;총<em className={s['product-count']}>{itemList.length}</em>
                개&#41;
              </p>
              <div className="controls cont-left"></div>
            </div>
            <div className={`${s.cont_viewer}`}>
              <div className={s.table}>
                <ul className={s.table_header}>
                  <li className={s.table_th}>레시피 이름</li>
                  <li className={s.table_th}>레시피 설명</li>
                  <li className={s.table_th}>가격 상수&#40;원/g&#41;</li>
                  <li className={s.table_th}>무게 상수&#40;Kcal/g&#41;</li>
                  <li className={s.table_th}>재료</li>
                  <li className={s.table_th}>노출 여부</li>
                  <li className={s.table_th}>판매 여부</li>
                  <li className={s.table_th}>마지막 수정일</li>
                  <li className={s.table_th}>수정</li>
                  <li className={s.table_th}>삭제</li>
                </ul>
                {itemList.length ? (
                  <RecipeList
                    items={itemList}
                  />
                ) : (
                  <AmdinErrorMessage text="조회된 데이터가 없습니다." />
                )}
              </div>
            </div>
          </section>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default RecipePage;
