<script setup>
import { useSchemaOrg } from "#imports";

const config = useRuntimeConfig();
const baseUrl = config.public.siteUrl;
const siteName = config.public.siteName;

const metaTitle = computed(
	() => `Commande personnalisée de portrait animal | ${siteName}`
);
const metaDescription = computed(
	() =>
		`Commandez un portrait personnalisé de votre animal de compagnie peint par Pascale Canal. Immortalisez votre compagnon dans une œuvre d'art unique.`
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
	<div ref="heroElement" class="relative hero min-h-screen pt-10 md:pt-20">
		<h1
			class="flex flex-col text-4xl sm:text-5xl md:text-7xl lg:text-8xl 2xl:text-[180px] leading-tight 2xl:leading-[180px] font-apercuBold text-left w-full sm:w-3/4 2xl:w-2/3">
			Commande personalisée
		</h1>

		<cursor-images
			:paintings="personalizedPaintings"
			:container="heroElement" />
	</div>
</template>

<style scoped>
::selection {
	background-color: var(--color-white);
	color: var(--color-black);
}
</style>
