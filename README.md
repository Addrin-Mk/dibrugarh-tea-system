# 🌿 Dibrugarh Tea Information & Analytics System

An enterprise-grade digital twin and interactive intelligence platform for the tea industry of Dibrugarh District, Assam — the "Tea Capital of India".

Built with **Node.js (Express backend)** and **React.js (Vite frontend)**.

---

## ✨ Key Features

1. **Executive Power BI Analytics Dashboard**
   - Dynamic 4-year slicer (2023, 2024, 2025, 2026 Projections).
   - District production volume, GTAC hammer prices, registered acreage, and labor workforce KPIs.
   - Sector yield breakdown (Corporate Concessions vs. Small Tea Growers).
   - Real-time CSV export.

2. **Cartographic & Satellite GIS Topography**
   - Rock-solid stationary estate concession pins across Dibrugarh West, East, Chabua, Tingkhong, Moran, and Naharkatia circles.
   - Interactive multi-color "Check Estate Details" selector.
   - High-definition photo dossiers for landmark tea estates.

3. **177 Corporate Estates Census**
   - Concessionary land ledger, grant vs. cultivated area, workforce, and factory types.
   - Searchable and exportable to CSV.

4. **Small Tea Growers (STG) Directory**
   - 29,771 registered smallholder analytics.
   - District Monitoring Committee (DMC) benchmark green leaf pricing tracker.
   - Live form to register new smallholders.

5. **The Tea Journey (Bush to Cup)**
   - 7-stage agronomic and factory manufacturing guide covering selective plucking, trough withering, orthodox/CTC rolling, fermentation, fluidized bed drying, and grading.

6. **Auction & Trade Intelligence**
   - **GTAC Auctions**: Guwahati Tea Auction Centre price discovery spreads and catalog lots.
   - **Global Exports**: Multimodal maritime (Kolkata Port) & air cargo (Mohanbari Airport) export corridors.
   - **Interstate Trade**: Pan-India domestic flow and seasonal 4-flush harvest distributions.
   - **Production Registry**: 2022–2026 historical balance sheet.

7. **Master Admin CMS Studio**
   - Live content editing of headlines, stories, and key bullet points across all 10 sections.
   - Direct Estate database editor (CRUD).
   - 2026 Macroeconomic target modifier.
   - Theme color customizer with CSS variable sync.
   - Sandboxed Node.js JavaScript execution console.

---

## 🔑 Login Credentials

| Role | Username | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Field Operator** | `ABCD` | `11111` | Full Analytics, GIS Map, Census, STG Roster, Trade Views |
| **Master Administrator** | `Admin` | `123` | Full Operator Views + **Master Admin CMS Studio** |

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (bundled with Node.js)

### Installation & Launch

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/dibrugarh-tea-system.git
   cd dibrugarh-tea-system
   ```

2. **Install dependencies**:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Run the Application**:

   - **Option A: Run concurrently from workspace root**:
     ```bash
     npm run dev
     ```

   - **Option B: Run in separate terminals**:
     ```bash
     # Terminal 1: Backend API (Port 5000)
     cd server
     node server.js

     # Terminal 2: Frontend (Port 5173)
     cd client
     npm run dev
     ```

4. Open your browser at **`http://localhost:5173`**.
