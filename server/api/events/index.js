import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export default defineEventHandler(async (event) => {
	const method = event.method;

	try {
		if (method === "GET") {
			const query = getQuery(event);

			const where = {};

			if (query.isActive !== undefined) {
				where.isActive = query.isActive === "true";
			}

			if (query.fromDate) {
				where.startDate = {
					gte: new Date(query.fromDate),
				};
			}

			if (query.toDate) {
				where.startDate = {
					...(where.startDate || {}),
					lte: new Date(query.toDate),
				};
			}

			const events = await prisma.event.findMany({
				where,
				orderBy: {
					startDate: "asc",
				},
			});

			return events;
		}

		if (method === "POST") {
			const body = await readBody(event);

			const eventData = {
				title: body.title || "",
				description: body.description || "",
				startDate:
					typeof body.startDate === "string"
						? new Date(body.startDate)
						: body.startDate || new Date(),
				showStartTime:
					body.showStartTime !== undefined ? body.showStartTime : true,
				endDate:
					typeof body.endDate === "string"
						? new Date(body.endDate)
						: body.endDate || null,
				showEndTime: body.showEndTime !== undefined ? body.showEndTime : true,
				location: body.location || "",
				url: body.url || "",
				price:
					body.price !== undefined && body.price !== null
						? new Prisma.Decimal(body.price)
						: null,
				isActive: body.isActive !== undefined ? body.isActive : true,
				imageUrl: body.imageUrl || null,
			};

			const newEvent = await prisma.event.create({
				data: eventData,
			});

			return newEvent;
		}

		throw createError({
			statusCode: 405,
			statusMessage: "Method Not Allowed",
		});
	} catch (error) {
		console.error("API Error:", error);
		throw createError({
			statusCode: 500,
			statusMessage: "Internal Server Error",
			cause: error,
		});
	}
});
