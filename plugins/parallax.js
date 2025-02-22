export default defineNuxtPlugin((nuxtApp) => {
    if (import.meta.client) {
        const setupParallax = () => {
            const parallaxElements = document.querySelectorAll(".parallax");
            const parallaxStrongElements = document.querySelectorAll(".parallax-strong");
            if ((parallaxElements.length || parallaxStrongElements.length) && window.location.pathname === "/qui-suis-je") {
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
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const valueX = (centerX - e.pageX) / 50;
        const valueY = (centerY - e.pageY) / 30;
        const strongValueX = (centerX - e.pageX) / 40;
        const strongValueY = (centerY - e.pageY) / 20;

        parallaxElements.forEach(parallax => {
            parallax.style.transform = `translate3d(${valueX}px, ${valueY}px, 0)`;
        });

        parallaxStrongElements.forEach(parallaxStrong => {
            parallaxStrong.style.transform = `translate3d(${strongValueX}px, ${strongValueY}px, 0)`;
        });
    }
});
