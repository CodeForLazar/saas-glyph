'use client';
import { ChevronDown, ChevronUp, Loader2, Search } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useToast } from './ui/use-toast';
import { useResizeDetector } from 'react-resize-detector';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PdfRendererProps {
   url: string;
}

const PdfRenderer = ({ url }: PdfRendererProps) => {
   const [numPages, setNumPages] = useState<number>();
   const [currPages, setCurrPages] = useState(1);
   const [scale, setScale] = useState(1);

   const { toast } = useToast();
   const { width, ref } = useResizeDetector();
   const CustomPageValidator = z.object({
      page: z.string().refine((num) => Number(num) > 0 && Number(num) <= numPages!)
   });
   type TCustomPageValidator = z.infer<typeof CustomPageValidator>;

   const {
      register,
      handleSubmit,
      formState: { errors },
      setValue
   } = useForm<TCustomPageValidator>({
      defaultValues: {
         page: '1'
      },
      resolver: zodResolver(CustomPageValidator)
   });

   const handlePageSubmit = (page: TCustomPageValidator) => {
      setCurrPages(Number(page));
      setValue('page', String(page));
   };

   return (
      <div className='flex w-full flex-col items-center rounded-md bg-white shadow'>
         <div className='flex h-14 w-full items-center justify-between border-b border-zinc-200 px-2'>
            <div className='flex items-center gap-1.5'>
               <Button
                  aria-label='previous-page'
                  variant={'ghost'}
                  disabled={currPages <= 1}
                  onClick={() =>
                     setCurrPages((prevState) => (prevState - 1 > 1 ? prevState - 1 : 1))
                  }
               >
                  <ChevronDown className='h-w h-4' />
               </Button>

               <div className='flex items-center gap-1.5'>
                  <Input
                     {...register('page')}
                     className={cn('h-8 w-12', errors.page && 'focus-visible:ring-red-500')}
                     onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                           handleSubmit(handlePageSubmit)();
                        }
                     }}
                  />
                  <p className='space-x-1 text-sm text-zinc-700'>
                     <span>/</span>
                     <span>{numPages ?? 'x'}</span>
                  </p>
               </div>
               <Button
                  aria-label='next-page'
                  variant={'ghost'}
                  disabled={numPages === undefined || currPages === numPages}
                  onClick={() =>
                     setCurrPages((prevState) =>
                        prevState + 1 > numPages! ? numPages! : prevState + 1
                     )
                  }
               >
                  <ChevronUp className='h-w h-4' />
               </Button>
            </div>
            <div className='space-x-2'>
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button className='gap-1.5' variant={'ghost'}>
                        <Search className='h-4 w-4' />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                     <DropdownMenuItem>100%</DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </div>
         <div className='max-h-screen w-full flex-1'>
            <div ref={ref}>
               <Document
                  loading={
                     <div className='flex justify-center'>
                        <Loader2 className='my-24 h-6 w-6 animate-spin' />
                     </div>
                  }
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  onLoadError={() => {
                     toast({
                        title: 'Error loading PDF',
                        description: 'Please try again later',
                        variant: 'destructive'
                     });
                  }}
                  className='max-h-full'
                  file={url}
               >
                  <Page width={width ? width : 1} pageNumber={currPages} />
               </Document>
            </div>
         </div>
      </div>
   );
};

export default PdfRenderer;
