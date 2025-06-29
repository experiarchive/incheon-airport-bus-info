import { client } from '../src/lib/sanityClient.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TIMETABLES_DIR = path.resolve(__dirname, '../../data/timetables');
const PUBLIC_DIR = path.resolve(__dirname, '../public');

async function getAllRoutes() {
  const query = `*[_type == "busRoute"]{
    "id": _id,
    routeName,
    routeNumber,
    "stops": *[_type == "timetableEntry" && references(^._id)].stopName
  }`;
  const routes = await client.fetch(query);
  return routes.map(route => ({
    ...route,
    stops: [...new Set(route.stops)] // Remove duplicate stop names
  }));
}

async function generateSearchData() {
  try {
    console.log('Fetching route data from Sanity...');
    const routes = await getAllRoutes();
    
    // In this project, detailed stop information is in NDJSON files,
    // so we need to read them to get a comprehensive stop list for each route.
    
    const allTimetableFiles = fs.readdirSync(TIMETABLES_DIR).filter(file => file.endsWith('.ndjson'));

    const routeIdToStops = {};

    for (const file of allTimetableFiles) {
      const filePath = path.join(TIMETABLES_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const lines = fileContent.split('\n').filter(Boolean);

      for (const line of lines) {
        const entry = JSON.parse(line);
        const routeId = entry.route?._ref;
        const stopName = entry.stopName;

        if (routeId && stopName) {
          if (!routeIdToStops[routeId]) {
            routeIdToStops[routeId] = new Set();
          }
          routeIdToStops[routeId].add(stopName);
        }
      }
    }

    const searchData = routes.map(route => {
        const fileStops = routeIdToStops[route.id] ? Array.from(routeIdToStops[route.id]) : [];
        const combinedStops = [...new Set([...(route.stops || []), ...fileStops])];
        
        return {
            routeNumber: route.routeNumber,
            routeName: route.routeName,
            stops: combinedStops
        };
    });

    if (!fs.existsSync(PUBLIC_DIR)) {
      fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }

    const outputPath = path.join(PUBLIC_DIR, 'search-data.json');
    fs.writeFileSync(outputPath, JSON.stringify(searchData, null, 2));

    console.log(`✅ Search data successfully generated at ${outputPath}`);
    console.log(`Found ${searchData.length} routes.`);

  } catch (error) {
    console.error('Error generating search data:', error);
    process.exit(1);
  }
}

generateSearchData(); 