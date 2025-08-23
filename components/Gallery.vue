<script setup>
import {
	ref,
	onMounted,
	onBeforeUnmount,
	computed,
	nextTick,
	watch,
} from "vue";
import { useGalleryAnimations } from "~/composables/useGalleryAnimations";
import { performanceManager, deviceUtils } from "~/utils/animationPerformance";

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
const skeletonCount = ref(9);
const isShowingSkeleton = ref(true);
const isContentFading = ref(false);
const posterSizes = ref([]);

const {
	magneticElements,
	isDesktop,
	setupMagneticEffect,
	cleanupMagneticEffect,
	cleanupClickEffect,
	handleDesktopDetection,
	cleanup: cleanupAnimations,
} = useGalleryAnimations();

// Computed pour le prix minimum des posters actifs
const minPosterPrice = computed(() => {
	if (!posterSizes.value || posterSizes.value.length === 0) return null;
	const activeSizes = posterSizes.value.filter((size) => size.isActive);
	if (activeSizes.length === 0) return null;
	return Math.min(...activeSizes.map((size) => Number(size.price)));
});

// Computed pour vérifier s'il n'y a aucun résultat
const noResultsFound = computed(
	() =>
		props.pagination.totalCount === 0 && !props.isLoading && !props.loadError
);

onMounted(async () => {
	try {
		const response = await $fetch("/api/global-poster-sizes");
		posterSizes.value = response || [];
	} catch (error) {
		console.error("Erreur lors de la récupération des tailles de poster :", error);
	}
	
	// Setup initial state
	window.addEventListener("resize", debouncedResize);
	isDesktop.value = deviceUtils.isDesktop();
	updateSkeletonCount();
	resetDisplayState();
});

const updateSkeletonCount = () => {
	skeletonCount.value =
		props.pagination.totalCount > 0
			? Math.min(props.pagination.limit, props.pagination.totalCount)
			: props.pagination.limit;
};

const handleImageLoad = (paintingId) => {
	isImageLoaded.value[paintingId] = true;
};

const startSequentialDisplay = () => {
	if (import.meta.client) {
		displayedCount.value = 0;

		props.paintings.forEach((_painting, index) => {
			setTimeout(() => {
				displayedCount.value = index + 1;
			}, index * 150);
		});
	}
};

const shouldDisplayImage = (index) => {
	return index < displayedCount.value;
};

const getImageClass = (paintingId, index) => {
	const isLoaded = isImageLoaded.value[paintingId];
	const shouldDisplay = shouldDisplayImage(index);

	return isLoaded && shouldDisplay
		? "opacity-100 translate-y-0"
		: "opacity-0 translate-y-8";
};

const setCardRef = (el, index) => {
	if (el) {
		cardRefs.value[index] = el;

		if (el instanceof HTMLElement) {
			magneticElements.value[index] = el;
		}

		if (index === 0) {
			const { width } = el.getBoundingClientRect();
			cardSize.value = width;
		}
	}
};

const setupImageObserver = () => {
	if (typeof window !== "undefined" && "IntersectionObserver" in window) {
		if (imageObserver.value) {
			imageObserver.value.disconnect();
		}

		imageObserver.value = performanceManager.createOptimizedObserver(
			(entry) => {
				if (entry.isIntersecting) {
					const imgElement = entry.target;
					const paintingId = imgElement.dataset.paintingId;

					if (imgElement.dataset.src) {
						imgElement.src = imgElement.dataset.src;
						imageObserver.value.unobserve(imgElement);
						observedItems.value.add(paintingId);
					}
				}
			},
			{
				rootMargin: "300px",
				threshold: 0.01,
			}
		);
	}
};

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

const setCardSize = () => {
	if (cardRefs.value.length > 0 && cardRefs.value[0]) {
		const { width } = cardRefs.value[0].getBoundingClientRect();
		if (width > 0) {
			cardSize.value = width;
		}
	}
};

const debouncedResize = performanceManager.debounce(() => {
	setCardSize();
	handleDesktopDetection();
}, 200);

const resetDisplayState = () => {
	displayedCount.value = 0;
	observedItems.value.clear();

	cleanupClickEffect();
	cleanupMagneticEffect();
	magneticElements.value = [];

	props.paintings.forEach((painting) => {
		if (!isImageLoaded.value[painting.id]) {
			isImageLoaded.value[painting.id] = false;
		}
	});

	nextTick(() => {
		performanceManager.scheduleTask(() => {
			setCardSize();
			setupImageObserver();
			startSequentialDisplay();
		}, "high");

		setTimeout(() => {
			performanceManager.scheduleTask(() => {
				const validElements = magneticElements.value.filter((el) => el);
				if (validElements.length > 0) {
					setupMagneticEffect();
				}
			}, "normal");
		}, 800);
	});
};

const handleRetry = () => {
	emit("retry");
};

// Watchers
watch(
	() => props.isLoading,
	(newValue, oldValue) => {
		if (newValue) {
			if (oldValue === false && props.paintings.length > 0) {
				isContentFading.value = true;

				setTimeout(() => {
					updateSkeletonCount();
					isShowingSkeleton.value = true;
					isContentFading.value = false;
				}, 300);
			} else {
				updateSkeletonCount();
				isShowingSkeleton.value = true;
			}
		} else {
			setTimeout(() => {
				isShowingSkeleton.value = false;
			}, 300);
		}
	},
	{ immediate: true }
);

