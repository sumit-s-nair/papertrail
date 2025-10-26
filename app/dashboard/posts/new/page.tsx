"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, X, FileEdit, Eye } from "lucide-react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { useUser } from "@stackframe/stack";
import { toast } from "sonner";

type TabType = "write" | "preview";

export default function NewPostPage() {
  const router = useRouter();
  const user = useUser();
  const { data: categories = [], isLoading: categoriesLoading } = trpc.category.getAll.useQuery();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("## Your content here\n\nStart writing your blog post...");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("write");

  const createPost = trpc.post.create.useMutation({
    onSuccess: () => {
      toast.success("Post created successfully!");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post. Please try again.");
    },
  });

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSave = async (shouldPublish: boolean) => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    
    if (!user) {
      toast.error("You must be logged in to create a post");
      return;
    }

    // Generate base slug from title
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    
    // Add random characters to ensure uniqueness
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const slug = `${baseSlug}-${randomSuffix}`;

    // Map selected category names to category IDs
    const categoryIds = categories
      .filter((cat) => selectedCategories.includes(cat.name))
      .map((cat) => cat.id);

    createPost.mutate({
      title,
      slug,
      description,
      content,
      imageUrl: imageUrl || undefined,
      published: shouldPublish,
      categoryIds,
      authorId: user.id,
      author: user.displayName || user.primaryEmail || "Anonymous",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleSave(false)} 
            disabled={createPost.isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            {createPost.isPending ? "Saving..." : "Save Draft"}
          </Button>
          <Button 
            size="sm" 
            onClick={() => handleSave(true)} 
            disabled={createPost.isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            {createPost.isPending ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter post title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of your post..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Featured Image URL</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* GitHub-style tabs */}
              <div className="border-b">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab("write")}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === "write"
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                    }`}
                  >
                    <FileEdit className="h-4 w-4" />
                    Write
                  </button>
                  <button
                    onClick={() => setActiveTab("preview")}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === "preview"
                        ? "border-primary text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                    }`}
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </button>
                </div>
              </div>

              {/* Content area */}
              <div className="p-4">
                {activeTab === "write" ? (
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your post content in Markdown..."
                    className="min-h-[500px] font-mono text-sm resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                ) : (
                  <div className="prose prose-slate max-w-none min-h-[500px] dark:prose-invert">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categoriesLoading ? (
                  <p className="text-sm text-muted-foreground">Loading categories...</p>
                ) : (
                  categories.map((category) => (
                    <Badge
                      key={category.id}
                      variant={selectedCategories.includes(category.name) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleCategory(category.name)}
                    >
                      {category.name}
                      {selectedCategories.includes(category.name) && (
                        <X className="ml-1 h-3 w-3" />
                      )}
                    </Badge>
                  ))
                )}
              </div>
              {selectedCategories.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Select at least one category
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <p className="text-sm text-muted-foreground">
                  {published ? "Published" : "Draft"}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Author</Label>
                <p className="text-sm text-muted-foreground">
                  {user?.primaryEmail || "You"}
                </p>
              </div>
              <Button 
                variant="outline"
                className="w-full" 
                onClick={() => handleSave(false)} 
                disabled={createPost.isPending}
              >
                <Save className="mr-2 h-4 w-4" />
                {createPost.isPending ? "Saving..." : "Save Draft"}
              </Button>
              <Button 
                className="w-full" 
                onClick={() => handleSave(true)} 
                disabled={createPost.isPending}
              >
                <Save className="mr-2 h-4 w-4" />
                {createPost.isPending ? "Publishing..." : "Publish Post"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
