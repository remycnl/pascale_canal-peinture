<script setup>
import { useSchemaOrg } from "#imports";
import { usePageTitle } from "@/composables/usePageTitle";

const config = useRuntimeConfig();

const baseUrl = config.public.siteUrl;
const siteName = config.public.siteName;

const { setPageTitle } = usePageTitle();
setPageTitle(`Qui suis-je ? | ${siteName}`);

useSeoMeta({
	title: () => `Qui suis-je ? | ${siteName}`,
	description:
		"Découvrez l'univers de Pascale Canal, artiste peintre inspirée par les terres sauvages de l'Aubrac. Une peinture qui capture l'essence des paysages et des animaux à travers des teintes de noir, blanc, gris et or.",
	ogTitle: () => `Qui suis-je ? | ${siteName}`,
	ogDescription:
		"Découvrez l'univers de Pascale Canal, artiste peintre inspirée par les terres sauvages de l'Aubrac. Une peinture qui capture l'essence des paysages et des animaux à travers des teintes de noir, blanc, gris et or.",
	ogUrl: () => `${baseUrl}/qui-suis-je`,
	ogImage: () => `${baseUrl}/img/pascalecanal.jpg`,
	ogImageAlt: "Portrait de l'artiste Pascale Canal",
	twitterTitle: () => `Qui suis-je ? | ${siteName}`,
	twitterDescription:
		"Découvrez l'univers de Pascale Canal, artiste peintre inspirée par les terres sauvages de l'Aubrac. Une peinture qui capture l'essence des paysages et des animaux à travers des teintes de noir, blanc, gris et or.",
	twitterImage: () => `${baseUrl}/img/pascalecanal.jpg`,
	twitterUrl: () => `${baseUrl}/qui-suis-je`,
});

useSchemaOrg([
	defineBreadcrumb({
		itemListElement: [
			{
				name: "Accueil",
				item: "/",
			},
			{
				name: "Qui suis-je ?",
				item: "/qui-suis-je",
			},
		],
	}),
]);
</script>

