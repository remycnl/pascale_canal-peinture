<!-- /pages/newsletter/unsubscribe.vue -->
<template>
  <div class="unsubscribe-page py-16 max-w-2xl mx-auto px-4">
    <div class="text-center mb-10">
      <h1 class="text-3xl font-apercuBold mb-2">Gestion de votre abonnement</h1>
      <p class="text-gray-600">Gérez vos préférences de newsletter</p>
    </div>
    
    <!-- Chargement en cours -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="inline-block w-8 h-8 border-2 border-t-yellow rounded-full animate-spin"></div>
      <p class="mt-4 text-gray-600">Chargement en cours...</p>
    </div>
    
    <!-- Erreur -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 class="text-xl font-apercuBold mb-2 text-red-700">{{ error }}</h2>
      <p class="text-gray-600 mb-4">Le lien de désabonnement semble invalide ou a expiré.</p>
      <nuxt-link to="/" class="inline-block px-4 py-2 border border-black bg-yellow rounded hover:bg-yellow/70">
        Retour à l'accueil
      </nuxt-link>
    </div>
    
    <!-- Confirmation de désabonnement -->
    <div v-else-if="unsubscribeSuccess" class="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <h2 class="text-xl font-apercuBold mb-2 text-green-700">Désabonnement confirmé</h2>
      <p class="text-gray-600 mb-2">{{ message }}</p>
      <p class="text-gray-600 mb-6">Vous ne recevrez plus d'emails de notre part.</p>
      <div class="flex justify-center">
        <button 
          @click="resubscribe" 
          class="px-4 py-2 border border-black bg-yellow rounded hover:bg-yellow/70 mr-4"
          :disabled="isResubscribing"
        >
          {{ isResubscribing ? 'En cours...' : 'Se réabonner' }}
        </button>
        <nuxt-link to="/" class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
          Retour à l'accueil
        </nuxt-link>
      </div>
    </div>
    
    <!-- Formulaire de confirmation -->
    <div v-else class="bg-white border rounded-lg p-6 shadow-sm">
      <div class="mb-6">
        <h2 class="text-xl font-apercuBold mb-2">Confirmer le désabonnement</h2>
        <p class="text-gray-600">
          Vous êtes sur le point de vous désabonner de notre newsletter.
          <span v-if="subscriberEmail"> L'adresse email concernée est : <strong>{{ subscriberEmail }}</strong>.</span>
        </p>
      </div>
      
      <div class="mb-6" v-if="subscriptionTypes.length > 0">
        <h3 class="font-apercuMedium mb-2">Vos abonnements actuels :</h3>
        <ul class="list-disc pl-5 text-gray-600">
          <li v-for="(type, index) in subscriptionTypes" :key="index">{{ type }}</li>
        </ul>
      </div>
      
      <div class="flex justify-end">
        <button 
          @click="confirmUnsubscribe" 
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 mr-4"
          :disabled="isUnsubscribing"
        >
          {{ isUnsubscribing ? 'En cours...' : 'Confirmer le désabonnement' }}
        </button>
        <nuxt-link to="/" class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
          Annuler
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const token = ref(route.query.token || '');

const isLoading = ref(true);
const error = ref(null);
const subscriberEmail = ref('');
const subscriptionTypes = ref([]);
const isUnsubscribing = ref(false);
const unsubscribeSuccess = ref(false);
const message = ref('');
const isResubscribing = ref(false);

// Type d'abonnement en français
const subscriptionTypeLabels = {
  'NEW_ARTWORK': 'Nouvelles œuvres',
  'EVENTS': 'Événements',
  'BOTH': 'Nouvelles œuvres et événements'
};

// Vérifier le token et récupérer les informations de l'abonnement
onMounted(async () => {
  if (!token.value) {
    error.value = 'Lien de désabonnement invalide';
    isLoading.value = false;
    return;
  }
  
  try {
    // Vérifier le token et récupérer les informations de l'abonnement
    const response = await $fetch('/api/newsletter/check-token', {
      params: { token: token.value }
    });
    
    if (!response.success) {
      error.value = response.message || 'Token invalide';
      isLoading.value = false;
      return;
    }
    
    // Si l'abonnement est déjà désactivé
    if (!response.subscriber.isActive) {
      unsubscribeSuccess.value = true;
      message.value = 'Vous êtes déjà désabonné de notre newsletter.';
      isLoading.value = false;
      return;
    }
    
    // Afficher les informations de l'abonnement
    subscriberEmail.value = response.subscriber.email;
    
    // Ajouter le type d'abonnement
    const type = response.subscriber.subscriptionType;
    subscriptionTypes.value.push(subscriptionTypeLabels[type] || type);
    
  } catch (err) {
    console.error('Erreur lors de la vérification du token:', err);
    error.value = 'Une erreur est survenue lors de la vérification du lien de désabonnement.';
  } finally {
    isLoading.value = false;
  }
});

// Confirmer le désabonnement
const confirmUnsubscribe = async () => {
  isUnsubscribing.value = true;
  
  try {
    const response = await $fetch('/api/newsletter/unsubscribe', {
      params: { token: token.value }
    });
    
    unsubscribeSuccess.value = true;
    message.value = response.message || 'Désabonnement effectué avec succès.';
  } catch (err) {
    console.error('Erreur lors du désabonnement:', err);
    error.value = 'Une erreur est survenue lors du désabonnement.';
  } finally {
    isUnsubscribing.value = false;
  }
};

// Se réabonner
const resubscribe = async () => {
  isResubscribing.value = true;
  
  try {
    const response = await $fetch('/api/newsletter/resubscribe', {
      params: { token: token.value }
    });
    
    if (response.success) {
      unsubscribeSuccess.value = false;
      error.value = null;
      
      // Rediriger vers l'accueil avec un message de confirmation
      navigateTo('/?resubscribed=true');
    } else {
      error.value = response.message || 'Échec de la réactivation de l\'abonnement.';
      unsubscribeSuccess.value = false;
    }
  } catch (err) {
    console.error('Erreur lors de la réactivation:', err);
    error.value = 'Une erreur est survenue lors de la réactivation de l\'abonnement.';
    unsubscribeSuccess.value = false;
  } finally {
    isResubscribing.value = false;
  }
};
</script>