export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_CMS_BASE_URL || "http://localhost:3000";
  const siteId = process.env.NEXT_PUBLIC_SITE_ID || "infinium";

  try {
    const res = await fetch(`${baseUrl}/api/seo/llm-txt?siteId=${siteId}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const text = await res.text();
      return new Response(text, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
      });
    }
  } catch (e) {
    console.error("Failed to proxy llms.txt from backend:", e);
  }

  // Fallback llms.txt
  return new Response("# The Infinium - AI Agent Guide\n\nFallback content.", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
