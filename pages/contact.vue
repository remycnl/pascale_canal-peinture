<script setup>
import { useSchemaOrg } from "#imports";
import { usePageTitle } from "@/composables/usePageTitle";

const config = useRuntimeConfig();

const baseUrl = config.public.siteUrl;
const siteName = config.public.siteName;
const contactEmail = config.public.contactEmail;

const { setPageTitle } = usePageTitle();
setPageTitle(`Contact | ${siteName}`);

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
			email: () => contactEmail,
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
	}),
]);
</script>

<template>
	<main class="relative min-h-screen text-white pt-10 md:pt-20">
		<header>
			<h1
				data-lag="0.2"
				class="lg:-ml-2 flex flex-col text-4xl sm:text-5xl md:text-7xl lg:text-8xl 2xl:text-[180px] leading-tight 2xl:leading-[180px] font-apercuBold text-left w-full">
				Contacte-moi
			</h1>
			<p
				data-lag="0.1"
				class="mt-4 text-xl md:text-2xl lg:text-4xl text-white/80 max-w-xl lg:max-w-3xl">
				Pour toute question, collaboration ou simplement pour échanger sur
				l'art.
			</p>
		</header>

		<section
			class="mt-20 md:mt-40 lg:mt-50 flex flex-col md:flex-row items-start justify-between gap-20 w-full">
			<!-- Contact Information -->
			<div class="flex flex-col space-y-10">
				<section>
					<h2 class="text-2xl md:text-3xl font-apercuBold mb-6">Coordonnées</h2>
					<address class="space-y-5 not-italic">
						<NuxtLink
							:to="`mailto:${contactEmail}`"
							target="_blank"
							rel="noopener"
							aria-label="Email Pascale Canal"
							class="w-fit flex items-center group">
							<span
								class="w-10 h-10 flex items-center justify-center mr-4 bg-white/10 rounded-full group-hover:bg-white/20 group-active:scale-90 transition-all duration-300 cursor-pointer">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="w-5 h-5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true">
									<path
										d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
									<polyline points="22,6 12,13 2,6"></polyline>
								</svg>
							</span>
							<span
								class="text-lg group-hover:text-white transition-colors duration-300">
								{{ contactEmail }}
							</span>
						</NuxtLink>
						<NuxtLink
							to="tel:+33686596029"
							target="_blank"
							rel="noopener"
							aria-label="Appeler Pascale Canal"
							class="w-fit flex items-center group">
							<span
								class="w-10 h-10 flex items-center justify-center mr-4 bg-white/10 rounded-full group-hover:bg-white/20 group-active:scale-90 transition-all duration-300 cursor-pointer">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="w-5 h-5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true">
									<path
										d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
								</svg>
							</span>
							<span
								class="text-lg group-hover:text-white transition-colors duration-300">
								+33 6 86 59 60 29
							</span>
						</NuxtLink>
					</address>
				</section>

				<section>
					<h2 class="text-2xl md:text-3xl font-apercuBold mb-6">Suivez-moi</h2>
					<nav class="flex space-x-5" aria-label="Réseaux sociaux">
						<NuxtLink
							to="https://www.instagram.com/pascalecanal"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Instagram Pascale Canal"
							class="w-12 h-12 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 active:scale-90 transform hover:scale-110 transition-all duration-300 cursor-pointer">
							<span class="w-6 h-6 inline-block">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									aria-hidden="true">
									<path
										d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
								</svg>
							</span>
						</NuxtLink>
						<NuxtLink
							to="https://www.linkedin.com/in/pascale-canal"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="LinkedIn Pascale Canal"
							class="w-12 h-12 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 active:scale-90 transform hover:scale-110 transition-all duration-300 cursor-pointer">
							<span class="w-6 h-6 inline-block">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									aria-hidden="true">
									<path
										d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
								</svg>
							</span>
						</NuxtLink>
					</nav>
				</section>
			</div>
			<!-- Contact Form -->
			<section class="w-full lg:max-w-3xl">
				<ContactForm />
			</section>
		</section>
	</main>
</template>
