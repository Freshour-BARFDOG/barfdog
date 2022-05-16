import styled from "styled-components";
import rem from "@src/components/atoms/rem";



const Icon_Itemlabel = ({ label, className, style }) => {
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
    // transform: translate(-50%, 0)rotate(-45deg);
    // height: ${rem(34)};
    // left: ${rem(34)};
    // top: ${rem(14)};
    // width: ${rem(300)};
  `;
  return (
    <>
      <Icon className={className} style={style}>
        {label}
      </Icon>
    </>
  );
};

export default Icon_Itemlabel;
