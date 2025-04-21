import prisma from "@/lib/prisma";
import cloudinary from "@/server/utils/cloudinary";
import { Readable } from "stream";

export default defineEventHandler(async (event) => {
	try {
		const formData = await readMultipartFormData(event);
		if (!formData) throw new Error("No form data");

		// Extraction des champs du formData
		const getFieldValue = (fieldName) => {
			const field = formData.find((field) => field.name === fieldName);
			return field ? field.data.toString() : null;
		};

		// Récupération du fichier image
		const imageFile = formData.find((field) => field.name === "image");
		if (!imageFile) throw new Error("No image file");

		// Upload de l'image vers Cloudinary
		const uploadResult = await new Promise((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{ folder: "paintings" },
				(error, result) => {
					if (error) {
						console.error("Erreur d'upload Cloudinary:", error);
						return reject(error);
					}
					resolve(result);
				}
			);

			const readableStream = new Readable();
			readableStream.push(new Uint8Array(imageFile.data));
			readableStream.push(null);

			readableStream.pipe(uploadStream);
		});

		// Récupération et traitement des tags
		const tagsField = formData.find((field) => field.name === "tags");
		let tagArray = [];

		if (tagsField) {
			try {
				tagArray = JSON.parse(tagsField.data.toString());

				if (!Array.isArray(tagArray)) {
					tagArray = [];
					console.error("Les tags fournis ne sont pas un tableau valide");
				}
			} catch (parseError) {
				console.error("Erreur lors du parsing des tags:", parseError);
			}
		}

		// Création de la peinture dans la base de données
		const painting = await prisma.painting.create({
			data: {
				name: getFieldValue("name"),
				description: getFieldValue("description"),
				date: getFieldValue("date")
					? new Date(getFieldValue("date"))
					: new Date(),
				price: parseFloat(getFieldValue("price") || "0"),
				image: uploadResult.secure_url,
				artist: getFieldValue("artist"),
				width: parseFloat(getFieldValue("width") || "0"),
				height: parseFloat(getFieldValue("height") || "0"),
				paintingType: getFieldValue("paintingType"),
				slug: getFieldValue("slug"),
				state: getFieldValue("state"),
				tags: {
					create: tagArray.map((tag) => ({
						tag: tag,
					})),
				},
			},
			include: {
				tags: true,
			},
		});

		return { painting };
	} catch (error) {
		console.error("Erreur détaillée lors de l'ajout de la peinture:", error);

		throw createError({
			statusCode: 500,
			message: `Erreur lors de l'ajout de la peinture: ${error.message}`,
		});
	}
});
