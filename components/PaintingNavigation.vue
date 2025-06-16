<script setup>
defineEmits(["go-back"]);
</script>

<template>
	<nav aria-label="Navigation">
		<button
			@click="$emit('go-back')"
			class="rotate-180 active:scale-90 w-10 h-10 md:w-15 md:h-15 lg:w-20 lg:h-20 cursor-pointer hover:-translate-x-2 transition-transform duration-200">
			<NuxtImg
				src="/svg/arrow-black.svg"
				alt="Retour"
        title="Retour à la page précédente"
				width="100%"
				height="100%"
				@contextmenu.prevent />
		</button>
	</nav>
</template>
