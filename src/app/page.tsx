import Link from 'next/link';
import MaxWidthWrapper from '../components/MaxWidthWrapper';
import { ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

export default function Home() {
   return (
      <MaxWidthWrapper className='mb-12 mt-28 flex flex-col items-center justify-center text-center sm:mt-40'>
         <div
            className='mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full
          border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50'
         >
            <p className='text-sm font-semibold text-gray-700 '>Glyph is now public</p>
         </div>
         <h1 className='lg-text-7xl max-w-4xl text-5xl font-bold md:text-6xl'>
            Chat with your <span className='text-primary'>documents</span> in seconds.
         </h1>
         <p className='my-5 max-w-prose text-zinc-700 sm:text-lg'>
            Glyph allows you to have conversations with any PDF document. Simply upload your file
            and start asking questions right away.
         </p>

         <Link href={'/dashboard'} target='_blank' className={buttonVariants()}>
            Get started <ArrowRight className='ml-2 h-5 w-5' />
         </Link>
      </MaxWidthWrapper>
   );
}
