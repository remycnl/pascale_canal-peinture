<script setup>
defineProps({
	description: {
		type: String,
		required: true,
	},
});
</script>

<template>
	<article class="prose max-w-none text-grayDark md:col-span-2 2xl:col-span-1">
		<p class="mt-4 text-sm md:text-lg lg:text-xl leading-relaxed">
			{{ description }}
		</p>
	</article>
</template>
