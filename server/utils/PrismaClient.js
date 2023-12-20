import { PrismaClient } from "@prisma/client";


//SingleTon design pattern

let prismaInstance = null;
//  new PrismaClient();

function getPrismaInstance() {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient();
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