<template>
	<main class="relative min-h-screen text-white pt-10 md:pt-20">
		<h1
			data-lag="0.5"
			class="flex flex-col text-4xl sm:text-5xl md:text-7xl lg:text-8xl 2xl:text-[180px] leading-tight 2xl:leading-[180px] font-apercuBold text-left w-full">
			Qui suis-je ?
		</h1>
		<div class="hidden lg:flex mt-50 justify-end gap-50">
			<div class="w-2/3"></div>
			<figure class="z-20 parallax w-2/5 h-auto">
				<div data-speed="0.9" class="relative w-full h-full">
					<div
						class="parallax-strong absolute inset-0 w-full h-full bg-yellow rounded-2xl"></div>
					<NuxtImg
						src="/img/pascalecanal.jpg"
						alt="Portrait de Pascale Canal, artiste peintre de l'Aubrac"
						title="Pascale Canal, artiste peintre"
						format="webp"
						@contextmenu.prevent
						class="grayscale object-cover pointer-events-none brightness-70 contrast-110 shadow-custom w-full h-full rounded-2xl" />
				</div>
			</figure>
		</div>
		<article>
			<ZigzagLine>
				<h2
					data-speed="0.7"
					class="text-3xl -mb-18 md:-mb-48 md:mt-30 lg:mt-0 lg:mb-0 sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl lg:w-3/5 font-apercuBold uppercase text-right lg:text-left">
					Pascale Canal
				</h2>
				<figure class="lg:hidden flex justify-end">
					<NuxtImg
						src="/img/pascalecanal.jpg"
						alt="Portrait de Pascale Canal, artiste peintre de l'Aubrac"
						title="Pascale Canal, artiste peintre"
						format="webp"
						@contextmenu.prevent
						class="grayscale brightness-70 object-cover pointer-events-none contrast-110 w-full max-w-md h-full rounded-lg md:rounded-2xl" />
				</figure>
				<section class="relative">
					<p
						class="z-50 relative text-shadow text-base sm:text-lg md:text-2xl lg:text-3xl 2xl:text-4xl sm:w-3/5">
						Je cherche à saisir une présence, un regard, une atmosphère. Mon
						univers est peuplé de personnages, d'animaux et de paysages, posés à
						la lisière du réel et de l'émotion. Chaque tableau est un instant
						suspendu, un hommage à la simplicité qui nous relie à l'essentiel.
					</p>
					<span
						class="lg:hidden z-10 select-none pointer-events-none absolute top-50 -left-130 w-200 h-auto opacity-50 md:opacity-90 blur-2xl">
						<NuxtImg
							data-inverse-speed="0.7"
							src="/svg/blob_yellow-1.svg"
							alt="Blob yellow"
							title="Blob yellow"
							role="presentation"
							@contextmenu.prevent />
					</span>
				</section>
				<section class="relative">
					<p
						class="z-50 relative text-shadow text-base sm:text-lg md:text-2xl lg:text-3xl 2xl:text-4xl flex justify-end">
						<span class="sm:w-3/5">
							J'utilise la peinture à l'huile avec une palette volontairement
							réduite: le noir, le blanc, le gris, et quelques touches d'or.
							Ces couleurs ne sont pas seulement un choix esthétique, mais un
							véritable langage. Le noir porte la profondeur et l'intensité, le
							blanc apporte la lumière et l'espace pour respirer, le gris évoque
							le temps qui passe, les silences, les nuances. Quant à l'or,
							discret mais essentiel, il révèle l'émotion, la chaleur et l'éclat
							intérieur.
						</span>
					</p>
					<span
						class="lg:hidden z-10 select-none pointer-events-none absolute top-50 -right-130 w-200 h-auto opacity-50 md:opacity-90 blur-2xl">
						<NuxtImg
							src="/svg/blob_yellow-2.svg"
							alt="Blob yellow"
							title="Blob yellow"
							role="presentation"
							@contextmenu.prevent />
					</span>
				</section>
				<section>
					<p
						class="z-50 relative text-shadow text-base sm:text-lg md:text-2xl lg:text-3xl 2xl:text-4xl sm:w-3/5">
						Qu'il s'agisse d'un animal attachant, d'un visage inspirant ou d'un
						paysage familier, je cherche à peindre au-delà de l'image pour
						révéler ce qui vibre, ce qui touche, ce qui demeure.
					</p>
				</section>
				<section>
					<p
						class="z-50 relative text-shadow text-base sm:text-lg md:text-2xl lg:text-3xl 2xl:text-4xl flex justify-end">
						<span class="sm:w-3/5">
							Je réalise également des œuvres sur commande à partir de vos
							photos. Chaque projet devient alors une rencontre, un dialogue
							avec votre histoire, vos souvenirs, vos émotions, vos animaux. À
							travers chaque toile, j'essaie de faire émerger une trace, un
							reflet, un fragment d'âme, quelque chose de vrai et d'unique qui
							vous touche.
						</span>
					</p>
				</section>
				<div class="z-50 flex justify-end">
					<div class="sm:w-3/5">
						<p
							class="z-50 text-shadow text-base sm:text-lg md:text-2xl lg:text-3xl 2xl:text-4xl">
							C'est de là que ma peinture s'inspire.
						</p>
					</div>
				</div>
				<nav
					class="z-50 flex flex-col md:flex-row items-end md:items-center justify-end gap-5 lg:-mt-80 2xl:-mt-50"
					aria-label="Navigation principale">
					<NuxtLink
						to="/contact"
						class="bg-white text-black active:scale-95 py-2 px-6 rounded-lg text-sm font-apercuBold shadow-md hover:opacity-80 transition duration-200 cursor-pointer"
						>Me contacter</NuxtLink
					>
					<NuxtLink
						to="/"
						class="border border-white active:scale-95 text-white py-2 px-6 rounded-lg text-sm font-apercuBold hover:bg-white hover:text-black transition duration-200 cursor-pointer"
						>Voir mes tableaux</NuxtLink
					>
				</nav>
			</ZigzagLine>
		</article>
	</main>
</template>
