<script>
export default {
	name: "Banner",
	props: {
		mode: {
			type: String,
			default: "auto",
			validator: (value) => ["auto", "gallery", "custom"].includes(value),
		},
	},
	computed: {
		currentRoute() {
			if (this.mode === "gallery") return "galerie";
			if (this.mode === "custom") return "commande-personnalisee";

			const route = this.$route.name;
			if (route === "commande-personnalisee") return "commande-personnalisee";
			return "galerie";
		},
		title() {
			return this.currentRoute === "commande-personnalisee"
				? "Découvrez ma collection d'œuvres d'art"
				: "Immortalisez votre souvenir en œuvre d'art unique";
		},
		description() {
			return this.currentRoute === "commande-personnalisee"
				? "Explorez ma collection complète d'œuvres pour vous immerger dans mon univers artistique."
				: "Transformez vos photographies en peintures uniques réalisées à la main par Pascale Canal. Un souvenir éternel et à votre goût.";
		},
		buttonText() {
			return this.currentRoute === "commande-personnalisee"
				? "Explorer la galerie"
				: "Commander votre tableau";
		},
		targetRoute() {
			return this.currentRoute === "commande-personnalisee"
				? "/"
				: "/commande-personnalisee";
		},
	},
};
</script>

<template>
	<section
		aria-label="Banner"
		class="relative text-start animate-float my-16 overflow-hidden rounded-2xl">
		<div
			class="absolute inset-0 bg-[#000000] opacity-95"
			aria-hidden="true"></div>

		<div
			class="absolute top-0 left-0 w-40 h-40 bg-yellow/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
			aria-hidden="true"></div>
		<div
			class="absolute bottom-0 right-0 w-40 h-40 bg-yellow/50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"
			aria-hidden="true"></div>

		<div
			class="absolute top-6 left-6 right-6 h-px bg-gradient-to-r from-transparent via-yellow/40 to-transparent"
			aria-hidden="true"></div>
		<div
			class="absolute bottom-6 left-6 right-6 h-px bg-gradient-to-r from-transparent via-yellow/40 to-transparent"
			aria-hidden="true"></div>

		<div
			class="relative z-10 grid gap-10 px-8 py-12 md:grid-cols-5 md:px-12 lg:px-16">
			<div class="md:col-span-3 flex flex-col justify-center space-y-6">
				<div class="inline-block">
					<span
						class="bg-yellow/20 text-yellow px-5 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase backdrop-blur-sm">
						{{
							currentRoute === "commande-personnalisee"
								? "Inspirez-vous"
								: "Nouveauté"
						}}
					</span>
				</div>

				<h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
					{{ title }}
					<div
						class="mt-2 h-1 w-16 bg-yellow/70 rounded-full"
						aria-hidden="true"></div>
				</h2>

				<p
					class="text-gray-300/90 font-normal text-lg leading-relaxed max-w-lg">
					{{ description }}
				</p>
			</div>

			<div class="md:col-span-2 flex items-center justify-start md:justify-end">
				<NuxtLink
					:to="targetRoute"
					:aria-label="buttonText"
					class="group relative px-8 py-4 bg-transparent backdrop-blur-sm border border-yellow/40 hover:border-yellow text-yellow rounded-full font-medium transition-all active:scale-98 duration-200 ease-in-out overflow-hidden">
					<span
						class="absolute inset-0 w-0 bg-gradient-to-r from-yellow/20 to-yellow/10 transition-all duration-500 ease-out group-hover:w-full"
						aria-hidden="true"></span>
					<span class="relative inline-flex items-center">
						<span class="lg:hidden">{{ buttonText.split(" ")[0] }}</span>
						<span class="hidden lg:inline">{{ buttonText }}</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1.5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="M14 5l7 7m0 0l-7 7m7-7H3" />
						</svg>
					</span>
				</NuxtLink>
			</div>
		</div>
	</section>
</template>

<style scoped>
::selection {
	background-color: var(--color-white);
	color: var(--color-black);
}

.animate-float {
	animation: float 3s ease-in-out infinite;
}

@keyframes float {
	0% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-10px);
	}
	100% {
		transform: translateY(0);
	}
}

@media (prefers-reduced-motion: reduce) {
	.animate-float {
		animation: none;
	}
}
</style>
