import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.order.deleteMany();

    // Create Order
    const order = await prisma.order.create({
        data: {
            customerId: 1,
            productId: 1,
            amount: 2,
            status: "NO_ACK"
        }
    });

    console.log({ order });
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