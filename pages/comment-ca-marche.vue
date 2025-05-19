<script setup>
import { useSchemaOrg } from "#imports";
import { ref, reactive } from "vue";

const config = useRuntimeConfig();

const baseUrl = config.public.siteUrl;
const siteName = config.public.siteName;

const activeTab = ref("standard");
const isTransitioning = ref(false);

const processTabs = [
	{ id: "standard", label: "Achat Standard" },
	{ id: "custom", label: "Commande Personnalisée" },
];

const handleTabChange = (tabId) => {
	// Active la transition
	isTransitioning.value = true;

	// Après un court délai, change l'onglet actif
	setTimeout(() => {
		activeTab.value = tabId;

		// Puis après un autre délai, désactive la transition
		setTimeout(() => {
			isTransitioning.value = false;
		}, 300); // Temps pour revenir à l'état normal
	}, 300); // Temps pour le flou complet
};

const standardSections = [
	{
		number: "01",
		title: "Découvre ma collection",
		description: {
			text: "Parcours ma galerie de tableaux en vente en cliquant {link:ici:/?forSale=true}. Prends ton temps pour explorer les œuvres et trouver celle qui te correspond le mieux.",
		},
	},
	{
		number: "02",
		title: "Sélectionne ton tableau",
		description: {
			text: 'Une fois ton tableau préféré trouvé, clique sur le bouton "Contacter pour acheter" présent sur sa page pour débuter le processus d\'achat.',
		},
	},
	{
		number: "03",
		title: "Remplis le formulaire",
		description: {
			text: "Suis les étapes du formulaire pour renseigner tes informations de contact. Si tu as des demandes spécifiques, tu peux les mentionner dans la section prévue à cet effet.",
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
			text: "Dès réception du paiement, je prépare soigneusement ton tableau pour l'expédition. Il sera emballé avec précaution afin d'assurer sa protection lors du transport.",
		},
	},
	{
		number: "07",
		title: "Livraison",
		description: {
			text: "Ton tableau sera expédié à l'adresse indiquée selon le mode de livraison choisi. Un numéro de suivi te sera communiqué pour suivre son acheminement.",
		},
	},
	{
		number: "08",
		title: "Réception et satisfaction",
		description: {
			text: "Une fois ton tableau reçu, assure-toi qu'il est en parfait état. Si tout est conforme, profite pleinement de ton œuvre !",
		},
	},
];

const customSections = [
	{
		number: "01",
		title: "Prends contact avec moi",
		description: {
			text: "Rends-toi sur la page {link:Commande personnalisée:/commande-personnalisee} et décris-moi ton projet. Plus tu seras précis(e) dans tes attentes et inspirations, plus je pourrai créer une œuvre qui te ressemble.",
		},
	},
	{
		number: "02",
		title: "Partage tes inspirations",
		description: {
			text: "Envoie-moi les photos ou références qui t'inspirent. Pour un portrait, une image en haute résolution et dans un bon éclairage naturel permettront d'obtenir un résultat plus fidèle et expressif.",
		},
	},
	{
		number: "03",
		title: "Discussion sur le style",
		description: {
			text: "Nous échangerons sur le style souhaité, le format du tableau et tout autre élément que tu souhaiterais voir apparaître dans l'œuvre.",
		},
	},
	{
		number: "04",
		title: "Proposition et devis",
		description: {
			text: "Je te proposerai un concept et un devis détaillé en fonction de tes attentes et du temps nécessaire à la réalisation. Tu pourras demander des ajustements à ce stade.",
		},
	},
	{
		number: "05",
		title: "Validation et acompte",
		description: {
			text: "Une fois le projet validé, un acompte de 30% du montant total sera demandé pour commencer le travail. Le paiement peut se faire par virement bancaire, PayPal, etc...",
		},
	},
	{
		number: "06",
		title: "Création de l'œuvre",
		description: {
			text: "Je réalise ton tableau personnalisé.",
		},
	},
	{
		number: "07",
		title: "Solde et livraison",
		description: {
			text: "Après validation, le solde du paiement sera à régler. Ton portrait sera ensuite soigneusement emballé et expédié à l'adresse de ton choix. Un numéro de suivi te sera fourni pour suivre l'acheminement.",
		},
	},
];

