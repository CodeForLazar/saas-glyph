import {getKindeServerSession} from '@kinde-oss/kinde-auth-nextjs/server';
import {publicProcedure, router, privateProcedure} from './trpc';
import {TRPCError} from '@trpc/server';
import {db} from '@/db';

export const appRouter = router({
   authCallback: publicProcedure.query(async () => {
      try {
         const {getUser} = getKindeServerSession();
         const user = await getUser();

         if (!user?.id || !user?.email) {
            throw new TRPCError({code: 'UNAUTHORIZED'});
         }

         const dbUser = await db.user.findFirst({
            where: {
               id: user.id,
            },
         });

         if (!dbUser) {
            await db.user.create({
               data: {
                  id: user.id,
                  email: user.email,
               },
            });
         }
      } catch (err) {
         throw err;
      }
   }),

   getUserFiles: privateProcedure.query(async({ctx}) => {
      const {user, userId} = ctx;
      const id = user.id
      return await db.file.findMany({
         where: {
            userId
         }
      })
   }),
});
export type AppRouter = typeof appRouter;
