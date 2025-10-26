export interface BlogPost {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  readTime: string;
  categories: string[];
  slug: string;
  imageUrl: string;
  published: boolean;
}

export const mockPosts: BlogPost[] = [
  {
    id: "1",
    title: "UX review presentations",
    description: "How do you create compelling presentations that wow your colleagues and impress your managers?",
    author: "Olivia Rhye",
    date: "20 Jan 2025",
    readTime: "5 min read",
    categories: ["Design", "Research", "Presentation"],
    slug: "ux-review-presentations",
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop",
    published: true,
  },
  {
    id: "2",
    title: "Migrating to Linear 101",
    description: "Linear helps streamline software projects, sprints, tasks, and bug tracking. Here's how to get started.",
    author: "Phoenix Baker",
    date: "19 Jan 2025",
    readTime: "8 min read",
    categories: ["Design", "Research"],
    slug: "migrating-to-linear-101",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop",
    published: true,
  },
  {
    id: "3",
    title: "Building your API stack",
    description: "The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.",
    author: "Lana Steiner",
    date: "18 Jan 2025",
    readTime: "10 min read",
    categories: ["Software", "Research"],
    slug: "building-your-api-stack",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop",
    published: true,
  },
  {
    id: "4",
    title: "Bill Walsh leadership lessons",
    description: "Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?",
    author: "Alec Whitten",
    date: "17 Jan 2025",
    readTime: "12 min read",
    categories: ["Leadership", "Management"],
    slug: "bill-walsh-leadership-lessons",
    imageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop",
    published: true,
  },
  {
    id: "5",
    title: "PM mental models",
    description: "Mental models are simple expressions of complex processes or relationships.",
    author: "Demi Wilkinson",
    date: "16 Jan 2025",
    readTime: "6 min read",
    categories: ["Product", "Research", "Frameworks"],
    slug: "pm-mental-models",
    imageUrl: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&auto=format&fit=crop",
    published: true,
  },
  {
    id: "6",
    title: "What is wireframing?",
    description: "Introduction to Wireframing and its Principles. Learn from the best in the industry.",
    author: "Candice Wu",
    date: "15 Jan 2025",
    readTime: "7 min read",
    categories: ["Design", "Research"],
    slug: "what-is-wireframing",
    imageUrl: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&auto=format&fit=crop",
    published: true,
  },
];

export const categories = [
  "All",
  "Design",
  "Research",
  "Software",
  "Leadership",
  "Management",
  "Product",
  "Frameworks",
  "Presentation",
];
