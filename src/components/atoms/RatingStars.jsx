import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import rem from '/util/func/rem';

const Wrap = styled.div`
  display: flex;
  align-content: center;
  justify-content: flex-start;
`;

const Star = styled.i`
  width: ${(props) => (props.size ? rem(props.size) : rem(14))};
  height: ${(props) => (props.size ? rem(props.size) : rem(14))};
  position: relative;
  display: inline-block;
  overflow: hidden;
  cursor:${(props) => (props.disabled ? 'default' : 'pointer')};
  min-width: ${rem(10)};
  min-height: ${rem(10)};
  &:not(:last-child) {
    margin-right: ${(props) => (props.margin >= 0 ? rem(props.margin) : rem(5))}};
  }
`;



const RatingStars = ({ count, size, margin,id,  setFormValues, disabled  = false}) => {
  const initialStars = [];
  const maxStarCount = 5;
  for (let i = 0; i < maxStarCount; i++) {
    initialStars.push(true);
  }
  const [allStars, setAllStars] = useState(initialStars);
  const [isRenderingDone, setIsRenderingDone] = useState( false );
  
  useEffect( () => {
    if(!isRenderingDone){
      setIsRenderingDone(true);
    }
  }, [isRenderingDone] );
  
  
  useEffect( () => {
    if(typeof count !== 'number' || count > maxStarCount || count < 0 ) return console.error(`별점은 1 ~ ${maxStarCount} 사이의 number type값이 입력되어야 합니다.`);
    updateStarCount(count);
  }, [count] );
  


  const onClickHandler = (e) => {
    if(disabled) return;
    const star = e.currentTarget;
    const rating = Number(star.dataset.index) + 1;
    updateStarCount(rating);
    setIsRenderingDone(false)
  };
  
  
  // 0.5점을 별도 확인
  // 4점에서 4.74까지는 4점, 4.75이상은 5점으로 표시(4.5점 기준으로 반올림이 추가적으로 작동)
  const updateStarCount = (rating) => {
    const nextStars = [];
    const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5
    const hasHalfStar = roundedRating % 1 !== 0; // Check if rating has half star
    const wholeStars = Math.floor(roundedRating); // Calculate number of whole stars
    const emptyStars = maxStarCount - wholeStars - (hasHalfStar ? 1 : 0); // Calculate number of empty stars
  
    for (let i = 0; i < wholeStars; i++) {
      nextStars.push(true);
    }
  
    if (hasHalfStar) {
      nextStars.push('half');
    }
  
    for (let i = 0; i < emptyStars; i++) {
      nextStars.push(false);
    }
  
    setAllStars(nextStars);
  
    if (setFormValues && typeof setFormValues === 'function') {
      setFormValues((prevState) => ({
        ...prevState,
        [id]: rating,
      }));
    }
  };

  return (
    <Wrap>
      {allStars.map((booleanValue, index) => (
        <Star
          className={`${
            isRenderingDone && typeof booleanValue === 'boolean'
              ? 'animation-show'
              : ''
          } animation-delay-${index}`}
          size={size}
          margin={margin}
          key={`rating-star-${index}`}
          onClick={onClickHandler}
          data-index={index}
          disabled={disabled}
        >
          {typeof booleanValue === 'boolean' ? (
            <Image
              src={require(`/public/img/icon/${
                booleanValue ? 'star_yellow' : 'star_dark'
              }.png`)}
              objectFit="cover"
              layout="fill"
              alt="별점 아이콘"
            />
          ) : (
            // 4.5점일 경우 표시되는 이미지 (4.26점 ~ 4.74점)
            <Image
              src={require(`/public/img/icon/star_half.png`)}
              objectFit="cover"
              layout="fill"
              alt="별점 아이콘"
            />
          )}
        </Star>
      ))}
    </Wrap>
  );
};

export default RatingStars;
