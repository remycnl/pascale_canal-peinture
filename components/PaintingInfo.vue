<script setup>
import { ref, computed } from "vue";

const props = defineProps({
	painting: {
		type: Object,
		required: true,
	},
	formatPrice: {
		type: Function,
		required: true,
	},
	formatDate: {
		type: Function,
		required: true,
	},
});

const emit = defineEmits(["open-contact"]);

// Gestion de la sélection entre original et poster
const selectedFormat = ref("original");
const selectedPosterSize = ref(null);

// Prix calculé selon le format sélectionné
const currentPrice = computed(() => {
	if (selectedFormat.value === "original") {
		return props.painting.price;
	} else if (selectedPosterSize.value) {
		return selectedPosterSize.value.price;
	}
	return props.painting.posterSizes?.[0]?.price || 0;
});

// Prix minimum pour les posters
const minPosterPrice = computed(() => {
	if (!props.painting.posterSizes || props.painting.posterSizes.length === 0) {
		return 0;
	}
	return Math.min(
		...props.painting.posterSizes.map((size) => parseFloat(size.price))
	);
});

// Dimensions calculées selon le format sélectionné
const currentDimensions = computed(() => {
	if (selectedFormat.value === "original") {
		return {
			width: props.painting.width,
			height: props.painting.height,
		};
	} else if (selectedPosterSize.value) {
		return {
			width: selectedPosterSize.value.width,
			height: selectedPosterSize.value.height,
		};
	}
	return {
		width: props.painting.posterSizes?.[0]?.width || 0,
		height: props.painting.posterSizes?.[0]?.height || 0,
	};
});

// Calculer les classes de grid selon le nombre de tailles
const posterGridClasses = computed(() => {
	const count = props.painting.posterSizes?.length || 0;
	if (count === 2) {
		return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2";
	} else if (count >= 3) {
		return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3";
	}
	return "grid-cols-1";
});

// Vérifier s'il faut afficher le sélecteur de tailles
const shouldShowSizeSelector = computed(() => {
	return props.painting.posterSizes && props.painting.posterSizes.length > 1;
});

// Initialiser la première taille de poster si disponible
const initializePosterSize = () => {
	if (props.painting.posterSizes && props.painting.posterSizes.length > 0) {
		selectedPosterSize.value = props.painting.posterSizes[0];
		// Si l'original n'est plus en vente, sélectionner automatiquement le poster
		if (props.painting.state === "OFF_SALE") {
			selectedFormat.value = "poster";
		}
	}
};

// Initialiser au montage
onMounted(() => {
	initializePosterSize();
});

// Fonction pour gérer le contact avec les détails du format sélectionné
const handleContactClick = () => {
	const contactData = {
		format: selectedFormat.value,
		...(selectedFormat.value === "poster" &&
			selectedPosterSize.value && {
				posterSize: selectedPosterSize.value,
			}),
	};
	emit("open-contact", "achat", contactData);
};
</script>

