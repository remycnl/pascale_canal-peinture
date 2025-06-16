<script setup>
import { ref } from "vue";
import { usePageTitle } from "@/composables/usePageTitle";

const config = useRuntimeConfig();

const baseUrl = config.public.siteUrl;
const siteName = config.public.siteName;
const contactEmail = config.public.contactEmail;

const { setPageTitle } = usePageTitle();
setPageTitle(`Mentions Légales | ${siteName}`);

const lastUpdated = ref(new Date().toLocaleDateString("fr-FR"));

useSeoMeta({
	title: () => `Mentions Légales | ${siteName}`,
	description:
		"Mentions légales du site de Pascale Canal, artiste peintre. Informations sur les droits d'auteur, la protection des données et les responsabilités.",
	ogTitle: () => `Mentions Légales | ${siteName}`,
	ogDescription:
		"Mentions légales du site de Pascale Canal, artiste peintre. Informations sur les droits d'auteur, la protection des données et les responsabilités.",
	ogUrl: () => `${baseUrl}/mentions-legales`,
	twitterTitle: () => `Mentions Légales | ${siteName}`,
	twitterDescription:
		"Mentions légales du site de Pascale Canal, artiste peintre. Informations sur les droits d'auteur, la protection des données et les responsabilités.",
	twitterUrl: () => `${baseUrl}/mentions-legales`,
});
</script>

<template>
	<div class="legal-mentions container mx-auto px-4 md:px-6 py-8 md:py-12">
		<h1 class="text-2xl md:text-3xl lg:text-4xl font-apercuBold mb-6 md:mb-8">
			Mentions Légales
		</h1>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-apercuMediumbold mb-3">
				1. Informations Générales
			</h2>
			<p class="mb-2"><strong>Éditeur du site :</strong> Pascale Canal</p>
			<p class="mb-2"><strong>Statut :</strong> Artiste indépendante</p>
			<p class="mb-2"><strong>SIRET :</strong> 832 107 643 00013</p>
			<p class="mb-2">
				<strong>Email : </strong>
				<a
					:href="`mailto:${contactEmail}`"
					class="text-primary hover:underline"
					>{{ contactEmail }}</a
				>
			</p>
			<p class="mb-2">
				<strong>Hébergeur :</strong> Vercel Inc. - 340 S Lemon Ave #4133, Walnut, CA 91789, USA -
				<a href="https://vercel.com" class="text-primary hover:underline"
					>vercel.com</a
				>
			</p>
			<p class="mb-2">
				<strong>Directrice de la publication :</strong> Pascale Canal
			</p>
		</section>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-apercuMediumbold mb-3">
				2. Propriété Intellectuelle et Droits d'Auteur
			</h2>
			<p class="text-sm md:text-base">
				L'ensemble des œuvres d'art, images, photographies et contenus présentés sur ce site sont la propriété exclusive de Pascale Canal et sont protégés par les lois françaises et internationales relatives à la propriété intellectuelle. Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation préalable écrite de Pascale Canal.
			</p>
			<p class="text-sm md:text-base mt-2">
				Les images des œuvres d'art présentées servent uniquement à des fins de présentation et ne peuvent être utilisées à des fins commerciales par des tiers.
			</p>
		</section>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-apercuMediumbold mb-3">
				3. Protection des Données Personnelles
			</h2>
			<p class="text-sm md:text-base mb-3">
				Conformément au Règlement Général sur la Protection des Données (RGPD), les informations collectées via le formulaire de contact sont utilisées uniquement pour répondre aux demandes d'information, faciliter les transactions d'achat des œuvres d'art et organiser des expositions. Ces données ne sont en aucun cas cédées ou vendues à des tiers.
			</p>
			<p class="text-sm md:text-base mb-3">
				Les données personnelles recueillies peuvent inclure : nom, prénom, adresse email, numéro de téléphone et adresse postale pour la livraison des œuvres.
			</p>
			<ul class="list-disc ml-6 text-sm md:text-base mb-3">
				<li class="mb-1">
					Vous disposez d'un droit d'accès, de rectification et de suppression de vos données
				</li>
				<li class="mb-1">Vous pouvez vous opposer au traitement de vos données</li>
				<li class="mb-1">Vous pouvez demander la portabilité de vos données</li>
				<li class="mb-1">Vous avez le droit de retirer votre consentement à tout moment</li>
			</ul>
			<p class="text-sm md:text-base">
				Pour exercer ces droits ou pour toute question relative à vos données personnelles, contactez-nous à
				<a
					:href="`mailto:${contactEmail}`"
					class="text-primary hover:underline"
					>{{ contactEmail }}</a
				>.
			</p>
		</section>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-apercuMediumbold mb-3">4. Transactions et Ventes d'Œuvres</h2>
			<p class="text-sm md:text-base">
				Ce site facilite la mise en relation entre l'artiste et les acheteurs potentiels. Les modalités précises de vente, incluant prix, conditions de livraison, et modalités de paiement sont convenues directement avec l'artiste et feront l'objet d'un contrat séparé. Les transactions sont soumises à la législation française en vigueur.
			</p>
		</section>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-apercuMediumbold mb-3">5. Responsabilités</h2>
			<p class="text-sm md:text-base">
				Pascale Canal s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site, mais ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition. En conséquence, l'utilisateur reconnaît utiliser ces informations sous sa responsabilité exclusive.
			</p>
		</section>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-apercuMediumbold mb-3">6. Liens Externes</h2>
			<p class="text-sm md:text-base">
				Le site peut contenir des liens vers d'autres sites internet ou ressources externes. Pascale Canal n'exerce aucun contrôle sur ces sites et ressources et décline toute responsabilité quant à leur contenu.
			</p>
		</section>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-apercuMediumbold mb-3">7. Droit Applicable et Juridiction</h2>
			<p class="text-sm md:text-base">
				Les présentes mentions légales sont soumises au droit français. En cas de litige relatif à l'interprétation ou l'exécution des présentes, les tribunaux français seront seuls compétents.
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
