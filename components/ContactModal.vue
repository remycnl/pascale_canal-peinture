<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
	painting: {
		type: Object,
		required: true,
	},
	contactType: {
		type: String,
		required: true,
	},
	formLoaded: {
		type: Boolean,
		required: true,
	},
});

const emit = defineEmits(["close", "form-loaded", "modal-ref"]);

const modalElement = ref(null);

onMounted(() => {
	emit("modal-ref", modalElement.value);
});
</script>

<template>
	<div
		class="fixed inset-0 backdrop-blur-md w-screen h-screen z-[9999] flex items-start md:items-center justify-center">
		<!-- Backdrop avec flou -->
		<div class="absolute inset-0 bg-black/70" @click="emit('close')"></div>

		<!-- Modal -->
		<div
			ref="modalElement"
			class="relative bg-black rounded-2xl lg:rounded-4xl w-fit m-1 sm:m-3 md:m-10 z-10 pt-6 p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col overflow-hidden transform transition-all duration-400 ease-out"
			:class="{
				'translate-y-8 opacity-0 scale-95': !formLoaded,
				'translate-y-0 opacity-100 scale-100': formLoaded,
			}"
			role="dialog"
			aria-modal="true"
			:aria-label="
				contactType === 'achat'
					? 'Acheter cette œuvre'
					: 'Demander une réédition'
			">
			<!-- Bouton de fermeture -->
			<button
				@click="emit('close')"
				class="cross-button absolute top-4 right-4 text-gray-400 active:scale-90 hover:text-white transition-colors duration-200 z-20 cursor-pointer"
				aria-label="Fermer">
				<svg
					class="h-10 w-10 md:h-12 md:w-12 lg:h-15 lg:w-15"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<path
						d="M16 8L8 16M12 12L16 16M8 8L10 10"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round" />
				</svg>
			</button>

			<!-- Contenu du modal -->
			<h2 class="text-2xl md:text-3xl font-apercuBold text-white mb-6">
				{{
					contactType === "achat"
						? "Acheter cette œuvre"
						: "Demander une réédition"
				}}
			</h2>

			<p class="mb-6 max-w-5xl text-gray-400 hidden md:block">
				<span v-if="contactType === 'achat'">
					Vous êtes intéressé(e) par l'achat de "{{ painting.name }}" ?
					Remplissez ce formulaire et je vous contacterai rapidement pour
					discuter des détails.
				</span>
				<span v-else>
					Vous souhaitez une réédition de "{{ painting.name }}" ? Chaque œuvre
					étant unique, la nouvelle version sera inspirée de l'originale mais
					présentera ses propres particularités. Remplissez ce formulaire et je
					vous contacterai rapidement pour discuter du projet.
				</span>
			</p>

			<div class="relative flex-grow overflow-auto">
				<div
					class="sticky top-0 left-0 right-0 h-8 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none"
					aria-hidden="true"></div>

				<p class="mb-6 max-w-5xl text-gray-400 md:hidden">
					<span v-if="contactType === 'achat'">
						Vous êtes intéressé(e) par l'achat de "{{ painting.name }}" ?
						Remplissez ce formulaire et je vous contacterai rapidement pour
						discuter des détails.
					</span>
					<span v-else>
						Vous souhaitez une réédition de "{{ painting.name }}" ? Remplissez
						ce formulaire et je vous contacterai rapidement pour discuter du
						projet.
					</span>
				</p>

				<ContactForm
					:pre-selected-artwork-id="painting.id"
					@form-loaded="emit('form-loaded')" />

				<div
					class="sticky bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black to-transparent pointer-events-none"
					aria-hidden="true"></div>
			</div>
		</div>
	</div>
</template>

<style scoped>
@keyframes spinDown {
	0% {
		transform: rotate(0deg);
	}
	70% {
		transform: rotate(720deg);
	}
	85% {
		transform: rotate(700deg);
	}
	95% {
		transform: rotate(710deg);
	}
	100% {
		transform: rotate(720deg);
	}
}
.cross-button:hover {
	animation: spinDown 1.2s ease-out forwards;
	transform-origin: center;
}
</style>
