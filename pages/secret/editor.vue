<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRuntimeConfig } from "nuxt/app";
const { $initializeSmoothScroll } = useNuxtApp();

// Configuration et variables d'état
const config = useRuntimeConfig();
const secretKey = config.public.NUXT_SECRET_KEY;

// Refs pour les champs du formulaire
const secretKeyInput = ref("");
const isSecretPage = ref(false);
const name = ref("");
const description = ref("");
const artist = ref("");
const width = ref("");
const height = ref("");
const paintingType = ref("");
const price = ref("");
const selectedImage = ref(null);
const tag = ref("");
const slug = ref("");
const state = ref("FOR_SALE");
const paintings = ref([]);
const selectedPainting = ref(null);
const isEditMode = ref(false);

// Fonction pour formater la date
const formatDate = (date) => date.toISOString().split("T")[0];
const date = ref(formatDate(new Date()));

// Fonction pour formater la taille du fichier
const formatFileSize = (bytes) => {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Gestion de l'upload d'image
const handleImageUpload = (event) => {
	const file = event.target.files[0];
	if (file) {
		selectedImage.value = file;
	}
};

// Génération automatique du slug
const generateSlug = () => {
	if (name.value) {
		slug.value = name.value
			.toLowerCase()
			.replace(/[éèê]/g, "e")
			.replace(/[àâ]/g, "a")
			.replace(/[ùû]/g, "u")
			.replace(/[ôö]/g, "o")
			.replace(/[îï]/g, "i")
			.replace(/[ç]/g, "c")
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "");
	}
};

// Fonction pour désactiver le scroll
const disableScroll = () => {
	document.body.style.overflow = "hidden";
	document.body.style.height = "100vh";
};

// Fonction pour réactiver le scroll
const enableScroll = () => {
	document.body.style.overflow = "auto";
	document.body.style.height = "auto";
	if ($initializeSmoothScroll) {
		$initializeSmoothScroll();
	}
};

// Vérification du mot de passe
const checkSecretKey = () => {
	if (secretKeyInput.value === secretKey) {
		isSecretPage.value = true;
		enableScroll();
		loadPaintings();
	} else {
		alert("Mot de passe incorrect");
	}
};

// Gestion du scroll au montage/démontage
onMounted(() => {
	if (!isSecretPage.value) {
		disableScroll();
	} else {
		loadPaintings();
	}
});

onUnmounted(() => {
	enableScroll();
});

const loadPaintings = async () => {
	try {
		const response = await $fetch("/api/secret/paintings");
		paintings.value = response.paintings;
	} catch (error) {
		console.error("Error loading paintings:", error);
		alert("Erreur lors du chargement des peintures");
	}
};

// Sélection d'une peinture pour édition
const selectPaintingForEdit = (painting) => {
	selectedPainting.value = painting;
	name.value = painting.name;
	description.value = painting.description;
	artist.value = painting.artist;
	width.value = painting.width;
	height.value = painting.height;
	paintingType.value = painting.paintingType;
	price.value = painting.price;
	tag.value = painting.tag;
	slug.value = painting.slug;
	state.value = painting.state;
	date.value = formatDate(new Date(painting.date));
	isEditMode.value = true;
};

// Suppression d'une peinture
const deletePainting = async (painting) => {
	if (confirm(`Êtes-vous sûr de vouloir supprimer "${painting.name}" ?`)) {
		try {
			await $fetch(`/api/secret/painting/${painting.id}`, {
				method: "DELETE",
			});
			alert("Peinture supprimée avec succès");
			loadPaintings();
		} catch (error) {
			console.error(error);
			alert("Erreur lors de la suppression de la peinture");
		}
	}
};

// Mise à jour d'une peinture
const updatePainting = async () => {
	try {
		const formData = new FormData();
		formData.append("name", name.value);
		formData.append("description", description.value);
		formData.append("artist", artist.value);
		formData.append("width", width.value);
		formData.append("height", height.value);
		formData.append("paintingType", paintingType.value);
		formData.append("price", price.value);
		if (selectedImage.value) {
			formData.append("image", selectedImage.value);
		}
		formData.append("tag", tag.value);
		formData.append("slug", slug.value);
		formData.append("state", state.value);
		formData.append("date", date.value);

		await $fetch(`/api/secret/painting/${selectedPainting.value.id}`, {
			method: "PUT",
			body: formData,
		});

		alert("Peinture mise à jour avec succès");
		resetForm();
		loadPaintings();
	} catch (error) {
		console.error(error);
		alert("Erreur lors de la mise à jour de la peinture");
	}
};