watch(() => props.paintings, resetDisplayState, { deep: true });
watch(() => props.pagination, updateSkeletonCount, { deep: true });

onBeforeUnmount(() => {
	cleanupAnimations();
	performanceManager.cleanup();
	deviceUtils.clearCache();

	if (imageObserver.value) {
		imageObserver.value.disconnect();
		imageObserver.value = null;
	}

	window.removeEventListener("resize", debouncedResize);
});
</script>

<template>
	<div>
		<!-- Error state -->
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

			<!-- Gallery grid with transition wrapper -->
			<Transition name="content-fade">
				<section
					v-if="!isContentFading && paintings.length > 0 && !isLoading"
					class="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-10 lg:gap-20 2xl:gap-30"
					aria-label="Galerie de peintures">
					<article
						v-for="(painting, index) in paintings"
						:key="painting.id"
						class="magnetic-card cursor-pointer z-10 w-full h-auto group flex flex-col justify-self-center will-change-transform"
						:ref="(el) => setCardRef(el, index)">
						<NuxtLink
							:to="`/${painting.slug}`"
							:aria-label="`Voir les détails de l'œuvre: ${painting.name} ${
								painting.state === 'OFF_SALE'
									? '(Hors vente)'
									: `(${painting.price} €)`
							}`"
							:class="[getImageClass(painting.id, index)]"
							class="block transition-all duration-700">
							<div class="overflow-hidden relative w-full">
								<NuxtImg
									v-if="observedItems && !observedItems.has(painting.id)"
									:ref="(el) => observeImage(el, painting.id)"
									:data-painting-id="painting.id"
									:data-src="painting.image"
									:src="painting.image"
									:alt="`Peinture: ${painting.name}`"
									:title="painting.name"
									placeholder
									loading="lazy"
									quality="50"
									@load="handleImageLoad(painting.id)"
									@contextmenu.prevent
									class="w-full rounded-sm aspect-square object-cover" />
								<div
									v-if="painting.state === 'OFF_SALE'"
									class="absolute hidden lg:flex select-none inset-0 items-center justify-center scale-50 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-400"
									aria-hidden="true">
									<div
										:style="{
											fontSize: `${cardSize * 0.27}px`,
											lineHeight: `${cardSize * 0.27}px`,
										}"
										class="-rotate-45 flex items-center justify-center text-center uppercase font-apercuBold text-white/50 origin-center">
										Dispo poster
									</div>
								</div>
							</div>
							<div
								class="flex justify-between gap-x-2 pt-2 md:pt-3 items-center w-full">
								<h2
									class="text-base md:text-lg lg:text-xl font-apercuBold truncate text-ellipsis">
									{{ painting.name }}
								</h2>
								<div
									class="text-sm md:text-base lg:text-lg whitespace-nowrap flex-shrink-0">
									<span v-if="painting.state !== 'OFF_SALE'">
										{{ painting.price + " €" }}
									</span>
									<span v-else-if="minPosterPrice !== null">
										Poster
										{{ posterSizes.length === 1 ? "à" : "dès" }}
										{{ minPosterPrice }} €
									</span>
									<span v-else>
										Hors vente
									</span>
								</div>
							</div>
						</NuxtLink>
					</article>
				</section>
			</Transition>
		</ClientOnly>

		<!-- Loading skeletons -->
		<Transition name="fade">
			<div
				v-if="isLoading || isShowingSkeleton"
				class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-10 lg:gap-20 2xl:gap-30"
				aria-live="polite"
				aria-busy="true">
				<article
					v-for="i in skeletonCount"
					:key="i"
					class="z-10 w-full h-auto group rounded-xs flex flex-col justify-self-center opacity-0 translate-y-12 animate-fade-in-up"
					:style="{
						animationDelay: `${(i - 1) * 100}ms`,
					}">
					<div>
						<div class="overflow-hidden relative w-full">
							<!-- Image skeleton -->
							<div
								class="w-full rounded-sm aspect-square bg-black/20 animate-pulse"></div>
						</div>
						<!-- Text skeletons -->
						<div
							class="flex justify-between gap-x-2 py-2 md:py-3 items-center w-full">
							<div
								class="text-base md:text-lg lg:text-xl font-apercuBold h-6 bg-black/20 rounded w-2/3 animate-pulse"></div>
							<div
								class="text-sm md:text-base lg:text-lg whitespace-nowrap flex-shrink-0 h-5 bg-black/20 rounded w-16 animate-pulse"></div>
						</div>
					</div>
				</article>
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

.content-fade-enter-active,
.content-fade-leave-active {
	transition: opacity 0.3s ease;
}
.content-fade-enter-from,
.content-fade-leave-to {
	opacity: 0;
}

@keyframes fade-in-up {
	from {
		opacity: 0;
		transform: translateY(3rem);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.animate-fade-in-up {
	animation: fade-in-up 0.7s ease-out forwards;
}
</style>