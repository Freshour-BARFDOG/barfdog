import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import rem from '@src/components/atoms/rem';

const Frame = styled.div`
  cursor: pointer;
  background-color: #e1e2e3;
  border: 1px solid var(--color-line);
  box-sizing: border-box;
  margin-bottom: ${rem(10)};
  position: relative;
  aspect-ratio: ${props=>props.ratio};
  overflow: hidden;
`;

const Img = styled.img`
  object-fit: contain;
  width: 100%;
  height: 100%;
  display: ${(props) => props.isDisplayed};
`;


function PreviewImage({ file, className, thumbLink, ratio, style }) {
  const [SRC, setSRC] = useState(null);

  const IMAGE = () => {
    return SRC ? <Img src={SRC} alt="미리보기 이미지"></Img> : null;
  };

  useEffect(() => {
    // console.log(file);
    // console.log(thumbLink);
    if (file) {
      (async (blob) => {
        if (!blob) {
          return setSRC(false);
        }
        const url = URL.createObjectURL(blob);
        setSRC(url);
      })(file);
    } else if (thumbLink) {
      // console.log(SRC);
      setSRC(thumbLink);
    }
  }, [file, thumbLink]);

  return (
    <Frame className={`preview_img ${className}`} ratio={ratio} style={style}>
      <IMAGE />
    </Frame>
  );
}

export default PreviewImage;


