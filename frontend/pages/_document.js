import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;800&display=swap" rel="stylesheet"/>
        <title>Past Papers (South Africa)</title>
        <meta name="description" content="Prepare for your IEB or NSC (CAPS) exams with these past exam papers."/>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
