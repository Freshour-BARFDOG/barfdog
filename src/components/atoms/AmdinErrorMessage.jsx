import Styled from "styled-components";
import rem from "@util/func/rem";


const Wrap = Styled.div`
  font-size:${rem(15)};
  background-color:#fff;
  padding: ${rem(30)};
  text-align:center;
  position:relative;
  z-index:0;
`;

const EmptyMessage = ({ text, loading }) => {
  return (
    <>
      <Wrap className="error_wrap">
        {loading || <p>{text}</p>}
      </Wrap>
    </>
  );
};


export default EmptyMessage;