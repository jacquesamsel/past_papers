import '../styles/globals.scss'
import PiwikProvider from "@piwikpro/next-piwik-pro"

function MyApp({ Component, pageProps }) {
  return <PiwikProvider
    containerId='de6cc8be-61b7-4861-b4f2-0af2f34ca6e1'
    containerUrl='https://jacquesamsel.piwik.pro'
    ><Component {...pageProps} /></PiwikProvider>
}

export default MyApp
