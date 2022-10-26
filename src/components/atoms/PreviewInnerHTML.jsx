import React from 'react';
import Styled from 'styled-components';
import rem from '/util/func/rem';

const Wrap = Styled.article`
  height: ${rem(38)};
  display: flex;align-items: center;justify-content: center;
  *{color: inherit}
  i{font-style: italic}
`;



const PreviewInnerHTML = ({ innerHTML, style, ...props }) => {
  return (
    <>
      <Wrap
        {...props}
        dangerouslySetInnerHTML={{ __html: innerHTML || '<em style="font-size:12px; color:var(--color-disabled);">insert Text</em>' }}
        style={style}
      >
      </Wrap>
    </>
  );
};

export default PreviewInnerHTML;