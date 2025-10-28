/*
Austin EMS Response Time Map 2D Visualization
Created under Dr. Jiao's Urban Information Lab.
*/

// Global variables
var map;
var blockGroupLayer;
var geojsonLayer;

// Initialize map
function initMap() {
    console.log('Initializing EMS Response Time map...');
    
    // Create Leaflet map
    map = L.map('map', {
        center: [30.2672, -97.7431], // Austin, TX
        zoom: 11
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    console.log('Map initialized');
    
    // Load EMS data
    loadEMSData();
}

// Load EMS response time data
async function loadEMSData() {
    try {
        console.log('Loading EMS response time data...');
        
        // Hide spinner
        var spinner = document.getElementById("spinner");
        if (spinner) {
            spinner.style.display = 'none';
        }

        // Fetch EMS data - try the response time geojson
        var response = await fetch('respones_time_BG.geojson');
        
        if (!response.ok) {
            console.error('Failed to load data:', response.statusText);
            return;
        }
        
        var emsData = await response.json();
        console.log('Loaded', emsData.features.length, 'block groups');
        
        // Add geojson layer to map
        geojsonLayer = L.geoJSON(emsData, {
            style: getFeatureStyle,
            onEachFeature: onEachFeature
        }).addTo(map);

        // Fit map to bounds
        map.fitBounds(geojsonLayer.getBounds());
        
        // Add legend
        addLegend();

    } catch (error) {
        console.error('Error loading EMS data:', error);
    }
}

// Style function for each feature
function getFeatureStyle(feature) {
    var responseTime = feature.properties.response_time;
    
    if (!responseTime || responseTime === null) {
        return {
            fillColor: '#cccccc',
            weight: 1,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.7
        };
    }

    var color;
    if (responseTime < 300) {
        color = '#0066cc'; // Fast - blue
    } else if (responseTime < 450) {
        color = '#4da6ff'; // Medium - light blue
    } else if (responseTime < 600) {
        color = '#ff9900'; // Slow - orange
    } else {
        color = '#ff3300'; // Very slow - red
    }

    return {
        fillColor: color,
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
    };
}

// On each feature - add popup
function onEachFeature(feature, layer) {
    var popupContent = createPopupContent(feature.properties);
    layer.bindPopup(popupContent);
    
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });
}

// Create popup content
function createPopupContent(properties) {
    var content = '<div class="ems-popup">';
    content += '<h4>Block Group: ' + (properties.GEOID || properties.geoid || 'N/A') + '</h4>';
    
    if (properties.response_time !== null && properties.response_time !== undefined) {
        content += '<div class="response-time">Average Response Time: ' + 
                   Math.round(properties.response_time) + ' seconds (' + 
                   Math.round(properties.response_time / 60) + ' minutes)</div>';
    } else {
        content += '<div class="response-time">No response time data available</div>';
    }
    
    // Add additional demographics if available
    if (properties.income !== null && properties.income !== undefined) {
        content += '<div class="demographics">Median Income: $' + 
                   Math.round(properties.income).toLocaleString() + '</div>';
    }
    
    if (properties.pop_2020) {
        content += '<div class="demographics">Population (2020): ' + 
                   properties.pop_2020.toLocaleString() + '</div>';
    }
    
    if (properties.poverty_percentage) {
        content += '<div class="demographics">Poverty Rate: ' + 
                   (properties.poverty_percentage * 100).toFixed(1) + '%</div>';
    }
    
    content += '</div>';
    return content;
}

// Highlight feature on hover
function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 3,
        color: '#000',
        dashArray: '',
        fillOpacity: 0.8
    });
    
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

// Reset highlight
function resetHighlight(e) {
    geojsonLayer.resetStyle(e.target);
}

// Add legend
function addLegend() {
    var legend = L.control({position: 'bottomright'});
    
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'legend');
        div.innerHTML = 
            '<h4>EMS Response Time</h4>' +
            '<div class="legend-item">' +
            '<i style="background: #0066cc; width: 20px; height: 20px; float: left; margin-right: 8px;"></i>' +
            '<span>< 5 minutes</span>' +
            '</div>' +
            '<div class="legend-item">' +
            '<i style="background: #4da6ff; width: 20px; height: 20px; float: left; margin-right: 8px;"></i>' +
            '<span>5-7.5 minutes</span>' +
            '</div>' +
            '<div class="legend-item">' +
            '<i style="background: #ff9900; width: 20px; height: 20px; float: left; margin-right: 8px;"></i>' +
            '<span>7.5-10 minutes</span>' +
            '</div>' +
            '<div class="legend-item">' +
            '<i style="background: #ff3300; width: 20px; height: 20px; float: left; margin-right: 8px;"></i>' +
            '<span>> 10 minutes</span>' +
            '</div>' +
            '<div class="legend-item" style="margin-top: 10px;">' +
            '<i style="background: #cccccc; width: 20px; height: 20px; float: left; margin-right: 8px;"></i>' +
            '<span>No data</span>' +
            '</div>';
        
        return div;
    };
    
    legend.addTo(map);
}

// Initialize when page loads
window.addEventListener('load', function() {
    console.log('Page loaded, initializing map...');
    initMap();
});

