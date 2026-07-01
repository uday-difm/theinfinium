import { CMSClient } from "@yourcompany/global-backend-next";

// Abort fetch after this many ms when the backend is unreachable
const FETCH_TIMEOUT = 15_000;

const _origRequest = CMSClient.prototype._request;
CMSClient.prototype._request = function (...args) {
  // Race the original SDK request against a timeout so the frontend never
  // hangs for minutes when the backend is unreachable.
  return Promise.race([
    _origRequest.apply(this, args),
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("CMS request timed out")),
        FETCH_TIMEOUT,
      ),
    ),
  ]);
};
CMSClient.prototype.getPosts = function (options = {}) {
  const params = new URLSearchParams();
  if (options.page) params.set("page", options.page);
  if (options.limit) params.set("limit", options.limit);
  if (options.search) params.set("search", options.search);
  const qs = params.toString();
  return this._request(`/api/posts${qs ? "?" + qs : ""}`);
};

export const cms = new CMSClient({
  baseUrl: process.env.NEXT_PUBLIC_CMS_BASE_URL ||
    (typeof window === "undefined"
      ? "http://localhost:3000"
      : window.location.origin),
  siteId: process.env.NEXT_PUBLIC_SITE_ID || "infinium",
});

/**
 * Fetches SEO metadata from the backend for a given page/post slug.
 * Returns null if not found or if the backend is unreachable.
 * 
 * @param {string} pageSlug - The path slug of the page or post (e.g. '/' or '/about' or 'posts/some-post')
 */
export async function getSeoMetadata(pageSlug) {
  try {
    const siteId = process.env.NEXT_PUBLIC_SITE_ID || "infinium";
    const baseUrl = process.env.NEXT_PUBLIC_CMS_BASE_URL || "http://localhost:3000";
    let slugToFetch = pageSlug;
    if (slugToFetch === "/" || slugToFetch === "") {
      slugToFetch = "home";
    }
    const cleanSlug = encodeURIComponent(slugToFetch);
    const res = await fetch(`${baseUrl}/api/seo/${cleanSlug}?siteId=${siteId}`, {
      next: { revalidate: 3600 }
    });
    if (res.ok) {
      const data = await res.json();
      return data?.data?.seo || data?.seo || null;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching SEO metadata for ${pageSlug}:`, error);
    return null;
  }
}

