import Navbar from '@/components/chat/Navbar';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Providers from '@/components/Providers';
import { Toaster } from '@/components/ui/toaster';

import 'react-loading-skeleton/dist/skeleton.css';
import 'simplebar-react/dist/simplebar.min.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
   title: 'Glyph',
   description: 'A PDF reading AI application'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <html lang='en' className='light'>
         <Providers>
            <body
               suppressHydrationWarning={true}
               className={cn('font-cans min-h-screen antialiased', inter.className)}
            >
               <Toaster />
               <Navbar />
               {children}
            </body>
         </Providers>
      </html>
   );
}
