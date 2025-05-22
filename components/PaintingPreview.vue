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

    <!-- Sélecteur d'images -->
    <div class="absolute md:top-4 md:right-4 bottom-4 left-1/2 transform -translate-x-1/2 md:translate-x-0 flex md:flex-col gap-2">
      <!-- Bouton image normale -->
      <button
        @click="$emit('select-view', 'normal')"
        :class="[
          'w-12 h-12 md:w-16 md:h-16 rounded-lg border-2 overflow-hidden transition-all duration-200',
          selectedView === 'normal' 
            ? 'border-blue-500 shadow-lg scale-105' 
            : 'border-white/50 hover:border-white hover:scale-105'
        ]"
        title="Vue normale"
      >
        <NuxtImg
          :src="paintingImage"
          alt="Vue normale"
          class="w-full h-full object-cover"
        />
      </button>

      <!-- Bouton preview salon -->
      <button
        @click="$emit('select-view', 'preview')"
        :class="[
          'w-12 h-12 md:w-16 md:h-16 rounded-lg border-2 overflow-hidden transition-all duration-200',
          selectedView === 'preview' 
            ? 'border-blue-500 shadow-lg scale-105' 
            : 'border-white/50 hover:border-white hover:scale-105'
        ]"
        title="Aperçu dans le salon"
      >
        <div class="relative w-full h-full">
          <!-- Mini salon -->
          <div
            class="absolute inset-0 bg-cover bg-center"
            style="background-image: url('/img/mockup-living-room.webp')"
          ></div>
          <!-- Mini tableau -->
          <div
            class="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-2 md:w-4 md:h-3"
          >
            <NuxtImg
              :src="paintingImage"
              alt="Mini aperçu"
              class="w-full h-full object-cover rounded-sm shadow-sm"
            />
          </div>
        </div>
      </button>
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
  },
  selectedView: {
    type: String,
    default: 'normal'
  }
});

// Emits
defineEmits(['select-view']);

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
  const baseScale = 0.3; // 35% de la taille du container
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