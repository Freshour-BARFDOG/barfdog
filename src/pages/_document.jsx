import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from "next/document";
import MetaTags from './_metaTags';
// eslint-disable-next-line @next/next/no-script-in-document
import {GA_TRACKING_ID, TAGMANAGER_CONTAINER, TAGMANAGER_KEY, UA_TRACKING_ID} from "/src/pages/api/googleAnalytics/gtag";

// Server Only File (client에서 사용하는 로직 사용불가)
// Next JS : _app.js 파일 이후 2번 째 실행



export default function CustomDocument () {
  return (
    <Html lang="ko">
      <Head>
          <link
            href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css"
            rel="stylesheet"
            type="text/css"
            crossOrigin={"true"}
          />
        <script
          script-title={'google-analytics'}
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        {/* <!-- Google Analytics --> */}
        <script
          data-script-title={'GOOGLE-ANALYTICS'}
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });          
            gtag('config', '${UA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
        {/* <!-- Google Tag Manager --> */}
        <script
          data-script-title={'GOOGLE-TAG-MANAGER'}
          dangerouslySetInnerHTML={{
            __html: `
        (function(w,d,s,l,i){
          w[l]=w[l]||[];
          w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
          var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),
          dl=l!='dataLayer'?'&l='+l:'';
          j.async=true;
          j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
          f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${TAGMANAGER_CONTAINER}');
        `,
          }}
        ></script>
        <MetaTags />
      </Head>
      <body>
        <Main />
      </body>
      <NextScript />
    </Html>
  );
}


// export default class CustomDocument extends Document {
//   static getInitialProps({ renderPage }) {
//     const { html, head } = renderPage();
//     return { html, head };
//   }
//   render() {
//     return ();
//   }
// }


//
// CustomDocument.getInitialProps = async ({ renderPage }) => {
//   const { html, head } = renderPage();
//
//   return { html, head };
// };



/*{
 - CF. < DOCUMENT param Obj >
  err: undefined,
  req: undefined,
  res: undefined,
  pathname: '/',
  query: {},
  asPath: '/',
  locale: undefined,
  locales: undefined,
  defaultLocale: undefined,
  AppTree: [Function: AppTree],
  defaultGetInitialProps: [AsyncFunction: defaultGetInitialProps],
  renderPage: [Function: renderPage]
}

* */
