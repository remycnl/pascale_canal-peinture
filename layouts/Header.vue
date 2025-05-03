<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";

const isOpen = ref(false);
const menuRef = ref(null);
const buttonRef = ref(null);

const toggleMenu = () => {
	isOpen.value = !isOpen.value;
};

onMounted(() => {
	const handleClickOutside = (event) => {
		if (
			isOpen.value &&
			menuRef.value &&
			!menuRef.value.contains(event.target) &&
			buttonRef.value &&
			!buttonRef.value.contains(event.target)
		) {
			isOpen.value = false;
		}
	};

	document.addEventListener("mousedown", handleClickOutside);

	onUnmounted(() => {
		document.removeEventListener("mousedown", handleClickOutside);
	});
});

watch(isOpen, (newValue) => {
	if (newValue) {
		document.body.style.overflow = "hidden";
	} else {
		document.body.style.overflow = "";
	}
});
</script>

<template>
	<header>
		<!-- Backdrop when menu is open -->
		<div
			class="fixed inset-0 w-full h-full bg-black/20 backdrop-blur-md transition-all duration-300 z-40 md:hidden"
			:class="isOpen ? 'opacity-100' : 'opacity-0 invisible'"
			@click="isOpen = false" />

		<div
			:class="[
				'pointer-events-none z-50 fixed top-0 left-0 w-screen h-fit',
				{ 'mix-blend-difference': !isOpen },
			]">
			<div
				class="container-custom flex justify-between items-center py-3 lg:py-7">
				<!-- Logo -->
				<NuxtLink
					to="/"
					class="pointer-events-auto active:scale-95 transition-transform duration-200">
					<NuxtImg
						src="/img/logo-reversed.png"
						alt="Logo"
						title="Logo"
						format="webp"
						class="hover:scale-105 transition-transform duration-500 w-15 md:w-20 h-auto" />
				</NuxtLink>

				<!-- Desktop Menu -->
				<nav
					class="hidden md:flex flex-row text-white justify-end space-x-10 uppercase font-apercuMedium">
					<NuxtLink
						to="/"
						class="active:scale-95 transition-transform duration-200 text-line-animation pointer-events-auto"
						>Tableaux</NuxtLink
					>
					<NuxtLink
						to="/comment-ca-marche"
						class="active:scale-95 transition-transform duration-200 text-line-animation pointer-events-auto"
						>Comment ça marche ?</NuxtLink
					>
					<NuxtLink
						to="/commande-personnalisee"
						class="active:scale-95 transition-transform duration-200 text-line-animation pointer-events-auto"
						>Commande personnalisée</NuxtLink
					>
					<NuxtLink
						to="/qui-suis-je"
						class="active:scale-95 transition-transform duration-200 text-line-animation pointer-events-auto"
						>Qui suis-je ?</NuxtLink
					>
					<NuxtLink
						to="/mes-evenements"
						class="active:scale-95 transition-transform duration-200 text-line-animation pointer-events-auto"
						>Mes évènements</NuxtLink
					>
					<NuxtLink
						to="/contact"
						class="active:scale-95 transition-transform duration-200 text-line-animation pointer-events-auto"
						>Contact</NuxtLink
					>
				</nav>

				<!-- Mobile Menu Button -->
				<button
					ref="buttonRef"
					@click="toggleMenu"
					class="pointer-events-auto z-150 md:hidden active:scale-90 transition-transform duration-200">
					<div
						class="hamburger p-2 rounded-xl bg-white transition-colors duration-400"
						:class="{ active: isOpen }">
						<span class="sr-only">Toggle navigation</span>
						<svg class="h-7" viewBox="0 0 32 32">
							<path
								class="line line-top-bottom"
								d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
							<path class="line" d="M7 16 27 16"></path>
						</svg>
					</div>
				</button>

				<!-- Mobile Menu -->
				<div
					ref="menuRef"
					class="pointer-events-auto absolute m-1 py-20 px-6 rounded-2xl inset-0 md:hidden w-[calc(100vw-8px)] h-fit transition-all duration-400 bg-[#000000] text-white z-50"
					:class="
						isOpen
							? 'opacity-100 translate-y-0 scale-100'
							: 'opacity-0 scale-95 translate-y-2 pointer-events-none'
					">
					<div
						class="absolute inset-0 flex items-center justify-center z-0 overflow-hidden">
						<span
							class="text-[13rem] mt-5 leading-none pointer-events-none select-none sm:text-[20rem] font-weirdWords text-white opacity-10 text-center whitespace-nowrap absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full">
							PC
						</span>
					</div>

					<div class="flex flex-col items-center gap-y-12 relative z-10">
						<nav
							class="flex flex-col text-center items-center gap-y-10 uppercase font-apercuBold text-xl">
							<NuxtLink
								@click="isOpen = false"
								to="/"
								class="w-fit active:scale-90 transition-transform duration-200">
								Tableaux
							</NuxtLink>
							<NuxtLink
								@click="isOpen = false"
								to="/comment-ca-marche"
								class="w-fit active:scale-90 transition-transform duration-200">
								Comment ça marche ?
							</NuxtLink>
							<NuxtLink
								@click="isOpen = false"
								to="/commande-personnalisee"
								class="w-fit active:scale-90 transition-transform duration-200">
								Commande personnalisée
							</NuxtLink>
							<NuxtLink
								@click="isOpen = false"
								to="/qui-suis-je"
								class="w-fit active:scale-90 transition-transform duration-200">
								Qui suis-je ?
							</NuxtLink>
							<NuxtLink
								@click="isOpen = false"
								to="/mes-evenements"
								class="w-fit active:scale-90 transition-transform duration-200">
								Mes évènements
							</NuxtLink>
							<NuxtLink
								@click="isOpen = false"
								to="/contact"
								class="w-fit active:scale-90 transition-transform duration-200">
								Contact
							</NuxtLink>
						</nav>
					</div>
				</div>
			</div>
		</div>
	</header>
</template>

<style scoped>
.hamburger svg {
	transition: transform 600ms cubic-bezier(0.4, 0, 0.2, 1);
}

.line {
	fill: none;
	stroke: #000000;
	stroke-linecap: round;
	stroke-linejoin: round;
	stroke-width: 3;
	transition: stroke-dasharray 600ms cubic-bezier(0.4, 0, 0.2, 1),
		stroke-dashoffset 600ms cubic-bezier(0.4, 0, 0.2, 1),
		stroke 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

.line-top-bottom {
	stroke-dasharray: 12 63;
}

.hamburger.active svg {
	transform: rotate(-45deg);
}

.hamburger.active svg .line-top-bottom {
	stroke-dasharray: 20 300;
	stroke-dashoffset: -32.42;
}
</style>
