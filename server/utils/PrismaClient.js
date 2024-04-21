import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

/*
If you are deploying to an Edge runtime (like Cloudflare Workers, Vercel Edge Functions, Deno Deploy, or Netlify Edge Functions), use our Edge client instead
import { PrismaClient } from '@prisma/client/edge'
*/

//SingleTon design pattern

let prismaInstance = null;
//  new PrismaClient();

function getPrismaInstance() {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient().$extends(withAccelerate());
  }
  return prismaInstance;
}

export default getPrismaInstance;

// (async () => {
//   try {
//     console.log(await prisma.widget.create({ data: {} }));
//   } catch (err) {
//     console.error("error executing query:", err);
//   } finally {
//     prisma.$disconnect();
//   }
// })();
