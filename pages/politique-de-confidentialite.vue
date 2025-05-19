<script setup>
import { ref } from "vue";

const config = useRuntimeConfig();

const baseUrl = config.public.siteUrl;
const siteName = config.public.siteName;

const lastUpdated = ref(new Date().toLocaleDateString("fr-FR"));

useSeoMeta({
	title: () => `Politique de Confidentialité | ${siteName}`,
	description:
		"Découvrez notre politique de confidentialité qui détaille comment nous collectons, utilisons et protégeons vos données personnelles sur notre site.",
	ogTitle: () => `Politique de Confidentialité | ${siteName}`,
	ogDescription:
		"Découvrez notre politique de confidentialité qui détaille comment nous collectons, utilisons et protégeons vos données personnelles sur notre site.",
	ogUrl: () => `${baseUrl}/politique-de-confidentialite`,
	twitterTitle: () => `Politique de Confidentialité | ${siteName}`,
	twitterDescription:
		"Découvrez notre politique de confidentialité qui détaille comment nous collectons, utilisons et protégeons vos données personnelles sur notre site.",
	twitterUrl: () => `${baseUrl}/politique-de-confidentialite`,
});
</script>

<template>
	<div class="privacy-policy container mx-auto px-4 md:px-6 py-8 md:py-12">
		<h1 class="text-2xl md:text-3xl lg:text-4xl font-apercuBold mb-6 md:mb-8">
			Politique de Confidentialité
		</h1>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-apercuMediumbold mb-3">1. Introduction</h2>
			<p class="text-sm md:text-base">
				Cette politique de confidentialité a pour but d'informer les
				visiteurs du site d'exposition en ligne des œuvres de Pascale Canal sur la collecte,
				l'utilisation et la protection de leurs données personnelles.
			</p>
		</section>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-apercuMediumbold mb-3">
				2. Données Collectées
			</h2>
			<p class="text-sm md:text-base mb-3">
				Lorsque vous utilisez notre formulaire de contact pour vous renseigner sur les œuvres
				ou initier un processus d'achat, les informations suivantes peuvent être collectées :
			</p>
			<ul class="list-disc ml-6 text-sm md:text-base mb-3">
				<li class="mb-1">Nom et prénom</li>
				<li class="mb-1">Adresse e-mail</li>
				<li class="mb-1">Numéro de téléphone (facultatif)</li>
				<li class="mb-1">Message concernant votre intérêt pour les œuvres</li>
				<li class="mb-1">Informations relatives à votre demande d'exposition ou d'achat</li>
			</ul>
		</section>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-apercuMediumbold mb-3">
				3. Utilisation des Données
			</h2>
			<p class="text-sm md:text-base">
				Les données collectées sont utilisées pour répondre à vos demandes d'information sur les œuvres de
				Pascale Canal, faciliter le processus d'achat et organiser d'éventuelles expositions. 
				Ces informations ne sont ni revendues, ni partagées avec des tiers sans votre consentement explicite.
			</p>
		</section>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-apercuMediumbold mb-3">
				4. Conservation des Données
			</h2>
			<p class="text-sm md:text-base">
				Les données personnelles transmises via le formulaire de contact sont
				conservées pendant une durée maximale de 3 ans après le dernier contact, 
				conformément aux recommandations de la CNIL, sauf obligation légale contraire.
				Les données relatives aux transactions sont conservées conformément aux obligations légales.
			</p>
		</section>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-apercuMediumbold mb-3">
				5. Droits des Utilisateurs
			</h2>
			<p class="text-sm md:text-base mb-3">
				Conformément au Règlement Général sur la Protection des Données (RGPD),
				vous disposez des droits suivants :
			</p>
			<ul class="list-disc ml-6 text-sm md:text-base mb-3">
				<li class="mb-1">
					Droit d'accès, de rectification et de suppression de vos données
					personnelles
				</li>
				<li class="mb-1">Droit d'opposition au traitement de vos données</li>
				<li class="mb-1">Droit à la portabilité des données</li>
				<li class="mb-1">Droit de retirer votre consentement à tout moment</li>
			</ul>
			<p class="text-sm md:text-base">
				Pour exercer ces droits, contactez-nous à
				<a
					:href="`mailto:${contactEmail}`"
					class="text-primary hover:underline"
					>{{ contactEmail }}</a
				>.
			</p>
		</section>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-apercuMediumbold mb-3">
				6. Sécurité des Données
			</h2>
			<p class="text-sm md:text-base">
				Nous mettons en place des mesures de sécurité appropriées afin de protéger vos
				données personnelles contre tout accès non autorisé, altération, divulgation ou
				destruction.
			</p>
		</section>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-apercuMediumbold mb-3">
				7. Cookies et Suivi
			</h2>
			<p class="text-sm md:text-base">
				Ce site utilise uniquement des cookies techniques essentiels au fonctionnement du site.
				Aucun cookie publicitaire ou de suivi n'est utilisé sur ce site d'exposition artistique.
			</p>
		</section>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-apercuMediumbold mb-3">
				8. Modifications de la Politique de Confidentialité
			</h2>
			<p class="text-sm md:text-base">
				Nous nous réservons le droit de modifier cette politique à tout moment pour refléter les évolutions
				légales ou celles de nos pratiques. La date de la dernière mise à jour sera indiquée ci-dessous.
			</p>
		</section>

		<p class="text-xs md:text-sm mt-8 text-gray-500">
			Dernière mise à jour : {{ lastUpdated }}
		</p>
	</div>
</template>

<style scoped>
.privacy-policy {
	max-width: 1000px;
}

h1,
h2 {
	color: var(--color-black);
}

p,
ul {
	color: var(--color-text, #374151);
}

.text-primary {
	color: var(--color-primary, #4f46e5);
}

@media (max-width: 640px) {
	.privacy-policy {
		padding: 16px;
	}
}
</style>
