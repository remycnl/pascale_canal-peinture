<script setup>
import { useSchemaOrg } from "#imports";
import { ref, onMounted, computed } from "vue";
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

const heroElement = ref(null);
</script>

<template>
	<div ref="heroElement" class="relative min-h-screen pt-10 md:pt-20">
		<!-- <cursor-images
			:paintings="personalizedPaintings"
			:container="heroElement" /> -->

		<h1
			class="flex flex-col text-shadow text-4xl sm:text-5xl md:text-7xl lg:text-8xl 2xl:text-[180px] leading-tight 2xl:leading-[180px] font-apercuBold text-left w-full sm:w-3/4 2xl:w-2/3">
			Commande personnalisée
		</h1>

		<div
			class="absolute hidden lg:block right-24 top-20 p-6 bg-white/5 backdrop-blur-sm max-w-sm rounded-xl border border-white/10">
			<p class="text-lg italic">
				Les œuvres affichées ci-dessous sont des exemples de réalisations
				personnalisées
			</p>
		</div>

		<div class="pb-16 pt-16 md:py-32">
			<infinite-carousel
				:paintings="personalizedPaintings" />
			<div class="my-16 md:my-36 md:ml-[40vw]">
				<p
					class="text-xl rounded-xl backdrop-blur-sm lg:p-10 text-shadow md:text-2xl lg:text-4xl mb-16 leading-relaxed">
					Commandez une œuvre d'art unique qui vous ressemble. Que ce soit votre
					animal de compagnie, un paysage qui vous est cher, un portrait ou une
					composition abstraite.
				</p>
			</div>

			<CustomOrderForm />
		</div>
	</div>
</template>

<style scoped>
::selection {
	background-color: var(--color-white);
	color: var(--color-black);
}
</style>
