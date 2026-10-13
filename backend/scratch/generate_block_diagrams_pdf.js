const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const pdfOutputPath1 = 'c:/Users/uwo24/Desktop/AI ADS/Project_Documents/AI_ADS_Block_Flow_Diagrams.pdf';
const pdfOutputPath2 = 'c:/Users/uwo24/Desktop/AI ADS/Project_Documents/AI_ADS_Workflow_Diagrams.pdf';
const pdfOutputPath3 = 'c:/Users/uwo24/Desktop/AI ADS/Project_Documents/docs/AI_ADS_Block_Flow_Diagrams.pdf';

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Block Flow Diagrams - AI Ads Enterprise Platform</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

    @page {
      size: A4 landscape;
      margin: 12mm 12mm 12mm 12mm;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #0f172a;
      background-color: #f8fafc;
      line-height: 1.4;
      font-size: 8.5pt;
      margin: 0;
      padding: 0;
    }

    .page-break {
      page-break-before: always;
    }

    /* Cover Page */
    .cover-page {
      height: 180mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 12mm 12mm;
      border: 2px solid #0f172a;
      border-radius: 8px;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: #ffffff;
    }

    .cover-header {
      border-bottom: 3px solid #38bdf8;
      padding-bottom: 15px;
    }

    .cover-badge {
      display: inline-block;
      background: #0284c7;
      color: #e0f2fe;
      font-weight: 700;
      font-size: 8.5pt;
      padding: 4px 14px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }

    .cover-title {
      font-size: 24pt;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 8px 0;
      letter-spacing: -0.5px;
    }

    .cover-subtitle {
      font-size: 13pt;
      color: #cbd5e1;
      margin: 0;
    }

    .cover-desc {
      font-size: 9.5pt;
      color: #e2e8f0;
      line-height: 1.5;
      background: rgba(255, 255, 255, 0.06);
      padding: 16px;
      border-radius: 6px;
      border-left: 4px solid #38bdf8;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-top: 15px;
    }

    .meta-card {
      background: rgba(255, 255, 255, 0.08);
      padding: 10px 12px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .meta-card .label {
      font-size: 7pt;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      margin-bottom: 2px;
    }

    .meta-card .value {
      font-size: 8.5pt;
      font-weight: 600;
      color: #ffffff;
    }

    .cover-footer {
      border-top: 1px solid #334155;
      padding-top: 10px;
      display: flex;
      justify-content: space-between;
      font-size: 8pt;
      color: #94a3b8;
    }

    /* Diagram Section Headings */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0f172a;
      color: #ffffff;
      padding: 8px 14px;
      border-radius: 6px;
      margin-bottom: 12px;
    }

    .section-title {
      font-size: 11pt;
      font-weight: 700;
      margin: 0;
      color: #38bdf8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .section-tag {
      background: #1e293b;
      color: #94a3b8;
      font-size: 7.5pt;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid #334155;
    }

    /* Block Diagram Grid Layout */
    .block-diagram {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 10px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .block-grid-horiz {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .block-card {
      flex: 1;
      background: #f8fafc;
      border: 1.5px solid #94a3b8;
      border-radius: 6px;
      padding: 10px 12px;
      min-height: 95px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }

    .block-card-blue { border-color: #2563eb; background: #eff6ff; }
    .block-card-purple { border-color: #9333ea; background: #faf5ff; }
    .block-card-amber { border-color: #d97706; background: #fffbeb; }
    .block-card-emerald { border-color: #059669; background: #ecfdf5; }
    .block-card-rose { border-color: #e11d48; background: #fff1f2; }
    .block-card-cyan { border-color: #0891b2; background: #ecfeff; }

    .block-step {
      font-family: 'JetBrains Mono', monospace;
      font-size: 7pt;
      font-weight: 800;
      color: #475569;
      text-transform: uppercase;
      margin-bottom: 4px;
      display: flex;
      justify-content: space-between;
    }

    .block-card-blue .block-step { color: #1d4ed8; }
    .block-card-purple .block-step { color: #7e22ce; }
    .block-card-amber .block-step { color: #b45309; }
    .block-card-emerald .block-step { color: #047857; }
    .block-card-rose .block-step { color: #be123c; }

    .block-title {
      font-size: 9pt;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 4px;
      line-height: 1.25;
    }

    .block-desc {
      font-size: 7.5pt;
      color: #334155;
      line-height: 1.35;
    }

    .arrow-horiz {
      font-size: 14pt;
      color: #2563eb;
      font-weight: 800;
      padding: 0 2px;
      user-select: none;
    }

    .decision-block {
      background: #fef3c7;
      border: 2px dashed #d97706;
      border-radius: 6px;
      padding: 8px 10px;
      text-align: center;
      font-weight: 700;
      font-size: 8pt;
      color: #92400e;
    }

    .notes-box {
      background: #f1f5f9;
      border-left: 3px solid #0284c7;
      padding: 6px 10px;
      font-size: 8pt;
      color: #334155;
      margin-top: 10px;
      border-radius: 0 4px 4px 0;
    }
  </style>
</head>
<body>

  <!-- COVER PAGE -->
  <div class="cover-page">
    <div class="cover-header">
      <span class="cover-badge">Official Architecture Visuals</span>
      <h1 class="cover-title">BLOCK FLOW DIAGRAMS SPECIFICATION</h1>
      <div class="cover-subtitle">AI Ads™ Enterprise Platform (v2.0 Visual Process Flow)</div>
    </div>

    <div class="cover-body">
      <div class="cover-desc">
        This specification provides high-contrast, structured <strong>Block Flow Diagrams</strong> detailing the 7 core operational pipelines of the AI Ads™ Enterprise Platform. Derived directly from source-code workflows in <code>backend/server.js</code>, <code>backend/routes/</code>, <code>backend/services/</code>, and <code>frontend/src/context/WorkspaceContext.jsx</code>.
      </div>

      <div class="meta-grid">
        <div class="meta-card">
          <div class="label">Document ID</div>
          <div class="value">BFD-AIADS-2026-V2.0</div>
        </div>
        <div class="meta-card">
          <div class="label">Diagram Format</div>
          <div class="value">Structured Block Diagrams</div>
        </div>
        <div class="meta-card">
          <div class="label">Author / Organization</div>
          <div class="value">AI Ads Architecture Team</div>
        </div>
        <div class="meta-card">
          <div class="label">Total Flow Diagrams</div>
          <div class="value">7 Operational Block Flows</div>
        </div>
      </div>
    </div>

    <div class="cover-footer">
      <div>AI Ads™ Platform &copy; 2026. All Rights Reserved.</div>
      <div>Confidential Block Flow Diagram Specification</div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- DIAGRAM 1 -->
  <div class="section-header">
    <h2 class="section-title">Block Flow Diagram 1: Overall Platform System Architecture</h2>
    <span class="section-tag">End-to-End Execution Flow</span>
  </div>

  <div class="block-diagram">
    <div class="block-grid-horiz">
      <div class="block-card block-card-blue">
        <div class="block-step"><span>BLOCK 1</span><span>CLIENT TIER</span></div>
        <div class="block-title">Client Platform Interfaces</div>
        <div class="block-desc">Web Browser (React SPA) & Mobile PWA Clients send HTTPS REST requests with Bearer JWT tokens.</div>
      </div>

      <div class="arrow-horiz">➔</div>

      <div class="block-card block-card-purple">
        <div class="block-step"><span>BLOCK 2</span><span>GATEWAY TIER</span></div>
        <div class="block-title">Security & API Gateway</div>
        <div class="block-desc">CORS Whitelist check, <code>requireAuth</code> JWT verification, and System API Hit Counter logging.</div>
      </div>

      <div class="arrow-horiz">➔</div>

      <div class="block-card block-card-amber">
        <div class="block-step"><span>BLOCK 3</span><span>CONTROLLER</span></div>
        <div class="block-title">Controller Action Router</div>
        <div class="block-desc">Express Controller validates request body parameters and routes to specialized service handlers.</div>
      </div>

      <div class="arrow-horiz">➔</div>

      <div class="block-card block-card-rose">
        <div class="block-step"><span>BLOCK 4</span><span>AI ORCHESTRATOR</span></div>
        <div class="block-title">Multi-Model AI Engine</div>
        <div class="block-desc">Vertex AI (Gemini 3.5 Flash / Gemini 3.1 Image). Automatic failover to OpenAI <code>gpt-4o</code>.</div>
      </div>

      <div class="arrow-horiz">➔</div>

      <div class="block-card block-card-emerald">
        <div class="block-step"><span>BLOCK 5</span><span>PERSISTENCE</span></div>
        <div class="block-title">Data Storage & Response</div>
        <div class="block-desc">Mongoose saves document to MongoDB Atlas; media uploaded to GCS. Returns HTTP 200 JSON payload.</div>
      </div>
    </div>

    <div class="notes-box">
      <strong>Verified Source Code Mapping:</strong> Client SPA (<code>frontend/src/App.jsx</code>) ➔ Express Server (<code>backend/server.js</code>) ➔ Auth Middleware (<code>backend/middleware/auth.js</code>) ➔ AI Multi-Model Orchestrator (<code>backend/services/aiService.js</code>) ➔ MongoDB Atlas Database.
    </div>
  </div>

  <!-- DIAGRAM 2 -->
  <div style="margin-top: 15px;"></div>
  <div class="section-header">
    <h2 class="section-title">Block Flow Diagram 2: User Login & Workspace Authentication Flow</h2>
    <span class="section-tag">Identity & Session Pipeline</span>
  </div>

  <div class="block-diagram">
    <div class="block-grid-horiz">
      <div class="block-card block-card-blue">
        <div class="block-step"><span>BLOCK 1</span><span>USER INPUT</span></div>
        <div class="block-title">User Credentials Submission</div>
        <div class="block-desc">User enters email & password on <code>/login</code> screen or triggers Google OAuth button.</div>
      </div>

      <div class="arrow-horiz">➔</div>

      <div class="block-card block-card-purple">
        <div class="block-step"><span>BLOCK 2</span><span>AUTH SERVICE</span></div>
        <div class="block-title">Bcrypt Hash Verification</div>
        <div class="block-desc">Server queries User model by email and verifies password hash via <code>bcrypt.compare()</code>.</div>
      </div>

      <div class="arrow-horiz">➔</div>

      <div class="block-card block-card-emerald">
        <div class="block-step"><span>BLOCK 3</span><span>JWT ISSUANCE</span></div>
        <div class="block-title">Bearer Token Generation</div>
        <div class="block-desc">Generates signed JWT token containing userId, email & role. Saved in <code>localStorage.aisa_token</code>.</div>
      </div>

      <div class="arrow-horiz">➔</div>

      <div class="block-card block-card-cyan">
        <div class="block-step"><span>BLOCK 4</span><span>WORKSPACE API</span></div>
        <div class="block-title">Workspace Listing Query</div>
        <div class="block-desc">Calls <code>GET /api/workspace/list</code>. MongoDB queries workspaces matching user email.</div>
      </div>

      <div class="arrow-horiz">➔</div>

      <div class="block-card block-card-amber">
        <div class="block-step"><span>BLOCK 5</span><span>CONTEXT INIT</span></div>
        <div class="block-title">Active Workspace State</div>
        <div class="block-desc">Populates <code>WorkspaceContext.jsx</code> state, sets <code>activeWorkspace</code> & loads brand profile.</div>
      </div>
    </div>

    <div class="notes-box">
      <strong>Verified Source Code Mapping:</strong> Auth Controller (<code>backend/routes/accountRoutes.js</code>) ➔ User Model (<code>backend/models/User.js</code>) ➔ JWT Verification (<code>backend/middleware/auth.js</code>) ➔ Workspace Context (<code>frontend/src/context/WorkspaceContext.jsx</code>).
    </div>
  </div>

  <!-- DIAGRAM 3 -->
  <div class="page-break"></div>
  <div class="section-header">
    <h2 class="section-title">Block Flow Diagram 3: Brand Creation & Brand DNA Scraper Flow</h2>
    <span class="section-tag">Multi-Agent Crawling Pipeline</span>
  </div>

  <div class="block-diagram">
    <div class="block-grid-horiz">
      <div class="block-card block-card-blue">
        <div class="block-step"><span>BLOCK 1</span><span>REQUEST</span></div>
        <div class="block-title">Domain URL Submission</div>
        <div class="block-desc">User submits target domain URL & brand name to <code>POST /api/brand/analyze</code>.</div>
      </div>

      <div class="arrow-horiz">➔</div>

      <div class="block-card block-card-purple">
        <div class="block-step"><span>BLOCK 2</span><span>CRAWLER</span></div>
        <div class="block-title">Headless Web Scraping</div>
        <div class="block-desc">Puppeteer launches headless Chromium browser to crawl DOM HTML, favicons, logos & metadata.</div>
      </div>

      <div class="arrow-horiz">➔</div>

      <div class="block-card block-card-amber">
        <div class="block-step"><span>BLOCK 3</span><span>SAMPLING</span></div>
        <div class="block-title">Color Palette Sampling</div>
        <div class="block-desc"><code>node-vibrant</code> samples image pixels to compute dominant primary, secondary & background hex colors.</div>
      </div>

      <div class="arrow-horiz">➔</div>

      <div class="block-card block-card-rose">
        <div class="block-step"><span>BLOCK 4</span><span>AI EXTRACTION</span></div>
        <div class="block-title">Gemini 3.5 Brand Extraction</div>
        <div class="block-desc">Structures tone of voice, formality (1-5), pillars, target audience, approved & restricted claims.</div>
      </div>

      <div class="arrow-horiz">➔</div>

      <div class="block-card block-card-emerald">
        <div class="block-step"><span>BLOCK 5</span><span>PERSISTENCE</span></div>
        <div class="block-title">Confidence Audit & Upsert</div>
        <div class="block-desc">Validation Agent verifies score (85%+), upserts canonical <code>BrandProfile</code> document in MongoDB Atlas.</div>
      </div>
    </div>

    <div class="notes-box">
      <strong>Verified Source Code Mapping:</strong> Scraper Service (<code>backend/modules/workspace/scraper.service.js</code>) ➔ Brand Intelligence (<code>modules/workspace/brandIntelligence.service.js</code>) ➔ Brand Validator (<code>modules/brandDnaAgent/brandValidatorAgent.js</code>) ➔ BrandProfile Model.
    </div>
  </div>

  <!-- DIAGRAM 4 -->
  <div style="margin-top: 15px;"></div>
  <div class="section-header">
    <h2 class="section-title">Block Flow Diagram 4: SEO Intelligence & Marketing Strategy Flow</h2>
    <span class="section-tag">Content Strategy & SERP Engine</span>
  </div>

  <div class="block-diagram">
    <div class="block-grid-horiz">
      <div class="block-card block-card-blue">
        <div class="block-step"><span>BLOCK 1</span><span>INPUT</span></div>
        <div class="block-title">Seed Keyword & Domain</div>
        <div class="block-desc">User enters seed keyword or target URL in SEO Module or Strategy Hub.</div>
      </div>

      <div class="arrow-horiz">➔</div>

      <div class="block-card block-card-cyan">
        <div class="block-step"><span>BLOCK 2</span><span>CLUSTERING</span></div>
        <div class="block-title">Keyword Intent Clustering</div>
        <div class="block-desc"><code>POST /api/seo/keywords/cluster</code> invokes Gemini 3.5 to cluster 12+ keywords by search intent.</div>
      </div>

      <div class="arrow-horiz">➔</div>

      <div class="block-card block-card-purple">
        <div class="block-step"><span>BLOCK 3</span><span>SEO BRIEF</span></div>
        <div class="block-title">SEO Content Brief Builder</div>
        <div class="block-desc">Generates detailed SEO brief with H1-H3 outlines, LSI terms, target word count & saves to MongoDB.</div>
      </div>

      <div class="arrow-horiz">➔</div>

      <div class="block-card block-card-amber">
        <div class="block-step"><span>BLOCK 4</span><span>ROADMAP</span></div>
        <div class="block-title">30-Day Marketing Roadmap</div>
        <div class="block-desc"><code>customStrategyAgent.service.js</code> generates 30-day marketing plan grouped by weekly themes.</div>
      </div>

      <div class="arrow-horiz">➔</div>

      <div class="block-card block-card-emerald">
        <div class="block-step"><span>BLOCK 5</span><span>REGENERATION</span></div>
        <div class="block-title">Single-Card Regeneration</div>
        <div class="block-desc">Allows single-click AI regeneration of specific strategy cards without altering full roadmap.</div>
      </div>
    </div>

    <div class="notes-box">
      <strong>Verified Source Code Mapping:</strong> SEO Router (<code>backend/routes/seoRoutes.js</code>) ➔ Vertex SEO Service (<code>modules/seo/vertex.service.js</code>) ➔ Custom Strategy Service (<code>services/customStrategyAgent.service.js</code>) ➔ Content Model.
    </div>
  </div>

  <!-- DIAGRAM 5 -->
  <div class="page-break"></div>
  <div class="section-header">
    <h2 class="section-title">Block Flow Diagram 5: Campaign Creation, AI Visual Creative & Approval Flow</h2>
    <span class="section-tag">Creative Studio & Credit Pipeline</span>
  </div>

  <div class="block-diagram">
    <div class="block-grid-horiz">
      <div class="block-card block-card-blue">
        <div class="block-step"><span>BLOCK 1</span><span>CAMPAIGN</span></div>
        <div class="block-title">Campaign Container Setup</div>
        <div class="block-desc">User creates multi-channel campaign via <code>POST /api/campaigns</code>, defining budget, dates & frequency.</div>
      </div>

      <div class="arrow-horiz">➔</div>

      <div class="block-card block-card-purple">
        <div class="block-step"><span>BLOCK 2</span><span>COPYWRITING</span></div>
        <div class="block-title">Social Copy Generation</div>
        <div class="block-desc"><code>POST /api/content/social/generate</code> uses Gemini 3.5 to generate hooks, copy & hashtags.</div>
      </div>

      <div class="arrow-horiz">➔</div>

      <div class="block-card block-card-amber">
        <div class="block-step"><span>BLOCK 3</span><span>CREDIT CHECK</span></div>
        <div class="block-title">Visual Credit Verification</div>
        <div class="block-desc"><code>creditService.js</code> checks <code>User.credits &gt; 0</code>. Blocks action with 403 if balance is 0.</div>
      </div>

      <div class="arrow-horiz">➔</div>

      <div class="block-card block-card-rose">
        <div class="block-step"><span>BLOCK 4</span><span>IMAGE ENGINE</span></div>
        <div class="block-title">Gemini 3.1 Flash Image Gen</div>
        <div class="block-desc">Generates visual ad banner ($0.03 unit cost). Atomically deducts 1 credit & logs in <code>CreditLog</code>.</div>
      </div>

      <div class="arrow-horiz">➔</div>

      <div class="block-card block-card-emerald">
        <div class="block-step"><span>BLOCK 5</span><span>APPROVALS</span></div>
        <div class="block-title">Approvals Desk Queue</div>
        <div class="block-desc">If <code>postApprovalRequired</code> is true, sets status = Pending & submits to review queue.</div>
      </div>
    </div>

    <div class="notes-box">
      <strong>Verified Source Code Mapping:</strong> Campaign Router (<code>routes/campaignRoutes.js</code>) ➔ Brand Image Agent (<code>services/brandImageAgent.service.js</code>) ➔ Credit Service (<code>services/creditService.js</code>) ➔ CampaignPost Model.
    </div>
  </div>

  <!-- DIAGRAM 6 -->
  <div style="margin-top: 15px;"></div>
  <div class="section-header">
    <h2 class="section-title">Block Flow Diagram 6: Calendar Scheduling & Asset Storage Flow</h2>
    <span class="section-tag">Media Asset & Publishing Engine</span>
  </div>

  <div class="block-diagram">
    <div class="block-grid-horiz">
      <div class="block-card block-card-blue">
        <div class="block-step"><span>BLOCK 1</span><span>APPROVED</span></div>
        <div class="block-title">Approved Post Content</div>
        <div class="block-desc">Campaign post or creative asset approved by manager in Approvals Desk workspace.</div>
      </div>

      <div class="arrow-horiz">➔</div>

      <div class="block-card block-card-purple">
        <div class="block-step"><span>BLOCK 2</span><span>GCS UPLOAD</span></div>
        <div class="block-title">Google Cloud Storage Upload</div>
        <div class="block-desc"><code>gcsStorageService.js</code> streams image buffer to bucket <code>ai-ads-creatives</code>.</div>
      </div>

      <div class="arrow-horiz">➔</div>

      <div class="block-card block-card-cyan">
        <div class="block-step"><span>BLOCK 3</span><span>SIGNED URL</span></div>
        <div class="block-title">Signed CDN URL Generation</div>
        <div class="block-desc">Generates time-bounded signed CDN URL for secure asset downloading and display.</div>
      </div>

      <div class="arrow-horiz">➔</div>

      <div class="block-card block-card-amber">
        <div class="block-step"><span>BLOCK 4</span><span>CALENDAR</span></div>
        <div class="block-title">Drag-Drop Calendar Scheduling</div>
        <div class="block-desc">User drags post onto target date in <code>CalendarModule.jsx</code>, triggering <code>POST /api/calendar/entries</code>.</div>
      </div>

      <div class="arrow-horiz">➔</div>

      <div class="block-card block-card-emerald">
        <div class="block-step"><span>BLOCK 5</span><span>PUBLISHING</span></div>
        <div class="block-title">Publishing Readiness State</div>
        <div class="block-desc">MongoDB updates <code>status = Scheduled</code>. Ready for direct social publishing API dispatch.</div>
      </div>
    </div>

    <div class="notes-box">
      <strong>Verified Source Code Mapping:</strong> Storage Service (<code>backend/services/gcsStorageService.js</code>) ➔ Calendar Module (<code>frontend/src/components/modules/CalendarModule.jsx</code>) ➔ Calendar Model (<code>backend/models/Calendar.js</code>).
    </div>
  </div>

  <!-- DIAGRAM 7 -->
  <div class="page-break"></div>
  <div class="section-header">
    <h2 class="section-title">Block Flow Diagram 7: API Error Handling, Rate Limiting & Failover Flow</h2>
    <span class="section-tag">Gateway Resilience Pipeline</span>
  </div>

  <div class="block-diagram">
    <div class="block-grid-horiz">
      <div class="block-card block-card-blue">
        <div class="block-step"><span>BLOCK 1</span><span>REQUEST</span></div>
        <div class="block-title">Client API Request</div>
        <div class="block-desc">Client dispatches HTTP request with <code>Authorization: Bearer &lt;token&gt;</code> header.</div>
      </div>

      <div class="arrow-horiz">➔</div>

      <div class="block-card block-card-purple">
        <div class="block-step"><span>BLOCK 2</span><span>AUTH & LIMIT</span></div>
        <div class="block-title">Auth & Rate Limit Checks</div>
        <div class="block-desc"><code>requireAuth</code> verifies JWT signature. Rate limiter verifies request thresholds & logs API hit.</div>
      </div>

      <div class="arrow-horiz">➔</div>

      <div class="block-card block-card-amber">
        <div class="block-step"><span>BLOCK 3</span><span>PRIMARY AI</span></div>
        <div class="block-title">Google Vertex AI Call</div>
        <div class="block-desc">Executes prompt on Vertex AI using <code>@google/genai</code> SDK in region <code>asia-south1</code>.</div>
      </div>

      <div class="arrow-horiz">➔</div>

      <div class="block-card block-card-rose">
        <div class="block-step"><span>BLOCK 4</span><span>FAILOVER</span></div>
        <div class="block-title">OpenAI gpt-4o Failover</div>
        <div class="block-desc">If Vertex AI returns 429 rate limit or 5xx server error, automatically executes OpenAI <code>gpt-4o</code> API.</div>
      </div>

      <div class="arrow-horiz">➔</div>

      <div class="block-card block-card-emerald">
        <div class="block-step"><span>BLOCK 5</span><span>RESPONSE</span></div>
        <div class="block-title">Sanitized JSON Response</div>
        <div class="block-desc">Returns HTTP 200 OK JSON payload. Internal exceptions are masked to prevent error stack leaks.</div>
      </div>
    </div>

    <div class="notes-box">
      <strong>Verified Source Code Mapping:</strong> Auth Middleware (<code>backend/middleware/auth.js</code>) ➔ AI Multi-Model Orchestrator (<code>backend/services/aiService.js</code>) ➔ Express Global Error Handler.
    </div>
  </div>

</body>
</html>
`;

async function generateBlockDiagramsPDF() {
  console.log('🚀 Starting Block Flow Diagrams PDF Generation via Puppeteer...');
  
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
    landscape: true,
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-family: 'Inter', sans-serif; font-size: 7.5pt; color: #64748b; width: 100%; padding: 0 12mm; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">
        <span>AI Ads™ Enterprise Platform (v2.0) — Block Flow Diagrams Specification</span>
        <span>BFD-AIADS-2026-V2.0</span>
      </div>
    `,
    footerTemplate: `
      <div style="font-family: 'Inter', sans-serif; font-size: 7.5pt; color: #64748b; width: 100%; padding: 0 12mm; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #cbd5e1; padding-top: 4px;">
        <span>Confidential Block Flow Diagram Specification</span>
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>
    `,
    margin: {
      top: '15mm',
      bottom: '15mm',
      left: '12mm',
      right: '12mm'
    }
  });

  // Copy to secondary paths
  fs.copyFileSync(pdfOutputPath1, pdfOutputPath2);
  fs.copyFileSync(pdfOutputPath1, pdfOutputPath3);

  await browser.close();
  console.log(`✅ Block Flow Diagrams PDF generated successfully at:\n 1: ${pdfOutputPath1}\n 2: ${pdfOutputPath2}\n 3: ${pdfOutputPath3}`);
}

generateBlockDiagramsPDF().catch((err) => {
  console.error('❌ Error generating Block Flow Diagrams PDF:', err);
  process.exit(1);
});
