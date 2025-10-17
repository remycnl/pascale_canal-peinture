<script setup>
import { computed, ref } from "vue";
import { useFAQs } from "@/composables/useFAQs";
import { useSchemaOrg } from "#imports";
import { usePageTitle } from "@/composables/usePageTitle";

const config = useRuntimeConfig();

const baseUrl = config.public.siteUrl;
const siteName = config.public.siteName;

const { faqs, pending, error, refresh } = useFAQs();

const { setPageTitle } = usePageTitle();
setPageTitle(`Foire aux questions | ${siteName}`);

const openFAQs = ref(new Set());

const sortedFAQs = computed(() =>
	(faqs.value || [])
		.filter(
			(faq) =>
				faq.isActive === true && faq.question?.trim() && faq.answer?.trim()
		)
		.sort((a, b) => (a.order || 0) - (b.order || 0))
		.map((faq) => ({
			...faq,
			isOpen: openFAQs.value.has(faq.id)
		}))
);

const toggleFAQ = (faq) => {
	if (openFAQs.value.has(faq.id)) {
		openFAQs.value.delete(faq.id);
	} else {
		openFAQs.value.add(faq.id);
	}
};

useSeoMeta({
	title: () => `Foire aux questions | ${siteName}`,
	description:
		"Découvrez les réponses aux questions fréquemment posées sur l'œuvre de Pascale Canal, artiste peintre. Informations sur ses techniques, inspirations et processus créatif.",
	ogTitle: () => `Foire aux questions | ${siteName}`,
	ogDescription:
		"Découvrez les réponses aux questions fréquemment posées sur l'œuvre de Pascale Canal, artiste peintre. Informations sur ses techniques, inspirations et processus créatif.",
	ogUrl: () => `${baseUrl}/faq`,
	twitterTitle: () => `Foire aux questions | ${siteName}`,
	twitterDescription:
		"Découvrez les réponses aux questions fréquemment posées sur l'œuvre de Pascale Canal, artiste peintre. Informations sur ses techniques, inspirations et processus créatif.",
	twitterUrl: () => `${baseUrl}/faq`,
});

