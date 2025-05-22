<script setup>
const props = defineProps({
	painting: {
		type: Object,
		required: true,
	},
	selectImage: {
		type: String,
		required: true,
	},
	miniPreviewStyle: {
		type: Object,
		required: true,
	},
});

const emit = defineEmits(["select-image"]);
</script>

<template>
	<div class="absolute bottom-4 md:top-4 right-4 flex md:flex-col gap-2">
		<!-- Bouton image normale -->
		<button
			@click.stop="emit('select-image', 'normal')"
			:class="[
				'w-12 h-12 md:w-16 md:h-16 rounded-lg border-2 overflow-hidden transition-all duration-200',
				selectImage === 'normal'
					? 'border-yellow shadow-lg scale-105'
					: 'border-white/50 hover:border-white hover:scale-105',
			]"
			title="Vue normale">
			<NuxtImg
				:src="painting.image"
				alt="Vue normale"
				class="w-full h-full object-cover" />
		</button>

		<!-- Bouton preview salon -->
		<button
			@click.stop="emit('select-image', 'preview')"
			:class="[
				'w-12 h-12 md:w-16 md:h-16 rounded-lg border-2 overflow-hidden transition-all duration-200',
				selectImage === 'preview'
					? 'border-yellow shadow-lg scale-105'
					: 'border-white/50 hover:border-white hover:scale-105',
			]"
			title="Aperçu dans le salon">
			<div class="relative w-full h-full">
				<!-- Mini salon -->
				<div
					class="absolute inset-0 bg-cover bg-center"
					style="background-image: url('/img/mockup-living-room.webp')"></div>

				<!-- Mini tableau avec calcul proportionnel optimisé -->
				<div class="absolute transform-gpu" :style="miniPreviewStyle">
					<!-- Ombre du tableau -->
					<div
						class="absolute inset-0 transform translate-x-0.5 translate-y-1 bg-black opacity-20 blur-sm rounded-xs"></div>

					<!-- Image du tableau -->
					<NuxtImg
						:src="painting.image"
						alt="Mini aperçu"
						class="relative w-full h-full object-cover rounded-xs"
						:style="{
							filter: 'drop-shadow(1px 2px 3px rgba(0, 0, 0, 0.3))',
						}" />
				</div>
			</div>
		</button>
	</div>
</template>
