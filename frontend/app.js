import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LoadingIndicator from '@/app/loading';

function MyApp({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    router.events.on('routeChangeStart', () => setIsLoading(true));
    router.events.on('routeChangeComplete', () => setIsLoading(false));

    return () => {
      router.events.off('routeChangeStart', () => setIsLoading(true));
      router.events.off('routeChangeComplete', () => setIsLoading(false));
    };
  }, [router]);
  return (
    <div>
      {isLoading && <LoadingIndicator />}
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