<template>
	<div class="relative prose max-w-none text-grayDark">
		<!-- Actions en haut -->
		<div
			class="-mt-7 lg:mt-0 lg:mb-8 right-0 justify-end text-end will-change-scroll flex flex-col lg:flex-row gap-4">
			<!-- Afficher le bouton d'achat si l'original est en vente OU si des posters sont disponibles -->
			<button
				v-if="
					painting.state === 'FOR_SALE' ||
					(painting.posterAvailable && painting.posterSizes && painting.posterSizes.length > 0)
				"
				@click="handleContactClick"
				class="bg-black text-white py-2 px-6 rounded-lg text-sm font-apercuBold shadow-md hover:bg-grayDark transition duration-200 text-center cursor-pointer">
				Contacter pour acheter
			</button>
			<NuxtLink
				v-else
				to="/"
				class="bg-black text-white py-2 px-6 rounded-lg text-sm font-apercuBold shadow-md hover:bg-grayDark transition duration-200 text-center cursor-pointer">
				Retourner à la galerie
			</NuxtLink>
			<ShareButton
				:title="`Découvre '${painting.name}' peint par ${painting.artist}`"
				:description="painting.description"
				position="bottom-right" />
		</div>

		<!-- Sélection du format (Original ou Poster) -->
		<section
			v-if="painting.state === 'FOR_SALE' || (painting.posterAvailable && painting.posterSizes && painting.posterSizes.length > 0)"
			class="mt-10 lg:mt-0">
			<h2
				class="text-lg md:text-xl lg:text-3xl font-apercuBold text-black mb-6">
				Choisir le format
			</h2>

			<!-- Sélecteur de format -->
			<div class="space-y-2 mb-8">
				<!-- Option Original (si en vente) -->
				<div
					v-if="painting.state === 'FOR_SALE'"
					@click="selectedFormat = 'original'"
					:class="[
						'group relative overflow-hidden rounded-xl border cursor-pointer transition-all duration-200 ease-out h-fit',
						selectedFormat === 'original'
							? 'border-black bg-gray-50'
							: 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50',
					]">
					<div class="p-4">
						<div class="flex justify-between items-start">
							<div class="flex-1">
								<div class="flex items-center gap-3 mb-2">
									<!-- Radio button custom -->
									<div class="relative">
										<div
											:class="[
												'w-4 h-4 rounded-full border transition-all duration-200',
												selectedFormat === 'original'
													? 'border-black bg-black'
													: 'border-gray-300',
											]">
											<div
												v-if="selectedFormat === 'original'"
												class="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
										</div>
									</div>
									<div class="flex items-center gap-2">
										<h3 class="font-apercuMedium text-black">
											Tableau original
										</h3>
										<span
											class="bg-yellow/70 text-black text-xs px-2 py-0.5 rounded-md font-apercuMedium">
											Unique
										</span>
									</div>
								</div>
								<p class="text-gray-600 text-sm ml-7">
									Œuvre originale peinte à la main
								</p>
							</div>
							<div class="text-right ml-4">
								<div class="text-lg font-apercuBold text-black">
									{{ formatPrice(painting.price) }} €
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Option Poster (disponible si posterAvailable est true) -->
				<div
					v-if="painting.posterAvailable && painting.posterSizes && painting.posterSizes.length > 0"
					@click="selectedFormat = 'poster'"
					:class="[
						'group relative overflow-hidden rounded-xl border cursor-pointer transition-all duration-200 ease-out h-fit',
						selectedFormat === 'poster'
							? 'border-black bg-gray-50'
							: 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50',
					]">
					<div class="p-4">
						<div class="flex justify-between items-start">
							<div class="flex-1">
								<div class="flex items-center gap-3 mb-2">
									<!-- Radio button custom -->
									<div class="relative">
										<div
											:class="[
												'w-4 h-4 rounded-full border transition-all duration-200',
												selectedFormat === 'poster'
													? 'border-black bg-black'
													: 'border-gray-300',
											]">
											<div
												v-if="selectedFormat === 'poster'"
												class="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
										</div>
									</div>
									<div class="flex items-center gap-2">
										<h3 class="font-apercuMedium text-black">Poster</h3>
									</div>
								</div>
								<p class="text-gray-600 text-sm ml-7">
									Reproduction fidèle sur papier de haute qualité
								</p>

								<!-- Sélection des tailles de poster (seulement si plus d'une taille) -->
								<div
									v-if="selectedFormat === 'poster' && shouldShowSizeSelector"
									class="ml-7 mt-3 -mr-6">
									<label
										class="text-sm font-apercuMedium text-black block mb-3">
										Taille :
									</label>
									<div>
										<div :class="['grid gap-2', posterGridClasses]">
											<div
												v-for="(posterSize, index) in painting.posterSizes"
												:key="posterSize.id"
												@click.stop="selectedPosterSize = posterSize"
												:style="{ animationDelay: `${index * 50}ms` }"
												:class="[
													'border rounded-lg p-3 cursor-pointer transition-all duration-150 text-sm animate-in fade-in-item',
													selectedPosterSize?.id === posterSize.id
														? 'border-black bg-black text-white'
														: 'border-gray-200 hover:border-gray-300 bg-white',
												]">
												<div
													class="flex flex-row justify-between items-center gap-2">
													<div class="flex items-center gap-2 flex-1 min-w-0">
														<div class="min-w-0 flex-1">
															<div class="font-apercuMedium truncate">
																{{ posterSize.name }}
															</div>
															<div
																:class="[
																	'text-xs',
																	selectedPosterSize?.id === posterSize.id
																		? 'text-white/75'
																		: 'text-gray-500',
																]">
																{{ posterSize.width }} ×
																{{ posterSize.height }} cm
															</div>
														</div>
													</div>
													<span
														class="font-apercuBold text-sm whitespace-nowrap shrink-0">
														{{ formatPrice(posterSize.price) }} €
													</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="text-right ml-4">
								<!-- Si une seule taille de poster, afficher le prix directement -->
								<div
									v-if="
										!shouldShowSizeSelector &&
										painting.posterSizes?.length === 1
									"
									class="text-lg font-apercuBold text-black">
									{{ formatPrice(painting.posterSizes[0].price) }} €
								</div>
								<!-- Si plusieurs tailles et poster sélectionné avec taille choisie -->
								<div
									v-else-if="
										selectedFormat === 'poster' &&
										selectedPosterSize &&
										shouldShowSizeSelector
									"
									class="text-lg font-apercuBold text-black">
									{{ formatPrice(currentPrice) }} €
								</div>
								<!-- Si plusieurs tailles mais pas de taille sélectionnée -->
								<div
									v-else-if="shouldShowSizeSelector"
									class="text-lg font-apercuBold text-black flex flex-col items-end">
									<span class="text-[9px] uppercase text-gray-400 tracking-wide"
										>À partir de</span
									>
									<span>{{ formatPrice(minPosterPrice) }} €</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Détails de l'œuvre -->
		<section>
			<h2 class="text-lg md:text-xl lg:text-3xl font-apercuBold text-black">
				Détails
			</h2>
			<ul class="mt-4 text-sm md:text-base lg:text-xl space-y-2">
				<li v-if="painting.state === 'OFF_SALE'">
					<span
						class="font-apercuLight text-xs md:text-sm lg:text-base text-[#B60071]">
						<template v-if="painting.posterAvailable !== false">
							Le tableau original n'est pas disponible à la vente et est présenté
							uniquement à titre d'exposition. Cependant, vous pouvez acquérir un
							poster de cette œuvre ci-dessus. Si vous souhaitez acquérir une
							œuvre originale, vous avez la possibilité de
							<NuxtLink
								to="/commande-personnalisee"
								class="text-[#B60071] underline">
								commander une création personnalisée
							</NuxtLink>
							ou de
							<NuxtLink to="/?forSale=true" class="text-[#B60071] underline">
								découvrir les œuvres originales actuellement disponibles à l'achat </NuxtLink
							>.
						</template>
						<template v-else>
							Cette œuvre n'est pas disponible à la vente et est présentée
							uniquement à titre d'exposition. Si vous souhaitez acquérir une
							œuvre originale, vous avez la possibilité de
							<NuxtLink
								to="/commande-personnalisee"
								class="text-[#B60071] underline">
								commander une création personnalisée
							</NuxtLink>
							ou de
							<NuxtLink to="/?forSale=true" class="text-[#B60071] underline">
								découvrir les œuvres originales actuellement disponibles à l'achat </NuxtLink
							>.
						</template>
					</span>
				</li>
				<li v-if="painting.state === 'FOR_SALE'">
					<span class="font-apercuBold">Prix: </span>
					{{ formatPrice(currentPrice) }} €
				</li>
				<li>
					<span class="font-apercuBold">Dimensions: </span>
					{{ currentDimensions.width }} cm x {{ currentDimensions.height }} cm
				</li>
				<li v-if="selectedFormat === 'original'">
					<span class="font-apercuBold">Technique:</span>
					{{ painting.paintingType }}
				</li>
				<li v-else-if="selectedFormat === 'poster'">
					<span class="font-apercuBold">Support:</span>
					Papier de haute qualité mat
				</li>
				<li>
					<span class="font-apercuBold">Date de création: </span>
					<time :datetime="painting.date">
						{{ formatDate(painting.date) }}
					</time>
				</li>
			</ul>
		</section>
	</div>
</template>

<style scoped>
/* Animation d'entrée fluide */
@keyframes fade-in {
	from {
		opacity: 0;
		transform: translateY(-5px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes fade-in-item {
	from {
		opacity: 0;
		transform: translateY(-8px) scale(0.95);
	}
	to {
		opacity: 1;
		transform: translateY(0) scale(1);
	}
}

.animate-in {
	animation: fade-in 0.2s ease-out;
}

.fade-in-item {
	animation: fade-in-item 0.3s ease-out forwards;
	opacity: 0;
}
</style>
