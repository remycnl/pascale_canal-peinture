import prisma from "@/lib/prisma";
import cloudinary from "@/server/utils/cloudinary";

export default defineEventHandler(async (event) => {
	const method = event.method;
	const id = Number(getRouterParam(event, "id"));

	if (!id) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid Event ID",
		});
	}

	try {
		switch (method) {
			case "GET":
				const singleEvent = await prisma.event.findUnique({
					where: { id },
				});

				if (!singleEvent) {
					throw createError({
						statusCode: 404,
						statusMessage: "Event not found",
					});
				}

				return singleEvent;

			case "PUT":
				const formData = await readMultipartFormData(event);

				// Get existing event
				const existingEvent = await prisma.event.findUnique({
					where: { id },
				});

				if (!existingEvent) {
					throw createError({
						statusCode: 404,
						statusMessage: "Event not found",
					});
				}

				// Extract fields from formData
				const getFieldValue = (fieldName) => {
					const field = formData.find((f) => f.name === fieldName);
					return field ? field.data.toString() : null;
				};

				// Handle image update if provided
				let imageUrl = existingEvent.imageUrl;
				const imageFile = formData.find((f) => f.name === "imageUrl");

				if (imageFile) {
					// Delete old image from Cloudinary if it exists
					if (
						existingEvent.imageUrl &&
						existingEvent.imageUrl.includes("cloudinary.com")
					) {
						try {
							const urlParts = existingEvent.imageUrl.split("/");
							const filenameWithExtension = urlParts[urlParts.length - 1];
							const filename = filenameWithExtension.split(".")[0];
							const folderName = urlParts[urlParts.length - 2];
							const publicId = `${folderName}/${filename}`;

							await cloudinary.uploader.destroy(publicId);
						} catch (error) {
							console.error(
								"Error deleting previous image from Cloudinary:",
								error
							);
						}
					}

					// Upload new image to Cloudinary
					try {
						const base64Image = `data:${imageFile.type};base64,${Buffer.from(
							imageFile.data
						).toString("base64")}`;

						const uploadResult = await cloudinary.uploader.upload(base64Image, {
							folder: "events",
						});

						imageUrl = uploadResult.secure_url;
					} catch (uploadError) {
						console.error("Error uploading image to Cloudinary:", uploadError);
						throw new Error(`Upload error: ${uploadError.message}`);
					}
				}

				// Update event in database
				const updatedEvent = await prisma.event.update({
					where: { id },
					data: {
						title: getFieldValue("title") || existingEvent.title,
						description:
							getFieldValue("description") || existingEvent.description,
						location: getFieldValue("location") || existingEvent.location,
						price: getFieldValue("price")
							? parseFloat(getFieldValue("price"))
							: existingEvent.price,
						startDate: getFieldValue("startDate")
							? new Date(getFieldValue("startDate"))
							: existingEvent.startDate,
						endDate: getFieldValue("endDate")
							? new Date(getFieldValue("endDate"))
							: existingEvent.endDate,
						imageUrl: imageUrl,
						isActive: getFieldValue("isActive")
							? getFieldValue("isActive") === "true"
							: existingEvent.isActive,
					},
				});

				return updatedEvent;

			case "DELETE":
				// Get event before deletion to access imageUrl
				const eventToDelete = await prisma.event.findUnique({
					where: { id },
				});

				if (
					eventToDelete &&
					eventToDelete.imageUrl &&
					eventToDelete.imageUrl.includes("cloudinary.com")
				) {
					try {
						const urlParts = eventToDelete.imageUrl.split("/");
						const filenameWithExtension = urlParts[urlParts.length - 1];
						const filename = filenameWithExtension.split(".")[0];
						const folderName = urlParts[urlParts.length - 2];
						const publicId = `${folderName}/${filename}`;

						await cloudinary.uploader.destroy(publicId);
					} catch (error) {
						console.error("Error deleting image from Cloudinary:", error);
					}
				}

				const deletedEvent = await prisma.event.delete({
					where: { id },
				});

				return deletedEvent;

			default:
				throw createError({
					statusCode: 405,
					statusMessage: "Method Not Allowed",
				});
		}
	} catch (error) {
		console.error("Event API Error:", error);

		if (error.code === "P2025") {
			throw createError({
				statusCode: 404,
				statusMessage: "Event not found",
			});
		}

		throw createError({
			statusCode: 500,
			statusMessage: `Internal Server Error: ${error.message}`,
		});
	}
});
