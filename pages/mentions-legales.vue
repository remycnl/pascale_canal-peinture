<script setup>
import { ref } from "vue";

const config = useRuntimeConfig();

const baseUrl = config.public.siteUrl;
const siteName = config.public.siteName;

const lastUpdated = ref(new Date().toLocaleDateString("fr-FR"));

useSeoMeta({
  title: () => `Mentions Légales | ${siteName}`,
  description: "Mentions légales du site de Pascale Canal, artiste peintre. Informations sur les droits d'auteur, la protection des données et les responsabilités.",
  ogTitle: () => `Mentions Légales | ${siteName}`,
  ogDescription: "Mentions légales du site de Pascale Canal, artiste peintre. Informations sur les droits d'auteur, la protection des données et les responsabilités.",
  ogUrl: () => `${baseUrl}/mentions-legales`,
  twitterTitle: () => `Mentions Légales | ${siteName}`,
  twitterDescription: "Mentions légales du site de Pascale Canal, artiste peintre. Informations sur les droits d'auteur, la protection des données et les responsabilités.",
  twitterUrl: () => `${baseUrl}/mentions-legales`,
});
</script>

<template>
	<div class="legal-mentions container mx-auto px-4 md:px-6 py-8 md:py-12">
		<h1 class="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8">
			Mentions Légales
		</h1>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-semibold mb-3">
				1. Informations Générales
			</h2>
			<p class="mb-2"><strong>Propriétaire du site :</strong> Pascale Canal</p>
			<p class="mb-2"><strong>Statut :</strong> Artiste indépendante</p>
			<p class="mb-2">
				<strong>Email :</strong>
				<a
					href="mailto:contact@remycanal.me"
					class="text-primary hover:underline"
					>contact@remycanal.me</a
				>
			</p>
			<p class="mb-2">
				<strong>Hébergeur :</strong> Vercel -
				<a href="https://vercel.com" class="text-primary hover:underline"
					>vercel.com</a
				>
			</p>
			<p class="mb-2">
				<strong>Responsable de la publication :</strong> Pascale Canal
			</p>
		</section>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-semibold mb-3">
				2. Propriété Intellectuelle
			</h2>
			<p class="text-sm md:text-base">
				L'ensemble des œuvres présentées sur ce site (images, textes,
				illustrations) sont la propriété exclusive de Pascale Canal, sauf
				mention contraire. Toute reproduction, distribution ou utilisation sans
				autorisation écrite est strictement interdite.
			</p>
		</section>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-semibold mb-3">
				3. Protection des Données Personnelles
			</h2>
			<p class="text-sm md:text-base mb-3">
				Conformément au RGPD, les informations collectées via le formulaire de
				contact sont utilisées uniquement pour répondre aux demandes et ne sont
				en aucun cas revendues à des tiers.
			</p>
			<ul class="list-disc ml-6 text-sm md:text-base mb-3">
				<li class="mb-1">
					Accès, rectification ou suppression des données personnelles
				</li>
				<li class="mb-1">Opposition au traitement des données</li>
				<li class="mb-1">Demande de portabilité des données</li>
			</ul>
			<p class="text-sm md:text-base">
				Pour exercer ces droits, contactez-nous à
				<a
					href="mailto:contact@remycanal.me"
					class="text-primary hover:underline"
					>contact@remycanal.me</a
				>.
			</p>
		</section>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-semibold mb-3">4. Responsabilités</h2>
			<p class="text-sm md:text-base">
				Le propriétaire du site s'efforce d'assurer l'exactitude et la mise à
				jour des informations, mais ne saurait être tenu responsable des erreurs
				ou omissions.
			</p>
		</section>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-semibold mb-3">5. Liens Externes</h2>
			<p class="text-sm md:text-base">
				Le site peut contenir des liens vers des sites tiers. Pascale Canal ne
				peut être tenue responsable du contenu de ces sites ni des éventuels
				dommages qu'ils pourraient causer.
			</p>
		</section>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-semibold mb-3">6. Droit Applicable</h2>
			<p class="text-sm md:text-base">
				Les présentes mentions légales sont soumises au droit français. En cas
				de litige, les tribunaux français seront seuls compétents.
			</p>
		</section>

		<p class="text-xs md:text-sm mt-8 text-gray-500">
			Dernière mise à jour : {{ lastUpdated }}
		</p>
	</div>
</template>

<style scoped>
.legal-mentions {
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
	.legal-mentions {
		padding: 16px;
	}
}
</style>
