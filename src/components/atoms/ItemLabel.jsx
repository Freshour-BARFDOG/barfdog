import styled from "styled-components";
import rem from "/src/components/atoms/rem";
import { HiStar } from 'react-icons/hi'

const Icon = styled.i`
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    transform-origin: center;
    position: absolute;
    font-size: ${rem(20)};
    letter-spacing: ${rem(0.4)};
    background-color: var(--color-main);
    z-index: 1;
    transform: translate(-50%, 0)rotate(-45deg);
    height: ${rem(34)};
    left: ${rem(34)};
    top: ${rem(14)};
    width: ${rem(300)};
  `;


const Icon_Recommend = styled.i`
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    font-weight: 500;
    transform-origin: center;
    position: absolute;
    font-size: ${rem(16)};
    font-weight: bold;
    letter-spacing: ${rem(0.4)};
    background-color: #000;
    z-index: 1;
    transform: translate(-50%, -50%)rotate(-45deg);
    height: ${rem(80)};
    left: ${rem(8)};
    top: ${rem(8)};
    width: ${rem(120)};
  `;

const InnerIconWrap = styled.span`
    display: flex;
    transform:scale(.65);
    margin-bottom: ${rem(-4)};
  `
const TextWrap = styled.span`
    display: flex;
    margin-bottom: ${rem(-2)};
  `






const ItemLabel = ({ label, className, style }) => {
  return (
    <>
      <Icon className={className} style={style}>
        {label}
      </Icon>
    </>
  );
};

export default ItemLabel;




export const ItemRecommendlabel = ({ label, className, style }) => {
  return (
    <>
      <Icon_Recommend className={className} style={style}>
        <InnerIconWrap>
          <HiStar /><HiStar /><HiStar />
        </InnerIconWrap>
        <TextWrap>{label}</TextWrap>
      </Icon_Recommend>
    </>
  );
};
