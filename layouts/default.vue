<script setup>
import Header from "@/layouts/Header.vue";
import Footer from "@/layouts/Footer.vue";

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
</script>

<template>
	<div class="overflow-hidden app-wrapper">
		<SplashScreen />
		<Header />
		<div
			class="smooth-scroll-wrapper will-change-transform transform-gpu fixed top-0 left-0 right-0">
			<section
				class="container mx-auto mt-40 mb-60 transform-gpu will-change-transform duration-75">
				<slot />
			</section>
			<Footer />
		</div>
		<Bubble />
	</div>
</template>

<style>
.app-wrapper {
	min-height: 100vh;
	/* Cache le contenu initial jusqu'à ce que le SplashScreen soit prêt */
	opacity: 0;
	animation: showContent 0.1s forwards 0.1s;
}

@keyframes showContent {
	to {
		opacity: 1;
	}
}

/* Style global pour éviter le flash initial */
html {
	background-color: var(--color-white);
}
</style>
