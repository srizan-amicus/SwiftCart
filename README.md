# SwiftCart

SwiftCart is an e-commerce web application built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- Responsive homepage and About page.
- Product listing with search and category filtering.
- Reusable UI components, including buttons and product cards.
- Product carousel using Swiper.
- Authentication and cart integration structure.

## Tech Stack

- Next.js (App Router)
- React and TypeScript
- Tailwind CSS
- Swiper
- Lucide React

## Getting Started

**1. Install dependencies**

```bash
npm install
```

**2. Configure environment variables**

Create a `.env.local` file and set your API base URL:

```env
NEXT_PUBLIC_API_BASE_URL=your_api_base_url
DOTNET_API_BASE_URL=your_api_base_url
```

**3. Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` — Start development server.
- `npm run build` — Build for production.
- `npm run start` — Run production build.
- `npm run lint` — Run ESLint.

## Project Structure

- `src/app/` — Pages and routing.
- `src/components/` — Reusable UI and page components.
- `src/hooks/` — Custom React hooks.
- `src/services/` — API services.
- `src/constants/` — Shared constants.
- `src/types/` — TypeScript types.
