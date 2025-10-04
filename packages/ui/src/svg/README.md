# SVG Icon System

This folder contains individual SVG files that are organized and centralized through the `Svg` component.

## How to Add New SVG Icons

1. **Add the SVG file**: Create a new `.svg` file in this folder (e.g., `new-icon.svg`)
   ```xml
   <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
     <!-- SVG paths here -->
   </svg>
   ```

2. **Extract the SVG content**: Copy the inner content (paths, circles, etc.) from your SVG file

3. **Update the SVG paths** (`./index.tsx`):
   - Add the SVG content to the `svgPaths` object
   ```tsx
   // In ./svg/index.tsx
   export const svgPaths = {
     // ... existing icons
     'new-icon': <path d="your-svg-path-here" />,  // ← Add here
   } as const;
   ```

   ✨ The `SvgName` type is automatically derived from this object, so no manual type updates needed!

4. **Use the icon**:
   ```tsx
   <Svg name="new-icon" size="lg" className="text-blue-500" />
   ```

## Available Icons

- **Weather**: `sun`, `moon`, `cloud`, `rain`, `snow`, `thunderstorm`, `mist`
- **UI**: `warning`, `chevron-down`, `star`, `map-pin`, `loader`

## Benefits

- ✅ **Easy to add**: Drop SVG files here and copy content to component
- ✅ **Type safe**: TypeScript ensures only valid icon names are used
- ✅ **Consistent**: All icons follow the same API and styling
- ✅ **Performant**: No dynamic imports, built into bundle
- ✅ **Customizable**: Size, color, stroke, and className can be customized
- ✅ **Organized**: SVG files kept separate for easy reference and management

## Design Philosophy

This hybrid approach gives you the best of both worlds:
- **Modular files**: Each icon is stored as a separate `.svg` file for easy management
- **Performance**: SVG content is imported statically, no runtime loading
- **Type safety**: Only defined icons can be used
- **Flexibility**: Easy to add icons from any source (copy SVG content)

## Example Usage

```tsx
// Basic usage
<Svg name="sun" />

// With size and styling
<Svg name="cloud" size="xl" className="text-gray-400" />

// With custom colors
<Svg name="rain" fill="blue" stroke="darkblue" />

// Different sizes
<Svg name="star" size="xs" />  // 12x12px
<Svg name="star" size="sm" />  // 16x16px
<Svg name="star" size="md" />  // 20x20px (default)
<Svg name="star" size="lg" />  // 24x24px
<Svg name="star" size="xl" />  // 32x32px
<Svg name="star" size="2xl" /> // 48x48px
```