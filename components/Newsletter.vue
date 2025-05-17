<script setup>
import { ref, reactive } from "vue";

const email = ref("");
const subscriptionOptions = reactive({
	newArtwork: true,
	events: true,
});
const isLoading = ref(false);
const validationError = ref("");
const successMessage = ref("");
const menuOpen = ref(false);

const validateEmail = () => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!email.value) {
		validationError.value = "L'adresse email est requise";
		return false;
	} else if (!emailRegex.test(email.value)) {
		validationError.value = "L'adresse email n'est pas valide";
		return false;
	}

	validationError.value = "";
	return true;
};

const validateAndOpenMenu = () => {
	if (validateEmail()) {
		menuOpen.value = true;
	}
};

const closeMenu = () => {
	menuOpen.value = false;
	validationError.value = "";
};

const submitSubscription = async () => {
	if (!subscriptionOptions.newArtwork && !subscriptionOptions.events) {
		validationError.value = "Veuillez sélectionner au moins une option";
		return;
	}

	isLoading.value = true;

	try {
		let subscriptionType = "BOTH";
		if (subscriptionOptions.newArtwork && !subscriptionOptions.events) {
			subscriptionType = "NEW_ARTWORK";
		} else if (!subscriptionOptions.newArtwork && subscriptionOptions.events) {
			subscriptionType = "EVENTS";
		}

		const response = await $fetch("/api/newsletter/subscribe", {
			method: "POST",
			body: {
				email: email.value,
				subscriptionType,
			},
		});

		if (response.success) {
			closeMenu();
			successMessage.value = "Vous êtes bien inscrit à la newsletter !";
			email.value = "";
			subscriptionOptions.newArtwork = true;
			subscriptionOptions.events = true;

			setTimeout(() => {
				successMessage.value = "";
			}, 5000);
		} else {
			throw new Error(
				response.message || "Une erreur est survenue. Veuillez réessayer."
			);
		}
	} catch (error) {
		console.error("Erreur lors de l'inscription à la newsletter:", error);
		validationError.value =
			error.message || "Une erreur est survenue. Veuillez réessayer.";
	} finally {
		isLoading.value = false;
	}
};
</script>

