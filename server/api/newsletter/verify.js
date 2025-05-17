import prisma from "@/lib/prisma";

export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event);
		const token = query.token;

		if (!token) {
			return {
				success: false,
				message: "Token de vérification manquant",
			};
		}

		// Rechercher l'abonné avec ce token
		const subscriber = await prisma.newsletterSubscriber.findFirst({
			where: {
				verificationToken: token,
				isActive: true,
			},
		});

		if (!subscriber) {
			return {
				success: false,
				message: "Token de vérification invalide ou expiré",
			};
		}

		// Marquer l'abonnement comme vérifié
		await prisma.newsletterSubscriber.update({
			where: {
				id: subscriber.id,
			},
			data: {
				isVerified: true,
				verificationToken: null, // Effacer le token après vérification
				updatedAt: new Date(),
			},
		});

		return {
			success: true,
			message: "Votre abonnement à la newsletter est maintenant confirmé !",
		};
	} catch (error) {
		console.error("Erreur lors de la vérification de l'email:", error);

		return {
			success: false,
			message:
				"Une erreur est survenue lors de la vérification. Veuillez réessayer plus tard.",
		};
	}
});
