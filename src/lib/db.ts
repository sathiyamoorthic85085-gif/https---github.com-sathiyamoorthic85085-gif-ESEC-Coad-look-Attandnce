import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

// Create user
export async function createUser(name: string, email: string) {
  return await prisma.user.create({
    data: { name, email },
  });
}

// Save image + prediction
export async function savePrediction(userId: string, filePath: string, label: string, confidence: number) {
  const image = await prisma.image.create({
    data: { userId, filePath },
  });

  return await prisma.prediction.create({
    data: { imageId: image.id, label, confidence },
  });
}
