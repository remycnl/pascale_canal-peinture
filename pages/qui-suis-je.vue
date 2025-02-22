<template>
	<div class="relative min-h-screen text-white pt-20">
		<h1 class="flex flex-col text-[80px] leading-[90px] text-left w-2/3">
			<span
				class="text-[180px] leading-[180px] whitespace-nowrap font-apercuBold">
				Qui suis-je ?
			</span>
		</h1>
		<div class="mt-50 flex justify-end gap-50">
			<div class="w-2/3"></div>
			<div class="parallax relative w-2/5 h-auto">
				<div class="parallax-strong absolute inset-0 w-full h-full bg-white rounded-2xl"></div>
				<NuxtImg
					src="/img/maman.jpeg"
					alt="Une photo de moi (Pascale Canal)"
					class="grayscale brightness-70 shadow-custom w-full h-full object-cover rounded-2xl" />
			</div>
		</div>
		<div class="relative w-3/5 -mt-20">
			<h2 class="text-5xl font-apercuBold uppercase leading-5xl text-left">
                Pascale Canal
            </h2>
			<p class="text-[20px] leading-[30px]">
				Je suis une artiste peintre basée à Clermont-Ferrand, spécialisée dans
				les œuvres abstraites et contemporaines. Mon travail explore les
				émotions humaines et les paysages intérieurs à travers des couleurs
				vibrantes et des textures riches. J'ai exposé mes œuvres dans plusieurs
				galeries à travers la France et j'ai participé à de nombreuses
				expositions collectives et individuelles. Mon objectif est de créer des
				pièces qui résonnent avec les spectateurs et qui apportent une touche de
				beauté et de réflexion dans leur quotidien. Si vous souhaitez en savoir
				plus sur mon travail ou discuter d'une collaboration, n'hésitez pas à me
				contacter.
			</p>
			<div class="flex items-center gap-5">
				<NuxtLink to="/contact" class="btn-primary">Me contacter</NuxtLink>
				<NuxtLink to="/" class="btn-secondary">Voir mes tableaux</NuxtLink>
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
