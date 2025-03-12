import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Ensure the viewport is set for mobile devices */}
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {/* Add any other global meta tags or links here */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
