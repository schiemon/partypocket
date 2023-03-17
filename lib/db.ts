import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined;
}

const prisma =
    global.prisma ||
    new PrismaClient({
        log: [],
    });

export default prisma;

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// Minimum requirements on the PrismaClient when doing interactive transactions.
// We call such a prisma client "transactional" prisma.
// Used for helper functions that are called withing such an interactive transaction.
export type TransactionablePrisma = Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use"
>;
