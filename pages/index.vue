// Fixed version of the script setup section
<script setup>
import { useSchemaOrg } from "#imports";
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from "vue";

// State variables
const filteredPaintings = ref([]);
const allTags = ref([]);
const page = ref(1);
const limit = ref(9);
const isLoading = ref(false);
const hasMore = ref(true);
const isImageLoaded = ref({});
const cardSize = ref(0);
const cardRefs = ref([]);
const displayedCount = ref(0);
const totalCount = ref(0);
const filteredTotalCount = ref(0);
const observedItems = ref(new Set());
const isInitialized = ref(false); // Flag to prevent multiple initial loads

// Observer references
const lastCardRef = ref(null);
const observer = ref(null);
const imageObserver = ref(null);

// Error state
const loadError = ref(false);

const scrollBarWidth = ref(0);

// Computed properties
const noResultsFound = computed(
	() => filteredTotalCount.value === 0 && !isLoading.value && !loadError.value
);

// Handle filter changes from the Filter component
const handleFilterChange = (newFilters) => {
	// Reset state for new filter
	page.value = 1;
	filteredPaintings.value = [];
	hasMore.value = true;
	displayedCount.value = 0;
	observedItems.value.clear(); // Clear observed items when filters change
	loadPaintings(true);
};

// Function to load paintings with API filtering
const loadPaintings = async (reset = false) => {
	// Prevent duplicate loading
	if (isLoading.value || (!hasMore.value && !reset)) return;

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
			hasMore.value = page.value < meta.totalPages;

			// Update paintings array based on reset flag
			if (reset) {
				filteredPaintings.value = [...newPaintings];
				displayedCount.value = 0;
				// Reset the observation tracking when filters change
				observedItems.value.clear();
			} else {
				// Check for duplicates before adding new paintings
				const currentIds = new Set(filteredPaintings.value.map((p) => p.id));
				const uniqueNewPaintings = newPaintings.filter(
					(p) => !currentIds.has(p.id)
				);

				filteredPaintings.value = [
					...filteredPaintings.value,
					...uniqueNewPaintings,
				];
			}

			// Initialize image loading status
			newPaintings.forEach((painting) => {
				if (!isImageLoaded.value[painting.id]) {
					isImageLoaded.value[painting.id] = false;
				}
			});

			// Hardcoded tags (to be moved to API later)
			if (allTags.value.length === 0) {
				allTags.value = [
					{ value: "ANIMAL", label: "Animal" },
					{ value: "PERSONNAGE", label: "Personnage" },
					{ value: "PAYSAGE", label: "Paysage" },
					{ value: "COMMANDE_PERSONNALISEE", label: "Commande Personnalisee" },
				];
			}

			// Increment page for next load
			if (!reset && hasMore.value) {
				page.value++;
			}

			// Setup observers after DOM update
			nextTick(() => {
				setCardSize(); // Recalculate card size after data updates
				setupIntersectionObserver();
				setupImageObserver();
				startSequentialDisplay();
			});
		}
	} catch (err) {
		console.error("Erreur lors du chargement des peintures :", err);
		loadError.value = true;
	} finally {
		isLoading.value = false;
	}
};

// Image loading handler
const handleImageLoad = (paintingId) => {
	isImageLoaded.value[paintingId] = true;
};

// Sequential display animation
const startSequentialDisplay = () => {
	if (import.meta.client) {
		let currentCount = displayedCount.value;
		const interval = 100; // ms between each display
		const batchSize = 3; // Number of items to display per batch

		const incrementDisplayCount = () => {
			if (currentCount < filteredPaintings.value.length) {
				// Calculate new display count (by batch for performance)
				const newCount = Math.min(
					currentCount + batchSize,
					filteredPaintings.value.length
				);

				displayedCount.value = newCount;
				currentCount = newCount;

				// Continue if not finished
				if (currentCount < filteredPaintings.value.length) {
					setTimeout(incrementDisplayCount, interval);
				}
			}
		};

		// Start sequential display
		setTimeout(incrementDisplayCount, 50);
	}
};

// Check if an image should be displayed yet
const shouldDisplayImage = (index) => {
	return index < displayedCount.value;
};

