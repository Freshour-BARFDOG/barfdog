import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import rem from '/util/func/rem';

const Frame = styled.div`
  cursor: pointer;
  background-color: ${props=>props.backgroundColor ||'#e1e2e3' }; ;
  border: 1px solid var(--color-line);
  box-sizing: border-box;
  margin-bottom: ${rem(10)};
  position: relative;
  aspect-ratio: ${props=>props.ratio};
  overflow: hidden;
`;

const Img = styled.img`
  object-fit: ${props => props.objectFit || 'contain'};
  width: 100%;
  height: 100%;
  display: ${(props) => props.isDisplayed};
`;



const IMAGE = ({SRC, objectFit}) => {
  return SRC ? (
    <Img src={SRC} alt="미리보기 이미지" style={{objectFit:objectFit}}></Img>
  ) : null;
};






function PreviewImage({ file, className, thumbLink, ratio, style, backgroundColor , objectFit, ...props }) {
  const [SRC, setSRC] = useState(null);

  useEffect(() => {
    // // console.log(file);
    // // console.log(thumbLink);
    if (file) {
      (async (blob) => {
        if (!blob) {
          return setSRC(false);
        }
        const url = URL.createObjectURL(blob);
        setSRC(url);
      })(file);
    } else if (thumbLink) {
      // // console.log(SRC);
      setSRC(thumbLink);
    } else {
      setSRC(''); // preview 이미지 초기화
      // 파일 업로드창을 켠뒤 esc를 넣었을 경우,
      // file값이 없어진 것과 매칭시키기 위함
    }
  }, [file, thumbLink]);

  return (
    <Frame className={`preview_img ${className || ''}`} ratio={ratio} style={style} backgroundColor={backgroundColor}>
      <IMAGE SRC={SRC} objectFit={objectFit}/>
      {props.children}
    </Frame>
  );
}

export default PreviewImage;


