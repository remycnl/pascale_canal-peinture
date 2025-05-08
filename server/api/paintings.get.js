import prisma from "@/lib/prisma";

export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event);
		const page = parseInt(query.page) || 1;
		const limit = parseInt(query.limit) || 9;
		const skip = (page - 1) * limit;

		// Filtres
		const forSale = query.forSale === "true";
		const tags = query.tags ? query.tags.split(",") : [];
		const search = query.search || "";

		// Construction de la requête
		const whereClause = {};

		// Filtre pour disponibilité à la vente
		if (forSale) {
			whereClause.state = { not: "OFF_SALE" };
		}

		// Filtre pour les tags
		if (tags.length > 0) {
			whereClause.tags = {
				some: {
					tag: {
						in: tags,
					},
				},
			};
		}

		// Filtre pour la recherche
		if (search) {
			whereClause.OR = [
				{ name: { contains: search, mode: "insensitive" } },
				{ description: { contains: search, mode: "insensitive" } },
			];
		}

		// Obtenir le nombre total d'éléments pour la pagination
		const totalCount = await prisma.painting.count({
			where: whereClause,
		});

		// Obtenir le nombre total de peintures dans la base de données (sans filtres)
		const totalInDb = await prisma.painting.count();

		// Récupérer les peintures filtrées
		const paintings = await prisma.painting.findMany({
			where: whereClause,
			skip,
			take: limit,
			include: {
				tags: true,
			},
			orderBy: {
				date: "desc",
			},
		});

		// Renvoyer à la fois les peintures et les méta-informations de pagination
		return {
			paintings: paintings || [],
			meta: {
				totalCount,
				totalInDb,
				page,
				limit,
				totalPages: Math.ceil(totalCount / limit),
			},
		};
	} catch (error) {
		console.error("API Error:", error);
		throw createError({
			statusCode: 500,
			message: "Erreur lors de la récupération des peintures",
			stack: error.stack,
		});
	}
});
