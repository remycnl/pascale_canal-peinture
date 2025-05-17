import prisma from "@/lib/prisma";

export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event);

		// Pagination
		const page = parseInt(query.page) || 1;
		const pageSize = parseInt(query.pageSize) || 10;
		const skip = (page - 1) * pageSize;

		// Filtres
		const filters = {};

		if (query.subscriptionType) {
			filters.subscriptionType = query.subscriptionType;
		}

		if (query.isActive !== undefined && query.isActive !== "") {
			filters.isActive = query.isActive === "true";
		}

		if (query.search) {
			filters.email = {
				contains: query.search,
				mode: "insensitive",
			};
		}

		// Compter le nombre total d'abonnés
		const total = await prisma.newsletterSubscriber.count({
			where: filters,
		});

		// Récupérer les abonnés avec pagination
		const subscribers = await prisma.newsletterSubscriber.findMany({
			where: filters,
			orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
			skip,
			take: pageSize,
		});

		return {
			success: true,
			subscribers,
			total,
			page,
			pageSize,
			totalPages: Math.ceil(total / pageSize),
		};
	} catch (error) {
		console.error("Erreur lors de la récupération des abonnés:", error);

		return {
			success: false,
			message: "Une erreur est survenue lors de la récupération des abonnés",
		};
	}
});
