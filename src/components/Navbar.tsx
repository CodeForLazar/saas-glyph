import Link from 'next/link';
import MaxWidthWrapper from './MaxWidthWrapper';
import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/server';
import { buttonVariants } from './ui/button';
import { ArrowRight } from 'lucide-react';

interface NavbarProps {}

const Navbar = ({}: NavbarProps) => {
   return (
      <nav className='sticky inset-x-0 top-0 h-14 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all'>
         <MaxWidthWrapper>
            <div className='flex h-14 items-center justify-between border-b border-zinc-200'>
               <Link href={'/'} className={'z-40 flex font-semibold'}>
                  <span>glyph.</span>
               </Link>

               <div className='hidden items-center space-x-4 sm:flex'>
                  <>
                     <Link
                        href={'/pricing'}
                        className={buttonVariants({
                           variant: 'ghost',
                           size: 'sm'
                        })}
                     >
                        Pricing
                     </Link>
                     <LoginLink
                        className={buttonVariants({
                           variant: 'ghost',
                           size: 'sm'
                        })}
                     >
                        Sing in
                     </LoginLink>
                     <RegisterLink
                        className={buttonVariants({
                           size: 'sm'
                        })}
                     >
                        Get started <ArrowRight className='ml-1.5 h-5 w-5' />
                     </RegisterLink>
                  </>
               </div>
            </div>
         </MaxWidthWrapper>
      </nav>
   );
};

export default Navbar;
