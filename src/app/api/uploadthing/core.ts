import { db } from '@/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { pinecone } from '@/lib/pineconde';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
const f = createUploadthing();

export const ourFileRouter = {
   pdfUploader: f({ pdf: { maxFileSize: '4MB' } })
      .middleware(async ({ req }) => {
         const { getUser } = getKindeServerSession();
         const user = await getUser();

         if (!user || !user.id) throw new Error('Unauthorized');

         return { userId: user.id };
      })
      .onUploadComplete(async ({ metadata, file }) => {
         const createdFile = await db.file.create({
            data: {
               key: file.key,
               name: file.name,
               userId: metadata.userId,
               url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
               uploadStatus: 'PROCESSING'
            }
         });

         try {
            const response = await fetch(
               `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`
            );
            const blob = await response.blob();

            const loader = new PDFLoader(blob);
            const pageLevelDocs = await loader.load();
            const pagesAmt = pageLevelDocs.length;

            const pineconeIndex = pinecone.Index('glyph');
            const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.OPEN_API_KEY });

            await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
               pineconeIndex,
               namespace: createdFile.id
            });

            await db.file.update({
               data: {
                  uploadStatus: 'SUCCESS'
               },
               where: {
                  id: createdFile.id
               }
            });
         } catch (err) {
            await db.file.update({
               data: {
                  uploadStatus: 'FAILED'
               },
               where: {
                  id: createdFile.id
               }
            });
         }

         console.log('Upload complete for userId:', metadata.userId);

         console.log('file url', file.url);

         return { uploadedBy: metadata.userId };
      })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
