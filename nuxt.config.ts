import tailwindcss from "@tailwindcss/vite";
import { definePerson } from "nuxt-schema-org/schema";
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
	compatibilityDate: "2024-04-03",
	devtools: { enabled: true },
	css: [
		"@/assets/css/main.css",
		"@/assets/css/scrollBar.css",
		"@/assets/css/transition.css",
		"@/assets/css/checkbox.css",
	],
	modules: [
		"@nuxt/image",
		"@prisma/nuxt",
		"@nuxtjs/sitemap",
		"@nuxtjs/robots",
		"nuxt-schema-org",
	],
	plugins: [
		{ src: "@/plugins/smooth-scroll.client.js", mode: "client" },
		{ src: "@/plugins/fluid-cursor-webgl.client.js", mode: "client" },
	],
	app: {
		head: {
			link: [
				{
					rel: "preconnect",
					href: "https://res.cloudinary.com",
					crossorigin: "anonymous",
				},
			],
		},
	},
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				".prisma/client/index-browser":
					"./node_modules/.prisma/client/index-browser.js",
			},
		},
	},
	nitro: {
		preset: "vercel",
		compressPublicAssets: true,
		moduleSideEffects: ["@prisma/client"],
		prerender: {
			crawlLinks: true,
			routes: ["/"],
		},
		esbuild: {
			options: {
				target: "es2020",
			},
		},
	},
	site: {
		url: process.env.NUXT_SITE_URL || "http://localhost:3000",
		name:
			process.env.NUXT_SITE_NAME ||
			"Pascale Canal | Artiste Peintre • Exposition en ligne",
	},
	robots: {
		disallow: ["/secret", "/newsletter"],
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
	routeRules: {
		"/secret/**": { robots: false },
		"/newsletter/**": { robots: false },
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
			contactEmail: process.env.CONTACT_EMAIL || "noreply@example.com",
		},
	},
});
