import React, {useState} from 'react';
import s from '../../pages/mypage/subscribe/[subscribeId].module.scss';
import Image from 'next/image';
import CustomInput from '../atoms/CustomInput';

export const SubscribeRecipe = ({name = 'test2'}) => {
  const [selectedRadio, setSelectedRadio] = useState( null );
  return (
    <>
      <section className={s.notice}>
        <div className={s.notice_row_1}>구매하실 레시피 한가지를 선택해 주세요</div>
        
        <div className={s.notice_row_2}>풀플랜만 두 개의 레시피를 동시선택할 수 있습니다</div>
        
        <div className={s.notice_row_3}>
          <div className={s.color_box}>
            <div className={s.color_box_row_1}>
              <div className={s.picture_box}>
                <div className={`${s.image} img-wrap`}>
                  <Image
                    priority
                    src={require( 'public/img/mypage/subscribe/alert_circle.png' )}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>
              </div>
              <span>&nbsp;잠깐!</span>
            </div>
            <div className={s.color_box_row_2}>
              @에 못먹는 음식으로 체크해 주셨네요! #,# 레시피에는 @가 들어가 있습니다.
              <br/>
              반려견에게 알레르기를 유발할 수 있으니 레시피 선택에 유의해 주시기 바랍니다.
            </div>
          </div>
        </div>
      </section>
      
      <div className={s.flex_box2} data-input-title={name}>
        <CustomInput
          id={`${name}-input-radio-04`}
          type="radio"
          name={name}
          selectedRadio={selectedRadio}
          setSelectedRadio={setSelectedRadio}
        >
          <div className={s.recipe_choice_box}>
            <div className={s.img_box}>
              <div className={`${s.image} img-wrap`}>
                <Image
                  priority
                  src={require( 'public/img/mypage/subscribe/subscribe_recipe_1.png' )}
                  objectFit="cover"
                  layout="fill"
                  alt="카드 이미지"
                />
              </div>
            </div>
            
            <div className={s.row_1}>TURKEY &amp; BEEF</div>
            
            <div className={s.row_2}>칠면조 &amp; 소</div>
            
            <div className={s.row_3}>
              우리 아이를 더 튼튼하게!
              <br/>
              발육과 영양 보충을 위한 터키 앤 비프
            </div>
            
            <div className={s.row_4}>더 알아보기</div>
          </div>
        </CustomInput>
        
        <CustomInput
          id={`${name}-input-radio-05`}
          type="radio"
          name={name}
          selectedRadio={selectedRadio}
          setSelectedRadio={setSelectedRadio}
        >
          <div className={s.recipe_choice_box}>
            <div className={s.img_box}>
              <div className={`${s.image} img-wrap`}>
                <Image
                  priority
                  src={require( 'public/img/mypage/subscribe/subscribe_recipe_2.png' )}
                  objectFit="cover"
                  layout="fill"
                  alt="카드 이미지"
                />
              </div>
            </div>
            
            <div className={s.row_1}>TURKEY &amp; BEEF</div>
            
            <div className={s.row_2}>칠면조 &amp; 소</div>
            
            <div className={s.row_3}>
              우리 아이를 더 튼튼하게!
              <br/>
              발육과 영양 보충을 위한 터키 앤 비프
            </div>
            
            <div className={s.row_4}>더 알아보기</div>
          </div>
        </CustomInput>
        
        <CustomInput
          id={`${name}-input-radio-06`}
          type="radio"
          name={name}
          selectedRadio={selectedRadio}
          setSelectedRadio={setSelectedRadio}
        >
          <div className={s.recipe_choice_box}>
            <div className={s.img_box}>
              <div className={`${s.image} img-wrap`}>
                <Image
                  priority
                  src={require( 'public/img/mypage/subscribe/subscribe_recipe_3.png' )}
                  objectFit="cover"
                  layout="fill"
                  alt="카드 이미지"
                />
              </div>
            </div>
            
            <div className={s.row_1}>TURKEY &amp; BEEF</div>
            
            <div className={s.row_2}>칠면조 &amp; 소</div>
            
            <div className={s.row_3}>
              우리 아이를 더 튼튼하게!
              <br/>
              발육과 영양 보충을 위한 터키 앤 비프
            </div>
            
            <div className={s.row_4}>더 알아보기</div>
          </div>
        </CustomInput>
        
        <CustomInput
          id={`${name}-input-radio-07`}
          type="radio"
          name={name}
          selectedRadio={selectedRadio}
          setSelectedRadio={setSelectedRadio}
        >
          <div className={s.recipe_choice_box}>
            <div className={s.img_box}>
              <div className={`${s.image} img-wrap`}>
                <Image
                  priority
                  src={require( 'public/img/mypage/subscribe/subscribe_recipe_4.png' )}
                  objectFit="cover"
                  layout="fill"
                  alt="카드 이미지"
                />
              </div>
            </div>
            
            <div className={s.row_1}>TURKEY &amp; BEEF</div>
            
            <div className={s.row_2}>칠면조 &amp; 소</div>
            
            <div className={s.row_3}>
              우리 아이를 더 튼튼하게!
              <br/>
              발육과 영양 보충을 위한 터키 앤 비프
            </div>
            
            <div className={s.row_4}>더 알아보기</div>
          </div>
        </CustomInput>
      </div>
      
      <div className={s.recipe_btn_box}>
        <div className={s.btn}>변경 레시피 적용하기</div>
      </div>
    </>
  );
};