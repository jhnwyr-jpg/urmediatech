# UR Media - Premium Website Design Agency

## Overview

UR Media is a Bengali-language digital agency website showcasing premium website design and landing page services. The application is a full-stack React application with an Express backend, featuring a modern, animated landing page with multiple sections including services, portfolio, testimonials, and contact forms. The site targets Bengali-speaking clients and includes bilingual support (Bengali/English).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with CSS variables for theming
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Animations**: Framer Motion for complex animations and transitions
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (compiled with esbuild for production)
- **API Structure**: RESTful endpoints under `/api/*`
- **Session Management**: Express sessions with MemoryStore
- **Development**: Vite middleware integration for HMR

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts` (shared between frontend and backend)
- **Tables**: profiles, posts, orders, siteStats
- **Migrations**: Drizzle Kit for schema management (`npm run db:push`)

### Authentication
- **Provider**: Supabase Auth (OAuth support)
- **UI**: Supabase Auth UI React components
- **Access Control**: Single-user admin restriction (hardcoded email)
- **Session Sync**: Backend endpoint syncs Supabase auth with server sessions

### Key Design Patterns
- **Shared Schema**: Database schemas defined once in `shared/schema.ts`, used by both frontend (types) and backend (queries)
- **API Request Helper**: Centralized `apiRequest` function in `src/lib/queryClient.ts`
- **Internationalization**: Context-based language switching with translation keys in `LanguageContext`
- **Component Architecture**: Sections split into individual components under `src/components/sections/`

## External Dependencies

### Third-Party Services
- **Supabase**: Authentication and user management
- **Google Sheets**: Contact form submissions via Google Apps Script webhook
- **WhatsApp**: Direct messaging integration via `wa.me` links

### Database
- **PostgreSQL**: Primary database (requires `DATABASE_URL` environment variable)
- **Drizzle ORM**: Type-safe database queries and schema management

### Key NPM Packages
- **UI**: @radix-ui/* primitives, lucide-react icons, embla-carousel
- **Animation**: framer-motion
- **Forms**: react-hook-form, @hookform/resolvers, zod
- **Backend**: express, express-session, memorystore, pg (node-postgres)

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- Supabase credentials (configured in client integration)