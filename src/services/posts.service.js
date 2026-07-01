/**
 * Posts service — fetches posts from CMS with local fallback.
 */
import { cms } from "@/lib/cms";
import { posts as localPosts } from "@/data/posts";
import { mapPosts } from "@/mappers";

/**
 * Get posts from CMS, falling back to local data if CMS is unavailable.
 * Returns posts in the infinium local format.
 * @returns {Array}
 */
export async function getPosts(options = {}) {
  try {
    const cmsResponse = await cms.getPosts(options);
    const cmsPosts = cmsResponse?.data?.posts || cmsResponse?.posts || cmsResponse;
    const pagination = cmsResponse?.data?.pagination || cmsResponse?.pagination || null;

    if (Array.isArray(cmsPosts) && cmsPosts.length > 0) {
      const mapped = mapPosts(cmsPosts);
      if (pagination) {
        mapped.pagination = pagination;
      }
      return mapped;
    }
  } catch (err) {
    console.warn(
      "CMS Connection failed or no posts; falling back to local database.",
      err.message,
    );
  }

  // Local fallback pagination mock
  let fallbackPosts = localPosts;
  if (options.search) {
    fallbackPosts = fallbackPosts.filter(
      (p) =>
        (p.title || "").toLowerCase().includes(options.search.toLowerCase()) ||
        (p.snippet || p.excerpt || "").toLowerCase().includes(options.search.toLowerCase()),
    );
  }

  let paginated = fallbackPosts;
  let paginationInfo = null;

  if (options.page || options.limit) {
    const page = parseInt(options.page || "1", 10);
    const limit = parseInt(options.limit || "5", 10);
    paginated = fallbackPosts.slice((page - 1) * limit, page * limit);
    paginationInfo = {
      page,
      limit,
      totalPosts: fallbackPosts.length,
      totalPages: Math.ceil(fallbackPosts.length / limit),
    };
  }

  const mappedFallback = mapPosts(paginated);
  if (paginationInfo) {
    mappedFallback.pagination = paginationInfo;
  }
  return mappedFallback;
}