useSchemaOrg([
	defineWebPage({
		"@type": "FAQPage",
		name: () => `Foire aux questions | ${siteName}`,
		description:
			"Découvrez les réponses aux questions fréquemment posées sur l'œuvre de Pascale Canal, artiste peintre. Informations sur ses techniques, inspirations et processus créatif.",
		inLanguage: "fr-FR",
		datePublished: "2023-09-15T08:00:00+02:00",
		dateModified: new Date().toISOString(),
		url: () => `${baseUrl}/faq`,
		mainEntity: computed(() =>
			sortedFAQs.value.map((faq) => ({
				"@type": "Question",
				name: () => faq.question,
				acceptedAnswer: {
					"@type": "Answer",
					text: () => faq.answer,
				},
			}))
		),
		author: {
			"@type": "Person",
			name: "Pascale Canal",
			url: () => baseUrl,
			jobTitle: "Artiste peintre",
			sameAs: [
				"https://www.instagram.com/pascale.canal.art/",
			],
		},
		publisher: {
			"@type": "Person",
			name: "Pascale Canal",
			url: () => baseUrl,
		},
		isPartOf: {
			"@type": "WebSite",
			name: () => siteName,
			url: () => baseUrl,
		},
	}),

	defineBreadcrumb({
		itemListElement: [
			{
				name: "Accueil",
				item: "/",
			},
			{
				name: "FAQ",
				item: "/faq",
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
				<span data-lag="0.5" class="block xs:inline">Foire aux</span>
				<span data-lag="0.3" class="block xs:inline">Questions</span>
			</h1>
		</header>

		<section class="mt-20 lg:mt-30 space-y-4 md:space-y-6" aria-label="FAQ Section">
			<!-- Loading skeleton -->
			<div v-if="pending" class="space-y-4">
				<div v-for="i in 5" :key="`skeleton-${i}`" 
					 class="bg-gray-100 rounded-2xl p-6 animate-pulse">
					<div class="h-6 bg-gray-200 rounded-lg w-3/4 mb-3"></div>
					<div class="h-4 bg-gray-200 rounded-lg w-1/2"></div>
				</div>
			</div>

			<!-- Error state -->
			<div v-else-if="error" class="text-center py-16">
				<div class="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
					<div class="text-red-500 mb-4">
						<svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
						</svg>
					</div>
					<h3 class="text-lg font-apercuBold text-red-900 mb-2">Erreur de chargement</h3>
					<p class="text-red-700 mb-4">Impossible de charger les questions fréquentes.</p>
					<button @click="refresh()" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
						Réessayer
					</button>
				</div>
			</div>

			<!-- Empty state -->
			<div v-else-if="!sortedFAQs.length" class="text-center py-16">
				<div class="bg-gray-50 border border-gray-200 rounded-2xl p-8 max-w-md mx-auto">
					<div class="text-gray-400 mb-4">
						<svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
					</div>
					<h3 class="text-lg font-apercuBold text-gray-900 mb-2">Aucune question pour le moment</h3>
					<p class="text-gray-600">Les questions fréquentes seront bientôt disponibles.</p>
				</div>
			</div>

			<!-- FAQ Cards -->
			<article
				v-for="(faq, index) in sortedFAQs"
				:key="faq.id"
				class="group opacity-0 animate-fade-in"
				:style="`animation-delay: ${800 + (index * 150)}ms`"
				itemscope
				itemtype="https://schema.org/Question">
				
				<!-- Question Card - Design moderne avec glass effect -->
				<div class="relative overflow-hidden bg-white border border-gray-200 rounded-2xl md:rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
					<!-- Gradient subtil en background -->
					<div class="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
					
					<button
						@click="toggleFAQ(faq)"
						class="relative flex justify-between rounded-2xl md:rounded-3xl border border-white items-center gap-x-6 p-6 md:p-8 lg:p-10 cursor-pointer w-full text-left group-hover:bg-black/5 transition-all duration-300"
						:aria-expanded="faq.isOpen ? 'true' : 'false'"
						:aria-controls="`faq-answer-${faq.id}`">
						
						<!-- Question avec numérotation -->
						<div class="flex items-start gap-4 w-full">
							<span class="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-black text-white rounded-full flex items-center justify-center text-sm md:text-base font-apercuBold transition-all duration-300 group-hover:scale-110">
								{{ index + 1 }}
							</span>
							<h2 class="text-lg md:text-xl lg:text-2xl xl:text-3xl font-apercuBold text-gray-900 leading-tight" itemprop="name">
								{{ faq.question }}
							</h2>
						</div>
						
						<!-- Icône animée -->
						<div class="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-100 group-hover:bg-black group-hover:text-white transition-all duration-300 flex items-center justify-center">
							<svg
								:class="{ 'rotate-180': faq.isOpen }"
								class="w-6 h-6 md:w-7 md:h-7 transition-all duration-300"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden="true">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2.5"
									d="M19 9l-7 7-7-7"></path>
							</svg>
						</div>
					</button>
				</div>

				<!-- Answer Card - Design élégant -->
				<div 
					:id="`faq-answer-${faq.id}`"
					class="transition-height "
					:class="[
						faq.isOpen ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0',
						!faq.isOpen ? 'closing' : ''
					]"
					itemprop="acceptedAnswer"
					itemscope
					itemtype="https://schema.org/Answer">
					<div class="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 shadow-sm"
						 itemprop="text">
						<div class="prose prose-xl max-w-none text-gray-700 leading-relaxed text-lg md:text-xl lg:text-2xl">
							{{ faq.answer }}
						</div>
					</div>
				</div>
			</article>

			<!-- CTA Banner -->
			<div v-if="sortedFAQs.length" class="opacity-0 animate-fade-in" style="animation-delay: 1.5s;">
				<Banner 
					title="Vous ne trouvez pas votre réponse ?"
					description="N'hésitez pas à me contacter directement pour toute question spécifique sur mon travail artistique ou pour obtenir des informations personnalisées."
					button-text="Me contacter"
					button-text-mobile="Contact"
					target-route="/contact"
					badge="Contact" />
			</div>
		</section>
	</main>
</template>

<style>
@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(30px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes slideInFromLeft {
	from {
		opacity: 0;
		transform: translateX(-30px);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
}

@keyframes scaleIn {
	from {
		opacity: 0;
		transform: scale(0.95);
	}
	to {
		opacity: 1;
		transform: scale(1);
	}
}

.animate-fade-in {
	animation: fadeIn 0.8s ease-out forwards;
}

.animate-slide-in {
	animation: slideInFromLeft 0.6s ease-out forwards;
}

.animate-scale-in {
	animation: scaleIn 0.5s ease-out forwards;
}

/* Amélioration de la transition pour les hauteurs variables */
.transition-height {
	transition: max-height 0.25s cubic-bezier(0.4, 0, 0.2, 1), 
	           opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1), 
	           margin-top 0.25s cubic-bezier(0.4, 0, 0.2, 1),
	           transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Optimisation pour la fermeture rapide */
.transition-height.closing {
	transition: opacity 0.1s cubic-bezier(0.4, 0, 1, 1),
	           max-height 0.2s cubic-bezier(0.4, 0, 1, 1),
	           margin-top 0.2s cubic-bezier(0.4, 0, 1, 1),
	           transform 0.2s cubic-bezier(0.4, 0, 1, 1);
}

/* Effets de hover sophistiqués */
.group:hover .hover-lift {
	transform: translateY(-2px);
}

/* Animation du gradient de texte */
.bg-gradient-to-r {
	background-size: 200% 200%;
	animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {
	0% { background-position: 0% 50%; }
	50% { background-position: 100% 50%; }
	100% { background-position: 0% 50%; }
}

/* Amélioration des shadows */
.shadow-elegant {
	box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
	           0 2px 4px -1px rgba(0, 0, 0, 0.06),
	           0 0 0 1px rgba(0, 0, 0, 0.05);
}

.shadow-elegant-hover {
	box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
	           0 10px 10px -5px rgba(0, 0, 0, 0.04),
	           0 0 0 1px rgba(0, 0, 0, 0.05);
}

/* Style pour le loading skeleton */
@keyframes pulse {
	0%, 100% { opacity: 1; }
	50% { opacity: 0.5; }
}

.animate-pulse {
	animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Améliorations typographiques */
.prose {
	line-height: 1.7;
}

.prose p {
	margin-bottom: 1.25em;
}

/* Focus states améliorés pour l'accessibilité */
button:focus-visible {
	outline: 2px solid #000;
	outline-offset: 2px;
}

/* Responsive improvements */
@media (max-width: 768px) {
	.group:hover {
		transform: none;
	}
	
	.shadow-elegant-hover {
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
		           0 2px 4px -1px rgba(0, 0, 0, 0.06);
	}
}
</style>
