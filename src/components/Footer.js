import Link from "next/link";
import { posts as localPosts } from "../data/posts";
import Image from "next/image";
import { getPosts } from "../services";

export default async function Footer({
  siteName = "The Infinium",
  logoUrl = "/FooterLogo.png",
  tagline = "Exposing Lending Lies. Empowering Business Truths.",
  navigation = [],
  footerLinks = [],
  footerColumns = [],
  copyright = "© 2026 The Infinium. All rights reserved.",
}) {
  // Fetch posts from CMS with safe local fallback
  let activePosts = localPosts;

  try {
    const cmsPosts = await getPosts();
    if (Array.isArray(cmsPosts) && cmsPosts.length > 0) {
      activePosts = cmsPosts;
    }
  } catch (err) {
    // Fail silently, falls back to local posts
  }

  // Grab the 3 latest posts for the footer feed
  const recentPosts = activePosts.slice(0, 3);

  // Use CMS footer links if available, otherwise fallback to static links
  const bottomLinks =
    footerLinks.length > 0
      ? footerLinks
      : [
          { label: "About", url: "/about" },
          { label: "Contact Us", url: "/contact" },
          { label: "Terms of Use", url: "/" },
          { label: "Cookie Policy", url: "/" },
          { label: "Privacy Policy", url: "/" },
        ];

  // Retrieve dynamic description from CMS footer builder if available
  const cmsDescription = footerColumns?.[0]?.description || footerColumns?.[0]?.content;
  const descriptionText = cmsDescription || `${tagline} ${siteName} is a dedicated research center, knowledge hub, and strategic resource focusing on the Merchant Cash Advance (MCA) industry and alternative business lending.`;

  return (
    <footer className="bg-zinc-950 text-zinc-300 border-t border-zinc-900 font-sans">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Column 1: About / Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={`${siteName} Logo`}
                  width={520}
                  height={500}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <span className="text-xl font-bold tracking-tight text-white font-ui block mb-2">
                  {siteName.toLowerCase()}
                </span>
              )}
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {descriptionText}
            </p>
            <div className="pt-2 text-xs text-zinc-500">
              Owned and operated by{" "}
              <a
                href="https://difm.llc"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white underline"
              >
                Do It For Me LLC
              </a>
              .
            </div>
          </div>

          {/* Column 2: Recent News */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white font-ui border-b border-zinc-800 pb-2">
              Recent News
            </h3>
            <ul className="space-y-4">
              {recentPosts.map((post) => (
                <li key={post.slug} className="group">
                  <Link href={`/posts/${post.slug}`} className="flex gap-3">
                    <div className="flex-1">
                      <span className="text-xs text-primary font-semibold font-ui uppercase">
                        {post.category}
                      </span>
                      <h4 className="text-xs font-medium text-zinc-200 group-hover:text-primary transition-colors mt-0.5 line-clamp-2">
                        {post.title}
                      </h4>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="mt-12 border-t border-zinc-900 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>{copyright}</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {bottomLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.url || "/"}
                className="hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
