# Server Actions Implementation for Weather Data

This demonstrates converting both `useCurrentWeather` and `useForecast` React Query + Zustand hooks to Next.js Server Actions.

## What Was Changed

### Before (Client-side with React Query + Zustand)
- `useCurrentWeather()` hook in `/lib/hooks/use-weather.ts` (lines 18-54)
- `useForecast()` hook in `/lib/hooks/use-weather.ts` (lines 57-93)
- Used React Query for data fetching and caching
- Zustand store for state management  
- All data fetching happened on the client-side
- Required loading states, error handling, and refetch logic

### After (Server Actions)
- Server actions in `/lib/actions/weather-actions.ts`:
  - `getCurrentWeatherAction()` - 5 minute cache
  - `getForecastAction()` - 15 minute cache
- Server component in `/app/forecast/page.tsx`
- Client component in `/components/weather/server-weather-dashboard.tsx`
- Data fetched on the server during page render
- Built-in Next.js caching with `unstable_cache`
- Parallel data fetching with `Promise.all()`

## Key Benefits

1. **Better SEO**: Weather data is rendered on the server, available to crawlers
2. **Faster Initial Load**: No client-side data fetching waterfall
3. **Simplified State Management**: No need for Zustand or React Query
4. **Built-in Caching**: Next.js handles caching automatically
5. **Reduced Bundle Size**: No client-side data fetching libraries

## Files Created

1. `/lib/actions/weather-actions.ts` - Server action for fetching forecast data
2. `/app/forecast/page.tsx` - Server component that uses the server action
3. `/components/weather/server-weather-dashboard.tsx` - Client component for UI

## Usage Examples

Visit these URLs to see both current weather and forecast server actions in action:

- NYC: `/forecast?lat=40.7128&lon=-74.0060`
- SF: `/forecast?lat=37.7749&lon=-122.4194`
- London: `/forecast?lat=51.5074&lon=-0.1278`
- Custom: `/forecast?lat=YOUR_LAT&lon=YOUR_LON&units=metric`

Each page now fetches both current weather and 5-day forecast data server-side in parallel.

## Implementation Details

### Server Action Features
- **Current Weather**: 5-minute cache (more frequent updates)
- **Forecast**: 15-minute cache (less frequent changes)
- Proper error handling with typed responses
- Support for different unit systems (metric/imperial/kelvin)
- Cache tags for selective revalidation
- Parallel fetching of both data types with `Promise.all()`

### Performance Improvements
- Static generation where possible
- Server-side data fetching eliminates client waterfalls
- Reduced JavaScript bundle size
- Better Core Web Vitals scores

## Migration Path

For other hooks like `useCurrentWeather()`, `useAirQuality()`, etc.:

1. Create corresponding server actions
2. Convert pages to server components
3. Pass data as props to client components
4. Remove React Query and Zustand dependencies
5. Update component props to accept server data

## Trade-offs

**Pros:**
- Better performance and SEO
- Simpler architecture
- Reduced client-side complexity

**Cons:**
- Less interactive (no real-time updates without page refresh)
- Need to handle navigation between different locations
- Server-side errors are harder to recover from

## Next Steps

1. Implement server actions for all weather data types
2. Add revalidation strategies for different data types  
3. Create a hybrid approach for interactive features
4. Remove unused React Query and Zustand code