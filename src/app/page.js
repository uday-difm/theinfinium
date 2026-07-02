import Link from "next/link";
import Sidebar from "../components/Sidebar";
import { posts as localPosts } from "../data/posts";
import { cms, getSeoMetadata } from "../lib/cms";
import { getPosts } from "../services";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const seo = await getSeoMetadata("/");
  return {
    title:
      seo?.title ||
      "The Infinium - Exposing Lending Lies. Empowering Business Truths.",
    description:
      seo?.description ||
      "A research portal, compliance guide, and analysis platform dedicated to Merchant Cash Advances (MCA) and business funding transparency.",
    alternates: {
      canonical: seo?.canonical || undefined,
    },
  };
}

// Helper component for post placeholder illustrations
function PostIllustration({ categorySlug }) {
  const gradients = {
    "mca-lending": "from-amber-600 to-yellow-700",
    "business-funding": "from-emerald-500 to-teal-700",
    "credit-compliance": "from-rose-500 to-red-700",
    "founders-finance": "from-violet-500 to-purple-700",
    "merchant-resources": "from-amber-500 to-orange-600",
    "news-policy": "from-slate-600 to-neutral-800",
    "tech-tools": "from-cyan-500 to-blue-600",
    "turnaround-stories": "from-fuchsia-500 to-pink-600",
  };

  const bg = gradients[categorySlug] || "from-amber-600 to-yellow-700";

  return (
    <div
      className={`w-full h-full bg-gradient-to-br ${bg} flex items-center justify-center p-6 text-white text-center select-none`}
    >
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">
          The Infinium
        </span>
        <div className="font-ui font-black text-lg tracking-tight leading-none opacity-85">
          FINANCE INSIGHTS
        </div>
      </div>
    </div>
  );
}

