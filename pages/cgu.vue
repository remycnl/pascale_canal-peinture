<script setup>
import { ref } from "vue";

const config = useRuntimeConfig();

const baseUrl = config.public.siteUrl;
const siteName = config.public.siteName;

const lastUpdated = ref(new Date().toLocaleDateString("fr-FR"));

useSeoMeta({
  title: () => `Conditions Générales d'Utilisation | ${siteName}`,
  description: "Conditions générales d'utilisation du site. Informations sur les règles d'utilisation, la propriété intellectuelle et les responsabilités.",
  ogTitle: () => `Conditions Générales d'Utilisation | ${siteName}`,
  ogDescription: "Conditions générales d'utilisation du site. Informations sur les règles d'utilisation, la propriété intellectuelle et les responsabilités.",
  ogUrl: () => `${baseUrl}/cgu`,
  twitterTitle: () => `Conditions Générales d'Utilisation | ${siteName}`,
  twitterDescription: "Conditions générales d'utilisation du site. Informations sur les règles d'utilisation, la propriété intellectuelle et les responsabilités.",
  twitterUrl: () => `${baseUrl}/cgu`,
});
</script>

<template>
	<div class="cgu container mx-auto px-4 md:px-6 py-8 md:py-12">
		<h1 class="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8">
			Conditions Générales d'Utilisation
		</h1>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-semibold mb-3">1. Introduction</h2>
			<p class="text-sm md:text-base">
				Les présentes Conditions Générales d'Utilisation (CGU) définissent les
				règles et obligations liées à l'utilisation du site web.
			</p>
		</section>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-semibold mb-3">
				2. Acceptation des Conditions
			</h2>
			<p class="text-sm md:text-base">
				L'utilisation du site implique l'acceptation pleine et entière des
				présentes CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas
				utiliser ce site.
			</p>
		</section>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-semibold mb-3">3. Accès au Site</h2>
			<p class="text-sm md:text-base">
				Le site est accessible gratuitement à tout utilisateur disposant d'un
				accès à Internet. L'utilisateur est responsable de son matériel
				informatique et de sa connexion.
			</p>
		</section>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-semibold mb-3">
				4. Propriété Intellectuelle
			</h2>
			<p class="text-sm md:text-base">
				L'ensemble du contenu du site (textes, images, logos, etc.) est protégé
				par les lois sur la propriété intellectuelle. Toute reproduction ou
				utilisation non autorisée est interdite.
			</p>
		</section>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-semibold mb-3">5. Responsabilités</h2>
			<p class="text-sm md:text-base">
				L'éditeur du site ne saurait être tenu responsable des erreurs,
				omissions ou indisponibilités du site.
			</p>
		</section>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-semibold mb-3">
				6. Liens Hypertextes
			</h2>
			<p class="text-sm md:text-base">
				Le site peut contenir des liens vers d'autres sites. L'éditeur ne peut
				être tenu responsable du contenu de ces sites externes.
			</p>
		</section>

		<section class="mb-6 md:mb-8">
			<h2 class="text-lg md:text-xl font-semibold mb-3">
				7. Modifications des CGU
			</h2>
			<p class="text-sm md:text-base">
				Les présentes CGU peuvent être modifiées à tout moment. L'utilisateur
				est invité à les consulter régulièrement.
			</p>
		</section>

		<p class="text-xs md:text-sm mt-8 text-gray-500">
			Dernière mise à jour : {{ lastUpdated }}
		</p>
	</div>
</template>

<style scoped>
.cgu {
	max-width: 1000px;
}

h1,
h2 {
	color: var(--color-black);
}

p {
	color: var(--color-text, #374151);
}

.text-primary {
	color: var(--color-primary, #4f46e5);
}

@media (max-width: 640px) {
	.cgu {
		padding: 16px;
	}
}
</style>
