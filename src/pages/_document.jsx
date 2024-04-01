import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from 'next/document';
import MetaTags from './_metaTags';
// eslint-disable-next-line @next/next/no-script-in-document
import {
  GA_TRACKING_ID,
  TAGMANAGER_CONTAINER,
  TAGMANAGER_KEY,
  UA_TRACKING_ID,
} from '/src/pages/api/googleAnalytics/gtag';

// Server Only File (client에서 사용하는 로직 사용불가)
// Next JS : _app.js 파일 이후 2번 째 실행

export default function CustomDocument() {
  return (
    <Html lang="ko">
      <Head>
        {/* <!-- Google Tag Manager --> */}
        <script
          data-script-title={'GOOGLE-TAG-MANAGER'}
          dangerouslySetInnerHTML={{
            __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
             new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
             j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
             'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);  
             })
            (window,document,'script','dataLayer','GTM-PG8PX9K9');
            `,
          }}
        ></script>
        {/* <!-- End Google Tag Manager --> */}
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css"
          rel="stylesheet"
          type="text/css"
          crossOrigin={'true'}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
          rel="stylesheet"
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
        {/* <!-- Meta Pixel Code -->  */}
        <script
          data-script-title={'META PIXEL'}
          dangerouslySetInnerHTML={{
            __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1294667177830818');
            fbq('track', 'PageView');
          `,
          }}
        />
        {/* <!-- End Meta Pixel Code --> */}

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
        <noscript>
          {/* <!-- Google Tag Manager (noscript) --> */}
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PG8PX9K9"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
          {/* <!-- End Google Tag Manager (noscript) --> */}
          {/* <!-- Meta Pixel Code (noscript) -->  */}
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1294667177830818&ev=PageView&noscript=1"
          />
          {/* <!-- End Meta Pixel Code (noscript) --> */}
        </noscript>
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
