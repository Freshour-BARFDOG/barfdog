import s from '../../pages/mypage/subscribe/[subscribeId].module.scss';
import React from 'react';

export const SubscribeCancle = () => {
  return (
    <>
      <div className={s.content_inner_box5}>
        <div className={s.title_text}>정기구독 중단 사유</div>
        <div className={s.text}>
          정기구독을 중단하고 싶으신가요?
          <br/>
          바프독이 더 나은 서비스를 제공할 수 있도록 중단하시는 이유를 알려주세요.
        </div>
        
        <div className={s.check_box}>
          <label className={s.chk__box}>
            <input type="checkbox"/>
            <span className={s.on}/>
            <div className={s.sub}>아이가 잘 먹지않아요</div>
          </label>
          
          <label className={s.chk__box}>
            <input type="checkbox"/>
            <span className={s.on}/>
            <div className={s.sub}>급여방식이 너무 번거로워요</div>
          </label>
          
          <label className={s.chk__box}>
            <input type="checkbox"/>
            <span className={s.on}/>
            <div className={s.sub}>더 작은 용량의 샘플구매를 하고싶어요</div>
          </label>
          
          <label className={s.chk__box}>
            <input type="checkbox"/>
            <span className={s.on}/>
            <div className={s.sub}>제품 패키징이 불편해요</div>
          </label>
          
          <label className={s.chk__box}>
            <input type="checkbox"/>
            <span className={s.on}/>
            <div className={s.sub}>급여 방법을 잘 모르겠어요</div>
          </label>
          
          <label className={s.chk__box}>
            <input type="checkbox"/>
            <span className={s.on}/>
            <div className={s.sub}>기타</div>
          </label>
          
          {/* <div className={Styles.check_grid_box}>
                    <div>1</div>
                    <div>아이가 잘 먹지않아요</div>
                    <div>3</div>
                    <div>급여방식이 너무 번거로워요</div>
                    <div>5</div>
                    <div>더 작은 용량의 샘플구매를 하고싶어요</div>
                    <div>7</div>
                    <div>제품 패키징이 불편해요 </div>
                    <div>9</div>
                    <div>급여 방법을 잘 모르겠어요</div>
                    <div>11</div>
                    <div>기타</div>
                  </div> */}
        </div>
        
        <div className={s.input_bg}>
          <input className={s.input_box} placeholder="상세 사유를 입력해주세요"/>
        </div>
        
        <div className={s.btn}>구독 중단하기</div>
      </div>
    </>
  );
};