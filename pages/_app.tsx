import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import store, { persistor } from "../redux/store";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "@material-tailwind/react";
import "react-toastify/dist/ReactToastify.css";
import "react-tooltip/dist/react-tooltip.css";
import 'react-datepicker/dist/react-datepicker.css';
import "./globals.css";
import "../public/css/data-tables.css";
import "../public/css/fonts.css";
import dynamic from "next/dynamic";
import Head from "next/head";

const BaseLayout = dynamic(() => import("@/components/Layout/BaseLayout"), {
  ssr: false,
});

function MyApp({ Component, pageProps }: any) {
  return (
    <>
      <Head>
        <title>swiftstay | Admin Panel</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="theme-color" content="#021A98" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/icons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/icons/favicon-16x16.png"
        />
        <link rel="icon" href="/images/icons/favicon.ico" />
      </Head>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ToastContainer />

          <BaseLayout>
            <Component {...pageProps} />
          </BaseLayout>
        </PersistGate>
      </Provider>
    </>
  );
}

export default MyApp;
