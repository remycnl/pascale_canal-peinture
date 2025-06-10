<script setup>
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
</script>

<template>
	<div class="relative prose max-w-none text-grayDark">
		<!-- Actions en haut -->
		<div
			class="lg:absolute -mt-7 lg:mt-0 -top-20 right-0 text-end will-change-scroll flex flex-col lg:flex-row gap-4">
			<NuxtLink
				v-if="painting.state === 'OFF_SALE'"
				to="/"
				class="bg-black active:scale-98 md:active:scale-95 text-white py-2 px-6 rounded-lg text-sm font-apercuBold shadow-md hover:bg-grayDark transition duration-200 text-center">
				Retourner à la galerie
			</NuxtLink>
			<button
				v-else
				@click="emit('open-contact', 'achat')"
				class="bg-black active:scale-98 md:active:scale-95 text-white py-2 px-6 rounded-lg text-sm font-apercuBold shadow-md hover:bg-grayDark transition duration-200 text-center">
				Contacter pour acheter
			</button>
			<ShareButton
				:title="`Découvre '${painting.name}' peint par ${painting.artist}`"
				:description="painting.description"
				position="bottom-right" />
		</div>

		<!-- Détails de l'œuvre -->
		<section>
			<h2
				class="text-lg md:text-xl mt-10 lg:mt-0 lg:text-3xl font-apercuBold text-black">
				Détails
			</h2>
			<ul class="mt-4 text-sm md:text-base lg:text-xl space-y-2">
				<li v-if="painting.state === 'OFF_SALE'">
					<span
						class="font-apercuLight text-xs md:text-sm lg:text-base text-[#B60071]">
						Ce tableau n'est pas disponible à la vente et est présentée
						uniquement à titre d'exposition. Si vous souhaitez acquérir une
						œuvre, vous avez la possibilité de
						<NuxtLink
							to="/commande-personnalisee"
							class="text-[#B60071] underline">
							commander une création personnalisée
						</NuxtLink>
						ou de
						<NuxtLink to="/?forSale=true" class="text-[#B60071] underline">
							découvrir les œuvres actuellement disponibles à l'achat </NuxtLink
						>.
					</span>
				</li>
				<li v-if="painting.state === 'FOR_SALE'">
					<span class="font-apercuBold">Prix: </span>
					{{ formatPrice(painting.price) }} €
				</li>
				<li>
					<span class="font-apercuBold">Dimensions: </span>
					{{ painting.width }} cm x {{ painting.height }} cm
				</li>
				<li>
					<span class="font-apercuBold">Technique:</span>
					{{ painting.paintingType }}
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
