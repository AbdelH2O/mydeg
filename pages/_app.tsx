import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Providers from '../components/Providers';
import Loader from '../components/Loader';
import { ToastContainer } from 'react-toastify';
import { Analytics } from '@vercel/analytics/react';
import { trpc } from '../utils/trpc';
import 'react-toastify/dist/ReactToastify.css';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Providers>
      <Loader />
      <ToastContainer />
      <Component {...pageProps} />
      <Analytics />
    </Providers>
  );
}

export default trpc.withTRPC(App);
