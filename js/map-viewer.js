// Map Viewer Module
class WhispMapViewer {
  constructor() {
    this.map = null;
    this.geojsonLayer = null;
    this.riskIconsLayer = null; // Layer for risk icons
    this.baseLayers = {};
    this.overlayLayers = {};
    this.currentOpacity = 0.7;
    this.API_BASE_URL = 'https://gis-development.koltivaapi.com'; // Updated to match working reference
    // this.API_BASE_URL = 'http://localhost:8000'; // Updated to match working reference
    this.init();
  }

  init() {
    this.initMap();
    this.initBaseLayers();
    this.initOverlayLayers();
    this.initControls();
    this.initLegend();
    this.loadMapData();
  }

  initMap() {
    // Initialize map centered on Kalimantan (matching reference script)
    this.map = L.map('map').setView([-1, 114], 8); // Increased zoom level to see tiles better

    // Add base layer (OpenStreetMap) - matching reference script
    this.baseLayers.osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      zIndex: 1
    }).addTo(this.map);

    this.baseLayers.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      zIndex: 1
    });

    this.baseLayers.terrain = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenTopoMap contributors',
      zIndex: 1
    });
    
    console.log('Map initialized at center:', this.map.getCenter(), 'zoom:', this.map.getZoom());
    
    // Add debug info for map view changes
    this.map.on('moveend', () => {
      const center = this.map.getCenter();
      const zoom = this.map.getZoom();
      console.log(`Map moved to: lat=${center.lat.toFixed(4)}, lng=${center.lng.toFixed(4)}, zoom=${zoom}`);
    });

    this.map.on('zoomend', () => {
      const zoom = this.map.getZoom();
      console.log(`Map zoom changed to: ${zoom}`);
      // Force refresh of overlay layers at new zoom
      this.orderedLayers.forEach(key => {
        if (this.map.hasLayer(this.overlayLayers[key])) {
          console.log(`Refreshing layer ${key} at zoom ${zoom}`);
        }
      });
    });
    
    // Add click handler for coordinates (matching reference script)
    this.map.on('click', (e) => {
      const lat = e.latlng.lat.toFixed(6);
      const lng = e.latlng.lng.toFixed(6);
      console.log(`Map clicked at: ${lat}, ${lng}`);
      L.popup()
        .setLatLng(e.latlng)
        .setContent(`Coordinates: ${lat}, ${lng}`)
        .openOn(this.map);
    });
  }

  initBaseLayers() {
    const baseLayerSelect = document.getElementById('baseLayerSelect');
    baseLayerSelect.addEventListener('change', (e) => {
      this.switchBaseLayer(e.target.value);
    });
  }

  initOverlayLayers() {
    // Initialize overlay layers (matching working reference script)
    this.overlayLayers = {
      eufo2020: L.tileLayer(`${this.API_BASE_URL}/data/v1/gee/tiles/eufo_2020/{z}/{x}/{y}?style=green`, {
        attribution: 'EUFO 2020',
        opacity: 0.8,
        zIndex: 100
      }),
      gladPrimary: L.tileLayer(`${this.API_BASE_URL}/data/v1/gee/tiles/gfc_loss_primary_2021_2024/{z}/{x}/{y}`, {
        attribution: 'GLAD Primary 2021-2024',
        opacity: 0.8,
        zIndex: 101
      }),
      primaryForest2020: L.tileLayer(`${this.API_BASE_URL}/data/v1/gee/tiles/primary_forest_2020/{z}/{x}/{y}?style=green`, {
        attribution: 'Primary Forest 2020',
        opacity: 0.8,
        zIndex: 102
      }),
      sbtnNaturalLands: L.tileLayer(`${this.API_BASE_URL}/data/v1/gee/tiles/sbtn_natural_lands/{z}/{x}/{y}?style=green`, {
        attribution: 'SBTN Natural Lands',
        opacity: 0.8,
        zIndex: 103
      }),
      sbtnDeforestation: L.tileLayer(`${this.API_BASE_URL}/data/v1/gee/tiles/sbtn_deforestation/{z}/{x}/{y}`, {
        attribution: 'SBTN Deforestation 2021-2024',
        opacity: 0.9,
        zIndex: 104
      }),
      jrcDeforestation: L.tileLayer(`${this.API_BASE_URL}/data/v1/gee/tiles/jrc_deforestation/{z}/{x}/{y}`, {
        attribution: 'JRC TMF Deforestation 2021-2024',
        opacity: 0.9,
        zIndex: 105
      })
    };

    // Ordered layer keys (bottom to top) - matching reference script
    this.orderedLayers = [
      'eufo2020',
      'gladPrimary', 
      'primaryForest2020',
      'sbtnNaturalLands',
      'sbtnDeforestation',
      'jrcDeforestation'
    ];

    // Add all layers to map by default (like reference script)
    this.orderedLayers.forEach(key => {
      console.log(`Preparing layer: ${key} with URL: ${this.overlayLayers[key]._url}`);
      console.log(`Layer opacity: ${this.overlayLayers[key].options.opacity}, zIndex: ${this.overlayLayers[key].options.zIndex}`);
      
      // Add loading indicator (matching reference script)
      this.overlayLayers[key].on('loading', () => {
        console.log(`Layer ${key} is loading tiles...`);
        document.body.style.cursor = 'wait';
      });
      
      this.overlayLayers[key].on('load', () => {
        console.log(`Layer ${key} finished loading tiles`);
        document.body.style.cursor = 'default';
      });
      
      // Add error handling for tile loading
      this.overlayLayers[key].on('tileerror', (e) => {
        console.error(`Tile loading error for layer ${key}:`, e);
        console.error(`Failed URL: ${e.tile.src}`);
      });

      // Add tile load success debugging
      this.overlayLayers[key].on('tileload', (e) => {
        console.log(`Tile loaded successfully for layer ${key}:`, e.tile.src);
      });
      
      // DO NOT add layers to map by default - let user choose
      console.log(`Layer ${key} prepared but not added to map`);
    });

    console.log('All overlay layers added to map:', this.orderedLayers);

    // Initialize layer controls
    this.initLayerControls();
  }

  initLayerControls() {
    const layerControlsContainer = document.getElementById('layerControls');
    
    // Layer info matching reference script colors and order
    const layerInfo = {
      eufo2020: { name: 'EUFO 2020', color: '#8fda54', category: 'forest' },
      gladPrimary: { name: 'GLAD Primary 2021-2024', color: '#ff9900', category: 'deforestation' },
      primaryForest2020: { name: 'Primary Forest 2020', color: '#8fda54', category: 'forest' },
      sbtnNaturalLands: { name: 'SBTN Natural Lands', color: '#8fda54', category: 'forest' },
      sbtnDeforestation: { name: 'SBTN Deforestation 2021-2024', color: '#ff9900', category: 'deforestation' },
      jrcDeforestation: { name: 'JRC Deforestation 2021-2024', color: '#ff9900', category: 'deforestation' }
    };

    let controlsHTML = '<div class="layer-sections">';
    
    // Forest layers first
    controlsHTML += '<div class="layer-section"><h4><span class="icon">🌲</span> Forest Layers</h4>';
    this.orderedLayers.filter(key => layerInfo[key].category === 'forest').forEach(layerKey => {
      const info = layerInfo[layerKey];
      controlsHTML += `
        <div class="layer-item">
          <label class="layer-checkbox">
            <input type="checkbox" id="${layerKey}Toggle" onchange="mapViewer.toggleLayer('${layerKey}')">
            <span class="checkmark" style="border-color: ${info.color}; background-color: transparent;"></span>
            <span class="layer-name">${info.name}</span>
          </label>
          <div class="layer-opacity">
            <input type="range" min="0" max="1" step="0.1" value="${this.overlayLayers[layerKey].options.opacity}" 
                   id="${layerKey}Opacity" onchange="mapViewer.updateLayerOpacity('${layerKey}', this.value)">
          </div>
        </div>
      `;
    });
    controlsHTML += '</div>';

    // Deforestation layers
    controlsHTML += '<div class="layer-section"><h4><span class="icon">🔥</span> Deforestation Layers</h4>';
    this.orderedLayers.filter(key => layerInfo[key].category === 'deforestation').forEach(layerKey => {
      const info = layerInfo[layerKey];
      controlsHTML += `
        <div class="layer-item">
          <label class="layer-checkbox">
            <input type="checkbox" id="${layerKey}Toggle" onchange="mapViewer.toggleLayer('${layerKey}')">
            <span class="checkmark" style="border-color: ${info.color}; background-color: transparent;"></span>
            <span class="layer-name">${info.name}</span>
          </label>
          <div class="layer-opacity">
            <input type="range" min="0" max="1" step="0.1" value="${this.overlayLayers[layerKey].options.opacity}" 
                   id="${layerKey}Opacity" onchange="mapViewer.updateLayerOpacity('${layerKey}', this.value)">
          </div>
        </div>
      `;
    });
    controlsHTML += '</div></div>';

    layerControlsContainer.innerHTML = controlsHTML;
  }

  initLegend() {
    const legendContainer = document.getElementById('legendContainer');
    const legendHTML = `
      <div class="legend-header">
        <h4><span class="icon">🗺️</span> Map Legend</h4>
        <button class="legend-toggle" onclick="mapViewer.toggleLegend()">▼</button>
      </div>
      <div class="legend-content" id="legendContent">
        <div class="legend-section">
          <h5>Risk Levels</h5>
          <div class="legend-item">
            <div class="legend-color" style="background-color: #dc2626;"></div>
            <span>High Risk</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background-color: #f59e0b;"></div>
            <span>Medium Risk</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background-color: #10b981;"></div>
            <span>Low Risk</span>
          </div>
        </div>
        <div class="legend-section">
          <h5>Deforestation Data</h5>
          <div class="legend-item">
            <div class="legend-color" style="background-color: #ff9900;"></div>
            <span>JRC Deforestation</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background-color: #ff9900;"></div>
            <span>SBTN Deforestation</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background-color: #ff9900;"></div>
            <span>GLAD Primary Loss</span>
          </div>
        </div>
        <div class="legend-section">
          <h5>Forest Coverage</h5>
          <div class="legend-item">
            <div class="legend-color" style="background-color: #8fda54;"></div>
            <span>SBTN Natural Lands</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background-color: #8fda54;"></div>
            <span>Primary Forest 2020</span>
          </div>
          <div class="legend-item">
            <div class="legend-color" style="background-color: #8fda54;"></div>
            <span>EUFO 2020</span>
          </div>
        </div>
      </div>
    `;
    legendContainer.innerHTML = legendHTML;
  }

  toggleLayer(layerKey) {
    const checkbox = document.getElementById(`${layerKey}Toggle`);
    const checkmark = checkbox.nextElementSibling; // Get the checkmark span
    const layer = this.overlayLayers[layerKey];
    
    console.log(`Toggling layer: ${layerKey}, checked: ${checkbox.checked}`);
    
    if (checkbox.checked) {
      layer.addTo(this.map);
      // Update checkmark visual to show it's active
      const layerInfo = {
        eufo2020: { color: '#8fda54' },
        gladPrimary: { color: '#ff9900' },
        primaryForest2020: { color: '#8fda54' },
        sbtnNaturalLands: { color: '#8fda54' },
        sbtnDeforestation: { color: '#ff9900' },
        jrcDeforestation: { color: '#ff9900' }
      };
      checkmark.style.backgroundColor = layerInfo[layerKey].color;
      console.log(`Layer ${layerKey} added to map`);
    } else {
      this.map.removeLayer(layer);
      // Update checkmark visual to show it's inactive
      checkmark.style.backgroundColor = 'transparent';
      console.log(`Layer ${layerKey} removed from map`);
    }
  }

  updateLayerOpacity(layerKey, opacity) {
    const layer = this.overlayLayers[layerKey];
    if (this.map.hasLayer(layer)) {
      layer.setOpacity(parseFloat(opacity));
    }
  }

  toggleLegend() {
    const content = document.getElementById('legendContent');
    const toggle = document.querySelector('.legend-toggle');
    
    if (content.style.display === 'none') {
      content.style.display = 'block';
      toggle.textContent = '▼';
    } else {
      content.style.display = 'none';
      toggle.textContent = '▶';
    }
  }

  switchBaseLayer(layerName) {
    // Remove all base layers
    Object.values(this.baseLayers).forEach(layer => {
      this.map.removeLayer(layer);
    });

    // Add selected base layer
    if (this.baseLayers[layerName]) {
      this.baseLayers[layerName].addTo(this.map);
    }
  }

  initControls() {
    const opacitySlider = document.getElementById('opacitySlider');
    opacitySlider.addEventListener('input', (e) => {
      this.currentOpacity = parseFloat(e.target.value);
      this.updateOpacity();
    });
  }

  updateOpacity() {
    if (this.geojsonLayer) {
      this.geojsonLayer.setStyle({
        fillOpacity: this.currentOpacity,
        opacity: Math.min(this.currentOpacity + 0.3, 1)
      });
    }
  }

  loadMapData() {
    // First, try to load data from localStorage (priority)
    const storedResults = localStorage.getItem('whispAnalysisResults');
    const dataTimestamp = localStorage.getItem('whispMapDataTimestamp');
    
    if (storedResults) {
      try {
        this.showLoading(true);
        const geoData = JSON.parse(storedResults);
        
        console.log('Loading map data from localStorage');
        this.displayGeoData(geoData);
        
        // Clear the timestamp to prevent reloading old data
        localStorage.removeItem('whispMapDataTimestamp');
        return;
      } catch (error) {
        console.error('Error parsing stored map data:', error);
        localStorage.removeItem('whispAnalysisResults');
        localStorage.removeItem('whispMapDataTimestamp');
      } finally {
        this.showLoading(false);
      }
    }
    
    // Fallback: try to load from URL parameters (for backward compatibility)
    const urlParams = new URLSearchParams(window.location.search);
    const data = urlParams.get('data');
    
    if (data) {
      try {
        this.showLoading(true);
        const geoData = JSON.parse(decodeURIComponent(data));
        
        console.log('Loading map data from URL parameters');
        // Store the data in localStorage for persistence
        localStorage.setItem('whispAnalysisResults', JSON.stringify(geoData));
        
        this.displayGeoData(geoData);
      } catch (error) {
        console.error('Error parsing URL map data:', error);
        console.log('Continuing with overlay layers only');
      } finally {
        this.showLoading(false);
      }
      return;
    }
    
    // No data available - show overlay layers only
    console.log('No map data available, showing overlay layers only');
  }

  displayGeoData(data) {
    // Extract features from the new API structure
    let features = [];
    if (data && data.data && data.data.features && Array.isArray(data.data.features)) {
      features = data.data.features;
    } else if (data && data.result && data.result.features && Array.isArray(data.result.features)) {
      features = data.result.features;
    } else if (Array.isArray(data.features)) {
      features = data.features;
    } else if (Array.isArray(data)) {
      features = data;
    }

    if (features.length === 0) {
      this.showError('No geographic features found in the data.');
      return;
    }

    // Create GeoJSON layer with higher z-index
    this.geojsonLayer = L.geoJSON(features, {
      style: (feature) => this.getFeatureStyle(feature),
      onEachFeature: (feature, layer) => this.onEachFeature(feature, layer),
      pane: 'overlayPane'
    }).addTo(this.map);

    // Ensure geojson layer is on top
    this.geojsonLayer.bringToFront();

    // Add risk icons to polygon centroids
    this.addRiskIcons(features);

    // Fit map to bounds
    this.map.fitBounds(this.geojsonLayer.getBounds());

    // Update feature count in controls
    this.updateFeatureCount(features.length);
  }

  getFeatureStyle(feature) {
    const props = feature.properties || {};
    
    // Color based on overall compliance risk from new API
    let color = '#4da6ff'; // default blue
    
    if (props.overall_compliance && props.overall_compliance.overall_risk) {
      const overallRisk = props.overall_compliance.overall_risk;
      if (overallRisk === 'high') {
        color = '#dc2626'; // red for high risk
      } else if (overallRisk === 'medium') {
        color = '#f59e0b'; // orange for medium risk  
      } else if (overallRisk === 'low') {
        color = '#10b981'; // green for low risk
      }
    }

    return {
      color: color,
      weight: 2,
      opacity: Math.min(this.currentOpacity + 0.3, 1),
      fillColor: color,
      fillOpacity: this.currentOpacity
    };
  }

  onEachFeature(feature, layer) {
    layer.on({
      click: (e) => this.showFeatureInfo(feature),
      mouseover: (e) => {
        e.target.setStyle({
          weight: 4,
          opacity: 1
        });
      },
      mouseout: (e) => {
        this.geojsonLayer.resetStyle(e.target);
      }
    });

    // Modern popup with updated styling for new API format
    const props = feature.properties || {};
    
    // Get risk level for styling
    const riskLevel = props.overall_compliance?.overall_risk || 'unknown';
    const riskColors = {
      high: '#dc2626',
      medium: '#f59e0b', 
      low: '#10b981',
      unknown: '#6b7280'
    };
    const riskColor = riskColors[riskLevel] || riskColors.unknown;
    
    // Get compliance status for styling
    const complianceStatus = props.overall_compliance?.compliance_status || 'Unknown';
    const complianceColors = {
      compliant: '#10b981',
      'non-compliant': '#dc2626',
      'partially compliant': '#f59e0b',
      unknown: '#6b7280'
    };
    const complianceColor = complianceColors[complianceStatus.toLowerCase()] || complianceColors.unknown;

    const popupContent = `
      <div style="
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        margin: -20px;
        padding: 0;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        overflow: hidden;
        min-width: 300px;
        max-width: 400px;
      ">
        <!-- Header Section -->
        <div style="
          background: rgba(255,255,255,0.1);
          padding: 20px;
          text-align: center;
          backdrop-filter: blur(10px);
        ">
          <h3 style="
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          ">
            🗺️ Plot ${props.plot_id || 'N/A'}
          </h3>
          <p style="
            margin: 5px 0 0 0;
            opacity: 0.9;
            font-size: 14px;
          ">
            📍 ${props.country_name || 'Unknown Location'}
          </p>
        </div>

        <!-- Content Section -->
        <div style="padding: 20px;">
          <!-- Area Info -->
          <div style="
            background: rgba(255,255,255,0.1);
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            backdrop-filter: blur(5px);
          ">
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
              <span style="font-size: 24px; margin-right: 10px;">📐</span>
              <div>
                <div style="font-weight: 600; font-size: 16px;">Area Coverage</div>
                <div style="font-size: 24px; font-weight: 700; color: #fbbf24;">
                  ${props.total_area_hectares ? props.total_area_hectares.toFixed(2) : 'N/A'} ha
                </div>
              </div>
            </div>
          </div>

          <!-- Risk & Compliance Row -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
            <!-- Risk Level -->
            <div style="
              background: rgba(255,255,255,0.1);
              border-radius: 8px;
              padding: 12px;
              text-align: center;
              backdrop-filter: blur(5px);
            ">
              <div style="font-size: 12px; opacity: 0.8; margin-bottom: 5px;">RISK LEVEL</div>
              <div style="
                background: ${riskColor};
                color: white;
                padding: 6px 12px;
                border-radius: 20px;
                font-weight: 600;
                font-size: 12px;
                text-transform: uppercase;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
              ">
                ${riskLevel}
              </div>
            </div>

            <!-- Compliance Status -->
            <div style="
              background: rgba(255,255,255,0.1);
              border-radius: 8px;
              padding: 12px;
              text-align: center;
              backdrop-filter: blur(5px);
            ">
              <div style="font-size: 12px; opacity: 0.8; margin-bottom: 5px;">COMPLIANCE</div>
              <div style="
                background: ${complianceColor};
                color: white;
                padding: 6px 12px;
                border-radius: 20px;
                font-weight: 600;
                font-size: 12px;
                text-transform: capitalize;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
              ">
                ${complianceStatus}
              </div>
            </div>
          </div>

          <!-- Loss Detection Section -->
          <div style="
            background: rgba(255,255,255,0.1);
            border-radius: 8px;
            padding: 15px;
            backdrop-filter: blur(5px);
          ">
            <div style="
              display: flex;
              align-items: center;
              margin-bottom: 12px;
              font-weight: 600;
              font-size: 14px;
            ">
              <span style="margin-right: 8px;">🛰️</span>
              Loss Detection Analysis
            </div>
            
            <div style="display: grid; gap: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="display: flex; align-items: center; font-size: 13px;">
                  <span style="
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    background: #ef4444;
                    border-radius: 50%;
                    margin-right: 8px;
                  "></span>
                  GFW Loss
                </span>
                <span style="
                  background: rgba(255,255,255,0.2);
                  padding: 4px 8px;
                  border-radius: 12px;
                  font-size: 12px;
                  font-weight: 600;
                ">
                  ${props.gfw_loss?.gfw_loss_stat || 'N/A'}
                </span>
              </div>
              
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="display: flex; align-items: center; font-size: 13px;">
                  <span style="
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    background: #f97316;
                    border-radius: 50%;
                    margin-right: 8px;
                  "></span>
                  JRC Loss
                </span>
                <span style="
                  background: rgba(255,255,255,0.2);
                  padding: 4px 8px;
                  border-radius: 12px;
                  font-size: 12px;
                  font-weight: 600;
                ">
                  ${props.jrc_loss?.jrc_loss_stat || 'N/A'}
                </span>
              </div>
              
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="display: flex; align-items: center; font-size: 13px;">
                  <span style="
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    background: #8b5cf6;
                    border-radius: 50%;
                    margin-right: 8px;
                  "></span>
                  SBTN Loss
                </span>
                <span style="
                  background: rgba(255,255,255,0.2);
                  padding: 4px 8px;
                  border-radius: 12px;
                  font-size: 12px;
                  font-weight: 600;
                ">
                  ${props.sbtn_loss?.sbtn_loss_stat || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <!-- High Risk Datasets (if available) -->
          ${props.overall_compliance?.high_risk_datasets && props.overall_compliance.high_risk_datasets.length > 0 ? `
          <div style="
            background: rgba(220, 38, 38, 0.2);
            border: 1px solid rgba(220, 38, 38, 0.3);
            border-radius: 8px;
            padding: 12px;
            margin-top: 15px;
          ">
            <div style="
              display: flex;
              align-items: center;
              margin-bottom: 8px;
              font-weight: 600;
              font-size: 13px;
              color: #fca5a5;
            ">
              <span style="margin-right: 6px;">⚠️</span>
              High Risk Datasets
            </div>
            <div style="font-size: 12px; line-height: 1.4;">
              ${props.overall_compliance.high_risk_datasets.join(', ')}
            </div>
          </div>
          ` : ''}
        </div>

        <!-- Footer -->
        <div style="
          background: rgba(0,0,0,0.2);
          padding: 12px 20px;
          text-align: center;
          font-size: 11px;
          opacity: 0.8;
        ">
          Click for detailed analysis
        </div>
      </div>
    `;
    
    layer.bindPopup(popupContent, {
      maxWidth: 400,
      className: 'modern-popup'
    });
  }

  showFeatureInfo(feature) {
    const featureInfoDiv = document.getElementById('featureInfo');
    const props = feature.properties || {};
    
    // Key properties to display for new API format
    const keyProps = [
      { key: 'plot_id', label: 'Plot ID' },
      { key: 'country_name', label: 'Country' },
      { key: 'total_area_hectares', label: 'Area (ha)', format: (val) => val ? val.toFixed(2) : 'N/A' },
      { key: 'overall_compliance.overall_risk', label: 'Overall Risk', accessor: (props) => props.overall_compliance?.overall_risk },
      { key: 'overall_compliance.compliance_status', label: 'Compliance Status', accessor: (props) => props.overall_compliance?.compliance_status },
      { key: 'gfw_loss.gfw_loss_stat', label: 'GFW Loss', accessor: (props) => props.gfw_loss?.gfw_loss_stat },
      { key: 'jrc_loss.jrc_loss_stat', label: 'JRC Loss', accessor: (props) => props.jrc_loss?.jrc_loss_stat },
      { key: 'sbtn_loss.sbtn_loss_stat', label: 'SBTN Loss', accessor: (props) => props.sbtn_loss?.sbtn_loss_stat }
    ];

    let infoHTML = `<h4>Feature Details</h4>`;
    keyProps.forEach(prop => {
      let value;
      if (prop.accessor) {
        value = prop.accessor(props);
      } else {
        value = props[prop.key];
      }
      const displayValue = prop.format ? prop.format(value) : (value || 'N/A');
      infoHTML += `
        <div class="property">
          <span class="key">${prop.label}:</span>
          <span class="value">${displayValue}</span>
        </div>
      `;
    });

    featureInfoDiv.innerHTML = infoHTML;
  }

  updateFeatureCount(count) {
    const header = document.querySelector('.header h1');
    header.textContent = `EUDR Map Viewer (${count} features)`;
  }

  showLoading(show) {
    const loading = document.getElementById('loading');
    loading.style.display = show ? 'block' : 'none';
  }

  showError(message) {
    const error = document.getElementById('error');
    error.textContent = message;
    error.style.display = 'block';
    
    // Hide error after 5 seconds
    setTimeout(() => {
      error.style.display = 'none';
    }, 5000);
  }

  addRiskIcons(features) {
    // Remove existing risk icons layer if it exists
    if (this.riskIconsLayer) {
      this.map.removeLayer(this.riskIconsLayer);
    }

    // Create a new layer group for risk icons
    this.riskIconsLayer = L.layerGroup().addTo(this.map);

    features.forEach(feature => {
      const props = feature.properties || {};
      const riskLevel = props.overall_compliance?.overall_risk;
      
      // Only add icons for high and low risk polygons
      if (riskLevel === 'high' || riskLevel === 'low') {
        const centroid = this.getPolygonCentroid(feature);
        if (centroid) {
          const icon = this.createRiskIcon(riskLevel);
          const marker = L.marker(centroid, { icon: icon })
            .addTo(this.riskIconsLayer);
          
          // Add click handler to fit bounds to polygon and show popup
          marker.on('click', () => {
            this.fitBoundsToFeature(feature);
            this.showFeatureInfo(feature);
          });

          // Add tooltip with basic info and click instruction
          const tooltipContent = `
            <div style="text-align: center; font-weight: bold;">
              ${riskLevel === 'high' ? '⚠️ HIGH RISK' : '✅ LOW RISK'}<br>
              Plot: ${props.plot_id || 'N/A'}<br>
              <small style="opacity: 0.8; font-weight: normal;">Click to zoom to polygon</small>
            </div>
          `;
          marker.bindTooltip(tooltipContent, {
            permanent: false,
            direction: 'top',
            className: 'risk-tooltip'
          });
        }
      }
    });

    // Update icon sizes when zoom changes
    this.map.on('zoomend', () => {
      this.updateIconSizes();
    });
  }

  getPolygonCentroid(feature) {
    try {
      if (feature.geometry.type === 'Polygon') {
        const coordinates = feature.geometry.coordinates[0];
        let x = 0, y = 0, area = 0;
        
        for (let i = 0, j = coordinates.length - 1; i < coordinates.length; j = i++) {
          const xi = coordinates[i][0], yi = coordinates[i][1];
          const xj = coordinates[j][0], yj = coordinates[j][1];
          const a = xi * yj - xj * yi;
          area += a;
          x += (xi + xj) * a;
          y += (yi + yj) * a;
        }
        
        area *= 0.5;
        return [y / (6 * area), x / (6 * area)];
      } else if (feature.geometry.type === 'MultiPolygon') {
        // For MultiPolygon, use the centroid of the largest polygon
        let largestArea = 0;
        let largestPolygon = null;
        
        feature.geometry.coordinates.forEach(polygon => {
          const tempFeature = {
            geometry: { type: 'Polygon', coordinates: polygon }
          };
          const centroid = this.getPolygonCentroid(tempFeature);
          if (centroid) {
            // Simple area calculation for comparison
            const coordinates = polygon[0];
            let area = 0;
            for (let i = 0, j = coordinates.length - 1; i < coordinates.length; j = i++) {
              area += (coordinates[j][0] + coordinates[i][0]) * (coordinates[j][1] - coordinates[i][1]);
            }
            area = Math.abs(area) / 2;
            
            if (area > largestArea) {
              largestArea = area;
              largestPolygon = tempFeature;
            }
          }
        });
        
        return largestPolygon ? this.getPolygonCentroid(largestPolygon) : null;
      }
    } catch (error) {
      console.error('Error calculating centroid:', error);
      return null;
    }
  }

  createRiskIcon(riskLevel) {
    const zoom = this.map.getZoom();
    const baseSize = this.getIconSizeForZoom(zoom);
    
    const iconConfig = {
      high: {
        color: '#dc2626', // Red for high risk
        borderColor: '#991b1b',
        icon: '⚠️'
      },
      low: {
        color: '#10b981', // Green for low risk  
        borderColor: '#047857',
        icon: '✅'
      }
    };
    
    const config = iconConfig[riskLevel];
    
    return L.divIcon({
      className: 'risk-icon',
      html: `
        <div style="
          width: ${baseSize}px;
          height: ${baseSize}px;
          background-color: ${config.color};
          border: 3px solid ${config.borderColor};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${baseSize * 0.4}px;
          color: white;
          font-weight: bold;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          animation: ${riskLevel === 'high' ? 'pulse-red 2s infinite' : 'pulse-green 3s infinite'};
        " 
        onmouseover="this.style.transform='scale(1.2)'; this.style.zIndex='9999'; this.style.animation='none';"
        onmouseout="this.style.transform='scale(1)'; this.style.zIndex='auto'; this.style.animation='${riskLevel === 'high' ? 'pulse-red 2s infinite' : 'pulse-green 3s infinite'}';"
        >
          <span style="
            text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          ">
            ${config.icon}
          </span>
        </div>
      `,
      iconSize: [baseSize, baseSize],
      iconAnchor: [baseSize/2, baseSize/2],
      popupAnchor: [0, -baseSize/2]
    });
  }

  getIconSizeForZoom(zoom) {
    // Responsive icon size based on zoom level
    if (zoom >= 15) return 40;      // Very close zoom - large icons
    if (zoom >= 12) return 32;      // Close zoom - medium-large icons
    if (zoom >= 10) return 26;      // Medium zoom - medium icons
    if (zoom >= 8) return 22;       // Default zoom - small-medium icons
    if (zoom >= 6) return 18;       // Far zoom - small icons
    return 16;                      // Very far zoom - very small icons
  }

  updateIconSizes() {
    if (this.riskIconsLayer) {
      this.riskIconsLayer.eachLayer(marker => {
        const currentIcon = marker.getIcon();
        const zoom = this.map.getZoom();
        const newSize = this.getIconSizeForZoom(zoom);
        
        // Extract risk level from current icon HTML
        const isHighRisk = currentIcon.options.html.includes('#dc2626');
        const riskLevel = isHighRisk ? 'high' : 'low';
        
        // Create new icon with updated size
        const newIcon = this.createRiskIcon(riskLevel);
        marker.setIcon(newIcon);
      });
    }
  }

  fitBoundsToFeature(feature) {
    try {
      // Create a temporary GeoJSON layer for this feature to get its bounds
      const tempLayer = L.geoJSON(feature);
      const bounds = tempLayer.getBounds();
      
      // Fit the map to the feature bounds with some padding
      this.map.fitBounds(bounds, {
        padding: [20, 20], // Add 20px padding on all sides
        maxZoom: 16 // Limit maximum zoom level for better view
      });
      
      // Optional: Highlight the polygon temporarily
      this.highlightPolygon(feature);
      
    } catch (error) {
      console.error('Error fitting bounds to feature:', error);
    }
  }

  highlightPolygon(feature) {
    // Find the corresponding layer in geojsonLayer and highlight it temporarily
    if (this.geojsonLayer) {
      this.geojsonLayer.eachLayer(layer => {
        if (layer.feature === feature) {
          // Store original style
          const originalStyle = {
            weight: layer.options.weight,
            color: layer.options.color,
            opacity: layer.options.opacity
          };
          
          // Apply highlight style
          layer.setStyle({
            weight: 5,
            color: '#ffffff',
            opacity: 1
          });
          
          // Reset style after 2 seconds
          setTimeout(() => {
            layer.setStyle(originalStyle);
          }, 2000);
        }
      });
    }
  }
}

// Global variable for HTML access
let mapViewer;

// Initialize map viewer when page loads
document.addEventListener('DOMContentLoaded', () => {
  mapViewer = new WhispMapViewer();
});
