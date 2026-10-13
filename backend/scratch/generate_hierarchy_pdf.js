const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const pdfOutputPath1 = 'c:/Users/uwo24/Desktop/AI ADS/Project_Documents/AI_ADS_Project_Working_Hierarchy.pdf';
const pdfOutputPath2 = 'c:/Users/uwo24/Desktop/AI ADS/Project_Documents/docs/AI_ADS_Project_Working_Hierarchy.pdf';

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Project Working Hierarchy - AI Ads Enterprise Platform</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

    @page {
      size: A4;
      margin: 18mm 15mm 18mm 15mm;
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
      line-height: 1.45;
      font-size: 8.5pt;
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
      border-bottom: 3px solid #10b981;
      padding-bottom: 20px;
    }

    .cover-badge {
      display: inline-block;
      background: #064e3b;
      color: #a7f3d0;
      font-weight: 700;
      font-size: 8.5pt;
      padding: 4px 14px;
      border-radius: 20px;
      border: 1px solid #10b981;
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
      border-left: 4px solid #10b981;
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
      font-size: 14pt;
      font-weight: 700;
      color: #0f172a;
      border-bottom: 2px solid #cbd5e1;
      padding-bottom: 5px;
      margin-top: 20px;
      margin-bottom: 10px;
      letter-spacing: -0.3px;
    }

    h2 {
      font-size: 11pt;
      font-weight: 600;
      color: #1e3a8a;
      margin-top: 14px;
      margin-bottom: 6px;
    }

    p {
      margin-top: 0;
      margin-bottom: 8px;
      color: #334155;
      text-align: justify;
    }

    ul, ol {
      margin-top: 0;
      margin-bottom: 8px;
      padding-left: 18px;
      color: #334155;
    }

    li {
      margin-bottom: 3px;
    }

    /* Tree View Box */
    .tree-container {
      background-color: #0f172a;
      color: #f8fafc;
      padding: 14px;
      border-radius: 8px;
      margin: 10px 0;
      border: 1px solid #334155;
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.5pt;
      line-height: 1.35;
      overflow-x: auto;
    }

    .tree-title {
      font-family: 'Inter', sans-serif;
      font-size: 9pt;
      font-weight: 700;
      color: #34d399;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
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
    .badge-green { background: #dcfce7; color: #166534; }
    .badge-blue { background: #dbeafe; color: #1e40af; }

    .callout {
      background-color: #eff6ff;
      border-left: 4px solid #2563eb;
      padding: 8px 12px;
      border-radius: 0 6px 6px 0;
      margin: 10px 0;
      font-size: 8.5pt;
    }

    .callout-warning {
      background-color: #fffbeb;
      border-left-color: #f59e0b;
    }

    .callout-title {
      font-weight: 700;
      color: #1e40af;
      margin-bottom: 2px;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 6px;
      margin-bottom: 10px;
      font-size: 8pt;
    }

    th {
      background-color: #0f172a;
      color: #ffffff;
      font-weight: 600;
      text-align: left;
      padding: 6px 8px;
      border: 1px solid #334155;
      font-size: 7.5pt;
      text-transform: uppercase;
    }

    td {
      padding: 5px 8px;
      border: 1px solid #cbd5e1;
      color: #334155;
      vertical-align: top;
    }

    tr:nth-child(even) td {
      background-color: #f8fafc;
    }
  </style>
</head>
<body>

  <!-- COVER PAGE -->
  <div class="cover-page">
    <div class="cover-header">
      <span class="cover-badge">Verified End-to-End System Hierarchy</span>
      <h1 class="cover-title">PROJECT WORKING HIERARCHY SPECIFICATION</h1>
      <div class="cover-subtitle">AI Ads™ Enterprise Platform (v2.0 Tree Structure)</div>
    </div>

    <div class="cover-body">
      <div class="cover-desc">
        This specification represents the end-to-end working of the <strong>AI Ads™ Enterprise Platform</strong> in a complete 10-tier tree hierarchy structure. Mapped from application launch, authentication, workspace initialization, brand DNA extraction, marketing strategy, content/creative production, AI web building, calendar scheduling, backend data processing, to session logout. Derived directly from source-code inspection of React frontend modules, Express API routes, Mongoose database schemas, and AI orchestrators.
      </div>

      <div class="meta-grid">
        <div class="meta-card">
          <div class="label">Document ID</div>
          <div class="value">PWH-AIADS-2026-V2.0</div>
        </div>
        <div class="meta-card">
          <div class="label">Editable Source File</div>
          <div class="value">docs/AI_ADS_Project_Working_Hierarchy.md</div>
        </div>
        <div class="meta-card">
          <div class="label">Author / Organization</div>
          <div class="value">AI Ads Systems & Architecture Team</div>
        </div>
        <div class="meta-card">
          <div class="label">Hierarchy Nodes</div>
          <div class="value">10 Core Subsystem Categories</div>
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
      <div>Confidential Project Working Hierarchy Specification</div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- SECTION 1 -->
  <h1>1. Application Launch & Session Verification Hierarchy</h1>
  <p>
    Documents the initialization phase when a user opens the Web SPA (React 18) or Mobile PWA client, probes system health, and checks existing login sessions.
  </p>

  <div class="tree-container">
    <div class="tree-title">1. APPLICATION LAUNCH & INITIALIZATION TREE</div>
AI ADS Platform (v2.0 Production Architecture)
│
├── 1. Application Launch
│   ├── User opens Web Application (React 18 SPA) or Mobile Client (PWA / Mobile Viewport Drawer)
│   ├── Application initializes React root in main.jsx & mounts App.jsx
│   ├── Load global configuration (resolveApiBase in src/config/api.js)
│   │   ├── Development Mode ──► Base URL: http://localhost:5000/api (Vite Dev Server Proxy)
│   │   └── Production Mode ──► Base URL: https://aiads.aisa24.com/api (Express Unified Container)
│   ├── Probe System Health ──► GET /api/health (Verifies backend liveness & MongoDB Atlas connection)
│   └── Check Existing User Login Session
│       ├── Valid JWT Token Found in localStorage.aisa_token ──► Verify Bearer Token ──► Open Dashboard
│       └── No Token / Token Expired ──► Redirect to Authentication Screen (/login)
  </div>

  <!-- SECTION 2 -->
  <h1>2. User Authentication & Identity Verification Hierarchy</h1>
  <p>
    Maps credentials entry, password verification, Google OAuth 2.0, JWT token generation, 6-digit OTP verification, and failure branching.
  </p>

  <div class="tree-container">
    <div class="tree-title">2. USER AUTHENTICATION & IDENTITY VERIFICATION TREE</div>
├── 2. User Authentication & Identity Verification
│   ├── Login / Signup View (components/auth/LoginModal.jsx or /login route)
│   ├── Choose Authentication Method
│   │   ├── Method A: Local Email & Password Credentials
│   │   │   ├── User enters email address & password string
│   │   │   ├── Client input validation (Format check, non-empty fields)
│   │   │   ├── Send request to Backend API ──► POST /api/account/login
│   │   │   ├── Express Auth Router checks User model in MongoDB Atlas
│   │   │   └── Verify Password via bcrypt.compare(candidatePassword, hashedSalt)
│   │   └── Method B: Google OAuth 2.0 Social Login
│   │       ├── Click "Sign in with Google" (@react-oauth/google component)
│   │       ├── Authenticate via Google Identity Services popup
│   │       └── Send OAuth ID Token to Backend API ──► Verify token & upsert User document
│   └── Authentication Result Processing
│       ├── SUCCESS: HTTP 200 OK
│       │   ├── Issue signed JWT Bearer Token (signed with JWT_SECRET, containing userId, email, role)
│       │   ├── Save Token in localStorage.getItem('aisa_token')
│       │   ├── Populate User profile & credit balance in WorkspaceContext.jsx
│       │   └── Continue to Dashboard Workspace Selection
│       └── FAILURE: HTTP 401 Unauthorized
│           ├── Display error alert: "Invalid email or password credentials"
│           └── Allow user to retry authentication or request password reset
  </div>

  <!-- SECTION 3 & 4 -->
  <div class="page-break"></div>
  <h1>3 & 4. Dashboard & Workspace Scoping Hierarchy</h1>

  <div class="tree-container">
    <div class="tree-title">3 & 4. DASHBOARD & WORKSPACE MANAGEMENT TREE</div>
├── 3. Dashboard Initialization & State Scoping
│   ├── Mount DashboardModule.jsx view
│   ├── Load Authenticated User Information (User.name, User.email, User.credits, User.plan)
│   ├── Fetch Available Workspaces ──► GET /api/workspace/list (Query MongoDB Workspaces by userEmail)
│   ├── Select Active Workspace
│   │   ├── Active Workspace Exists ──► Set activeWorkspace in WorkspaceContext.jsx
│   │   └── No Workspace Exists ──► Trigger Brand Scraping & Workspace Creation Modal
│   └── Load Canonical Brand Profile ──► GET /api/brand/:workspaceId
│       └── Mount Navigation Drawer / Sidebar (Sidebar.jsx) & Open Selected Feature Module
│
├── 4. Workspace & Brand Scoping Management
│   ├── Multi-Tenant Brand Workspaces
│   │   ├── Select Existing Brand ──► Switch activeWorkspace ID, update context & reload brand profile
│   │   ├── Create New Brand Workspace ──► POST /api/workspace/create
│   │   │   ├── Enter Brand Name, Domain URL, Target Audience & Positioning Summary
│   │   │   ├── Validate input data & write Workspace document to MongoDB Atlas
│   │   │   └── Increment User.workspacesCreatedCount counter
│   │   └── Manage Brand-Specific Settings & Team Roles (TeamRbacModule.jsx)
│   └── Personal Brand Workspace
│       └── Scopes strategy roadmaps, social copy & ad visual credits strictly to active workspace
  </div>

  <!-- SECTION 5 & 6 -->
  <h1>5 & 6. Brand DNA Engine, SEO & Marketing Strategy Hierarchy</h1>

  <div class="tree-container">
    <div class="tree-title">5 & 6. BRAND DNA EXTRACTION & SEO STRATEGY TREE</div>
├── 5. Brand Management & Brand DNA Extraction Pipeline
│   ├── User enters Brand Domain URL (e.g. https://example.com) & triggers Analysis
│   ├── Submit Analysis Request ──► POST /api/brand/analyze
│   ├── Backend Asynchronous Processing (scraper.service.js)
│   │   ├── Launch Headless Puppeteer Browser Instance (Minimum 2GB RAM container allocation)
│   │   ├── Crawl DOM HTML, Meta Titles, Descriptions, Favicons & Logo URLs
│   │   ├── Sample Color Palette ──► Execute node-vibrant on image buffers to extract hex colors
│   │   └── Dispatch DOM Data to Google Cloud Vertex AI ──► Model: gemini-3.5-flash
│   ├── Multi-Agent Brand DNA Extraction (brandIntelligence.service.js)
│   │   ├── Extract Tone of Voice, Formality Score (1-5), Content Pillars & Target Audience
│   │   ├── Extract Core Products, Brand Values, Do/Don't Words & Approved Claims
│   │   └── Execute Brand Validation Agent (brandValidatorAgent.js) for Confidence Audit
│   └── Audit Result & Persistence
│       ├── Confidence Score >= 85% ──► Set Status = SUCCESS
│       ├── Confidence Score < 85% ──► Flag Unverified Claims for User Review
│       ├── Upsert Canonical BrandProfile Document in MongoDB Atlas
│       └── Display Structured Brand DNA Results in BrandDnaModule.jsx
│
├── 6. Marketing & SEO Intelligence Tools
│   ├── SEO Intelligence Engine (SeoModule.jsx)
│   │   ├── Keyword Intent Clustering ──► POST /api/seo/keywords/cluster
│   │   │   └── Group into 12+ Intent Clusters (Informational, Commercial, Transactional)
│   │   ├── SEO Content Brief Builder ──► POST /api/seo/brief/generate
│   │   │   └── Save Brief to MongoDB Atlas contents Collection (type: SEO_BRIEF)
│   │   └── Real AI Blog Article Generation ──► POST /api/seo/article/generate
│   └── Marketing Strategy Hub (StrategyModule.jsx)
│       ├── 30-Day Marketing Roadmap Generator ──► POST /api/workspace/:id/generate-strategy
│       └── Single-Card AI Regeneration ──► POST /api/workspace/:id/regenerate-strategy-card
  </div>

  <!-- SECTION 7 & 8 -->
  <div class="page-break"></div>
  <h1>7 & 8. Content Production, AI Web Builder & Calendar Hierarchy</h1>

  <div class="tree-container">
    <div class="tree-title">7 & 8. CONTENT PRODUCTION, CREATIVE & CALENDAR SCHEDULING TREE</div>
├── 7. Content & Creative Production Workflow
│   ├── Select Active Workspace & Open Targeted Tool (ContentStudioModule.jsx / CreativeStudioModule.jsx)
│   ├── Feature Tool A: Multi-Platform Social Copywriter
│   │   ├── Select Platform (LinkedIn, Instagram, X/Twitter, Facebook) & enter prompt topic
│   │   └── Send Request ──► POST /api/content/social/generate (Gemini 3.5 Flash)
│   ├── Feature Tool B: AI Ad Visual Creative Generator (Creative Studio)
│   │   ├── Select Aspect Ratio (1:1, 16:9, 9:16) & Art Style
│   │   ├── Atomic Visual Credit Check via creditService.js
│   │   │   ├── User.credits > 0 ──► Proceed to Generation
│   │   │   └── User.credits = 0 ──► Reject with HTTP 403: "Insufficient visual credits. Please top up."
│   │   ├── Trigger Image Generation ──► POST /api/creative/visual/generate
│   │   ├── Execute Vertex AI Model ──► Model: gemini-3.1-flash-image ($0.03 unit cost)
│   │   ├── Generate 4x Visual Variations via brandVisualResolver.js
│   │   └── Atomically Deduct 1 Credit from User.credits & Write Audit Entry in CreditLog
│   ├── Feature Tool C: Multi-Step AI Website Builder (websiteBuilder/)
│   │   ├── Step 1: Brief Analysis ──► POST /api/website-builder/analyze (Gemini 3.5 Flash)
│   │   ├── Step 2: Code Generation ──► POST /api/website-builder/generate (Compiles HTML5 & CSS3 layout)
│   │   ├── Step 3: Hero Visual Generation ──► Generate hero banner image via Gemini 3.1 Flash Image
│   │   └── Step 4: Live Chat Inline Edit ──► POST /api/website-builder/chat-edit (v1 -> v2 versioning)
│   └── Content Output Actions
│       ├── Save to Asset Library ──► POST /api/content/save-asset (Upload stream to GCS ai-ads-creatives)
│       └── Submit for Approval / Calendar Scheduling
│           ├── postApprovalRequired = true ──► Set status = Pending & submit to Approvals Desk Queue
│           └── postApprovalRequired = false ──► Set status = Approved & schedule on Content Calendar
│
├── 8. Calendar, Approvals & Media Management
│   ├── Content Calendar Management (CalendarModule.jsx)
│   │   ├── Drag-and-Drop Post Scheduling ──► Update post date & status = Scheduled in MongoDB
│   ├── Approvals Desk Workflow (ApprovalsDeskModule.jsx)
│   │   ├── Review Pending Queue ──► Manager Action (APPROVE / REJECT)
│   └── Asset Library & Storage (AssetLibraryModule.jsx)
│       ├── Stream media files to Google Cloud Storage bucket (ai-ads-creatives)
│       └── Generate time-bounded signed CDN URLs via gcsStorageService.js
  </div>

  <!-- SECTION 9 & 10 -->
  <h1>9 & 10. Backend Engine Processing & Session Logout Hierarchy</h1>

  <div class="tree-container">
    <div class="tree-title">9 & 10. BACKEND PROCESSING & SESSION LOGOUT TREE</div>
├── 9. Backend Data Processing & Engine Pipeline
│   ├── Receive HTTP API Request at Express Server Port (server.js)
│   ├── Authentication & Security Checks (backend/middleware/auth.js)
│   │   ├── requireAuth ──► Validate Bearer JWT Token signature & user lookup
│   │   └── CORS Security Check ──► Verify whitelisted origins (aiads.aisa24.com, localhost)
│   ├── Rate Limiting & Diagnostic Telemetry (SystemHitCounter Middleware)
│   │   └── Increment persistent platform API hit counter in MongoDB SystemSetting (total_api_hits)
│   ├── Execute Business Logic in Controller Router & Query MongoDB Atlas via Mongoose ODM
│   ├── Multi-Model AI Service Execution Pipeline (aiService.js)
│   │   ├── Primary Model Call ──► Google Cloud Vertex AI (@google/genai SDK in asia-south1)
│   │   └── Failover Trigger ──► If Vertex AI returns 429/5xx, execute OpenAI gpt-4o API
│   └── Return API Response
│       ├── SUCCESS ──► HTTP 200 OK JSON { success: true, payload }
│       └── FAILURE ──► HTTP 400/401/403/500 JSON { success: false, error: message } (Error Stack Masked)
│
└── 10. Account & Session Management
    ├── User Settings Modal (SettingsBillingModule.jsx & SettingsModal.jsx)
    │   ├── View Profile, Billing GSTIN & Company Address
    │   └── Manage Subscription Plans ($9.99 Starter to $199.99 Enterprise) & Credit Top-Up Packs
    ├── Account Permanent Deletion Request
    │   ├── Trigger 6-Digit OTP Email Verification ──► POST /api/account/send-delete-otp
    │   ├── Validate OTP Security Code ──► POST /api/account/verify-delete-otp
    │   └── Execute Permanent Account Deletion ──► DELETE /api/admin/user/:id
    └── User Session Logout
        ├── Click "Sign Out" in Sidebar.jsx or Header.jsx
        ├── Clear Client Session State in WorkspaceContext.jsx
        ├── Clear Tokens ──► localStorage.removeItem('aisa_token') & current_workspace_id
        └── Reset State & Redirect User to Login Screen (/login)
  </div>

</body>
</html>
`;

async function generateHierarchyPDF() {
  console.log('🚀 Starting Project Working Hierarchy PDF Generation via Puppeteer...');
  
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
        <span>AI Ads™ Enterprise Platform (v2.0) — Project Working Hierarchy</span>
        <span>PWH-AIADS-2026-V2.0</span>
      </div>
    `,
    footerTemplate: `
      <div style="font-family: 'Inter', sans-serif; font-size: 7.5pt; color: #64748b; width: 100%; padding: 0 15mm; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #cbd5e1; padding-top: 4px;">
        <span>Confidential Project Working Hierarchy Specification</span>
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

  // Copy to secondary path
  fs.copyFileSync(pdfOutputPath1, pdfOutputPath2);

  await browser.close();
  console.log(`✅ Project Working Hierarchy PDF generated successfully at:\n 1: ${pdfOutputPath1}\n 2: ${pdfOutputPath2}`);
}

generateHierarchyPDF().catch((err) => {
  console.error('❌ Error generating Hierarchy PDF:', err);
  process.exit(1);
});
