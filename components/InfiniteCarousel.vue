<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  paintings: {
    type: Array,
    required: true,
    default: () => [],
  },
  speed: {
    type: String,
    default: "normal",
    validator: (value) => ["slow", "normal", "fast"].includes(value),
  },
});

// Séparation en deux rangées
const topRowPaintings = computed(() => 
  props.paintings.slice(0, Math.ceil(props.paintings.length / 2))
);

const bottomRowPaintings = computed(() => 
  props.paintings.slice(Math.ceil(props.paintings.length / 2))
);

// Références DOM
const containerRef = ref(null);
const topScrollerRef = ref(null);
const bottomScrollerRef = ref(null);

// État d'animation
const isAnimating = ref(false);

// Obtenir la durée de l'animation selon la vitesse sélectionnée
const getAnimationDuration = () => {
  switch (props.speed) {
    case "fast": return "20s";
    case "slow": return "80s";
    default: return "40s";
  }
};

// Initialiser les animations
const initializeAnimations = () => {
  if (!containerRef.value) return;
  
  // Définir les propriétés CSS pour les animations
  containerRef.value.style.setProperty("--animation-duration", getAnimationDuration());
  
  // Cloner les éléments pour le défilement infini
  if (topScrollerRef.value) {
    const topItems = Array.from(topScrollerRef.value.children);
    topItems.forEach(item => {
      const clone = item.cloneNode(true);
      topScrollerRef.value.appendChild(clone);
    });
  }
  
  if (bottomScrollerRef.value) {
    const bottomItems = Array.from(bottomScrollerRef.value.children);
    bottomItems.forEach(item => {
      const clone = item.cloneNode(true);
      bottomScrollerRef.value.appendChild(clone);
    });
  }
  
  // Démarrer l'animation
  isAnimating.value = true;
};

// Nettoyer les animations à la destruction du composant
onBeforeUnmount(() => {
  isAnimating.value = false;
});

// Initialiser au montage
onMounted(() => {
  initializeAnimations();
});
</script>

<template>
  <div 
    ref="containerRef" 
    class="scroller select-none relative py-16 lg:py-30 z-20 overflow-hidden mx-auto"
    :class="[
      'mask-linear'
    ]"
  >
    <!-- Rangée supérieure - défilement vers la droite -->
    <ul 
      ref="topScrollerRef" 
      class="flex w-max min-w-full shrink-0 flex-nowrap gap-3 md:gap-7 py-2 hover-pause"
      :class="{ 'animate-scroll-right': isAnimating }"
    >
      <li 
        v-for="(painting, index) in topRowPaintings" 
        :key="`top-${index}`"
        class="relative w-20 h-20 md:w-60 md:h-60 lg:w-100 lg:h-100 max-w-full shrink-0 rounded-md md:rounded-2xl overflow-hidden shadow-sm"
      >
        <NuxtImg
          :src="painting.image"
          :alt="painting.title || 'Preview Image'"
          format="webp"
          provider="cloudinary"
          @contextmenu.prevent
          class="h-full w-full pointer-events-none select-none object-cover"
          loading="lazy"
          fetchpriority="low"
          decoding="async"
        />
      </li>
    </ul>
    
    <!-- Rangée inférieure - défilement vers la gauche -->
    <ul 
      ref="bottomScrollerRef" 
      class="flex w-max min-w-full shrink-0 flex-nowrap gap-3 md:gap-7 py-2 mt-3 hover-pause"
      :class="[
        'animate-scroll-left', 
        isAnimating ? 'animate-active' : '',
      ]"
    >
      <li 
        v-for="(painting, index) in bottomRowPaintings" 
        :key="`bottom-${index}`"
        class="relative w-20 h-20 md:w-60 md:h-60 lg:w-100 lg:h-100 max-w-full shrink-0 rounded-md md:rounded-2xl overflow-hidden shadow-sm"
      >
        <NuxtImg
          :src="painting.image"
          :alt="painting.title || 'Image'"
          format="webp"
          provider="cloudinary"
          @contextmenu.prevent
          class="h-full w-full pointer-events-none select-none object-cover"
          loading="lazy"
          fetchpriority="low"
          decoding="async"
        />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.mask-linear {
  mask-image: linear-gradient(to right, transparent, white 20%, white 80%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, white 20%, white 80%, transparent);
}

.animate-scroll-left {
  animation: scroll-left var(--animation-duration, 40s) linear infinite;
}

.animate-scroll-right {
  animation: scroll-right var(--animation-duration, 40s) linear infinite;
}

.animate-active {
  animation-play-state: running;
}

.hover-pause:hover {
  animation-play-state: paused;
}

@keyframes scroll-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-50%));
  }
}

@keyframes scroll-right {
  0% {
    transform: translateX(calc(-50%));
  }
  100% {
    transform: translateX(0);
  }
}
</style>