// server/api/secret/painting.post.js
import { PrismaClient } from "@prisma/client";
import { writeFile } from "fs/promises";
import { join } from "path";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	try {
		// Récupération des données multipart
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

		// Création du nom de fichier unique
		const fileExtension = imageFile.filename.split(".").pop();
		const uniqueFileName = `${Date.now()}-${Math.random()
			.toString(36)
			.substring(7)}.${fileExtension}`;
		const relativePath = `/paintings/${uniqueFileName}`;
		const absolutePath = join(
			process.cwd(),
			"public",
			"paintings",
			uniqueFileName
		);

		// Écriture du fichier
		await writeFile(absolutePath, imageFile.data);

		// Création de la peinture dans la base de données
		const painting = await prisma.painting.create({
			data: {
				name: getFieldValue("name"),
				price: parseFloat(getFieldValue("price")),
				image: relativePath,
				type: getFieldValue("type"),
				slug: getFieldValue("slug"),
				state: getFieldValue("state"),
				date: getFieldValue("date")
					? new Date(getFieldValue("date"))
					: new Date(),
			},
		});

		return { painting };
	} catch (error) {
		console.error("Erreur lors de l'ajout de la peinture:", error);

		throw createError({
			statusCode: 500,
			message: "Erreur lors de l'ajout de la peinture",
		});
	}
});
