import styledComponents from "styled-components";
import rem from "/util/func/rem";

const PopupWrapper = styledComponents.div`
  max-width: ${(props) => {
    rem(props.style.width) ? rem(props.style.width) : "100%";
  }};
  background-color:#fff;
  margin:0 auto;
  min-height: 100vh;
  box-shadow: 0 0 ${rem(30)} 0 rgba(0,0,0,0.1);

  @media (max-width: ${(props) => rem(props.style.width)}) {
    width: 100% !important;
  }

`;

export default PopupWrapper;
