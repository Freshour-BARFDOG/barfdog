import React from 'react'

function MetaTags() {
  return (
    <>
      {/* <title>바프독 | Barf Dog</title> // * Page Level에서 title태그 사용할 것*/}
      <meta
        name="description"
        content="내 반려동물에게 꼭 맞는 1:1 맞춤 플랜, 나이, 품종, 체중, 활동량, 알러지 등을 고려한 완벽한 식단을 간편하게 정기배송 받을 수 있습니다. 바프독 시작하기."
      />
      <meta
        name="keywords"
        content="바프독, barfdog, 반려견 자연식, 강아지 자연식, 강아지 생식, 수제사료, 기호성 사료, 노령견 사료, 화식, 자연식"
      />

      <meta property="og:title" content="Barf Dog" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/favicon/logo(metatag).png" />
      <meta property="og:site_name" content="Barf Dog" />
      <meta
        property="og:description"
        content="내 반려동물에게 꼭 맞는 1:1 맞춤 플랜, 나이, 품종, 체중, 활동량, 알러지 등을 고려한 완벽한 식단을 간편하게 정기배송 받을 수 있습니다. 바프독 시작하기."
      />
      <meta property="og:url" content="https://www.barfdog.co.kr/" />
      <meta name="ROBOTS" content="ALL" />

      {/* Favicon */}
      <link rel="icon" href="/favicon/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="57x57"
        href="/favicon/apple-icon-57x57.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="60x60"
        href="/favicon/apple-icon-60x60.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="72x72"
        href="/favicon/apple-icon-72x72.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="76x76"
        href="/favicon/apple-icon-76x76.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="114x114"
        href="/favicon/apple-icon-114x114.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="120x120"
        href="/favicon/apple-icon-120x120.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="144x144"
        href="/favicon/apple-icon-144x144.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="152x152"
        href="/favicon/apple-icon-152x152.png"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/favicon/apple-icon-180x180.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="192x192"
        href="/favicon/android-icon-192x192.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="96x96"
        href="/favicon/favicon-96x96.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon/favicon-16x16.png"
      />
      <link rel="manifest" href="/favicon/manifest.json" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta
        name="msapplication-TileImage"
        content="/favicon/ms-icon-144x144.png"
      />
      <meta name="theme-color" content="#ffffff" />
      {/*
        모든페이지에 아래 메타테크가 head에 들어감
        루트파일이기에 가능한 한 적은 코드만 넣어야함 
        전역 파일을 엉망으로 만들면 안된다 */}
    </>
  );
}

export default MetaTags