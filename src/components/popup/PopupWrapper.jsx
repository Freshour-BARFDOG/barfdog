import styledComponents from "styled-components";
import rem from "/src/components/atoms/rem";

const PopupWrapper = styledComponents.div`
  max-width: ${(props) => {
    rem(props.style.width) ? rem(props.style.width) : "100%";
  }};
  background-color:#fff;
  margin:0 auto;
  min-height: 100vh;

  @media (max-width: ${(props) => rem(props.style.width)}) {
    width: 100% !important;
  }

`;

export default PopupWrapper;
