<script setup>
import { useDarkMode } from "@/composables/useDarkMode";

const { isDarkMode } = useDarkMode();
</script>

<template>
	<footer
		:class="{ 'border-t-4 border-dotted border-white': isDarkMode }"
		aria-label="Pied de page">
		<div class="relative bg-black text-white flex flex-row md:flex-col">
			<div
				class="container-custom pt-20 pb-25 lg:pb-15 flex flex-col lg:flex-row justify-between gap-x-30 gap-y-15">
				<!-- Logo and Copyright section -->
				<div class="flex flex-col md:flex-row lg:flex-col justify-between gap-y-10 items-start md:items-end lg:items-start">
					<div class="space-y-6">
						<NuxtImg
							src="/img/logo-reversed.png"
							alt="Logo Pascale Canal Peinture"
							title="Pascale Canal - Artiste Peintre"
							format="webp"
							class="w-15 md:w-20 h-auto" />
						<div>
							<p class="text-sm">
								© {{ new Date().getFullYear() }} Pascale Canal.
							</p>
							<p class="text-sm text-gray-400 mt-2">
								Site web par
								<NuxtLink
									to="https://www.remycanal.me"
									target="_blank"
									rel="noopener noreferrer"
									class="text-yellow hover:saturate-200">
									Rémy Canal
								</NuxtLink>
							</p>
						</div>
					</div>
						<Newsletter />
				</div>
				<div
					class="flex flex-col md:flex-row justify-between gap-x-30 gap-y-15">
					<!-- Plan du site -->
					<nav aria-label="Plan du site">
						<h2 class="text-sm font-apercuBold uppercase mb-6 text-yellow">
							Plan du site
						</h2>
						<ul class="flex flex-col space-y-3 list-none p-0 m-0">
							<li>
								<NuxtLink
									to="/"
									class="w-fit text-gray-300 hover:text-yellow transition-colors">
									Tableaux
								</NuxtLink>
							</li>
							<li>
								<NuxtLink
									to="/comment-ca-marche"
									class="w-fit text-gray-300 hover:text-yellow transition-colors">
									Comment ça marche ?
								</NuxtLink>
							</li>
							<li>
								<NuxtLink
									to="/commande-personnalisee"
									class="w-fit text-gray-300 hover:text-yellow transition-colors">
									Commande personnalisée
								</NuxtLink>
							</li>
							<li>
								<NuxtLink
									to="/qui-suis-je"
									class="w-fit text-gray-300 hover:text-yellow transition-colors">
									Qui suis-je ?
								</NuxtLink>
							</li>
							<li>
								<NuxtLink
									to="/mes-evenements"
									class="w-fit text-gray-300 hover:text-yellow transition-colors">
									Mes évènements
								</NuxtLink>
							</li>
							<li>
								<NuxtLink
									to="/contact"
									class="w-fit text-gray-300 hover:text-yellow transition-colors">
									Contact
								</NuxtLink>
							</li>
						</ul>
					</nav>

					<!-- Social links -->
					<div>
						<h2 class="text-sm font-apercuBold uppercase mb-6 text-yellow">
							Réseaux sociaux
						</h2>
						<address class="flex flex-col space-y-3 not-italic">
							<NuxtLink
								to="https://www.facebook.com/pascalecanalpeintre"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Facebook Pascale Canal"
								class="w-fit text-gray-300 hover:text-yellow transition-colors flex items-center space-x-2">
								<span class="w-4 h-4 inline-block">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										aria-hidden="true">
										<path
											d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
									</svg>
								</span>
								<span>Facebook</span>
							</NuxtLink>
							<NuxtLink
								to="https://www.instagram.com/pascalecanal"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Instagram Pascale Canal"
								class="w-fit text-gray-300 hover:text-yellow transition-colors flex items-center space-x-2">
								<span class="w-4 h-4 inline-block">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										aria-hidden="true">
										<path
											d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
									</svg>
								</span>
								<span>Instagram</span>
							</NuxtLink>
							<NuxtLink
								to="https://www.linkedin.com/in/pascale-canal"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="LinkedIn Pascale Canal"
								class="w-fit text-gray-300 hover:text-yellow transition-colors flex items-center space-x-2">
								<span class="w-4 h-4 inline-block">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										aria-hidden="true">
										<path
											d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
									</svg>
								</span>
								<span>LinkedIn</span>
							</NuxtLink>
						</address>
					</div>

					<!-- Legal links -->
					<nav aria-label="Informations légales">
						<h2 class="text-sm font-apercuBold uppercase mb-6 text-yellow">
							Informations
						</h2>
						<ul class="flex flex-col space-y-3 list-none p-0 m-0">
							<li>
								<NuxtLink
									to="/faq"
									class="w-fit text-gray-300 hover:text-yellow transition-colors">
									FAQ
								</NuxtLink>
							</li>
							<li>
								<NuxtLink
									to="/mentions-legales"
									class="w-fit text-gray-300 hover:text-yellow transition-colors">
									Mentions légales
								</NuxtLink>
							</li>
							<li>
								<NuxtLink
									to="/politique-de-confidentialite"
									class="w-fit text-gray-300 hover:text-yellow transition-colors">
									Politique de confidentialité
								</NuxtLink>
							</li>
							<li>
								<NuxtLink
									to="/cgu"
									class="w-fit text-gray-300 hover:text-yellow transition-colors">
									CGU
								</NuxtLink>
							</li>
						</ul>
					</nav>
				</div>
			</div>

			<!-- Decorative text -->
			<div class="mt-20 lg:mt-30 mb-10 md:mb-0 relative" aria-hidden="true">
				<div
					class="flex flex-col md:flex-row justify-between uppercase pointer-events-none select-none font-weirdWords text-[17vw] md:text-[22vw] lg:text-[23vw] leading-[15vw] text-white">
					<span data-lag="0.4" class="md:rotate-0 -rotate-90 md:order-1 order-5"
						>C</span
					>
					<span data-lag="0.6" class="md:rotate-0 -rotate-90 md:order-2 order-4"
						>A</span
					>
					<span data-lag="0.2" class="md:rotate-0 -rotate-90 md:order-3 order-3"
						>N</span
					>
					<span data-lag="0.4" class="md:rotate-0 -rotate-90 md:order-4 order-2"
						>A</span
					>
					<span data-lag="0.2" class="md:rotate-0 -rotate-90 md:order-5 order-1"
						>L</span
					>
				</div>
				<div
					class="md:hidden flex flex-col justify-between mt-10 uppercase pointer-events-none select-none font-weirdWords text-[17vw] leading-[15vw] text-white">
					<span class="-rotate-90 order-7">P</span>
					<span class="-rotate-90 order-6">A</span>
					<span class="-rotate-90 order-5">S</span>
					<span class="-rotate-90 order-4">C</span>
					<span class="-rotate-90 order-3">A</span>
					<span class="-rotate-90 order-2">L</span>
					<span class="-rotate-90 order-1">E</span>
				</div>
			</div>
		</div>
	</footer>
</template>
