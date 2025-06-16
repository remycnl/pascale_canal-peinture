<script setup>
import { ref } from "vue";
import { usePageTitle } from "@/composables/usePageTitle";

const config = useRuntimeConfig();

const baseUrl = config.public.siteUrl;
const siteName = config.public.siteName;

const { setPageTitle } = usePageTitle();
setPageTitle(`Conditions Générales d'Utilisation | ${siteName}`);

const lastUpdated = ref(new Date().toLocaleDateString("fr-FR"));

useSeoMeta({
	title: () => `Conditions Générales d'Utilisation | ${siteName}`,
	description:
		"Conditions générales d'utilisation du site. Informations sur les règles d'utilisation, la propriété intellectuelle et les responsabilités.",
	ogTitle: () => `Conditions Générales d'Utilisation | ${siteName}`,
	ogDescription:
		"Conditions générales d'utilisation du site. Informations sur les règles d'utilisation, la propriété intellectuelle et les responsabilités.",
	ogUrl: () => `${baseUrl}/cgu`,
	twitterTitle: () => `Conditions Générales d'Utilisation | ${siteName}`,
	twitterDescription:
		"Conditions générales d'utilisation du site. Informations sur les règles d'utilisation, la propriété intellectuelle et les responsabilités.",
	twitterUrl: () => `${baseUrl}/cgu`,
});
</script>

<template>
	<div class="cgu container mx-auto px-4 md:px-6 py-8 md:py-12">
		<h1 class="text-2xl md:text-3xl lg:text-4xl font-apercuBold mb-6 md:mb-8">
			Conditions Générales d'Utilisation
		</h1>

		<div class="mb-6 md:mb-8">
			<p class="text-sm md:text-base italic mb-4">
				Ce document définit les conditions d'utilisation du site de l'artiste Pascale Canal, galerie d'art en ligne présentant ses œuvres.
			</p>
		</div>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-apercuMediumbold mb-3">1. Introduction</h2>
			<p class="text-sm md:text-base">
				Les présentes Conditions Générales d'Utilisation (CGU) définissent les
				règles et obligations liées à l'utilisation du site web de l'artiste Pascale Canal,
				plateforme dédiée à l'exposition et la promotion de ses œuvres d'art.
			</p>
		</section>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-apercuMediumbold mb-3">
				2. Acceptation des Conditions
			</h2>
			<p class="text-sm md:text-base">
				L'utilisation du site implique l'acceptation pleine et entière des
				présentes CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas
				utiliser ce site.
			</p>
		</section>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-apercuMediumbold mb-3">3. Contenu et Œuvres</h2>
			<p class="text-sm md:text-base">
				Les images et descriptions des œuvres d'art présentées sur ce site sont la propriété
				exclusive de Pascale Canal. Elles sont présentées à titre informatif et pour faciliter
				la prise de contact en vue d'achat ou d'exposition.
			</p>
		</section>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-apercuMediumbold mb-3">
				4. Propriété Intellectuelle
			</h2>
			<p class="text-sm md:text-base">
				L'ensemble du contenu du site (œuvres, textes, images, logos, etc.) est protégé
				par les lois sur la propriété intellectuelle et les droits d'auteur. Toute reproduction,
				représentation ou utilisation non autorisée des œuvres de Pascale Canal est strictement interdite.
			</p>
		</section>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-apercuMediumbold mb-3">5. Processus d'Achat</h2>
			<p class="text-sm md:text-base">
				Ce site permet d'initier un processus d'achat par prise de contact. Aucune transaction
				n'est réalisée directement sur le site. Tout achat fera l'objet d'un contrat séparé
				entre l'artiste et l'acheteur selon les modalités convenues.
			</p>
		</section>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-apercuMediumbold mb-3">
				6. Expositions et Collaborations
			</h2>
			<p class="text-sm md:text-base">
				Les demandes concernant l'exposition des œuvres de Pascale Canal dans des galeries,
				événements ou autres lieux peuvent être soumises via le formulaire de contact.
				Chaque demande sera étudiée individuellement.
			</p>
		</section>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-apercuMediumbold mb-3">
				7. Modifications des CGU
			</h2>
			<p class="text-sm md:text-base">
				Les présentes CGU peuvent être modifiées à tout moment. L'utilisateur
				est invité à les consulter régulièrement.
			</p>
		</section>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-apercuMediumbold mb-3">
				8. Protection des Données
			</h2>
			<p class="text-sm md:text-base">
				Les informations recueillies via le formulaire de contact sont utilisées uniquement
				pour répondre aux demandes concernant les œuvres, les achats potentiels ou les expositions.
				Aucune donnée n'est partagée avec des tiers. Conformément au RGPD, vous disposez d'un droit
				d'accès, de rectification et de suppression de vos données.
			</p>
		</section>

		<p class="text-xs md:text-sm mt-8 text-gray-500">
			Dernière mise à jour : {{ lastUpdated }}
		</p>
	</div>
</template>

<style scoped>
.cgu {
	max-width: 1000px;
}

h1,
h2 {
	color: var(--color-black);
}

p {
	color: var(--color-text, #374151);
}

.text-primary {
	color: var(--color-primary, #4f46e5);
}

@media (max-width: 640px) {
	.cgu {
		padding: 16px;
	}
}
</style>
