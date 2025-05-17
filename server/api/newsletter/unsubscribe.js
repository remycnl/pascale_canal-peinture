// /server/api/newsletter/unsubscribe.js
import prisma from "@/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const token = query.token;

    if (!token) {
      return {
        success: false,
        message: "Token de désinscription manquant",
      };
    }

    // Rechercher l'abonnement correspondant au token
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: {
        unsubscribeToken: token,
      },
    });

    if (!subscriber) {
      return {
        success: false,
        message: "Token de désinscription invalide",
      };
    }

    // Si l'abonné est déjà désactivé
    if (!subscriber.isActive) {
      return {
        success: true,
        message: "Vous êtes déjà désabonné de notre newsletter",
      };
    }

    // Mettre à jour l'abonnement pour le désactiver
    await prisma.newsletterSubscriber.update({
      where: {
        id: subscriber.id,
      },
      data: {
        isActive: false,
        unsubscribedAt: new Date(),
      },
    });

    return {
      success: true,
      message: "Vous avez été désabonné avec succès de notre newsletter",
    };
  } catch (error) {
    console.error("Erreur lors de la désinscription:", error);

    return {
      success: false,
      message:
        "Une erreur est survenue lors de la désinscription. Veuillez réessayer plus tard.",
    };
  }
});