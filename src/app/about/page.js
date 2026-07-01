import Link from "next/link";
import Sidebar from "../../components/Sidebar";
import { getSeoMetadata } from "../../lib/cms";
import { getPosts } from "../../services";

export async function generateMetadata() {
  const seo = await getSeoMetadata("/about");
  return {
    title: seo?.title || "About Us - The Infinium",
    description: seo?.description || "Empowering merchants with knowledge and resources on MCA compliance, finance news, and turnaround insights.",
    alternates: {
      canonical: seo?.canonical || undefined,
    },
  };
}

export default async function AboutPage() {
  const activePosts = await getPosts();
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
            <span className="text-gray-900">About</span>
          </nav>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* Left Column: About Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header Box */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-primary font-ui">
                Who We Are
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                About The Infinium
              </h1>
              <p className="text-sm sm:text-md text-gray-500 leading-relaxed max-w-2xl">
                Exposing Lending Lies. Empowering Business Truths.
              </p>
            </div>

            {/* Content Article */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-10 shadow-sm space-y-6 text-gray-700 leading-relaxed">
              <p className="text-base sm:text-lg font-medium text-gray-900">
                The Infinium is a dedicated research center, compliance resource, and strategic news portal created to bring clarity to the complex, rapidly evolving world of alternative business finance.
              </p>
              
              <p>
                As small business formations continue to break records across the United States, traditional banking credit channels have tightened. Distressed or fast-growing businesses often turn to alternative financing structures—most notably, Merchant Cash Advances (MCAs). While these tools provide crucial liquidity, they also bring unique legal structures, hidden fee systems, and compliance requirements.
              </p>

              <h2 className="text-lg sm:text-xl font-bold text-gray-900 pt-4">
                Our Core Objectives
              </h2>
              
              <ul className="list-disc pl-5 space-y-3">
                <li>
                  <strong>Industry Advocacy & Reform:</strong> Exposing predatory stacking and deceptive funding behaviors while championing sustainable commercial credit practices.
                </li>
                <li>
                  <strong>Regulatory Clarity:</strong> Offering standard breakdowns of complex state-level disclosure laws across California, New York, Utah, and Virginia.
                </li>
                <li>
                  <strong>Merchant Education:</strong> Empowering owners with the knowledge to distinguish between defaults, delinquencies, and their legal reconciliation rights.
                </li>
                <li>
                  <strong>Fintech Integration:</strong> Inspecting tools, transaction analytics systems, and database models that form the modern alternative financing ecosystem.
                </li>
              </ul>

              <h2 className="text-lg sm:text-xl font-bold text-gray-900 pt-4">
                Ownership & Operations
              </h2>
              
              <p>
                The Infinium is proudly owned and operated by <strong>Do It For Me LLC</strong>. All research papers, regulatory articles, and media resources are curated by alternative commercial lending analysts and credit compliance specialists.
              </p>

              <blockquote>
                <p className="border-l-4 border-primary pl-4 italic text-gray-650 font-medium my-4">
                  "Transparency in commercial lending isn't just about regulatory check-boxes; it's about protecting the entrepreneurial spirit that fuels our economy."
                </p>
              </blockquote>

              <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-5 py-2.5 text-xs font-semibold hover:bg-primary-hover transition-all shadow-sm"
                >
                  Get In Touch
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-3.5 h-3.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
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