<template>
	<div class="relative min-h-16">
		<!-- Composant principal -->
		<div
			class="input-wrapper w-fit h-7 sm:h-9 rounded-xl sm:rounded-[18px] p-1 sm:p-[5px] box-content flex items-center bg-white shadow-sm">
			<svg
				class="icon w-6 h-6 sm:w-7 sm:h-7 fill-black ml-2 transition-all duration-300"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24">
				<g data-name="Layer 2">
					<g data-name="inbox">
						<rect
							width="24"
							height="24"
							transform="rotate(180 12 12)"
							opacity="0"></rect>
						<path
							d="M20.79 11.34l-3.34-6.68A3 3 0 0 0 14.76 3H9.24a3 3 0 0 0-2.69 1.66l-3.34 6.68a2 2 0 0 0-.21.9V18a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-5.76a2 2 0 0 0-.21-.9zM8.34 5.55a1 1 0 0 1 .9-.55h5.52a1 1 0 0 1 .9.55L18.38 11H16a1 1 0 0 0-1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2a1 1 0 0 0-1-1H5.62z"></path>
					</g>
				</g>
			</svg>
			<input
				type="text"
				v-model="email"
				class="max-w-37 sm:max-w-full sm:w-55 h-full border-none outline-none pl-2 sm:pl-3 bg-white text-black text-xs sm:text-sm"
				placeholder="info@gmail.com" />
			<button
				@click="validateAndOpenMenu"
				class="subscribe-btn h-full w-16 sm:w-20 border-none rounded-lg sm:rounded-[13px] text-white cursor-pointer bg-black font-apercuMedium overflow-hidden flex items-center justify-center relative transition-all duration-300 hover:text-black group active:scale-90 text-xs sm:text-sm">
				<img
					src="/svg/weird-arrow-right.svg"
					alt="Arrow right icon"
					title="Arrow right icon"
					class="absolute mr-[150px] transition-all duration-300 group-hover:mr-0 origin-right animate-jello w-4 h-4 sm:w-5 sm:h-5" />
				<span class="truncate">S'abonner</span>
			</button>
		</div>

		<!-- Message de succès (en absolute) -->
		<Transition name="message">
			<div
				v-if="successMessage"
				class="absolute mt-2 text-[#B60071] text-xs sm:text-sm transition-all duration-300">
				{{ successMessage }}
			</div>
		</Transition>

		<!-- Message d'erreur (en absolute) -->
		<Transition name="message">
			<div
				v-if="validationError && !menuOpen"
				class="absolute mt-2 text-yellow text-xs sm:text-sm transition-all duration-300">
				{{ validationError }}
			</div>
		</Transition>

		<!-- Menu de souscription avec transition Vue -->
		<Transition name="menu">
			<div
				v-if="menuOpen"
				class="newsletter-menu absolute w-full max-w-xs sm:max-w-sm bg-white text-black p-3 sm:p-4 rounded-lg sm:rounded-[13px] mt-2 z-10 shadow-md">
				<h2 class="text-base sm:text-lg font-apercuBold mb-3">
					Inscription à la newsletter
				</h2>

				<div class="mb-3 flex flex-row items-center gap-1">
					<p class="text-xs sm:text-sm">Email:</p>
					<p class="font-apercuMedium text-xs sm:text-sm">{{ email }}</p>
				</div>

				<div class="mb-3 p-2 bg-black/10 rounded-xl border border-gray-100">
					<p class="mb-3 text-xs sm:text-sm">Je souhaite recevoir:</p>
					<div class="space-y-2">
						<div
							class="flex items-start w-fit cursor-pointer space-x-2 rounded-md"
							@click="
								subscriptionOptions.newArtwork = !subscriptionOptions.newArtwork
							">
							<div
								class="cbx flex items-center justify-center w-5 h-5 border border-gray-700 rounded mr-3 transition-colors duration-200"
								:class="
									subscriptionOptions.newArtwork ? 'bg-black' : 'bg-white'
								"></div>
							<span class="text-xs sm:text-sm">
								Les informations sur les
								<span class="font-apercuMedium"> nouvelles œuvres</span>
							</span>
						</div>
						<div
							class="flex items-start w-fit cursor-pointer space-x-2 rounded-md"
							@click="subscriptionOptions.events = !subscriptionOptions.events">
							<div
								class="cbx flex items-center justify-center w-5 h-5 border border-gray-700 rounded mr-3 transition-colors duration-200"
								:class="
									subscriptionOptions.events ? 'bg-black' : 'bg-white'
								"></div>
							<span class="text-xs sm:text-sm">
								Les informations sur les
								<span class="font-apercuMedium"> évènements</span>
							</span>
						</div>
					</div>
				</div>

				<!-- Message d'erreur dans le menu -->
				<Transition name="message">
					<div
						v-if="validationError && menuOpen"
						class="mb-2 text-red-500 text-xs sm:text-sm">
						{{ validationError }}
					</div>
				</Transition>

				<div class="flex justify-end space-x-2">
					<button
						@click="closeMenu"
						class="px-2 py-1 border border-black text-black rounded-full hover:bg-black hover:text-white transition-all duration-300 text-xs sm:text-sm">
						Annuler
					</button>
					<button
						@click="submitSubscription"
						class="px-2 py-1 bg-black text-white rounded-full hover:opacity-80 transition-all duration-300 text-xs sm:text-sm font-apercuMedium flex items-center justify-center min-w-15 sm:min-w-18 active:scale-90"
						:disabled="isLoading">
						<svg
							v-if="isLoading"
							class="animate-spin h-4 w-4 mr-1"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24">
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						<span v-else>Confirmer</span>
					</button>
				</div>
			</div>
		</Transition>
	</div>
</template>

<style scoped>
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
	-webkit-box-shadow: 0 0 0 1000px var(--color-white) inset !important;
	-webkit-text-fill-color: var(--color-black) !important;
	transition: background-color 5000s ease-in-out 0s;
}

@-moz-document url-prefix() {
	input:-moz-autofill,
	input:-moz-autofill:focus {
		box-shadow: 0 0 0 1000px var(--color-white) inset !important;
		-moz-text-fill-color: var(--color-black) !important;
	}
}

.cbx {
	position: relative;
	transition: background 0.2s ease;
	cursor: pointer;
	display: flex;
}

.cbx.bg-black {
	animation: jelly 0.4s ease;
}

.input-wrapper:active .icon {
	transform: scale(1.2);
}

/* Transitions pour le menu */
.menu-enter-active,
.menu-leave-active {
	transition: all 0.3s ease;
}

.menu-enter-from,
.menu-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}

/* Transitions pour les messages */
.message-enter-active,
.message-leave-active {
	transition: all 0.2s ease;
}

.message-enter-from,
.message-leave-to {
	opacity: 0;
	transform: translateY(-5px);
}

@keyframes jello {
	0% {
		transform: scale3d(1, 1, 1);
	}
	30% {
		transform: scale3d(0.75, 1.25, 1);
	}
	40% {
		transform: scale3d(1.25, 0.75, 1);
	}
	50% {
		transform: scale3d(0.85, 1.15, 1);
	}
	65% {
		transform: scale3d(1.05, 0.95, 1);
	}
	75% {
		transform: scale3d(0.95, 1.05, 1);
	}
	100% {
		transform: scale3d(1, 1, 1);
	}
}

.subscribe-btn:hover .animate-jello {
	animation: jello 0.8s both;
}

@media (min-width: 320px) {
	.xs\:max-w-\[150px\] {
		max-width: 150px;
	}
}
</style>