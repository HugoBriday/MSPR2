import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.product.deleteMany();

    // Create product
    const product = await prisma.product.create({
        data: {
            name: "good coffee",
            amount: 100,
        }
    });

    console.log({ product });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        // close Prisma Client at the end
        await prisma.$disconnect();
    });