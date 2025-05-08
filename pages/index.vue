<script setup>
import { useSchemaOrg } from "#imports";
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";

const paintings = ref([]);
const filteredPaintings = ref([]);
const allTags = ref([]);
const page = ref(1);
const limit = 9;
const isLoading = ref(false);
const hasMore = ref(true);
const isImageLoaded = ref({});
const cardSize = ref(0);
const displayedCount = ref(0);
const displayInterval = ref(null);
const fetchedCount = ref(0);
const noResultsFound = computed(
	() => filteredPaintings.value.length === 0 && !isLoading.value
);
const isFilteringAll = ref(false);

// Optimized filtering function
const handleFilterApplied = async () => {
	if (hasMore.value) {
		isFilteringAll.value = true;
		displayedCount.value = 0;
		await loadPaintings(true);
		startSequentialDisplay();
		isFilteringAll.value = false;
	}
};

// Handle updated filtered paintings
const handleFilterUpdate = async (newFilteredPaintings) => {
	if (hasMore.value && !isFilteringAll.value) {
		await handleFilterApplied();
		return;
	}

	filteredPaintings.value = newFilteredPaintings;
	displayedCount.value = 0;
	startSequentialDisplay();
};

const loadPaintings = async (loadAll = false) => {
	if (isLoading.value || (!hasMore.value && !loadAll)) return;
	isLoading.value = true;

	try {
		const endpoint = loadAll
			? `/api/paintings?limit=1000`
			: `/api/paintings?page=${page.value}&limit=${limit}`;

		const data = await $fetch(endpoint);

		if (Array.isArray(data)) {
			fetchedCount.value = data.length;

			if (data.length < limit && !loadAll) {
				hasMore.value = false;
			}

			if (loadAll) {
				paintings.value = data;
				hasMore.value = false;
			} else {
				paintings.value = [...paintings.value, ...data];
			}

			filteredPaintings.value = [...paintings.value];

			// Hardcoded tags
			allTags.value = [
				{ value: "ANIMAL", label: "Animal" },
				{ value: "PERSONNAGE", label: "Personnage" },
				{ value: "PAYSAGE", label: "Paysage" },
				{ value: "COMMANDE_PERSONNALISEE", label: "Commande Personnalisee" },
			];

			// Set image loading status
			data.forEach((painting) => {
				if (!isImageLoaded.value[painting.id]) {
					isImageLoaded.value[painting.id] = false;
				}
			});
		} else {
			console.error("Réponse inattendue de l'API :", data);
		}
	} catch (err) {
		console.error("Erreur lors du chargement des peintures :", err);
	} finally {
		isLoading.value = false;
		if (!loadAll) {
			page.value++;
		}
	}
};

const handleImageLoad = (paintingId) => {
	isImageLoaded.value[paintingId] = true;
};

const startSequentialDisplay = () => {
	if (import.meta.client) {
		if (displayInterval.value) clearInterval(displayInterval.value);

		displayInterval.value = setInterval(() => {
			if (displayedCount.value < filteredPaintings.value.length) {
				displayedCount.value++;
			} else {
				clearInterval(displayInterval.value);
			}
		}, 150);
	}
};

const shouldDisplayImage = (paintingId, index) => {
	return isImageLoaded.value[paintingId] && index < displayedCount.value;
};

const getImageClass = (paintingId, index) => {
	return shouldDisplayImage(paintingId, index)
		? "opacity-100 translate-y-0"
		: "opacity-0 translate-y-8";
};

const handleScroll = () => {
	if (isFilteringAll.value) return;

	const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
	const screenWidth = window.innerWidth;
	const threshold = screenWidth < 768 ? 1000 : 600;

	if (scrollTop + clientHeight >= scrollHeight - threshold) {
		loadPaintings();
	}
};

const calculateCardSize = () => {
	const screenWidth = window.innerWidth;
	const hasVerticalScrollbar =
		document.documentElement.scrollHeight >
		document.documentElement.clientHeight;
	const scrollbarWidth = hasVerticalScrollbar
		? window.innerWidth - document.documentElement.clientWidth
		: 0;

	const containerPadding =
		screenWidth < 768
			? 24
			: screenWidth < 1024
			? 40
			: screenWidth < 1280
			? 56
			: 120;

	const maxWidth = 2560;
	const availableWidth = Math.min(screenWidth, maxWidth) - scrollbarWidth;
	const containerWidth = availableWidth - containerPadding;

	const columns =
		screenWidth < 768
			? 1 // Mobile
			: screenWidth < 1024
			? 2 // Tablet
			: 3; // Desktop

	const gap =
		screenWidth < 768
			? 20
			: screenWidth < 1024
			? 40
			: screenWidth < 1536
			? 80
			: 120;

	cardSize.value = Math.floor((containerWidth - gap * (columns - 1)) / columns);
};

