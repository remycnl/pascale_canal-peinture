// /server/utils/email.js
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";

// Configuration du transporteur SMTP Gmail
const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 587,
	secure: false, // true pour 465, false pour les autres ports
	auth: {
		user: process.env.GMAIL_USER, // votre adresse Gmail
		pass: process.env.GMAIL_APP_PASSWORD, // votre mot de passe d'application
	},
});

const SENDER_EMAIL = process.env.GMAIL_USER;
const NUXT_SITE_URL = process.env.NUXT_SITE_URL;

/**
 * Envoie un email de confirmation d'inscription à la newsletter
 * @param {string} email - Email du destinataire
 * @param {string} subscriptionType - Type d'abonnement
 * @param {string} unsubscribeToken - Token de désabonnement
 */
export async function sendSubscriptionConfirmation(
	email,
	subscriptionType,
	unsubscribeToken
) {
	try {
		const subscriptionTypes = {
			NEW_ARTWORK: "nouvelles œuvres",
			EVENTS: "événements",
			BOTH: "nouvelles œuvres et événements",
		};

		const unsubscribeUrl = `${NUXT_SITE_URL}/newsletter/unsubscribe?token=${unsubscribeToken}`;

		const info = await transporter.sendMail({
			from: `"Pascale Canal" <${SENDER_EMAIL}>`,
			to: email,
			subject: "Confirmation de votre abonnement à ma newsletter",
			html: `
        <div>
          <h2>Merci pour votre abonnement !</h2>
          <p>Vous êtes maintenant inscrit(e) pour recevoir mes informations sur les ${subscriptionTypes[subscriptionType]}.</p>
          <p>Si vous souhaitez vous désabonner, <a href="${unsubscribeUrl}">cliquez ici</a>.</p>
        </div>
      `,
		});

		console.log("Email de confirmation envoyé: %s", info.messageId);
		return { success: true };
	} catch (error) {
		console.error("Erreur lors de l'envoi de l'email de confirmation:", error);
		return {
			success: false,
			error: error.message,
		};
	}
}

/**
 * Envoie un email de contact
 * @param {Object} formData - Données du formulaire de contact
 */
export async function sendContactEmail(formData) {
	try {
		// Formatage des informations du formulaire pour l'email
		const fullName = `${formData.firstName} ${formData.lastName}`.trim();

		// Construction du corps de l'email en HTML
		let htmlContent = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Nouveau message de contact</h2>
      <div style="margin-bottom: 20px; padding: 15px; background-color: #f7f7f7; border-radius: 5px;">
        <p><strong>De:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        ${
					formData.phone
						? `<p><strong>Téléphone:</strong> ${formData.phone}</p>`
						: ""
				}
        <p><strong>Raison du contact:</strong> ${formData.reason}</p>
        ${
					formData.reasonDetails
						? `<p><strong>Détails supplémentaires:</strong> ${formData.reasonDetails}</p>`
						: ""
				}
      </div>
      <div style="margin-bottom: 20px; padding: 15px; background-color: #f7f7f7; border-radius: 5px;">
        <h3>Message:</h3>
        <p>${formData.message.replace(/\n/g, "<br>")}</p>
      </div>`;

		// Ajout des informations sur les œuvres si applicable
		if (
			formData.reason === "artwork" &&
			formData.selectedArtworks &&
			formData.selectedArtworks.length > 0
		) {
			htmlContent += `<div style="margin-bottom: 20px; padding: 15px; background-color: #f7f7f7; border-radius: 5px;">
        <h3>Œuvres sélectionnées:</h3>
        <ul>`;
			formData.selectedArtworks.forEach((artwork) => {
				htmlContent += `<li>${artwork.name || "Sans titre"} ${
					artwork.reference ? `(Réf: ${artwork.reference})` : ""
				}</li>`;
			});
			htmlContent += `</ul></div>`;
		}

		// Clôture de l'email
		htmlContent += `<div style="font-size: 12px; color: #666; margin-top: 30px; padding-top: 10px; border-top: 1px solid #eee;">
      <p>Ce message a été envoyé depuis le formulaire de contact du site web.</p>
      <p>RGPD: Le contact a donné son consentement pour le traitement de ses données.</p>
    </div></div>`;

		// Configuration de base pour l'email
		let mailOptions = {
			from: `"Formulaire de Contact" <${process.env.SENDER_EMAIL}>`,
			to: process.env.CONTACT_EMAIL || process.env.SENDER_EMAIL,
			subject: `Nouveau message de contact: ${formData.reason}`,
			html: htmlContent,
			replyTo: formData.email,
		};

		// Ajout des pièces jointes si présentes
		if (formData.documentBase64 && formData.documentName) {
			mailOptions.attachments = [
				{
					filename: formData.documentName,
					content: Buffer.from(formData.documentBase64.split(",")[1], "base64"),
				},
			];
		}

		// Envoi de l'email
		const info = await transporter.sendMail(mailOptions);
		console.log("Email de contact envoyé: %s", info.messageId);
		return { success: true };
	} catch (error) {
		console.error("Erreur lors de l'envoi de l'email de contact:", error);
		return {
			success: false,
			error: error.message,
		};
	}
}

/**
 * Envoie une newsletter à tous les abonnés actifs selon le type spécifié
 * @param {Object} newsletterData - Données de la newsletter
 * @param {string} newsletterData.subject - Sujet de l'email
 * @param {string} newsletterData.content - Contenu HTML de l'email
 * @param {string} newsletterData.type - Type d'abonnement (NEW_ARTWORK, EVENTS, BOTH)
 */
export async function sendNewsletter(newsletterData) {
	try {
		// Récupérer les abonnés actifs selon le type d'abonnement
		const subscribers = await prisma.newsletterSubscriber.findMany({
			where: {
				isActive: true,
				OR: [
					{ subscriptionType: newsletterData.type },
					{ subscriptionType: "BOTH" },
					// Si type est BOTH, envoyer à tous les abonnés actifs
					...(newsletterData.type === "BOTH"
						? [
								{ subscriptionType: "NEW_ARTWORK" },
								{ subscriptionType: "EVENTS" },
						  ]
						: []),
				],
			},
		});

		if (!subscribers.length) {
			return {
				success: false,
				message: "Aucun abonné correspondant au type sélectionné",
			};
		}

		// Envoyer l'email à chaque abonné
		const emailPromises = subscribers.map((subscriber) => {
			const unsubscribeUrl = `${NUXT_SITE_URL}/newsletter/unsubscribe?token=${subscriber.unsubscribeToken}`;

			return transporter.sendMail({
				from: `"Pascale Canal" <${SENDER_EMAIL}>`,
				to: subscriber.email,
				subject: newsletterData.subject,
				html: `
          ${newsletterData.content}
          <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>Vous recevez cet email car vous êtes abonné à ma newsletter.</p>
            <p>Pour vous désabonner, <a href="${unsubscribeUrl}">cliquez ici</a>.</p>
          </div>
        `,
			});
		});

		await Promise.all(emailPromises);

		return {
			success: true,
			count: subscribers.length,
			message: `La newsletter a été envoyée à ${subscribers.length} abonnés.`,
		};
	} catch (error) {
		console.error("Erreur lors de l'envoi de la newsletter:", error);
		return {
			success: false,
			error: error.message,
		};
	}
}
