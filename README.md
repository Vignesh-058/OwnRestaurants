# Owncart React Frontend 🛒

A highly optimized, production-ready frontend for the Owncart E-commerce platform. Built with a modern React stack focusing on raw performance, accessibility, and a premium "Glassmorphic" UX/UI similar to Swiggy, Zomato, and Myntra.

## Tech Stack 🚀
- **Core:** React 19 + TypeScript + Vite
- **Routing:** React Router v6 (Lazy loaded & Suspense integrated)
- **State Management:**
  - **Server State:** TanStack React Query (Optimized for caching and deduping)
  - **Client State:** Zustand (Persistent stores for Auth, Cart, Wishlist, Search)
- **Styling:** Tailwind CSS v4 + `shadcn/ui` (Radix Primitives)
- **Icons & Animations:** `lucide-react` + `framer-motion`
- **Network:** Axios (with centralized interceptors for error handling)

## Architecture & Folder Structure 📁
The codebase enforces a strict modular architecture to separate concerns, making it highly maintainable and scalable.

```text
src/
├── api/          # Axios instance and interceptors
├── components/   # Reusable UI elements
│   ├── auth/     # Authentication flows
│   ├── cart/     # Cart & Checkout components
│   ├── common/   # Generic UI (ErrorState, PageLoader, Skeletons)
│   ├── layout/   # Navbar, Footer, Drawers
│   ├── product/  # Product Grids, Drawers, Filters
│   ├── search/   # Search Bar, Suggestions, Filtering
│   ├── ui/       # shadcn base primitives
│   └── wishlist/ # Wishlist & Recently Viewed
├── constants/    # Centralized constants (API routes, storage keys)
├── hooks/        # Custom React hooks containing business logic
├── layouts/      # Page layout wrappers (MainLayout)
├── pages/        # Lazy-loaded route entry points
├── routes/       # React Router configurations
├── services/     # API request abstractions mapping to backend endpoints
├── store/        # Zustand stores for global client state
├── types/        # Global TypeScript interfaces
└── utils/        # Helper functions (Loggers, Formatters)
```

## Performance Optimizations ⚡
1. **Lazy Route Loading**: Every page (Shop, Cart, Profile, etc.) is lazy-loaded using `React.lazy()` and wrapped in `<Suspense>`.
2. **Chunk Splitting**: The Vite build is configured to split dependencies into `vendor` (React), `ui` (Framer + shadcn), and `store` (Zustand + React Query) chunks to maximize browser caching.
3. **React Query Tuning**: 
   - `staleTime` set to 5 minutes to prevent redundant API fetches.
   - `gcTime` set to 30 minutes to hold cache in memory.
   - `refetchOnWindowFocus` disabled.
4. **Bundle Size**: Initial JS bundle drastically reduced from ~1.2MB down to ~54KB for the landing page.
5. **Dead Code Elimination**: Fully audited with TypeScript strict mode (`tsc --noEmit`) to remove unused imports and dead logic.

## Environment Variables 🔐
To run this project locally, copy the provided `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Your `.env` file must contain the backend API base URL:
```env
VITE_API_BASE_URL=https://owncart-backend-2.onrender.com/api
```

## Getting Started 💻

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```
   *The app will run locally on `http://localhost:5173` with Hot Module Replacement (HMR).*

3. **Production Build:**
   ```bash
   npm run build
   ```
   *Compiles TypeScript and outputs the optimized, chunk-split assets to the `/dist` directory.*

4. **Preview Production Build:**
   ```bash
   npm run preview
   ```

## Accessibility (a11y) ♿
The application conforms to WCAG guidelines by relying on Radix UI primitives:
- **Keyboard Navigation**: Full support for `Tab`, `Esc`, `Enter`, and `Space` across all interactive elements.
- **Focus Management**: Dialogs trap focus, and active states render visible focus rings.
- **Screen Readers**: Icon-only buttons utilize `<span className="sr-only">` or `aria-label` tags for descriptive reading.
- **Semantic HTML**: Proper usage of HTML5 landmarks (`<header>`, `<main>`, `<nav>`, `<footer>`).

## State Management Flow 🔄
1. **Zustand (`/src/store`)** handles synchronous UI state that needs to survive across components (e.g., `isCartDrawerOpen`, `theme: 'dark'`). It uses the `persist` middleware to save Auth tokens, Cart items, and Wishlist history into `localStorage`.
2. **React Query (`/src/hooks/queries`)** handles asynchronous server state. It fetches data from the backend APIs (via `axios` services), caches the response, and automatically serves it to any component that requests it, eliminating the need to pass props down the tree.
