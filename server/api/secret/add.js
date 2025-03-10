import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";
import { join } from "path";

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
				description: getFieldValue("description"),
				date: getFieldValue("date") ? new Date(getFieldValue("date")) : new Date(),
				price: parseFloat(getFieldValue("price")),
				image: relativePath,
				artist: getFieldValue("artist"),
				width: parseFloat(getFieldValue("width")),
				height: parseFloat(getFieldValue("height")),
				paintingType: getFieldValue("paintingType"),
				tag: getFieldValue("tag"),
				slug: getFieldValue("slug"),
				state: getFieldValue("state"),
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
