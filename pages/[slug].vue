<script setup>
import { useSchemaOrg } from "#imports";

const config = useRuntimeConfig();

const baseUrl = config.public.siteUrl;
const siteName = config.public.siteName;

const route = useRoute();

const imageRef = ref(null);
const isZoomed = ref(false);
const mousePosition = ref({ x: 0, y: 0 });
const transformOrigin = ref("center");
const zoomLevel = 2.5;
const imageLoaded = ref(false);

const { data: painting, error } = await useFetch(
	`/api/paintings/${route.params.slug}`
);

if (error.value) {
	console.error("Erreur lors de la récupération de la peinture :", error.value);
}

const handleImageLoad = () => {
	imageLoaded.value = true;
};

const formatDate = (date) => {
	const options = {
		year: "numeric",
		month: "long",
		day: "numeric",
	};
	return new Date(date).toLocaleDateString("fr-FR", options);
};

const formatPrice = (price) => {
	return new Intl.NumberFormat("fr-FR").format(price);
};

const transform = computed(() => {
	return isZoomed.value ? `scale(${zoomLevel})` : "scale(1)";
});

const calculatePosition = (e) => {
	const rect = e.currentTarget.getBoundingClientRect();
	const x = ((e.clientX - rect.left) / rect.width) * 100;
	const y = ((e.clientY - rect.top) / rect.height) * 100;
	return { x, y };
};

const handleClick = (e) => {
	const pos = calculatePosition(e);
	transformOrigin.value = `${pos.x}% ${pos.y}%`;
	isZoomed.value = !isZoomed.value;
};

const handleMouseMove = (e) => {
	if (!isZoomed.value) return;
	const pos = calculatePosition(e);
	mousePosition.value = pos;
	transformOrigin.value = `${pos.x}% ${pos.y}%`;
};

const handleMouseLeave = () => {
	if (isZoomed.value) {
		isZoomed.value = false;
	}
};

