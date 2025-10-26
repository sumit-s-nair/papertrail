# 📝 Papertrail - Multi-User Blogging Platform

A modern, full-stack blogging platform built with Next.js 15, tRPC, PostgreSQL, and Stack Auth.

## 🚀 Live Demo

[View Live Site](https://papertrail-sumit.vercel.app)

## ✨ Features Implemented

### 🔴 Core Features (Priority 1) - ✅ 100%
- ✅ Blog post CRUD operations (create, read, update, delete)
- ✅ Category CRUD operations
- ✅ Assign multiple categories to posts (many-to-many)
- ✅ Blog listing page with all posts
- ✅ Individual post view pages
- ✅ Category filtering with URL query parameters
- ✅ Responsive navigation with theme toggle
- ✅ Clean, professional UI using shadcn/ui

### 🟡 Expected Features (Priority 2) - ✅ 100%
- ✅ Full landing page with multiple sections
- ✅ Dashboard for managing posts (user-specific)
- ✅ Draft vs Published post status
- ✅ Comprehensive loading and error states
- ✅ Fully mobile-responsive design
- ✅ Markdown editor with live preview

### 🟢 Bonus Features (Priority 3) - ✅ 90%
- ✅ Search functionality for posts
- ✅ Dark mode support with theme toggle
- ✅ Image support from any HTTPS domain
- ✅ Post preview functionality (write/preview tabs)
- ✅ Web Share API with clipboard fallback
- ✅ Toast notifications (no blocking alerts)
- ✅ User authentication with Stack Auth (OAuth)
- ⏳ SEO meta tags (partial)
- ⏳ Pagination (not yet implemented)

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (Neon serverless)
- **ORM:** Drizzle ORM
- **API:** tRPC v11 (type-safe APIs)
- **Authentication:** Stack Auth (OAuth)
- **State Management:** React Query (via tRPC) + Zustand
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Validation:** Zod
- **Content:** Markdown (react-markdown + remark-gfm)
- **Notifications:** Sonner (toast notifications)
- **Theme:** next-themes (dark mode)

## 📁 Project Structure

```
papertrail/
├── app/
│   ├── api/trpc/[trpc]/    # tRPC API routes
│   ├── auth/               # Authentication page
│   ├── blog/               # Public blog pages
│   │   ├── [slug]/         # Individual post view
│   │   └── page.tsx        # Blog listing
│   ├── dashboard/          # Protected dashboard
│   │   └── posts/
│   │       ├── new/        # Create post
│   │       └── [slug]/edit # Edit post
│   ├── handler/            # Stack Auth handler
│   ├── layout.tsx          # Root layout with providers
│   └── page.tsx            # Landing page
├── components/
│   ├── blog/               # Blog-specific components
│   ├── layout/             # Header, navigation
│   ├── providers/          # Theme & tRPC providers
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── db/
│   │   ├── schema.ts       # Drizzle schema
│   │   ├── index.ts        # DB connection
│   │   └── seed.ts         # Seed script
│   └── trpc/
│       ├── client.ts       # tRPC client
│       ├── server.ts       # tRPC server
│       ├── root.ts         # Root router
│       └── routers/        # Feature routers
└── drizzle.config.ts       # Drizzle configuration
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or Neon account)
- Stack Auth project

### 1. Clone the Repository
```bash
git clone https://github.com/sumit-s-nair/papertrail.git
cd papertrail
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

# Stack Auth
NEXT_PUBLIC_STACK_PROJECT_ID="your-stack-project-id"
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="your-publishable-key"
STACK_SECRET_SERVER_KEY="your-secret-key"
```

### 4. Set Up Database

Push the schema to your database:
```bash
npm run db:push
```

Seed the database with categories:
```bash
npm run db:seed
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment (Vercel)

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy to Vercel

1. Import your GitHub repository on [Vercel](https://vercel.com)
2. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_STACK_PROJECT_ID`
   - `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`
   - `STACK_SECRET_SERVER_KEY`
3. Deploy!

**Important:** The `postinstall` script will automatically run `db:push` to create tables on first deploy.

### 3. Seed Production Database

After first deployment, seed the database:
```bash
# Install Vercel CLI
npm i -g vercel

# Run seed script on production
vercel env pull
npm run db:seed
```

Or use Vercel's deployment command to run the seed script manually.

## 🏗️ tRPC Router Structure

```typescript
appRouter
├── post          # Post operations
│   ├── getAll    # List posts (with filters)
│   ├── getBySlug # Get single post
│   ├── create    # Create new post
│   ├── update    # Update existing post
│   └── delete    # Delete post
└── category      # Category operations
    ├── getAll    # List all categories
    ├── create    # Create category
    ├── update    # Update category
    └── delete    # Delete category
```

All procedures use Zod schemas for input validation and leverage tRPC's automatic type inference for end-to-end type safety.

## 💡 Key Design Decisions

### 1. Markdown over Rich Text Editor
- **Reason:** Faster to implement (saved 2-3 hours)
- **Benefit:** Better for technical content, no complex WYSIWYG logic
- **Implementation:** react-markdown with GitHub Flavored Markdown

### 2. shadcn/ui Component Library
- **Reason:** Pre-built, accessible components (saved 3-4 hours)
- **Benefit:** Consistent design system, easy customization
- **Trade-off:** Additional dependencies, but worth the time savings

### 3. Wildcard Image Pattern
- **Reason:** Allow images from any HTTPS source
- **Benefit:** Flexibility without managing domain whitelist
- **Security:** Still validates HTTPS protocol

### 4. Toast Notifications over Alerts
- **Reason:** Better UX (non-blocking, styled, consistent)
- **Implementation:** Sonner library with theme integration
- **Benefit:** Action buttons for confirmations instead of confirm() dialogs

### 5. URL-based Category Filtering
- **Reason:** Shareable filtered views, better for SEO
- **Implementation:** Query parameters with useSearchParams
- **Benefit:** Deep linking to filtered views

### 6. Stack Auth for Authentication
- **Reason:** Quick OAuth setup without building auth from scratch
- **Benefit:** Secure, tested authentication solution
- **Trade-off:** External dependency, but saves significant development time

## 🎨 UI/UX Highlights

- **Theme Toggle:** Light/dark mode with system preference detection
- **Teal Accent:** Custom teal/blue color scheme for visual interest
- **Responsive Design:** Mobile-first approach with Tailwind breakpoints
- **Loading States:** Skeleton screens and loading indicators
- **Error Handling:** User-friendly error messages with toast notifications
- **Draft Workflow:** Clear visual distinction between drafts and published posts

## 📊 Database Schema

### Tables
1. **posts** - Blog posts with title, slug, content, status
2. **categories** - Post categories
3. **post_categories** - Many-to-many junction table

### Relations
- One post has many post_categories
- One category has many post_categories
- Cascade delete on post/category removal

## 🧪 Testing the Application

1. **Sign in** using Stack Auth (GitHub, Google, etc.)
2. **Create a post** from the dashboard
3. **Add categories** to organize posts
4. **Toggle draft/published** status
5. **Filter by category** from the navbar
6. **Search posts** using the search bar
7. **Switch themes** with the theme toggle
8. **Share posts** using the share button

## 🐛 Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` in environment variables
- Ensure database is accessible from your deployment
- Check Neon dashboard for connection limits

### Build Errors
- Clear `.next` folder: `rm -rf .next` or `Remove-Item -Recurse -Force .next`
- Reinstall dependencies: `rm -rf node_modules package-lock.json && npm install`
- Check TypeScript errors: `npm run build`

### Authentication Issues
- Verify Stack Auth credentials in environment variables
- Check Stack Auth dashboard for project configuration
- Ensure callback URLs are configured correctly

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
npm run db:seed      # Seed database with categories
```

## 📄 License

MIT

## 👤 Author

**Sumit S Nair**
- GitHub: [@sumit-s-nair](https://github.com/sumit-s-nair)

---

Built with ❤️ using Next.js, tRPC, and modern web technologies.

Technical Requirements
Backend Development
1. Database Design and Implementation
● Set up a PostgreSQL database
● Implement database schema using Drizzle ORM
● Create necessary tables for:
○ Blog posts (title, content, slug, published status, timestamps)
○ Categories (name, description, slug)
○ Post-category relationships (many-to-many)
2. API Development (tRPC with Next.js App Router)
● Implement type-safe APIs using tRPC for:
○ CRUD operations for blog posts
○ CRUD operations for categories
○ Assigning categories to posts
○ Filtering posts by category
● Implement proper error handling and validation using Zod schemas
● Use tRPC middleware for request validation
● Implement slug generation for posts and categories
● Leverage tRPC's automatic type inference for end-to-end type safety

Frontend Development
1. User Interface
● Create a responsive blog layout with navigation
● Implement a content editor for post creation/editing (rich text OR markdown)
● Design forms for post and category management
● Create a category management interface
● Build a blog post listing page with filtering
● Design individual blog post view pages
2. State Management and Data Fetching
● Implement global state management using Zustand (where appropriate)
● Use React Query (via tRPC's React Query integration) for API data fetching and caching
● Handle loading and error states appropriately

● Implement optimistic updates for better user experience
● Leverage tRPC's built-in React hooks for seamless data fetching
Feature Priority Guide
To help you manage your time effectively over the 7-day period, features are prioritized as
follows:
🔴 Must Have (Core Requirements - Priority 1)
● Blog post CRUD operations (create, read, update, delete)
● Category CRUD operations
● Assign one or more categories to posts
● Blog listing page showing all posts
● Individual post view page
● Category filtering on listing page
● Basic responsive navigation
● Clean, professional UI (doesn't need to be fancy, just functional and clean)
🟡 Should Have (Expected Features - Priority 2)
● Landing page with at least 3 sections (Header/Hero, Features, Footer)
● Dashboard page for managing posts
● Draft vs Published post status
● Loading and error states
● Mobile-responsive design
● Content editor (choose ONE: rich text editor OR markdown support - markdown is faster)
🟢 Nice to Have (Bonus Features - Priority 3)
Only if you have extra time and core features are polished.
● Full 5-section landing page (Header, Hero, Features, CTA, Footer)
● Search functionality for posts
● Post statistics (word count, reading time)
● Dark mode support
● Advanced rich text editor features
● Image upload for posts
● Post preview functionality
● SEO meta tags
● Pagination
Technical Stack Requirements

● Next.js 15 with App Router
● PostgreSQL (local or hosted, e.g., Supabase, Neon)
● Drizzle ORM
● tRPC (for type-safe API layer)
● Zod (for schema validation with tRPC)
● React Query (TanStack Query, integrated via tRPC)
● Zustand (for global state where needed)
● TypeScript
● Tailwind CSS (strongly recommended for faster styling)
● Content editor: Choose ONE:
○ Markdown editor (faster: textarea + markdown parser)
○ Rich text editor (e.g., Tiptap, Lexical)

Important Notes
● Authentication system is NOT required - focus on core blogging features
● Focus on code quality over feature quantity - we value well-architected, type-safe
code
● Choose markdown over rich text if you want to save 2-3 hours
● Use a component library (shadcn/ui) if you want to speed up UI development
● Prioritize properly - a polished core feature set beats a rushed complete feature set

What We're NOT Looking For
● Pixel-perfect designs (clean and functional is enough)
● Every single bonus feature implemented
● Over-engineered solutions
● Excessive premature optimization
What We ARE Looking For
● Clean, readable, maintainable code
● Proper TypeScript usage with tRPC
● Working core features that are well-implemented
● Good understanding of the tech stack
● Thoughtful architecture decisions
Submission Guidelines

Required:
● GitHub repository with clear README documentation
● Setup instructions with all environment variables documented
● Brief explanation of your tRPC router structure
● Live deployment link (Vercel recommended - it's free and fast)
● Instructions on how to seed the database (if applicable)
README should include:
● Setup steps (how to run locally)
● Tech stack used
● Features implemented (checklist from Priority 1, 2, 3)
● Any trade-offs or decisions you made
● Time spent (optional but helpful)
Time Management Suggestions
Day 1-2: Setup & Backend
● Project initialization and dependencies
● Database setup and Drizzle schema
● Basic tRPC setup with routers
● Core CRUD operations for posts and categories
Day 3-4: Core Features
● Blog listing page
● Individual post view
● Post creation/editing form
● Category management
● Category filtering
Day 5-6: Polish & Priority 2 Features
● Dashboard implementation
● Landing page (3 sections minimum)
● Mobile responsiveness
● Loading and error states
● Bug fixes
Day 7: Final Polish & Deployment
● Code cleanup

● README documentation
● Deployment to Vercel
● Final testing
● (Optional) Add bonus features if time permits
Recommended Shortcuts to Save Time
1. Use shadcn/ui for pre-built components (saves 3-4 hours)
2. Choose markdown over rich text editor (saves 2-3 hours)
3. Use Neon or Supabase for quick PostgreSQL setup (saves 1 hour)
4. Start with a simple 3-section landing page, expand if time allows
5. Focus on desktop-first, then add mobile responsiveness
6. Use Tailwind's default theme instead of custom design system

Evaluation Criteria
We will assess your submission based on:
1. Code Organization and Architecture (20%)
○ Clean separation of concerns
○ Proper folder structure
○ Reusable components
○ Well-organized tRPC router structure
2. UI/UX - Overall Design (20%)
○ Professional and clean design
○ Matches the UI design attached or similar clean design
○ Responsive layout across devices
3. TypeScript Implementation (15%)
○ Proper use of TypeScript and type safety
○ Effective use of tRPC's automatic type inference

○ Minimal use of any types
○ Well-defined interfaces and types
4. React Best Practices (15%)
○ Implementation of modern React patterns and hooks
○ Effective use of tRPC React hooks
○ Performance considerations
5. Database Design (10%)
○ Database schema design and relationships
○ Appropriate use of Drizzle ORM
○ Data integrity
6. API Design (tRPC) (10%)
○ Well-structured tRPC routers and procedures
○ Proper input validation with Zod
○ Error handling in tRPC context
○ Logical organization of endpoints
7. State Management (5%)
○ Efficient use of Zustand for global state
○ React Query implementation via tRPC
○ Appropriate cache management
8. Error Handling (5%)
○ Input validation with Zod schemas
○ User-friendly error messages
○ Graceful error recovery