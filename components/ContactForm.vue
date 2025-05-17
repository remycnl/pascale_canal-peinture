<template>
	<form
		@submit.prevent="submitForm"
		class="w-full max-w-5xl backdrop-blur-md bg-white/20 rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 border border-white/30">
		<!-- Progress Indicator -->
		<div class="mb-18 sm:mb-20 px-10 relative">
			<div class="flex justify-between relative">
				<!-- Step Indicators and Connecting Lines -->
				<div v-for="(step, index) in visibleSteps" :key="index">
					<!-- Connecting Line (not for the last step) -->
					<div
						v-if="index < visibleSteps.length - 1"
						class="absolute h-1.5 rounded-full bg-white/20 transition-all duration-500 ease-out"
						:style="`
								left: calc(${(index / (visibleSteps.length - 1)) * 100}% + 20px); 
								top: 12px;
								width: calc(${100 / (visibleSteps.length - 1)}% - 40px);
							`">
						<!-- Yellow progress overlay -->
						<div
							class="absolute h-full left-0 top-0 rounded-full bg-yellow/80 backdrop-blur-sm shadow-sm shadow-yellow/50 transition-all duration-500 ease-out"
							:style="`
									width: ${currentVisibleStepIndex > index ? '100%' : '0%'};
								`"></div>
					</div>

					<!-- Step Circle -->
					<div
						class="z-10 flex flex-col items-center group absolute"
						:style="`left: calc(${
							(index / (visibleSteps.length - 1)) * 100
						}% - 14px); top: 0px;`">
						<div
							class="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 ease-out border-2 transform hover:scale-102 relative"
							:class="{
								'bg-yellow/30 border-yellow shadow-md shadow-yellow/50 scale-110 backdrop-blur-sm':
									currentVisibleStepIndex >= index,
								'bg-white/10 border-white/30 backdrop-blur-sm':
									currentVisibleStepIndex < index,
							}">
							<svg
								v-if="currentVisibleStepIndex > index"
								xmlns="http://www.w3.org/2000/svg"
								class="h-3.5 w-3.5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd" />
							</svg>
							<span
								v-else
								class="text-sm font-apercuBold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
								:class="{
									'text-white': currentVisibleStepIndex >= index,
									'text-white/70': currentVisibleStepIndex < index,
								}">
								{{ index + 1 }}
							</span>
						</div>
						<!-- Step name under each circle -->
						<p
							class="absolute left-1/2 transform -translate-x-1/2 mt-2 text-yellow text-sm whitespace-nowrap transition-opacity duration-300 top-full"
							:class="{
								'opacity-100': currentVisibleStepIndex === index,
								'opacity-0': currentVisibleStepIndex !== index,
							}">
							{{ step }}
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Submission Confirmation Message -->
		<div v-if="formSubmitted" class="text-center py-8">
			<div v-if="submitSuccess" class="space-y-6">
				<div class="flex justify-center">
					<div
						class="w-16 h-16 bg-green-500/70 rounded-full flex items-center justify-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-10 w-10 text-white"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7" />
						</svg>
					</div>
				</div>
				<h2 class="text-2xl font-apercuBold text-white">
					Message envoyé avec succès !
				</h2>
				<p class="text-white/80">
					Je vous répondrai dans les plus brefs délais.
				</p>
				<button
					v-if="!preSelectedArtworkId"
					@click="resetForm"
					class="mt-6 px-6 py-3 backdrop-blur-md bg-yellow/80 text-black rounded-lg hover:bg-yellow shadow-lg shadow-yellow/30 transition-all duration-300 hover:scale-102">
					Nouveau message
				</button>
			</div>

			<div v-else class="space-y-6">
				<div class="flex justify-center">
					<div
						class="w-16 h-16 bg-red-500/70 rounded-full flex items-center justify-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-10 w-10 text-white"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12" />
						</svg>
					</div>
				</div>
				<h2 class="text-2xl font-apercuBold text-white">
					Erreur lors de l'envoi
				</h2>
				<p class="text-white/80">Veuillez réessayer ultérieurement.</p>
				<button
					@click="retrySubmit"
					class="mt-6 px-6 py-3 backdrop-blur-md bg-yellow/80 text-black rounded-lg hover:bg-yellow shadow-lg shadow-yellow/30 transition-all duration-300 hover:scale-102">
					Réessayer
				</button>
			</div>
		</div>

		<div
			v-else
			class="backdrop-blur-sm bg-white/10 rounded-2xl p-4 sm:p-6 shadow-lg shadow-white/5 border border-white/20">
			<!-- Step 0: Contact Reason (Only if no pre-selected artwork) -->
			<div v-if="currentStep === 0 && !preSelectedArtwork" class="text-center">
				<h2 class="text-xl sm:text-2xl font-apercuBold mb-6 text-white">
					Quel est le motif de votre contact ?
				</h2>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<button
						v-for="reason in contactReasons"
						:key="reason.value"
						type="button"
						@click="selectReason(reason)"
						class="p-4 backdrop-blur-md bg-white/20 rounded-xl hover:bg-white/30 border border-white/30 text-white shadow-lg hover:shadow-xl hover:scale-102 transition-all duration-300">
						{{ reason.label }}
					</button>
				</div>
			</div>

			<!-- Step 1: Artwork Selection or Reason Details (Only for artwork selection) -->
			<div
				v-if="
					currentStep === 1 &&
					(preSelectedArtwork || selectedReason.value === 'artwork')
				"
				class="text-center">
				<template v-if="preSelectedArtwork">
					<h2
						class="text-xl sm:text-2xl lg:text-start font-apercuBold mb-6 text-white">
						Œuvre sélectionnée
					</h2>
					<div class="flex flex-col lg:flex-row lg:gap-8">
						<!-- Selected artwork section -->
						<div
							class="flex justify-center lg:justify-between mb-6 lg:mb-0 lg:w-1/2">
							<div
								class="relative h-fit max-w-sm rounded-xl overflow-hidden shadow-2xl backdrop-blur-md bg-white/20 border border-white/30">
								<NuxtImg
									:src="preSelectedArtwork.image"
									:alt="preSelectedArtwork.name"
									:title="preSelectedArtwork.name"
									quality="50"
									@contextmenu.prevent
									class="w-full object-cover h-auto" />
								<span
									v-if="preSelectedArtwork.state === 'OFF_SALE'"
									class="absolute top-4 flex items-center right-4 bg-[#B60071]/60 text-white text-xs px-2 py-1 rounded-full">
									Hors vente
								</span>
								<div class="p-4">
									<h3 class="font-apercuBold text-xl mb-2 text-white">
										{{ preSelectedArtwork.name }}
									</h3>
									<p class="text-white/80">{{ preSelectedArtwork.price }} €</p>
								</div>
							</div>
						</div>

						<!-- Other artworks section -->
						<div class="lg:w-1/2">
							<h3 class="text-lg text-start py-4 text-white">
								D'autres œuvres vous intéressent ?
							</h3>

							<!-- Search bar for artwork -->
							<div class="relative mb-6">
								<input
									v-model="artworkSearchQuery"
									type="text"
									placeholder="Rechercher une œuvre..."
									class="w-full p-3 rounded-lg backdrop-blur-md bg-white/10 border border-white/30 focus:border-yellow focus:outline-none text-white placeholder-white/50"
									@input="searchArtworks"
									@focus="showSearchResults = true"
									@blur="handleSearchBlur" />
								<!-- Search results dropdown -->
								<div
									v-if="artworkSearchQuery && showSearchResults"
									class="absolute z-10 mt-1 w-full rounded-lg backdrop-blur-md bg-white/30 shadow-lg border border-white/30 max-h-60 overflow-y-auto">
									<!-- No results message -->
									<div
										v-if="artworkSearchResults.length === 0"
										class="p-4 text-center text-white">
										Aucune œuvre ne correspond à votre recherche
									</div>
									<!-- Search results -->
									<div
										v-else
										v-for="result in artworkSearchResults"
										:key="result.id"
										@click="selectSearchResult(result)"
										class="p-2 cursor-pointer hover:bg-white/20 flex items-center gap-2 transition-colors duration-200">
										<NuxtImg
											:src="result.image"
											:alt="result.name"
											:title="result.name"
											width="40"
											height="40"
											@contextmenu.prevent
											quality="50"
											class="rounded-md object-cover" />
										<div class="flex">
											<span class="text-white">{{ result.name }}</span>
											<span
												v-if="result.state === 'OFF_SALE'"
												class="ml-2 flex items-center bg-[#B60071]/60 text-white text-xs px-2 py-0.5 rounded-full">
												Hors vente
											</span>
										</div>
									</div>
								</div>
							</div>

							<!-- Loading state for artwork selection -->
							<div
								v-if="!artworksLoaded"
								class="grid grid-cols-2 sm:grid-cols-3 gap-4">
								<div
									v-for="i in 6"
									:key="i"
									class="backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl p-2">
									<div class="animate-pulse">
										<div class="bg-white/20 rounded-lg aspect-square"></div>
										<div class="h-4 bg-white/20 rounded mt-2 w-3/4"></div>
									</div>
								</div>
							</div>

							<div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
								<div
									v-for="artwork in otherFilteredArtworks"
									:key="artwork.id"
									@click="toggleArtworkSelection(artwork)"
									class="cursor-pointer rounded-xl p-2 transition-all duration-300 lg:hover:scale-102"
									:class="
										isArtworkSelected(artwork)
											? 'backdrop-blur-md bg-yellow/30 border border-yellow/50 shadow-lg shadow-yellow/30'
											: 'backdrop-blur-sm bg-white/10 border border-white/20'
									">
									<div class="relative">
										<NuxtImg
											:src="artwork.image"
											:alt="artwork.name"
											:title="artwork.name"
											@contextmenu.prevent
											quality="50"
											class="w-full object-cover rounded-lg aspect-square" />
										<span
											v-if="artwork.state === 'OFF_SALE'"
											class="absolute top-2 flex items-center right-2 bg-[#B60071]/60 text-white text-xs px-2 py-0.5 rounded-full">
											Hors vente
										</span>
									</div>
									<p class="text-sm mt-2 text-white truncate">
										{{ artwork.name }}
									</p>
								</div>
							</div>

							<!-- Pagination controls -->
							<div class="flex items-center justify-center mt-6 space-x-2">
								<button
									@click="prevPage"
									:disabled="currentPage === 1"
									class="p-2 backdrop-blur-md bg-white/10 rounded-lg border border-white/30 text-white disabled:opacity-50 hover:bg-white/20 transition-all duration-300">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor">
										<path
											fill-rule="evenodd"
											d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
											clip-rule="evenodd" />
									</svg>
								</button>

								<span class="text-white">
									Page {{ currentPage }} sur {{ totalPagesWithoutPreselected }}
								</span>

								<button
									@click="nextPage"
									:disabled="currentPage === totalPagesWithoutPreselected"
									class="p-2 backdrop-blur-md bg-white/10 rounded-lg border border-white/30 text-white disabled:opacity-50 hover:bg-white/20 transition-all duration-300">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor">
										<path
											fill-rule="evenodd"
											d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
											clip-rule="evenodd" />
									</svg>
								</button>
							</div>
						</div>
					</div>
				</template>

				<!-- Inside the Step 1: Artwork Selection section -->
				<template v-else-if="selectedReason.value === 'artwork'">
					<h2 class="text-xl sm:text-2xl font-apercuBold mb-6 text-white">
						Sélectionnez vos œuvres
					</h2>

					<!-- Search bar for artwork -->
					<div class="relative mb-6">
						<input
							v-model="artworkSearchQuery"
							type="text"
							placeholder="Rechercher une œuvre..."
							class="w-full p-3 rounded-lg backdrop-blur-md bg-white/10 border border-white/30 focus:border-yellow focus:outline-none text-white placeholder-white/50"
							@input="searchArtworks"
							@focus="showSearchResults = true"
							@blur="handleSearchBlur" />
						<!-- Search results dropdown -->
						<div
							v-if="artworkSearchQuery && showSearchResults"
							class="absolute z-10 mt-1 w-full rounded-lg backdrop-blur-md bg-white/30 shadow-lg border border-white/30 max-h-60 overflow-y-auto">
							<!-- No results message -->
							<div
								v-if="artworkSearchResults.length === 0"
								class="p-4 text-center text-white">
								Aucune œuvre ne correspond à votre recherche
							</div>
							<!-- Search results -->
							<div
								v-else
								v-for="result in artworkSearchResults"
								:key="result.id"
								@click="selectSearchResult(result)"
								class="p-2 cursor-pointer hover:bg-white/20 flex items-center gap-2 transition-colors duration-200">
								<NuxtImg
									:src="result.image"
									:alt="result.name"
									:title="result.name"
									width="40"
									height="40"
									quality="50"
									@contextmenu.prevent
									class="rounded-md object-cover" />
								<div class="flex">
									<span class="text-white">{{ result.name }}</span>
									<span
										v-if="result.state === 'OFF_SALE'"
										class="ml-2 flex items-center bg-[#B60071]/60 text-white text-xs px-2 py-0.5 rounded-full">
										Hors vente
									</span>
								</div>
							</div>
						</div>
					</div>

					<!-- Loading state for artwork selection -->
					<div
						v-if="!artworksLoaded"
						class="grid grid-cols-2 sm:grid-cols-3 gap-4">
						<div
							v-for="i in 6"
							:key="i"
							class="backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl p-2">
							<div class="animate-pulse">
								<div class="bg-white/20 rounded-lg aspect-square"></div>
								<div class="h-4 bg-white/20 rounded mt-2 w-3/4"></div>
							</div>
						</div>
					</div>

					<div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
						<div
							v-for="artwork in filteredArtworks"
							:key="artwork.id"
							@click="toggleArtworkSelection(artwork)"
							class="cursor-pointer rounded-xl p-2 transition-all duration-300 lg:hover:scale-102"
							:class="
								isArtworkSelected(artwork)
									? 'backdrop-blur-md bg-yellow/30 border border-yellow/50 shadow-lg shadow-yellow/30'
									: 'backdrop-blur-sm bg-white/10 border border-white/20'
							">
							<div class="relative">
								<NuxtImg
									:src="artwork.image"
									:alt="artwork.name"
									:title="artwork.name"
									quality="50"
									@contextmenu.prevent
									class="w-full rounded-lg object-cover aspect-square" />
								<span
									v-if="artwork.state === 'OFF_SALE'"
									class="absolute top-2 right-2 bg-[#B60071]/60 text-white text-xs px-2 py-0.5 flex items-center rounded-full">
									Hors vente
								</span>
							</div>
							<p class="text-sm mt-2 text-white truncate">{{ artwork.name }}</p>
						</div>
					</div>

					<!-- Pagination controls -->
					<div class="flex items-center justify-center mt-6 space-x-2">
						<button
							@click="prevPage"
							:disabled="currentPage === 1"
							class="p-2 backdrop-blur-md bg-white/10 rounded-lg border border-white/30 text-white disabled:opacity-50 hover:bg-white/20 transition-all duration-300">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
									clip-rule="evenodd" />
							</svg>
						</button>

						<span class="text-white">
							Page {{ currentPage }} sur {{ totalPages }}
						</span>

						<button
							@click="nextPage"
							:disabled="currentPage === totalPages"
							class="p-2 backdrop-blur-md bg-white/10 rounded-lg border border-white/30 text-white disabled:opacity-50 hover:bg-white/20 transition-all duration-300">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
									clip-rule="evenodd" />
							</svg>
						</button>
					</div>
				</template>
			</div>

			<!-- Step 2: Selected Artworks Summary (Only for artwork selection) -->
			<div
				v-if="currentStep === 2 && selectedReason.value === 'artwork'"
				class="text-center">
				<h2 class="text-xl sm:text-2xl font-apercuBold mb-6 text-white">
					Résumé des œuvres sélectionnées
				</h2>
				<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<div
						v-for="artwork in selectedArtworks"
						:key="artwork.id"
						class="backdrop-blur-md h-fit bg-white/10 rounded-xl p-2 border border-white/30 shadow-lg">
						<div class="relative">
							<NuxtImg
								:src="artwork.image"
								:alt="artwork.name"
								:title="artwork.name"
								quality="50"
								@contextmenu.prevent
								class="w-full object-cover rounded-lg aspect-square" />
							<span
								v-if="artwork.state === 'OFF_SALE'"
								class="absolute top-2 right-2 bg-[#B60071]/60 text-white text-xs px-2 py-0.5 rounded-full">
								Hors vente
							</span>
						</div>
						<p class="text-sm mt-2 text-white truncate" :title="artwork.name">
							{{ artwork.name }}
						</p>
						<p class="text-sm text-white/70">{{ artwork.price }} €</p>
					</div>
				</div>
			</div>

			<!-- Step 3: Personal Details (For all cases) -->
			<div v-if="currentStep === getPersonalDetailsStep()" class="space-y-4">
				<h2
					class="text-xl sm:text-2xl font-apercuBold text-center mb-6 text-white">
					Vos coordonnées
				</h2>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<input
						v-model="form.firstName"
						placeholder="Prénom*"
						class="p-3 rounded-lg backdrop-blur-md bg-white/10 border border-white/30 focus:border-yellow focus:outline-none text-white placeholder-white/50" />
					<input
						v-model="form.lastName"
						placeholder="Nom"
						class="p-3 rounded-lg backdrop-blur-md bg-white/10 border border-white/30 focus:border-yellow focus:outline-none text-white placeholder-white/50" />
					<div class="col-span-1 sm:col-span-2 relative">
						<input
							v-model="form.email"
							type="email"
							placeholder="Email*"
							:class="[
								'w-full p-3 rounded-lg backdrop-blur-md bg-white/10 border focus:outline-none text-white placeholder-white/50',
								isEmailValid || !form.email
									? 'border-white/30 focus:border-yellow'
									: 'border-red-500 focus:border-red-500',
							]" />
						<p
							v-if="form.email && !isEmailValid"
							class="text-red-400 text-xs mt-1">
							Veuillez entrer une adresse email valide
						</p>
					</div>
					<input
						v-model="form.phone"
						type="tel"
						placeholder="Téléphone"
						class="col-span-1 sm:col-span-2 p-3 rounded-lg backdrop-blur-md bg-white/10 border border-white/30 focus:border-yellow focus:outline-none text-white placeholder-white/50" />
				</div>
			</div>

			<!-- Step 4: Message -->
			<div v-if="currentStep === getMessageStep()" class="space-y-4">
				<h2
					class="text-xl sm:text-2xl font-apercuBold text-center mb-6 text-white">
					Votre message
				</h2>
				<!-- Reason details input for non-artwork contacts -->
				<div v-if="selectedReason.value !== 'artwork'" class="mb-4">
					<label class="block mb-2 text-white"
						>Objet de votre {{ selectedReason.label }}</label
					>
					<input
						v-model="form.reasonDetails"
						class="w-full p-3 rounded-lg backdrop-blur-md bg-white/10 border border-white/30 focus:border-yellow focus:outline-none text-white placeholder-white/50"
						:placeholder="`Détails de votre ${selectedReason.label}`" />
				</div>

				<!-- Message textarea -->
				<div class="mb-4">
					<label class="block mb-2 text-white">Votre message</label>
					<textarea
						v-model="form.message"
						@input="autoResize($event.target)"
						class="w-full p-3 rounded-lg backdrop-blur-md bg-white/10 border border-white/30 focus:border-yellow focus:outline-none text-white placeholder-white/50 h-32 overflow-hidden resize-none min-h-[80px]"
						placeholder="Écrivez votre message ici..."></textarea>
				</div>

				<!-- File upload for non-artwork contacts -->
				<div v-if="selectedReason.value !== 'artwork'">
					<label class="block mb-2 text-white"
						>Joindre un document (optionnel)</label
					>
					<input
						type="file"
						@change="handleFileUpload"
						class="w-fit text-white file:bg-yellow file:border-0 file:text-black file:px-4 file:py-2 file:mr-4 file:rounded-lg hover:file:bg-yellow file:cursor-pointer cursor-pointer" />
				</div>

				<!-- RGPD Consent Checkbox -->
				<div class="mt-6 flex gap-x-3">
					<div class="relative">
						<input
							class="hidden"
							id="rgpdConsent"
							type="checkbox"
							v-model="form.rgpdConsent" />
						<label
							class="cbx border bg-white/10 border-white/30"
							for="rgpdConsent"></label>
					</div>
					<label for="rgpdConsent" class="cursor-pointer text-white text-sm">
						J'accepte l'utilisation de mes données personnelles pour le
						traitement de ma demande et pour être recontacté(e)*
					</label>
				</div>
				<p v-if="showRgpdError" class="text-red-400 text-xs mt-2">
					Vous devez accepter les conditions d'utilisation des données pour
					envoyer le formulaire
				</p>
			</div>
		</div>

		<!-- Navigation Buttons -->
		<div
			class="flex justify-between mt-8"
			v-if="!formSubmitted && currentStep > 0">
			<button
				v-if="currentStep > 0 && (!preSelectedArtwork || currentStep > 1)"
				type="button"
				@click="previousStep"
				class="px-4 sm:px-6 py-2 disabled:active:scale-100 active:scale-97 backdrop-blur-md bg-white/10 text-white rounded-lg border border-white/30 hover:bg-white/20 transition-all duration-300">
				Précédent
			</button>
			<button
				v-if="
					currentStep < getMaxStep() &&
					currentStep > 0 &&
					!(currentStep === 0 && !selectedReason.value)
				"
				type="button"
				@click="nextStep"
				:disabled="!isStepValid"
				class="ml-auto px-4 sm:px-6 py-2 backdrop-blur-md bg-yellow/80 text-black rounded-lg disabled:opacity-50 hover:bg-yellow shadow-lg disabled:active:scale-100 active:scale-97 shadow-yellow/30 transition-all duration-300 hover:scale-102 disabled:hover:scale-100">
				Suivant
			</button>
			<button
				v-if="currentStep === getMaxStep()"
				type="submit"
				:disabled="submitting"
				class="ml-auto px-4 sm:px-6 py-2 backdrop-blur-md bg-gradient-to-r from-yellow to-white text-black rounded-lg shadow-lg shadow-yellow/30 disabled:active:scale-100 active:scale-97 hover:shadow-xl hover:scale-102 transition-all duration-200">
				{{ submitting ? "Envoi en cours..." : "Envoyer" }}
			</button>
		</div>
	</form>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";

const props = defineProps({
	preSelectedArtworkId: {
		type: Number,
		default: null,
	},
});

const emit = defineEmits(["form-loaded"]);

const contactReasons = [
	{ value: "artwork", label: "Achat d'œuvre" },
	{ value: "collaboration", label: "Collaboration" },
	{ value: "discussion", label: "Discussion artistique" },
	{ value: "commission", label: "Commande personnalisée" },
];

const artworks = ref([]);
const selectedArtworks = ref([]);
const preSelectedArtwork = ref(null);
const currentStep = ref(0);
const selectedReason = ref({});
const artworksLoaded = ref(false);
const stepHistory = ref([]);
const formSubmitted = ref(false);
const submitSuccess = ref(false);
const submitting = ref(false);
const showSearchResults = ref(false);
let isEmailValid = ref(true);
let blurTimeout = null;
const showRgpdError = ref(false);

const form = ref({
	firstName: "",
	lastName: "",
	email: "",
	phone: "",
	message: "",
	reason: "",
	reasonDetails: "",
	document: null,
	documentBase64: null,
	documentName: null,
	rgpdConsent: false,
});

// Email validation function
const validateEmail = (email) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	isEmailValid.value = emailRegex.test(email);
	return isEmailValid.value;
};

// Watch email changes for validation
watch(
	() => form.value.email,
	(newEmail) => {
		if (newEmail) {
			validateEmail(newEmail);
		} else {
			isEmailValid.value = true;
		}
	}
);

watch(
	selectedArtworks,
	(newArtworks) => {
		if (selectedReason.value.value === "artwork" && newArtworks.length > 0) {
			form.value.message = getMessageTemplate();
		}
	},
	{ deep: true }
);

// Watch RGPD consent changes to hide error when checkbox is checked
watch(
	() => form.value.rgpdConsent,
	(newValue) => {
		if (newValue) {
			showRgpdError.value = false;
		}
	}
);

const loadArtworks = async () => {
	if (artworksLoaded.value) return;

	try {
		const response = await $fetch("/api/forSalePaintings");
		artworks.value = response;
		artworksLoaded.value = true;

		if (props.preSelectedArtworkId) {
			preSelectedArtwork.value = artworks.value.find(
				(artwork) => artwork.id === props.preSelectedArtworkId
			);

			if (preSelectedArtwork.value) {
				selectedArtworks.value = [preSelectedArtwork.value];
				currentStep.value = 1;
				selectedReason.value = { value: "artwork", label: "Achat d'œuvre" };
				form.value.reason = "artwork";
				form.value.reasonDetails = "Intéressé(e) par cette œuvre";
				form.value.message = getMessageTemplate();
				stepHistory.value = [0, 1];
			}
		}
		emit("form-loaded", true);
	} catch (error) {
		console.error("Error fetching artworks:", error);
		emit("form-loaded", false);
	}
};

const otherArtworks = computed(() =>
	preSelectedArtwork.value
		? artworks.value.filter((a) => a.id !== preSelectedArtwork.value.id)
		: artworks.value
);

const visibleSteps = computed(() => {
	if (preSelectedArtwork.value) {
		return ["Œuvre", "Résumé", "Coordonnées", "Message"];
	}
	if (selectedReason.value.value === "artwork") {
		return ["Motif", "Œuvres", "Résumé", "Coordonnées", "Message"];
	}
	return ["Motif", "Coordonnées", "Message"];
});

const currentVisibleStepIndex = computed(() => {
	if (preSelectedArtwork.value) {
		if (currentStep.value === 1) return 0;
		if (currentStep.value === 2) return 1;
		if (currentStep.value === 3) return 2;
		if (currentStep.value === 4) return 3;
	} else if (selectedReason.value.value === "artwork") {
		return currentStep.value;
	} else if (selectedReason.value.value) {
		if (currentStep.value === 0) return 0;
		if (currentStep.value === 1) return 1;
		if (currentStep.value === 4) return 2;
	}
	return currentStep.value;
});

const getPersonalDetailsStep = () => {
	if (selectedReason.value.value === "artwork") {
		return 3;
	}
	return 1;
};

const getMessageStep = () => {
	if (selectedReason.value.value === "artwork") {
		return 4;
	}
	return 4;
};

const getMaxStep = () => {
	if (selectedReason.value.value === "artwork") {
		return 4;
	}
	return 4;
};

const isStepValid = computed(() => {
	switch (currentStep.value) {
		case 0:
			return selectedReason.value.value;
		case 1:
			if (selectedReason.value.value === "artwork") {
				return selectedArtworks.value.length > 0;
			}
			return form.value.firstName && form.value.email && isEmailValid.value;
		case 2:
			if (selectedReason.value.value === "artwork") {
				return true;
			}
			return true;
		case 3:
			if (selectedReason.value.value === "artwork") {
				return form.value.firstName && form.value.email && isEmailValid.value;
			}
			return (
				form.value.message.length > 10 &&
				form.value.reasonDetails &&
				form.value.rgpdConsent
			);
		case 4:
			return form.value.message.length > 10 && form.value.rgpdConsent;
		default:
			return false;
	}
});

const selectReason = (reason) => {
	form.value = {
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		message: "",
		reason: reason.value,
		reasonDetails: "",
		document: null,
		rgpdConsent: false,
	};

	showRgpdError.value = false;

	if (selectedReason.value.value !== reason.value) {
		selectedArtworks.value = [];
	}

	selectedReason.value = reason;

	if (reason.value === "artwork") {
		form.value.reasonDetails = "Intéressé(e) à l'achat";
	}

	if (reason.value === "artwork" && !artworksLoaded.value) {
		loadArtworks();
		nextStep();
	} else if (reason.value !== "artwork") {
		currentStep.value = getPersonalDetailsStep();
	} else {
		nextStep();
	}
};

const toggleArtworkSelection = (artwork) => {
	const index = selectedArtworks.value.findIndex((a) => a.id === artwork.id);
	if (index > -1) {
		selectedArtworks.value.splice(index, 1);
	} else {
		selectedArtworks.value.push(artwork);
	}
};

const isArtworkSelected = (artwork) =>
	selectedArtworks.value.some((a) => a.id === artwork.id);

const handleFileUpload = (event) => {
	const file = event.target.files[0];
	if (!file) {
		form.value.document = null;
		form.value.documentBase64 = null;
		form.value.documentName = null;
		return;
	}

	form.value.document = file;
	form.value.documentName = file.name;

	const reader = new FileReader();
	reader.onload = (e) => {
		form.value.documentBase64 = e.target.result;
	};
	reader.readAsDataURL(file);
};

const getMessageTemplate = () => {
	const soldArtworks = selectedArtworks.value.filter(
		(a) => a.state === "OFF_SALE"
	);
	const availableArtworks = selectedArtworks.value.filter(
		(a) => a.state !== "OFF_SALE"
	);

	let message = "Bonjour,\n\n";

	if (availableArtworks.length > 0) {
		const artworkNames = availableArtworks.map((a) => a.name).join(", ");
		const isMultiple = availableArtworks.length > 1;
		message += `Je suis intéressé(e) par ${
			isMultiple ? "les œuvres" : "l'œuvre"
		} suivante${isMultiple ? "s" : ""} : ${artworkNames}.\n\n`;
	}

	if (soldArtworks.length > 0) {
		const soldArtworkNames = soldArtworks.map((a) => a.name).join(", ");
		const isMultipleSold = soldArtworks.length > 1;
		message += `Je souhaite demander une réédition ${
			isMultipleSold ? "des œuvres" : "de l'œuvre"
		} suivante${isMultipleSold ? "s" : ""} : ${soldArtworkNames}.\n\n`;
	}

	message += "Pourriez-vous me donner plus d'informations ?\n\nCordialement,";

	return message;
};

const nextStep = () => {
	if (currentStep.value < getMaxStep()) {
		// Validate email if it's a step with email input
		if (
			(currentStep.value === 1 && selectedReason.value.value !== "artwork") ||
			(currentStep.value === 3 && selectedReason.value.value === "artwork")
		) {
			if (form.value.email && !validateEmail(form.value.email)) {
				return;
			}
		}

		stepHistory.value.push(currentStep.value);
		currentStep.value++;

		if (
			selectedReason.value.value &&
			selectedReason.value.value !== "artwork"
		) {
			if (currentStep.value === 2 || currentStep.value === 3) {
				currentStep.value = getMessageStep();
			}
		}

		if (
			currentStep.value === getMessageStep() &&
			selectedReason.value.value === "artwork"
		) {
			if (!form.value.message) {
				form.value.message = getMessageTemplate();
			}
		}
	}
};

const previousStep = () => {
	if (currentStep.value > 0) {
		if (preSelectedArtwork.value && currentStep.value === 1) {
			return;
		}

		if (
			selectedReason.value.value &&
			selectedReason.value.value !== "artwork"
		) {
			if (currentStep.value === 4) {
				currentStep.value = 1;
				return;
			}
		}

		resetStepData(currentStep.value);
		currentStep.value--;
	}
};

const resetStepData = (step) => {
	switch (step) {
		case 1:
			if (
				!preSelectedArtwork.value &&
				selectedReason.value.value === "artwork"
			) {
				selectedArtworks.value = [];
			}
			break;
		case 2:
			break;
		case 3:
			form.value.firstName = "";
			form.value.lastName = "";
			form.value.email = "";
			form.value.phone = "";
			form.value.rgpdConsent = false;
			showRgpdError.value = false;
			break;
		case 4:
			if (selectedReason.value.value !== "artwork") {
				form.value.reasonDetails = "";
			}
			form.value.document = null;
			form.value.rgpdConsent = false;
			showRgpdError.value = false;
			break;
	}
};

const submitForm = async () => {
	// Final email validation before submit
	if (form.value.email && !validateEmail(form.value.email)) {
		return;
	}

	// Check RGPD consent before submission
	if (!form.value.rgpdConsent) {
		showRgpdError.value = true;
		return;
	}

	submitting.value = true;

	try {
		const formData = { ...form.value };

		if (selectedReason.value.value === "artwork") {
			formData.selectedArtworks = selectedArtworks.value;
		}

		const response = await fetch("/api/contact", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		});

		const result = await response.json();

		if (!result.success) {
			throw new Error(result.error || "Erreur lors de l'envoi du message");
		}

		submitSuccess.value = true;
		formSubmitted.value = true;

		resetForm();
	} catch (error) {
		console.error("Erreur lors de l'envoi du formulaire:", error);
		submitSuccess.value = false;
		formSubmitted.value = true;
	} finally {
		setTimeout(() => {
			submitting.value = false;
		}, 5000);
	}
};

const resetForm = () => {
	form.value = {
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		message: "",
		reason: "",
		reasonDetails: "",
		document: null,
		rgpdConsent: false,
	};
	selectedArtworks.value = [];
	currentStep.value = 0;
	formSubmitted.value = false;
	submitSuccess.value = false;
	isEmailValid.value = true;
	showRgpdError.value = false;

	if (props.preSelectedArtworkId && preSelectedArtwork.value) {
		selectedArtworks.value = [preSelectedArtwork.value];
		currentStep.value = 1;
		selectedReason.value = { value: "artwork", label: "Achat d'œuvre" };
		form.value.reason = "artwork";
		form.value.reasonDetails = "Intéressé(e) par cette œuvre";
		form.value.message = getMessageTemplate();
		stepHistory.value = [0, 1];
	} else {
		selectedReason.value = {};
		stepHistory.value = [];
	}
};

const retrySubmit = () => {
	formSubmitted.value = false;
};

const artworkSearchQuery = ref("");
const artworkSearchResults = ref([]);

const itemsPerPage = 6;
const currentPage = ref(1);

const searchArtworks = () => {
	if (!artworkSearchQuery.value) {
		artworkSearchResults.value = [];
		return;
	}

	const query = artworkSearchQuery.value.toLowerCase();
	artworkSearchResults.value = artworks.value
		.filter((artwork) => artwork.name.toLowerCase().includes(query))
		.slice(0, 5);
};
const selectSearchResult = (artwork) => {
	toggleArtworkSelection(artwork);
	artworkSearchQuery.value = "";
	artworkSearchResults.value = [];
	showSearchResults.value = false;
	if (blurTimeout) {
		clearTimeout(blurTimeout);
		blurTimeout = null;
	}
};

const handleSearchBlur = () => {
	if (blurTimeout) {
		clearTimeout(blurTimeout);
	}

	blurTimeout = setTimeout(() => {
		showSearchResults.value = false;
		blurTimeout = null;
	}, 200);
};

const filteredArtworks = computed(() => {
	const startIndex = (currentPage.value - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;

	if (!artworkSearchQuery.value) {
		return artworks.value.slice(startIndex, endIndex);
	}

	const query = artworkSearchQuery.value.toLowerCase();
	return artworks.value
		.filter((artwork) => artwork.name.toLowerCase().includes(query))
		.slice(startIndex, endIndex);
});

const totalPages = computed(() => {
	if (!artworkSearchQuery.value) {
		return Math.ceil(artworks.value.length / itemsPerPage);
	}

	const query = artworkSearchQuery.value.toLowerCase();
	const filteredCount = artworks.value.filter((artwork) =>
		artwork.name.toLowerCase().includes(query)
	).length;

	return Math.ceil(filteredCount / itemsPerPage);
});

const otherFilteredArtworks = computed(() => {
	const startIndex = (currentPage.value - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;

	let filteredArtworks = otherArtworks.value;

	if (artworkSearchQuery.value) {
		const query = artworkSearchQuery.value.toLowerCase();
		filteredArtworks = otherArtworks.value.filter((artwork) =>
			artwork.name.toLowerCase().includes(query)
		);
	}

	return filteredArtworks.slice(startIndex, endIndex);
});

const totalPagesWithoutPreselected = computed(() => {
	let filteredCount = otherArtworks.value.length;

	if (artworkSearchQuery.value) {
		const query = artworkSearchQuery.value.toLowerCase();
		filteredCount = otherArtworks.value.filter((artwork) =>
			artwork.name.toLowerCase().includes(query)
		).length;
	}

	return Math.max(1, Math.ceil(filteredCount / itemsPerPage));
});

const nextPage = () => {
	if (currentPage.value < totalPages.value) {
		currentPage.value++;
	}
};

const prevPage = () => {
	if (currentPage.value > 1) {
		currentPage.value--;
	}
};

const autoResize = (element) => {
	element.style.height = "auto";
	element.style.height = element.scrollHeight + "px";
};

const initializeTextareas = () => {
	setTimeout(() => {
		document.querySelectorAll("textarea").forEach((textarea) => {
			autoResize(textarea);
		});
	}, 0);
};

watch(
	artworkSearchQuery,
	() => {
		currentPage.value = 1;
	},
	{ immediate: true }
);

watch(currentStep, (newStep) => {
	if (newStep === getMessageStep()) {
		nextTick(() => {
			initializeTextareas();
		});
	}
});

onMounted(() => {
	if (props.preSelectedArtworkId) {
		loadArtworks();
	} else {
		emit("form-loaded", true);
	}
	initializeTextareas();
});
</script>
