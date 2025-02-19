<template>
	<div class="mix-blend-difference pointer-events-none z-50 fixed top-0 left-0 w-screen h-fit">
		<div class="container mx-auto flex justify-between items-center py-7">
			<NuxtLink to="/" class="pointer-events-auto">
				<NuxtImg src="/img/logo-reversed.png" alt="Logo" class="hover:scale-105 transition-transform duration-500 w-20 h-auto" />
			</NuxtLink>
			<div
				class="flex flex-row text-white justify-end space-x-10 uppercase font-apercuBold">
				<NuxtLink
					to="/"
					class="text-line-animation pointer-events-auto"
					>Tableaux</NuxtLink
				>
				<NuxtLink
					to="/about"
					class="text-line-animation pointer-events-auto"
					>À propos</NuxtLink
				>
				<NuxtLink
					to="/contact"
					class="text-line-animation pointer-events-auto"
					>Contact</NuxtLink
				>
			</div>
		</div>
	</div>
</template>