<script setup>
import { useSchemaOrg, ref } from "#imports";

const config = useRuntimeConfig();
const baseUrl = config.public.siteUrl;
const siteName = config.public.siteName;

const formData = ref({
	name: '',
	email: '',
	subject: '',
	message: ''
});

const isSubmitting = ref(false);
const formSubmitted = ref(false);
const formError = ref(false);

const submitForm = async () => {
	isSubmitting.value = true;
	
	try {
		// Ici vous implémenterez l'envoi de l'email
		// Par exemple avec une API route Nuxt ou un service externe
		await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation
		formSubmitted.value = true;
	} catch (error) {
		formError.value = true;
		console.error('Erreur lors de l\'envoi du message:', error);
	} finally {
		isSubmitting.value = false;
	}
};

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
	}),
]);
</script>

<template>
	<div class="relative min-h-screen text-white pt-10 md:pt-20 pb-20">
		<h1
			class="flex flex-col text-4xl sm:text-5xl md:text-7xl lg:text-8xl 2xl:text-[180px] leading-tight 2xl:leading-[180px] font-apercuBold text-left w-full sm:w-3/4 2xl:w-2/3">
			Contacte-moi
		</h1>
		
		<div class="mt-10 md:mt-20 grid md:grid-cols-2 gap-12">
			<div>
				<p class="text-xl mb-8">
					N'hésitez pas à me contacter pour toute question concernant mes œuvres, 
					une demande de commission, ou simplement pour échanger sur l'art.
				</p>
				
				<div class="space-y-6">
					<div>
						<h3 class="text-2xl font-apercuBold mb-2">Email</h3>
						<a href="mailto:pascalecanal@gmail.com" class="hover:underline">pascalecanal@gmail.com</a>
					</div>
					
					<div>
						<h3 class="text-2xl font-apercuBold mb-2">Téléphone</h3>
						<a href="tel:+33686596029" class="hover:underline">+33 6 86 59 60 29</a>
					</div>
					
					<div>
						<h3 class="text-2xl font-apercuBold mb-2">Suivez-moi</h3>
						<div class="flex space-x-4 mt-2">
							<!-- Remplacer les # par vos liens réels -->
							<a href="#" aria-label="Instagram" class="hover:opacity-70 transition-opacity">
								<span class="text-2xl">Instagram</span>
							</a>
							<a href="#" aria-label="Facebook" class="hover:opacity-70 transition-opacity">
								<span class="text-2xl">Facebook</span>
							</a>
						</div>
					</div>
				</div>
			</div>
			
			<div>
				<form v-if="!formSubmitted" @submit.prevent="submitForm" class="space-y-6">
					<div>
						<label for="name" class="block mb-2 text-lg">Nom</label>
						<input
							id="name"
							v-model="formData.name"
							type="text"
							required
							class="w-full p-3 bg-transparent border border-white/30 focus:border-white text-white"
						/>
					</div>
					
					<div>
						<label for="email" class="block mb-2 text-lg">Email</label>
						<input
							id="email"
							v-model="formData.email"
							type="email"
							required
							class="w-full p-3 bg-transparent border border-white/30 focus:border-white text-white"
						/>
					</div>
					
					<div>
						<label for="subject" class="block mb-2 text-lg">Sujet</label>
						<input
							id="subject"
							v-model="formData.subject"
							type="text"
							required
							class="w-full p-3 bg-transparent border border-white/30 focus:border-white text-white"
						/>
					</div>
					
					<div>
						<label for="message" class="block mb-2 text-lg">Message</label>
						<textarea
							id="message"
							v-model="formData.message"
							rows="6"
							required
							class="w-full p-3 bg-transparent border border-white/30 focus:border-white text-white"
						></textarea>
					</div>
					
					<div>
						<button
							type="submit"
							class="px-8 py-3 bg-white text-black font-apercuBold hover:bg-white/90 transition-colors"
							:disabled="isSubmitting"
						>
							{{ isSubmitting ? 'Envoi en cours...' : 'Envoyer' }}
						</button>
						<p v-if="formError" class="mt-3 text-red-400">
							Une erreur s'est produite. Veuillez réessayer.
						</p>
					</div>
				</form>
				
				<div v-else class="bg-white/10 p-8 text-center">
					<h3 class="text-2xl font-apercuBold mb-4">Merci pour votre message!</h3>
					<p class="mb-6">Je vous répondrai dans les plus brefs délais.</p>
					<button 
						@click="formSubmitted = false; formData = {name: '', email: '', subject: '', message: ''}"
						class="px-6 py-2 border border-white hover:bg-white hover:text-black transition-colors"
					>
						Envoyer un autre message
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
::selection {
	background-color: var(--color-white);
	color: var(--color-black);
}
</style>
