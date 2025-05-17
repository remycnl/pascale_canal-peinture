// /server/api/newsletter/send.js
import { sendNewsletter } from "@/server/utils/mail";

export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event);

		// Validation des données
		if (!body.subject) {
			return {
				success: false,
				message: "Le sujet est requis",
			};
		}

		if (!body.content) {
			return {
				success: false,
				message: "Le contenu est requis",
			};
		}

		if (!["NEW_ARTWORK", "EVENTS", "BOTH"].includes(body.type)) {
			return {
				success: false,
				message: "Type d'abonnement invalide",
			};
		}

		// Envoi de la newsletter
		const result = await sendNewsletter({
			subject: body.subject,
			content: body.content,
			type: body.type,
		});

		return result;
	} catch (error) {
		console.error("Erreur lors de l'envoi de la newsletter:", error);

		return {
			success: false,
			message: "Une erreur est survenue lors de l'envoi de la newsletter",
		};
	}
});
