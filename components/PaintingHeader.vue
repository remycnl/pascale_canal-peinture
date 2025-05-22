<script setup>
defineProps({
	painting: {
		type: Object,
		required: true,
	},
});
</script>

<template>
	<header class="text-end mb-10">
		<h1
			data-lag="0.4"
			class="text-[clamp(3rem,15vw,18rem)] leading-[clamp(3rem,16vw,19rem)] font-apercuBold tracking-wide text-black">
			{{ painting.name }}
		</h1>
		<p data-lag="0.2" class="text-grayDark text-xl md:text-2xl lg:text-4xl">
			<span class="text-xs md:text-sm lg:text-lg">peint par</span>
			{{ painting.artist }}
		</p>
	</header>
</template>
