import React from 'react';
import Image from "next/image";
import styled from "styled-components";
import rem from './rem';


const Star = styled.div`
  width: ${(props) => (props.size ? rem(props.size) : rem(14))};
  height: ${(props) => (props.size ? rem(props.size) : rem(14))};
  position: relative;
  display: inline-block;
  overflow: hidden;
  min-width: ${rem(10)};
  min-height: ${rem(10)};
  &:not(:last-child) {
    margin-right: ${(props) => (props.margin >= 0 ? rem(props.margin) : rem(5))}};
  }
`;

const RatingStars = ({ count, size, margin }) => {
  const AllStars = [];
  const maxStartCount = 5;
  const yellowStarCount = Number(count);
  const darkStarCount = maxStartCount - yellowStarCount;

  const YellowStar = () => {
    return (
      <Star size={size} margin={margin}>
        <Image
          src={require("/public/img/icon/star_yellow.png")}
          objectFit="cover"
          layout="fill"
          alt="별점 아이콘"
        />
      </Star>
    );
  };

  const DarkStar = () => {
    return (
      <Star size={size} margin={margin}>
        <Image
          src={require("/public/img/icon/star_dark.png")}
          objectFit="cover"
          layout="fill"
          alt="별점 아이콘"
        />
      </Star>
    );
  };

  for (let i = 0; i < yellowStarCount; i++) {
    AllStars.push(<YellowStar key={"yello-star-" + i} />);
  }

  for (let i = 0; i < darkStarCount; i++) {
    AllStars.push(<DarkStar key={"dark-star-" + i} />);
  }

  return AllStars;
};


export default RatingStars;

