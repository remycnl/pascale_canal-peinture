<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Analytics } from "@vercel/analytics/nuxt";
import Header from "@/layouts/Header.vue";
import Footer from "@/layouts/Footer.vue";
import { useSchemaOrg } from "#imports";

const config = useRuntimeConfig();
const route = useRoute();

const baseUrl = config.public.siteUrl;
const siteName = config.public.siteName;

const inactiveTitle = ref("I miss you... 🥺");
const pageTitle = ref(
	siteName || "Pascale Canal | Artiste Peintre • Exposition en ligne"
);

useSeoMeta({
	title: siteName,
	description:
		"Explorez l'univers artistique de Pascale Canal, artiste peintre française. Découvrez et achetez ses tableaux originaux dans une exposition en ligne, avec l'histoire derrière chaque création.",
	keywords:
		"Pascale Canal, tableaux originaux, peinture contemporaine, artiste peintre, galerie d'art en ligne, acheter tableau original, œuvres signées, art français",
	ogTitle: () => siteName,
	ogDescription:
		"Explorez l'univers artistique de Pascale Canal, artiste peintre française. Découvrez et achetez ses tableaux originaux dans une exposition en ligne, avec l'histoire derrière chaque création.",
	ogUrl: () => baseUrl,
	ogSiteName: () => siteName,
	ogType: "website",
	ogImage: () => `${baseUrl}/img/metaImg.png`,
	ogImageAlt: "E-galerie de Pascale Canal",
	ogLocale: "fr_FR",
	twitterTitle: () => siteName,
	twitterDescription:
		"Explorez l'univers artistique de Pascale Canal, artiste peintre française. Découvrez et achetez ses tableaux originaux dans une exposition en ligne, avec l'histoire derrière chaque création.",
	twitterImage: () => `${baseUrl}/img/metaImg.png`,
	twitterUrl: () => baseUrl,
	twitterCard: "summary_large_image",
});

useHead({
	htmlAttrs: {
		lang: "fr",
	},
	meta: [
		{
			name: "viewport",
			content: "width=device-width, initial-scale=1.0, viewport-fit=cover",
		},
	],
	link: [
		{
			rel: "icon",
			type: "image/x-icon",
			href: () => `${baseUrl}/favicon.ico`,
			id: "favicon",
		},
		{
			rel: "apple-touch-icon",
			sizes: "180x180",
			href: () => `${baseUrl}/img/fullLogo.png`,
		},
		{
			rel: "canonical",
			href: () => {
				const path = route.path;
				return path === "/" ? baseUrl : `${baseUrl}${path}`;
			},
		},
	],
});

useSchemaOrg([
	defineWebSite({
		name: () => siteName,
		description:
			"Site officiel de Pascale Canal, artiste peintre française spécialisée dans les paysages d'Aubrac",
		url: () => baseUrl,
		inLanguage: "fr-FR",
	}),
]);

const setSEO = () => {
	if (import.meta.client) {
		pageTitle.value = document.title;

		document.addEventListener("visibilitychange", function () {
			if (document.visibilityState === "hidden") {
				pageTitle.value = document.title;
				document.title = inactiveTitle.value;
			} else if (document.visibilityState === "visible") {
				document.title = pageTitle.value;
			}
		});
	}
};

onMounted(() => {
	const favicons = [
		"https://pascale-canal-peinture.vercel.app/favicon.ico",
		"https://pascale-canal-peinture.vercel.app/favicon-reversed.ico",
	];
	let currentFaviconIndex = 0;

	setSEO();

	if (import.meta.client) {
		console.log(`
	******************************************
	*                                        *
	*    Appreciate scrolling through my     *
	*            e-galery! :)               *
	*                                        *
	******************************************
	`);
	}

	const intervalId = setInterval(() => {
		currentFaviconIndex = (currentFaviconIndex + 1) % favicons.length;
		const faviconElement = document.querySelector('link[rel="icon"]');
		if (faviconElement) {
			faviconElement.href = favicons[currentFaviconIndex];
		}
	}, 1000);

	onBeforeUnmount(() => {
		clearInterval(intervalId);
	});
});
</script>

<template>
	<div class="overflow-hidden">
		<Analytics />
		<SplashScreen />
		<Header />
		<div
			class="smooth-scroll-wrapper will-change-transform transform-gpu lg:fixed top-0 left-0 right-0">
			<section
				class="container-custom mt-20 md:mt-30 lg:mt-40 mb-60 transform-gpu will-change-transform duration-75">
				<slot />
			</section>
			<Footer />
		</div>
		<Bubble />
	</div>
</template>

<style>
/* Style global pour éviter le flash initial */
html {
	background-color: var(--color-white);
}
</style>
