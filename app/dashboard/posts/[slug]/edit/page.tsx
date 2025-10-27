"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Eye, X, Trash2, FileEdit, ExternalLink } from "lucide-react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";

type TabType = "write" | "preview";

export default function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const [slug, setSlug] = useState<string>("");
  const [postId, setPostId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("write");
  const [isInitialized, setIsInitialized] = useState(false);

  const { data: categories = [], isLoading: categoriesLoading } = trpc.category.getAll.useQuery();
  
  const { data: post, isLoading: postLoading } = trpc.post.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  const updatePost = trpc.post.update.useMutation({
    onSuccess: () => {
      toast.success(published ? "Post updated successfully!" : "Draft saved successfully!");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      console.error("Failed to update post:", error);
      
      // Provide specific error messages
      if (error.message?.includes("slug")) {
        toast.error("A post with this title already exists. Please use a different title.");
      } else if (error.message?.includes("Unauthorized") || error.message?.includes("auth")) {
        toast.error("You are not authorized to update this post.");
      } else if (error.message?.includes("not found")) {
        toast.error("Post not found. It may have been deleted.");
      } else {
        toast.error(error.message || "Failed to update post. Please try again.");
      }
    },
  });

  const deletePost = trpc.post.delete.useMutation({
    onSuccess: () => {
      toast.success("Post deleted successfully!");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      console.error("Failed to delete post:", error);
      
      if (error.message?.includes("Unauthorized") || error.message?.includes("auth")) {
        toast.error("You are not authorized to delete this post.");
      } else if (error.message?.includes("not found")) {
        toast.error("Post not found. It may have already been deleted.");
      } else {
        toast.error(error.message || "Failed to delete post. Please try again.");
      }
    },
  });

  useEffect(() => {
    params.then((resolvedParams) => {
      setSlug(resolvedParams.slug);
    });
  }, [params]);

  // Populate form when post data is loaded (only once)
  useEffect(() => {
    if (post && !isInitialized) {
      setPostId(post.id);
      setTitle(post.title);
      setDescription(post.description || "");
      setContent(post.content || "");
      setImageUrl(post.imageUrl || "");
      setPublished(post.published);
      
      // Set selected categories
      const categoryNames = post.postCategories.map((pc) => pc.category.name);
      setSelectedCategories(categoryNames);
      setIsInitialized(true);
    }
  }, [post, isInitialized]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSave = async (shouldPublish?: boolean) => {
    if (!postId) {
      toast.error("Post not found");
      return;
    }

    // Validation
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (title.length > 200) {
      toast.error("Title is too long (max 200 characters)");
      return;
    }

    if (description && description.length > 500) {
      toast.error("Description is too long (max 500 characters)");
      return;
    }

    if (imageUrl && !imageUrl.match(/^https?:\/\/.+/)) {
      toast.error("Image URL must be a valid HTTP or HTTPS URL");
      return;
    }

    if (selectedCategories.length === 0) {
      toast.error("Please select at least one category");
      return;
    }

    // Map selected category names to category IDs
    const categoryIds = categories
      .filter((cat) => selectedCategories.includes(cat.name))
      .map((cat) => cat.id);

    updatePost.mutate({
      id: postId,
      title,
      slug,
      description,
      content,
      imageUrl: imageUrl || undefined,
      published: shouldPublish !== undefined ? shouldPublish : published,
      categoryIds,
    });
  };

  const handlePublish = async () => {
    // Directly publish with toast feedback
    toast.promise(
      new Promise((resolve) => {
        handleSave(true);
        resolve(true);
      }),
      {
        loading: "Publishing post...",
        success: "Post published successfully!",
        error: "Failed to publish post",
      }
    );
  };

  const handleDelete = async () => {
    if (!postId) {
      toast.error("Post not found");
      return;
    }

    // Show warning toast with action
    toast.error("Are you sure? This action cannot be undone.", {
      action: {
        label: "Delete",
        onClick: () => deletePost.mutate({ id: postId }),
      },
    });
  };

  if (postLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (!post) {
    return <div className="flex items-center justify-center h-64">Post not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          {!published && (
            <Badge variant="secondary" className="text-sm">
              Editing Draft
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="sm" 
            onClick={() => handleSave(undefined)} 
            disabled={updatePost.isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            {updatePost.isPending ? "Saving..." : published ? "Save Changes" : "Save Draft"}
          </Button>
          {!published && (
            <Button 
              size="sm" 
              onClick={handlePublish} 
              disabled={updatePost.isPending}
            >
              {updatePost.isPending ? "Publishing..." : "Publish"}
            </Button>
          )}
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
                        : "border-transparent text-muted-foreground hover:border-muted"
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
              {published && (
                <div className="space-y-2">
                  <Label>Live Post</Label>
                  <Link
                    href={`/blog/${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Live Post
                    </Button>
                  </Link>
                </div>
              )}
              <Button 
                variant="outline"
                className="w-full" 
                onClick={() => handleSave(undefined)} 
                disabled={updatePost.isPending}
              >
                <Save className="mr-2 h-4 w-4" />
                {updatePost.isPending ? "Saving..." : published ? "Save Changes" : "Save Draft"}
              </Button>
              {!published && (
                <Button 
                  className="w-full" 
                  onClick={handlePublish} 
                  disabled={updatePost.isPending}
                >
                  {updatePost.isPending ? "Publishing..." : "Publish Post"}
                </Button>
              )}
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={handleDelete}
                disabled={deletePost.isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {deletePost.isPending ? "Deleting..." : "Delete Post"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
