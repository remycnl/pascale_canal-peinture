<script setup>
import { useSchemaOrg } from "#imports";
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";

const config = useRuntimeConfig();

const baseUrl = config.public.siteUrl;

const paintings = ref([]);
const page = ref(1);
const limit = 9;
const isLoading = ref(false);
const hasMore = ref(true);
const isImageLoaded = ref({});
const cardSize = ref(0);
const displayedCount = ref(0);
const displayInterval = ref(null);

const loadPaintings = async () => {
	if (isLoading.value || !hasMore.value) return;
	isLoading.value = true;

	try {
		const data = await $fetch(
			`/api/paintings?page=${page.value}&limit=${limit}`
		);
		if (Array.isArray(data)) {
			if (data.length < limit) {
				hasMore.value = false;
			}
			paintings.value = [...paintings.value, ...data];

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
		page.value++;
	}
};

const handleImageLoad = (paintingId) => {
	isImageLoaded.value[paintingId] = true;
};

const startSequentialDisplay = () => {
	if (displayInterval.value) clearInterval(displayInterval.value);

	displayInterval.value = setInterval(() => {
		if (displayedCount.value < paintings.value.length) {
			displayedCount.value++;
		} else {
			clearInterval(displayInterval.value);
		}
	}, 150);
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
	const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
	const screenWidth = window.innerWidth;

	const threshold = screenWidth < 768 ? 1000 : 600;

	if (scrollTop + clientHeight >= scrollHeight - threshold) {
		loadPaintings();
	}
};

const calculateCardSize = () => {
	const screenWidth = document.documentElement.clientWidth;
	const containerWidth = Math.min(screenWidth, 2560);

	let columns;
	if (screenWidth < 768) {
		columns = 1; // Mobile
	} else if (screenWidth < 1024) {
		columns = 2; // Tablette
	} else {
		columns = 3; // Grand écran
	}

	let padding;
	if (screenWidth < 768) {
		// sm
		padding = 2 * 12;
	} else if (screenWidth < 1024) {
		// md
		padding = 2 * 20;
	} else if (screenWidth < 1280) {
		// lg
		padding = 2 * 28;
	} else {
		// xl+
		padding = 2 * 60;
	}

	let gap;
	if (screenWidth < 768) {
		// mobile (gap-5)
		gap = 20;
	} else if (screenWidth < 1024) {
		// md (gap-10)
		gap = 40;
	} else if (screenWidth < 1536) {
		// lg (gap-20)
		gap = 80;
	} else {
		// 2xl (gap-30)
		gap = 120;
	}

	cardSize.value = Math.floor(
		(containerWidth - padding - gap * (columns - 1)) / columns
	);
};

watch(
	() => Object.keys(isImageLoaded.value).length,
	(newVal) => {
		if (newVal >= Math.min(3, paintings.value.length)) {
			startSequentialDisplay();
		}
	}
);

watch(
	() => paintings.value.length,
	(newVal, oldVal) => {
		if (newVal > oldVal && displayedCount.value >= oldVal) {
			startSequentialDisplay();
		}
	}
);

onMounted(async () => {
	calculateCardSize();
	window.addEventListener("resize", calculateCardSize);
	await loadPaintings();
	window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
	window.removeEventListener("resize", calculateCardSize);
	window.removeEventListener("scroll", handleScroll);
	if (displayInterval.value) clearInterval(displayInterval.value);
});

const loadedPaintings = computed(() =>
	paintings.value.filter((painting) => isImageLoaded.value[painting.id])
);

const updateSchemaOrg = () => {
	useSchemaOrg([
		defineWebSite({
			name: "Pascale Canal - Artiste Peintre",
			description:
				"Site officiel de Pascale Canal, artiste peintre française spécialisée dans les paysages d'Aubrac",
			url: baseUrl,
		}),

	

	definePerson({
		name: "Pascale Canal",
		jobTitle: "Artiste peintre",
		url: baseUrl,
		address: {
			"@type": "PostalAddress",
			addressCountry: "France",
		},
		sameAs: [
			"https://www.instagram.com/pascale.canal.art/",
			"https://www.facebook.com/pascalecanal.art",
			"https://www.artmajeur.com/pascale-canal",
			"https://www.linkedin.com/in/pascale-canal/",
		],
	}),

	defineItemList({
		"@type": "ItemList",
		"@id": `${baseUrl}#tableaux`,
		name: "Galerie des œuvres d'art de Pascale Canal",
		numberOfItems: loadedPaintings.value.length,
		itemListElement: loadedPaintings.value.map((painting, index) => ({
			"@type": "ListItem",
			position: index + 1,
			item: {
				"@type": "Product",
				"@id": `${baseUrl}/${painting.slug}`,
				url: `${baseUrl}/${painting.slug}`,
				name: painting.name,
				image: {
					"@type": "ImageObject",
					url: painting.image,
					caption: painting.name,
				},
				description:
					painting.description ||
					`Tableau "${painting.name}" par l'artiste peintre Pascale Canal`,
				creator: {
					"@type": "Person",
					name: "Pascale Canal",
				},
				offers: {
					"@type": "Offer",
					price: painting.price,
					priceCurrency: "EUR",
					url: `${baseUrl}/${painting.slug}`,
					availability:
						painting.state === "FOR_SALE"
							? "https://schema.org/InStock"
							: "https://schema.org/SoldOut",
					seller: {
						"@type": "Person",
						name: "Pascale Canal",
					},
				},
			},
		}))
	}),
	]);
};

updateSchemaOrg();

watch(loadedPaintings, () => {
	if (loadedPaintings.value.length > 0) {
		updateSchemaOrg();
	}
}, { deep: true });
</script>

<template>
	<div class="relative min-h-screen">
		<div
			class="select-none pointer-events-none absolute -top-180 -right-180 w-full h-auto opacity-90 blur-2xl">
			<NuxtImg src="/svg/blob-right.svg" alt="Blob right" />
		</div>
		<div
			class="select-none pointer-events-none absolute top-[20vh] -left-200 w-full h-auto opacity-90 blur-2xl">
			<NuxtImg src="/svg/blob-left.svg" alt="Blob left" />
		</div>
		<h1
			class="flex flex-col gap-y-1 text-2xl sm:text-3xl md:text-5xl lg:text-6xl 2xl:text-[80px] leading-tight 2xl:leading-[90px] text-left lg:w-2/3 lg:pb-40 pt-15 lg:pt-20">
			<span
				class="z-20 group w-fit relative text-5xl sm:text-7xl md:text-8x lg:text-9xl 2xl:text-[180px] leading-tight 2xl:leading-[180px] whitespace-nowrap font-apercuBold">
				Pascale Canal
				<span
					class="z-10 hidden md:block uppercase font-apercuMedium absolute bottom-2 2xl:bottom-1 -rotate-10 2xl:-rotate-12 -right-40 lg:-right-40 2xl:-right-35 text-base lg:text-xl md:py-1 lg:py-2 2xl:py-3 md:px-6 lg:px-8 2xl:px-10 bg-yellow rounded-md md:rounded-lg border border-black">
					Artiste peintre française
				</span>
			</span>
			<span
				class="z-10 uppercase -mt-2 font-apercuMedium w-fit text-xs sm:text-sm md:hidden py-1 sm:py-2 px-4 sm:px-6 bg-yellow rounded-md md:rounded-lg border border-black">
				Artiste peintre francaise
			</span>
			<span class="z-20 mt-5 md:mt-0"
				>Visitez ma <span class="whitespace-nowrap">e-galerie</span></span
			>
		</h1>

		<div
			class="relative flex flex-wrap justify-between items-center gap-5 md:gap-10 lg:gap-20 2xl:gap-30 mt-20">
			<NuxtLink
				v-for="(painting, index) in paintings"
				:to="`/${painting.slug}`"
				:key="painting.id"
				:class="[getImageClass(painting.id, index)]"
				:style="`width: ${cardSize}px`"
				class="z-10 group bg-gradient-to-tr active:scale-95 from-black via-black to-white rounded-2xl flex flex-col hover:rounded-none will-change-auto transition-all duration-500">
				<div
					:style="`height: ${cardSize}px`"
					class="overflow-hidden relative w-full p-3 group-hover:p-0 transition-all duration-500">
					<NuxtImg
						:src="painting.image"
						:alt="painting.name"
						fit="cover"
						format="webp"
						loading="lazy"
						quality="50"
						@load="handleImageLoad(painting.id)"
						class="w-full h-full rounded-2sm group-hover:rounded-none will-change-auto transition-all duration-500" />
					<div
						v-if="painting.state === 'SOLD'"
						class="absolute inset-0 flex items-center justify-center scale:100 lg:scale-50 group-hover:scale-100 lg:opacity-0 group-hover:opacity-100 transition-all duration-400">
						<div
							:style="{
								fontSize: `${cardSize * 0.3}px`,
							}"
							class="-rotate-45 mt-5 ml-5 flex items-center justify-center uppercase font-apercuBold text-white/50 origin-center">
							Vendu
						</div>
					</div>
				</div>
				<div
					class="relative flex justify-between items-end gap-x-4 py-3 px-6 group-hover:px-3 w-full text-white will-change-auto transition-all duration-500">
					<div
						class="absolute top-0 left-1/2 w-0 group-hover:w-1/2 will-change-auto h-0.5 bg-white transition-all duration-500"></div>
					<div
						class="absolute top-0 right-1/2 w-0 group-hover:w-1/2 will-change-auto h-0.5 bg-white transition-all duration-500"></div>
					<div class="flex justify-between gap-x-2 items-end w-full">
						<div class="flex items-start space-x-2 min-w-0 flex-1 mr-2">
							<NuxtImg
								src="/svg/arrow-white.svg"
								alt="right arrow"
								class="w-6 h-6 translate-x-1 origin-left will-change-auto group-hover:translate-x-0 scale-50 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-400 flex-shrink-0" />
							<span
								class="text-base md:text-lg lg:text-xl font-apercuBold truncate -translate-x-8 will-change-auto group-hover:translate-x-0 transition-all duration-500 overflow-hidden text-ellipsis"
								>{{ painting.name }}</span
							>
						</div>
						<div
							class="text-sm md:text-base lg:text-lg whitespace-nowrap decoration-white flex-shrink-0">
							<span
								:class="
									painting.state === 'SOLD' ? 'line-through' : 'no-underline'
								">
								{{ painting.price + " €" }}
							</span>
							<span
								v-if="painting.state === 'SOLD'"
								class="ml-1 2xl:ml-2 hidden lg:inline">
								Vendu
							</span>
						</div>
					</div>
				</div>
			</NuxtLink>
		</div>

		<div v-if="isLoading" class="flex justify-center mt-28">
			<div class="relative flex items-center space-x-4">
				<div
					class="w-3 h-3 md:w-5 md:h-5 bg-black rounded-full"
					:style="{
						animation: 'bounce-smooth 1.5s infinite ease-in-out',
						animationDelay: '0s',
					}"></div>
				<div
					class="w-3 h-3 md:w-5 md:h-5 bg-black rounded-full"
					:style="{
						animation: 'bounce-smooth 1.5s infinite ease-in-out',
						animationDelay: '0.3s',
					}"></div>
				<div
					class="w-3 h-3 md:w-5 md:h-5 bg-black rounded-full"
					:style="{
						animation: 'bounce-smooth 1.5s infinite ease-in-out',
						animationDelay: '0.6s',
					}"></div>
			</div>
		</div>

		<div
			v-if="hasMore && !isLoading && paintings.length > 0"
			class="text-center mt-28 mb-16">
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

		<div v-if="!hasMore && !isLoading" class="text-center mt-28 mb-16">
			<div
				class="inline-block relative overflow-hidden px-8 py-4 border border-black rounded-xl bg-white/80 shadow-sm animate-float">
				<div
					class="absolute -top-10 -left-10 w-16 h-16 bg-yellow rounded-full blur-md animate-pulse"></div>
				<div
					class="absolute -bottom-10 -right-10 w-16 h-16 bg-yellow rounded-full blur-md animate-pulse"
					style="animation-delay: 0.5s"></div>
				<span class="font-apercuMedium relative z-10">
					Vous avez exploré toute la collection
				</span>
				<div
					class="mt-3 w-full h-0.5 bg-gradient-to-r from-transparent via-black/70 to-transparent"></div>
				<div class="mt-2 flex justify-center">
					<NuxtLink
						to="/contact"
						class="text-sm active:scale-95 hover:text-yellow transition-all duration-200 hover:scale-105">
						Contactez l'artiste
					</NuxtLink>
				</div>
			</div>
		</div>
	</div>
</template>
