import React, { useState } from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import AdminLayout from "/src/components/admin/AdminLayout";
import { AdminContentWrapper } from "/src/components/admin/AdminWrapper";
import s from "./create.module.scss";
import Image from "next/image";
import RatingStars from "/src/components/atoms/RatingStars";
import User_class_box from '../../../../components/atoms/User_class_box';
import SelectTag from "@src/components/atoms/SelectTag";



/* // ! -----------  client페이지 > format 동일 // + 유저이름 input 추가  ------------ */

// * 상품선택 (모든 상품 리스트 ) 
// * 1. 상품명 2. 카테고리 3. 정기구독의 경우 > N회차 입력란
// * 주문일자 => 작성일자 
//


function CreateRewardPage() {
  const [isCategorySubscribe, setIsCategorySubscribe] = useState(false);
  // onProductCategoryHandler
  const onProductCategorySelectHandler = (e) => {
    const category = e.currentTarget;
    console.log(category);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    const curImageIdList = filterImageId(body);
    // const imageDatas = compareImageList(tempImageIdList, curImageIdList);
    const imageDatas = compareImageList();

    console.log(curImageIdList);
    console.log(imageDatas);
    // ************** 유효성검사 -> JSON데이터 보내기
    // 현재 body 속에 저장된 이미 지리스트를 비교한다..
    return;
    setFormErrors(validate(formValues));
    if (Object.keys(formErrors).length) return console.error(formErrors);
    postDataToServer();
  };

  return (
    <>
      <MetaTitle title="리뷰 생성" admin={true} />
      <AdminLayout>
        <AdminContentWrapper>
          <section className={s.title}>후기 생성</section>
          <form
            action="/"
            className={`${s.form} cont`}
            encType="multipart/form-data"
            method="post"
            onSubmit={onSubmitHandler}
          >
            <div className={`${s.formGuide}`}>
              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="banner-name">
                      상품카테고리
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <SelectTag
                        name={"category"}
                        id={"category"}
                        onChange={onProductCategorySelectHandler}
                        options={[
                          { label: "선택", value: "" },
                          { label: "정기구독", value: "SUBSCRIBE" },
                          { label: "일반상품", value: "NORMAL" },
                        ]}
                      />
                      {true && (
                        <label
                          htmlFor="addedCategory-normalProduct"
                          className={s["addedCategory"]}
                        >
                          <SelectTag
                            name={"category"}
                            id={"category"}
                            // onChange={onCategoryHandler}
                            options={[
                              { label: "일반상품 카테고리 선택", value: "" },
                              { label: "생식", value: "RAW" },
                              { label: "토핑", value: "TOPPING" },
                              { label: "굿즈", value: "GOODS" },
                            ]}
                          />
                        </label>
                      )}
                      {/* {formErrors.name && (
                        <ErrorMessage>{formErrors.name}</ErrorMessage>
                      )} */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="banner-name">
                      상품명
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className="inp_box">
                      <SelectTag
                        name={"category"}
                        id={"category"}
                        // onChange={onCategoryHandler}
                        options={[
                          { label: "상품 선택", value: "" },
                          { label: "상품1", value: "product1" },
                          { label: "상품2", value: "product2" },
                          { label: "상품3", value: "product3" },
                        ]}
                      />
                      {/* {formErrors.name && (
                        <ErrorMessage>{formErrors.name}</ErrorMessage>
                      )} */}
                      {isCategorySubscribe && (
                        <label
                          htmlFor="subscribe-count"
                          className={s["subscribe-count"]}
                        >
                          <input type="number" id="subscribe-count" />
                          <i>회차</i>
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="cont_divider">
                <div className="input_row">
                  <div className="title_section fixedHeight">
                    <label className="title" htmlFor="banner-name">
                      주문일자
                    </label>
                  </div>
                  <div className="inp_section">
                    <div className={`${s.inp_box} ${s.date} inp_box`}>
                      <input type="date" />
                      {/* {formErrors.name && (
                        <ErrorMessage>{formErrors.name}</ErrorMessage>
                      )} */}
                    </div>
                  </div>
                </div>
              </div>
              <section className={s.how_was}>
                <div className={s.text}>상품은 어떠셨나요?</div>
                <div>
                  <RatingStars count={4} margin={12} size={25} />
                </div>
              </section>

              <seciton className={s.line}>
                <hr />
              </seciton>

              <section className={s.body}>
                <div className={s.flex}>
                  <div className={s.left_side}>
                    <div className={s.text2}>상세리뷰</div>
                  </div>
                  <div className={s.right_side}>
                    <textarea placeholder="50자 이상 작성시 300원이 적립됩니다.&#13;상품에 대한 견주님의 의견을 남겨주시면 큰 힘이 됩니다."></textarea>
                    <span className={s["textLength-indicator"]}>0/1000</span>
                  </div>
                </div>
              </section>

              <section className={s.picture_attach}>
                <div className={s.flex}>
                  <div className={s.left_side}>
                    <div className={s.text2}>사진첨부</div>

                    <div className={s.outer}>
                      <div className={s.red_text}>500원 추가적립!</div>
                    </div>
                  </div>

                  <div className={s.right_side}>
                    <div className={s.square}>
                      <div className={s.cross}></div>
                    </div>
                    <div className={s.text_color_sub}>
                      20MB 이하. JPG, PNG, GIF 파일 10장 이내
                    </div>
                  </div>
                </div>
              </section>

              <seciton className={s.line2}>
                <hr />
              </seciton>
              <section className={s.btn}>
                <div className={s.flex}>
                  <div className={s.left_btn}>취소</div>
                  <div className={s.right_btn}>등록</div>
                </div>
              </section>
            </div>
          </form>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export default CreateRewardPage;
