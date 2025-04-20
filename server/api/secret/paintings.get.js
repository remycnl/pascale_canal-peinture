import { prisma } from "@/lib/prisma";

export default defineEventHandler(async (event) => {
	try {
		const paintings = await prisma.painting.findMany({
			orderBy: [
				{
					date: "desc", // Most recent paintings first
				},
			],
		});

		return {
			paintings,
		};
	} catch (error) {
		console.error("Error fetching paintings:", error);
		throw createError({
			statusCode: 500,
			message: "Error fetching paintings",
		});
	}
});
