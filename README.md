# Global Climate Solution

A comprehensive geospatial analysis tool designed to support zero-deforestation regulation claims and compliance monitoring.

## 🌟 Features

### 🔐 **Authentication System**
- Secure login with localStorage persistence
- 24-hour auto-logout for security
- Professional glass morphism design

### 🗺️ **Interactive Map Viewer**
- Leaflet.js integration with multiple base layers
- Real-time overlay layers for deforestation analysis
- Layer controls with opacity adjustment
- Modern popup displays with compliance data

### 📊 **Compliance Analysis**
- **EUDR (EU Deforestation Regulation)** - Active compliance checking
- **Rainforest Alliance** - Sustainable Agriculture Certification (Under Development)
- **Forest Stewardship Council (FSC)** - Responsible Forest Management (Under Development)

### 💳 **Subscription Plans**
- **Basic Plan**: $0/month - 10 requests per month
- **Pro Plan**: $25/month - 1,000 requests per month (Featured)
- **Ultra Plan**: $100/month - Unlimited requests with custom integrations

### 📁 **Data Management**
- File upload support (.txt, .json, .geojson)
- Drag & drop interface
- CSV and GeoJSON export functionality
- Example data download from Google Drive

### 🎨 **Modern UI/UX**
- Dark theme with gradient backgrounds
- Responsive design for mobile and desktop
- Glass morphism effects
- Professional navigation with dropdowns

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/ugadimas25/global-comp.git
   cd global-comp
   ```

2. **Open in a web server**
   - Use Live Server extension in VS Code, or
   - Python: `python -m http.server 8080`
   - Node.js: `npx serve .`

3. **Access the application**
   - Navigate to `http://localhost:8080/login.html`
   - Use default credentials to login

## 📂 Project Structure

```
global-comp/
├── index.html              # Main dashboard
├── login.html              # Authentication page
├── map.html                # Map viewer interface
├── rainforest-alliance.html # Rainforest Alliance compliance page
├── fsc.html                # FSC compliance page
├── js/
│   ├── submit-page.js      # Main application logic
│   └── map-viewer.js       # Map visualization and controls
├── example_geojson_20_plots.json # Sample data
└── README.md
```

## 🔧 Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Mapping**: Leaflet.js
- **Authentication**: localStorage-based session management
- **Styling**: Modern CSS with gradients and glass morphism
- **Data Formats**: GeoJSON, CSV, WKT

## 🗺️ Map Layers

### Forest Coverage Layers
- **EUFO 2020** - European Forest Observatory data
- **Primary Forest 2020** - Primary forest coverage
- **SBTN Natural Lands** - Science-based targets network data

### Deforestation Analysis Layers
- **GLAD Primary 2021-2024** - Global Land Analysis & Discovery
- **SBTN Deforestation 2021-2024** - Science-based deforestation data
- **JRC Deforestation 2021-2024** - Joint Research Centre data

## 📊 Compliance Features

### Risk Assessment
- **High Risk**: Areas with significant deforestation alerts
- **Medium Risk**: Areas with moderate risk indicators
- **Low Risk**: Areas with minimal compliance concerns

### Data Sources
- Global Forest Watch (GFW)
- Joint Research Centre (JRC)
- Science-Based Targets Network (SBTN)
- GLAD (Global Land Analysis & Discovery)

## 🔄 API Integration

The application integrates with:
- **Primary API**: `https://gis-development.koltivaapi.com`
- **Backup API**: `http://localhost:8000` (for development)

## 💡 Usage

1. **Login** using the authentication system
2. **Select Compliance Type** from the dropdown (EUDR, Rainforest Alliance, FSC)
3. **Upload Data** via drag & drop or file selection
4. **Analyze** the uploaded geometry data
5. **View Results** in the interactive map
6. **Export Data** as CSV or GeoJSON
7. **Subscribe** to unlock higher usage limits

## 🔐 Authentication

Default login credentials:
- Multiple user accounts supported
- Session management with auto-logout
- Secure localStorage implementation

## 📱 Responsive Design

- Mobile-friendly interface
- Tablet optimization
- Desktop full-feature experience
- Touch-friendly controls

## 🎯 Compliance Standards

### EUDR (EU Deforestation Regulation)
- Real-time compliance checking
- Risk assessment algorithms
- Automated reporting

### Rainforest Alliance (Under Development)
- Sustainable agriculture certification
- Supply chain transparency
- Environmental impact assessment

### FSC (Under Development)
- Responsible forest management
- Chain of custody compliance
- Forest health monitoring

## 🛠️ Development

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📧 Contact

- **Developer**: ugadimas25
- **Email**: ugadimas@gmail.com
- **Repository**: [global-comp](https://github.com/ugadimas25/global-comp)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 Acknowledgments

- OpenStreetMap for base map data
- Leaflet.js for mapping functionality
- European Space Agency for forest data
- Global Forest Watch for deforestation alerts

---

*Built with ❤️ for sustainable forest management and compliance monitoring*