// CSS class for image entrance animation
const getImageClass = (paintingId, index) => {
	const isLoaded = isImageLoaded.value[paintingId];
	const shouldDisplay = shouldDisplayImage(index);

	return isLoaded && shouldDisplay
		? "opacity-100 translate-y-0"
		: "opacity-0 translate-y-8";
};

// Set up refs for card elements
const setCardRef = (el, index) => {
	if (el) {
		cardRefs.value[index] = el;

		// Use the first card to set our cardSize
		if (index === 0) {
			const { width } = el.getBoundingClientRect();
			cardSize.value = width;
		}
	}
};

// Card reference handler
const setLastCardRef = (el, index) => {
	if (!el) return;

	// Only set ref on the last few items to ensure we load more before reaching the end
	const threshold = 3;
	if (index >= filteredPaintings.value.length - threshold) {
		lastCardRef.value = el;
	}
};

// Setup IntersectionObserver for lazy loading when scrolling
const setupIntersectionObserver = () => {
	if (typeof window !== "undefined" && "IntersectionObserver" in window) {
		// Clean up previous observer if it exists
		if (observer.value) {
			observer.value.disconnect();
		}

		observer.value = new IntersectionObserver(
			(entries) => {
				// If last element is visible and we have more content to load
				if (entries[0]?.isIntersecting && hasMore.value && !isLoading.value) {
					loadPaintings();
				}
			},
			{
				rootMargin: "200px", // Load before element comes into view
				threshold: 0.1, // Trigger when 10% of element is visible
			}
		);

		// Observe the last element if it exists
		if (lastCardRef.value) {
			observer.value.observe(lastCardRef.value);
		}
	}
};

// Setup IntersectionObserver for lazy loading images
const setupImageObserver = () => {
	if (typeof window !== "undefined" && "IntersectionObserver" in window) {
		// Clean up previous observer if it exists
		if (imageObserver.value) {
			imageObserver.value.disconnect();
		}

		imageObserver.value = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const imgElement = entry.target;
						const paintingId = imgElement.dataset.paintingId;

						// Set image source from data attribute
						if (imgElement.dataset.src) {
							imgElement.src = imgElement.dataset.src;

							// Stop observing this image
							imageObserver.value.unobserve(imgElement);
							observedItems.value.add(paintingId);
						}
					}
				});
			},
			{
				rootMargin: "300px", // Start loading when image is 300px away from viewport
				threshold: 0.01,
			}
		);
	}
};

// Observe image element for lazy loading
const observeImage = (el, paintingId) => {
	if (
		!el ||
		!paintingId ||
		(observedItems.value && observedItems.value.has(paintingId))
	)
		return;

	if (imageObserver.value) {
		imageObserver.value.observe(el);
	}
};

// Handle window resize to recalculate card size
const setCardSize = () => {
	// Find the first card ref and use it to calculate the size
	if (cardRefs.value.length > 0 && cardRefs.value[0]) {
		const { width } = cardRefs.value[0].getBoundingClientRect();
		if (width > 0) {
			cardSize.value = width;
		}
	}
};

// Calculate scrollbar width
const calculateScrollBarWidth = () => {
	if (typeof window === "undefined") return;
	scrollBarWidth.value =
		window.innerWidth - document.documentElement.clientWidth;
};

// Debounced resize handler for performance
const debounce = (fn, delay) => {
	let timeoutId;
	return function (...args) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn.apply(this, args), delay);
	};
};

const debouncedResize = debounce(() => {
	calculateScrollBarWidth();
	setCardSize();
}, 200);

// Component lifecycle hooks
onMounted(() => {
	calculateScrollBarWidth();
	window.addEventListener("resize", debouncedResize);

	// Ensure we only load paintings once on initial mount
	if (!isInitialized.value) {
		isInitialized.value = true;
		nextTick(() => {
			calculateScrollBarWidth();
			setCardSize();
			loadPaintings();
		});
	}
});

