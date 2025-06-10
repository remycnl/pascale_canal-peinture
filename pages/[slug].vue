<script setup>
import { useSchemaOrg } from "#imports";
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";

const config = useRuntimeConfig();
const baseUrl = config.public.siteUrl;
const siteName = config.public.siteName;

const route = useRoute();
const router = useRouter();

// États réactifs
const showContactOverlay = ref(false);
const contactType = ref("");
const formLoaded = ref(false);
const modalRef = ref(null);
const setModalRef = (ref) => {
	modalRef.value = ref;
};
const realViewportHeight = ref(
	typeof window !== "undefined" ? window.innerHeight : 768
);

// Récupération des données
const { data: painting, error } = await useFetch(
	`/api/paintings/${route.params.slug}`
);

if (error.value) {
	console.error("Erreur lors de la récupération de la peinture :", error.value);
}

// Fonctions utilitaires
const formatDate = (date) => {
	const options = { year: "numeric" };
	return new Date(date).toLocaleDateString("fr-FR", options);
};

const formatPrice = (price) => {
	return new Intl.NumberFormat("fr-FR").format(price);
};

const updateViewportHeight = () => {
	if (typeof window !== "undefined") {
		realViewportHeight.value = window.innerHeight;
		if (showContactOverlay.value && modalRef.value) {
			updateModalHeight();
		}
	}
};

const updateModalHeight = () => {
	if (modalRef.value) {
		modalRef.value.style.maxHeight = `calc(${
			realViewportHeight.value * 0.9
		}px - env(safe-area-inset-bottom, 0px))`;
	}
};

const openContactOverlay = (type) => {
	contactType.value = type;
	showContactOverlay.value = true;
	document.body.style.overflow = "hidden";
	nextTick(() => {
		updateModalHeight();
	});
};

const closeContactOverlay = () => {
	showContactOverlay.value = false;
	formLoaded.value = false;
	document.body.style.overflow = "";
};

const goBack = () => {
	router.back();
};

// Lifecycle hooks
onMounted(() => {
	if (typeof window !== "undefined") {
		realViewportHeight.value = window.innerHeight;
		updateViewportHeight();

		window.addEventListener("resize", updateViewportHeight);
		window.addEventListener("orientationchange", updateViewportHeight);
		window.addEventListener("scroll", updateViewportHeight);

		window.addEventListener("orientationchange", () => {
			setTimeout(updateViewportHeight, 100);
		});

		window.addEventListener("keydown", (e) => {
			if (e.key === "Escape" && showContactOverlay.value) {
				closeContactOverlay();
			}
		});
	}
});

onUnmounted(() => {
	document.body.style.overflow = "";
	window.removeEventListener("resize", updateViewportHeight);
	window.removeEventListener("orientationchange", updateViewportHeight);
	window.removeEventListener("scroll", updateViewportHeight);
});

// SEO et Schema.org
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
		name: painting.value?.name || "Œuvre d'art",
		description:
			painting.value?.description ||
			`Œuvre originale créée par ${painting.value?.artist || "Pascale Canal"}`,
		image: painting.value?.image ? [painting.value.image] : undefined,
		brand: {
			"@type": "Brand",
			name: "Pascale Canal",
			logo: `${baseUrl}/img/fullLogo.png`,
		},
		sku: painting.value?.id?.toString() || "",
		productID: `painting:${painting.value?.id || "unknown"}`,
		category: "Art/Painting",
		material: painting.value?.paintingType || "Peinture sur toile",
		width: {
			"@type": "QuantitativeValue",
			value: painting.value?.width || 0,
			unitCode: "CMT",
		},
		height: {
			"@type": "QuantitativeValue",
			value: painting.value?.height || 0,
			unitCode: "CMT",
		},
		offers: {
			"@type": "Offer",
			price: painting.value?.price || 0,
			priceCurrency: "EUR",
			url: `${baseUrl}/${route.params.slug}`,
			availability:
				painting.value?.state === "FOR_SALE"
					? "http://schema.org/InStock"
					: "http://schema.org/SoldOut",
			seller: {
				"@type": "Person",
				name: "Pascale Canal",
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
			name: painting.value?.artist || "Pascale Canal",
		},
		dateCreated: painting.value?.date || new Date().toISOString(),
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `${baseUrl}/${route.params.slug}`,
		},
	}),

	defineBreadcrumb({
		itemListElement: [
			{
				name: "Accueil",
				item: baseUrl,
			},
			{
				name: () => painting.value?.name || "Œuvre",
				item: () => `${baseUrl}/${route.params.slug}`,
			},
		],
	}),
]);
</script>

<template>
	<main class="relative min-h-screen pt-10">
		<ClientOnly v-if="painting">
			<!-- Navigation -->
			<PaintingNavigation @go-back="goBack" />

			<!-- En-tête -->
			<PaintingHeader :painting="painting" />

			<!-- Contenu principal -->
			<section
				class="grid grid-cols-1 md:grid-cols-2 items-end gap-10 md:gap-15 lg:gap-20">
				<!-- Galerie d'images -->
				<PaintingGallery :painting="painting" />

				<!-- Informations et actions -->
				<PaintingInfo
					:painting="painting"
					:format-price="formatPrice"
					:format-date="formatDate"
					@open-contact="openContactOverlay" />

				<div class="hidden lg:block"></div>

				<!-- Description -->
				<PaintingDescription
					v-if="painting.description"
					:description="painting.description" />
			</section>
		</ClientOnly>

		<div v-else class="text-center py-12">
			<p class="text-xl">Peinture non trouvée</p>
		</div>

		<!-- Suggestions -->
		<ClientOnly>
			<SuggestionsPaintings
				v-if="painting?.id"
				:current-painting-id="painting.id" />
		</ClientOnly>

		<!-- Modal de contact -->
		<Teleport to="body">
			<Transition name="overlay">
				<ContactModal
					v-if="showContactOverlay"
					:painting="painting"
					:contact-type="contactType"
					:form-loaded="formLoaded"
					@close="closeContactOverlay"
					@form-loaded="formLoaded = true"
					@modal-ref="setModalRef" />
			</Transition>
		</Teleport>
	</main>
</template>

<style scoped>
.overlay-enter-active,
.overlay-leave-active {
	transition: opacity 0.2s ease;
}

.overlay-enter-from,
.overlay-leave-to {
	opacity: 0;
}
</style>
