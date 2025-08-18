# BySkies Monorepo

Your plans, guided by skies.

This monorepo contains the BySkies weather application and shared packages.

## Structure

- `apps/web`: The Next.js 14 web application.
- `packages/ui`: Shared UI components.
- `packages/utils`: Shared utility functions.
- `packages/types`: Shared TypeScript types.
- `packages/tsconfig`: Shared TypeScript configurations.

## Getting Started

1.  **Install pnpm:**
    If you don't have pnpm installed, you can install it globally:
    `npm install -g pnpm`

2.  **Install Dependencies:**
    From the root of the monorepo, run:
    `pnpm install`

3.  **Run the Web Application:**
    Navigate to the `apps/web` directory and run the development server:
    `pnpm dev`
    Or from the root:
    `pnpm --filter web dev`

## Contributing

Please refer to the individual `README.md` files within each app and package for specific contributing guidelines.
