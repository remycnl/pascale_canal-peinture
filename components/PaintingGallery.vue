<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
	painting: {
		type: Object,
		required: true,
	},
});

const imageRef = ref(null);
const isZoomed = ref(false);
const mousePosition = ref({ x: 0, y: 0 });
const transformOrigin = ref("center");
const zoomLevel = 2.5;
const imageLoaded = ref(false);
const selectImage = ref("normal");
const isTransitioning = ref(false);

const responsiveContainerSize = computed(() => {
	return (typeof window !== "undefined" ? window.innerWidth : 768) < 768
		? 48
		: 64;
});

const miniPreviewStyle = computed(() => {
	if (!props.painting) return {};

	const size = responsiveContainerSize.value;
	const baseScale = 0.22;
	const aspectRatio = props.painting.width / props.painting.height;

	let finalWidth, finalHeight;

	if (aspectRatio > 1) {
		finalWidth = size * baseScale;
		finalHeight = finalWidth / aspectRatio;
	} else {
		finalHeight = size * baseScale;
		finalWidth = finalHeight * aspectRatio;
	}

	return {
		width: `${finalWidth}px`,
		height: `${finalHeight}px`,
		left: `calc(50% - ${finalWidth / 2}px)`,
		top: `calc(27% - ${finalHeight / 2}px)`,
	};
});

const transform = computed(() => {
	return isZoomed.value ? `scale(${zoomLevel})` : "scale(1)";
});

watch(selectImage, (newValue, oldValue) => {
	if (newValue !== oldValue) {
		isTransitioning.value = true;
		isZoomed.value = false;
		transformOrigin.value = "center";

		setTimeout(() => {
			isTransitioning.value = false;
		}, 300);
	}
});

const handleImageLoad = () => {
	imageLoaded.value = true;
};

const calculatePosition = (e) => {
	const rect = e.currentTarget.getBoundingClientRect();
	const x = ((e.clientX - rect.left) / rect.width) * 100;
	const y = ((e.clientY - rect.top) / rect.height) * 100;
	return { x, y };
};

const handleClick = (e) => {
	if (isTransitioning.value) return;

	e.preventDefault();
	e.stopPropagation();
	const pos = calculatePosition(e);
	transformOrigin.value = `${pos.x}% ${pos.y}%`;
	isZoomed.value = !isZoomed.value;
};

const handleMouseMove = (e) => {
	if (!isZoomed.value || isTransitioning.value) return;
	const pos = calculatePosition(e);
	mousePosition.value = pos;
	transformOrigin.value = `${pos.x}% ${pos.y}%`;
};

const handleMouseLeave = () => {
	if (isZoomed.value && !isTransitioning.value) {
		isZoomed.value = false;
	}
};

const handleSelectImage = (newValue) => {
	selectImage.value = newValue;
};

const imageTransitionClasses = {
	enterActiveClass: "transition-all duration-300 ease-out",
	enterFromClass: "opacity-0 scale-90",
	enterToClass: "opacity-100 scale-100",

	leaveActiveClass: "transition-all duration-300 ease-in",
	leaveFromClass: "opacity-100 scale-100",
	leaveToClass: "opacity-0 scale-110",
};
</script>

<template>
	<figure
		class="relative overflow-hidden rounded-2xl"
		:class="[
			selectImage === 'preview'
				? 'aspect-square'
				: painting.width === painting.height
				? 'aspect-square'
				: 'aspect-auto',
		]"
		@mousemove="handleMouseMove"
		@mouseleave="handleMouseLeave"
		@click="handleClick"
		:style="{
			cursor: isTransitioning ? 'default' : isZoomed ? 'zoom-out' : 'zoom-in',
		}">
		<Transition
			:enter-active-class="imageTransitionClasses.enterActiveClass"
			:enter-from-class="imageTransitionClasses.enterFromClass"
			:enter-to-class="imageTransitionClasses.enterToClass"
			:leave-active-class="imageTransitionClasses.leaveActiveClass"
			:leave-from-class="imageTransitionClasses.leaveFromClass"
			:leave-to-class="imageTransitionClasses.leaveToClass"
			mode="out-in">
			<!-- Preview component -->
			<painting-preview
				v-if="selectImage === 'preview'"
				key="preview"
				:painting-image="painting.image"
				:width="painting.width"
				:height="painting.height"
				:selected-view="selectImage"
				@select-view="handleSelectImage"
				:style="{
					transform: transform,
					transformOrigin: transformOrigin,
					transition: isZoomed ? 'none' : 'all 0.3s ease',
				}"
				@contextmenu.prevent />

			<!-- Image normale -->
			<div v-else key="normal" class="relative w-full h-full">
				<!-- Loading placeholder -->
				<div
					v-if="!imageLoaded"
					class="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse flex items-center justify-center"
					aria-hidden="true">
					<div class="w-16 h-16 text-gray-400">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1"
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
					</div>
				</div>

				<!-- Image principale -->
				<NuxtImg
					:src="painting.image"
					:alt="`Tableau '${painting.name}' peint par ${painting.artist}`"
					:title="painting.name"
					ref="imageRef"
					@contextmenu.prevent
					@load="handleImageLoad"
					:style="{
						transform: transform,
						transformOrigin: transformOrigin,
						transition: isZoomed ? 'none' : 'all 0.3s ease',
						opacity: imageLoaded ? 1 : 0,
					}"
					loading="eager"
					class="rounded-2xl object-cover w-full h-full object-center" />
			</div>
		</Transition>

		<!-- Sélecteur d'images -->
		<ImageSelector
			:painting="painting"
			:select-image="selectImage"
			:mini-preview-style="miniPreviewStyle"
			@select-image="handleSelectImage" />

		<figcaption class="sr-only">
			{{ painting.name }} - {{ painting.description }}
		</figcaption>
	</figure>
</template>

<style scoped>
.transition-all {
	transition-property: all;
}

.duration-300 {
	transition-duration: 300ms;
}

.ease-out {
	transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}

.ease-in {
	transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
}

.opacity-0 {
	opacity: 0;
}

.opacity-100 {
	opacity: 1;
}

.scale-90 {
	transform: scale(0.9);
}

.scale-100 {
	transform: scale(1);
}

.scale-110 {
	transform: scale(1.1);
}
</style>
