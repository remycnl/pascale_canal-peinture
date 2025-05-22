<template>
  <div class="relative w-full h-full mx-auto">
    <!-- Container principal avec aspect ratio carré -->
    <div
      ref="containerRef"
      class="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-lg"
    >
      <!-- Image de fond du salon -->
      <div
        class="absolute inset-0 w-full h-full bg-cover bg-center"
        style="background-image: url('/img/mockup-living-room.webp')"
      ></div>

      <!-- Tableau superposé -->
      <div
        v-if="paintingImage"
        class="absolute transform-gpu"
        :style="tableauStyle"
      >
        <!-- Ombre du tableau -->
        <div class="absolute inset-0 transform translate-x-1 translate-y-2 bg-black opacity-20 blur-sm rounded-sm"></div>

        <!-- Image du tableau -->
        <NuxtImg
          :src="paintingImage"
          alt="Tableau dans le salon"
          class="relative w-full h-full object-cover rounded-sm"
          :style="shadowStyle"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick } from "vue";

// Props
const props = defineProps({
  paintingImage: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  }
});

// Refs
const containerRef = ref(null);
const containerSize = ref(400);

// Calcul de la taille réelle du container
onMounted(() => {
  nextTick(() => {
    if (containerRef.value) {
      const updateSize = () => {
        containerSize.value = containerRef.value.offsetWidth;
      };
      
      updateSize();
      window.addEventListener('resize', updateSize);
      
      // Cleanup
      onUnmounted(() => {
        window.removeEventListener('resize', updateSize);
      });
    }
  });
});

// Calcul du style du tableau
const tableauStyle = computed(() => {
  const baseScale = 0.3;
  const aspectRatio = props.width / props.height;

  let finalWidth, finalHeight;

  if (aspectRatio > 1) {
    // Tableau plus large que haut
    finalWidth = containerSize.value * baseScale;
    finalHeight = finalWidth / aspectRatio;
  } else {
    // Tableau plus haut que large ou carré
    finalHeight = containerSize.value * baseScale;
    finalWidth = finalHeight * aspectRatio;
  }

  // Position centrée horizontalement, légèrement vers le haut
  const leftPosition = `calc(50% - ${finalWidth / 2}px)`;
  const topPosition = `calc(27% - ${finalHeight / 2}px)`;

  return {
    width: `${finalWidth}px`,
    height: `${finalHeight}px`,
    left: leftPosition,
    top: topPosition,
  };
});

const shadowStyle = computed(() => ({
  filter: "drop-shadow(2px 4px 8px rgba(0, 0, 0, 0.3))",
}));
</script>
