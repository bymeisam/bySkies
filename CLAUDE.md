# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BySkies is a weather-based activity planning application built as a Turborepo monorepo with Next.js and React. The app helps users make plans based on weather conditions, air quality, and provides intelligent activity suggestions.

## Architecture

This is a Turborepo monorepo with the following structure:
- `apps/web`: Next.js application (main frontend, runs on port 3001)
- `packages/ui`: React component library with Tailwind CSS
- `packages/types`: Shared TypeScript type definitions
- `packages/eslint-config`: Shared ESLint configurations
- `packages/typescript-config`: Shared TypeScript configurations  
- `packages/tailwind-config`: Shared Tailwind CSS configuration

Key architectural patterns:
- The UI package uses a `ui-` prefix for CSS classes to avoid conflicts
- Components are built with TypeScript and exported from `packages/ui`
- Weather data comes from dual provider architecture (OpenWeatherMap + Open-Meteo)
- Types are centralized in `packages/types` and imported using `@repo/types`
- Activity suggestions are generated based on weather conditions, air quality, and forecast data
- State management via Zustand store (`apps/web/lib/store/weather-store.ts`)
- Data fetching and caching via React Query (`apps/web/lib/query/query-client.ts`)

## Development Commands

### Root level commands (run from project root):
```bash
# Start development servers for all apps
yarn dev

# Build all packages and apps
yarn build

# Run linting across all packages
yarn lint

# Type checking across all packages  
yarn check-types

# Format code with Prettier
yarn format

# Fresh start (clean and rebuild everything)
yarn fresh
```

### Web app specific (from apps/web/):
```bash
# Start Next.js dev server on port 3001 with Turbopack
yarn dev

# Build Next.js app
yarn build

# Start production server
yarn start

# Lint with zero warnings tolerance
yarn lint

# Type check without emitting files
yarn check-types
```

### UI package specific (from packages/ui/):
```bash
# Build Tailwind CSS styles
yarn build:styles

# Build TypeScript components
yarn build:components

# Watch mode for styles
yarn dev:styles

# Watch mode for components  
yarn dev:components

# Type check UI components
yarn check-types

# Lint UI code
yarn lint
```

## Key Features & Components

### Weather Integration
- Uses OpenWeatherMap API (requires `OPENWEATHER_API_KEY` environment variable)
- Fetches current weather, 5-day forecast, air pollution data, and geocoding
- Clean API architecture with provider abstraction:
  - `apps/web/lib/api/weather/` - Main weather API folder
  - `apps/web/lib/api/weather/openweather/` - OpenWeatherMap specific implementations
  - `apps/web/lib/api/weather/open-meteo/` - Open-Meteo provider for extended forecasts
  - `apps/web/lib/api/weather/weather-service.ts` - Unified weather service layer
  - `UnifiedWeatherService` class with `WeatherServiceFactory` for provider switching
  - OpenWeatherMap: Current weather, 5-day forecast, air pollution, geocoding
  - Open-Meteo: Extended 16-day forecasts (current weather not supported)

### Activity Suggestions
- Intelligent activity recommendations based on weather conditions
- Analyzes temperature, wind, precipitation, air quality, and forecast trends
- Generates planning alerts for weather disruptions (temp drops, high winds, heavy rain)
- Air quality alerts with trend analysis
- Core logic in `apps/web/lib/suggestions/index.ts`

### UI Components
All UI components are located in `packages/ui/src/` and exported from `packages/ui`:
- `PremiumWeatherCard`: Displays current weather with air quality and alerts
- `PremiumActivityCard`: Shows recommended activities with confidence scoring
- `PremiumForecastCard`: Displays forecast data with trend analysis
- `PremiumWeatherMap`: Interactive weather map with Leaflet integration
- `LocationSelector`: Location search and selection interface
- `DesignSystem`: Core design system components with consistent styling
- All components use Tailwind CSS with the `ui-` prefix for class names

### Type System
Weather and location types are defined in `packages/types/src/`:
- `weather.ts`: Current weather, forecast, and air pollution response types
- `air.ts`: Air quality specific types
- `location.ts`: Geocoding and location types  
- `suggestions.ts`: Activity suggestion and alert types

## Environment Variables

Required for weather functionality:
- `OPENWEATHER_API_KEY`: API key for OpenWeatherMap services

## Technology Stack & Dependencies

### Core Dependencies
- **Next.js 15**: React framework with App Router and Turbopack
- **React 19**: UI framework with latest features
- **TypeScript 5.9**: Type safety and developer experience
- **Tailwind CSS 4**: Utility-first CSS framework
- **Zustand**: Lightweight state management
- **React Query (@tanstack/react-query)**: Server state management and caching
- **Framer Motion**: Animation library
- **React Hot Toast**: Toast notifications
- **React Error Boundary**: Error handling
- **Leaflet + React Leaflet**: Interactive maps
- **Lucide React**: Icon library

### Development Tools
- **Turbo**: Monorepo build system
- **ESLint 9**: Code linting with zero warnings policy
- **Prettier**: Code formatting
- **PostCSS + Autoprefixer**: CSS processing

## Package Manager

Uses Yarn 1.22.22 with workspaces for dependency management.