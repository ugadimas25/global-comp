// Submit Page Module
class WhispSubmitPage {
  constructor() {
    this.dropZone = document.getElementById("dropZone");
    this.fileInput = document.getElementById("fileInput");
    this.currentResults = null;
    this.init();
  }

  init() {
    this.initFileHandlers();
    this.loadStoredResults();
    this.initDropdownHandlers();
  }

  initDropdownHandlers() {
    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
      const dropdown = document.querySelector('.download-dropdown');
      const menu = document.getElementById('downloadMenu');
      
      if (dropdown && menu && !dropdown.contains(event.target)) {
        menu.style.display = 'none';
      }
    });
  }

  loadStoredResults() {
    // Check if there are stored results from previous analysis
    const storedResults = localStorage.getItem('whispAnalysisResults');
    const storedFileName = localStorage.getItem('whispAnalysisFileName');
    
    if (storedResults && storedFileName) {
      try {
        this.currentResults = JSON.parse(storedResults);
        this.displayResults(this.currentResults);
        
        // Update drop zone to show the previously uploaded file
        this.dropZone.innerHTML = `📄 File uploaded: ${storedFileName}`;
        
        console.log('Loaded stored results:', this.currentResults);
      } catch (error) {
        console.error('Error loading stored results:', error);
        // Clear corrupted data
        localStorage.removeItem('whispAnalysisResults');
        localStorage.removeItem('whispAnalysisFileName');
      }
    }
  }

  initFileHandlers() {
    this.dropZone.addEventListener("click", () => this.fileInput.click());

    this.dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      this.dropZone.style.borderColor = "#4da6ff";
    });

    this.dropZone.addEventListener("dragleave", () => {
      this.dropZone.style.borderColor = "#555";
    });

    this.dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      this.dropZone.style.borderColor = "#555";
      const file = e.dataTransfer.files[0];
      this.handleFile(file);
    });

    this.fileInput.addEventListener("change", () => {
      const file = this.fileInput.files[0];
      this.handleFile(file);
    });
  }

  handleFile(file) {
    if (!file) return;
    const validTypes = ['application/json', 'application/geo+json', 'text/plain'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.geojson')) {
      alert("Invalid file type.");
      return;
    }
    this.dropZone.innerHTML = `📄 File uploaded: ${file.name}`;
  }

  clearUpload() {
    this.dropZone.innerHTML = 'Drag or click to upload a file<br/><small>Only .txt, .json and .geojson files are accepted.</small>';
    this.fileInput.value = "";
    
    // Remove results if any
    const resultsDiv = document.getElementById('results');
    if (resultsDiv) {
      resultsDiv.remove();
    }
    
    // Reset container size
    const container = document.querySelector('.container');
    container.classList.remove('expanded');

    // Clear current results and stored data
    this.currentResults = null;
    localStorage.removeItem('whispAnalysisResults');
    localStorage.removeItem('whispAnalysisFileName');
  }

  async analyzeUpload() {
    if (!this.fileInput.files.length) {
      alert("Please upload a file first.");
      return;
    }

    const file = this.fileInput.files[0];
    const apiUrl = "https://eudr-multilayer-api.fly.dev/api/v1/upload-geojson"; // Updated API endpoint
    
    // Show loading state
    const analyzeButton = document.querySelector('.analyze');
    const originalText = analyzeButton.textContent;
    analyzeButton.textContent = "Analyzing...";
    analyzeButton.disabled = true;

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);

      // Send request to API
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Success:', data);
      alert("Analysis completed successfully!");
      
      // Store results for map viewing and persistence
      this.currentResults = data;
      
      // Save to localStorage for persistence when navigating back
      localStorage.setItem('whispAnalysisResults', JSON.stringify(data));
      localStorage.setItem('whispAnalysisFileName', file.name);
      
      this.displayResults(data);

    } catch (error) {
      console.error('Error:', error);
      alert(`Analysis failed: ${error.message}`);
    } finally {
      // Reset button state
      analyzeButton.textContent = originalText;
      analyzeButton.disabled = false;
    }
  }

  displayResults(data) {
    // Create or update results section
    let resultsDiv = document.getElementById('results');
    if (!resultsDiv) {
      resultsDiv = document.createElement('div');
      resultsDiv.id = 'results';
      resultsDiv.className = 'results-container';
      document.querySelector('.submit-box').appendChild(resultsDiv);
    }
    
    // Extract features from the response based on new API structure
    console.log('Full API response:', data);
    console.log('Type of data:', typeof data);
    console.log('Is data an array?', Array.isArray(data));
    
    let features = [];
    
    // Try different ways to extract features based on new API response structure
    if (data && data.data && data.data.features && Array.isArray(data.data.features)) {
      features = data.data.features;
    } else if (data && data.result && data.result.features && Array.isArray(data.result.features)) {
      features = data.result.features;
    } else if (Array.isArray(data)) {
      features = data;
    } else if (data && Array.isArray(data.features)) {
      features = data.features;
    } else if (data && typeof data === 'object') {
      // If it's an object but not an array, wrap it
      features = [data];
    }
    
    console.log('Features found:', features.length);
    console.log('Features array:', features);
    
    if (features.length > 0) {
      console.log('First feature properties:', features[0].properties || features[0]);
      console.log('All property names in first feature:', Object.keys(features[0].properties || features[0]));
      
      // Log each feature individually to see structure
      features.forEach((feature, idx) => {
        const props = feature.properties || feature || {};
        console.log(`Feature ${idx} properties:`, props);
        console.log(`Feature ${idx} all keys:`, Object.keys(props));
      });
    }
    
    resultsDiv.innerHTML = `
      <div class="results-header">
        <div class="results-title">Results (${features.length} records)</div>
        <div class="results-buttons">
          <button class="view-map-btn" onclick="submitPage.viewInWhispMap()">View in Whisp Map</button>
          <div class="download-dropdown">
            <button class="download-btn" onclick="submitPage.toggleDownloadMenu()">Download ▼</button>
            <div class="download-menu" id="downloadMenu" style="display: none;">
              <button onclick="submitPage.downloadCSV()">📄 CSV Format</button>
              <button onclick="submitPage.downloadGeoJSON()">🗺️ GeoJSON Format</button>
            </div>
          </div>
        </div>
      </div>
      
        <table class="results-table">
          <thead>
            <tr>
              <th>PLOT ID</th>
              <th>COUNTRY</th>
              <th>AREA (ha)</th>
              <th>OVERALL RISK</th>
              <th>COMPLIANCE STATUS</th>
              <th>GFW LOSS</th>
              <th>JRC LOSS</th>
              <th>SBTN LOSS</th>
              <th>HIGH RISK DATASETS</th>
            </tr>
          </thead>
          <tbody>
            ${Array.isArray(features) ? features.map((feature, index) => {
              // Handle new API response format
              const props = feature.properties || feature || {};
              console.log('Processing feature', index, ':', props);
              
              // Extract data based on new API structure
              const plotId = props.plot_id || index + 1;
              const country = props.country_name || 'N/A';
              const area = props.total_area_hectares ? props.total_area_hectares.toFixed(2) : 'N/A';
              const overallRisk = props.overall_compliance?.overall_risk || 'N/A';
              const complianceStatus = props.overall_compliance?.compliance_status || 'N/A';
              const gfwLoss = props.gfw_loss?.gfw_loss_stat || 'N/A';
              const jrcLoss = props.jrc_loss?.jrc_loss_stat || 'N/A';
              const sbtnLoss = props.sbtn_loss?.sbtn_loss_stat || 'N/A';
              const highRiskDatasets = props.overall_compliance?.high_risk_datasets ? 
                props.overall_compliance.high_risk_datasets.join(', ') : 'None';
              
              return `
                <tr>
                  <td>${plotId}</td>
                  <td>${country}</td>
                  <td>${area}</td>
                  <td><span class="risk-badge risk-${overallRisk}">${overallRisk}</span></td>
                  <td><span class="compliance-badge compliance-${complianceStatus.toLowerCase()}">${complianceStatus}</span></td>
                  <td><span class="loss-badge loss-${gfwLoss}">${gfwLoss}</span></td>
                  <td><span class="loss-badge loss-${jrcLoss}">${jrcLoss}</span></td>
                  <td><span class="loss-badge loss-${sbtnLoss}">${sbtnLoss}</span></td>
                  <td style="font-size: 10px;">${highRiskDatasets}</td>
                </tr>
              `;
            }).join('') : '<tr><td colspan="9">No data available</td></tr>'}
          </tbody>
        </table>      <div class="pagination">
        <div>Rows per page: 
          <select style="background-color: #3a3a3a; color: #ccc; border: none; padding: 2px;">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
        </div>
        <div>Page 1 of ${Math.ceil(features.length / 10)}</div>
        <div class="pagination-controls">
          <button>&lt;&lt;</button>
          <button>&lt;</button>
          <button class="active">1</button>
          <button>&gt;</button>
          <button>&gt;&gt;</button>
        </div>
      </div>
    `;
    
    // Expand container when results are shown
    const container = document.querySelector('.container');
    container.classList.add('expanded');
  }

  viewInWhispMap() {
    if (!this.currentResults) {
      alert("No analysis results available. Please analyze a file first.");
      return;
    }

    // Save current results to localStorage before navigating
    localStorage.setItem('whispAnalysisResults', JSON.stringify(this.currentResults));
    
    // Encode the results data for URL transmission
    const encodedData = encodeURIComponent(JSON.stringify(this.currentResults));
    
    // Open map page in new tab with data
    const mapUrl = `map.html?data=${encodedData}`;
    window.open(mapUrl, '_blank');
  }

  toggleDownloadMenu() {
    const menu = document.getElementById('downloadMenu');
    if (menu.style.display === 'none') {
      menu.style.display = 'block';
    } else {
      menu.style.display = 'none';
    }
  }

  downloadCSV() {
    if (!this.currentResults) {
      alert("No results to download");
      return;
    }

    // Hide download menu
    document.getElementById('downloadMenu').style.display = 'none';

    // Extract features from current results
    let features = [];
    if (this.currentResults && this.currentResults.data && this.currentResults.data.features) {
      features = this.currentResults.data.features;
    } else if (this.currentResults && this.currentResults.result && this.currentResults.result.features) {
      features = this.currentResults.result.features;
    } else if (Array.isArray(this.currentResults)) {
      features = this.currentResults;
    } else if (this.currentResults && Array.isArray(this.currentResults.features)) {
      features = this.currentResults.features;
    }

    // Create CSV content
    const headers = ['ProducerName', 'ProducerCountry', 'ProductionPlace', 'ComplianceStatus', 'Area', 'Geometry'];
    let csv = headers.join(',') + '\n';

    features.forEach((feature, index) => {
      const props = feature.properties || feature || {};
      
      // Extract data with default values
      const producerName = 'Company A'; // Static as requested
      const producerCountry = this.getISO2CountryCode(props.country_name || 'Unknown');
      const productionPlace = props.plot_id || `PLOT-${index + 1}`;
      const complianceStatus = props.overall_compliance?.compliance_status || 'Unknown';
      const area = props.total_area_hectares || 0;
      
      // Convert geometry to string (simplified)
      let geometryStr = '';
      if (feature.geometry) {
        geometryStr = JSON.stringify(feature.geometry).replace(/"/g, '""'); // Escape quotes for CSV
      }

      const row = [
        producerName,
        producerCountry,
        productionPlace,
        complianceStatus,
        area,
        `"${geometryStr}"` // Wrap geometry in quotes
      ];
      
      csv += row.join(',') + '\n';
    });

    // Download CSV
    this.downloadFile(csv, 'eudr_analysis_results.csv', 'text/csv');
  }

  downloadGeoJSON() {
    if (!this.currentResults) {
      alert("No results to download");
      return;
    }

    // Hide download menu
    document.getElementById('downloadMenu').style.display = 'none';

    // Extract features from current results
    let features = [];
    if (this.currentResults && this.currentResults.data && this.currentResults.data.features) {
      features = this.currentResults.data.features;
    } else if (this.currentResults && this.currentResults.result && this.currentResults.result.features) {
      features = this.currentResults.result.features;
    } else if (Array.isArray(this.currentResults)) {
      features = this.currentResults;
    } else if (this.currentResults && Array.isArray(this.currentResults.features)) {
      features = this.currentResults.features;
    }

    // Create GeoJSON FeatureCollection
    const geoJson = {
      "type": "FeatureCollection",
      "features": features.map((feature, index) => {
        const props = feature.properties || feature || {};
        
        return {
          "type": "Feature",
          "properties": {
            "ProducerName": "Company A", // Static as requested
            "ProducerCountry": this.getISO2CountryCode(props.country_name || 'Unknown'),
            "ProductionPlace": props.plot_id || `PLOT-${index + 1}`,
            "Area": props.total_area_hectares || 0
          },
          "geometry": feature.geometry || {
            "type": "Point",
            "coordinates": [0, 0] // Default geometry if none exists
          }
        };
      })
    };

    // Download GeoJSON
    const geoJsonStr = JSON.stringify(geoJson, null, 2);
    this.downloadFile(geoJsonStr, 'eudr_analysis_results.geojson', 'application/geo+json');
  }

  getISO2CountryCode(countryName) {
    // Map common country names to ISO 2 codes
    const countryMap = {
      'Indonesia': 'ID',
      'Malaysia': 'MY',
      'Thailand': 'TH',
      'Singapore': 'SG',
      'Philippines': 'PH',
      'Vietnam': 'VN',
      'Myanmar': 'MM',
      'Cambodia': 'KH',
      'Laos': 'LA',
      'Brunei': 'BN',
      'Brazil': 'BR',
      'Colombia': 'CO',
      'Peru': 'PE',
      'Ecuador': 'EC',
      'Bolivia': 'BO',
      'Venezuela': 'VE',
      'Guyana': 'GY',
      'Suriname': 'SR',
      'French Guiana': 'GF',
      'Democratic Republic of the Congo': 'CD',
      'Central African Republic': 'CF',
      'Cameroon': 'CM',
      'Equatorial Guinea': 'GQ',
      'Gabon': 'GA',
      'Republic of the Congo': 'CG',
      'Chad': 'TD',
      'Sudan': 'SD',
      'South Sudan': 'SS',
      'Ethiopia': 'ET',
      'Kenya': 'KE',
      'Uganda': 'UG',
      'Tanzania': 'TZ',
      'Rwanda': 'RW',
      'Burundi': 'BI',
      'Zambia': 'ZM',
      'Malawi': 'MW',
      'Mozambique': 'MZ',
      'Zimbabwe': 'ZW',
      'Botswana': 'BW',
      'Namibia': 'NA',
      'South Africa': 'ZA',
      'Lesotho': 'LS',
      'Eswatini': 'SZ',
      'Madagascar': 'MG',
      'Mauritius': 'MU',
      'Seychelles': 'SC',
      'Comoros': 'KM'
    };
    
    return countryMap[countryName] || countryName.slice(0, 2).toUpperCase();
  }

  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  downloadResults() {
    // Keep old function for backward compatibility
    this.downloadCSV();
  }
}

