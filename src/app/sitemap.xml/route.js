import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_CMS_BASE_URL || "http://localhost:3000";
  const siteId = process.env.NEXT_PUBLIC_SITE_ID || "infinium";
  const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

  try {
    const res = await fetch(`${baseUrl}/api/sitemap?siteId=${siteId}&domain=${encodeURIComponent(domain)}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const xml = await res.text();
      return new Response(xml, {
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
      });
    }
  } catch (e) {
    console.error("Failed to proxy sitemap from backend:", e);
  }

  // Fallback empty sitemap
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
