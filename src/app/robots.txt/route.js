export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_CMS_BASE_URL || "http://localhost:3000";
  const siteId = process.env.NEXT_PUBLIC_SITE_ID || "infinium";

  try {
    const res = await fetch(`${baseUrl}/api/seo/robots?siteId=${siteId}`, {
      cache: "no-store",
    });

    if (res.ok) {
      let text = await res.text();
      
      // Standardize sitemap URL to point to frontend sitemap
      const frontendDomain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
      text = text.replace(/Sitemap:\s*http.*/i, `Sitemap: ${frontendDomain}/sitemap.xml`);

      return new Response(text, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
      });
    }
  } catch (e) {
    console.error("Failed to proxy robots.txt from backend:", e);
  }

  // Fallback robots.txt
  return new Response("User-agent: *\nAllow: /", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
