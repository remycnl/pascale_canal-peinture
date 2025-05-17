import prisma from "@/lib/prisma";

export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event);

		// Validation des données
		if (!body.email) {
			return {
				success: false,
				message: "Email requis",
			};
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(body.email)) {
			return {
				success: false,
				message: "Format d'email invalide",
			};
		}

		// Valider le type d'abonnement
		const subscriptionType = body.subscriptionType;
		if (!subscriptionType) {
			return {
				success: false,
				message: "Type d'abonnement invalide",
			};
		}

		// Vérifier si l'email existe déjà
		const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
			where: {
				email: body.email,
			},
		});

		if (existingSubscriber) {
			// Mettre à jour l'abonnement existant
			if (!existingSubscriber.isActive) {
				// Si l'abonnement était désactivé, le réactiver
				await prisma.newsletterSubscriber.update({
					where: {
						id: existingSubscriber.id,
					},
					data: {
						isActive: true,
						subscriptionType,
						updatedAt: new Date(),
					},
				});

				return {
					success: true,
					message: "Votre abonnement a été réactivé avec succès",
				};
			}

			// Mettre à jour le type d'abonnement si différent
			if (existingSubscriber.subscriptionType !== subscriptionType) {
				await prisma.newsletterSubscriber.update({
					where: {
						id: existingSubscriber.id,
					},
					data: {
						subscriptionType,
						updatedAt: new Date(),
					},
				});

				return {
					success: true,
					message: "Vos préférences d'abonnement ont été mises à jour",
				};
			}

			return {
				success: true,
				message: "Vous êtes déjà inscrit à notre newsletter",
			};
		}

		// Générer un jeton de vérification
		const verificationToken =
			Math.random().toString(36).substring(2, 15) +
			Math.random().toString(36).substring(2, 15);

		// Créer un nouvel abonnement
		const newSubscriber = await prisma.newsletterSubscriber.create({
			data: {
				email: body.email,
				subscriptionType,
				verificationToken,
				isVerified: false, // Par défaut, l'email n'est pas vérifié
			},
		});

		// Ici, vous pourriez envoyer un email de vérification
		// sendVerificationEmail(body.email, verificationToken)

		return {
			success: true,
			message:
				"Merci pour votre inscription ! Veuillez vérifier votre email pour confirmer votre abonnement.",
		};
	} catch (error) {
		console.error("Erreur lors de l'inscription à la newsletter:", error);

		return {
			success: false,
			message:
				"Une erreur est survenue lors de l'inscription. Veuillez réessayer plus tard.",
		};
	}
});