export default async function Home({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const searchQuery = resolvedSearchParams?.search || "";

  // Fetch all posts to get featured stories
  const allPosts = await getPosts();
  const featuredPosts = allPosts.filter((p) => p.featured);

  // Ensure at least some featured items exist
  if (!featuredPosts.length && allPosts.length > 0) {
    allPosts[0].featured = true;
    featuredPosts.push(allPosts[0]);
    if (allPosts[1]) {
      allPosts[1].featured = true;
      featuredPosts.push(allPosts[1]);
    }
    if (allPosts[2]) {
      allPosts[2].featured = true;
      featuredPosts.push(allPosts[2]);
    }
  }

  const POSTS_PER_PAGE = 5;
  const currentPage = parseInt(resolvedSearchParams?.page || "1", 10);

  // Fetch paginated posts for the feed list (fully server-side paginated & searched)
  const paginatedPosts = await getPosts({
    page: currentPage,
    limit: POSTS_PER_PAGE,
    search: searchQuery || undefined
  });

  const pagination = paginatedPosts.pagination || {
    page: currentPage,
    limit: POSTS_PER_PAGE,
    totalPosts: paginatedPosts.length,
    totalPages: 1
  };

  const totalPages = pagination.totalPages;
  const latestPostsCount = pagination.totalPosts;
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + paginatedPosts.length;

  // Helper to build page url preserving existing query params
  const getPageUrl = (pageNum) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    params.set("page", pageNum);
    return `/?${params.toString()}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans">
      {/* Search Header Info */}
      {searchQuery && (
        <div className="mb-8 border-b border-gray-200 pb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Search Results for:{" "}
            <span className="text-primary">&quot;{searchQuery}&quot;</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Found {latestPostsCount} matches
          </p>
        </div>
      )}

      {/* Hero Featured Section (Only when not searching) */}
      {!searchQuery && featuredPosts.length > 0 && currentPage === 1 && (
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Primary Featured Card (Large) */}
            <div className="lg:col-span-2 relative group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-end min-h-[350px] sm:min-h-[450px]">
              <div className="absolute inset-0 z-0">
                {featuredPosts[0].image ? (
                  <img
                    src={featuredPosts[0].image}
                    alt={featuredPosts[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <PostIllustration
                    categorySlug={featuredPosts[0].categorySlug}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              </div>

              <div className="relative z-10 p-6 sm:p-8 text-white space-y-3">
                <Link
                  href={`/category/${featuredPosts[0].categorySlug}`}
                  className="inline-block bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md"
                >
                  {featuredPosts[0].category}
                </Link>
                <h2 className="text-xl sm:text-3xl font-bold tracking-tight leading-tight group-hover:text-yellow-200 transition-colors">
                  <Link href={`/posts/${featuredPosts[0].slug}`}>
                    {featuredPosts[0].title}
                  </Link>
                </h2>
                <p className="text-sm text-gray-300 line-clamp-2 max-w-2xl">
                  {featuredPosts[0].snippet}
                </p>
                <div className="flex items-center gap-4 pt-2 text-xs font-semibold text-gray-300">
                  <span>{featuredPosts[0].author}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                  <span>{featuredPosts[0].date}</span>
                </div>
              </div>
            </div>

            {/* Featured Column (Small Cards) */}
            <div className="flex flex-col gap-6">
              {featuredPosts.slice(1, 3).map((post) => (
                <div
                  key={post.slug}
                  className="relative group overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-all flex-1 flex flex-col justify-end min-h-[180px] sm:min-h-[210px]"
                >
                  <div className="absolute inset-0 z-0">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <PostIllustration categorySlug={post.categorySlug} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  </div>

                  <div className="relative z-10 text-white space-y-2">
                    <Link
                      href={`/category/${post.categorySlug}`}
                      className="inline-block text-[9px] font-bold uppercase tracking-widest text-yellow-200"
                    >
                      {post.category}
                    </Link>
                    <h3 className="text-base font-bold leading-snug group-hover:text-yellow-100 transition-colors line-clamp-2">
                      <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <div className="flex items-center gap-3 text-[10px] text-gray-300">
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Feed */}
        <div className="lg:col-span-2 space-y-8">
          <h3 className="text-lg font-bold uppercase tracking-wider text-gray-900 border-b border-gray-150 pb-3 mb-6 font-ui flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-primary"></span>
            {searchQuery ? "Search Results" : "Latest Articles"}
          </h3>

          {paginatedPosts.length > 0 ? (
            <div className="space-y-8">
              {paginatedPosts.map((post) => (
                <article
                  key={post.slug}
                  className="group flex flex-col sm:flex-row gap-6 bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-300"
                >
                  {/* Thumbnail */}
                  <div className="sm:w-48 h-36 flex-none overflow-hidden rounded-xl bg-gray-100 relative">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <PostIllustration categorySlug={post.categorySlug} />
                    )}
                  </div>

                  {/* Content details */}
                  <div className="flex flex-col justify-between py-1">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/category/${post.categorySlug}`}
                          className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
                        >
                          {post.category}
                        </Link>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors leading-snug">
                        <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {post.snippet}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 mt-4 sm:mt-0">
                      <span>By {post.author}</span>
                      <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                      <span>{post.date}</span>
                      <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </article>
              ))}

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-8">
                  <div className="flex-1 flex justify-between sm:hidden">
                    {currentPage > 1 ? (
                      <Link
                        href={getPageUrl(currentPage - 1)}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-700 bg-white rounded-full hover:bg-gray-50"
                      >
                        Previous
                      </Link>
                    ) : (
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-300 bg-white rounded-full cursor-not-allowed">
                        Previous
                      </span>
                    )}
                    {currentPage < totalPages ? (
                      <Link
                        href={getPageUrl(currentPage + 1)}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-700 bg-white rounded-full hover:bg-gray-50"
                      >
                        Next
                      </Link>
                    ) : (
                      <span className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-300 bg-white rounded-full cursor-not-allowed">
                        Next
                      </span>
                    )}
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">
                        Showing <span className="font-bold text-gray-900">{Math.min(startIndex + 1, latestPostsCount)}</span> to{" "}
                        <span className="font-bold text-gray-900">{Math.min(endIndex, latestPostsCount)}</span> of{" "}
                        <span className="font-bold text-gray-900">{latestPostsCount}</span> articles
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-full shadow-sm -space-x-px" aria-label="Pagination">
                        {/* Previous Button */}
                        <Link
                          href={currentPage > 1 ? getPageUrl(currentPage - 1) : "#"}
                          className={`relative inline-flex items-center px-3 py-2 rounded-l-full border border-gray-200 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage <= 1 ? "pointer-events-none opacity-50" : ""}`}
                        >
                          <span className="sr-only">Previous</span>
                          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </Link>
                        {/* Page Numbers */}
                        {Array.from({ length: totalPages }).map((_, i) => {
                          const pageNum = i + 1;
                          const isActive = pageNum === currentPage;
                          return (
                            <Link
                              key={pageNum}
                              href={getPageUrl(pageNum)}
                              aria-current={isActive ? "page" : undefined}
                              className={`relative inline-flex items-center px-4 py-2 border text-xs font-semibold ${isActive ? "z-10 bg-primary border-primary text-white" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                            >
                              {pageNum}
                            </Link>
                          );
                        })}
                        {/* Next Button */}
                        <Link
                          href={currentPage < totalPages ? getPageUrl(currentPage + 1) : "#"}
                          className={`relative inline-flex items-center px-3 py-2 rounded-r-full border border-gray-200 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}`}
                        >
                          <span className="sr-only">Next</span>
                          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-150 p-8 space-y-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12 mx-auto text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 21l-4.9-4.9M17.25 10.5a6.75 6.75 0 11-13.5 0 6.75 6.75 0 0113.5 0z"
                />
              </svg>
              <h4 className="text-md font-semibold text-gray-700">
                No articles match your search
              </h4>
              <p className="text-sm text-gray-500">
                Please try using different terms or keywords.
              </p>
              <Link
                href="/"
                className="inline-block bg-primary text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-primary-hover transition-colors"
              >
                Clear Search
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Sidebar */}
        <div className="lg:col-span-1">
          <Sidebar posts={allPosts} />
        </div>
      </div>
    </div>
  );
}