// Soumission du formulaire
const submitPainting = async () => {
	try {
		if (isEditMode.value) {
			await updatePainting();
		} else {
			const formData = new FormData();
			formData.append("image", selectedImage.value);
			formData.append("name", name.value);
			formData.append("description", description.value);
			formData.append("artist", artist.value);
			formData.append("width", width.value);
			formData.append("height", height.value);
			formData.append("paintingType", paintingType.value);
			formData.append("price", price.value);
			formData.append("tag", tag.value);
			formData.append("slug", slug.value);
			formData.append("state", state.value);
			formData.append("date", date.value);

			await $fetch("/api/secret/add", {
				method: "POST",
				body: formData,
			});

			alert("Peinture ajoutée avec succès");
			resetForm();
			loadPaintings();
		}
	} catch (error) {
		console.error(error);
		alert("Erreur lors de l'opération");
	}
};

// Réinitialisation du formulaire
const resetForm = () => {
	name.value = "";
	description.value = "";
	artist.value = "";
	width.value = "";
	height.value = "";
	paintingType.value = "";
	price.value = "";
	selectedImage.value = null;
	tag.value = "";
	slug.value = "";
	state.value = "FOR_SALE";
	date.value = formatDate(new Date());
	selectedPainting.value = null;
	isEditMode.value = false;
};
</script>

