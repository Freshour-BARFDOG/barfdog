import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from "next/document";
import MetaTags from './_metaTags';


// Server Only File (client에서 사용하는 로직 사용불가)
// Next JS : _app.js 파일 이후 2번 째 실행


// export default class CustomDocument extends Document {
//   static getInitialProps({ renderPage }) {
//     const { html, head } = renderPage();
//     return { html, head };
//   }
//   render() {
//     return ();
//   }
// }


const CustomDocument = ()=> {

  return (
    <Html lang="ko">
      <Head>
        <MetaTags />
      </Head>
      <body>
        <Main />
      </body>
      <div id="__modal-root"></div>
      <NextScript />
    </Html>
  );
}



CustomDocument.getInitialProps = async ({ renderPage, ctx }) => {
  // const initialProps = await Document.getInitialProps(ctx)
  const { html, head } = renderPage();

  return { html, head };
}




export default CustomDocument;
