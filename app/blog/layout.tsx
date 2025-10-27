import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Blog",
  description: "Explore our collection of articles on technology, design, development, and more. Stay updated with the latest insights and tutorials.",
  openGraph: {
    title: "Blog | Papertrail",
    description: "Explore our collection of articles on technology, design, development, and more",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
