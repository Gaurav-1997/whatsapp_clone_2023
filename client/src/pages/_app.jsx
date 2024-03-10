import { StateProvider } from "@/context/StateContext";
import reducer, { initialState } from "@/context/StateReducers";
import "@/styles/globals.css";
import Head from "next/head";
import { Provider } from "react-redux";
import store from "@/store/store";
import SocketClient from "@/utils/SocketClient";

export const socketClient = new SocketClient();
export default function App({ Component, pageProps }) {
  
  return (
    // <StateProvider initialState={initialState} reducer={reducer}>
    <Provider store={store}>
      <Head>
        <title>Whatsapp</title>
        <link rel="shortccut icon" href="/favicon.png" />
      </Head>
      <Component {...pageProps} />
    </Provider>
    // </StateProvider>
  );
}
