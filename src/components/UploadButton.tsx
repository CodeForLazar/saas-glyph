'use client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import Dropzone from 'react-dropzone';
import { Cloud, File, Loader2 } from 'lucide-react';
import { Progress } from './ui/progress';
import { useUploadThing } from '@/lib/uploadthing';
import { useToast } from './ui/use-toast';
import { trpc } from '@/app/_trpc/client';
import { useRouter } from 'next/navigation';

const UploadDropzone = () => {
   const router = useRouter();
   const [isUploading, setIsUploading] = useState(false);
   const [uploadProgress, setUploadProgress] = useState(0);

   const { toast } = useToast();
   const { startUpload } = useUploadThing('pdfUploader');

   const { mutate: startPoling } = trpc.getFile.useMutation({
      onSuccess: (file) => {
         router.push(`/dashboard/${file.id}`);
      },
      retry: true,
      retryDelay: 500
   });

   const startSimulatedProgress = () => {
      setUploadProgress(0);
      const interval = setInterval(() => {
         setUploadProgress((prevState) => {
            if (prevState >= 95) {
               clearInterval(interval);
               return prevState;
            }
            return prevState + 5;
         });
      }, 500);
      return interval;
   };

   return (
      <Dropzone
         multiple={false}
         onDrop={async (acceptedFile) => {
            setIsUploading(true);
            const progressInterval = startSimulatedProgress();

            const res = await startUpload(acceptedFile);

            if (!res) {
               return toast({
                  title: 'Something went wrong',
                  description: 'Please try again',
                  variant: 'destructive'
               });
            }

            const [fileResponse] = res;

            const key = fileResponse?.key;

            if (!key) {
               return toast({
                  title: 'Something went wrong',
                  description: 'Please try again',
                  variant: 'destructive'
               });
            }

            clearInterval(progressInterval);
            setUploadProgress(100);
            startPoling({ key });
         }}
      >
         {({ getRootProps, getInputProps, acceptedFiles }) => (
            <div
               {...getRootProps()}
               className='m-4 h-64 rounded-lg border border-dashed border-gray-300'
            >
               <div className='flex h-full w-full items-center justify-center'>
                  <label
                     htmlFor='dropzone-file'
                     className='flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100'
                  >
                     <div className='flex flex-col items-center justify-center pb-6 pt-5'>
                        <Cloud className='mb-2 h-6 w-6 text-zinc-500' />
                        <p className='mb-2 text-sm text-zinc-700'>
                           <span className='font-semibold'>Click to upload</span> or drag and drop
                        </p>
                        <p className='text-xs text-zinc-500'>PDF (up to 4MB)</p>
                     </div>
                     {!!acceptedFiles && !!acceptedFiles[0] && (
                        <div className='flex max-w-xs items-center divide-x divide-zinc-200 overflow-hidden rounded-md bg-white outline outline-[1px] outline-zinc-200'>
                           <div className='place-items-centre grid h-full px-3 py-2'>
                              <File className='h-4 w-4 text-primary' />
                           </div>
                           <div className='h-full truncate px-3 py-2 text-sm'>
                              {acceptedFiles[0].name}
                           </div>
                        </div>
                     )}

                     {isUploading && (
                        <div className='mx-auto mt-4 w-full max-w-xs'>
                           <Progress value={uploadProgress} className='h-1 w-full bg-zinc-200' />
                           {uploadProgress === 100 && (
                              <div className='flex items-center justify-center gap-1 pt-2 text-center text-sm text-zinc-700'>
                                 <Loader2 className='h-3 w-3 animate-spin' />
                              </div>
                           )}
                        </div>
                     )}

                     <input {...getInputProps} type='file' id='dropzone-file' className='hidden' />
                  </label>
               </div>
            </div>
         )}
      </Dropzone>
   );
};

interface UploadButtonProps {}

const UploadButton = ({}: UploadButtonProps) => {
   const [isOpen, setIsOpen] = useState(false);

   return (
      <Dialog
         open={isOpen}
         onOpenChange={(v) => {
            if (!v) {
               setIsOpen(v);
            }
         }}
      >
         <DialogTrigger onClick={() => setIsOpen(true)} asChild>
            <Button>Upload PDF</Button>
         </DialogTrigger>
         <DialogContent>
            <UploadDropzone />
         </DialogContent>
      </Dialog>
   );
};

export default UploadButton;
