<script setup>
import { computed } from "vue";
import { useFAQs } from "@/composables/useFAQs";
import { useSchemaOrg } from "#imports";

const { faqs, pending, error, refresh } = useFAQs();

const sortedFAQs = computed(() =>
	(faqs.value || [])
		.filter(
			(faq) =>
				faq.isActive === true && faq.question?.trim() && faq.answer?.trim()
		)
		.sort((a, b) => (a.order || 0) - (b.order || 0))
);

const toggleFAQ = (faq) => {
	faq.isOpen = !faq.isOpen;
};

const config = useRuntimeConfig();

const baseUrl = config.public.siteUrl;
const siteName = config.public.siteName;

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
	defineQuestion({
		mainEntity: sortedFAQs.value.map((faq) => ({
			"@type": "Question",
			"name": () => faq.question,
			"acceptedAnswer": {
				"@type": "Answer",
				text: () => faq.answer,
			},
		})),
	}),
	defineBreadcrumb({
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Accueil",
				item: () => baseUrl,
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "FAQ",
				item: () => `${baseUrl}/faq`,
			},
		],
	}),
	defineWebPage({
		name: `Foire aux questions | ${siteName}`,
		description:
			"Découvrez les réponses aux questions fréquemment posées sur l'œuvre de Pascale Canal, artiste peintre. Informations sur ses techniques, inspirations et processus créatif.",
		inLanguage: "fr-FR",
		datePublished: "2023-09-15T08:00:00+02:00",
		dateModified: new Date().toISOString(),
		url: `${baseUrl}/faq`,
		author: {
			"@type": "Person",
			name: "Pascale Canal",
			url: baseUrl,
			jobTitle: "Artiste peintre",
			sameAs: [
				"https://www.instagram.com/pascale.canal.art/",
				"https://www.facebook.com/pascale.canal.art/",
			],
		},
		publisher: {
			"@type": "Person",
			name: "Pascale Canal",
			url: baseUrl,
		},
		isPartOf: {
			"@type": "WebSite",
			name: siteName,
			url: baseUrl,
		},
	}),
]);
</script>

<template>
	<div class="relative min-h-screen pt-10 md:pt-20">
		<h1
			class="flex flex-col text-4xl sm:text-5xl md:text-7xl lg:text-8xl 2xl:text-[180px] leading-tight 2xl:leading-[180px] font-apercuBold text-left w-full">
			Frequently
			<div></div>
			Asked Questions
		</h1>

		<div class="mt-10 md:mt-20 lg:mt-30 space-y-5 md:space-y-10">
			<div
				v-for="(faq, index) in sortedFAQs"
				:key="faq.id"
				class="bg-black active:scale-99 transition-transform border-4 md:border-5 border-black text-white rounded-2xl overflow-hidden opacity-0 animate-fade-in"
				:class="`delay-[${index * 150}ms]`">
				<div
					@click="toggleFAQ(faq)"
					class="flex justify-between items-center gap-x-5 p-3 sm:p-4 md:p-6 lg:p-8 cursor-pointer transition-colors">
					<h2
						class="w-11/12 text-base sm:text-lg md:text-xl lg:text-4xl font-aperçuBold">
						{{ faq.question }}
					</h2>
					<svg
						:class="{ 'rotate-180': faq.isOpen }"
						class="w-1/12 h-5 sm:h-6 md:h-8 lg:h-10 transition-transform"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 9l-7 7-7-7"></path>
					</svg>
				</div>

				<div
					v-if="faq.isOpen"
					class="p-3 sm:p-4 md:p-6 lg:p-8 bg-white text-sm sm:text-base md:text-lg lg:text-2xl text-gray-700">
					{{ faq.answer }}
				</div>
			</div>
		</div>
	</div>
</template>

<style>
@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.animate-fade-in {
	animation: fadeIn 0.6s ease-out forwards;
}
</style>
