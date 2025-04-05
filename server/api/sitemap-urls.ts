import { defineSitemapEventHandler, createError } from "#imports";
import type { SitemapUrlInput } from "#sitemap/types";
import prisma from "@/lib/prisma";

const fetchSlugs = async () => {
	try {
		const paintings = await prisma.painting.findMany({
			select: { slug: true },
			orderBy: {
				date: "desc",
			},
		});

		return paintings;
	} catch (error: unknown) {
		console.error("Sitemap Error:", error);
		throw createError({
			statusCode: 500,
			message: "Erreur lors de la récupération des slugs pour le sitemap",
			stack: error instanceof Error ? error.stack : undefined,
		});
	}
};

export default defineSitemapEventHandler(async () => {
	const slugs = await fetchSlugs();

	const dynamicUrls: SitemapUrlInput[] = slugs.map(({ slug }) => ({
		loc: `/${slug}`,
		lastmod: new Date().toISOString(),
		changefreq: "weekly",
		priority: 0.7,
	}));

	return [
		{
			loc: "/",
			priority: 1.0,
			changefreq: "daily",
			lastmod: new Date().toISOString(),
		},
		{
			loc: "/qui-suis-je",
			priority: 0.9,
			changefreq: "monthly",
			lastmod: new Date().toISOString(),
		},
		{
			loc: "/comment-ca-marche",
			priority: 0.9,
			changefreq: "monthly",
			lastmod: new Date().toISOString(),
		},
		{
			loc: "/mes-evenements",
			priority: 0.8,
			changefreq: "weekly",
			lastmod: new Date().toISOString(),
		},
		{
			loc: "/contact",
			priority: 0.8,
			changefreq: "monthly",
			lastmod: new Date().toISOString(),
		},
		{
			loc: "/faq",
			priority: 0.8,
			changefreq: "monthly",
			lastmod: new Date().toISOString(),
		},
		{
			loc: "/mentions-legales",
			priority: 0.4,
			changefreq: "yearly",
			lastmod: new Date().toISOString(),
		},
		{
			loc: "/politique-de-confidentialite",
			priority: 0.4,
			changefreq: "yearly",
			lastmod: new Date().toISOString(),
		},
		{
			loc: "/cgu",
			priority: 0.4,
			changefreq: "yearly",
			lastmod: new Date().toISOString(),
		},
		...dynamicUrls,
	] satisfies SitemapUrlInput[];
});
