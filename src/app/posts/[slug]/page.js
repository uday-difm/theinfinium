import Link from "next/link";
import { notFound } from "next/navigation";
import Sidebar from "../../../components/Sidebar";
import ShareButton from "../../../components/ShareButton";

import { cms, getSeoMetadata } from "../../../lib/cms";
import { getPosts } from "../../../services";
import { posts as localPosts } from "../../../data/posts";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // Try to load local fallback details
  const localPost = localPosts.find((p) => p.slug === slug);
  const fallbackTitle = localPost
    ? `${localPost.title} - The Infinium`
    : "Blog Post - The Infinium";
  const fallbackDescription = localPost
    ? localPost.snippet
    : "Read our latest MCA research and commercial finance intelligence updates.";

  const seo = await getSeoMetadata(slug);
  return {
    title: seo?.title || fallbackTitle,
    description: seo?.description || fallbackDescription,
    alternates: {
      canonical: seo?.canonical || undefined,
    },
  };
}

// Helper component for post illustration header
function PostHeaderIllustration({ categorySlug }) {
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
      className={`w-full h-64 sm:h-96 bg-gradient-to-br ${bg} flex items-center justify-center text-white relative`}
    >
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="z-10 text-center space-y-2 px-4">
        <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
          The Infinium Research
        </span>
        <h2 className="font-ui font-black text-2xl sm:text-4xl tracking-tight leading-none opacity-90 max-w-lg mx-auto">
          COMMERCIAL COMPLIANCE & INTELLIGENCE
        </h2>
      </div>
    </div>
  );
}

// Generate static params for optimal routing
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // Fetch posts from CMS with safe local fallback
  const activePosts = await getPosts();

  const post = activePosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Top Breadcrumbs */}
      <div className="border-b border-gray-200 bg-white py-3">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex text-xs font-semibold text-gray-500 gap-2 items-center">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <Link
              href={`/category/${post.categorySlug}`}
              className="hover:text-primary transition-colors"
            >
              {post.category}
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 truncate max-w-xs sm:max-w-sm">
              {post.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Post Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Box */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm space-y-4">
              <Link
                href={`/category/${post.categorySlug}`}
                className="inline-block bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md"
              >
                {post.category}
              </Link>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px]">
                    {post.author
                      ? post.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)
                      : "AR"}
                  </span>
                  <span>By {post.author}</span>
                </div>
                <span className="hidden sm:inline h-1 w-1 rounded-full bg-gray-300"></span>
                <span>Published on {post.date}</span>
                <span className="hidden sm:inline h-1 w-1 rounded-full bg-gray-300"></span>
                <span>{post.readTime}</span>
              </div>
            </div>

            {/* Featured Image Illustration */}
            <div className="overflow-hidden rounded-3xl border border-gray-100 shadow-sm">
              {post.image ? (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-auto max-h-[500px] object-cover"
                />
              ) : (
                <PostHeaderIllustration categorySlug={post.categorySlug} />
              )}
            </div>

            {/* Post Content */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-10 shadow-sm">
              <article
                className="prose prose-blue max-w-none text-gray-700 leading-relaxed space-y-6
                  [&>p]:text-sm sm:[&>p]:text-base [&>p]:leading-relaxed
                  [&>h2]:text-xl sm:[&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:pt-4
                  [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-gray-900 [&>h3]:pt-2
                  [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>ul]:text-sm sm:[&>ul]:text-base
                  [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-2 [&>ol]:text-sm sm:[&>ol]:text-base
                  [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-650 [&>blockquote]:my-6
                  [&>table]:min-w-full [&>table]:divide-y [&>table]:divide-gray-200 [&>table]:border [&>table]:my-6"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Share / Back buttons */}
              <div className="mt-10 border-t border-gray-100 pt-6 flex items-center justify-between">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-3.5 h-3.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                    />
                  </svg>
                  Back to Home
                </Link>

                <div className="flex gap-2">
                  <ShareButton />
                </div>
              </div>
            </div>

            {/* Author Profile card */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
              <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold font-ui flex-none">
                {post.author
                  ? post.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "AR"}
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Written By
                </span>
                <h4 className="text-md font-bold text-gray-900">
                  {post.author}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {post.authorBio}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar posts={activePosts} />
          </div>
        </div>
      </div>
    </div>
  );
}
