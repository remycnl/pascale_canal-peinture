<script setup>
import { onMounted, onUnmounted } from "vue";
import { Analytics } from "@vercel/analytics/nuxt";
import Header from "@/layouts/Header.vue";
import Footer from "@/layouts/Footer.vue";
import { useSchemaOrg } from "#imports";
import { usePageTitle } from "@/composables/usePageTitle";

const config = useRuntimeConfig();
const route = useRoute();

const baseUrl = config.public.siteUrl;
const siteName = config.public.siteName;

const { pageTitle, inactiveTitle } = usePageTitle();

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

onMounted(() => {
	if (import.meta.client) {
		if (document.title !== pageTitle.value) {
			pageTitle.value = document.title;
		}

		const handleVisibilityChange = () => {
			document.title =
				document.visibilityState === "hidden"
					? inactiveTitle.value
					: pageTitle.value;
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);

		onUnmounted(() => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		});

		console.log(
			`%c
		 &
	&&   &&                          &&
	  && &&                        &&
		 && &&&&&               &&
		 &&        &&&&       &&
		 &&     &&&&&       &&
		 &&&&&           &&
	 &&& &&               &&&
&&&&     &&                 &&&
		 &&                     &&&
		 &&                        &&&
		 &&                           &&&


%cAppreciate scrolling through my e-galery! :)
			`,
			"color: #D97757; font-weight: bold;",
			"color: #FFF083; font-weight: bold;"
		);
	}
});
</script>

<template>
	<main class="overflow-hidden">
		<Analytics />
		<LogoBackground />
		<SplashScreen />
		<Header />
		<div id="smooth-wrapper">
			<div id="smooth-content">
				<section class="container-custom py-20 md:py-30 lg:py-40">
					<slot />
				</section>
				<Footer />
			</div>
		</div>
		<Bubble />
	</main>
</template>
