import ContactForm from "./ContactForm";
import { getSeoMetadata } from "../../lib/cms";
import { getPosts } from "../../services";

export async function generateMetadata() {
  const seo = await getSeoMetadata("/contact");
  return {
    title: seo?.title || "Contact Us - The Infinium",
    description: seo?.description || "Get in touch with The Infinium. Send us inquiries, feedback, or suggestions about Merchant Cash Advances (MCA) transparency.",
    alternates: {
      canonical: seo?.canonical || undefined,
    },
  };
}

export default async function Page() {
  const posts = await getPosts();
  return <ContactForm posts={posts} />;
}
