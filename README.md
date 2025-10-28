# Austin EMS Response Time Map

This is a 2D EMS response time visualization map for Austin, Texas.

## Structure

- `index.html` - Main HTML file with Leaflet map
- `assets/css/` - CSS styling files
  - `style.css` - Base styles
  - `emsMap.css` - EMS map specific styles
- `assets/js/` - JavaScript files
  - `emsMap2d.js` - Main map logic and EMS data loading
- `assets/images/` - Image assets
  - `ems_icon.png` - Icon for the map
- `respones_time_BG.geojson` - EMS response time data (block group level)
- `run_server.sh` - Script to start local server

## Running the Website

**Important:** You must run a local HTTP server to view this website due to CORS restrictions.

### Option 1: Using the provided script
```bash
./run_server.sh
```

### Option 2: Using Python
```bash
python3 -m http.server 8000
```

### Option 3: Using Node.js
```bash
npx http-server -p 8000
```

Then open your browser and navigate to:
```
http://localhost:8000
```

## Data Source

The map visualizes EMS response time data from the EMS_Project research:
- Response times aggregated to block group level
- Demographic variables (income, poverty, unemployment, race)
- Infrastructure variables (road density, structure age, EMS distance)
- Traffic event variables (crash patterns, time distributions)
- Environmental variables (weather, seasonality)

## Features

- Interactive choropleth map showing response time by block group
- Color-coded legend (blue = fast, red = slow)
- Detailed popup information including:
  - Block group identifier
  - Average response time in seconds and minutes
  - Demographic information (income, population, poverty rate)
- Hover effects for better interactivity

## Technology Stack

- Leaflet - for 2D mapping
- jQuery - for modal functionality
- Bootstrap - for UI components

## Research Background

This visualization is part of a research project analyzing EMS response times in Travis County, Texas. The research uses:
- Geographically Weighted Regression (GWR)
- Random Forest models
- Geographically Weighted Random Forest (GWRF)
- Spatial analysis techniques

The goal is to identify spatial patterns in EMS response times and understand contributing factors.

## CORS Error Fix

If you see a CORS error in the browser console, it means you're trying to open the HTML file directly from the file system. To fix this, you need to run a local HTTP server using one of the methods above.
