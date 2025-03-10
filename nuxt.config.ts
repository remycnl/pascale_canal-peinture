import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",
	devtools: { enabled: true },
	css: [
		"@/assets/css/main.css",
		"@/assets/css/scrollBar.css",
		"@/assets/css/transition.css",
	],
	modules: ["@nuxt/image", "@prisma/nuxt"],
	plugins: [
		{ src: "@/plugins/smooth-scroll.client.js", mode: "client" },
		{ src: "@/plugins/fluid-cursor-webgl.client.js", mode: "client" },
	],
	vite: {
		plugins: [tailwindcss()],
		optimizeDeps: {
			exclude: ["@prisma/client"],
		},
	},
	nitro: {
		preset: "vercel",
		// Important part to handle Prisma properly
		moduleSideEffects: ["@prisma/client"],
	},
	runtimeConfig: {
		public: {
			NUXT_SECRET_KEY: process.env.NUXT_SECRET_KEY,
		},
	},
});
