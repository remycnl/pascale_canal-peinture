<script setup>
import { ref, onMounted } from "vue";
import { useLoading } from "@/composables/useLoading";

const loading = useLoading();
const isVisible = ref(true);

onMounted(() => {
	isVisible.value = false;
	loading.value = false;
});
</script>

<template>
	<div
		v-if="isVisible"
		class="splash-screen"
		:class="{ 'fade-out': !isVisible }"
		role="status"
		aria-label="Loading">
		<NuxtImg
			src="/img/logo.png"
			alt="Pascale Canal Peinture - Logo"
			title="Pascale Canal Peinture"
			format="webp"
			class="w-40 h-auto logo-animation"
			:class="{ 'scale-active': isVisible }"
			fetchpriority="high" />
	</div>
</template>

<style scoped>
.splash-screen {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: var(--color-white);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 9999;
	opacity: 1;
	transition: opacity 0.5s ease;
}

.logo-animation {
	transform: scale(1);
	transition: transform 0.8s ease;
	animation: continuousScale 1s infinite linear;
}

@keyframes continuousScale {
	0% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.2);
	}
	100% {
		transform: scale(1);
	}
}

.fade-out {
	opacity: 0;
	pointer-events: none;
}
</style>