useSeoMeta({
	title: () =>
		painting.value
			? `${painting.value.name} | ${siteName}`
			: "Page non trouvée",
	description: () =>
		painting.value
			? `Découvrez "${painting.value.name}", une œuvre unique de ${
					painting.value.artist
			  }. ${painting.value.paintingType}, ${painting.value.width}x${
					painting.value.height
			  }cm - ${formatPrice(painting.value.price)}€`
			: "Page de peinture non trouvée",
	ogTitle: () =>
		painting.value
			? `${painting.value.name} | ${siteName}`
			: "Page non trouvée",
	ogDescription: () =>
		painting.value
			? `${
					painting.value.description
						? painting.value.description.substring(0, 150) + "..."
						: `Une création artistique de ${painting.value.artist}. ${painting.value.paintingType}, dimensions ${painting.value.width}x${painting.value.height}cm.`
			  }`
			: "Page de peinture non trouvée",
	ogUrl: () => `${baseUrl}/${route.params.slug}`,
	ogImage: () => (painting.value?.image ? `${painting.value.image}` : null),
	ogImageAlt: () =>
		painting.value?.name
			? `Peinture "${painting.value.name}" par ${painting.value.artist}`
			: null,
	twitterTitle: () =>
		painting.value
			? `${painting.value.name} | ${siteName}`
			: "Page non trouvée",
	twitterDescription: () =>
		painting.value
			? `${
					painting.value.description
						? painting.value.description.substring(0, 150) + "..."
						: `Une œuvre originale "${painting.value.name}" de l'artiste ${painting.value.artist}. À découvrir !`
			  }`
			: "Page de peinture non trouvée",
	twitterImage: () =>
		painting.value?.image ? `${painting.value.image}` : null,
	twitterUrl: () => `${baseUrl}/${route.params.slug}`,
});

useSchemaOrg([
	defineProduct({
		name: () => painting.value?.name,
		description: () =>
			painting.value?.description ||
			`Œuvre originale créée par ${painting.value?.artist || "Pascale Canal"}`,
		image: () => painting.value?.image,
		brand: {
			"@type": "Brand",
			name: "Pascale Canal",
			logo: () => `${baseUrl}/img/fullLogo.png`,
		},
		sku: () => painting.value?.id?.toString(),
		productID: () => `painting:${painting.value?.id}`,
		category: "Art/Painting",
		material: () => painting.value?.paintingType,
		width: {
			"@type": "QuantitativeValue",
			value: () => painting.value?.width,
			unitCode: "CMT",
		},
		height: {
			"@type": "QuantitativeValue",
			value: () => painting.value?.height,
			unitCode: "CMT",
		},
		offers: {
			"@type": "Offer",
			price: () => painting.value?.price,
			priceCurrency: "EUR",
			url: () => `${baseUrl}/${route.params.slug}`,
			availability: () =>
				painting.value?.state === "FOR_SALE"
					? "https://schema.org/InStock"
					: "https://schema.org/SoldOut",
			seller: {
				"@type": "Person",
				name: () => painting.value?.artist || "Pascale Canal",
			},
			itemCondition: "https://schema.org/NewCondition",
			priceValidUntil: new Date(
				new Date().setFullYear(new Date().getFullYear() + 1)
			)
				.toISOString()
				.split("T")[0],
		},
		creator: {
			"@type": "Person",
			name: () => painting.value?.artist || "Pascale Canal",
		},
		keywords: () =>
			`art, peinture, tableau, ${painting.value?.paintingType || ""}, ${
				painting.value?.name || ""
			}, ${painting.value?.artist || "Pascale Canal"}`,
		dateCreated: () => painting.value?.date,
		audience: {
			"@type": "Audience",
			audienceType: "Art Collectors"
		},
		award: "Original Artwork",
		isAccessoryOrSparePartFor: {
			"@type": "Product",
			name: "Home Decoration",
		},
	}),

	defineWebPage({
		name: () => `${painting.value?.name || "Œuvre"} | ${siteName}`,
		description: () =>
			painting.value?.description?.substring(0, 150) + "..." ||
			`Œuvre originale par ${painting.value?.artist || "Pascale Canal"}`,
		image: () => painting.value?.image,
		inLanguage: "fr-FR",
		datePublished: () => painting.value?.date,
		dateModified: new Date().toISOString(),
		url: () => `${baseUrl}/${route.params.slug}`,
		author: {
			"@type": "Person",
			name: "Pascale Canal",
			url: () => baseUrl,
			jobTitle: "Artiste peintre",
			sameAs: [
				"https://www.instagram.com/pascale.canal.art/",
				"https://www.facebook.com/pascale.canal.art/",
			],
		},
		publisher: {
			"@type": "Person",
			name: "Pascale Canal",
			url: () => baseUrl,
		},
		isPartOf: {
			"@type": "WebSite",
			name: () => siteName,
			url: () => baseUrl,
		},
		potentialAction: {
			"@type": "BuyAction",
			target: () => `${baseUrl}/${route.params.slug}`,
		},
	}),

	defineBreadcrumb({
		itemListElement: [
			{
				name: "Accueil",
				item: "/",
			},
			{
				name: () => painting.value?.name || "Œuvre",
				item: () => `/${route.params.slug}`,
			},
		],
	}),
]);
</script>

<template>
	<div class="relative min-h-screen pt-10">
		<div v-if="painting">
			<button
				@click="$router.back() || $router.push('/')"
				title="Go to the previous page"
				class="rotate-180 active:scale-95 w-10 h-10 md:w-15 md:h-15 lg:w-20 lg:h-20 pointer-cursor hover:-translate-x-2 transition-transform duration-200">
				<NuxtImg src="/svg/arrow-black.svg" />
			</button>
			<div class="text-end mb-10">
				<h1
					class="text-[clamp(3rem,15vw,18rem)] leading-[clamp(3rem,16vw,19rem)] font-apercuBold tracking-wide text-black">
					{{ painting.name }}
				</h1>
				<p class="text-grayDark text-xl md:text-2xl lg:text-4xl">
					<span class="text-xs md:text-sm lg:text-lg">peint par</span>
					{{ painting.artist }}
				</p>
			</div>
			<div
				class="grid grid-cols-1 md:grid-cols-2 items-end gap-10 md:gap-15 lg:gap-20">
				<div
					class="relative overflow-hidden rounded-2xl"
					:class="{
						'animate-pulse bg-gray-200': !imageLoaded,
						'aspect-square': painting.width === painting.height,
					}"
					@mousemove="handleMouseMove"
					@mouseleave="handleMouseLeave"
					@click="handleClick"
					:style="{
						cursor: isZoomed ? 'zoom-out' : 'zoom-in',
					}">
					<NuxtImg
						:src="painting.image"
						:alt="painting.name"
						fit="cover"
						format="webp"
						quality="100"
						ref="imageRef"
						@load="handleImageLoad"
						:style="{
							transform: transform,
							transformOrigin: transformOrigin,
							transition: isZoomed ? 'none' : 'all 0.3s ease',
							opacity: imageLoaded ? 1 : 0,
						}"
						class="rounded-2xl w-full h-full object-center" />
				</div>
				<div class="relative prose max-w-none text-grayDark">
					<div
						class="lg:absolute -mt-7 lg:mt-0 -top-20 right-0 text-end will-change-scroll flex flex-col lg:flex-row gap-4">
						<button
							v-if="painting.state === 'SOLD'"
							class="bg-black active:scale-95 text-white py-2 px-6 rounded-lg text-sm font-bold shadow-md hover:bg-grayDark transition duration-200">
							Demander une réédition
						</button>
						<button
							v-else
							class="bg-black active:scale-98 md:active:scale-95 text-white py-2 px-6 rounded-lg text-sm font-bold shadow-md hover:bg-grayDark transition duration-200">
							Acheter
						</button>
						<ShareButton
							:title="`Découvre '${painting.name}' peint par ${painting.artist}`"
							:description="painting.description"
							position="bottom-right" />
					</div>
					<h2
						class="text-lg md:text-xl mt-10 lg:mt-0 lg:text-3xl font-bold text-black">
						Détails
					</h2>
					<ul class="mt-4 text-sm md:text-base lg:text-xl space-y-2">
						<li v-if="painting.state === 'SOLD'">
							<span
								class="font-apercuLight text-xs md:text-sm lg:text-base text-[#B60071]">
								Ce tableau a été vendu. Il est possible de demander une
								réédition, mais chaque création étant unique, la nouvelle
								version ne sera pas exactement identique.
							</span>
						</li>
						<li>
							<span class="font-apercuBold">Prix:</span>
							{{ formatPrice(painting.price) }} €
						</li>
						<li>
							<span class="font-apercuBold">Dimensions:</span>
							{{ painting.width }} cm x {{ painting.height }} cm
						</li>
						<li>
							<span class="font-apercuBold">Type de peinture:</span>
							{{ painting.paintingType }}
						</li>
						<li>
							<span class="font-apercuBold">Date:</span>
							{{ formatDate(painting.date) }}
						</li>
					</ul>
				</div>
				<div class="hidden lg:block"></div>

				<div
					class="prose max-w-none text-grayDark md:col-span-2 2xl:col-span-1">
					<h2 class="text-lg md:text-xl lg:text-3xl font-bold text-black">
						Son histoire
					</h2>
					<p class="mt-4 text-sm md:text-lg lg:text-xl leading-relaxed">
						{{ painting.description }}
					</p>
				</div>
			</div>
		</div>

		<div v-else class="text-center py-12">
			<p class="text-xl">Peinture non trouvée</p>
		</div>
		<SuggestionsPaintings :current-painting-id="painting.id" />
	</div>
</template>
