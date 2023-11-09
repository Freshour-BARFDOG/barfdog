import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styledComponents from 'styled-components';
import { ImSpinner2 } from 'react-icons/im';



const Wrap = styledComponents.div`
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: rotate ${(props) => props.speed}s linear infinite;

  @keyframes rotate {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

// const Wrap = styledComponents.i`
//     display:flex;
//     align-items: center;
//     justify-content:center;
//     pointer-events:none;
//     // opacity:0;
//     animation: rotate ${(props) => props.speed}s linear infinite !important;
    
//     &.floating{
//       position:absolute;
//       left:50%;
//       top:50%;
//       transform:translate(-50%,-50%);
//     }
    
//     @keyframes rotate {
//       from{transform:rotate(0);}
//       to{transform:rotate(360deg);}
//     }
//   `;

const Spinner = ({ style, speed = '0.6', floating, ...props }) => {
  const defaultStyle = {
    ...style,
    width: style?.width || '20',
    height: style?.height || '20',
    color: style?.color || 'var(--color-main)',
  };
  
 

  return (
    <Wrap className={`spinner ${floating ? 'floating' : ''}`} speed={speed} {...props}>
      <ImSpinner2 style={defaultStyle} />
    </Wrap>
  );
};


const ImageWithLoadingSpinner = ({ src, alt, width, height, objectFit, layout }) => {
  const [loading, setLoading] = useState(true);

  const handleLoadingComplete = () => {
    // 이미지 로딩이 완료될 때 호출되는 함수
    setLoading(false);
  };

  return (
    <div className="image-container">
      {loading && <Spinner />} {/* 로딩 중일 때 스피너를 표시 */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        objectFit={objectFit}
        layout={layout}
        onLoadingComplete={handleLoadingComplete}
      />
    </div>
  );
};


export default ImageWithLoadingSpinner;
