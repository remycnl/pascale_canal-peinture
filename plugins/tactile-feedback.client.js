// plugins/haptic-feedback.client.js
export default defineNuxtPlugin(() => {
  // Détection mobile simple et fiable
  const isMobile = () => {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           ('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0)
  }

  // Vérifier si on est sur mobile
  if (!isMobile()) {
    console.log('Haptic: Not on mobile device')
    return
  }

  // Vérifier le support de vibration
  if (!('vibrate' in navigator)) {
    console.log('Haptic: Vibration API not supported')
    return
  }

  console.log('Haptic: Plugin initialized on mobile device')

  // Fonction de vibration simple
  let lastVibration = 0
  const vibrate = (pattern = [10]) => {
    const now = Date.now()
    // Throttle à 100ms pour éviter le spam
    if (now - lastVibration < 100) return
    
    lastVibration = now
    
    try {
      navigator.vibrate(pattern)
      console.log('Haptic triggered:', pattern)
    } catch (error) {
      console.error('Haptic error:', error)
    }
  }

  // Patterns de vibration
  const patterns = {
    light: [10],
    medium: [20],
    heavy: [30, 10, 30],
    click: [5]
  }

  // Sélecteurs d'éléments interactifs
  const isInteractive = (element) => {
    if (!element) return false
    
    const tagName = element.tagName.toLowerCase()
    const role = element.getAttribute('role')
    
    return (
      tagName === 'a' ||
      tagName === 'button' ||
      element.type === 'button' ||
      element.type === 'submit' ||
      role === 'button' ||
      element.classList.contains('nuxt-link-active') ||
      element.classList.contains('nuxt-link-exact-active') ||
      element.hasAttribute('href') ||
      element.hasAttribute('data-haptic')
    )
  }

  // Gestionnaire d'événement simple
  const handleTouch = (event) => {
    let target = event.target
    
    // Remonter dans l'arbre DOM pour trouver un élément interactif
    for (let i = 0; i < 5 && target; i++) {
      if (isInteractive(target)) {
        // Ignorer les éléments désactivés
        if (target.disabled || target.getAttribute('aria-disabled') === 'true') {
          return
        }
        
        // Déterminer le type de vibration
        let patternType = 'light'
        
        if (target.hasAttribute('data-haptic-type')) {
          patternType = target.getAttribute('data-haptic-type')
        } else if (target.tagName.toLowerCase() === 'button' || target.getAttribute('role') === 'button') {
          patternType = 'medium'
        }
        
        vibrate(patterns[patternType] || patterns.light)
        console.log('Haptic triggered for:', target.tagName, target.className)
        break
      }
      target = target.parentElement
    }
  }

  // Ajouter l'event listener
  document.addEventListener('touchstart', handleTouch, { passive: true })
  
  // Test initial pour vérifier que ça fonctionne
  setTimeout(() => {
    console.log('Haptic: Testing vibration...')
    vibrate([50])
  }, 1000)

  // Nettoyer en mode dev
  if (process.dev && typeof module !== 'undefined' && module.hot) {
    module.hot.dispose(() => {
      document.removeEventListener('touchstart', handleTouch)
    })
  }

  // Fournir une API globale
  return {
    provide: {
      haptic: {
        vibrate: (type = 'light') => vibrate(patterns[type] || patterns.light),
        test: () => vibrate([100, 50, 100])
      }
    }
  }
})