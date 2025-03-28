<script setup>
import { useSchemaOrg } from "#imports";

const config = useRuntimeConfig();

const baseUrl = config.public.siteUrl;
const siteName = config.public.siteName;

useSeoMeta({
	title: () => `Contact | ${siteName}`,
	description:
		"Contactez Pascale Canal, artiste peintre. N'hésitez pas à me faire part de vos questions, demandes de commission ou simplement pour échanger sur l'art.",
	ogTitle: () => `Contact | ${siteName}`,
	ogDescription:
		"Contactez Pascale Canal, artiste peintre. N'hésitez pas à me faire part de vos questions, demandes de commission ou simplement pour échanger sur l'art.",
	ogUrl: () => `${baseUrl}/contact`,
	twitterTitle: () => `Contact | ${siteName}`,
	twitterDescription:
		"Contactez Pascale Canal, artiste peintre. N'hésitez pas à me faire part de vos questions, demandes de commission ou simplement pour échanger sur l'art.",
	twitterUrl: () => `${baseUrl}/contact`,
});

useSchemaOrg([
	defineWebPage({
		"@type": "ContactPage",
		url: () => `${baseUrl}/contact`,
		name: () => `Contact | ${siteName}`,
		description:
			"Contactez Pascale Canal, artiste peintre. N'hésitez pas à me faire part de vos questions, demandes de commission ou simplement pour échanger sur l'art.",
		inLanguage: "fr-FR",
		datePublished: "2023-09-15T08:00:00+02:00",
		dateModified: new Date().toISOString(),
		mainEntity: {
			"@type": "ContactPoint",
			contactType: "Customer Service",
			email: "pascalecanal@gmail.com",
			telephone: "+33686596029",
			availableLanguage: ["French", "English"],
			areaServed: ["FR", "EU", "US"],
		},
		author: {
			"@type": "Person",
			name: "Pascale Canal",
			url: () => baseUrl,
			jobTitle: "Artiste peintre",
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
		potentialAction: {
			"@type": "ContactAction",
			target: () => `${baseUrl}/contact`,
		},
	}),

	defineBreadcrumb({
		itemListElement: [
			{
				name: "Accueil",
				item: "/",
			},
			{
				name: "Contact",
				item: "/contact",
			},
		],
npm	}),
]);
</script>

<template>
	<div class="relative min-h-screen text-white pt-10 md:pt-20">
		<h1
			class="flex flex-col text-4xl sm:text-5xl md:text-7xl lg:text-8xl 2xl:text-[180px] leading-tight 2xl:leading-[180px] font-apercuBold text-left w-full sm:w-3/4 2xl:w-2/3">
			Contacte-moi
		</h1>
	</div>
</template>

<style scoped>
::selection {
	background-color: var(--color-white);
	color: var(--color-black);
}
</style>
