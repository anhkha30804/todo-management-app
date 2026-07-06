# Todo Client Application

This is the frontend client application for the Todo Management App, built with Next.js (App Router), TypeScript, and Tailwind CSS.

## Architecture and Design Patterns

The client is structured to optimize performance, clean separation of concerns, and smooth user interactions. Key architectural highlights include:

### 1. Client/Server Boundaries
- Next.js App Router structure separating server-rendered page shells from interactive client components.
- Interactive dashboards (such as the Kanban Board page) leverage React client hooks for state management and drag-and-drop interactions.

### 2. State & Provider Isolation
- Local storage and React Context APIs power the AuthProvider and SidebarProvider to maintain state across pages.
- Authentication tokens are attached dynamically via interceptors to outgoing API requests.

### 3. Component-Driven Design
- Modular directory structure separating reusable primitive UI components (under `/src/components/ui/`) from domain-specific features (such as `/src/components/board/` or `/src/components/overview/`).
- Consistent styling system built on custom Tailwind utilities, slate-grey borders on input focus, and smooth micro-animations.

### 4. API Abstraction Layer
- Encapsulated Axios client under `/src/lib/api.ts` handles BASE_URL injection, request authorization headers, and central error interceptors.

---

## How to Run

To run the client locally or build the standalone production package, please refer to the main repository documentation:

Please visit: **[Root README](../README.md)**
