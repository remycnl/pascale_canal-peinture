<script setup>
import { useSchemaOrg } from "#imports";
import { ref, onMounted, computed, onBeforeUnmount } from "vue";

const filteredPaintings = ref([]);
const allTags = ref([]);
const page = ref(1);
const limit = ref(9);
const isLoading = ref(false);
const loadError = ref(false);
const totalCount = ref(0);
const filteredTotalCount = ref(0);
const totalPages = ref(1);

const pagination = computed(() => ({
	page: page.value,
	limit: limit.value,
	totalPages: totalPages.value,
	totalCount: filteredTotalCount.value,
}));

// Gestionnaire de changement de filtres
const handleFilterChange = () => {
	// Lire la page depuis l'URL (important: sera 1 si le filtre a retiré le paramètre page)
	const currentUrl = new URL(window.location);
	const pageFromUrl = parseInt(currentUrl.searchParams.get("page")) || 1;
	page.value = pageFromUrl;

	loadPaintings();
};

// Gestionnaire de changement de page
const handlePageChange = (newPage) => {
	const url = new URL(window.location);

	if (newPage === 1) {
		url.searchParams.delete("page");
	} else {
		url.searchParams.set("page", newPage);
	}

	window.history.pushState({}, "", url);
	page.value = newPage;
	window.scrollTo({ top: 0, behavior: "smooth" });
	loadPaintings();
};

// Chargement des peintures depuis l'API
const loadPaintings = async () => {
	if (isLoading.value) return;

	isLoading.value = true;
	loadError.value = false;

	try {
		const currentUrl = new URL(window.location);
		const forSale = currentUrl.searchParams.get("forSale") || "";
		const tags = currentUrl.searchParams.get("tags") || "";
		const search = currentUrl.searchParams.get("search") || "";

		const queryParams = new URLSearchParams({
			page: page.value,
			limit: limit.value,
		});

		if (forSale === "true") {
			queryParams.append("forSale", "true");
		}

		if (tags) {
			queryParams.append("tags", tags);
		}

		if (search) {
			queryParams.append("search", search);
		}

		const endpoint = `/api/paintings?${queryParams.toString()}`;
		const response = await $fetch(endpoint);

		if (response?.paintings) {
			filteredPaintings.value = response.paintings;
			totalCount.value = response.meta.totalInDb;
			filteredTotalCount.value = response.meta.totalCount;
			totalPages.value = response.meta.totalPages;

			// Si la page actuelle est supérieure au nombre total de pages, revenir à la dernière page
			// (Peut arriver après filtrage)
			if (page.value > totalPages.value && totalPages.value > 0) {
				handlePageChange(totalPages.value);
				return;
			}

			if (allTags.value.length === 0) {
				allTags.value = [
					{ value: "ANIMAL", label: "Animal" },
					{ value: "PERSONNAGE", label: "Personnage" },
					{ value: "PAYSAGE", label: "Paysage" },
					{ value: "COMMANDE_PERSONNALISEE", label: "Commande Personnalisee" },
				];
			}
		}
	} catch (err) {
		console.error("Erreur lors du chargement des peintures :", err);
		loadError.value = true;
	} finally {
		isLoading.value = false;
	}
};

// Gestion de la navigation avec back/forward
const handlePopState = () => {
	const currentUrl = new URL(window.location);
	page.value = parseInt(currentUrl.searchParams.get("page")) || 1;
	loadPaintings();
};

onMounted(() => {
	// Récupérer la page depuis les paramètres d'URL au chargement
	page.value = parseInt(new URL(window.location).searchParams.get("page")) || 1;

	// Charger les données
	loadPaintings();

	// Écouter les événements de navigation
	window.addEventListener("popstate", handlePopState);
});

onBeforeUnmount(() => {
	window.removeEventListener("popstate", handlePopState);
});

useSchemaOrg([
	defineBreadcrumb({
		itemListElement: [
			{
				name: "Accueil",
				item: "/",
			},
		],
	}),
]);
</script>

<template>
	<main class="relative min-h-screen">
		<!-- Background blobs -->
		<div
			class="hidden lg:block select-none pointer-events-none absolute -top-250 -right-180 w-full h-auto opacity-90 blur-2xl"
			aria-hidden="true">
			<NuxtImg
				src="/svg/blob-right.svg"
				alt="Blob black"
				title="Blob black"
				data-speed="0.7"
				@contextmenu.prevent />
		</div>
		<div
			class="hidden lg:block select-none pointer-events-none absolute top-[50vh] -left-200 w-full h-auto opacity-90 blur-2xl"
			aria-hidden="true">
			<NuxtImg
				src="/svg/blob-left.svg"
				alt="Blob black"
				title="Blob black"
				data-speed="0.5"
				@contextmenu.prevent />
		</div>

		<!-- Header -->
		<h1
			class="flex flex-col gap-y-1 text-2xl sm:text-3xl md:text-5xl lg:text-6xl 2xl:text-[80px] leading-tight 2xl:leading-[90px] text-left lg:w-2/3 lg:pb-20 pt-15 lg:pt-20">
			<span
				data-lag="0.5"
				class="z-20 group w-fit relative text-5xl sm:text-7xl md:text-8x lg:text-9xl 2xl:text-[180px] leading-tight 2xl:leading-[180px] whitespace-nowrap font-apercuBold">
				Pascale Canal
				<span
					data-lag="0.05"
					class="z-10 hidden md:block uppercase font-apercuMedium absolute bottom-2 2xl:bottom-1 -rotate-10 2xl:-rotate-12 -right-40 lg:-right-40 2xl:-right-35 text-base lg:text-xl md:py-1 lg:py-2 2xl:py-3 md:px-6 lg:px-8 2xl:px-10 bg-yellow rounded-md md:rounded-lg border border-black">
					Artiste peintre française
				</span>
			</span>
			<span
				class="z-10 uppercase -mt-2 font-apercuMedium w-fit text-xs sm:text-sm md:hidden py-1 sm:py-2 px-4 sm:px-6 bg-yellow rounded-md md:rounded-lg border border-black">
				Artiste peintre française
			</span>
			<span data-lag="0.3" class="z-20 mt-5 md:mt-0">
				Visitez ma <span class="whitespace-nowrap">e-galerie</span>
			</span>
		</h1>

		<!-- Filter component -->
		<div
			class="mb-5 md:mb-10 lg:mb-20 2xl:mb-30 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-10 lg:gap-20 2xl:gap-30">
			<div class="md:col-start-2 lg:col-start-3 md:col-span-1">
				<Filter
					:all-tags="allTags"
					:total-count="totalCount"
					:filtered-count="filteredTotalCount"
					@filter:change="handleFilterChange" />
			</div>
		</div>

		<!-- Gallery component -->
		<Gallery
			:paintings="filteredPaintings"
			:is-loading="isLoading"
			:load-error="loadError"
			:pagination="pagination"
			@retry="loadPaintings"/>

		<!-- Pagination component -->
		<GalleryPagination
			:current-page="page"
			:total-pages="totalPages"
			:is-loading="isLoading"
			@page-change="handlePageChange" />

		<!-- End of gallery -->
		<section>
			<Banner class="mt-20 md:mt-30 lg:mt-40" />
		</section>
	</main>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
