import Navbar from '@/components/Navbar';
import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';
import {cn} from '@/lib/utils';
import Providers from '@/components/Providers';

import 'react-loading-skeleton/dist/skeleton.css'

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
   title: 'Glyph',
   description: 'A PDF reading AI application',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
   return (
      <html lang='en' className='light'>
         <Providers>
            <body className={cn('min-h-screen font-cans antialiased', inter.className)}>
               <Navbar />
               {children}
            </body>
         </Providers>
      </html>
   );
}
