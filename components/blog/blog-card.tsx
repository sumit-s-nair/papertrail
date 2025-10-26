import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { BlogPost } from "@/lib/mock-data";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <Card className={`overflow-hidden transition-all hover:shadow-xl hover:border-primary/20 ${
        featured ? "md:col-span-2" : ""
      }`}>
        <div className="relative overflow-hidden">
          <Image
            src={post.imageUrl}
            alt={post.title}
            width={800}
            height={featured ? 500 : 400}
            className="w-full h-48 md:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <CardHeader className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {post.categories.slice(0, 3).map((category) => (
              <Badge key={category} variant="secondary" className="text-xs">
                {category}
              </Badge>
            ))}
          </div>
          <h3 className={`font-semibold leading-tight group-hover:text-primary transition-colors ${
            featured ? "text-2xl md:text-3xl" : "text-xl"
          }`}>
            {post.title}
            <ArrowRight className="inline-block ml-2 h-5 w-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </h3>
        </CardHeader>

        <CardContent>
          <p className={`text-muted-foreground ${
            featured ? "text-base" : "text-sm"
          } line-clamp-2`}>
            {post.description}
          </p>
        </CardContent>

        <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
          <span className="font-medium text-foreground">{post.author}</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
