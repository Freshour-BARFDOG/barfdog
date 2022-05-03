import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import rem from '@src/components/atoms/rem';

const Frame = styled.div`
  cursor: pointer;
  width: 100%;
  min-width: ${rem(200)};
  max-width: ${rem(960)};
  height: ${rem(200)};
  display: block;
  background-color: #e1e2e3;
  border: 1px solid var(--color-line);
  box-sizing: border-box;
  margin-bottom: ${rem(10)};
  position: relative;
  aspect-ratio: 1920/450;
  overflow: hidden;
`;

const Img = styled.img`
  object-fit: contain;
  width: 100%;
  height: 100%;
  display: ${(props) => props.isDisplayed};
`;


function PreviewImage({file, className}) {
  const [SRC, setSRC] = useState(null);

  const IMAGE = () => {
    return SRC ? <Img src={SRC} alt="미리보기 이미지"></Img> : null;
  };

  useEffect(() => {
    (async (blob) => {
      if (!blob) {
        return setSRC(false);
      }

      const url = URL.createObjectURL(blob);
      setSRC(url);
      const arrayBuffer = await blob.arrayBuffer(); // 서버저장에 사용되는지?
      // console.log(arrayBuffer);
    })(file);
  }, [file]);

  return (
    <Frame className={`preview_img ${className}`}>
      <IMAGE />
    </Frame>
  );
}

export default PreviewImage;


