import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "~/prisma/generated/client";

const prismaClientSingleton = () => {
	const pool = new PrismaPg({ connectionString: process.env.NEON_DATABASE_URL! });
	return new PrismaClient({ adapter: pool });
};

declare const globalThis: {
	prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