// Watch for image loading to start sequential display
watch(
	() => Object.keys(isImageLoaded.value).length,
	(newVal) => {
		if (newVal >= Math.min(3, paintings.value.length)) {
			startSequentialDisplay();
		}
	}
);

// Watch for new paintings to continue sequential display
watch(
	() => paintings.value.length,
	(newVal, oldVal) => {
		if (newVal > oldVal && displayedCount.value >= oldVal) {
			startSequentialDisplay();
		}
	}
);

onMounted(() => {
	calculateCardSize();
	window.addEventListener("resize", calculateCardSize);
	window.addEventListener("scroll", handleScroll);

	nextTick(() => {
		calculateCardSize();
	});

	loadPaintings();
});

onBeforeUnmount(() => {
	window.removeEventListener("resize", calculateCardSize);
	window.removeEventListener("scroll", handleScroll);
	if (displayInterval.value) clearInterval(displayInterval.value);
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

		<div class="mb-5 md:mb-10 lg:mb-20 2xl:mb-30">
			<Filter
				:paintings="paintings"
				:allTags="allTags"
				:width="cardSize"
				@update:filteredPaintings="handleFilterUpdate" />
		</div>

		<ClientOnly>
			<!-- No results message -->
			<div
				v-if="noResultsFound"
				class="flex flex-col items-center justify-center py-20 text-center">
				<div
					class="w-20 h-20 mb-6 rounded-full border-2 border-black flex items-center justify-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-10 w-10"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12" />
					</svg>
				</div>
				<h2 class="text-2xl font-apercuBold mb-2">Aucun résultat trouvé</h2>
				<p class="text-black/70 mb-6">
					Essayez de modifier vos filtres pour voir plus d'œuvres
				</p>
			</div>

			<section
				v-else
				class="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-10 lg:gap-20 2xl:gap-30"
				aria-label="Galerie de peintures">
				<article
					v-for="(painting, index) in filteredPaintings"
					:key="painting.id"
					:class="[getImageClass(painting.id, index)]"
					:style="`width: ${cardSize}px`"
					class="z-10 group bg-gradient-to-tr from-black via-black to-white rounded-2xl flex flex-col hover:rounded-none transition-all duration-500 justify-self-center">
					<NuxtLink
						:to="`/${painting.slug}`"
						:aria-label="`Voir les détails de l'œuvre: ${painting.name} ${
							painting.state === 'OFF_SALE'
								? '(Hors vente)'
								: `(${painting.price} €)`
						}`"
						class="transition-transform duration-200 group-active:scale-98">
						<div
							:style="`height: ${cardSize}px`"
							class="overflow-hidden relative w-full px-3 pt-3 group-hover:p-0 transition-all duration-500">
							<NuxtImg
								:src="painting.image"
								:alt="`Peinture: ${painting.name}`"
								:title="painting.name"
								format="webp"
								loading="lazy"
								quality="50"
								provider="cloudinary"
								@contextmenu.prevent
								@load="handleImageLoad(painting.id)"
								class="w-full h-full object-cover rounded-2sm group-hover:rounded-none transition-all duration-500" />
							<div
								v-if="painting.state === 'OFF_SALE'"
								class="absolute hidden lg:flex select-none inset-0 items-center justify-center scale-50 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-400"
								aria-hidden="true">
								<div
									:style="{
										fontSize: `${cardSize * 0.28}px`,
										lineHeight: `${cardSize * 0.28}px`,
									}"
									class="-rotate-45 flex items-center justify-center text-center uppercase font-apercuBold text-white/50 origin-center">
									Hors vente
								</div>
							</div>
						</div>
						<div
							class="relative flex justify-between items-end gap-x-4 py-3 px-6 group-hover:px-3 w-full text-white will-change-auto transition-all duration-500">
							<div
								class="absolute top-0 left-1/2 w-0 group-hover:w-1/2 will-change-auto h-0.5 bg-white transition-all duration-500"
								aria-hidden="true"></div>
							<div
								class="absolute top-0 right-1/2 w-0 group-hover:w-1/2 will-change-auto h-0.5 bg-white transition-all duration-500"
								aria-hidden="true"></div>
							<div class="flex justify-between gap-x-2 items-end w-full">
								<div class="flex items-start space-x-2 min-w-0 flex-1 mr-2">
									<NuxtImg
										src="/svg/arrow-white.svg"
										alt="Flèche"
										title="Flèche"
										@contextmenu.prevent
										aria-hidden="true"
										class="w-6 h-6 translate-x-1 origin-left will-change-auto group-hover:translate-x-0 scale-50 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-400 flex-shrink-0" />
									<h2
										class="text-base md:text-lg lg:text-xl font-apercuBold truncate -translate-x-8 will-change-auto group-hover:translate-x-0 transition-all duration-500 overflow-hidden text-ellipsis">
										{{ painting.name }}
									</h2>
								</div>
								<div
									class="text-sm md:text-base lg:text-lg whitespace-nowrap decoration-white flex-shrink-0">
									<span
										v-if="painting.state !== 'OFF_SALE'"
										:class="
											painting.state === 'OFF_SALE'
												? 'line-through'
												: 'no-underline'
										">
										{{ painting.price + " €" }}
									</span>
									<span
										v-if="painting.state === 'OFF_SALE'"
										class="ml-1 2xl:ml-2 inline">
										Hors vente
									</span>
								</div>
							</div>
						</div>
					</NuxtLink>
				</article>
			</section>
		</ClientOnly>

		<Transition name="fade" mode="out-in">
			<div
				v-if="isLoading"
				class="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-10 lg:gap-20 2xl:gap-30"
				:class="[page > 1 ? 'mt-5 md:mt-10 lg:mt-20 2xl:mt-30' : '']"
				aria-live="polite"
				aria-busy="true">
				<div
					v-for="i in fetchedCount || limit"
					:key="i"
					:style="`width: ${cardSize}px; height: ${cardSize}px`"
					class="z-10 backdrop-blur-sm bg-black/10 border border-black/20 p-3 rounded-2xl transition-all duration-500 justify-self-center"
					aria-hidden="true">
					<div
						class="animate-pulse"
						:style="{ animationDelay: `${i * 150}ms` }">
						<div
							:style="`height: ${cardSize - 70}px`"
							class="bg-black/20 rounded-lg"></div>
						<div class="h-4 bg-black/20 rounded mt-2 w-3/4"></div>
						<div class="h-3 bg-black/20 rounded mt-2 w-1/4"></div>
					</div>
				</div>
			</div>
		</Transition>

		<div
			v-if="hasMore && !isLoading && filteredPaintings.length > 0"
			class="text-center mt-28 mb-16"
			aria-hidden="true">
			<div class="inline-flex flex-col items-center opacity-75 animate-pulse">
				<span class="font-apercuMedium text-sm mb-2">Continuez à explorer</span>
				<svg
					class="w-6 h-6 animate-bounce"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path
						d="M7 13L12 18L17 13"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round" />
					<path
						d="M7 7L12 12L17 7"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round" />
				</svg>
			</div>
		</div>

		<section
			v-if="!hasMore && !isLoading && filteredPaintings.length > 0"
			class="text-center mt-20 md:mt-30 lg:mt-40">
			<div
				class="inline-block relative overflow-hidden px-8 py-4 border border-black rounded-xl bg-white shadow-sm">
				<div
					class="absolute -top-10 -left-10 w-16 h-16 bg-yellow rounded-full blur-md animate-pulse"
					aria-hidden="true"></div>
				<div
					class="absolute -bottom-10 -right-10 w-16 h-16 bg-yellow rounded-full blur-md animate-pulse"
					style="animation-delay: 0.5s"
					aria-hidden="true"></div>
				<p class="font-apercuMedium relative z-10">
					Vous avez exploré toute la collection
				</p>
				<div
					class="mt-3 w-full h-0.5 bg-gradient-to-r from-transparent via-black/70 to-transparent"
					aria-hidden="true"></div>
				<div class="mt-2 flex justify-center">
					<NuxtLink
						to="/contact"
						class="text-sm active:scale-95 hover:text-black/60 transition-all duration-200 hover:scale-105">
						Contactez l'artiste
					</NuxtLink>
				</div>
			</div>

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
