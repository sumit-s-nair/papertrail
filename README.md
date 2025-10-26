# Papertrail - Multi-User Blogging Platform

A modern, full-stack blogging platform built with Next.js 15, tRPC, PostgreSQL, and Stack Auth.

## Live Demo

[View Live Site](https://papertrail-sumit.vercel.app)

## Features Implemented

- Blog post CRUD operations (create, read, update, delete)
- Assign multiple categories to posts (many-to-many relationship)
- Blog listing page with all posts
- Individual post view pages
- Category filtering with URL query parameters
- Responsive navigation with theme toggle
- Clean, professional UI using shadcn/ui
- Full landing page with multiple sections
- Dashboard for managing posts (user-specific filtering)
- Draft vs Published post status with conditional UI
- Comprehensive loading and error states
- Fully mobile-responsive design
- Markdown editor with live preview (write/preview tabs)
- Search functionality for posts
- Dark mode support with theme toggle
- Image support from any HTTPS domain
- Post preview functionality
- Web Share API with clipboard fallback
- Toast notifications (no blocking alerts or confirms)
- User authentication with Stack Auth (OAuth)

## Tech Stack

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

## Project Structure

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

## Setup Instructions

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

## Deployment (Vercel)

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

## tRPC Router Structure

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

## Key Design Decisions

### 1. Markdown over Rich Text Editor
- **Reason:** Faster to implement
- **Benefit:** Better for technical content, no complex WYSIWYG logic
- **Implementation:** react-markdown with GitHub Flavored Markdown

### 2. shadcn/ui Component Library
- **Reason:** Pre-built, accessible components
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

## UI/UX Highlights

- **Theme Toggle:** Light/dark mode with system preference detection
- **Teal Accent:** Custom teal/blue color scheme for visual interest
- **Responsive Design:** Mobile-first approach with Tailwind breakpoints
- **Loading States:** Skeleton screens and loading indicators
- **Error Handling:** User-friendly error messages with toast notifications
- **Draft Workflow:** Clear visual distinction between drafts and published posts

## Database Schema

### Tables
1. **posts** - Blog posts with title, slug, content, status
2. **categories** - Post categories
3. **post_categories** - Many-to-many junction table

### Relations
- One post has many post_categories
- One category has many post_categories
- Cascade delete on post/category removal

## Testing the Application

1. **Sign in** using Stack Auth (GitHub, Google, etc.)
2. **Create a post** from the dashboard
3. **Add categories** to organize posts
4. **Toggle draft/published** status
5. **Filter by category** from the navbar
6. **Search posts** using the search bar
7. **Switch themes** with the theme toggle
8. **Share posts** using the share button

## Troubleshooting

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

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
npm run db:seed      # Seed database with categories
```

## License

MIT

## Author

**Sumit S Nair**
- GitHub: [@sumit-s-nair](https://github.com/sumit-s-nair)

---

Built with ❤️ using Next.js, tRPC, and modern web technologies.
