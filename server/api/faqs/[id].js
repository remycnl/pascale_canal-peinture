import { prisma } from "@/lib/prisma";

export default defineEventHandler(async (event) => {
	const method = event.method;
	const id = Number(getRouterParam(event, "id"));

	if (!id) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid FAQ ID",
		});
	}

	try {
		switch (method) {
			case "PUT":
				const updateData = await readBody(event);
				const updatedFaq = await prisma.fAQ.update({
					where: { id },
					data: {
						question: updateData.question,
						answer: updateData.answer,
						order: updateData.order,
						isActive: updateData.isActive,
					},
				});
				return updatedFaq;

			case "DELETE":
				const deletedFaq = await prisma.fAQ.delete({
					where: { id },
				});
				return deletedFaq;

			default:
				throw createError({
					statusCode: 405,
					statusMessage: "Method Not Allowed",
				});
		}
	} catch (error) {
		console.error("FAQ Update/Delete API Error:", error);
		throw createError({
			statusCode: 500,
			statusMessage: "Internal Server Error",
		});
	}
});
