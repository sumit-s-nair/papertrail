import { Card } from "@/components/ui/card";
import { Zap, Shield, Palette, Code, Users, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built on Next.js 15 with App Router for optimal performance and instant page loads.",
  },
  {
    icon: Shield,
    title: "Type-Safe APIs",
    description: "End-to-end type safety with tRPC ensures robust and maintainable code.",
  },
  {
    icon: Palette,
    title: "Beautiful Design",
    description: "Modern, responsive UI with Tailwind CSS and shadcn/ui components.",
  },
  {
    icon: Code,
    title: "Developer Friendly",
    description: "Clean architecture with TypeScript, Drizzle ORM, and best practices.",
  },
  {
    icon: Users,
    title: "Multi-Category",
    description: "Organize content with flexible category management and filtering.",
  },
  {
    icon: BarChart3,
    title: "Analytics Ready",
    description: "Track views, engagement, and reading time for your content.",
  },
];

export function Features() {
  return (
    <section className="py-20 md:py-32 bg-muted/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              create amazing content
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed for modern content creators and developers
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-shadow border-muted hover:border-primary/20"
            >
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
