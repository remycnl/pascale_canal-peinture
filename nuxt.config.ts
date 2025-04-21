import tailwindcss from "@tailwindcss/vite";
import { definePerson } from "nuxt-schema-org/schema";
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
	compatibilityDate: "2025-04-21",
	devtools: { enabled: true },
	css: [
		"@/assets/css/main.css",
		"@/assets/css/scrollBar.css",
		"@/assets/css/transition.css",
		"@/assets/css/checkbox.css",
	],
	modules: [
		"@nuxt/image",
		"@nuxtjs/sitemap",
		"@nuxtjs/robots",
		"nuxt-schema-org",
	],
	plugins: [
		{ src: "@/plugins/smooth-scroll.client.js", mode: "client" },
		{ src: "@/plugins/fluid-cursor-webgl.client.js", mode: "client" },
	],
	vite: {
		plugins: [tailwindcss()],


	},
	nitro: {
		preset: "vercel",
		prerender: {
			crawlLinks: true,
			routes: ["/"],
		},

	},
	robots: {
		disallow: ["/secret"],
	},
	sitemap: {
		defaults: {
			priority: 0.5,
			changefreq: "weekly",
			lastmod: new Date().toISOString(),
		},
		sources: ["/api/sitemap-urls"],
	},
	schemaOrg: {
		minify: true,
		identity: definePerson({
			name: "Pascale Canal",
			image: "/pascalecanal.jpg",
			description: "Artiste Peintre",
			url: process.env.NUXT_SITE_URL || "http://localhost:3000",
			sameAs: ["https://www.linkedin.com/in/pascale-canal"],
		}),
	},
	image: {
		providers: {
			cloudinary: {
				provider: "cloudinary",
			},
			static: {
				provider: "ipx",
			},
		},
	},
	runtimeConfig: {
		public: {
			NUXT_SECRET_KEY: process.env.NUXT_SECRET_KEY,
			siteUrl: process.env.NUXT_SITE_URL || "http://localhost:3000",
			siteName:
				process.env.NUXT_SITE_NAME ||
				"Pascale Canal | Artiste Peintre • Exposition en ligne",
		},
	},
});
