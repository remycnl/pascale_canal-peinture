import { prisma } from "@/lib/prisma";

export default defineEventHandler(async (event) => {
	const method = event.method;

	try {
		switch (method) {
			case "GET":
				const faqs = await prisma.fAQ.findMany({
					orderBy: { order: "asc" },
				});
				return faqs;

			case "POST":
				const newFaqData = await readBody(event);
				const newFaq = await prisma.fAQ.create({
					data: {
						question: newFaqData.question,
						answer: newFaqData.answer,
						order: newFaqData.order,
						isActive: newFaqData.isActive ?? true,
					},
				});
				return newFaq;

			default:
				throw createError({
					statusCode: 405,
					statusMessage: "Method Not Allowed",
				});
		}
	} catch (error) {
		console.error("FAQ API Error:", error);
		throw createError({
			statusCode: 500,
			statusMessage: "Internal Server Error",
		});
	}
});
