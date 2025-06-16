<script setup>
import { ref, onMounted, computed, watchEffect } from "vue";
import { useRuntimeConfig } from "nuxt/app";
import { usePageTitle } from "@/composables/usePageTitle";

const config = useRuntimeConfig();
const secretKey = config.public.NUXT_SECRET_KEY;
const baseUrl = config.public.siteUrl;
const siteName = config.public.siteName;

const { setPageTitle } = usePageTitle();

const secretKeyInput = ref("");
const showPassword = ref(false);
const isSecretPage = ref(false);
const name = ref("");
const description = ref("");
const artist = ref("");
const width = ref("");
const height = ref("");
const paintingType = ref("");
const price = ref("");
const selectedImage = ref(null);
const selectedTags = ref([]);
const slug = ref("");
const state = ref("FOR_SALE");
const paintings = ref([]);
const selectedPainting = ref(null);
const isEditMode = ref(false);
const isSelectOpen = ref(false);
const searchQuery = ref("");

const availableTags = [
	{ value: "ANIMAL", label: "Animal" },
	{ value: "PERSONNAGE", label: "Personnage" },
	{ value: "PAYSAGE", label: "Paysage" },
	{ value: "COMMANDE_PERSONNALISEE", label: "Commande personnalisée" },
];

const normalizeString = (str) => {
	return str
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.trim();
};

const filteredPaintings = computed(() => {
	const query = normalizeString(searchQuery.value);
	return [...(paintings.value || [])].filter(
		(painting) =>
			normalizeString(painting.name).includes(query) ||
			normalizeString(painting.artist).includes(query) ||
			normalizeString(painting.price.toString()).includes(query)
	);
});

const formatDate = (date) => date.toISOString().split("T")[0];
const date = ref(formatDate(new Date()));