onBeforeUnmount(() => {
	// Clean up observers
	if (observer.value) {
		observer.value.disconnect();
		observer.value = null;
	}

	if (imageObserver.value) {
		imageObserver.value.disconnect();
		imageObserver.value = null;
	}

	// Remove event listener
	window.removeEventListener("resize", debouncedResize);
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
			class="mb-5 md:mb-10 lg:mb-20 2xl:mb-30 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-10 lg:gap-20 2xl:gap-30"
			:style="`width: calc(100% + ${scrollBarWidth}px)`">
			<div class="md:col-start-2 lg:col-start-3 md:col-span-1">
				<Filter
					:all-tags="allTags"
					:total-count="totalCount"
					:filtered-count="filteredTotalCount"
					@filter:change="handleFilterChange" />
			</div>
		</div>

		<!-- Error state -->
		<div v-if="loadError" class="text-center py-10">
			<div
				class="inline-block bg-red-50 text-red-600 px-6 py-4 rounded-lg border border-red-200">
				<p>Une erreur est survenue lors du chargement des œuvres.</p>
				<button
					@click="loadPaintings(true)"
					class="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md text-sm font-medium transition-colors">
					Réessayer
				</button>
			</div>
		</div>

		<!-- No results state -->
		<ClientOnly>
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

			<!-- Gallery grid -->
			<section
				v-else
				class="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-10 lg:gap-20 2xl:gap-30"
				:style="`width: calc(100% + ${scrollBarWidth}px)`"
				aria-label="Galerie de peintures">
				<article
					v-for="(painting, index) in filteredPaintings"
					:key="painting.id"
					:ref="(el) => setLastCardRef(el, index)"
					:class="[getImageClass(painting.id, index)]"
					class="z-10 w-full h-auto group bg-gradient-to-tr from-black via-black to-white rounded-2xl flex flex-col hover:rounded-none transition-all duration-500 justify-self-center active:ring-4 active:ring-black active:ring-offset-2 active:outline-none focus-within:ring-4 focus-within:ring-black focus-within:ring-offset-2 focus-within:outline-none">
					<NuxtLink
						:to="`/${painting.slug}`"
						:aria-label="`Voir les détails de l'œuvre: ${painting.name} ${
							painting.state === 'OFF_SALE'
								? '(Hors vente)'
								: `(${painting.price} €)`
						}`">
						<div
							:ref="(el) => setCardRef(el, index)"
							class="overflow-hidden relative w-full transition-all duration-500">
							<!-- Using v-if to ensure we don't create duplicate images -->
							<img
								v-if="observedItems && !observedItems.has(painting.id)"
								:ref="(el) => observeImage(el, painting.id)"
								:data-src="painting.image"
								:data-painting-id="painting.id"
								:alt="`Peinture: ${painting.name}`"
								:title="painting.name"
								loading="lazy"
								@load="handleImageLoad(painting.id)"
								class="w-full aspect-square object-cover rounded-2xl group-hover:rounded-none group-active:scale-105 transition-all duration-500 p-3 pt-3 pb-0 group-hover:p-0" />
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

		<!-- Loading skeletons -->
		<Transition name="fade" mode="out-in">
			<div
				v-if="isLoading"
				class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-10 lg:gap-20 2xl:gap-30"
				:class="[page > 1 ? 'mt-5 md:mt-10 lg:mt-20 2xl:mt-30' : '']"
				:style="`width: calc(100% + ${scrollBarWidth}px)`"
				aria-live="polite"
				aria-busy="true">
				<div
					v-for="i in limit"
					:key="i"
					class="z-10 w-full h-auto bg-gradient-to-tr from-black/10 via-black/10 to-black/5 rounded-2xl flex flex-col p-3">
					<!-- Image skeleton -->
					<div
						class="w-full aspect-square rounded-2sm bg-black/20 animate-pulse"></div>
					<!-- Text skeletons -->
					<div
						class="relative flex justify-between items-end gap-x-4 pt-3 w-full">
						<div class="flex justify-between gap-x-2 items-end w-full">
							<div class="h-5 bg-black/20 rounded w-2/3 animate-pulse"></div>
							<div class="h-5 bg-black/20 rounded w-1/4 animate-pulse"></div>
						</div>
					</div>
				</div>
			</div>
		</Transition>

		<!-- Scroll hint -->
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

		<!-- End of gallery message -->
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