<template>
	<div
		class="relative min-h-screen"
		:class="{ 'overflow-hidden': !isSecretPage }">
		<!-- Page principale du formulaire -->
		<div v-if="isSecretPage" class="container mx-auto px-4 py-8">
			<span
				class="text-[200px] leading-[200px] whitespace-nowrap font-apercuBold">
				Editeur
			</span>
			<div class="flex flex-col lg:flex-row justify-between mt-20 gap-8">
				<!-- Formulaire (côté gauche) -->
				<div class="lg:w-1/2">
					<h1 class="text-3xl font-apercuBold mb-8 text-gray-800">
						{{ isEditMode ? "Modifier la peinture" : "Ajouter une peinture" }}
					</h1>

					<form
						@submit.prevent="submitPainting"
						class="max-w-2xl bg-black p-8 rounded-2xl shadow-lg">
						<div class="grid gap-6">
							<div class="flex gap-8">
								<!-- Nom -->
								<div class="form-group w-1/2">
									<label for="name" class="label">Nom</label>
									<input
										v-model="name"
										@input="generateSlug"
										id="name"
										class="input"
										required />
								</div>

								<!-- Slug (en lecture seule) -->
								<div class="form-group w-1/2">
									<label for="slug" class="label">Slug</label>
									<input
										v-model="slug"
										id="slug"
										class="input bg-gray-100"
										readonly />
								</div>
							</div>

							<!-- Description -->
							<div class="form-group">
								<label for="description" class="label">Description</label>
								<textarea
									v-model="description"
									id="description"
									class="input"
									required></textarea>
							</div>

							<!-- Image Upload Personnalisé -->
							<div class="form-group">
								<label for="image" class="label">Image</label>
								<div class="relative">
									<input
										@change="handleImageUpload"
										type="file"
										id="image"
										accept="image/*"
										class="hidden"
										:required="!isEditMode" />
									<label
										for="image"
										class="cursor-pointer flex items-center justify-center w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
										<span class="mr-2">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
											</svg>
										</span>
										<span class="text-gray-600">
											{{
												selectedImage
													? selectedImage.name
													: isEditMode
													? "Modifier l'image (optionnel)"
													: "Sélectionner une image"
											}}
										</span>
									</label>
								</div>
								<p v-if="selectedImage" class="text-sm text-gray-500 mt-1">
									Taille: {{ formatFileSize(selectedImage.size) }}
								</p>
							</div>

							<div class="flex gap-8">
								<!-- Prix -->
								<div class="form-group w-1/2">
									<label for="price" class="label">Prix (€)</label>
									<div class="relative">
										<input
											v-model="price"
											id="price"
											type="number"
											class="input pl-8"
											required />
									</div>
								</div>
	
								<!-- Artiste -->
								<div class="form-group w-1/2">
									<label for="artist" class="label">Artiste</label>
									<input v-model="artist" id="artist" class="input" required />
								</div>
							</div>

							<!-- Dimensions -->
							<div class="flex gap-8">
								<div class="form-group w-1/2">
									<label for="width" class="label">Largeur (cm)</label>
									<input
										v-model="width"
										id="width"
										type="number"
										class="input"
										required />
								</div>
								<div class="form-group w-1/2">
									<label for="height" class="label">Hauteur (cm)</label>
									<input
										v-model="height"
										id="height"
										type="number"
										class="input"
										required />
								</div>
							</div>

							<!-- Type de peinture -->
							<div class="form-group">
								<label for="paintingType" class="label">Type de peinture</label>
								<input
									v-model="paintingType"
									id="paintingType"
									class="input"
									required />
							</div>

							<!-- Tag -->
							<div class="form-group">
								<label for="tag" class="label">Tag</label>
								<input v-model="tag" id="tag" class="input" required />
							</div>

							<div class="flex gap-8">
								<!-- État -->
								<div class="form-group w-1/2">
									<label for="state" class="label">État</label>
									<select v-model="state" class="input h-full">
										<option value="FOR_SALE">À vendre</option>
										<option value="SOLD">Vendue</option>
									</select>
								</div>
	
								<!-- Date -->
								<div class="form-group w-1/2">
									<label for="date" class="label">Date de création</label>
									<input
										v-model="date"
										id="date"
										type="date"
										class="input"
										required />
								</div>
							</div>
						</div>

						<div class="flex gap-4 mt-8">
							<button
								type="submit"
								class="flex-1 bg-yellow text-black py-3 px-6 rounded-lg hover:bg-yellow/70 transition-all duration-300">
								{{ isEditMode ? "Mettre à jour" : "Ajouter" }}
							</button>
							<button
								v-if="isEditMode"
								type="button"
								@click="resetForm"
								class="bg-grayDark text-white py-3 px-6 rounded-lg hover:bg-grayDark/70 transition-all duration-300">
								Annuler
							</button>
						</div>
					</form>
				</div>

				<!-- Liste des peintures (côté droit) -->
				<div class="lg:w-1/2">
					<h2 class="text-3xl font-apercuBold mb-8 text-gray-800">
						Liste des peintures
					</h2>
					<div
						v-if="paintings.length === 0"
						class="space-y-4 bg-white p-6 rounded-2xl shadow-custom">
						<p class="text-gray-600">
							Aucune peinture n'est disponible pour le moment.
						</p>
					</div>
					<div v-else class="space-y-4 bg-white p-6 rounded-2xl shadow-custom">
						<div
							v-for="painting in paintings"
							:key="painting.id"
							class="bg-gray-50 p-4 rounded-lg hover:scale-101 flex items-center justify-between gap-4 hover:bg-gray-100 transition-all duration-300">
							<div class="flex items-center gap-4">
								<img
									:src="painting.image"
									:alt="painting.name"
									class="w-16 h-16 object-cover rounded-lg" />
								<div>
									<h3 class="font-semibold text-gray-800">
										{{ painting.name }}
									</h3>
									<p class="text-sm text-gray-600">
										{{ painting.price }}€ -
										{{ painting.state === "FOR_SALE" ? "À vendre" : "Vendue" }}
									</p>
									<p class="text-xs text-gray-500">{{ painting.type }}</p>
								</div>
							</div>
							<div class="flex flex-row gap-2">
								<button
									@click="selectPaintingForEdit(painting)"
									class="p-2 w-fit bg-yellow focus:scale-95 text-white text-sm rounded-lg hover:bg-yellow/80 border border-yellow hover:border-black transition-all duration-300">
									<NuxtImg
										src="/svg/edit.svg"
										alt="edit icon for editing painting"
										class="w-7 h-7" />
								</button>
								<button
									@click="deletePainting(painting)"
									class="p-2 w-fit bg-red-400 focus:scale-95 text-white text-sm rounded-lg hover:bg-red-400/80 border border-red-400 hover:border-black transition-all duration-300">
									<NuxtImg
										src="/svg/trash.svg"
										alt="trash icon for deleting painting"
										class="w-7 h-7" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Modal d'authentification -->
		<div v-else class="w-full flex items-center justify-center">
			<div class="bg-black text-white p-8 rounded-2xl shadow-xl max-w-md w-full">
				<h2 class="text-2xl font-apercuBold mb-4">
					Entrez le mot de passe pour accéder à cette page
				</h2>
				<form @submit.prevent="checkSecretKey">
					<div class="mb-4">
						<label for="secretKey" class="sr-only">Mot de passe</label>
						<input
							v-model="secretKeyInput"
							id="secretKey"
							type="password"
							autocomplete="new-password"
							placeholder="Saisir la clé"
							class="input mb-4 text-black"
							required />
					</div>
					<button
						type="submit"
						class="w-full bg-yellow text-black py-2 px-4 rounded-lg hover:bg-yellow/70 transition-all duration-300">
						Valider
					</button>
				</form>
			</div>
		</div>
	</div>
</template>
