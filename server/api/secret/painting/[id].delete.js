import { PrismaClient } from "@prisma/client";
import { unlink } from "fs/promises";
import { join } from "path";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	try {
		const id = event.context.params.id;

		// Get painting to delete
		const painting = await prisma.painting.findUnique({
			where: { id: parseInt(id) },
		});

		if (!painting) {
			throw createError({
				statusCode: 404,
				message: "Painting not found",
			});
		}

		// Delete image file
		const imagePath = join(process.cwd(), "public", painting.image);
		try {
			await unlink(imagePath);
		} catch (error) {
			console.error("Error deleting image file:", error);
		}

		// Delete painting from database
		await prisma.painting.delete({
			where: { id: parseInt(id) },
		});

		return { message: "Painting deleted successfully" };
	} catch (error) {
		console.error("Erreur lors de la suppression de la peinture:", error);
		throw createError({
			statusCode: 500,
			message: "Erreur lors de la suppression de la peinture",
		});
	}
});
