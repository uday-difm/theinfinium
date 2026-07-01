import { notFound } from "next/navigation";
import Link from "next/link";
import { cms, getSeoMetadata } from "../../../lib/cms";
import { RichTextRenderer } from "@yourcompany/global-backend-next/components";

export async function generateMetadata({ params }) {
  const p = await params;
  const rawType = p?.type;

  const seo = await getSeoMetadata(`/legal/${rawType}`);
  return {
    title: seo?.title || "Legal Page - The Infinium",
    description: seo?.description || "Legal document and regulatory information.",
    alternates: {
      canonical: seo?.canonical || undefined,
    },
  };
}

export default async function LegalPage({ params }) {
  const p = await params;
  const rawType = p?.type;

  let legalPage = null;
  try {
    legalPage = await cms.getLegalPage(rawType);
  } catch (err) {
    console.error(`Failed to fetch legal page for ${rawType}:`, err);
  }

  const page = legalPage?.legalPage || legalPage?.page || legalPage;
  if (!page) {
    return notFound();
  }

  const title = page.title || "";
  const content = page.content || "";
  const contentJson = page.contentJson || null;
  const lastUpdated = page.updatedAt || page.lastUpdated;

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 font-sans">
      <div className="max-w-4xl mx-auto px-6">
        <nav className="flex items-center gap-2 text-[10px] font-bold text-gray-400 mb-8 uppercase tracking-wider">
          <Link href="/" className="hover:text-primary transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-650">{title || "Legal"}</span>
        </nav>

        <article className="max-w-none bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-4 leading-tight">
            {title}
          </h1>
          {lastUpdated && (
            <p className="text-xs text-gray-400 mb-8 border-b border-gray-150 pb-4">
              Last updated:{" "}
              {new Date(lastUpdated).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}

          <div className="prose prose-slate max-w-none mt-6">
            {contentJson ? (
              <RichTextRenderer content={contentJson} />
            ) : content?.startsWith("<") ? (
              <div
                className="text-sm text-gray-700 leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <div className="text-sm text-gray-700 leading-relaxed space-y-4 whitespace-pre-line">
                {content}
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
