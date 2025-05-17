<script setup>
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from "vue";

const props = defineProps({
	paintings: {
		type: Array,
		required: true,
	},
	isLoading: {
		type: Boolean,
		default: false,
	},
	loadError: {
		type: Boolean,
		default: false,
	},
	pagination: {
		type: Object,
		default: () => ({
			page: 1,
			limit: 9,
			totalPages: 1,
			totalCount: 0,
		}),
	},
});

const emit = defineEmits(["retry"]);

const isImageLoaded = ref({});
const cardSize = ref(0);
const cardRefs = ref([]);
const displayedCount = ref(0);
const observedItems = ref(new Set());
const imageObserver = ref(null);

const noResultsFound = computed(
	() =>
		props.pagination.totalCount === 0 && !props.isLoading && !props.loadError
);

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
			if (currentCount < props.paintings.length) {
				// Calculate new display count (by batch for performance)
				const newCount = Math.min(
					currentCount + batchSize,
					props.paintings.length
				);

				displayedCount.value = newCount;
				currentCount = newCount;

				// Continue if not finished
				if (currentCount < props.paintings.length) {
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
		!(el instanceof Element) ||
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
	if (cardRefs.value.length > 0 && cardRefs.value[0]) {
		const { width } = cardRefs.value[0].getBoundingClientRect();
		if (width > 0) {
			cardSize.value = width;
		}
	}
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
	setCardSize();
}, 200);

// Reset display when paintings change
const resetDisplayState = () => {
	displayedCount.value = 0;
	observedItems.value.clear();

	// Reset image loading status for new paintings
	props.paintings.forEach((painting) => {
		if (!isImageLoaded.value[painting.id]) {
			isImageLoaded.value[painting.id] = false;
		}
	});

	// Setup observers and animation after DOM update
	nextTick(() => {
		setCardSize();
		setupImageObserver();
		startSequentialDisplay();
	});
};

// Watch for new paintings to restart animations
watch(() => props.paintings, resetDisplayState, { deep: true });

onMounted(() => {
	window.addEventListener("resize", debouncedResize);
	resetDisplayState();
});

onBeforeUnmount(() => {
	if (imageObserver.value) {
		imageObserver.value.disconnect();
		imageObserver.value = null;
	}

	window.removeEventListener("resize", debouncedResize);
});

const handleRetry = () => {
	emit("retry");
};
</script>

<template>
	<!-- Error state -->
	<div>
		<div v-if="loadError" class="text-center py-10">
			<div
				class="inline-block bg-red-50 text-red-600 px-6 py-4 rounded-lg border border-red-200">
				<p>Une erreur est survenue lors du chargement des œuvres.</p>
				<button
					@click="handleRetry"
					class="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md text-sm font-apercuMedium transition-colors">
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
				aria-label="Galerie de peintures">
				<article
					v-for="(painting, index) in paintings"
					:key="painting.id"
					:class="[getImageClass(painting.id, index)]"
					class="z-10 w-full h-auto group bg-gradient-to-tr from-black via-black to-white rounded-2xl flex flex-col hover:rounded-none transition-all duration-500 justify-self-center active:ring-4 active:ring-black active:ring-offset-2 active:outline-none focus-within:ring-4 focus-within:ring-black focus-within:ring-offset-2 focus-within:outline-none active:scale-97 [&:active]:duration-200">
					<NuxtLink
						:to="`/${painting.slug}`"
						:aria-label="`Voir les détails de l'œuvre: ${painting.name} ${
							painting.state === 'OFF_SALE'
								? '(Hors vente)'
								: `(${painting.price} €)`
						}`">
						<div
							:ref="(el) => setCardRef(el, index)"
							class="overflow-hidden relative w-full">
							<!-- Using v-if to ensure we don't create duplicate images -->
							<NuxtImg
								v-if="observedItems && !observedItems.has(painting.id)"
								:ref="(el) => observeImage(el, painting.id)"
								:src="painting.image"
								:alt="`Peinture: ${painting.name}`"
								:title="painting.name"
								placeholder
								loading="lazy"
								quality="50"
								@load="handleImageLoad(painting.id)"
								@contextmenu.prevent
								class="w-full aspect-square object-cover rounded-2xl group-hover:rounded-none transition-all duration-500 p-3 pt-3 pb-0 group-hover:p-0" />
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
				aria-live="polite"
				aria-busy="true">
				<div
					v-for="i in pagination.limit"
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
	</div>
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
