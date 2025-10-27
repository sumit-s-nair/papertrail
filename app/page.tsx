import { Hero } from "@/components/layout/hero";
import { Features } from "@/components/layout/features";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JsonLd } from "@/components/seo/json-ld";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Papertrail",
    url: "https://papertrail-chi.vercel.app",
    description: "Create, edit, and manage blog posts with category management. A modern blogging platform built with Next.js, tRPC, and PostgreSQL.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://papertrail-chi.vercel.app/blog?search={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={structuredData} />
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
