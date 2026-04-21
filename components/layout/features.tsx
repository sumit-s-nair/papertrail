"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  PenTool, FolderHeart, Sparkles, Layers, Search, ArrowRight,
  FileText, Globe, Lock, Share2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@stackframe/stack";

const primaryFeatures = [
  {
    icon: PenTool,
    tag: "Writing",
    title: "Distraction-free Editor",
    description:
      "Focus entirely on your thoughts. Our immersive markdown editor gets out of your way so the words just flow.",
    wide: true,
  },
  {
    icon: FolderHeart,
    tag: "Organization",
    title: "Categorize & Curate",
    description:
      "Keep your content neatly organized with flexible categories and tags, making it easy for readers to explore.",
    wide: false,
  },
  {
    icon: Sparkles,
    tag: "Experience",
    title: "Beautifully Minimalist",
    description:
      "A carefully crafted, ad-free reading experience bathed in gorgeous typography and a soothing dark mode.",
    wide: false,
  },
  {
    icon: Search,
    tag: "Discovery",
    title: "Lightning-Fast Discovery",
    description:
      "Instant search and blazing-fast page loads ensure your audience finds and reads your content without waiting.",
    wide: true,
  },
];

const minorFeatures = [
  { icon: FileText, label: "Rich Markdown" },
  { icon: Globe, label: "SEO Optimized" },
  { icon: Lock, label: "Private Drafts" },
  { icon: Share2, label: "Easy Sharing" },
  { icon: Layers, label: "Seamless Publishing" },
];

export function Features() {
  const user = useUser();
  const router = useRouter();

  return (
    <section className="py-24 md:py-36">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <p className="text-sm font-semibold tracking-widest uppercase text-primary">
            Why PaperTrail
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              create amazing content
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Thoughtful tools designed for modern creators — from your first draft to a global audience.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 max-w-6xl mx-auto">
          {primaryFeatures.map((feature, i) => (
            <div
              key={i}
              className={`
                group relative rounded-2xl border border-border/60 bg-card/40 overflow-hidden
                hover:border-primary/30 hover:bg-card hover:shadow-xl hover:shadow-primary/5
                transition-all duration-300 p-7 backdrop-blur-sm
                ${feature.wide ? "lg:col-span-2" : "lg:col-span-1"}
              `}
            >
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent flex-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-[11px] font-semibold tracking-wide uppercase text-muted-foreground border border-border/60 rounded-full px-2.5 py-1">
                    {feature.tag}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold leading-snug">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Minor features row */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {minorFeatures.map((f, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/50 hover:border-primary/20 p-5 text-center transition-all duration-200 group backdrop-blur-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 border border-primary/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                  <f.icon className="h-4.5 w-4.5 text-primary h-5 w-5" />
                </div>
                <span className="text-sm font-medium leading-tight">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Strip */}
        <div className="mt-16 max-w-6xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            {/* Glow */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/15 rounded-full blur-[80px]" />
            </div>

            <div className="space-y-2 max-w-xl">
              <h3 className="text-2xl md:text-3xl font-bold">
                Ready to share your story?
              </h3>
              <p className="text-muted-foreground">
                Join PaperTrail today — it&apos;s free to join, beautiful to read, and a joy to write on.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              {user ? (
                <Link href="/dashboard">
                  <Button size="lg" className="shadow-lg shadow-primary/25 px-8">
                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button
                  size="lg"
                  className="shadow-lg shadow-primary/25 px-8"
                  onClick={() => router.push("/handler/sign-in")}
                >
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
              <Link href="/blog">
                <Button size="lg" variant="outline" className="px-8">
                  Browse Articles
                </Button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
