import prisma from "@/lib/prisma";
import { sendSubscriptionConfirmation } from "@/server/utils/mail";

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

                // Envoyer un email de confirmation de réactivation
                await sendSubscriptionConfirmation(
                    body.email, 
                    subscriptionType, 
                    existingSubscriber.unsubscribeToken
                );

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

                // Envoyer un email de confirmation de mise à jour
                await sendSubscriptionConfirmation(
                    body.email, 
                    subscriptionType, 
                    existingSubscriber.unsubscribeToken
                );

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

        // Générer un token de désinscription
        const unsubscribeToken = 
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);

        // Créer un nouvel abonnement
        await prisma.newsletterSubscriber.create({
            data: {
                email: body.email,
                subscriptionType,
                unsubscribeToken,
            },
        });

        // Envoyer un email de confirmation
        await sendSubscriptionConfirmation(
            body.email, 
            subscriptionType, 
            unsubscribeToken
        );

        return {
            success: true,
            message: "Merci pour votre inscription à notre newsletter!",
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