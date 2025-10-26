import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { mockPosts } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";

export async function generateStaticParams() {
  return mockPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = mockPosts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Back Button */}
        <Link href="/blog" className="inline-block mb-8">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        {/* Post Header */}
        <header className="mb-8 space-y-6">
          <div className="flex flex-wrap gap-2">
            {post.categories.map((category) => (
              <Badge key={category} variant="secondary">
                {category}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            {post.title}
          </h1>

          <p className="text-xl text-muted-foreground">{post.description}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{post.author}</span>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-12 rounded-xl overflow-hidden">
          <Image
            src={post.imageUrl}
            alt={post.title}
            width={1200}
            height={600}
            className="w-full h-auto"
            priority
          />
        </div>

        {/* Post Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>
            This is where the full blog post content would go. In a real application, 
            you would fetch the full markdown or rich text content from your database 
            and render it here.
          </p>
          
          <h2>Introduction</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
            tempor incididunt ut labore et dolore magna aliqua.
          </p>

          <h2>Key Takeaways</h2>
          <ul>
            <li>First important point about the topic</li>
            <li>Second crucial insight to remember</li>
            <li>Third actionable recommendation</li>
          </ul>

          <h2>Conclusion</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In a real implementation, 
            you would use a markdown parser to render the actual content.
          </p>
        </div>

        <Separator className="my-12" />

        {/* Author Info */}
        <div className="flex items-center space-x-4 p-6 bg-muted/50 rounded-lg">
          <div className="flex-1">
            <p className="font-semibold text-lg">{post.author}</p>
            <p className="text-sm text-muted-foreground">
              Content writer sharing insights on design, technology, and product development.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
