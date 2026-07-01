import Link from "next/link";
import { notFound } from "next/navigation";
import Sidebar from "../../../components/Sidebar";
import { categories, posts as localPosts } from "../../../data/posts";
import { cms, getSeoMetadata } from "../../../lib/cms";
import { getPosts } from "../../../services";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const category = categories.find((c) => c.slug === slug);
  const categoryName = category ? category.name : slug;

  const seo = await getSeoMetadata(`/category/${slug}`);
  return {
    title: seo?.title || `${categoryName} - The Infinium`,
    description:
      seo?.description ||
      `Explore business funding articles, resources, and insights categorized under ${categoryName}.`,
    alternates: {
      canonical: seo?.canonical || undefined,
    },
  };
}

// Helper component for category illustration card
function CategoryIllustration({ categorySlug }) {
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
      className={`w-full h-full bg-gradient-to-br ${bg} flex items-center justify-center p-6 text-white text-center`}
    >
      <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">
        The Infinium
      </span>
    </div>
  );
}

export async function generateStaticParams() {
  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

export default async function CategoryPage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  // Fetch posts from CMS with safe local fallback
  const activePosts = await getPosts();

  // Filter posts belonging to current category
  const filteredPosts = activePosts.filter(
    (post) => post.categorySlug === slug,
  );

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
            <span className="text-gray-900">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans">
        {/* Category Header */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm mb-8 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-primary font-ui">
            Category Archive
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900">
            {category.name}
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
            {category.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Feed */}
          <div className="lg:col-span-2 space-y-6">
            {filteredPosts.length > 0 ? (
              <div className="space-y-6">
                {filteredPosts.map((post) => (
                  <article
                    key={post.slug}
                    className="group flex flex-col sm:flex-row gap-6 bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-300"
                  >
                    {/* Thumbnail */}
                    <div className="sm:w-44 h-32 flex-none overflow-hidden rounded-xl bg-gray-100 relative">
                      {post.image ? (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <CategoryIllustration categorySlug={post.categorySlug} />
                      )}
                    </div>

                    {/* Content details */}
                    <div className="flex flex-col justify-between py-1">
                      <div className="space-y-1.5">
                        <h4 className="text-md sm:text-lg font-bold text-gray-900 group-hover:text-primary transition-colors leading-snug">
                          <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                          {post.snippet}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 mt-4 sm:mt-0">
                        <span>{post.author}</span>
                        <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                        <span>{post.date}</span>
                        <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-150 p-8 space-y-3">
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
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
                <h4 className="text-md font-semibold text-gray-700">
                  No articles found
                </h4>
                <p className="text-sm text-gray-500">
                  There are currently no articles in this category archive.
                </p>
                <Link
                  href="/"
                  className="inline-block bg-primary text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-primary-hover transition-colors"
                >
                  Return Home
                </Link>
              </div>
            )}
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
