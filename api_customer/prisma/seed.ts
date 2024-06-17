import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Create Company
    const company = await prisma.company.create({
        data: {
            companyName: 'Bechtelar LLC'
        }
    });

    // Create Address
    const address = await prisma.address.create({
        data: {
            postalCode: '61432-1180',
            city: 'St. Joseph'
        }
    });

    // Create Profile
    const profile = await prisma.profile.create({
        data: {
            firstName: 'Mitchell',
            lastName: 'Carter'
        }
    });

    // Create Customer
    const customer = await prisma.customer.create({
        data: {
            createdAt: new Date('2023-08-29T16:28:58.454Z'),
            name: 'Jan Schiller',
            username: 'Kailee.Greenholt73',
            firstName: 'Keven',
            lastName: 'Kris',
            address: {
                connect: { id: address.id }
            },
            profile: {
                connect: { id: profile.id }
            },
            company: {
                connect: { id: company.id }
            }
        }
    });

    console.log({ customer });
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