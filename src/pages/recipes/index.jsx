import React, { useState } from "react";

import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import Modal_recipes from "@src/components/modal/Modal_recipes";






import styled from "styled-components";


const TEST_ModalTrigger = styled.button`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-radius: 100px;
  border: 1px solid var(--color-line-03);
  color: var(--color-font-sub);
  font-size: 15px;
  padding: 5px 26px;
  font-weight: 500;
`;







// * INNER CONTENT IN MODAL * //
const Modal_cont_point_01 = () => {
  return (
    <div data-modal-type="starter premium">
      <p>첫생식에 완벽한 레시피1</p>
    </div>
  );
};
const Modal_cont_point_02 = () => {
  return (
    <div data-modal-type="starter premium">
      <p>첫생식에 완벽한 레시피2</p>
    </div>
  );
};
const Modal_cont_point_03 = () => {
  return (
    <div data-modal-type="starter premium">
      <p>첫생식에 완벽한 레시피3</p>
    </div>
  );
};
const Modal_cont_point_04 = () => {
  return (
    <div data-modal-type="starter premium">
      <p>첫생식에 완벽한 레시피4</p>
    </div>
  );
};

// * INNER CONTENT IN MODAL * //

const Modal_cont_ingredient_01 = () => {
  return (
    <div data-modal-type="starter premium">
      <p>영양성분1</p>
    </div>
  );
};
const Modal_cont_ingredient_02 = () => {
  return (
    <div data-modal-type="starter premium">
      <p>영양성분2</p>
    </div>
  );
};
const Modal_cont_ingredient_03 = () => {
  return (
    <div data-modal-type="starter premium">
      <p>영양성분3</p>
    </div>
  );
};
const Modal_cont_ingredient_04 = () => {
  return (
    <div data-modal-type="starter premium">
      <p>영양성분4</p>
    </div>
  );
};



const Modal_cont_ingredient_main_01 = () => {
  return (
    <div data-modal-type="starter premium">
      <p>주성분1</p>
    </div>
  );
};
const Modal_cont_ingredient_main_02 = () => {
  return (
    <div data-modal-type="starter premium">
      <p>주성분2</p>
    </div>
  );
};
const Modal_cont_ingredient_main_03 = () => {
  return (
    <div data-modal-type="starter premium">
      <p>주성분3</p>
    </div>
  );
};
const Modal_cont_ingredient_main_04 = () => {
  return (
    <div data-modal-type="starter premium">
      <p>주성분4</p>
    </div>
  );
};






const Modal_cont_ingredient_total_01 = () => {
  return (
    <div data-modal-type="starter premium">
      <p>__전__성분1</p>
    </div>
  );
};
const Modal_cont_ingredient_total_02 = () => {
  return (
    <div data-modal-type="starter premium">
      <p>__전__성분2</p>
    </div>
  );
};
const Modal_cont_ingredient_total_03 = () => {
  return (
    <div data-modal-type="starter premium">
      <p>__전__성분3</p>
    </div>
  );
};
const Modal_cont_ingredient_total_04 = () => {
  return (
    <div data-modal-type="starter premium">
      <p>__전__성분4</p>
    </div>
  );
};






const DATA_toBeSentModal = {
  title_ko: ["STARTER PREMIUM", "TURKEY&BEEF", "DUCK&LAMB", "LAMB&BEEF"],
  title_en: ["스타터프리미엄", "터키앤비프", "덕앤램", "램앤비프"],
  imagelink: [
    // * require(): component 내부에서 data를 전달받을 경우 랜더링 오류 발생(Runtime Error)
    require("/public/img/pages/review/review_slide_1.png"),
    require("/public/img/pages/review/review_slide_2.png"),
    require("/public/img/pages/review/review_slide_3.png"),
    require("/public/img/pages/review/review_slide_2.png"),
  ],
  component: {
    tab1: [
      <Modal_cont_point_01 key="modal" />,
      <Modal_cont_ingredient_01 key="modal" />,
      <Modal_cont_ingredient_main_01 key="modal" />,
      <Modal_cont_ingredient_total_01 key="modal" />,
    ],
    tab2: [
      <Modal_cont_point_02 key="modal" />,
      <Modal_cont_ingredient_02 key="modal" />,
      <Modal_cont_ingredient_main_02 key="modal" />,
      <Modal_cont_ingredient_total_02 key="modal" />,
    ],
    tab3: [
      <Modal_cont_point_03 key="modal" />,
      <Modal_cont_ingredient_03 key="modal" />,
      <Modal_cont_ingredient_main_03 key="modal" />,
      <Modal_cont_ingredient_total_03 key="modal" />,
    ],
    tab4: [
      <Modal_cont_point_04 key="modal" />,
      <Modal_cont_ingredient_04 key="modal" />,
      <Modal_cont_ingredient_main_04 key="modal" />,
      <Modal_cont_ingredient_total_04 key="modal" />,
    ],
  },
};







export default function RecipePage() {
  const [isActiveModal, setIsActiveModal] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState();

  const onShowModal = (e) => {
    const idx = Number(e.currentTarget.dataset.selectedIdx);
    setSelectedIndex(idx);
    setIsActiveModal(true);
  };

  const onHideModal = () => {
    setIsActiveModal(false);
  };

  return (
    <>
      <MetaTitle title="레시피" />
      <Layout>
        <Wrapper>
          <div className="recipes-container">
            <ul>
              <li style={{ margin: "30px 0" }}>
                <TEST_ModalTrigger onClick={onShowModal} data-selected-idx={0}>
                  스타터 프리미엄 더보기
                </TEST_ModalTrigger>
              </li>
              <li style={{ margin: "30px 0" }}>
                <TEST_ModalTrigger onClick={onShowModal} data-selected-idx={1}>
                  터키앤 비프 더보기
                </TEST_ModalTrigger>
              </li>
              <li style={{ margin: "30px 0" }}>
                <TEST_ModalTrigger onClick={onShowModal} data-selected-idx={2}>
                  덕앤램 더보기
                </TEST_ModalTrigger>
              </li>
              <li style={{ margin: "30px 0" }}>
                <TEST_ModalTrigger onClick={onShowModal} data-selected-idx={3}>
                  램앤비프 더보기
                </TEST_ModalTrigger>
              </li>
            </ul>
          </div>
        </Wrapper>
      </Layout>
      {isActiveModal && (
        <Modal_recipes
          onHideModal={onHideModal}
          isActiveModal={isActiveModal}
          data={DATA_toBeSentModal}
          selectedIndex={selectedIndex}
        />
      )}
    </>
  );
}
