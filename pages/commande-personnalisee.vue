<script setup>
import { useSchemaOrg } from "#imports";
import { computed } from "vue";
import CustomOrderForm from "@/components/CustomOrderForm.vue";

const config = useRuntimeConfig();
const baseUrl = config.public.siteUrl;
const siteName = config.public.siteName;

const metaTitle = computed(() => `Commande personnalisée | ${siteName}`);
const metaDescription = computed(
	() =>
		`Commandez une œuvre d'art personnalisée par Pascale Canal. Immortalisez votre sujet préféré dans un style unique qui vous ressemble.`
);
const metaUrl = computed(() => `${baseUrl}/commande-personnalisee`);

useSeoMeta({
	title: metaTitle,
	description: metaDescription,
	ogTitle: metaTitle,
	ogDescription: metaDescription,
	ogUrl: metaUrl,
	twitterTitle: metaTitle,
	twitterDescription: metaDescription,
	twitterUrl: metaUrl,
});

useSchemaOrg([
	defineBreadcrumb({
		itemListElement: [
			{
				name: "Accueil",
				item: "/",
			},
			{
				name: "Commande personnalisée",
				item: "/commande-personnalisee",
			},
		],
	}),
]);

const { data: personalizedPaintings } = await useFetch("/api/tagPaintings", {
	params: { tag: "COMMANDE_PERSONNALISEE" },
	transform: (data) => data || [],
});
</script>

<template>
	<main class="relative min-h-screen pt-10 md:pt-20">
		<h1
			class="flex flex-col text-4xl sm:text-5xl md:text-7xl lg:text-8xl 2xl:text-[180px] leading-tight 2xl:leading-[180px] font-apercuBold text-left w-full">
			<span data-lag="0.5" class="block xs:inline">Commande</span>
			<span data-lag="0.3" class="block xs:inline"> personnalisée</span>
		</h1>

		<aside
			class="absolute hidden lg:block right-24 top-20 p-6 bg-white/5 backdrop-blur-sm max-w-sm rounded-xl border border-white/10">
			<p class="text-lg italic">
				Les œuvres affichées ci-dessous sont des exemples de réalisations
				personnalisées
			</p>
		</aside>

		<section class="pb-5 md:pb-25">
			<div class="mt-16 md:mt-36 md:ml-[40vw]">
				<p
					class="text-xl rounded-xl backdrop-blur-sm lg:p-10 text-shadow md:text-2xl lg:text-4xl md:mb-10 leading-relaxed">
					Commandez une œuvre d'art unique qui vous ressemble. Que ce soit votre
					animal de compagnie, un paysage qui vous est cher, un portrait ou une
					composition abstraite.
				</p>
			</div>

			<section aria-label="Exemples de commandes personnalisées">
				<infinite-carousel :paintings="personalizedPaintings" />
			</section>

			<section
				id="commande-form"
				aria-label="Formulaire de commande personnalisée">
				<CustomOrderForm />
			</section>
		</section>
		<footer>
			<Banner />
		</footer>
	</main>
</template>

<style scoped>
::selection {
	background-color: var(--color-white);
	color: var(--color-black);
}
</style>
