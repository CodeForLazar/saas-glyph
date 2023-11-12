'use client';
import {trpc} from '@/app/_trpc/client';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {httpBatchLink} from '@trpc/react-query';
import {useState, PropsWithChildren} from 'react';

interface ProvidersProps extends PropsWithChildren {}

const Providers = ({children}: ProvidersProps) => {
   const [queryClient] = useState(() => new QueryClient());
   const [trcpClient] = useState(() =>
      trpc.createClient({
         links: [
            httpBatchLink({
               url: 'http://localhost:3000/api/trpc',
            }),
         ],
      })
   );
   return (
      <trpc.Provider client={trcpClient} queryClient={queryClient}>
         <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </trpc.Provider>
   );
};

export default Providers;