// Global functions for backward compatibility
let submitPage;

function clearUpload() {
  submitPage.clearUpload();
}

function analyzeUpload() {
  submitPage.analyzeUpload();
}

function downloadExample() {
  // Google Drive direct download link
  const googleDriveFileId = '1Gm11viXA1o7JW32dyheJZeOogw7tWPoV';
  const directDownloadUrl = `https://drive.google.com/uc?export=download&id=${googleDriveFileId}`;
  
  // Create a temporary anchor element to trigger download
  const link = document.createElement('a');
  link.href = directDownloadUrl;
  link.download = 'example_geojson_20_plots.json'; // Specify the filename
  link.style.display = 'none';
  
  // Add to DOM, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Show feedback to user
  console.log('Downloading example GeoJSON file...');
  
  // Optional: Show a toast notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    z-index: 10000;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    animation: slideIn 0.3s ease-out;
  `;
  notification.innerHTML = '📥 Example file download started!';
  
  // Add slide-in animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notification);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
    if (style.parentNode) {
      style.remove();
    }
  }, 3000);
}

function logout() {
  // Clear authentication data
  localStorage.removeItem('whispLoggedIn');
  localStorage.removeItem('whispLoginTime');
  localStorage.removeItem('whispUsername');
  
  // Also clear old keys if they exist
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('loginTime');
  localStorage.removeItem('username');
  
  // Redirect to login page
  window.location.href = 'login.html';
}

// Initialize submit page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  submitPage = new WhispSubmitPage();
});
