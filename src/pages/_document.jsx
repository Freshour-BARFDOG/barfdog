import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from "next/document";
// Server Only File (client에서 사용하는 로직 사용불가)
// Next JS : _app.js 파일 이후 2번 째 실행

// 페이지 공통으로 사용하는 컴포넌트

export default class CustomDocument extends Document {
  static getInitialProps({ renderPage }) {
    const { html, head } = renderPage();

    return { html, head };
  }

  render() {
    return (
      <Html>
        <title>바프독 | Barf Dog</title>

        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta property="og:title" content="B! Ventures" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/favicon/logo(metatag).png"
        />
        <meta property="og:site_name" content="BARFDOG" />
        <meta property="og:description" content="내 반려동물에게 꼭 맞는 1:1 맞춤 플랜, 나이, 품종, 체중, 활동량, 알러지 등을 고려한 완벽한 식단을 간편하게 정기배송 받을 수 있습니다. 바프독 시작하기."
        />
        <meta property="og:url" content="http://barfdog.cor.kr" />
        <meta name="ROBOTS" content="ALL" />

        {/* Favicon */}
        <link rel="icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="57x57" href="/favicon/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/favicon/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/favicon/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/favicon/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/favicon/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/favicon/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/favicon/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/favicon/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="192x192"  href="/favicon/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/favicon/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff"/>
                
        <Head>
          {/*
          모든페이지에 아래 메타테크가 head에 들어감
          루트파일이기에 가능한 한 적은 코드만 넣어야함 
          전역 파일을 엉망으로 만들면 안된다 */}
        </Head>
        <body> 
          <Main />
        </body>
        <NextScript />
      </Html>
    );
  }
}