const sections = reactive({
	standard: standardSections,
	custom: customSections,
});

const isEven = (index) => (index + 1) % 2 === 0;

function renderDescription(description) {
	const parts = [];
	const linkRegex = /{link:([^:]+):([^}]+)}/g;

	let lastIndex = 0;
	let match;

	while ((match = linkRegex.exec(description.text)) !== null) {
		if (match.index > lastIndex) {
			parts.push({
				text: description.text.substring(lastIndex, match.index),
				isLink: false,
			});
		}

		parts.push({
			text: match[1],
			to: match[2],
			isLink: true,
		});

		lastIndex = match.index + match[0].length;
	}

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
		`Découvrez le processus d'achat pour acquérir une œuvre originale de Pascale Canal. De la sélection à la livraison de votre tableau, suivez notre guide en ${standardSections.length} étapes.`,
	ogTitle: () => `Comment ça marche ? | ${siteName}`,
	ogDescription: () =>
		`Découvrez le processus d'achat pour acquérir une œuvre originale de Pascale Canal. De la sélection à la livraison de votre tableau, suivez notre guide en ${standardSections.length} étapes.`,
	ogUrl: () => `${baseUrl}/comment-ca-marche`,
	twitterTitle: () => `Comment ça marche ? | ${siteName}`,
	twitterDescription: () =>
		`Découvrez le processus d'achat pour acquérir une œuvre originale de Pascale Canal. De la sélection à la livraison de votre tableau, suivez notre guide en ${standardSections.length} étapes.`,
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
	<main class="relative min-h-screen pt-10 md:pt-20">
		<header>
			<h1
				class="flex flex-col text-4xl sm:text-5xl md:text-7xl lg:text-8xl 2xl:text-[180px] leading-tight 2xl:leading-[180px] font-apercuBold text-left w-full">
				<span data-lag="0.5" class="block xs:inline">Comment</span>
				<span data-lag="0.3" class="block xs:inline"> ça marche ?</span>
			</h1>
		</header>

		<!-- Tab selector -->
		<nav class="flex justify-end mt-20 lg:mt-30" aria-label="Types de commandes">
			<TabSwitcher
				:tabs="processTabs"
				:initial-tab="activeTab"
				@tab-change="handleTabChange" />
		</nav>

		<section 
			class="my-10 sm:my-20 md:my-30 lg:my-40 flex flex-col items-center gap-y-10 sm:gap-y-20 md:gap-y-30 lg:gap-y-40 2xl:gap-y-50"
			:aria-label="`Processus pour ${activeTab === 'standard' ? 'achat standard' : 'commande personnalisée'}`">
			<article
				v-for="(section, index) in sections[activeTab]"
				:key="`${activeTab}-${section.number}`"
				:class="`flex ${
					isEven(index) ? 'lg:flex-row-reverse' : 'lg:flex-row'
				} flex-col p-5 sm:p-10 justify-between w-full h-fit rounded-2xl overflow-hidden lg:border-5 border-black bg-black text-white`">
				<span
					:class="`opacity-10 text-7xl sm:text-9xl lg:text-[350px] 2xl:text-[430px] lg:leading-38 2xl:leading-50 lg:translate-y-9 2xl:translate-y-12 font-weirdWords select-none ${
						isEven(index)
							? '-ml-2 lg:-ml-0 text-end'
							: '-ml-2 lg:-ml-8'
					}`"
					aria-hidden="true">
					{{ section.number }}
				</span>
				<div
					class="flex flex-col justify-center gap-y-5 w-full lg:w-1/2">
					<h2
						class="text-xl sm:text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-apercuBold transition-all duration-300 ease-in-out"
						:class="
							isTransitioning ? 'blur-md opacity-50' : 'blur-0 opacity-100'
						">
						{{ section.title }}
					</h2>
					<p
						class="text-sm sm:text-base md:text-lg lg:text-xl 2xl:text-2xl text-gray-500 transition-all duration-300 ease-in-out"
						:class="
							isTransitioning ? 'blur-md opacity-50' : 'blur-0 opacity-100'
						">
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
			</article>
		</section>
		<section>
			<Banner />
		</section>
	</main>
</template>
