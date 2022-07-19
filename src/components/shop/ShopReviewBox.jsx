import Styles from '../../pages/shop/item/[itemId].module.scss';
import RatingStars from '../atoms/RatingStars';
import React, {useEffect, useRef, useState} from 'react';
import {slideDown, slideUp} from "../../../util/func/slideToggle";
import Image from "next/image";

export const ShopReviewBox = () => {

  return (
    <section className={Styles.tab_slide_box2}>
      {/* 리뷰별점박스 */}
      <div className={Styles.flex_box}>
        <div className={Styles.content}>
          <div className={Styles.title}>59개의 리뷰</div>
          
          <div className={Styles.grade}>
            4.0 /<span className={Styles.red}>5.0</span>
          </div>
          <RatingStars count={4} size={27} disabled/>
        </div>
      </div>
      
      <div className={Styles.button_box}>
        <button className={Styles.write_button}>후기 작성하기</button>
      </div>
      
      <div className={Styles.notice_board}>
        <div className={Styles.flex_title}>
          <div>No</div>
          <div>별점</div>
          <div className={Styles.px16_title_content}>제목</div>
          <div></div>
          <div>등록일</div>
        </div>
        <ul className="reviewBox">
          {[1,2,3].map((data, index)=><ReviewList key={`review-list-${index}`} data={data}/>)}
        </ul>
      </div>
      
      {/* // * B! Ventures > News Page > Pagination 사용예정  */}
      <div className={Styles.pagination_box}>
        <div className={Styles.content}>
          <div> &#60;</div>
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
          <div>5</div>
          <div>...</div>
          <div>11</div>
          <div> &#62;</div>
        </div>
      </div>
    </section>
  );
};




const ReviewList = ({data}) => {
  const [visible, setVisible] = useState(false);
  const boxRef = useRef(null);
  const onClickHandler = (e) => {
    visible ? setVisible(false) : setVisible(true);
  };
  
  useEffect(() => {
    const selectedElem = boxRef.current;
    if (!selectedElem) return;
    visible ? slideDown(selectedElem) : slideUp(selectedElem);
  }, [visible]);
  
  return (
    <li>
      <figure className={Styles.grid_box} onClick={onClickHandler}>
        {/* 그리드 1 시작지점 */}
        <span className={Styles.number}>48</span>
        <i className={Styles.star_box}>
          <RatingStars count={3} margin={0} disabled/>
        </i>
        <p className={Styles.content}>
          <i className={`${Styles.image} img-wrap`}>
            <Image
              src={require('public/img/pages/review/review_slide_sample.png')}
              objectFit="contain"
              layout="fill"
              alt="카드 이미지"
            />
          </i>
          사진 굿굿 너무 좋아요
        </p>
        <span className={Styles.name}> 바&#42;독</span>
        <span className={Styles.date}> 2022.01.20</span>
      </figure>
      <div className={Styles.review_box} ref={boxRef}>
        <p className={Styles.text}>너무 잘먹고요. 모질이 좋아지는게 눈에 보여요.</p>
      </div>
    </li>
  );
};