const formatFileSize = (bytes) => {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const handleImageUpload = (event) => {
	const file = event.target.files[0];
	if (file) {
		selectedImage.value = file;
	}
};

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

const checkSecretKey = () => {
	if (secretKeyInput.value === secretKey) {
		isSecretPage.value = true;
		loadPaintings();
	} else {
		alert("Mot de passe incorrect");
	}
};

watchEffect(() => {
	if (isSecretPage.value) {
		setPageTitle("Éditeur | " + siteName);
	} else {
		setPageTitle("Accès restreint | " + siteName);
	}
});

onMounted(() => {
	if (isSecretPage.value) {
		loadPaintings();
	}
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

const selectPaintingForEdit = (painting) => {
	selectedPainting.value = painting;
	name.value = painting.name;
	description.value = painting.description || "";
	selectedImage.value = null;
	artist.value = painting.artist;
	width.value = painting.width;
	height.value = painting.height;
	paintingType.value = painting.paintingType;
	price.value = painting.price;
	selectedTags.value =
		painting.tags && painting.tags.length
			? painting.tags.map((tagObj) =>
					typeof tagObj === "object" ? tagObj.tag : tagObj
				)
			: [];
	slug.value = painting.slug;
	state.value = painting.state;
	date.value = formatDate(new Date(painting.date));
	isEditMode.value = true;
	isSelectOpen.value = false;
};

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

const updatePainting = async () => {
	try {
		if (!selectedTags.value.length) {
			alert("Veuillez sélectionner au moins un tag.");
			return;
		}

		const formData = new FormData();
		formData.append("name", name.value);
		// Assurer que la description est toujours passée, même si vide
		formData.append("description", description.value);
		formData.append("artist", artist.value);
		formData.append("width", width.value);
		formData.append("height", height.value);
		formData.append("paintingType", paintingType.value);
		formData.append("price", price.value);
		if (selectedImage.value) {
			formData.append("image", selectedImage.value);
		}
		formData.append("tags", JSON.stringify(selectedTags.value));
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

const submitPainting = async () => {
	try {
		if (!selectedTags.value.length) {
			alert("Veuillez sélectionner au moins un tag.");
			return;
		}

		if (isEditMode.value) {
			await updatePainting();
		} else {
			const formData = new FormData();
			formData.append("image", selectedImage.value);
			formData.append("name", name.value);
			// Assurer que la description est toujours passée, même si vide
			formData.append("description", description.value);
			formData.append("artist", artist.value);
			formData.append("width", width.value);
			formData.append("height", height.value);
			formData.append("paintingType", paintingType.value);
			formData.append("price", price.value);
			formData.append("tags", JSON.stringify(selectedTags.value));
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
		alert(
			`Erreur lors de ${
				isEditMode.value ? "la mise à jour" : "l'ajout"
			} de la peinture`
		);
	}
};

const resetForm = () => {
	name.value = "";
	description.value = "";
	artist.value = "";
	width.value = "";
	height.value = "";
	paintingType.value = "";
	price.value = "";
	selectedImage.value = null;
	selectedTags.value = [];
	slug.value = "";
	state.value = "FOR_SALE";
	date.value = formatDate(new Date());
	selectedPainting.value = null;
	isEditMode.value = false;
};

const toggleTag = (tagValue) => {
	if (selectedTags.value.includes(tagValue)) {
		selectedTags.value = selectedTags.value.filter((t) => t !== tagValue);
	} else {
		selectedTags.value.push(tagValue);
	}
};

useSeoMeta({
	title: () => `Éditeur | ${siteName}`,
	description:
		"Panneau d'administration pour gérer les peintures et les FAQs du site de Pascale Canal.",
	ogTitle: () => `Éditeur | ${siteName}`,
	ogDescription:
		"Panneau d'administration pour gérer les peintures et les FAQs du site de Pascale Canal.",
	ogUrl: () => `${baseUrl}/secret/editor`,
	twitterTitle: () => `Éditeur | ${siteName}`,
	twitterDescription:
		"Panneau d'administration pour gérer les peintures et les FAQs du site de Pascale Canal.",
	twitterUrl: () => `${baseUrl}/secret/editor`,
});
</script>

<template>
	<div class="relative">
		<!-- Page principale du formulaire -->
		<div v-if="isSecretPage" class="py-8">
			<h1
				class="flex flex-col text-4xl sm:text-5xl md:text-7xl lg:text-8xl 2xl:text-[180px] leading-tight 2xl:leading-[180px] font-apercuBold text-center w-full mb-16">
				Editeur
			</h1>
			<div
				class="flex flex-col lg:flex-row justify-center items-start gap-20 max-w-7xl mt-20 md:mt-40 mx-auto">
				<!-- Formulaire (côté gauche) -->
				<div class="lg:w-1/2 w-full">
					<h2
						class="text-lg md:text-xl lg:text-3xl font-apercuBold mb-8 text-gray-800 text-center">
						{{ isEditMode ? "Modifier la peinture" : "Ajouter une peinture" }}
					</h2>

					<form
						@submit.prevent="submitPainting"
						class="bg-black p-3 md:p-8 rounded-2xl shadow-lg mx-auto">
						<div class="grid gap-3 md:gap-6">
							<div class="flex gap-3 md:gap-8">
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
										class="input cursor-not-allowed"
										readonly />
								</div>
							</div>

							<!-- Description -->
							<div class="form-group">
								<label for="description" class="label">Description</label>
								<textarea
									v-model="description"
									id="description"
									class="input"></textarea>
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

							<div class="flex gap-3 md:gap-8">
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
							<div class="flex gap-3 md:gap-8">
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

							<!-- Technique de peinture -->
							<div class="form-group">
								<label for="paintingType" class="label">Technique de peinture</label>
								<input
									v-model="paintingType"
									id="paintingType"
									class="input"
									required />
							</div>

							<!-- Tags - Multiple selection -->
							<div class="form-group">
								<label class="label">Tags</label>
								<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
									<button
										v-for="tag in availableTags"
										:key="tag.value"
										type="button"
										@click="toggleTag(tag.value)"
										class="px-4 py-2 font-apercuMedium whitespace-nowrap rounded-lg text-sm transition-all active:scale-97 duration-200"
										:class="
											selectedTags.includes(tag.value)
												? 'bg-yellow text-black border border-yellow'
												: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
										">
										{{ tag.label }}
									</button>
								</div>
							</div>

							<div class="flex gap-3 md:gap-8">
								<!-- État -->
								<div class="relative form-group w-1/2">
									<label for="state" class="label">État</label>
									<select
										v-model="state"
										@focus="isSelectOpen = true"
										@blur="isSelectOpen = false"
										class="cursor-pointer input h-full appearance-none">
										<option class="bg-white text-black" value="FOR_SALE">
											À vendre
										</option>
										<option class="bg-white text-black" value="OFF_SALE">
											Hors vente
										</option>
									</select>
									<svg
										class="absolute top-10 right-4 w-4 h-4 text-black transform transition-transform origin-center duration-300"
										:class="{ 'rotate-180': isSelectOpen }"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 9l-7 7-7-7" />
									</svg>
								</div>

								<!-- Date -->
								<div class="form-group w-1/2">
									<label for="date" class="label">Date de création</label>
									<input
										v-model="date"
										id="date"
										type="date"
										class="input cursor-pointer"
										@click="$event.target.showPicker()"
										required />
								</div>
							</div>
						</div>

						<div class="flex gap-4 mt-8">
							<button
								type="submit"
								class="flex-1 bg-yellow text-black py-3 px-6 rounded-lg hover:bg-yellow/70 transition-all active:scale-99 duration-200">
								{{ isEditMode ? "Mettre à jour" : "Ajouter" }}
							</button>
							<button
								v-if="isEditMode"
								type="button"
								@click="resetForm"
								class="bg-grayDark text-white py-3 px-6 rounded-lg hover:bg-grayDark/70 transition-all active:scale-98 duration-200">
								Annuler
							</button>
						</div>
					</form>
				</div>

				<!-- Liste des peintures (côté droit) -->
				<div class="lg:w-1/2 w-full">
					<h2
						class="text-lg md:text-xl lg:text-3xl font-apercuBold mb-8 text-gray-800 text-center">
						Liste des peintures
					</h2>
					<div
						v-if="paintings.length === 0"
						class="space-y-4 bg-white p-6 rounded-2xl shadow-custom">
						<p class="text-gray-600">
							Aucune peinture n'est disponible pour le moment.
						</p>
					</div>
					<div
						v-else
						class="space-y-4 bg-white overflow-hidden rounded-2xl shadow-custom">
						<div
							class="max-h-[70vh] p-2 md:p-6 overflow-y-auto overflow-x-hidden">
							<div
								class="sticky top-0 z-10 rounded-xl bg-gray-50/80 backdrop-blur-md">
								<div
									class="relative backdrop-blur-sm mb-4 bg-black/10 rounded-xl overflow-hidden shadow-lg border border-black/10">
									<input
										v-model="searchQuery"
										type="text"
										placeholder="Rechercher des peintures..."
										class="w-full px-4 py-3 bg-transparent text-black placeholder-gray-500 focus:outline-none pl-10" />
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5 absolute left-3 top-3.5 text-black/70"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
									</svg>
								</div>
							</div>
							<div
								v-if="filteredPaintings.length === 0"
								class="text-center py-16 bg-gray-50">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-16 w-16 mx-auto text-gray-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<p class="mt-4 text-gray-600">
									{{
										searchQuery
											? "Aucune peinture ne correspond à votre recherche."
											: "Aucune peinture disponible."
									}}
								</p>
							</div>
							<div
								v-for="painting in filteredPaintings"
								:key="painting.id"
								class="bg-gray-50 p-2 md:p-4 rounded-lg hover:scale-101 flex items-center justify-between gap-2 md:gap-4 hover:bg-gray-100 transition-all duration-300">
								<div
									class="flex items-center gap-2 md:gap-4 overflow-hidden flex-1">
									<NuxtImg
										:src="painting.image"
										:alt="painting.name"
										:title="painting.name"
										loading="lazy"
										@contextmenu.prevent
										class="w-16 h-16 object-cover min-w-[64px] rounded-lg" />
									<div class="overflow-hidden">
										<h3
											class="font-apercuMedium truncate text-gray-800 max-w-full">
											{{ painting.name }}
										</h3>
										<p class="text-sm text-gray-600 whitespace-nowrap">
											{{ painting.price }}€
											<span class="hidden md:inline">{{
												painting.state === "FOR_SALE"
													? " - À vendre"
													: " - Hors vente"
											}}</span>
										</p>
									</div>
								</div>
								<div class="flex flex-row gap-2 shrink-0">
									<button
										@click="selectPaintingForEdit(painting)"
										class="p-2 w-11 bg-yellow focus:scale-95 text-white text-sm rounded-lg hover:bg-yellow/80 border border-yellow hover:border-black transition-all duration-300">
										<NuxtImg
											src="/svg/edit.svg"
											loading="lazy"
											@contextmenu.prevent
											alt="edit icon for editing painting"
											title="Modifier"
											class="w-7 h-7" />
									</button>
									<button
										@click="deletePainting(painting)"
										class="p-2 w-11 bg-red-400 focus:scale-95 text-white text-sm rounded-lg hover:bg-red-400/80 border border-red-400 hover:border-black transition-all duration-300">
										<NuxtImg
											src="/svg/trash.svg"
											loading="lazy"
											@contextmenu.prevent
											alt="trash icon for deleting painting"
											title="Supprimer"
											class="w-7 h-7" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<event-editable />
			<FAQeditable />
			<newsletter-subscribers />
		</div>

		<!-- Modal d'authentification - Centré verticalement et horizontalement -->
		<div
			v-else
			class="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
			<div
				class="bg-black text-white p-8 rounded-2xl shadow-xl max-w-md w-full">
				<h2 class="text-xl lg:text-2xl font-apercuBold mb-4">
					Entrez le mot de passe pour accéder à cette page
				</h2>
				<form @submit.prevent="checkSecretKey">
					<div class="mb-4 relative">
						<label for="secretKey" class="sr-only">Mot de passe</label>
						<input
							v-model="secretKeyInput"
							id="secretKey"
							:type="showPassword ? 'text' : 'password'"
							autocomplete="new-password"
							placeholder="Saisir la clé"
							class="input mb-4 text-black pr-10"
							required />
						<button
							type="button"
							@mousedown.prevent="showPassword = true"
							@mouseup.prevent="showPassword = false"
							@mouseleave="showPassword = false"
							@touchstart.prevent="showPassword = !showPassword"
							class="absolute right-4 top-1/2 -translate-y-[80%] lg:-translate-y-[90%] text-gray-500 hover:text-gray-700 focus:outline-none">
							<NuxtImg
								v-if="!showPassword"
								src="/svg/eye-open.svg"
								alt="eye icon for showing password"
								title="Afficher le mot de passe"
								loading="lazy"
								@contextmenu.prevent
								class="w-5 h-5" />
							<NuxtImg
								v-else
								src="/svg/eye-closed.svg"
								alt="eye icon for hiding password"
								title="Masquer le mot de passe"
								class="w-5 h-5"
								@contextmenu.prevent />
						</button>
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

<style scoped>
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
	-webkit-box-shadow: 0 0 0 1000px var(--color-white) inset !important;
	-webkit-text-fill-color: var(--color-black) !important;
	transition: background-color 5000s ease-in-out 0s;
}

@-moz-document url-prefix() {
	input:-moz-autofill,
	input:-moz-autofill:focus {
		box-shadow: 0 0 0 1000px var(--color-white) inset !important;
		-moz-text-fill-color: var(--color-black) !important;
	}
}
</style>
