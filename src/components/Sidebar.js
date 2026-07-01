import Link from "next/link";
import { posts as localPosts } from "../data/posts";

export default function Sidebar({ posts }) {
  const activePosts = posts && posts.length > 0 ? posts : localPosts;
  // Grab top trending posts (e.g. 5 posts)
  const trendingPosts = activePosts.slice(0, 5);

  return (
    <aside className="w-full space-y-8 lg:sticky lg:top-24">
      {/* Trending Box */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3 mb-6 font-ui flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary"></span>
          Trending Stories
        </h3>

        <ul className="space-y-6">
          {trendingPosts.map((post, idx) => (
            <li key={post.slug} className="flex gap-4 group">
              {/* Number indicator */}
              <div className="flex-none">
                <span className="font-ui text-2xl font-black text-gray-300 group-hover:text-primary/20 transition-colors">
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Post details */}
              <div className="flex-1">
                <Link
                  href={`/category/${post.categorySlug}`}
                  className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
                >
                  {post.category}
                </Link>
                <h4 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors mt-0.5 leading-snug line-clamp-2">
                  <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                </h4>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* About Box in Sidebar */}
      <div className="rounded-2xl bg-primary/5 border border-primary/10 p-6">
        <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2 font-ui">
          About The Infinium
        </h4>
        <p className="text-xs text-gray-600 leading-relaxed">
          Exposing lending practices and empowering business owners with
          alternative financing intelligence.
        </p>
        <Link
          href="/about"
          className="inline-flex items-center text-xs font-semibold text-primary hover:underline mt-3"
        >
          Read Our Mission
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-3.5 h-3.5 ml-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </Link>
      </div>
    </aside>
  );
}
