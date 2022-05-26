import Styled from "styled-components";
import rem from "./rem";


const Wrap = Styled.div`
  font-size:${rem(15)};
  background-color:#fff;
  // border: ${rem(1)} solid var(--color-line-03);
  padding: ${rem(30)};
  text-align:center;
  margin-top: ${rem(-1)};
  position:relative;
  z-index:0;
`;

const EmptyMessage = ({ text }) => {
  return (
    <>
      <Wrap className="error_wrap">
        <p>{text}</p>
      </Wrap>
    </>
  );
};


export default EmptyMessage;;