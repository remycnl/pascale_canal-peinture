<script setup>
import { useSchemaOrg } from "#imports";
import { ref, onMounted, computed } from "vue";

// State variables
const filteredPaintings = ref([]);
const allTags = ref([]);
const page = ref(1);
const limit = ref(9);
const isLoading = ref(false);
const loadError = ref(false);
const totalCount = ref(0);
const filteredTotalCount = ref(0);
const totalPages = ref(1);

// Pagination meta
const pagination = computed(() => ({
	page: page.value,
	limit: limit.value,
	totalPages: totalPages.value,
	totalCount: filteredTotalCount.value,
}));

// Handle filter changes from the Filter component
const handleFilterChange = (newFilters) => {
	// Reset state for new filter
	page.value = 1;
	loadPaintings(true);
};

// Handle page change from pagination component
const handlePageChange = (newPage) => {
	// Update page and load new data
	page.value = newPage;
	window.scrollTo({ top: 0, behavior: "smooth" });
	loadPaintings();
};

// Function to load paintings with API filtering
const loadPaintings = async (reset = false) => {
	// Prevent duplicate loading
	if (isLoading.value) return;

	isLoading.value = true;
	loadError.value = false;

	try {
		// Get current filter values from URL
		const currentUrl = new URL(window.location);
		const forSale = currentUrl.searchParams.get("forSale") || "";
		const tags = currentUrl.searchParams.get("tags") || "";
		const search = currentUrl.searchParams.get("search") || "";

		// Construct query parameters
		const queryParams = new URLSearchParams();
		queryParams.append("page", page.value);
		queryParams.append("limit", limit.value);

		if (forSale === "true") {
			queryParams.append("forSale", "true");
		}

		if (tags) {
			queryParams.append("tags", tags);
		}

		if (search) {
			queryParams.append("search", search);
		}

		// API request
		const endpoint = `/api/paintings?${queryParams.toString()}`;
		const response = await $fetch(endpoint);

		if (response && response.paintings) {
			const { paintings: newPaintings, meta } = response;

			// Update counters and state
			totalCount.value = meta.totalInDb;
			filteredTotalCount.value = meta.totalCount;
			totalPages.value = meta.totalPages;

			// Update paintings array
			filteredPaintings.value = [...newPaintings];

			// Hardcoded tags (to be moved to API later)
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

// Component lifecycle hooks
onMounted(() => {
	loadPaintings();
});

// Schema.org for SEO
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
			@retry="loadPaintings(true)"
			@page-change="handlePageChange" />

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
