import { Modal_cont_point_01 } from '/src/components/modal/recipes/Modal_cont_point_01';
import { Modal_cont_point_02 } from '/src/components/modal/recipes/Modal_cont_point_02';
import { Modal_cont_point_03 } from '/src/components/modal/recipes/Modal_cont_point_03';
import { Modal_cont_point_04 } from '/src/components/modal/recipes/Modal_cont_point_04';
import { Modal_cont_ingredient_01 } from '/src/components/modal/recipes/Modal_cont_ingredient_01';
import { Modal_cont_ingredient_02 } from '/src/components/modal/recipes/Modal_cont_ingredient_02';
import { Modal_cont_ingredient_03 } from '/src/components/modal/recipes/Modal_cont_ingredient_03';
import { Modal_cont_ingredient_04 } from '/src/components/modal/recipes/Modal_cont_ingredient_04';
import { Modal_cont_ingredient_main_01 } from '/src/components/modal/recipes/Modal_cont_ingredient_main_01';
import { Modal_cont_ingredient_main_02 } from '/src/components/modal/recipes/Modal_cont_ingredient_main_02';
import { Modal_cont_ingredient_main_03 } from '/src/components/modal/recipes/Modal_cont_ingredient_main_03';
import { Modal_cont_ingredient_main_04 } from '/src/components/modal/recipes/Modal_cont_ingredient_main_04';
import { Modal_cont_ingredient_total_01 } from '/src/components/modal/recipes/Modal_cont_ingredient_total_01';
import { Modal_cont_ingredient_total_02 } from '/src/components/modal/recipes/Modal_cont_ingredient_total_02';
import { Modal_cont_ingredient_total_03 } from '/src/components/modal/recipes/Modal_cont_ingredient_total_03';
import { Modal_cont_ingredient_total_04 } from '/src/components/modal/recipes/Modal_cont_ingredient_total_04';
import Btn_01 from '/public/img/recipes/recipe_subscribe.svg';
import Btn_02 from '/public/img/recipes/recipe_subsctibe_coupon.svg';
import Content_01 from '/public/img/recipes/recipe_content_1.svg';
import Content_02 from '/public/img/recipes/recipe_content_2.svg';
import Content_03 from '/public/img/recipes/recipe_content_3.svg';
import Content_04 from '/public/img/recipes/recipe_content_4.svg';
import Content_05 from '/public/img/recipes/recipe_content_5.svg';
import Content_06 from '/public/img/recipes/recipe_content_6.svg';
import { Modal_cont_point_05 } from '/src/components/modal/recipes/Modal_cont_point_05';
import { Modal_cont_point_06 } from '/src/components/modal/recipes/Modal_cont_point_06';
import { Modal_cont_point_08 } from '/src/components/modal/recipes/Modal_cont_point_08';
import { Modal_cont_point_07 } from '/src/components/modal/recipes/Modal_cont_point_07';
import { Modal_cont_point_09 } from '/src/components/modal/recipes/Modal_cont_point_09';
import { Modal_cont_ingredient_05 } from '/src/components/modal/recipes/Modal_cont_ingredient_05';
import { Modal_cont_ingredient_06 } from '/src/components/modal/recipes/Modal_cont_ingredient_06';
import { Modal_cont_ingredient_07 } from '/src/components/modal/recipes/Modal_cont_ingredient_07';
import { Modal_cont_ingredient_08 } from '/src/components/modal/recipes/Modal_cont_ingredient_08';
import { Modal_cont_ingredient_09 } from '/src/components/modal/recipes/Modal_cont_ingredient_09';
import { Modal_cont_ingredient_main_05 } from '/src/components/modal/recipes/Modal_cont_ingredient_main_05';
import { Modal_cont_ingredient_main_06 } from '/src/components/modal/recipes/Modal_cont_ingredient_main_06';
import { Modal_cont_ingredient_main_07 } from '/src/components/modal/recipes/Modal_cont_ingredient_main_07';
import { Modal_cont_ingredient_main_08 } from '/src/components/modal/recipes/Modal_cont_ingredient_main_08';
import { Modal_cont_ingredient_main_09 } from '/src/components/modal/recipes/Modal_cont_ingredient_main_09';
import { Modal_cont_ingredient_total_05 } from '/src/components/modal/recipes/Modal_cont_ingredient_total_05';
import { Modal_cont_ingredient_total_06 } from '/src/components/modal/recipes/Modal_cont_ingredient_total_06';
import { Modal_cont_ingredient_total_07 } from '/src/components/modal/recipes/Modal_cont_ingredient_total_07';
import { Modal_cont_ingredient_total_08 } from '/src/components/modal/recipes/Modal_cont_ingredient_total_08';
import { Modal_cont_ingredient_total_09 } from '/src/components/modal/recipes/Modal_cont_ingredient_total_09';

