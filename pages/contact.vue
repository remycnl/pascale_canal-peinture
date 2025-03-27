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
		"@id": () => `${baseUrl}/contact`,
		url: () => `${baseUrl}/contact`,
		name: "Contact Pascale Canal - Artiste Peintre",
		description:
			"Contactez Pascale Canal, artiste peintre française. Pour toute question, commission ou échange artistique.",
		inLanguage: "fr-FR",
		datePublished: new Date().toISOString(),
		dateModified: new Date().toISOString(),
		isPartOf: {
			"@type": "WebSite",
			"@id": () => `${baseUrl}/#website`,
			name: () => siteName,
			url: () => baseUrl,
		},
		breadcrumb: {
			"@type": "BreadcrumbList",
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
					name: "Contact",
					item: () => `${baseUrl}/contact`,
				},
			],
		},
		mainEntity: {
			"@type": "ContactPoint",
			contactType: "customer service",
			email: "pascalecanal@gmail.com",
			telephone: "+33686596029",
			availableLanguage: ["French", "English"],
			areaServed: ["FR", "EU", "US"],
			hoursAvailable: {
				"@type": "OpeningHoursSpecification",
				dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
				opens: "09:00",
				closes: "18:00",
			},
		},
		potentialAction: {
			"@type": "ContactAction",
			target: () => `${baseUrl}/contact`,
		},
	}),
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
