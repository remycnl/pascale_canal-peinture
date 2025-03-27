<script setup>
import { useSchemaOrg } from "#imports";

const config = useRuntimeConfig();

const baseUrl = config.public.siteUrl;
const siteName = config.public.siteName;

const sections = [
	{
		number: "01",
		title: "Découvre ma collection",
		description: {
			text: "Parcoures ma galerie de tableaux en cliquant {link:ici:/}. Prends ton temps pour explorer les œuvres et trouver celle qui te correspond le mieux.",
		},
	},
	{
		number: "02",
		title: "Sélectionne ton tableau",
		description: {
			text: 'Une fois ton tableau préféré trouvé, clique sur le bouton "Acheter" présent sur sa page pour débuter le processus d\'achat.',
		},
	},
	{
		number: "03",
		title: "Remplis le formulaire",
		description: {
			text: "Suis les étapes du formulaire pour renseigner tes informations de contact, choisir ton mode de paiement et préciser tes préférences de livraison. Si tu as des demandes spécifiques, tu peux les mentionner dans la section prévue à cet effet.",
		},
	},
	{
		number: "04",
		title: "Confirmation de ta demande",
		description: {
			text: "Après avoir soumis le formulaire, je te contacterai sous 48 heures ouvrées pour valider ta commande, répondre à tes questions et discuter des détails du paiement et de la livraison.",
		},
	},
	{
		number: "05",
		title: "Validation du paiement",
		description: {
			text: "Une fois que nous avons confirmé ensemble les modalités de paiement, effectue le règlement via le moyen convenu (virement bancaire, PayPal, etc.).",
		},
	},
	{
		number: "06",
		title: "Préparation et expédition",
		description: {
			text: "Dès réception du paiement, je prépare soigneusement ton tableau pour l’expédition. Il sera emballé avec précaution afin d’assurer sa protection lors du transport.",
		},
	},
	{
		number: "07",
		title: "Livraison",
		description: {
			text: "Ton tableau sera expédié à l’adresse indiquée selon le mode de livraison choisi. Un numéro de suivi te sera communiqué pour suivre son acheminement.",
		},
	},
	{
		number: "08",
		title: "Réception et satisfaction",
		description: {
			text: "Une fois ton tableau reçu, assure-toi qu’il est en parfait état. Si tout est conforme, profite pleinement de ton œuvre ! En cas de problème, contacte-moi pour trouver une solution.",
		},
	},
];

const isEven = (index) => (index + 1) % 2 === 0;

function renderDescription(description) {
	const parts = [];
	const linkRegex = /{link:([^:]+):([^}]+)}/g;

	let lastIndex = 0;
	let match;

	while ((match = linkRegex.exec(description.text)) !== null) {
		// Add text before link
		if (match.index > lastIndex) {
			parts.push({
				text: description.text.substring(lastIndex, match.index),
				isLink: false,
			});
		}

		// Add link
		parts.push({
			text: match[1],
			to: match[2],
			isLink: true,
		});

		lastIndex = match.index + match[0].length;
	}

	// Add remaining text
	if (lastIndex < description.text.length) {
		parts.push({
			text: description.text.substring(lastIndex),
			isLink: false,
		});
	}

	return parts;
}

useSeoMeta({
	title: () => `Comment ça marche ? | ${siteName}`,
	description: () =>
		`Découvrez le processus d'achat pour acquérir une œuvre originale de Pascale Canal. De la sélection à la livraison de votre tableau, suivez notre guide en ${sections.length} étapes.`,
	ogTitle: () => `Comment ça marche ? | ${siteName}`,
	ogDescription: () =>
		`Découvrez le processus d'achat pour acquérir une œuvre originale de Pascale Canal. De la sélection à la livraison de votre tableau, suivez notre guide en ${sections.length} étapes.`,
	ogUrl: () => `${baseUrl}/comment-ca-marche`,
	twitterTitle: () => `Comment ça marche ? | ${siteName}`,
	twitterDescription: () =>
		`Découvrez le processus d'achat pour acquérir une œuvre originale de Pascale Canal. De la sélection à la livraison de votre tableau, suivez notre guide en ${sections.length} étapes.`,
	twitterUrl: () => `${baseUrl}/comment-ca-marche`,
});

useSchemaOrg([
	defineBreadcrumb({
		itemListElement: [
			{
				name: "Accueil",
				item: "/",
			},
			{
				name: "Comment ça marche ?",
				item: "/comment-ca-marche",
			},
		],
	}),
]);
</script>

<template>
	<div class="relative min-h-screen pt-10 md:pt-20">
		<h1
			class="flex flex-col text-4xl sm:text-5xl md:text-7xl lg:text-8xl 2xl:text-[180px] leading-tight 2xl:leading-[180px] font-apercuBold text-left w-full sm:w-3/4 2xl:w-2/3">
			Comment ça marche ?
		</h1>

		<div
			class="my-20 md:my-30 lg:my-50 flex flex-col items-center gap-y-10 sm:gap-y-20 md:gap-y-30 lg:gap-y-40 2xl:gap-y-50">
			<div
				v-for="(section, index) in sections"
				:key="section.number"
				:class="`flex ${
					isEven(index) ? 'lg:flex-row-reverse' : 'lg:flex-row'
				} flex-col justify-between w-full h-fit lg:h-80 rounded-2xl bg-black text-white`">
				<span
					:class="`text-[100px] sm:text-[200px] md:text-[300px] lg:text-[550px] leading-[70px] sm:leading-[150px] md:leading-[220px] lg:leading-[400px] tracking-tighter ${
						isEven(index)
							? 'text-end -mr-2 sm:-mr-4 md:-mr-6 lg:-mr-10'
							: 'text-start -ml-3 sm:-ml-6 md:-ml-9 lg:-ml-30'
					} font-apercuBold select-none`">
					{{ section.number }}
				</span>
				<div
					class="flex flex-col justify-center gap-y-5 w-full lg:w-1/2 p-5 sm:p-10">
					<h2
						class="text-xl sm:text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-apercuBold">
						{{ section.title }}
					</h2>
					<p
						class="text-sm sm:text-base md:text-lg lg:text-xl 2xl:text-2xl text-gray-500">
						<template
							v-for="(part, i) in renderDescription(section.description)">
							<NuxtLink
								v-if="part.isLink"
								:to="part.to"
								:key="i"
								class="underline">
								{{ part.text }}
							</NuxtLink>
							<template v-else>
								{{ part.text }}
							</template>
						</template>
					</p>
				</div>
			</div>
		</div>
	</div>
</template>