export const recipeInfoType = {
  title_en: [
    'STARTER PREMIUM +',
    'TURKEY&BEEF +',
    'DUCK&LAMB +',
    'LAMB&BEEF +',
    'Premium CHICKEN',
    'Premium TURKEY',
    'Premium LAMB',
    'Premium BEEF',
    'KANGA Black',
  ],
  title_ko: [
    '스타터프리미엄 플러스',
    '터키앤비프 플러스',
    '덕앤램 플러스',
    '램앤비프 플러스',
    '프리미엄 치킨',
    '프리미엄 터키',
    '프리미엄 램',
    '프리미엄 비프',
    '캉가 블랙',
  ],
  //   selected_idx: {
  //     'STARTER PREMIUM +': 0,
  //        'TURKEY&BEEF +': 1,
  //        'DUCK&LAMB+': 2,
  //        'LAMB&BEEF+': 3,
  //        'PREMIUM CHICKEN: 4',
  //        'PREMIUM TURKEY',
  //        'PREMIUM LAMB',
  //        'PREMIUM BEEF',
  //        'KANGA Black',
  //   },
  menu_bar: [
    '#ca1011',
    '#FF3232',
    '#FF4921',
    '#FF8C16',
    '#ca1011',
    '#ca1011',
    '#ca1011',
    '#ca1011',
    'black',
  ],
  imagelink: [
    // * require(): component 내부에서 data를 전달받을 경우 랜더링 오류 발생(Runtime Error)
    require('/public/img/recipes/starter.png'),
    require('/public/img/recipes/turkey_beef.png'),
    require('/public/img/recipes/duck_lamb.png'),
    require('/public/img/recipes/lamb_beef.png'),
    require('/public/img/recipes/premium_chicken.png'),
    require('/public/img/recipes/premium_turkey.png'),
    require('/public/img/recipes/premium_lamb.png'),
    require('/public/img/recipes/premium_beef.png'),
    require('/public/img/recipes/kanga_black.png'),
  ],
  component: {
    tab1: [
      <Modal_cont_point_01 key={'point-01'} />,
      <Modal_cont_point_02 key={'point-02'} />,
      <Modal_cont_point_03 key={'point-03'} />,
      <Modal_cont_point_04 key={'point-04'} />,
      <Modal_cont_point_05 key={'point-05'} />,
      <Modal_cont_point_06 key={'point-06'} />,
      <Modal_cont_point_07 key={'point-07'} />,
      <Modal_cont_point_08 key={'point-08'} />,
      <Modal_cont_point_09 key={'point-09'} />,
    ],
    tab2: [
      <Modal_cont_ingredient_01 key={'ingredient-01'} />,
      <Modal_cont_ingredient_02 key={'ingredient-02'} />,
      <Modal_cont_ingredient_03 key={'ingredient-03'} />,
      <Modal_cont_ingredient_04 key={'ingredient-04'} />,
      <Modal_cont_ingredient_05 key={'ingredient-05'} />,
      <Modal_cont_ingredient_06 key={'ingredient-06'} />,
      <Modal_cont_ingredient_07 key={'ingredient-07'} />,
      <Modal_cont_ingredient_08 key={'ingredient-08'} />,
      <Modal_cont_ingredient_09 key={'ingredient-09'} />,
    ],
    tab3: [
      <Modal_cont_ingredient_main_01 key={'ingredient-main-01'} />,
      <Modal_cont_ingredient_main_02 key={'ingredient-main-02'} />,
      <Modal_cont_ingredient_main_03 key={'ingredient-main-03'} />,
      <Modal_cont_ingredient_main_04 key={'ingredient-main-04'} />,
      <Modal_cont_ingredient_main_05 key={'ingredient-main-05'} />,
      <Modal_cont_ingredient_main_06 key={'ingredient-main-06'} />,
      <Modal_cont_ingredient_main_07 key={'ingredient-main-07'} />,
      <Modal_cont_ingredient_main_08 key={'ingredient-main-08'} />,
      <Modal_cont_ingredient_main_09 key={'ingredient-main-09'} />,
    ],
    tab4: [
      <Modal_cont_ingredient_total_01 key={'ingredient-total-01'} />,
      <Modal_cont_ingredient_total_02 key={'ingredient-total-02'} />,
      <Modal_cont_ingredient_total_03 key={'ingredient-total-03'} />,
      <Modal_cont_ingredient_total_04 key={'ingredient-total-04'} />,
      <Modal_cont_ingredient_total_05 key={'ingredient-total-05'} />,
      <Modal_cont_ingredient_total_06 key={'ingredient-total-06'} />,
      <Modal_cont_ingredient_total_07 key={'ingredient-total-07'} />,
      <Modal_cont_ingredient_total_08 key={'ingredient-total-08'} />,
      <Modal_cont_ingredient_total_09 key={'ingredient-total-09'} />,
    ],
  },
};
