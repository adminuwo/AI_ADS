const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const pdfOutputPath1 = 'c:/Users/uwo24/Desktop/AI ADS/Project_Documents/AI_ADS_System_Architecture.pdf';
const pdfOutputPath2 = 'c:/Users/uwo24/Desktop/AI ADS/Project_Documents/docs/AI_ADS_System_Architecture.pdf';

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>System Architecture Document - AI Ads Enterprise Platform</title>
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

    /* Page Break Management */
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
      font-size: 28pt;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.15;
      margin: 0 0 12px 0;
      letter-spacing: -0.5px;
    }

    .cover-subtitle {
      font-size: 14pt;
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

    /* Badges & Visual Blocks */
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

    /* Architecture Visual Diagrams */
    .diag-container {
      background-color: #0f172a;
      color: #f8fafc;
      padding: 16px;
      border-radius: 8px;
      margin: 14px 0;
      border: 1px solid #334155;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      line-height: 1.35;
    }

    .diag-title {
      font-family: 'Inter', sans-serif;
      font-size: 9.5pt;
      font-weight: 700;
      color: #38bdf8;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
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
      <span class="cover-badge">Verified System Architecture</span>
      <h1 class="cover-title">SYSTEM ARCHITECTURE SPECIFICATION</h1>
      <div class="cover-subtitle">AI Ads™ Enterprise Platform (v2.0 Architecture)</div>
    </div>

    <div class="cover-body">
      <div class="cover-desc">
        This document provides a comprehensive technical breakdown of the system architecture, component interactions, database schemas, multi-model AI orchestration, security protocols, API flows, and cloud deployment topology for the <strong>AI Ads™ Enterprise Platform</strong>. All specifications are verified directly against the production codebase.
      </div>

      <div class="meta-grid">
        <div class="meta-card">
          <div class="label">Document ID</div>
          <div class="value">SAD-AIADS-2026-V2.0</div>
        </div>
        <div class="meta-card">
          <div class="label">System Version</div>
          <div class="value">v2.0.0 (Unified GCP Cloud Run)</div>
        </div>
        <div class="meta-card">
          <div class="label">Author / Organization</div>
          <div class="value">AI Ads Systems Engineering Team</div>
        </div>
        <div class="meta-card">
          <div class="label">Primary Hosting</div>
          <div class="value">GCP Cloud Run (Single Container)</div>
        </div>
        <div class="meta-card">
          <div class="label">Date of Issue</div>
          <div class="value">October 10, 2026</div>
        </div>
        <div class="meta-card">
          <div class="label">Verification Status</div>
          <div class="value"><span class="badge badge-green">VERIFIED CODEBASE SPECIFICATION</span></div>
        </div>
      </div>
    </div>

    <div class="cover-footer">
      <div>AI Ads™ Platform &copy; 2026. All Rights Reserved.</div>
      <div>Confidential System Architecture Document</div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- TABLE OF CONTENTS -->
  <h1>Table of Contents</h1>
  <div class="toc-list">
    <div class="toc-item"><span class="toc-title">1. System Overview & Technology Stack</span><span class="toc-num">Section 1</span></div>
    <div class="toc-item"><span class="toc-title">2. High-Level Architecture Topology</span><span class="toc-num">Section 2</span></div>
    <div class="toc-item"><span class="toc-title">3. Frontend, Mobile & Client Tier Architecture</span><span class="toc-num">Section 3</span></div>
    <div class="toc-item"><span class="toc-title">4. Backend & API Service Architecture</span><span class="toc-num">Section 4</span></div>
    <div class="toc-item"><span class="toc-title">5. Multi-Model AI Routing & Failover Orchestration</span><span class="toc-num">Section 5</span></div>
    <div class="toc-item"><span class="toc-title">6. API Communication & Security Authentication Flow</span><span class="toc-num">Section 6</span></div>
    <div class="toc-item"><span class="toc-title">7. Major System Modules & Component Interactions</span><span class="toc-num">Section 7</span></div>
    <div class="toc-item"><span class="toc-title">8. Data Flow Pipelines & Sequence Specifications</span><span class="toc-num">Section 8</span></div>
    <div class="toc-item"><span class="toc-title">9. Database Architecture & Schema Specifications</span><span class="toc-num">Section 9</span></div>
    <div class="toc-item"><span class="toc-title">10. Security, Scalability & Cloud Deployment Architecture</span><span class="toc-num">Section 10</span></div>
    <div class="toc-item"><span class="toc-title">11. Architecture Assumptions, Constraints & Unverified Component Disclosures</span><span class="toc-num">Section 11</span></div>
  </div>

  <div class="callout" style="margin-top: 20px;">
    <div class="callout-title">ARCHITECTURAL INTEGRITY GUARANTEE</div>
    Every architectural pattern, class reference, API route, database schema, and deployment setting documented herein has been extracted directly from the verified production repository. Any component not directly verifiable within this codebase is explicitly flagged in Section 11.
  </div>

  <!-- SECTION 1 -->
  <h1>1. System Overview & Technology Stack</h1>

  <h2>1.1 System Executive Summary</h2>
  <p>
    The <strong>AI Ads™ Enterprise Platform</strong> is a unified, cloud-native marketing platform designed to automate brand identity extraction, 30-day marketing roadmaps, SEO intent clustering, social/ad copywriting, AI ad banner generation, multi-page website building, and workflow approvals. The platform operates on a single-container architecture deployed to Google Cloud Platform (GCP) Cloud Run.
  </p>

  <h2>1.2 Verified Core Technology Stack</h2>
  <table>
    <thead>
      <tr>
        <th>Layer / Subsystem</th>
        <th>Technologies & Core Libraries</th>
        <th>Version / Spec</th>
        <th>Role & Architectural Scope</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Web Frontend Tier</strong></td>
        <td>React 18.2, Vite 5.1, Tailwind CSS 3.4, Framer Motion 11.0, Lucide React 0.344, i18next 26.4</td>
        <td>SPA / ES Module</td>
        <td>Dynamic client UI dashboard, real-time preview engines, dark/light theme switching, responsive viewport emulator.</td>
      </tr>
      <tr>
        <td><strong>Mobile Tier</strong></td>
        <td>Responsive Web PWA / Mobile Viewport Drawer Architecture / CORS Mobile REST API</td>
        <td>HTTP Mobile Ready</td>
        <td>Mobile navigation drawer (<code>isMobileMenuOpen</code>), device viewport simulation (<code>desktop</code>, <code>tablet</code>, <code>mobile</code>), REST mobile client header support.</td>
      </tr>
      <tr>
        <td><strong>Backend Application Tier</strong></td>
        <td>Node.js, Express 4.19, Socket.IO 4.8, Axios 1.18, Multer 2.2, Puppeteer 25.9, Cheerio 1.2, Node-Vibrant 4.0, Nodemailer 9.0</td>
        <td>CommonJS / Node v18+</td>
        <td>Unified REST API server, headless web scraper engine, brand image resolution, email notification dispatcher, real-time logging.</td>
      </tr>
      <tr>
        <td><strong>AI Engine Orchestrator</strong></td>
        <td><code>@google/genai</code> 2.13, <code>openai</code> 7.1, <code>@google-cloud/vertexai</code> 1.12</td>
        <td>Vertex AI ADC / OpenAI SDK</td>
        <td>Multi-model routing engine for Gemini 3.5 Flash/Pro, Gemini 3.1 Flash Image, Imagen 3, and OpenAI GPT-4o failover.</td>
      </tr>
      <tr>
        <td><strong>Database & Data Persistence</strong></td>
        <td>MongoDB Atlas, Mongoose 9.8</td>
        <td>NoSQL / Document DB</td>
        <td>Persistent data store for users, workspaces, brand profiles, campaigns, content, website projects, credit logs, and settings.</td>
      </tr>
      <tr>
        <td><strong>Cloud Storage & Infra</strong></td>
        <td>Google Cloud Storage (<code>@google-cloud/storage</code> 8.0)</td>
        <td>GCP Storage API</td>
        <td>Media asset repository (<code>ai-ads-creatives</code>) providing signed temporary CDN access URLs.</td>
      </tr>
      <tr>
        <td><strong>Deployment & Containerization</strong></td>
        <td>Docker, GCP Cloud Run, Google Artifact Registry</td>
        <td>Linux x86_64 Container</td>
        <td>Single-service container hosting both React SPA static distribution and Express API endpoints.</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 2 -->
  <h1>2. High-Level Architecture Topology</h1>
  <p>
    The system follows a <strong>Unified Single-Service Container Architecture</strong>. Client requests hit a single host domain on GCP Cloud Run. Non-API requests (<code>/*</code>) serve the React SPA, while API requests (<code>/api/*</code>) are handled directly by Express endpoints without cross-origin preflight overhead.
  </p>

  <div class="diag-container">
    <div class="diag-title">FIGURE 2.1: HIGH-LEVEL UNIFIED PLATFORM ARCHITECTURE TOPOLOGY</div>
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    CLIENT PLATFORM INTERFACES                                   │
│  ┌────────────────────────────────────────┐          ┌────────────────────────────────────────┐  │
│  │   Desktop / Web Browser (React SPA)    │          │  Mobile Web Client / PWA / Native Client│  │
│  └───────────────────┬────────────────────┘          └───────────────────┬────────────────────┘  │
└──────────────────────┼───────────────────────────────────────────────────┼───────────────────────┘
                       │ HTTPS / WSS Requests                              │ HTTPS Requests (Mobile Headers)
                       ▼                                                   ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 GOOGLE CLOUD PLATFORM (GCP) RUN                                  │
│ ┌──────────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │                                  SINGLE-SERVICE CONTAINER                                    │ │
│ │                                                                                              │ │
│ │   ┌─────────────────────────────────────┐         ┌──────────────────────────────────────┐   │ │
│ │   │    React SPA Static Dist Bundle     │         │    Express REST API Server Engine     │   │ │
│ │   │   (Vite HTML / CSS / JS Assets)     │         │      (Node.js / Socket.IO Server)    │   │ │
│ │   └─────────────────────────────────────┘         └──────────────────┬───────────────────┘   │ │
│ └──────────────────────────────────────────────────────────────────────┼───────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┼─────────────────────────┘
                                                                         │
       ┌───────────────────────────┬─────────────────────────────────────┼───────────────────────────┐
       ▼                           ▼                                     ▼                           ▼
┌───────────────┐         ┌──────────────────┐                 ┌──────────────────┐         ┌──────────────────┐
│ MongoDB Atlas │         │ Vertex AI Engine │                 │  GCP Storage     │         │ External APIs    │
│ Document DB   │         │ (Gemini / Imagen)│                 │ (ai-ads-creatives)│        │ (Tavily, Pexels) │
└───────────────┘         └──────────────────┘                 └──────────────────┘         └──────────────────┘
  </div>

  <!-- SECTION 3 -->
  <h1>3. Frontend, Mobile & Client Tier Architecture</h1>

  <h2>3.1 React SPA Architecture</h2>
  <p>
    The web frontend is structured inside <code>frontend/src/</code> following a modular feature layout:
  </p>
  <ul>
    <li><code>features/</code>: Houses feature-specific views and components (e.g. <code>brandDna</code>, <code>websiteBuilder</code>, <code>creativeStudio</code>, <code>seo</code>, <code>settingsBilling</code>, <code>admin</code>).</li>
    <li><code>components/modules/</code>: Contains 14 primary module components (e.g. <code>BrandDnaModule.jsx</code>, <code>CreativeStudioModule.jsx</code>, <code>SeoModule.jsx</code>).</li>
    <li><code>context/WorkspaceContext.jsx</code>: Global state provider managing active workspace, brand profiles, theme state (dark/light), mobile navigation drawers, user credits, and localization.</li>
  </ul>

  <h2>3.2 Mobile Client & Responsive Architecture</h2>
  <p>
    The client tier includes dedicated mobile optimization patterns:
  </p>
  <ul>
    <li><strong>Mobile Navigation Drawer:</strong> Controlled via <code>isMobileMenuOpen</code> in <code>WorkspaceContext.jsx</code>, providing a fluid slide-out navigation menu on mobile viewports.</li>
    <li><strong>Device Viewport Emulator:</strong> Built into <code>WebsitePreviewEngine.jsx</code> and <code>BuilderWorkspaceView.jsx</code>, allowing real-time preview switching between <code>desktop</code>, <code>tablet</code>, and <code>mobile</code> viewports.</li>
    <li><strong>Mobile API Readiness:</strong> Backend CORS middleware explicitly allows custom mobile headers (<code>x-user-email</code>, <code>x-device-fingerprint</code>, <code>x-visitor-id</code>), enabling seamless API integration for external mobile clients.</li>
  </ul>

  <!-- SECTION 4 -->
  <h1>4. Backend & API Service Architecture</h1>

  <h2>4.1 Server Module Entry Point</h2>
  <p>
    The backend entry point (<code>backend/server.js</code>) initializes database connectivity via <code>config/db.js</code>, attaches CORS and body parser middleware, mounts 11 express routers, configures real-time diagnostic logging, and starts an HTTP server with Socket.IO support on process port (default 5000 / 8080).
  </p>

  <h2>4.2 Express Router Hierarchy</h2>
  <table>
    <thead>
      <tr>
        <th>Router Module</th>
        <th>File Path</th>
        <th>Base Route Path</th>
        <th>Architectural Function</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>accountRoutes</code></td>
        <td><code>routes/accountRoutes.js</code></td>
        <td><code>/api/account</code></td>
        <td>6-digit email OTP generation, OTP verification, and permanent account deletion.</td>
      </tr>
      <tr>
        <td><code>adminRoutes</code></td>
        <td><code>routes/adminRoutes.js</code></td>
        <td><code>/api/admin</code></td>
        <td>Super-admin dashboard telemetry, quota updates, user blocking, support tickets.</td>
      </tr>
      <tr>
        <td><code>brandRoutes</code></td>
        <td><code>routes/brandRoutes.js</code></td>
        <td><code>/api/brand</code></td>
        <td>Multi-agent web scraping, brand profile retrieval, identity persistence.</td>
      </tr>
      <tr>
        <td><code>campaignRoutes</code></td>
        <td><code>routes/campaignRoutes.js</code></td>
        <td><code>/api/campaigns</code></td>
        <td>Multi-channel marketing campaign strategy generation and post scheduling.</td>
      </tr>
      <tr>
        <td><code>chatRoutes</code></td>
        <td><code>routes/chatRoutes.js</code></td>
        <td><code>/api/chat</code></td>
        <td>AISA Copilot multi-turn conversational AI chat assistant endpoint.</td>
      </tr>
      <tr>
        <td><code>contentRoutes</code></td>
        <td><code>routes/contentRoutes.js</code></td>
        <td><code>/api/content</code></td>
        <td>Social copy, SEO blog drafts, email newsletters, direct-response ad copy generation.</td>
      </tr>
      <tr>
        <td><code>seoRoutes</code></td>
        <td><code>routes/seoRoutes.js</code></td>
        <td><code>/api/seo</code></td>
        <td>Keyword intent clustering, keyword regeneration, and SEO brief generation.</td>
      </tr>
      <tr>
        <td><code>websiteBuilderRoutes</code></td>
        <td><code>routes/websiteBuilderRoutes.js</code></td>
        <td><code>/api/website-builder</code></td>
        <td>AI website blueprint generation, chat edit interpreter, versioning & health checks.</td>
      </tr>
      <tr>
        <td><code>healthRoutes</code></td>
        <td><code>routes/healthRoutes.js</code></td>
        <td><code>/api/health</code></td>
        <td>System diagnostic health endpoints for Cloud Run container liveness probes.</td>
      </tr>
    </tbody>
  </table>

  <h2>4.3 Diagnostic Logger Middleware</h2>
  <p>
    Every incoming request is processed by a custom middleware in <code>server.js</code> that records response latency, route path, method, and automatically increments the persistent platform API hit counter stored in <code>SystemSetting</code> under key <code>total_api_hits</code>.
  </p>

  <!-- SECTION 5 -->
  <h1>5. Multi-Model AI Routing & Failover Orchestration</h1>
  <p>
    The AI execution layer (<code>backend/services/aiService.js</code>, <code>vertexService.js</code>) features an automated fallback chain. Primary requests are handled by Google Cloud Vertex AI using Application Default Credentials (ADC) in region <code>asia-south1</code>.
  </p>

  <div class="diag-container">
    <div class="diag-title">FIGURE 5.1: MULTI-MODEL AI ROUTING & FAILOVER CHAIN</div>
                   ┌──────────────────────────────────────────────┐
                   │    Incoming AI Request (Prompt / Task)       │
                   └──────────────────────┬───────────────────────┘
                                          │
                                          ▼
                   ┌──────────────────────────────────────────────┐
                   │ Primary Engine: Google Cloud Vertex AI       │
                   │ (@google/genai SDK in asia-south1 / Global)   │
                   └──────────────────────┬───────────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  │ SUCCESS?                                      │
                 ┌┴────────┐                             ┌────────┴┐
                 │  YES    │                             │   NO    │ (429 Rate Limit / 5xx)
                 └────┬────┘                             └────┬────┘
                      │                                       │
                      ▼                                       ▼
       ┌──────────────────────────────┐        ┌──────────────────────────────┐
       │ Return Vertex AI Output      │        │ Failover Engine: OpenAI API  │
       │ (Gemini 3.5 / Gemini 3.1 /   │        │ (gpt-4o SDK Execution)       │
       │ Imagen 3)                    │        └──────────────┬───────────────┘
       └──────────────────────────────┘                       │
                                                              ▼
                                               ┌──────────────────────────────┐
                                               │ Return OpenAI Failover Result│
                                               └──────────────────────────────┘
  </div>

  <!-- SECTION 6 -->
  <h1>6. API Communication & Security Authentication Flow</h1>

  <h2>6.1 Authentication Middleware Flow</h2>
  <p>
    Authentication is managed via JSON Web Tokens (JWT) using two middleware components in <code>backend/middleware/auth.js</code>:
  </p>
  <ul>
    <li><code>requireAuth</code>: Enforces valid HTTP <code>Authorization: Bearer &lt;token&gt;</code> headers. Decodes JWT using <code>JWT_SECRET</code>, validates user existence in MongoDB, and populates <code>req.user</code>. Rejects unauthorized calls with HTTP 401.</li>
    <li><code>optionalAuth</code>: Inspects authorization headers if present; populates <code>req.user</code> if valid, but allows unauthenticated execution if absent.</li>
  </ul>

  <h2>6.2 Sensitive Account Action OTP Flow</h2>
  <div class="callout">
    <div class="callout-title">6-DIGIT EMAIL OTP VERIFICATION PROTOCOL</div>
    Sensitive account actions (such as account deletion in <code>accountRoutes.js</code>) require a two-step verification process:
    <ol style="margin-bottom:0;">
      <li>Client triggers <code>POST /api/account/send-delete-otp</code>. Server generates a cryptographically secure 6-digit numerical code valid for 10 minutes, stored in an in-memory map with a 30-second rate-limit per email.</li>
      <li>Server dispatches email via Nodemailer SMTP.</li>
      <li>Client submits code to <code>POST /api/account/verify-delete-otp</code>. Server validates matching OTP and returns a temporary verification grant.</li>
    </ol>
  </div>

  <!-- SECTION 7 -->
  <h1>7. Major System Modules & Component Interactions</h1>

  <table>
    <thead>
      <tr>
        <th>Module Name</th>
        <th>Backend Service Files</th>
        <th>Frontend Component File</th>
        <th>Primary Functional Interaction</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Brand DNA Engine</strong></td>
        <td><code>scraper.service.js</code><br><code>brandIntelligence.service.js</code><br><code>brandValidatorAgent.js</code></td>
        <td><code>BrandDnaModule.jsx</code></td>
        <td>Scrapes domain, extracts structured brand identity, calculates confidence score, and stores canonical BrandProfile.</td>
      </tr>
      <tr>
        <td><strong>Strategy Hub</strong></td>
        <td><code>customStrategyAgent.service.js</code><br><code>aiService.js</code></td>
        <td><code>StrategyModule.jsx</code></td>
        <td>Generates 30-day marketing roadmaps, regenerates individual strategy cards, syncs with content calendar.</td>
      </tr>
      <tr>
        <td><strong>SEO Intelligence</strong></td>
        <td><code>vertexService.js</code></td>
        <td><code>SeoModule.jsx</code></td>
        <td>Generates keyword intent clusters, keyword briefs, and long-form SEO content outlines.</td>
      </tr>
      <tr>
        <td><strong>Content Studio</strong></td>
        <td><code>aiService.js</code><br><code>vertexService.js</code></td>
        <td><code>ContentStudioModule.jsx</code><br><code>RepurposeModule.jsx</code></td>
        <td>Generates multi-platform social copy, long-form blogs, ad copy, emails, and repurposes web URLs.</td>
      </tr>
      <tr>
        <td><strong>Creative Studio</strong></td>
        <td><code>brandImageAgent.service.js</code><br><code>brandVisualResolver.js</code><br><code>creditService.js</code></td>
        <td><code>CreativeStudioModule.jsx</code></td>
        <td>Generates AI ad banners via <code>gemini-3.1-flash-image</code>/<code>imagen-3.0</code>, handles 4x visual variations, deducts user image credits.</td>
      </tr>
      <tr>
        <td><strong>AI Web Builder</strong></td>
        <td><code>websiteBuilder.service.js</code><br><code>clarificationAnalyzer.service.js</code><br><code>chatEditInterpreter.service.js</code></td>
        <td><code>websiteBuilder/</code></td>
        <td>3-step pipeline generating HTML/CSS code, hero visuals, and live chat inline edits.</td>
      </tr>
      <tr>
        <td><strong>Content Calendar</strong></td>
        <td><code>routes/calendarRoutes.js</code></td>
        <td><code>CalendarModule.jsx</code></td>
        <td>Manages drag-and-drop scheduling of social posts across monthly and weekly views.</td>
      </tr>
      <tr>
        <td><strong>AISA Copilot</strong></td>
        <td><code>controllers/chatController.js</code><br><code>aiService.js</code></td>
        <td><code>aisaAssistant/</code></td>
        <td>Floating conversational AI assistant supporting multi-turn chat and multimodal image analysis.</td>
      </tr>
      <tr>
        <td><strong>Admin Console</strong></td>
        <td><code>controllers/adminController.js</code><br><code>routes/adminRoutes.js</code></td>
        <td><code>admin/</code></td>
        <td>Provides super-admin system metrics, quota management, user blocking, support ticket desk, and legal content updates.</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 8 -->
  <h1>8. Data Flow Pipelines & Sequence Specifications</h1>

  <h2>8.1 AI Website Builder Generation Pipeline</h2>
  <div class="diag-container">
    <div class="diag-title">FIGURE 8.1: AI WEBSITE BUILDER PIPELINE DATA FLOW</div>
  User Brief & Prompt 
         │
         ▼
  ┌─────────────────────────────────────────────────────────┐
  │ Step 1: Brief Clarification Analyzer                    │
  │ (gemini-3.5-flash: ~1.2k in / ~400 out = $0.00021 USD)   │
  └──────────────────────────┬──────────────────────────────┘
                             │
                             ▼
  ┌─────────────────────────────────────────────────────────┐
  │ Step 2: Full Page HTML & Code Generation                │
  │ (gemini-3.5-flash: ~5.5k in / ~4.5k out = $0.00176 USD)   │
  └──────────────────────────┬──────────────────────────────┘
                             │
                             ▼
  ┌─────────────────────────────────────────────────────────┐
  │ Step 3: Hero Banner AI Image Generation (Optional)      │
  │ (gemini-3.1-flash-image: 1 Image = $0.03000 USD)        │
  └──────────────────────────┬──────────────────────────────┘
                             │
                             ▼
  ┌─────────────────────────────────────────────────────────┐
  │ Step 4: Live Chat Modifications per Turn                │
  │ (gemini-3.5-flash: ~2.5k in / ~1.2k out = $0.00055 USD)   │
  └─────────────────────────────────────────────────────────┘
  </div>

  <!-- SECTION 9 -->
  <h1>9. Database Architecture & Schema Specifications</h1>
  <p>
    The system utilizes 16 canonical Mongoose models defined in <code>backend/models/</code>:
  </p>

  <table>
    <thead>
      <tr>
        <th>Mongoose Model</th>
        <th>Collection Name</th>
        <th>Primary Keys & Indexes</th>
        <th>Schema Responsibilities</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>User</code></td>
        <td><code>users</code></td>
        <td><code>_id</code>, <code>email</code> (unique), <code>providerId</code> (sparse)</td>
        <td>User credentials, authentication role, subscription plan tier, credit balance, billing details.</td>
      </tr>
      <tr>
        <td><code>Workspace</code></td>
        <td><code>workspaces</code></td>
        <td><code>_id</code>, <code>userEmail</code> (indexed)</td>
        <td>Multi-brand workspace scoping, domain URL, brand voice tone, target audience.</td>
      </tr>
      <tr>
        <td><code>BrandProfile</code></td>
        <td><code>brandprofiles</code></td>
        <td><code>_id</code>, <code>workspaceId</code> (indexed)</td>
        <td>Extracted brand DNA, logo URLs, computed color palettes, AI confidence scores.</td>
      </tr>
      <tr>
        <td><code>Campaign</code></td>
        <td><code>campaigns</code></td>
        <td><code>_id</code>, <code>workspaceId</code> (indexed)</td>
        <td>Multi-channel campaign strategy metadata, target budget, timeframe.</td>
      </tr>
      <tr>
        <td><code>Content</code></td>
        <td><code>contents</code></td>
        <td><code>_id</code>, <code>workspaceId</code> (indexed)</td>
        <td>Generated social posts, blog copy, email newsletters, direct-response ad copy.</td>
      </tr>
      <tr>
        <td><code>WebsiteProject</code></td>
        <td><code>websiteprojects</code></td>
        <td><code>_id</code>, <code>projectId</code> (unique), <code>workspaceId</code></td>
        <td>AI website projects, deployment status, health score metrics.</td>
      </tr>
      <tr>
        <td><code>WebsiteVersion</code></td>
        <td><code>websiteversions</code></td>
        <td><code>_id</code>, <code>projectId</code>, <code>versionTag</code></td>
        <td>Historical versions of generated HTML/CSS website blueprints.</td>
      </tr>
      <tr>
        <td><code>ChatSession</code></td>
        <td><code>chatsessions</code></td>
        <td><code>_id</code>, <code>userId</code>, <code>workspaceId</code></td>
        <td>Persistent message history for AISA Copilot conversational assistant.</td>
      </tr>
      <tr>
        <td><code>SupportTicket</code></td>
        <td><code>supporttickets</code></td>
        <td><code>_id</code>, <code>userId</code></td>
        <td>User support ticket tickets managed in Admin Console.</td>
      </tr>
      <tr>
        <td><code>SystemSetting</code></td>
        <td><code>systemsettings</code></td>
        <td><code>_id</code>, <code>key</code> (unique)</td>
        <td>Global system settings (e.g. <code>total_api_hits</code> counter).</td>
      </tr>
      <tr>
        <td><code>CreditLog</code></td>
        <td><code>creditlogs</code></td>
        <td><code>_id</code>, <code>userEmail</code></td>
        <td>Audit log of credit deductions and top-ups.</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 10 -->
  <h1>10. Security, Scalability & Cloud Deployment Architecture</h1>

  <h2>10.1 Single-Service GCP Cloud Run Deployment</h2>
  <p>
    The application is packaged into a Linux container via <code>Dockerfile</code> and deployed using Google Cloud Run:
  </p>
  <ul>
    <li><strong>Resource Limits:</strong> Configured with 2 CPU and 2GiB RAM to accommodate headless Chromium execution for web scraping.</li>
    <li><strong>Auto-Scaling Policy:</strong> Scales automatically from 0 min instances to 10 max instances based on incoming request load, with a 300-second execution timeout.</li>
    <li><strong>Environment Configuration:</strong> Production secrets (<code>MONGO_URI</code>, <code>JWT_SECRET</code>, <code>OPENAI_API_KEY</code>) are injected dynamically via Cloud Run Environment Variables.</li>
  </ul>

  <h2>10.2 Security Controls & CORS Policy</h2>
  <ul>
    <li><strong>CORS Allowed Origins:</strong> Whitelists explicit production domains (<code>aiads.aisa24.com</code>, <code>aisa24.com</code>, <code>uwo24.com</code>) alongside local development environments.</li>
    <li><strong>Password Security:</strong> Enforces <code>bcryptjs</code> password hashing with 10 salt rounds before database insertion.</li>
    <li><strong>Rate Limiting:</strong> Enforces API request rate limiting via <code>express-rate-limit</code>.</li>
  </ul>

  <!-- SECTION 11 -->
  <h1>11. Architecture Assumptions & Unverified Disclosures</h1>

  <h2>11.1 System Assumptions</h2>
  <ul>
    <li>Google Cloud Vertex AI quotas remain active with at least 300 RPM for Gemini text models and 50 RPM for image generation.</li>
    <li>MongoDB Atlas cluster maintains active network connectivity with high availability.</li>
  </ul>

  <h2>11.2 Unverified Component Disclosures</h2>
  <div class="callout callout-warning">
    <div class="callout-title">UNVERIFIED COMPONENT DISCLOSURE</div>
    <strong>React Native Mobile Repository:</strong> A standalone native React Native codebase directory is not present within this workspace repository. The platform provides mobile client capabilities via a responsive React PWA mobile layout (with mobile menu drawers and viewport emulators) and mobile-optimized CORS REST API endpoints.
  </div>

</body>
</html>
`;

async function generatePDF() {
  console.log('🚀 Starting System Architecture PDF Generation via Puppeteer...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  await page.setContent(htmlContent, {
    waitUntil: 'networkidle0'
  });

  // Generate to primary path
  await page.pdf({
    path: pdfOutputPath1,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-family: 'Inter', sans-serif; font-size: 7.5pt; color: #64748b; width: 100%; padding: 0 15mm; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">
        <span>AI Ads™ Enterprise Platform (v2.0) — System Architecture Document</span>
        <span>SAD-AIADS-2026-V2.0</span>
      </div>
    `,
    footerTemplate: `
      <div style="font-family: 'Inter', sans-serif; font-size: 7.5pt; color: #64748b; width: 100%; padding: 0 15mm; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #cbd5e1; padding-top: 4px;">
        <span>Confidential System Architecture Document</span>
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
  console.log(`✅ System Architecture PDF generated successfully at:\n 1: ${pdfOutputPath1}\n 2: ${pdfOutputPath2}`);
}

generatePDF().catch((err) => {
  console.error('❌ Error generating System Architecture PDF:', err);
  process.exit(1);
});
