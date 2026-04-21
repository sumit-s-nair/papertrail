"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, PenLine, BookOpen, Rss } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";

const floatingTags = [
  "Getting Started", "Design", "Research", "Software",
  "Technology", "Culture", "Business", "Art",
];

export function Hero() {
  const { data: stats } = trpc.stats.getStats.useQuery();
  const user = useUser();
  const router = useRouter();

  return (
    <section className="relative overflow-hidden min-h-[92vh] flex flex-col items-center justify-center">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-primary/10 blur-[120px] animate-slow-pulse" />
        <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[100px] animate-slow-pulse [animation-delay:-2s]" />
        <div className="absolute top-1/4 -right-32 w-[400px] h-[400px] rounded-full bg-accent/20 blur-[90px] animate-slow-pulse [animation-delay:-4s]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-5xl mx-auto text-center space-y-10">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>A new kind of blogging experience</span>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]">
              <span className="block">Where ideas</span>
              <span className="block bg-gradient-to-r from-primary via-primary/80 to-accent-foreground bg-clip-text text-transparent">
                find their voice
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed pt-2">
              Write, publish, and discover thoughtful content. PaperTrail is a modern platform
              built for people who care about what they create.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button size="lg" className="h-12 px-8 text-base group shadow-lg shadow-primary/25">
                  <PenLine className="mr-2 h-4 w-4" />
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : (
              <Button
                size="lg"
                className="h-12 px-8 text-base group shadow-lg shadow-primary/25"
                onClick={() => router.push("/handler/sign-in")}
              >
                <PenLine className="mr-2 h-4 w-4" />
                Start Writing — it&apos;s free
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
            <Link href="/blog">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                <BookOpen className="mr-2 h-4 w-4" />
                Explore Articles
              </Button>
            </Link>
          </div>

          {/* Floating category tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <span className="text-xs text-muted-foreground mr-1 flex items-center gap-1">
              <Rss className="h-3 w-3" /> Topics:
            </span>
            {floatingTags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?category=${tag.toLowerCase()}`}
                className="inline-flex items-center rounded-full border border-border/60 bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-200 backdrop-blur-sm"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* Stats strip */}
          {(stats?.articles ?? 0) > 0 && (
            <div className="flex items-center justify-center gap-8 pt-6 border-t border-border/40">
              <div className="text-center">
                <p className="text-2xl font-bold">{stats!.articles}+</p>
                <p className="text-xs text-muted-foreground">Articles</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold">{stats!.writers}+</p>
                <p className="text-xs text-muted-foreground">Writers</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold">Open</p>
                <p className="text-xs text-muted-foreground">Source</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
