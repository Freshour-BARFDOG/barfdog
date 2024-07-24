import styled from 'styled-components';
import rem from '/util/func/rem';
import { HiStar } from 'react-icons/hi';

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
  transform: translate(-50%, 0) rotate(-45deg);
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
  transform-origin: center;
  position: absolute;
  font-size: ${rem(16)};
  font-weight: bold;
  letter-spacing: ${rem(0.4)};
  background-color: #000;
  z-index: 1;
  transform: translate(-50%, -50%) rotate(-45deg);
  height: ${rem(80)};
  left: ${rem(8)};
  top: ${rem(8)};
  width: ${rem(120)};
`;

const InnerIconWrap = styled.span`
  display: flex;
  transform: scale(0.65);
  margin-bottom: ${rem(-4)};
`;
const TextWrap = styled.span`
  display: flex;
  margin-bottom: ${rem(-2)};
  ${({ inedibleFood }) =>
    inedibleFood &&
    `
    height: 35px;
  `}
  ${({ packageLabel }) =>
    packageLabel &&
    `
    height: 33px;
  `}
`;

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

export const ItemRecommendlabel = ({
  label,
  className,
  style,
  inedibleFood,
  packageLabel,
}) => {
  return (
    <>
      <Icon_Recommend className={className} style={style}>
        <InnerIconWrap>
          {/* <HiStar /> */}
          {!inedibleFood && <HiStar />}
          {/* <HiStar /> */}
        </InnerIconWrap>
        <TextWrap inedibleFood={inedibleFood} packageLabel={packageLabel}>
          {label}
        </TextWrap>
      </Icon_Recommend>
    </>
  );
};

const Icon_SoldOut = styled.em`
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-content: center;
  justify-content: center;
  z-index: 1;

  i {
    position: absolute;
    top: 15%;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    aspect-ratio: 1;
    max-height: ${rem(120)};
    max-width: ${rem(120)};
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    font-weight: 500;
    font-size: ${rem(28)};
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: ${rem(8)};
    padding-left: ${rem(2)};
    box-sizing: border-box;
    line-height: 1.1;
  }
`;

export const ItemSoldOutLabel = ({ label }) => {
  // 재고 없을 경우 ICON

  return (
    <>
      <Icon_SoldOut>{label ? <i>{label}</i> : <i>SOLD OUT</i>}</Icon_SoldOut>
    </>
  );
};
