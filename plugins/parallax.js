export default defineNuxtPlugin((nuxtApp) => {
    if (import.meta.client) {
        const setupParallax = () => {
            const parallaxElements = document.querySelectorAll(".parallax");
            const parallaxStrongElements = document.querySelectorAll(".parallax-strong");
            const parallaxReverseElements = document.querySelectorAll(".parallax-reverse");
            
            if ((parallaxElements.length || parallaxStrongElements.length || parallaxReverseElements.length) && 
                window.location.pathname === "/qui-suis-je") {
                window.addEventListener("mousemove", handleMouseMove);
            }
        };

        const cleanupParallax = () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };

        nuxtApp.$router.beforeEach((to, from, next) => {
            cleanupParallax();
            next();
        });

        nuxtApp.$router.afterEach((to) => {
            setTimeout(() => {
                setupParallax();
            }, 0);
        });

        setupParallax();
    }

    function handleMouseMove(e) {
        const parallaxElements = document.querySelectorAll(".parallax");
        const parallaxStrongElements = document.querySelectorAll(".parallax-strong");
        const parallaxReverseElements = document.querySelectorAll(".parallax-reverse");
        
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const valueX = (centerX - e.clientX) / 30;
        const valueY = (centerY - e.clientY) / 10;
        const strongValueX = (centerX - e.clientX) / 20;
        const strongValueY = (centerY - e.clientY) / 10;
        const reverseValueX = -valueX;
        const reverseValueY = -valueY;

        parallaxElements.forEach(parallax => {
            parallax.style.transform = `translate3d(${valueX}px, ${valueY}px, 0)`;
        });

        parallaxStrongElements.forEach(parallaxStrong => {
            parallaxStrong.style.transform = `translate3d(${strongValueX}px, ${strongValueY}px, 0)`;
        });
        
        parallaxReverseElements.forEach(parallaxReverse => {
            parallaxReverse.style.transform = `translate3d(${reverseValueX}px, ${reverseValueY}px, 0)`;
        });
    }
});