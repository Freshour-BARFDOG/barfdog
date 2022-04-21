import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import rem from '@src/components/atoms/rem';

const Frame = styled.div`
  cursor: pointer;
  width:100%;
  min-width: ${rem(200)};
  max-width: ${rem(960)};
  height: ${rem(200)};
  display: block;
  background-color: #e1e2e3;
  margin-bottom: ${rem(10)};
  position: relative;
  aspect-ratio: 1920/450;
  overflow:hidden;

  img{transition: transform 0.3s ease;}

  &:hover{
    img{transform:scale(1.03)}
  }
`;

const Img = styled.img`
  object-fit: contain;
  width: 100%;
  height: 100%;
  display: ${(props) => props.isDisplayed};
`;


function PreviewImage({file}) {
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

  // (async (blob) => {
  //   const url = URL.createObjectURL(blob);
  //   const arrayBuffer = await blob.arrayBuffer();
  //   console.log(arrayBuffer);
  //   // const blob = new Blob([], { type: "image/png" });
  //   const preview = await blob.text();
  //   console.log(preview);
  //   const img = document.createElement('img');
  //   img.src = url;
  //   document.querySelector(".preview_img").appendChild(img);
  // })(file);

  // (async (e) => {
  //   try {
  //     let contentBuffer = await readFileAsync(file);
  //     console.log(contentBuffer);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // })();

  // function readFileAsync(file) {
  //   return new Promise((resolve, reject) => {
  //     let reader = new FileReader();

  //     reader.onload = () => {
  //       resolve(reader.result);
  //     };

  //     reader.onerror = reject;

  //     reader.readAsArrayBuffer(file);
  //   });
  // }

  return (
    <Frame className="preview_img">
      <IMAGE />
    </Frame>
  );
}

export default PreviewImage;


