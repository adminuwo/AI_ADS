const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const pdfOutputPath1 = 'c:/Users/uwo24/Desktop/AI ADS/Project_Documents/AI_ADS_Technical_Design_Codebase_Documentation.pdf';
const pdfOutputPath2 = 'c:/Users/uwo24/Desktop/AI ADS/Project_Documents/docs/AI_ADS_Technical_Design_Codebase_Documentation.pdf';

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Technical Design & Codebase Documentation - AI Ads Enterprise Platform</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

    @page {
      size: A4;
      margin: 20mm 15mm 20mm 15mm;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #0f172a;
      background-color: #ffffff;
      line-height: 1.5;
      font-size: 9.5pt;
      margin: 0;
      padding: 0;
    }

    /* Page Breaks */
    .page-break {
      page-break-before: always;
    }

    .avoid-break {
      page-break-inside: avoid;
    }

    /* Cover Page */
    .cover-page {
      height: 250mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 12mm 8mm;
      border: 2px solid #0f172a;
      border-radius: 8px;
      position: relative;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #ffffff;
    }

    .cover-header {
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 20px;
    }

    .cover-badge {
      display: inline-block;
      background: #1e3a8a;
      color: #93c5fd;
      font-weight: 700;
      font-size: 8.5pt;
      padding: 4px 14px;
      border-radius: 20px;
      border: 1px solid #3b82f6;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 18px;
    }

    .cover-title {
      font-size: 26pt;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.15;
      margin: 0 0 12px 0;
      letter-spacing: -0.5px;
    }

    .cover-subtitle {
      font-size: 13.5pt;
      font-weight: 400;
      color: #cbd5e1;
      margin: 0;
    }

    .cover-body {
      margin: 30px 0;
    }

    .cover-desc {
      font-size: 10pt;
      color: #e2e8f0;
      line-height: 1.6;
      background: rgba(255, 255, 255, 0.05);
      padding: 20px;
      border-radius: 6px;
      border-left: 4px solid #3b82f6;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 25px;
    }

    .meta-card {
      background: rgba(255, 255, 255, 0.08);
      padding: 12px 16px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .meta-card .label {
      font-size: 7.5pt;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }

    .meta-card .value {
      font-size: 9.5pt;
      font-weight: 600;
      color: #ffffff;
    }

    .cover-footer {
      border-top: 1px solid #334155;
      padding-top: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8.5pt;
      color: #94a3b8;
    }

    /* Headings & Typography */
    h1 {
      font-size: 15pt;
      font-weight: 700;
      color: #0f172a;
      border-bottom: 2px solid #cbd5e1;
      padding-bottom: 6px;
      margin-top: 24px;
      margin-bottom: 12px;
      letter-spacing: -0.3px;
    }

    h2 {
      font-size: 12pt;
      font-weight: 600;
      color: #1e3a8a;
      margin-top: 18px;
      margin-bottom: 8px;
    }

    h3 {
      font-size: 10pt;
      font-weight: 600;
      color: #334155;
      margin-top: 14px;
      margin-bottom: 6px;
    }

    p {
      margin-top: 0;
      margin-bottom: 10px;
      color: #334155;
      text-align: justify;
    }

    ul, ol {
      margin-top: 0;
      margin-bottom: 10px;
      padding-left: 20px;
      color: #334155;
    }

    li {
      margin-bottom: 4px;
    }

    code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8.5pt;
      background-color: #f1f5f9;
      color: #0f172a;
      padding: 2px 5px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }

    pre {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      background-color: #0f172a;
      color: #f8fafc;
      padding: 12px;
      border-radius: 6px;
      overflow-x: auto;
      margin-top: 8px;
      margin-bottom: 14px;
      line-height: 1.4;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
      margin-bottom: 14px;
      font-size: 8.5pt;
      page-break-inside: auto;
    }

    tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }

    th {
      background-color: #0f172a;
      color: #ffffff;
      font-weight: 600;
      text-align: left;
      padding: 7px 10px;
      border: 1px solid #334155;
      font-size: 8pt;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    td {
      padding: 6px 10px;
      border: 1px solid #cbd5e1;
      color: #334155;
      vertical-align: top;
    }

    tr:nth-child(even) td {
      background-color: #f8fafc;
    }

    /* Badges & Callouts */
    .badge {
      display: inline-block;
      font-size: 7.5pt;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .badge-blue { background: #dbeafe; color: #1e40af; }
    .badge-green { background: #dcfce7; color: #166534; }
    .badge-purple { background: #f3e8ff; color: #6b21a8; }
    .badge-amber { background: #fef3c7; color: #92400e; }
    .badge-red { background: #fee2e2; color: #991b1b; }

    .callout {
      background-color: #eff6ff;
      border-left: 4px solid #2563eb;
      padding: 10px 14px;
      border-radius: 0 6px 6px 0;
      margin: 12px 0;
      font-size: 9pt;
    }

    .callout-warning {
      background-color: #fffbeb;
      border-left-color: #f59e0b;
    }

    .callout-title {
      font-weight: 700;
      color: #1e40af;
      margin-bottom: 3px;
    }

    .callout-warning .callout-title {
      color: #b45309;
    }

    /* TOC */
    .toc-list {
      list-style: none;
      padding-left: 0;
    }

    .toc-item {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px dotted #cbd5e1;
      font-size: 9pt;
    }

    .toc-title {
      font-weight: 600;
      color: #0f172a;
    }

    .toc-num {
      font-weight: 600;
      color: #2563eb;
    }
  </style>
</head>
<body>

  <!-- COVER PAGE -->
  <div class="cover-page">
    <div class="cover-header">
      <span class="cover-badge">Verified Technical Documentation</span>
      <h1 class="cover-title">TECHNICAL DESIGN & CODEBASE DOCUMENTATION</h1>
      <div class="cover-subtitle">AI Ads™ Enterprise Platform (v2.0)</div>
    </div>

    <div class="cover-body">
      <div class="cover-desc">
        This document provides comprehensive technical design specifications, codebase folder structure references, component hierarchies, state management flows, API service implementations, database schemas, coding conventions, and setup instructions for the <strong>AI Ads™ Enterprise Platform</strong>. All path references, dependency tables, and code snippets are verified directly from the production repository.
      </div>

      <div class="meta-grid">
        <div class="meta-card">
          <div class="label">Document ID</div>
          <div class="value">TDC-AIADS-2026-V2.0</div>
        </div>
        <div class="meta-card">
          <div class="label">System Version</div>
          <div class="value">v2.0.0 (Node / React / GCP Cloud Run)</div>
        </div>
        <div class="meta-card">
          <div class="label">Author / Organization</div>
          <div class="value">AI Ads Core Engineering Team</div>
        </div>
        <div class="meta-card">
          <div class="label">Target Infrastructure</div>
          <div class="value">GCP Cloud Run / Node Express / React SPA</div>
        </div>
        <div class="meta-card">
          <div class="label">Date of Issue</div>
          <div class="value">October 10, 2026</div>
        </div>
        <div class="meta-card">
          <div class="label">Verification Status</div>
          <div class="value"><span class="badge badge-green">SOURCE CODE VERIFIED</span></div>
        </div>
      </div>
    </div>

    <div class="cover-footer">
      <div>AI Ads™ Platform &copy; 2026. All Rights Reserved.</div>
      <div>Confidential Technical Codebase Documentation</div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- TABLE OF CONTENTS -->
  <h1>Table of Contents</h1>
  <div class="toc-list">
    <div class="toc-item"><span class="toc-title">1. Project Folder Structure & Directory Responsibilities</span><span class="toc-num">Section 1</span></div>
    <div class="toc-item"><span class="toc-title">2. Technology Stack & Technical Dependencies</span><span class="toc-num">Section 2</span></div>
    <div class="toc-item"><span class="toc-title">3. Frontend, Mobile & Backend Code Organization</span><span class="toc-num">Section 3</span></div>
    <div class="toc-item"><span class="toc-title">4. Key Components, Screens, Services & Contexts</span><span class="toc-num">Section 4</span></div>
    <div class="toc-item"><span class="toc-title">5. State Management, Routing & Navigation Architecture</span><span class="toc-num">Section 5</span></div>
    <div class="toc-item"><span class="toc-title">6. API Client Layer, Authentication & Error Handling</span><span class="toc-num">Section 6</span></div>
    <div class="toc-item"><span class="toc-title">7. Database Integration & Data Model Specifications</span><span class="toc-num">Section 7</span></div>
    <div class="toc-item"><span class="toc-title">8. Coding Standards, Design System & Reusable Components</span><span class="toc-num">Section 8</span></div>
    <div class="toc-item"><span class="toc-title">9. Environment Configuration & Deployment Setup</span><span class="toc-num">Section 9</span></div>
    <div class="toc-item"><span class="toc-title">10. Technical Dependencies & Known Limitations</span><span class="toc-num">Section 10</span></div>
  </div>

  <div class="callout" style="margin-top: 20px;">
    <div class="callout-title">SOURCE CODE TRUTH DIRECTIVE</div>
    All file paths, exported function signatures, React hooks, Mongoose schemas, and package version numbers in this specification have been directly inspected from the project repository. Unverified assumptions have been omitted.
  </div>

  <!-- SECTION 1 -->
  <h1>1. Project Folder Structure & Directory Responsibilities</h1>

  <h2>1.1 Monorepo Top-Level Layout</h2>
  <pre>
AI_ADS/
├── backend/                  # Express REST API, Multi-Model AI Orchestrator & Scraper
│   ├── config/               # Database connectivity (db.js) & Vertex AI initialization
│   ├── controllers/          # Request handlers (adminController, brandController, chatController)
│   ├── middleware/           # Auth verification middleware (auth.js)
│   ├── models/               # 16 Mongoose data models (User, Workspace, BrandProfile, etc.)
│   ├── modules/              # Sub-agents (brandDnaAgent, websiteBuilder, workspace, seo, creative)
│   ├── routes/               # Express routing endpoints (accountRoutes, adminRoutes, brandRoutes, etc.)
│   ├── services/             # Core logic services (aiService, brandImageAgent, scraperService, etc.)
│   ├── package.json          # Node backend dependencies & scripts
│   └── server.js             # Express unified application entry point
├── frontend/                 # React SPA + Vite Frontend Client
│   ├── public/               # Static assets & favicons
│   ├── src/                  # React application source code
│   │   ├── components/       # Layouts, modules (BrandDnaModule, CreativeStudioModule), modals
│   │   ├── config/           # API Base URL configuration (api.js)
│   │   ├── context/          # React Context Hub (WorkspaceContext.jsx)
│   │   ├── features/         # Feature views (websiteBuilder, admin, strategy, seo, etc.)
│   │   ├── services/         # API client layer (api.js, telemetryClient.js)
│   │   ├── utils/            # Helper modules (normalizeBrandDna.js, imageCompositor.js)
│   │   ├── App.jsx           # Top-level React App routing view
│   │   └── main.jsx          # Vite React entry point
│   ├── package.json          # Frontend Vite & React dependencies
│   └── vite.config.js        # Vite proxy configuration & build settings
├── Dockerfile                # Single-service GCP Cloud Run container definition
├── DEPLOYMENT_GUIDE.md       # GCP Cloud Run deployment instructions
└── PLATFORM_FEATURES_AND_PRICING_MASTER.md # Master feature & pricing mapping
  </pre>

  <!-- SECTION 2 -->
  <h1>2. Technology Stack & Technical Dependencies</h1>

  <h2>2.1 Backend Dependencies (from <code>backend/package.json</code>)</h2>
  <table>
    <thead>
      <tr>
        <th>Package Name</th>
        <th>Version</th>
        <th>Architectural Purpose</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>@google/genai</code></td>
        <td><code>^2.13.0</code></td>
        <td>Official Google Cloud GenAI SDK for Gemini 3.5 Flash/Pro models.</td>
      </tr>
      <tr>
        <td><code>@google-cloud/vertexai</code></td>
        <td><code>^1.12.0</code></td>
        <td>Google Vertex AI client using Application Default Credentials (ADC).</td>
      </tr>
      <tr>
        <td><code>@google-cloud/storage</code></td>
        <td><code>^8.0.1</code></td>
        <td>Google Cloud Storage bucket manager for media assets (<code>ai-ads-creatives</code>).</td>
      </tr>
      <tr>
        <td><code>express</code></td>
        <td><code>^4.19.2</code></td>
        <td>Web server framework routing HTTP endpoints and API middleware.</td>
      </tr>
      <tr>
        <td><code>mongoose</code></td>
        <td><code>^9.8.0</code></td>
        <td>MongoDB ODM managing database collections, schema validation, and hooks.</td>
      </tr>
      <tr>
        <td><code>openai</code></td>
        <td><code>^7.1.0</code></td>
        <td>OpenAI API SDK powering failover execution chain (<code>gpt-4o</code>).</td>
      </tr>
      <tr>
        <td><code>puppeteer</code></td>
        <td><code>^25.9.0</code></td>
        <td>Headless Chrome browser engine for domain scraping & screenshot capture.</td>
      </tr>
      <tr>
        <td><code>cheerio</code></td>
        <td><code>^1.2.0</code></td>
        <td>Server-side HTML parsing service for DOM crawling.</td>
      </tr>
      <tr>
        <td><code>bcryptjs</code></td>
        <td><code>^3.0.3</code></td>
        <td>Cryptographic password hashing library (10 salt rounds).</td>
      </tr>
      <tr>
        <td><code>jsonwebtoken</code></td>
        <td><code>^9.0.3</code></td>
        <td>JSON Web Token authentication generation and verification engine.</td>
      </tr>
      <tr>
        <td><code>multer</code></td>
        <td><code>^2.2.0</code></td>
        <td>Multipart/form-data upload middleware storing files in memory.</td>
      </tr>
      <tr>
        <td><code>socket.io</code></td>
        <td><code>^4.8.3</code></td>
        <td>Real-time WebSocket communication server for live telemetry and chat.</td>
      </tr>
      <tr>
        <td><code>nodemailer</code></td>
        <td><code>^9.0.5</code></td>
        <td>SMTP mail dispatcher for password reset and 6-digit OTP verification codes.</td>
      </tr>
    </tbody>
  </table>

  <h2>2.2 Frontend Dependencies (from <code>frontend/package.json</code>)</h2>
  <table>
    <thead>
      <tr>
        <th>Package Name</th>
        <th>Version</th>
        <th>Architectural Purpose</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>react</code> / <code>react-dom</code></td>
        <td><code>^18.2.0</code></td>
        <td>Core React component rendering framework.</td>
      </tr>
      <tr>
        <td><code>vite</code></td>
        <td><code>^5.1.6</code></td>
        <td>ES Module build tool, HMR development server & proxy routing.</td>
      </tr>
      <tr>
        <td><code>tailwindcss</code></td>
        <td><code>^3.4.1</code></td>
        <td>Utility-first CSS styling framework and custom design system tokens.</td>
      </tr>
      <tr>
        <td><code>framer-motion</code></td>
        <td><code>^11.0.8</code></td>
        <td>Animation library for fluid UI transitions, modals, and drawers.</td>
      </tr>
      <tr>
        <td><code>lucide-react</code></td>
        <td><code>^0.344.0</code></td>
        <td>Scalable SVG icon library integrated across dashboard modules.</td>
      </tr>
      <tr>
        <td><code>i18next</code> / <code>react-i18next</code></td>
        <td><code>^26.4.2</code></td>
        <td>Internationalization framework supporting multi-language UI translation.</td>
      </tr>
      <tr>
        <td><code>@react-oauth/google</code></td>
        <td><code>^0.13.5</code></td>
        <td>Google Identity Services OAuth 2.0 social login button integration.</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 3 -->
  <h1>3. Frontend, Mobile & Backend Code Organization</h1>

  <h2>3.1 Backend Code Organization</h2>
  <p>
    The backend architecture separates routing (<code>routes/</code>), business logic services (<code>services/</code>), request controllers (<code>controllers/</code>), sub-agent workflows (<code>modules/</code>), and persistence schemas (<code>models/</code>).
  </p>

  <h2>3.2 Frontend Code Organization</h2>
  <p>
    The frontend uses a single global context (<code>WorkspaceContext.jsx</code>) to manage reactive state across modular components in <code>components/modules/</code> and view features in <code>features/</code>.
  </p>

  <h2>3.3 Mobile Client & Responsive Architecture</h2>
  <p>
    Mobile integration is implemented via two complementary mechanisms:
  </p>
  <ul>
    <li><strong>Responsive Web PWA Layout:</strong> Handled by <code>isMobileMenuOpen</code> state in <code>WorkspaceContext.jsx</code>, toggling slide-out drawers in <code>Header.jsx</code> and <code>Sidebar.jsx</code>.</li>
    <li><strong>Mobile Viewport Simulator:</strong> Integrated into <code>WebsitePreviewEngine.jsx</code> and <code>BuilderWorkspaceView.jsx</code>, allowing real-time viewport toggling (<code>desktop</code>, <code>tablet</code>, <code>mobile</code>).</li>
    <li><strong>Mobile API Readiness:</strong> Backend CORS middleware in <code>server.js</code> explicitly parses mobile client headers (<code>x-user-email</code>, <code>x-device-fingerprint</code>, <code>x-visitor-id</code>).</li>
  </ul>

  <!-- SECTION 4 -->
  <h1>4. Key Components, Screens, Services & Contexts</h1>

  <h2>4.1 Central State Hub: <code>WorkspaceContext.jsx</code></h2>
  <p>
    File Path: <code>frontend/src/context/WorkspaceContext.jsx</code>
  </p>
  <pre>
// Central React Context Provider managing active brand state & global actions
export const WorkspaceProvider = ({ children }) => {
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [brandProfile, setBrandProfile] = useState(null);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [theme, setTheme] = useState('light');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userCredits, setUserCredits] = useState(500);

  // Synchronizes state with localStorage and API service calls
  ...
};
  </pre>

  <h2>4.2 Central API Client Service: <code>api.js</code></h2>
  <p>
    File Path: <code>frontend/src/services/api.js</code>
  </p>
  <pre>
// Universal API wrapper handling Authorization headers & JSON responses
const apiFetch = async (path, options = {}) => {
  const url = BASE_URL + path;
  const token = localStorage.getItem('aisa_token');
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  ...
};
  </pre>

  <h2>4.3 Multi-Model AI Service: <code>aiService.js</code></h2>
  <p>
    File Path: <code>backend/services/aiService.js</code>
  </p>
  <p>
    Orchestrates AI calls to Google Cloud Vertex AI (via <code>@google/genai</code>) with inline image parsing for multimodal analysis. Automatically retries failed executions against OpenAI (<code>gpt-4o</code>).
  </p>

  <h2>4.4 Web Scraper Service: <code>scraper.service.js</code></h2>
  <p>
    File Path: <code>backend/modules/workspace/scraper.service.js</code>
  </p>
  <p>
    Launches headless Puppeteer instances to crawl target URLs, parse HTML DOM via Cheerio, capture brand screenshots, and sample dominant color palettes using <code>node-vibrant</code>.
  </p>

  <!-- SECTION 5 -->
  <h1>5. State Management, Routing & Navigation Architecture</h1>
  <p>
    The application follows a state-driven Single Page Application (SPA) navigation model. Routing between major platform modules (e.g. <code>brand-dna</code>, <code>strategy</code>, <code>creative-studio</code>, <code>website-builder</code>, <code>seo</code>) is controlled reactively via <code>activeModule</code> state in <code>WorkspaceContext.jsx</code> rather than standard page reloads.
  </p>

  <!-- SECTION 6 -->
  <h1>6. API Client Layer, Authentication & Error Handling</h1>

  <h2>6.1 Authentication Protocol</h2>
  <ul>
    <li><strong>Token Standard:</strong> Standard HTTP <code>Authorization: Bearer &lt;token&gt;</code> headers using JSON Web Tokens (JWT).</li>
    <li><strong>Storage:</strong> Tokens are stored client-side in <code>localStorage</code> under key <code>aisa_token</code>.</li>
    <li><strong>Middleware Enforcement:</strong> Handled by <code>requireAuth</code> in <code>backend/middleware/auth.js</code>.</li>
  </ul>

  <h2>6.2 6-Digit Email OTP Verification Protocol</h2>
  <p>
    Sensitive account operations (such as permanent account deletion) trigger <code>POST /api/account/send-delete-otp</code>. The server generates a random 6-digit code valid for 10 minutes, stores it in an in-memory <code>deleteOtpStore</code> map with a 30-second rate limit per email, and dispatches it via Nodemailer SMTP.
  </p>

  <!-- SECTION 7 -->
  <h1>7. Database Integration & Data Model Specs</h1>
  <p>
    Database connectivity is managed via Mongoose in <code>backend/config/db.js</code>:
  </p>

  <table>
    <thead>
      <tr>
        <th>Mongoose Model</th>
        <th>File Path</th>
        <th>Key Fields & Indexes</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>User</code></td>
        <td><code>backend/models/User.js</code></td>
        <td><code>email</code> (unique), <code>role</code>, <code>credits</code>, <code>plan</code></td>
        <td>User credentials, bcrypt hashed passwords, role, subscription tier & credit balance.</td>
      </tr>
      <tr>
        <td><code>Workspace</code></td>
        <td><code>backend/models/Workspace.js</code></td>
        <td><code>userEmail</code> (indexed), <code>brandName</code>, <code>domainUrl</code></td>
        <td>Workspace container for brand profile parameters and target audience metadata.</td>
      </tr>
      <tr>
        <td><code>BrandProfile</code></td>
        <td><code>backend/models/BrandProfile.js</code></td>
        <td><code>workspaceId</code> (indexed), <code>structuredIdentity</code></td>
        <td>Canonical brand DNA, logo URLs, computed color palettes, AI confidence audit scores.</td>
      </tr>
      <tr>
        <td><code>WebsiteProject</code></td>
        <td><code>backend/models/WebsiteProject.js</code></td>
        <td><code>projectId</code> (unique), <code>workspaceId</code>, <code>status</code></td>
        <td>AI Website projects, active deployment metadata & health score metrics.</td>
      </tr>
      <tr>
        <td><code>WebsiteVersion</code></td>
        <td><code>backend/models/WebsiteVersion.js</code></td>
        <td><code>projectId</code>, <code>versionTag</code>, <code>htmlCode</code></td>
        <td>Version history of generated HTML/CSS website blueprints.</td>
      </tr>
      <tr>
        <td><code>SystemSetting</code></td>
        <td><code>backend/models/SystemSetting.js</code></td>
        <td><code>key</code> (unique), <code>value</code></td>
        <td>Platform settings (e.g. persistent <code>total_api_hits</code> counter).</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 8 -->
  <h1>8. Coding Standards, Design System & Reusable Components</h1>
  <ul>
    <li><strong>Design System Tokens:</strong> Configured in <code>frontend/tailwind.config.js</code> under custom <code>brand</code> color palettes (<code>brand-50</code> through <code>brand-950</code>).</li>
    <li><strong>Typography:</strong> Google Fonts <code>Inter</code> for interface copy and <code>JetBrains Mono</code> for code/API blocks.</li>
    <li><strong>Reusable Components:</strong> Found in <code>frontend/src/components/common/</code> and <code>components/modals/</code>.</li>
  </ul>

  <!-- SECTION 9 -->
  <h1>9. Environment Configuration & Deployment Setup</h1>

  <h2>9.1 Local Development Instructions</h2>
  <pre>
# 1. Install root, backend and frontend dependencies
cd AI_ADS
npm run install:all

# 2. Terminal 1: Run Backend API (Port 5000)
cd backend
npm run dev

# 3. Terminal 2: Run Frontend Dev Server (Port 3000)
cd frontend
npm run dev
  </pre>

  <h2>9.2 GCP Cloud Run 1-Command Deployment</h2>
  <pre>
gcloud run deploy ai-ads \
  --source . \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --min-instances 0 \
  --max-instances 10 \
  --timeout 300 \
  --set-env-vars="NODE_ENV=production"
  </pre>

  <!-- SECTION 10 -->
  <h1>10. Technical Dependencies & Known Limitations</h1>

  <h2>10.1 Technical System Limits</h2>
  <ul>
    <li><strong>Puppeteer Resource Usage:</strong> Headless Chromium scraping requires at least 2GB RAM per container instance to avoid memory exhaustion during DOM rendering.</li>
    <li><strong>Vertex AI Quota Limits:</strong> Default quotas require 300+ RPM for text models and 50+ RPM for image generation models.</li>
  </ul>

  <h2>10.2 Unverified Component Disclosures</h2>
  <div class="callout callout-warning">
    <div class="callout-title">UNVERIFIED COMPONENT DISCLOSURE</div>
    <strong>React Native Mobile Repository:</strong> A standalone native React Native codebase repository is not present within this workspace directory. The platform delivers mobile functionality via a responsive React PWA mobile layout (with mobile menu drawers and viewport emulators) and mobile-optimized REST API endpoints.
  </div>

</body>
</html>
`;

async function generatePDF() {
  console.log('🚀 Starting Technical Design & Codebase Documentation PDF Generation via Puppeteer...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  await page.setContent(htmlContent, {
    waitUntil: 'networkidle0'
  });

  await page.pdf({
    path: pdfOutputPath1,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-family: 'Inter', sans-serif; font-size: 7.5pt; color: #64748b; width: 100%; padding: 0 15mm; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">
        <span>AI Ads™ Enterprise Platform (v2.0) — Technical Design &amp; Codebase Documentation</span>
        <span>TDC-AIADS-2026-V2.0</span>
      </div>
    `,
    footerTemplate: `
      <div style="font-family: 'Inter', sans-serif; font-size: 7.5pt; color: #64748b; width: 100%; padding: 0 15mm; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #cbd5e1; padding-top: 4px;">
        <span>Confidential Technical Codebase Documentation</span>
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>
    `,
    margin: {
      top: '18mm',
      bottom: '18mm',
      left: '15mm',
      right: '15mm'
    }
  });

  // Also copy/generate to secondary docs path to guarantee deliverable location
  fs.copyFileSync(pdfOutputPath1, pdfOutputPath2);

  await browser.close();
  console.log(`✅ Technical Design PDF generated successfully at:\n 1: ${pdfOutputPath1}\n 2: ${pdfOutputPath2}`);
}

generatePDF().catch((err) => {
  console.error('❌ Error generating Technical Design PDF:', err);
  process.exit(1);
});
