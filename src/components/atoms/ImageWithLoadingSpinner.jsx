import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Spinner from '/src/components/atoms/Spinner';


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
