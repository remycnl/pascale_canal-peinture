export default defineNuxtPlugin((nuxtApp) => {
	if (import.meta.client && window.innerWidth > 1024) {
		let ticking = false;
		let lastMouseX = 0;
		let lastMouseY = 0;
		let animationFrameId = null;

		const setupParallax = () => {
			const parallaxElements = document.querySelectorAll(".parallax");
			const parallaxStrongElements =
				document.querySelectorAll(".parallax-strong");

			if (
				(parallaxElements.length || parallaxStrongElements.length) &&
				window.location.pathname === "/qui-suis-je"
			) {
				window.addEventListener("mousemove", handleMouseMoveThrottled);
			}
		};

		const cleanupParallax = () => {
			window.removeEventListener("mousemove", handleMouseMoveThrottled);
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
				animationFrameId = null;
			}
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

		function handleMouseMoveThrottled(e) {
			lastMouseX = e.clientX;
			lastMouseY = e.clientY;

			if (!ticking) {
				ticking = true;
				animationFrameId = requestAnimationFrame(() => {
					handleMouseMove(lastMouseX, lastMouseY);
					ticking = false;
				});
			}
		}

		function handleMouseMove(mouseX, mouseY) {
			const parallaxElements = document.querySelectorAll(".parallax");
			const parallaxStrongElements =
				document.querySelectorAll(".parallax-strong");

			const centerX = window.innerWidth / 2;
			const centerY = window.innerHeight / 2;
			const valueX = (centerX - mouseX) / 30;
			const valueY = (centerY - mouseY) / 10;
			const strongValueX = (centerX - mouseX) / 20;
			const strongValueY = (centerY - mouseY) / 10;

			parallaxElements.forEach((parallax) => {
				parallax.style.transform = `translate3d(${valueX}px, ${valueY}px, 0)`;
			});

			parallaxStrongElements.forEach((parallaxStrong) => {
				parallaxStrong.style.transform = `translate3d(${strongValueX}px, ${strongValueY}px, 0)`;
			});
		}

		setupParallax();
	}
});
