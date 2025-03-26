<script setup>
import { Analytics } from "@vercel/analytics/nuxt";
import Header from "@/layouts/Header.vue";
import Footer from "@/layouts/Footer.vue";

const activeTitle = ref("Pascale Canal | Artiste Peintre • Exposition en ligne");
const inactiveTitle = ref("I miss you... 🥺");

useSeoMeta({
	title: "Pascale Canal | Artiste Peintre • Exposition en ligne",
	description:
		"Explorez les œuvres de Pascale Canal, artiste peintre française. Découvrez ses tableaux dans une exposition en ligne, avec des détails et l'inspiration derrière chaque création.",
	canonical: "https://www.pascalecanal.com",
	keywords:
		"Pascale Canal, Artiste peintre, Exposition en ligne, Tableaux, Art , Peinture, Vente d'art, Artiste française",
	ogTitle: "Pascale Canal | Artiste Peintre • Exposition en ligne",
	ogDescription:
		"Découvrez les œuvres de Pascale Canal, artiste peintre française, à travers une exposition en ligne interactive. Informations sur les prix, techniques et inspirations disponibles.",
	ogUrl: "https://www.pascalecanal.com",
	ogSiteName: "Pascale Canal | Artiste Peintre • Exposition en ligne",
	ogType: "website",
	ogImage: "https://www.pascalecanal.com/img/metaImg.png",
	ogImageAlt: "Aperçu des tableaux de Pascale Canal",
	ogLocale: "fr_FR",
	twitterTitle: "Exposition en ligne • Pascale Canal | Artiste Peintre",
	twitterDescription:
		"Parcourez l'exposition en ligne des œuvres de Pascale Canal, artiste peintre française. Détails sur les tableaux inclus.",
	twitterImage: "https://www.pascalecanal.com/img/metaImg.png",
	twitterUrl: "https://www.pascalecanal.com",
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
			href: "https://pascale-canal-peinture.vercel.app/favicon.ico",
			id: "favicon",
		},
		{
			rel: "apple-touch-icon",
			sizes: "180x180",
			href: "https://pascale-canal-peinture.vercel.app/img/logo.png",
		},
		{
			rel: "canonical",
			href: "https://pascale-canal-peinture.vercel.app/",
		},
	],
});

const setSEO = () => {
	if (import.meta.client) {
		document.addEventListener("visibilitychange", function () {
			if (document.visibilityState === "hidden") {
				document.title = inactiveTitle.value;
			} else {
				document.title = activeTitle.value;
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
    *            portfolio! :)               *
    *                                        *
    ******************************************
    `);
	}

	setInterval(() => {
		currentFaviconIndex = (currentFaviconIndex + 1) % favicons.length;
		const faviconElement = document.querySelector('link[rel="icon"]');
		if (faviconElement) {
			faviconElement.href = favicons[currentFaviconIndex];
		}
	}, 1000);
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
