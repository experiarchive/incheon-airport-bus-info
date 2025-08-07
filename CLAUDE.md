# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **Incheon Airport Bus Information Website** built as a static site generator project using modern web technologies. The website provides real-time bus schedules, stop locations, fare information, and booking details for airport bus routes serving Incheon International Airport.

**Tech Stack:**
- **Frontend:** Astro (Static Site Generator) with TypeScript
- **CMS:** Sanity.io for content management  
- **Styling:** Tailwind CSS
- **Hosting:** Vercel
- **Maps:** Kakao Maps API for stop locations and real-time bus tracking

## Development Commands

### Astro Frontend (`astro-frontend/`)
```bash
# Development server
npm run dev
npm run start    # alias for dev

# Build for production 
npm run prebuild  # generates search data first
npm run build     # builds the Astro site

# Preview production build
npm run preview
```

### Sanity Studio (`my-sanity-studio/`)
```bash  
# Development studio
npm run dev
npm start    # alias for dev

# Build and deploy studio
npm run build
npm run deploy

# Deploy GraphQL schema
npm run deploy-graphql
```

### Root Project
```bash
# Install all dependencies (frontend + studio)
npm install
```

## Architecture & Code Structure

### Dual-System Architecture
The project uses a **hybrid data architecture** with two complementary systems:

1. **Sanity.io CMS** - Basic route metadata and rich content
   - Bus route information (routeName, routeNumber, description)
   - Usage guides and timetable notes (Rich text/Portable Text)
   - Kakao Map iframe URLs for real-time tracking

2. **Static JSON/NDJSON Files** - Detailed operational data
   - Comprehensive timetable data (`/data/timetables/*.ndjson`)
   - Route-specific information (`/public/data/{routeNumber}.json`)
   - Stop location coordinates and fare information

### Key File Structure
```
├── astro-frontend/          # Main website
│   ├── src/
│   │   ├── layouts/Layout.astro     # Base layout with SEO, AdSense
│   │   ├── pages/
│   │   │   ├── index.astro          # Homepage
│   │   │   ├── routes.astro         # Route listing
│   │   │   └── routes/[routeNumber].astro  # Dynamic route pages
│   │   └── lib/sanityClient.js      # Sanity connection
│   ├── public/data/         # Static route data files
│   └── scripts/generate-search-data.mjs  # Pre-build search index
├── my-sanity-studio/        # CMS backend
│   └── schemaTypes/         # Content models
├── data/timetables/         # NDJSON timetable files
└── memory-bank/            # AI context documentation
```

### Data Flow Pattern

1. **Build Time:** 
   - Sanity.io provides basic route structure via GROQ queries
   - Static JSON files provide detailed stop/fare/timetable data
   - `generate-search-data.mjs` combines both sources for search functionality

2. **Runtime (Static):**
   - Route pages use `getStaticPaths()` to pre-render all route combinations
   - Client-side JavaScript handles interactive features (maps, timetable filtering)

### Sanity.io Schema Structure

**busRoute Document:**
- `routeName`: Display name (e.g., "6001번 공항버스")  
- `routeNumber`: Unique identifier (e.g., "6001")
- `description`: Route overview text
- `mainStops`: Array of major stop names
- `usageGuide`: Rich text usage instructions  
- `timetableNotes`: Rich text timetable disclaimers
- `kakaoMapIframeUrl`: Real-time tracking embed URL

**timetableEntry Document:**
- `route`: Reference to busRoute
- `dayType`: "weekday" | "weekend_holiday" | "everyday"
- `direction`: "공항행" | "시내행"
- `departureTimes`: Array of time strings
- `stopName`: Departure stop name

### SEO & Performance Optimizations

- **Structured data** with JSON-LD for transportation services
- **Comprehensive meta tags** including Open Graph and Twitter Cards
- **AdSense integration** with responsive ad units
- **Korean web fonts** (Pretendard) with preload optimization
- **Mobile-first responsive design** using Tailwind CSS

### Interactive Features

- **Kakao Maps integration** showing all route stops with roadview support
- **Dynamic timetable filtering** by direction and stop selection
- **Real-time next departure highlighting** based on current time
- **Mobile hamburger navigation** with accessibility features

## Important Development Patterns

### Data Loading Pattern
```javascript
// Standard Sanity query pattern
const route = await client.fetch(`
  *[_type == "busRoute" && routeNumber == $routeNumber][0]{
    routeName,
    routeNumber, 
    description,
    mainStops,
    usageGuide,
    kakaoMapIframeUrl
  }
`, { routeNumber });

// JSON fallback pattern for detailed data
let jsonData = null;
try {
  const fs = await import('fs');
  const jsonFilePath = path.join(process.cwd(), 'public', 'data', `${routeNumber}.json`);
  if (fs.existsSync(jsonFilePath)) {
    jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
  }
} catch (error) {
  console.error('Error loading JSON data:', error);
}
```

### Timetable Processing Pattern
```javascript
// Group timetable entries by direction and day type
const groupedTimetables = {};
timetableEntries.forEach((entry) => {
  const key = `${entry.direction}-${entry.dayType}`;
  if (!groupedTimetables[key]) {
    groupedTimetables[key] = [];
  }
  groupedTimetables[key].push(entry);
});
```

### Mobile-First CSS Pattern
```css
/* Standard responsive approach */
gap-4 p-4 md:gap-6 md:p-6

/* Card hover effects */
hover:shadow-xl transition-all duration-300 transform hover:scale-105
```

## Critical Integrations

### Google AdSense
- **Publisher ID:** `ca-pub-8355312170222120`
- **Ad slots:** Configured for desktop and mobile with different slot IDs
- **Placement:** Strategic placement between content sections

### Kakao Maps API  
- **App Key:** `9dee7ba39e07c39710261487dceadbcb`
- **Features:** Map display, markers, info windows, roadview integration
- **Data source:** Coordinates from JSON files in `public/data/`

### Sanity.io Configuration
- **Project ID:** `2os1gn84`
- **Dataset:** `production`
- **API Version:** `2023-05-03`

## Testing & Quality Assurance

- **Linting:** No specific linter configured
- **Type Checking:** TypeScript enabled in Astro with interface definitions
- **Manual Testing:** Focus on mobile responsiveness and cross-browser compatibility

## Common Development Tasks

### Adding a New Bus Route
1. Add route data in Sanity Studio (`busRoute` document)
2. Create corresponding JSON file in `public/data/{routeNumber}.json` with fare/stop details
3. Add timetable entries via Sanity Studio or NDJSON files in `data/timetables/`
4. Run build to regenerate search data

### Updating Timetables  
1. Update NDJSON files in `data/timetables/` with new schedule data
2. Rebuild site to reflect changes
3. Verify timetable display on route pages

### Modifying SEO/Meta Tags
1. Edit `Layout.astro` for global meta tags
2. Update route-specific SEO in `[routeNumber].astro`
3. Test structured data with Google's Rich Results Test

## Memory Bank Integration

This project uses a sophisticated AI memory system with documented patterns and user preferences in:
- `.cursorrules` - Project intelligence and learned patterns  
- `memory-bank/` - Detailed context files for AI assistance
- Strong emphasis on mobile-first development and user experience optimization

When working on this project, prioritize mobile user experience since most users access bus information while traveling.