# SwiftCart

SwiftCart is a full-stack e-commerce web application built with **Next.js, React, TypeScript, and Tailwind CSS**, integrated with an **ASP.NET Core Web API** backend.

It provides a responsive shopping experience with product browsing, authentication, cart management, checkout, and order tracking.

## Features

- **Responsive UI:** Homepage, About page, product listings, and reusable UI components.
- **Product Browsing:** Search, category filtering, sorting, and pagination.
- **Product Details:** Detailed product pages with optimized images.
- **Authentication:** Login, registration, logout, and token-based session management using HttpOnly cookies.
- **Cart Management:** Add, update, remove, and view cart items.
- **Checkout:** Address selection and order placement.
- **Order Management:** Order history, status filtering, order details, and reorder functionality.
- **Product Management:** Admin-oriented product operations with backend authorization.
- **Error Handling:** Custom error boundaries and not-found pages.
- **SEO & Performance:** Page-specific metadata, dynamic product metadata, optimized images, and local font loading.

## Tech Stack

- Next.js (App Router)
- React and TypeScript
- Tailwind CSS
- React Hook Form and Zod

## Getting Started

**1. Install dependencies**

```bash
npm install
```

**2. Configure environment variables**

Create a `.env.local` file in the project root:

```env
DOTNET_API_BASE_URL=your_backend_api_base_url
```

**3. Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` — Start the development server.
- `npm run build` — Create a production build.
- `npm run start` — Run the production build.
- `npm run lint` — Run ESLint.

## Project Structure

- `src/app/` — App Router pages, layouts, route handlers, and server actions.
- `src/components/` — Reusable UI and feature components.
- `src/hooks/` — Custom React hooks.
- `src/services/` — Backend API integration and data services.
- `src/lib/` — Shared utilities and API configuration.
- `src/constants/` — Shared application constants.
- `src/types/` — TypeScript interfaces and types.
- `src/utils/` — Helper functions.

## Backend

SwiftCart integrates with an ASP.NET Core Web API for authentication, products, cart, checkout, and order operations. The backend uses SQL Server for data persistence.
