import React, { useState } from "react";

import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import MetaTitle from "/src/components/atoms/MetaTitle";
import Modal_recipes from "@src/components/modal/Modal_recipes";
import s from './recipes.module.scss';
import Image from 'next/image';
import styled from "styled-components";
import Link from "next/link";


const Button_ModalTrigger = styled.button`
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
    <div data-modal-type="starterPremium">


      <div className={s.modal_text_box}>
        <div className={s.modal_recipe_text}>
          <div className={s.image_box}>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/recipes/recipe_check.png")}
                objectFit="cover"
                layout="fill"
                alt="브랜드 소개 이미지"
              />
            </div>
          </div>
          <p>첫 생식에 완벽한 레시피</p>
        </div>
        <div className={s.modal_content_text}>
          생식이 처음인 아이들이 편하게 적응 할 수 있도록 도와줍니다
        </div>
      </div>

      <div className={s.modal_text_box}>
        <div className={s.modal_recipe_text}>
          <div className={s.image_box}>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/recipes/recipe_check.png")}
                objectFit="cover"
                layout="fill"
                alt="브랜드 소개 이미지"
              />
            </div>
          </div>
          <p>생식의 시작</p>
        </div>
        <div className={s.modal_content_text}>
          전 세계 생식 레시피에서 첫 생식으로 권장하는 흰살코기 닭고기와 칠면조를 담았습니다
        </div>
      </div>

      <div className={s.modal_text_box}>
        <div className={s.modal_recipe_text}>
          <div className={s.image_box}>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/recipes/recipe_check.png")}
                objectFit="cover"
                layout="fill"
                alt="브랜드 소개 이미지"
              />
            </div>
          </div>
          <p>높은 흡수율과 소화</p>
        </div>
        <div className={s.modal_content_text}>
          부드러운 생고기와 우수한 흡수력을 집중하여 설계된 레시피 입니다
        </div>
      </div>
 
   
    </div>
  );
};
const Modal_cont_point_02 = () => {
  return (
    <div data-modal-type="turkeyAndBeef">

      <div className={s.modal_text_box}>
        <div className={s.modal_recipe_text}>
          <div className={s.image_box}>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/recipes/recipe_check.png")}
                objectFit="cover"
                layout="fill"
                alt="브랜드 소개 이미지"
              />
            </div>
          </div>
          <p>양질의 단백질, 풍부한 아미노산</p>
        </div>
        <div className={s.modal_content_text}>
          성장 단계의 자견의 발육과 성견의 영양 보충에 도움을 줍니다
        </div>
      </div>

      <div className={s.modal_text_box}>
        <div className={s.modal_recipe_text}>
          <div className={s.image_box}>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/recipes/recipe_check.png")}
                objectFit="cover"
                layout="fill"
                alt="브랜드 소개 이미지"
              />
            </div>
          </div>
          <p>면역체계에 좋은 셀레늄</p>
        </div>
        <div className={s.modal_content_text}>
          노화 방지, 혈액순환 촉진, 항암력을 증진 시켜 면역 체계에 도움을 줍니다
        </div>
      </div>

      <div className={s.modal_text_box}>
        <div className={s.modal_recipe_text}>
          <div className={s.image_box}>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/recipes/recipe_check.png")}
                objectFit="cover"
                layout="fill"
                alt="브랜드 소개 이미지"
              />
            </div>
          </div>
          <p>무가공된 육즙과 자연의 맛</p>
        </div>
        <div className={s.modal_content_text}>
        가공을 거치지 않은 자연 그대로의 풍부한 육즙과 맛은 입맛이 까다로운 친구들에게도 즐거운 식사로 기억될 것입니다
        </div>
      </div>




    </div>
  );
};
const Modal_cont_point_03 = () => {
  return (
    <div data-modal-type="duckAndLamb">
      
      <div className={s.modal_text_box}>
        <div className={s.modal_recipe_text}>
          <div className={s.image_box}>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/recipes/recipe_check.png")}
                objectFit="cover"
                layout="fill"
                alt="브랜드 소개 이미지"
              />
            </div>
          </div>
          <p>피로회복 영양식</p>
        </div>
        <div className={s.modal_content_text}>
          단백질과 필수 아미노산이 풍부하여 피로회복에 좋은 기력 회복 레시피
        </div>
      </div>

      <div className={s.modal_text_box}>
        <div className={s.modal_recipe_text}>
          <div className={s.image_box}>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/recipes/recipe_check.png")}
                objectFit="cover"
                layout="fill"
                alt="브랜드 소개 이미지"
              />
            </div>
          </div>
          <p>관절 강화에 필수인 강황가루</p>
        </div>
        <div className={s.modal_content_text}>
          높은 흡수율로 관절 강화를 돕습니다
        </div>
      </div>

      <div className={s.modal_text_box}>
        <div className={s.modal_recipe_text}>
          <div className={s.image_box}>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/recipes/recipe_check.png")}
                objectFit="cover"
                layout="fill"
                alt="브랜드 소개 이미지"
              />
            </div>
          </div>
          <p>면역체계에 필수인 아연과 셀레늄</p>
        </div>
        <div className={s.modal_content_text}>
          강력한 항산화력으로 신체 조직의 노화 방지를 도와줍니다<br />
          항산화 작용은 해독 작용과 면역 기능을 증진시키고 염증 등을 예방시켜줍니다
        </div>
      </div>



    </div>
  );
};
const Modal_cont_point_04 = () => {
  return (
    <div data-modal-type="lambAndBeef">
      
      <div className={s.modal_text_box}>
        <div className={s.modal_recipe_text}>
          <div className={s.image_box}>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/recipes/recipe_check.png")}
                objectFit="cover"
                layout="fill"
                alt="브랜드 소개 이미지"
              />
            </div>
          </div>
          <p>독성해소에 좋은 양고기</p>
        </div>
        <div className={s.modal_content_text}>
          양고기를 기반으로 설계되어 독성해소, 살균, 이뇨, 피부미용에 효과적으로 반려견의 피부와 모질을 개선하는데 도움을 줍니다
        </div>
      </div>

      <div className={s.modal_text_box}>
        <div className={s.modal_recipe_text}>
          <div className={s.image_box}>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/recipes/recipe_check.png")}
                objectFit="cover"
                layout="fill"
                alt="브랜드 소개 이미지"
              />
            </div>
          </div>
          <p>비타민, 칼슘, 인, 철 풍부</p>
        </div>
        <div className={s.modal_content_text}>
          광물질이 풍부하면서 수분함량과 소화력이 높아 양질의 단백질을 올바르게 흡수할 수 있습니다
        </div>
      </div>

      <div className={s.modal_text_box}>
        <div className={s.modal_recipe_text}>
          <div className={s.image_box}>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require("public/img/recipes/recipe_check.png")}
                objectFit="cover"
                layout="fill"
                alt="브랜드 소개 이미지"
              />
            </div>
          </div>
          <p>저칼로리, 고단백, 고칼슘</p>
        </div>
        <div className={s.modal_content_text}>
          풍부하고 질 좋은 단백질과 칼슘은 높이고 지방과 열량은 낮춰 적절한 체중관리를 위한 프리미엄 식이요법 레시피
        </div>
      </div>  


    </div>
  );
};




// * INNER CONTENT IN MODAL * //

const Modal_cont_ingredient_01 = () => {
  return (
    <div data-modal-type="starterPremium">
      <div className={s.modal_text_box2}>
        <div className={s.title}>
          등록 성분량 (200g기준)
        </div>

        
        <div className={s.grid_box}>
          <div className={s.left_side}>
            <div className={s.left_title}>
              Nutrients Facts
            </div>

            <div className={s.flex_box}>
              <div className={s.first_text}>
                수분
              </div>
              <div className={s.last_text}>
                76% 이하
              </div>
            </div>

            <div className={s.flex_box}>
              <div className={s.first_text}>
                조단백질
              </div>


              <div className={s.last_text}>
                16% 이상
              </div>
            </div>

            <div className={s.flex_box}>
              <div className={s.first_text}>
                조지방
              </div>
              <div className={s.last_text}>
                4% 이상
              </div>
            </div>

            <div className={s.flex_box}>
              <div className={s.first_text}>
                조섬유
              </div>
              <div className={s.last_text}>
                0.3% 이하
              </div>
            </div>


            <div className={s.flex_box}>
              <div className={s.first_text}>
                조회분
              </div>
              <div className={s.last_text}>
                2% 이하
              </div>
            </div>


            <div className={s.flex_box}>
              <div className={s.first_text}>
                칼슘
              </div>
              <div className={s.last_text}>
                0.24% 이상
              </div>
            </div>


          <div className={s.flex_box}>
              <div className={s.first_text}>
                인
              </div>
              <div className={s.last_text}>
                0.19% 이상
              </div>
            </div>
          </div>

          <div className={s.right_side}>
            <div className={s.right_title}>
              Dry Matter 
            </div>

            <div className={s.flex_box}>
              <div className={s.last_text}>
                76.45
              </div>
            </div>

            <div className={s.flex_box}>
              <div className={s.last_text}>
                19.11
              </div>
            </div>
            <div className={s.flex_box}>
              <div className={s.last_text}>
                1.43
              </div>
            </div>

            <div className={s.flex_box}>
              <div className={s.last_text}>
                8.80
              </div>
            </div>
            <div className={s.flex_box}>
              <div className={s.last_text}>
                1.15
              </div>
            </div>

            <div className={s.flex_box}>
              <div className={s.last_text}>
                0.91
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
const Modal_cont_ingredient_02 = () => {
  return (
    <div data-modal-type="turkeyAndBeef">
      
      <div className={s.modal_text_box2}>
        <div className={s.title}>
          등록 성분량 (200g기준)
        </div>

        
        <div className={s.grid_box}>
          <div className={s.left_side}>
            <div className={s.left_title}>
              Nutrients Facts
            </div>

            <div className={s.flex_box}>
              <div className={s.first_text}>
                수분
              </div>
              <div className={s.last_text}>
                76% 이하
              </div>
            </div>

            <div className={s.flex_box}>
              <div className={s.first_text}>
                조단백질
              </div>


              <div className={s.last_text}>
                15.7% 이상
              </div>
            </div>

            <div className={s.flex_box}>
              <div className={s.first_text}>
                조지방
              </div>
              <div className={s.last_text}>
                5.0% 이상
              </div>
            </div>

            <div className={s.flex_box}>
              <div className={s.first_text}>
                조섬유
              </div>
              <div className={s.last_text}>
                0.7% 이하
              </div>
            </div>


            <div className={s.flex_box}>
              <div className={s.first_text}>
                조회분
              </div>
              <div className={s.last_text}>
                2.2% 이하
              </div>
            </div>


            <div className={s.flex_box}>
              <div className={s.first_text}>
                칼슘
              </div>
              <div className={s.last_text}>
                0.33% 이상
              </div>
            </div>


          <div className={s.flex_box}>
              <div className={s.first_text}>
                인
              </div>
              <div className={s.last_text}>
                0.26% 이상
              </div>
            </div>
          </div>

          <div className={s.right_side}>
            <div className={s.right_title}>
              Dry Matter 
            </div>

            <div className={s.flex_box}>
              <div className={s.last_text}>
                64.90
              </div>
            </div>

            <div className={s.flex_box}>
              <div className={s.last_text}>
                20.67
              </div>
            </div>
            <div className={s.flex_box}>
              <div className={s.last_text}>
                2.89
              </div>
            </div>

            <div className={s.flex_box}>
              <div className={s.last_text}>
                9.09
              </div>
            </div>
            <div className={s.flex_box}>
              <div className={s.last_text}>
                1.36
              </div>
            </div>

            <div className={s.flex_box}>
              <div className={s.last_text}>
                1.07
              </div>
            </div>
          </div>
        </div>


      </div>

    </div>
  );
};
const Modal_cont_ingredient_03 = () => {
  return (
    <div data-modal-type="duckAndLamb">
      
      <div className={s.modal_text_box2}>
        <div className={s.title}>
          등록 성분량 (200g기준)
        </div>

        
        <div className={s.grid_box}>
          <div className={s.left_side}>
            <div className={s.left_title}>
              Nutrients Facts
            </div>

            <div className={s.flex_box}>
              <div className={s.first_text}>
                수분
              </div>
              <div className={s.last_text}>
                77% 이하
              </div>
            </div>

            <div className={s.flex_box}>
              <div className={s.first_text}>
                조단백질
              </div>


              <div className={s.last_text}>
                14% 이상
              </div>
            </div>

            <div className={s.flex_box}>
              <div className={s.first_text}>
                조지방
              </div>
              <div className={s.last_text}>
                3.5% 이상
              </div>
            </div>

            <div className={s.flex_box}>
              <div className={s.first_text}>
                조섬유
              </div>
              <div className={s.last_text}>
                0.26% 이하
              </div>
            </div>


            <div className={s.flex_box}>
              <div className={s.first_text}>
                조회분
              </div>
              <div className={s.last_text}>
                3% 이하
              </div>
            </div>


            <div className={s.flex_box}>
              <div className={s.first_text}>
                칼슘
              </div>
              <div className={s.last_text}>
                0.30% 이상
              </div>
            </div>


          <div className={s.flex_box}>
              <div className={s.first_text}>
                인
              </div>
              <div className={s.last_text}>
                0.24% 이상
              </div>
            </div>
          </div>

          <div className={s.right_side}>
            <div className={s.right_title}>
              Dry Matter 
            </div>

            <div className={s.flex_box}>
              <div className={s.last_text}>
                65.73
              </div>
            </div>

            <div className={s.flex_box}>
              <div className={s.last_text}>
                16.43
              </div>
            </div>
            <div className={s.flex_box}>
              <div className={s.last_text}>
                1.22
              </div>
            </div>

            <div className={s.flex_box}>
              <div className={s.last_text}>
                14.08
              </div>
            </div>
            <div className={s.flex_box}>
              <div className={s.last_text}>
                1.41
              </div>
            </div>

            <div className={s.flex_box}>
              <div className={s.last_text}>
                1.13
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};
const Modal_cont_ingredient_04 = () => {
  return (
    <div data-modal-type="lambAndBeef">


<div className={s.modal_text_box2}>
        <div className={s.title}>
          등록 성분량 (200g기준)
        </div>

        
        <div className={s.grid_box}>
          <div className={s.left_side}>
            <div className={s.left_title2}>
              Nutrients Facts
            </div>

            <div className={s.flex_box}>
              <div className={s.first_text}>
                수분
              </div>
              <div className={s.last_text}>
                70% 이하
              </div>
            </div>

            <div className={s.flex_box}>
              <div className={s.first_text}>
                조단백질
              </div>


              <div className={s.last_text}>
                15.7% 이상
              </div>
            </div>

            <div className={s.flex_box}>
              <div className={s.first_text}>
                조지방
              </div>
              <div className={s.last_text}>
                8.5% 이상
              </div>
            </div>

            <div className={s.flex_box}>
              <div className={s.first_text}>
                조섬유
              </div>
              <div className={s.last_text}>
                0.7% 이하
              </div>
            </div>


            <div className={s.flex_box}>
              <div className={s.first_text}>
                조회분
              </div>
              <div className={s.last_text}>
                2.6% 이하
              </div>
            </div>


            <div className={s.flex_box}>
              <div className={s.first_text}>
                칼슘
              </div>
              <div className={s.last_text}>
                0.32% 이상
              </div>
            </div>


          <div className={s.flex_box}>
              <div className={s.first_text}>
                인
              </div>
              <div className={s.last_text}>
                0.26% 이상
              </div>
            </div>
          </div>

          <div className={s.right_side}>
            <div className={s.right_title2}>
              Dry Matter 
            </div>

            <div className={s.flex_box}>
              <div className={s.last_text}>
                55.91
              </div>
            </div>

            <div className={s.flex_box}>
              <div className={s.last_text}>
                30.27
              </div>
            </div>
            <div className={s.flex_box}>
              <div className={s.last_text}>
                2.49
              </div>
            </div>

            <div className={s.flex_box}>
              <div className={s.last_text}>
                9.26
              </div>
            </div>
            <div className={s.flex_box}>
              <div className={s.last_text}>
                1.14
              </div>
            </div>

            <div className={s.flex_box}>
              <div className={s.last_text}>
                0.93
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};



const Modal_cont_ingredient_main_01 = () => {
  return (
    <div data-modal-type="starterPremium">
      <div className={s.modal_image_box3}>
        <div className={s.image_box}>
          <div className={`${s.image} img-wrap`}>
            <Image
              priority
              src={require("public/img/recipes/chicken.png")}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>닭 순살</p>
        </div>
       

        <div className={s.image_box}>
          <div className={`${s.image} img-wrap`}>
            <Image
              priority
              src={require("public/img/recipes/turkey.png")}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>칠면조 순살</p>
        </div>

        <div className={s.image_box}>
          <div className={`${s.image2} img-wrap`}>
            <Image
              priority
              src={require("public/img/recipes/cauliflower.png")}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>콜리플라워</p>
        </div>

        <div className={s.image_box}>
          <div className={`${s.image2} img-wrap`}>
            <Image
              priority
              src={require("public/img/recipes/mushroom.png")}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>표고버섯</p>
        </div>

        <div className={s.image_box}>
          <div className={`${s.image2} img-wrap`}>
            <Image
              priority
              src={require("public/img/recipes/blueberries.png")}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>블루베리</p>
        </div>
      </div>

    </div>
  );
};
const Modal_cont_ingredient_main_02 = () => {
  return (
    <div data-modal-type="turkeyAndBeef">
      <div className={s.modal_image_box3}>
        <div className={s.image_box}>
          <div className={`${s.image} img-wrap`}>
            <Image
              priority
              src={require("public/img/recipes/turkey.png")}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>칠면조</p>
        </div>

        <div className={s.image_box}>
          <div className={`${s.image} img-wrap`}>
            <Image
              priority
              src={require("public/img/recipes/cow.png")}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>소</p>
        </div>

        <div className={s.image_box}>
          <div className={`${s.image2} img-wrap`}>
            <Image
              priority
              src={require("public/img/recipes/apple.png")}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>사과</p>
        </div>

        <div className={s.image_box}>
          <div className={`${s.image2} img-wrap`}>
            <Image
              priority
              src={require("public/img/recipes/chiaseed.png")}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>치아씨드</p>
        </div>



        <div className={s.image_box}>
          <div className={`${s.image2} img-wrap`}>
            <Image
              priority
              src={require("public/img/recipes/pumpkin.png")}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>호박씨</p>
        </div>
      </div>

    </div>
     
  );
};
const Modal_cont_ingredient_main_03 = () => {
  return (
    <div data-modal-type="duckAndLamb">
      
      <div className={s.modal_image_box3}>
        <div className={s.image_box}>
          <div className={`${s.image} img-wrap`}>
            <Image
              priority
              src={require("public/img/recipes/sheep.png")}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>양</p>
        </div>

        <div className={s.image_box}>
          <div className={`${s.image} img-wrap`}>
            <Image
              priority
              src={require("public/img/recipes/duck.png")}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>오리</p>
        </div>

        <div className={s.image_box}>
          <div className={`${s.image2} img-wrap`}>
            <Image
              priority
              src={require("public/img/recipes/kelp.png")}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>켈프</p>
        </div>

        <div className={s.image_box}>
          <div className={`${s.image2} img-wrap`}>
            <Image
              priority
              src={require("public/img/recipes/coconutoil.png")}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>코코넛오일</p>
        </div>



        <div className={s.image_box}>
          <div className={`${s.image2} img-wrap`}>
            <Image
              priority
              src={require("public/img/recipes/curcuma.png")}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>강황</p>
        </div>
      </div>

    </div>
  );
};
const Modal_cont_ingredient_main_04 = () => {
  return (
    <div data-modal-type="lambAndBeef">
      <div className={s.modal_image_box3}>
        <div className={s.image_box}>
          <div className={`${s.image} img-wrap`}>
            <Image
              priority
              src={require("public/img/recipes/sheep.png")}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>양</p>
        </div>

        <div className={s.image_box}>
          <div className={`${s.image} img-wrap`}>
            <Image
              priority
              src={require("public/img/recipes/cow.png")}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>소</p>
        </div>

        <div className={s.image_box}>
          <div className={`${s.image2} img-wrap`}>
            <Image
              priority
              src={require("public/img/recipes/blueberries.png")}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>블루베리</p>
        </div>

        <div className={s.image_box}>
          <div className={`${s.image2} img-wrap`}>
            <Image
              priority
              src={require("public/img/recipes/kale.png")}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>케일</p>
        </div>



        <div className={s.image_box}>
          <div className={`${s.image2} img-wrap`}>
            <Image
              priority
              src={require("public/img/recipes/hempseed.png")}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>햄프씨드</p>
        </div>
      </div>
    </div>
  );
};






const Modal_cont_ingredient_total_01 = () => {
  return (
    <div data-modal-type="starterPremium">
     
     <div className={s.modal_text_box4}>
        <p className={s.text_row_1}>
          닭가슴살(국내산 무항생제), 닭다리살(국내산 무항생제), 칠면조가슴살(칠레산), 통닭(국내산 무항생제),닭간(국내산), 
          소지라(국내산), 소신장(국내산), 당근(유기농 국내산), 양배추(유기농 국내산), 콜리플라워(국내산),
          애호박(국내산), 표고버섯(국내산), 블루베리(미국산)
        </p>

        <div className={s.text_row_2}>
          * 원재료 수급 사정에 따라 원산지가 일부 변동될 수 있으나 고품질의 재료로 대체하여 사용됩니다<br />
        </div>
        <div className={s.text_row_2_1}>
        * GMO 및 중국산 원료 등은 절대 사용하지 않습니다
        </div>

        <div className={s.text_row_3}>
          <div className={s.inner_text_row_1}>
            * 오메가-3는 추가 급여해 주세요
          </div>
          <div className={s.inner_text_row_2}>
            오메가-3는 공기 접촉 시 산폐가 시작되어 레시피에 포함하지 않으니 추가 급여를 권장합니다
          </div>
        </div>
      </div>

    </div>
  );
};
const Modal_cont_ingredient_total_02 = () => {
  return (
    <div data-modal-type="turkeyAndBeef">
      <div className={s.modal_text_box4}>
        <p className={s.text_row_1}>
          칠면조가슴살(칠레산), 칠면조다리살(칠레산), 소보섭살(풀먹은 호주산 방목 유기농), 
          소사태살(풀먹은 호주산 방목 유기농), 칠면조목뼈(칠레산), 소간(국내산), 소비장(국내산), 
          소신장(국내산), 당근(유기농 국내산), 양배추(유기농 국내산), 콜리플라워(국내산), 파프리카(국내산), 
          애호박(국내산), 케일(국내산), 사과(국내산 충주), 표고버섯(국내산), 브로콜리(유기농 국내산), 
          블루베리(미국산), 단호박(유기농 국내산), 커티지치즈(국내산),저염멸치(국내산), 대구간유(노르웨이산), 
          햄프씨드(USDA 유기농인증 미국산), 치아씨드(USDA 유기농인증 미국산), 호박씨(USDA 유기농인증 미국산), 
          해바라기씨유(NON-GMO 유기농 이탈리아산), 켈프(USDA 유기농인증 미국산), 스피루리나(USDA 유기농인증 
          미국산), 코코넛오일(USDA 유기농인증 미국산)
        </p>
      </div>
    </div>
  );
};
const Modal_cont_ingredient_total_03 = () => {
  return (
    <div data-modal-type="duckAndLamb">

      <div className={s.modal_text_box4}>
        <p className={s.text_row_1}>
          양어깨살(뉴질랜드 방목 유기농 LAMB), 오리가슴살(국내산 무항생제),
          오리근위(국내산 무항생제), 통오리(국내산 무항생제), 닭간(국내산), 소비장(국내산), 소신장(국내산), 
          당근(유기농 국내산), 양배추(유기농 국내산), 콜리플라워(국내산), 파프리카(국내산), 애호박(국내산), 
          케일(국내산), 사과(충주 국내산), 표고버섯(국내산), 브로콜리(유기농 국내산), 블루베리(미국산), 
          단호박(유기농 국내산), 강황(USDA 유기농 인증 미국산), 코코넛오일(USDA 유기농 인증 미국산), 
          후추(USDA 유기농 인증 미국산), 저염멸치(국내산), 대구간유(노르웨이산), 치아씨드(USDA 유기농 인증 미국산), 
          호박씨(USDA 유기농 인증 미국산), 켈프(USDA 유기농 인증 미국산), 스피루리나(USDA 유기농 인증 미국산)
        </p>

        <div className={s.text_row_2}>
          * 원재료 수급 사정에 따라 원산지가 일부 변동될 수 있으나 고품질의 재료로 대체하여 사용됩니다
        </div>
      </div>

    </div>
  );
};
const Modal_cont_ingredient_total_04 = () => {
  return (
    <div data-modal-type="lambAndBeef">
      
      <div className={s.modal_text_box4}>
        <p className={s.text_row_1}>
          양어깨살(뉴질랜드 방목 유기농 LAMB), 오리가슴살(국내산 무항생제),
          오리근위(국내산 무항생제), 통오리(국내산 무항생제), 닭간(국내산), 소비장(국내산), 소신장(국내산), 
          당근(유기농 국내산), 양배추(유기농 국내산), 콜리플라워(국내산), 파프리카(국내산), 애호박(국내산), 
          케일(국내산), 사과(충주 국내산), 표고버섯(국내산), 브로콜리(유기농 국내산), 블루베리(미국산), 
          단호박(유기농 국내산), 강황(USDA 유기농 인증 미국산), 코코넛오일(USDA 유기농 인증 미국산), 
          후추(USDA 유기농 인증 미국산), 저염멸치(국내산), 대구간유(노르웨이산), 치아씨드(USDA 유기농 인증 미국산), 
          호박씨(USDA 유기농 인증 미국산), 켈프(USDA 유기농 인증 미국산), 스피루리나(USDA 유기농 인증 미국산)
        </p>

        <div className={s.text_row_2}>
          * 원재료 수급 사정에 따라 원산지가 일부 변동될 수 있으나 고품질의 재료로 대체하여 사용됩니다
        </div>
      </div>

    </div>
  );
};






const DATA_toBeSentModal = {
  title_ko: ["STARTER PREMIUM", "TURKEY&BEEF", "DUCK&LAMB", "LAMB&BEEF"],
  title_en: ["스타터프리미엄", "터키앤비프", "덕앤램", "램앤비프"],
  imagelink: [
    // * require(): component 내부에서 data를 전달받을 경우 랜더링 오류 발생(Runtime Error)
    require("/public/img/recipes/starter.png"),
    require("/public/img/recipes/turkey_beef.png"),
    require("/public/img/recipes/duck_lamb.png"),
    require("/public/img/recipes/turkey_beef.png"),
  ],
  component: {
    tab1: [
      <Modal_cont_point_01 key="modal" />,
      <Modal_cont_point_02 key="modal" />,
      <Modal_cont_point_03 key="modal" />,
      <Modal_cont_point_04 key="modal" />,
    ],
    tab2: [
      <Modal_cont_ingredient_01 key="modal" />,
      <Modal_cont_ingredient_02 key="modal" />,
      <Modal_cont_ingredient_03 key="modal" />,
      <Modal_cont_ingredient_04 key="modal" />,
    ],
    tab3: [
      <Modal_cont_ingredient_main_01 key="modal" />,
      <Modal_cont_ingredient_main_02 key="modal" />,
      <Modal_cont_ingredient_main_03 key="modal" />,
      <Modal_cont_ingredient_main_04 key="modal" />,
    ],
    tab4: [
      <Modal_cont_ingredient_total_01 key="modal" />,
      <Modal_cont_ingredient_total_02 key="modal" />,
      <Modal_cont_ingredient_total_03 key="modal" />,
      <Modal_cont_ingredient_total_04 key="modal" />,
    ],
  },
};




export default function RecipePage() {
  const [isActiveModal, setIsActiveModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState();

  const onShowModal = (e) => {
    const idx = Number(e.currentTarget.dataset.selectedIdx);
    setSelectedIndex(idx);
    setIsActiveModal(true);
  };

  const onHideModal = () => {
    setIsActiveModal(false);
  };


  const onShowSurvey = () => {
    mcx.subscribe.onShow();
    mcx.event.setScrollY();
  };

  return (
    <>
      <MetaTitle title="레시피" />
      <Layout>
        <Wrapper>

          <section className={s.top}>
            <div className={s.top_title}>
              REAL BARF!
            </div>
            <div className={s.top_text}>
              진짜 생식, 바프독만의 차별화된
            </div>
            <div className={s.top_text2}>
              <span>더블 미트 레시피</span>를 소개합니다
            </div>

            <div className={s.btn}>
              브랜드 소개
            </div>
            <div className={s.image_box}>
              <div className={`${s.image} img-wrap`}>
                <Image
                  priority
                  src={require("public/img/recipes_top.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="브랜드 소개 이미지"
                />
              </div>
            </div>
          </section>

          <section className={s.recipe_introduce}>
            <div className={s.recipe_title}>
              BARFDOG’s <br />
              Premium Recipes
            </div>

            <div className={s.line}>
            <hr />
            </div>

            <div className={s.recipe_title2}>
              두 가지 고기를 사용한 바프독의 프리미엄 생식을 만나보세요
            </div>


            <div className={s.recipe_grid_box}>
              <div className={s.left_top}>

              {/* hover gif실행, scss: 182 opacity: 0; */}
                <div className={s.image_box}>
                  <div className={`${s.image} img-wrap`}>
                    {/* gif 이미지 */}
                    <Image
                      priority
                      src={require("public/img/recipes/recipe_left_top.gif")}
                      objectFit="cover"
                      layout="fill"
                      alt="브랜드 소개 이미지"
                    />
                    <div className={`${s.image} img-wrap`}>
                      {/* 기본 이미지 */}
                      <Image
                        priority
                        src={require("public/img/recipe_left_top.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="브랜드 소개 이미지"
                      />
                    </div>
                  </div>
                </div>

                <p>
                  STARTER <br />PREMIUM
                </p>

                <div className={s.recipe_text}>
                  스타터 프리미엄
                </div>

                <Button_ModalTrigger onClick={onShowModal} data-selected-idx={0}>
                  스타터 프리미엄 더보기
                </Button_ModalTrigger>
              </div>


              <div className={s.right_top}>

                <div className={s.image_box}>
                  <div className={`${s.image} img-wrap`}>
                    <Image
                      priority
                      src={require("public/img/recipes/recipe_right_top.gif")}
                      objectFit="cover"
                      layout="fill"
                      alt="브랜드 소개 이미지"
                    />
                    <div className={`${s.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/recipe_right_top.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="브랜드 소개 이미지"
                      />
                    </div>
                  </div>
                </div>

                <p>
                  TURKEY &amp; <br />BEEF
                </p>

                <div className={s.recipe_text}>
                  터키앤비프  
                </div>

                <Button_ModalTrigger onClick={onShowModal} data-selected-idx={1}>
                  터키앤 비프 더보기
                </Button_ModalTrigger>
              </div>

              <div className={s.left_bot}>

                <div className={s.image_box}>
                  <div className={`${s.image} img-wrap`}>
                    <Image
                      priority
                      src={require("public/img/recipes/recipe_left_bot.gif")}
                      objectFit="cover"
                      layout="fill"
                      alt="브랜드 소개 이미지"
                    />
                    <div className={`${s.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/recipe_left_bot.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="브랜드 소개 이미지"
                      />
                    </div>
                  </div>
                </div>

                <p>
                  DUCK &amp; <br />LAMB
                </p>

                <div className={s.recipe_text}>
                  덕앤램
                </div>

                <Button_ModalTrigger onClick={onShowModal} data-selected-idx={2}>
                  덕앤램 더보기
                </Button_ModalTrigger>
              </div>

              <div className={s.right_bot}>

                <div className={s.image_box}>
                  <div className={`${s.image} img-wrap`}>
                    <Image
                      priority
                      src={require("public/img/recipes/recipe_right_bot.gif")}
                      objectFit="cover"
                      layout="fill"
                      alt="브랜드 소개 이미지"
                    />
                    <div className={`${s.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/recipe_right_bot.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="브랜드 소개 이미지"
                      />
                    </div>
                  </div>
                </div>

                <p>
                  LAMB &amp; <br />BEEF
                </p>

                <div className={s.recipe_text}>
                  램앤비프
                </div>

                <Button_ModalTrigger onClick={onShowModal} data-selected-idx={3}>
                  램앤비프 더보기
                </Button_ModalTrigger>
              </div>
            </div>

          </section>

          <section className={s.note}>
            <div className={s.recipe_title}>
              BARFDOG’s Note
            </div>

            <div className={s.line}>
            <hr />
            </div>

            <div className={s.recipe_title2}>
              진짜 펫푸드에 대한 바프독의 생각. 바프독이 생각하는 본질을 그대로 담았습니다.
            </div>


            <div className={s.note_content_box}>
              <div className={s.box_title}>
                반려견의 건강과 영양을 생각해 <br />좋은 식재료를 고집합니다
              </div>
              <div className={s.pic_box}>
               
                <div className={s.image_box}>
                  <div className={`${s.image} img-wrap`}>
                    <Image
                      priority
                      src={require("public/img/recipe_note_left.png")}
                      objectFit="cover"
                      layout="fill"
                      alt="브랜드 소개 이미지"
                    />
                  </div>
                </div>
                <div className={s.image_box}>
                  <div className={`${s.image} img-wrap`}>
                    <Image
                      priority
                      src={require("public/img/recipe_note_right.png")}
                      objectFit="cover"
                      layout="fill"
                      alt="브랜드 소개 이미지"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={s.note_content_box2}>
              <div className={s.box_title2}>
                100% 고품질의 식재료만 <br />사용한 프리미엄 생식
              </div>
              
              <div className={s.pic_box2}>

                <div className={s.text_box}>
                  <div className={s.image_box}>
                    <div className={`${s.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/recipe_content_1.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="브랜드 소개 이미지"
                      />
                    </div>
                  </div>
                  100% HUMAN <br />GRADE
                </div>
               
                <div className={s.text_box}>
                  <div className={s.image_box}>
                    <div className={`${s.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/recipe_content_2.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="브랜드 소개 이미지"
                      />
                    </div>
                  </div>
                  무항생제<br />고기
                </div>

                <div className={s.text_box}>
                  <div className={s.image_box}>
                    <div className={`${s.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/recipe_content_3.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="브랜드 소개 이미지"
                      />
                    </div>
                  </div>
                  ORGANIC<br />VEGETABLE
                </div>

                <div className={s.text_box}>
                  <div className={s.image_box}>
                    <div className={`${s.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/recipe_content_4.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="브랜드 소개 이미지"
                      />
                    </div>
                  </div>
                  GLUTEN<br />FREE
                </div>

                <div className={s.text_box}>
                  <div className={s.image_box}>
                    <div className={`${s.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/recipe_content_5.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="브랜드 소개 이미지"
                      />
                    </div>
                  </div>
                  GRAIN<br />FREE
                </div>

                <div className={s.text_box}>
                  <div className={s.image_box}>
                    <div className={`${s.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/recipe_content_6.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="브랜드 소개 이미지"
                      />
                    </div>
                  </div>
                  NO<br />합성첨가물
                </div>
              </div>
            </div>


            <div className={s.btn_box}>
              <div className={s.image_box}>
                <div className={`${s.image} img-wrap`}>
                  <Link href={'/surveyGuide'} passHref>
                    <Image
                      priority
                      src={require("public/img/recipe_subscribe.png")}
                      objectFit="cover"
                      layout="fill"
                      alt="브랜드 소개 이미지"
                    />
                  </Link>
                </div>
              </div>
            </div>



          </section>


          <section className={s.ingredients}>
            <div className={s.recipe_title}>
              Our Ingredients
            </div>

            <div className={s.line}>
            <hr />
            </div>

            <div className={s.recipe_title2}>
              바프독은 사료가 아닌 음식을 만든다는 생각으로 제조합니다<br />
              반려견들의 식사 시간은 그저 배만 채우는 시간이 아닌, 즐거운 경험을 축적하는 시간이어야 한다고 생각합니다<br />
              그래서, 반려견에게 줄 수 있는 영양을 우선으로 생각해 사람이 먹을 수 있는 건강한 식재료들을 엄격히 선별하고 있습니다<br />              
            </div>

            <div className={s.image_box}>
              <div className={`${s.image} img-wrap`}>
                <Image
                  priority
                  src={require("public/img/recipe_ingredients.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="브랜드 소개 이미지"
                />
              </div>
            </div>
          </section>

          <section className={s.health_care}>
            <div className={s.health_grid_box}>
              <div className={s.left_side}>
                <div className={s.health_row_1}>
                  반려견들의 행복한 삶을 위해 <br />
                  신선하고 건강한 음식 외에도
                </div>

                <div className={s.health_row_2}>
                  다양한 헬스케어 정보를<br />
                  제공합니다
                </div>

                <div className={s.health_btn_box}>
                  <a href='https://blog.naver.com/barfdog'rel="noreferrer" target="_blank" className={s.health_btn}>
                    자세히 보기
                  </a>
                </div>

              </div>

              <div className={s.right_side}>
                <div className={s.image_box}>
                  <div className={`${s.image} img-wrap`}>
                    <Image
                      priority
                      src={require("public/img/recipe_health.png")}
                      objectFit="cover"
                      layout="fill"
                      alt="브랜드 소개 이미지"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={s.subscribe_discount}>
            <div className={s.sub_row_1}>
              BARFDOG 구독이 처음이신가요?
            </div>
            <div className={s.sub_row_2}>
              첫 구매 시 50% 할인 혜택을 <br />받을 수 있습니다!
            </div>

            <div className={s.image_box}>
              <div className={`${s.image} img-wrap`}>
                <Image
                  priority
                  src={require("public/img/recipe_subsctibe_coupon.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="브랜드 소개 이미지"
                />
              </div>
            </div>
            

          </section>


          {/* <div className="recipes-container">
            <ul>
              <li style={{ margin: "30px 0" }}>
               
              </li>
              <li style={{ margin: "30px 0" }}>
                
              </li>
              <li style={{ margin: "30px 0" }}>
               
              </li>
              <li style={{ margin: "30px 0" }}>
                
              </li>
            </ul>
          </div> */}
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
