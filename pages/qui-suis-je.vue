<template>
	<div class="relative min-h-screen text-white pt-10 md:pt-20">
		<h1
			class="flex flex-col text-4xl sm:text-5xl md:text-7xl lg:text-8xl 2xl:text-[180px] leading-tight 2xl:leading-[180px] font-apercuBold text-left w-full sm:w-3/4 2xl:w-2/3">
			Qui suis-je ?
		</h1>
		<div class="hidden lg:flex mt-50 justify-end gap-50">
			<div class="w-2/3"></div>
			<div class="z-20 parallax relative w-2/5 h-auto">
				<div
					class="parallax-strong absolute inset-0 w-full h-full bg-yellow rounded-2xl"></div>
				<NuxtImg
					src="/img/maman.jpg"
					alt="Une photo de moi (Pascale Canal)"
					fit="cover"
					format="webp"
					class="grayscale brightness-70 contrast-110 shadow-custom w-full h-full rounded-2xl" />
			</div>
		</div>
		<ZigzagLine>
			<h2
				class="text-3xl -mb-18 md:-mb-48 md:mt-30 lg:mt-0 lg:mb-0 sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl lg:w-3/5 font-apercuBold uppercase text-right lg:text-left">
				Pascale Canal
			</h2>
			<div class="lg:hidden flex justify-end">
				<NuxtImg
					src="/img/maman.jpg"
					alt="Une photo de moi (Pascale Canal)"
					fit="cover"
					format="webp"
					class="grayscale brightness-70 contrast-110 w-full max-w-md h-full rounded-lg md:rounded-2xl" />
			</div>
			<div class="relative">
				<p
					class="z-50 relative text-shadow text-base sm:text-lg md:text-2xl lg:text-3xl 2xl:text-4xl sm:w-3/5">
					C’est le cœur ancré dans les terres sauvages de l’Aubrac, ses paysages
					bruts et puissants, que je puise mon inspiration. Entre terres
					infinies et terre de labeur, ma peinture explore le lien profond qui
					unit les hommes à ces paysages : vaches, taureaux et veaux d’Aubrac,
					symboles à la fois de force et de douceur, d'authenticité et de
					simplicité.
				</p>
				<span
					class="z-10 select-none parallax pointer-events-none absolute top-50 -left-130 w-200 h-auto opacity-50 md:opacity-90 blur-2xl">
					<NuxtImg src="/svg/blob_yellow-1.svg" alt="Blob yellow" />
				</span>
			</div>
			<div class="relative">
				<p
					class="z-50 relative text-shadow text-base sm:text-lg md:text-2xl lg:text-3xl 2xl:text-4xl flex justify-end">
					<span class="sm:w-3/5">
						Je peins à l’huile, privilégiant des dominantes de noir, blanc, gris
						et doré. Ces teintes, entre ombre et éclat, traduisent l’essence
						même de l’Aubrac : le noir pour sa profondeur, sa pierre volcanique
						et son ancrage, le blanc pour la neige mais aussi pour la lumière
						qui sculpte les formes et révèle les contrastes, le gris pour le
						temps qui passe et la brume des matins, et l’or enfin, qui évoque
						l’éclat du soleil couchant sur les robes fauves des troupeaux.
					</span>
				</p>
				<span
					class="z-10 select-none parallax-reverse pointer-events-none absolute top-50 -right-130 w-200 h-auto opacity-50 md:opacity-90 blur-2xl">
					<NuxtImg src="/svg/blob_yellow-2.svg" alt="Blob yellow" />
				</span>
			</div>
			<p
				class="z-50 relative text-shadow text-base sm:text-lg md:text-2xl lg:text-3xl 2xl:text-4xl sm:w-3/5">
				À travers leurs yeux doux et maquillés, je cherche à capturer la
				présence de ces animaux, ce lien ancestral qui les unit à leur
				territoire et aux hommes et femmes passionnés qui veillent sur eux avec
				exigence et respect.
			</p>
			<p
				class="z-50 relative text-shadow text-base sm:text-lg md:text-2xl lg:text-3xl 2xl:text-4xl flex justify-end">
				<span class="sm:w-3/5">
					Chaque tableau est une rencontre, une émotion, une histoire. Chaque
					toile est une invitation à la contemplation, à la méditation, à la
					poésie. Chaque œuvre est un hommage à la nature, à la vie, à la
					beauté.
				</span>
			</p>
			<div class="z-50 relative flex justify-end">
				<div class="sm:w-3/5 relative">
					<p
						class="z-50 relative text-shadow text-base sm:text-lg md:text-2xl lg:text-3xl 2xl:text-4xl">
						C'est de là que ma peinture s'inspire.
					</p>
					<span
						class="z-10 hidden md:block select-none parallax pointer-events-none absolute -top-60 left-80 rotate-25 w-130 h-auto opacity-90 blur-2xl">
						<NuxtImg src="/svg/blob_yellow-3.svg" alt="Blob yellow" />
					</span>
				</div>
			</div>
			<div
				class="z-50 flex flex-col md:flex-row items-end md:items-center justify-end gap-5 lg:-mt-80 2xl:-mt-50">
				<NuxtLink
					to="/contact"
					class="bg-white text-black py-2 px-6 rounded-lg text-sm font-bold shadow-md hover:opacity-80 transition duration-300"
					>Me contacter</NuxtLink
				>
				<NuxtLink
					to="/"
					class="border border-white text-white py-2 px-6 rounded-lg text-sm font-bold hover:bg-white hover:text-black transition duration-300"
					>Voir mes tableaux</NuxtLink
				>
			</div>
		</ZigzagLine>
	</div>
</template>

<style scoped>
::selection {
	background-color: var(--color-white);
	color: var(--color-black);
}
</style>
