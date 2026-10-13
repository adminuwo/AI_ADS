const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const pdfOutputPath1 = 'c:/Users/uwo24/Desktop/AI ADS/Project_Documents/AI_ADS_Workflow_Diagrams.pdf';
const pdfOutputPath2 = 'c:/Users/uwo24/Desktop/AI ADS/Project_Documents/docs/AI_ADS_Workflow_Diagrams.pdf';

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Workflow & Flowchart Documentation - AI Ads Enterprise Platform</title>
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
      font-size: 9pt;
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
      border-bottom: 3px solid #06b6d4;
      padding-bottom: 20px;
    }

    .cover-badge {
      display: inline-block;
      background: #155e75;
      color: #67e8f9;
      font-weight: 700;
      font-size: 8.5pt;
      padding: 4px 14px;
      border-radius: 20px;
      border: 1px solid #06b6d4;
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
      border-left: 4px solid #06b6d4;
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
      font-size: 14.5pt;
      font-weight: 700;
      color: #0f172a;
      border-bottom: 2px solid #cbd5e1;
      padding-bottom: 6px;
      margin-top: 22px;
      margin-bottom: 10px;
      letter-spacing: -0.3px;
    }

    h2 {
      font-size: 11.5pt;
      font-weight: 600;
      color: #1e3a8a;
      margin-top: 16px;
      margin-bottom: 8px;
    }

    p {
      margin-top: 0;
      margin-bottom: 8px;
      color: #334155;
      text-align: justify;
    }

    /* Flowchart Container */
    .flow-container {
      background-color: #0f172a;
      color: #f8fafc;
      padding: 16px;
      border-radius: 8px;
      margin: 12px 0;
      border: 1px solid #334155;
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.5pt;
      line-height: 1.35;
      overflow-x: auto;
    }

    .flow-title {
      font-family: 'Inter', sans-serif;
      font-size: 9.5pt;
      font-weight: 700;
      color: #38bdf8;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge {
      display: inline-block;
      font-size: 7.5pt;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .badge-cyan { background: #cff4fc; color: #055160; }
    .badge-green { background: #dcfce7; color: #166534; }

    .callout {
      background-color: #eff6ff;
      border-left: 4px solid #2563eb;
      padding: 8px 12px;
      border-radius: 0 6px 6px 0;
      margin: 10px 0;
      font-size: 8.5pt;
    }

    /* TOC */
    .toc-list {
      list-style: none;
      padding-left: 0;
    }

    .toc-item {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      border-bottom: 1px dotted #cbd5e1;
      font-size: 8.5pt;
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
      <span class="cover-badge">Verified Workflow Diagrams</span>
      <h1 class="cover-title">SYSTEM WORKFLOW & FLOWCHART SPECIFICATION</h1>
      <div class="cover-subtitle">AI Ads™ Enterprise Platform (v2.0 Architectural Workflows)</div>
    </div>

    <div class="cover-body">
      <div class="cover-desc">
        This document provides source-code verified flowcharts, sequence models, and process data pipelines for the <strong>AI Ads™ Enterprise Platform</strong>. Spanning 7 core operational workflows—including client request routing, JWT authentication, multi-agent Brand DNA scraping, SEO intelligence, campaign & AI visual generation, content calendar scheduling, and API error handling pipelines.
      </div>

      <div class="meta-grid">
        <div class="meta-card">
          <div class="label">Document ID</div>
          <div class="value">WFD-AIADS-2026-V2.0</div>
        </div>
        <div class="meta-card">
          <div class="label">Editable Source File</div>
          <div class="value">AI_ADS_Workflow_Diagrams.md</div>
        </div>
        <div class="meta-card">
          <div class="label">Author / Organization</div>
          <div class="value">AI Ads Systems & Architecture Team</div>
        </div>
        <div class="meta-card">
          <div class="label">Diagram Standard</div>
          <div class="value">Mermaid & Visual Process Flowcharts</div>
        </div>
        <div class="meta-card">
          <div class="label">Date of Issue</div>
          <div class="value">October 10, 2026</div>
        </div>
        <div class="meta-card">
          <div class="label">Verification Status</div>
          <div class="value"><span class="badge badge-green">VERIFIED CODEBASE FLOWS</span></div>
        </div>
      </div>
    </div>

    <div class="cover-footer">
      <div>AI Ads™ Platform &copy; 2026. All Rights Reserved.</div>
      <div>Confidential Workflow Specification</div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- TABLE OF CONTENTS -->
  <h1>Table of Contents</h1>
  <div class="toc-list">
    <div class="toc-item"><span class="toc-title">1. Overall System Architecture & Request Workflow</span><span class="toc-num">Workflow 1</span></div>
    <div class="toc-item"><span class="toc-title">2. User Login, Authentication & Workspace Selection Workflow</span><span class="toc-num">Workflow 2</span></div>
    <div class="toc-item"><span class="toc-title">3. Brand Creation & Brand DNA Extraction Workflow</span><span class="toc-num">Workflow 3</span></div>
    <div class="toc-item"><span class="toc-title">4. SEO Intelligence & Marketing Strategy Workflow</span><span class="toc-num">Workflow 4</span></div>
    <div class="toc-item"><span class="toc-title">5. Campaign Creation, Content/Creative Generation & Approval Workflow</span><span class="toc-num">Workflow 5</span></div>
    <div class="toc-item"><span class="toc-title">6. Calendar, Asset Library & Content Publishing Workflow</span><span class="toc-num">Workflow 6</span></div>
    <div class="toc-item"><span class="toc-title">7. API Request, Error Handling & Data Flow Pipeline</span><span class="toc-num">Workflow 7</span></div>
  </div>

  <div class="callout" style="margin-top: 15px;">
    <div class="callout-title">SOURCE-CODE ALIGNED FLOWCHART SPECIFICATION</div>
    All 7 flowcharts documented in this specification correspond directly to verified backend routers (<code>backend/routes/</code>), controller functions, Mongoose models, and React context providers (<code>WorkspaceContext.jsx</code>).
  </div>

  <!-- WORKFLOW 1 -->
  <h1>1. Overall System Architecture & Request Workflow</h1>
  <p>
    Maps client interaction from Web React SPA or Mobile clients through authentication middleware, Cloud Run container routing, database storage, and Vertex AI model execution.
  </p>

  <div class="flow-container">
    <div class="flow-title">FIGURE 1.1: OVERALL SYSTEM END-TO-END FLOWCHART</div>
 [CLIENT TIER]
   │ Web Browser (React SPA) / Mobile Client (PWA / REST)
   └───────────────────────────────┬───────────────────────────────┘
                                   │ HTTPS / WSS Requests
                                   ▼
 [BACKEND ROUTER & MIDDLEWARE]
   ┌───────────────────────────────────────────────────────────────┐
   │ Express API Server (server.js)                                │
   │ ├── requireAuth Middleware (Validates JWT Bearer Header)       │
   │ └── SystemHitCounter Middleware (Increments total_api_hits)   │
   └───────────────────────────────┬───────────────────────────────┘
                                   │
                                   ▼
 [SERVICE & EXECUTION PIPELINE]
   ┌───────────────────────────────┴───────────────────────────────┐
   │ Target Controller Action                                      │
   │ ├── MongoDB Atlas: Query / Upsert Document                     │
   │ ├── Headless Puppeteer: Web Scraper & DOM Crawl               │
   │ ├── Vertex AI (asia-south1): Gemini 3.5 Flash / Pro (Text)    │
   │ ├── Vertex AI (Global): Gemini 3.1 Flash Image / Imagen 3     │
   │ └── Failover Chain: OpenAI gpt-4o (On 429/5xx Error)          │
   └───────────────────────────────┬───────────────────────────────┘
                                   │
                                   ▼
 [RESPONSE FORMATTING]
   └───────────────► Return HTTP 200 OK JSON { success: true, payload }
  </div>

  <!-- WORKFLOW 2 -->
  <div class="page-break"></div>
  <h1>2. User Login, Authentication & Workspace Selection Workflow</h1>
  <p>
    Details the login process, JWT token generation, local storage persistence, workspace listing, and reactive workspace context initialization.
  </p>

  <div class="flow-container">
    <div class="flow-title">FIGURE 2.1: AUTHENTICATION & WORKSPACE SELECTION FLOWCHART</div>
 User Input (Email & Password)
               │
               ▼
 POST /api/account/login ──► Check bcrypt Password Hash in MongoDB User
                                         │
                    ┌────────────────────┴────────────────────┐
                    │ Valid Credentials?                      │
                   ┌┴────────┐                       ┌────────┴┐
                   │   YES   │                       │   NO    │
                   └────┬────┘                       └────┬────┘
                        │                                 │
                        ▼                                 ▼
   Generate JWT Bearer Token                     Return HTTP 401 Unauthorized
   (Contains userId, email, role)                { success: false, error }
                        │
                        ▼
   Client Stores Token in localStorage.aisa_token
                        │
                        ▼
   GET /api/workspace/list ──► Query MongoDB Workspaces by userEmail
                                         │
                    ┌────────────────────┴────────────────────┐
                    │ Workspaces Found?                       │
                   ┌┴────────┐                       ┌────────┴┐
                   │   YES   │                       │   NO    │
                   └────┬────┘                       └────┬────┘
                        │                                 │
                        ▼                                 ▼
   Set WorkspaceContext.activeWorkspace          Prompt User to Create
   Load Canonical BrandProfile Document          First Brand Workspace
                        │
                        ▼
   Dashboard Operations Ready
  </div>

  <!-- WORKFLOW 3 -->
  <h1>3. Brand Creation & Brand DNA Extraction Workflow</h1>
  <p>
    Documents headless web scraping, color palette sampling via <code>node-vibrant</code>, multi-agent AI identity structuring, confidence score verification, and database persistence.
  </p>

  <div class="flow-container">
    <div class="flow-title">FIGURE 3.1: BRAND SCRAPING & BRAND DNA EXTRACTION PIPELINE</div>
 Input Target Domain URL & Brand Name
               │
               ▼
 POST /api/brand/analyze ──► Launch Headless Puppeteer Browser Instance
                                         │
                                         ▼
                             Crawl HTML DOM, Favicon & Metadata
                                         │
                                         ▼
                             Sample Color Palette via node-vibrant
                                         │
                                         ▼
                             Execute Gemini 3.5 Flash Multi-Agent Agent
                                         │
                                         ▼
                             Extract Tone, Voice Formality (1-5),
                             Content Pillars & Approved Claims
                                         │
                                         ▼
                             Run Brand Validation Agent Confidence Audit
                                         │
                    ┌────────────────────┴────────────────────┐
                    │ Confidence Score >= 85%?                │
                   ┌┴────────┐                       ┌────────┴┐
                   │   YES   │                       │   NO    │
                   └────┬────┘                       └────┬────┘
                        │                                 │
                        ▼                                 ▼
   Set Status = SUCCESS                          Flag Unverified Claims for Review
                        │                                 │
                        └────────────────┬────────────────┘
                                         │
                                         ▼
                   Upsert Canonical BrandProfile in MongoDB Atlas
  </div>

  <!-- WORKFLOW 4 -->
  <div class="page-break"></div>
  <h1>4. SEO Intelligence & Marketing Strategy Workflow</h1>
  <p>
    Illustrates keyword intent clustering, SEO brief compilation, 30-day marketing roadmap generation, and single-card AI regeneration.
  </p>

  <div class="flow-container">
    <div class="flow-title">FIGURE 4.1: SEO INTELLIGENCE & STRATEGY HUB WORKFLOW</div>
 Select Active Workspace Container (ws_001)
               │
               ├─────────────────────────────────────────┐
               │ (SEO Keyword Audit)                     │ (30-Day Strategy Roadmap)
               ▼                                         ▼
 POST /api/seo/keywords/cluster           POST /api/workspace/:id/generate-strategy
               │                                         │
               ▼                                         ▼
 Gemini 3.5 Flash Clusters Keywords       Fetch BrandProfile & Objectives
 (Informational, Commercial, Transactional)              │
               │                                         ▼
               ▼                          Generate 30-Day Marketing Roadmap
 POST /api/seo/brief/generate             (Weekly Themes & Platform Mix)
               │                                         │
               ▼                                         ▼
 Build SEO Content Brief                  Single-Card Regeneration Triggered?
 (H1-H3 Outlines & LSI Terms)                           │
               │                                ┌────────┴────────┐
               ▼                                │ YES             │ NO
 Save Brief to MongoDB contents                 ▼                 ▼
                                          Regenerate Card    Strategy Ready
  </div>

  <!-- WORKFLOW 5 -->
  <h1>5. Campaign Creation, Content/Creative Generation & Approval Workflow</h1>
  <p>
    Details multi-channel campaign planning, social copywriting, AI visual banner generation with credit deduction auditing, and post approval desk queues.
  </p>

  <div class="flow-container">
    <div class="flow-title">FIGURE 5.1: CAMPAIGN, CREATIVE GENERATION & APPROVAL FLOWCHART</div>
 Create Campaign Container ──► POST /api/campaigns ──► Save Campaign in MongoDB
                                                              │
               ┌──────────────────────────────────────────────┴──────────────────────────────────────────────┐
               │ (Social / Blog Copywriting)                                                                 │ (AI Ad Visual Banner)
               ▼                                                                                             ▼
 POST /api/content/social/generate                                                           Check User Credit Balance in MongoDB User.credits
               │                                                                                             │
               ▼                                                                        ┌────────────────────┴────────────────────┐
 Generate Platform-Tailored Copy                                                        │ User Credits > 0?                       │
 (LinkedIn / Instagram / Twitter / FB)                                                 ┌┴────────┐                       ┌────────┴┐
               │                                                                       │   YES   │                       │   NO    │
               │                                                                       └────┬────┘                       └────┬────┘
               │                                                                            │                                 │
               │                                                                            ▼                                 ▼
               │                                                        POST /api/creative/visual/generate       Return HTTP 403 Insufficient
               │                                                                            │                    Visual Credits Error
               │                                                                            ▼
               │                                                        Execute Vertex AI: gemini-3.1-flash-image
               │                                                                            │
               │                                                                            ▼
               │                                                        Deduct 1 Credit & Log Entry in CreditLog
               │                                                                            │
               └──────────────────────────────────────┬─────────────────────────────────────┘
                                                      │
                                                      ▼
                                       Post Approval Required (postApprovalRequired)?
                                                      │
                                     ┌────────────────┴────────────────┐
                                     │ YES                             │ NO
                                     ▼                                 ▼
                        Set approvalStatus = Pending        Set status = Scheduled
                        Submit to Approvals Desk Queue
  </div>

  <!-- WORKFLOW 6 -->
  <div class="page-break"></div>
  <h1>6. Calendar, Asset Library & Content Publishing Workflow</h1>
  <p>
    Details content calendar drag-and-drop scheduling, Google Cloud Storage asset persistence with signed CDN URLs, and social media publishing readiness.
  </p>

  <div class="flow-container">
    <div class="flow-title">FIGURE 6.1: CALENDAR SCHEDULING & ASSET LIBRARY PIPELINE</div>
 Approved Content & Visual Creatives
               │
               ├─────────────────────────────────────────┐
               │ (Save Asset to Library)                 │ (Schedule on Content Calendar)
               ▼                                         ▼
 POST /api/content/save-asset             Drag & Drop Post onto Target Date in Calendar
               │                                         │
               ▼                                         ▼
 Stream File to GCS Bucket ai-ads-creatives      POST /api/calendar/entries or PUT /api/campaigns
               │                                         │
               ▼                                         ▼
 Generate Time-Bounded Signed Access URL         Update Scheduled Date & Status = Scheduled
               │                                         │
               ▼                                         ▼
 Save Asset Metadata in MongoDB                  Render Post Entry on Calendar Grid
               │                                         │
               └────────────────┬────────────────────────┘
                                │
                                ▼
         Ready for Social Media Publishing API Integration
  </div>

  <!-- WORKFLOW 7 -->
  <h1>7. API Request, Error Handling & Data Flow Pipeline</h1>
  <p>
    Documents request validation, authentication middleware verification, rate-limiting checks, multi-model AI failover execution, and production error response masking.
  </p>

  <div class="flow-container">
    <div class="flow-title">FIGURE 7.1: API ERROR HANDLING & FAILOVER SEQUENCE</div>
 Client Application Request (Header: Authorization Bearer &lt;JWT&gt;)
               │
               ▼
 requireAuth Middleware ──► Valid JWT Token Signature?
                                     │
                ┌────────────────────┴────────────────────┐
                │ YES                                     │ NO
                ▼                                         ▼
 SystemHitCounter Middleware               Return HTTP 401 Unauthorized
 (Increment total_api_hits)                { success: false, error: 'Authentication required' }
                │
                ▼
 Execute Controller Action
                │
 ┌──────────────┴──────────────┐
 │ Execute Database Operation  │ Execute AI Generation Operation
 ▼                             ▼
 Query / Update MongoDB       Call Vertex AI (@google/genai SDK in asia-south1)
 Document Payload                              │
                │             ┌────────────────┴────────────────┐
                │             │ Vertex AI Success?              │
                │            ┌┴────────┐               ┌────────┴┐
                │            │   YES   │               │   NO    │ (429 Rate Limit / 5xx)
                │            └────┬────┘               └────┬────┘
                │                 │                         │
                │                 ▼                         ▼
                │          Return Vertex AI         Failover to OpenAI gpt-4o API
                │          Generated Output                 │
                │                 │                         ▼
                │                 │                 Return OpenAI Output
                └─────────────────┼─────────────────────────┘
                                  │
                                  ▼
             Return HTTP 200 OK Response Payload
  </div>

</body>
</html>
`;

async function generateWorkflowPDF() {
  console.log('🚀 Starting Workflow Diagrams PDF Generation via Puppeteer...');
  
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
        <span>AI Ads™ Enterprise Platform (v2.0) — Workflow &amp; Flowchart Document</span>
        <span>WFD-AIADS-2026-V2.0</span>
      </div>
    `,
    footerTemplate: `
      <div style="font-family: 'Inter', sans-serif; font-size: 7.5pt; color: #64748b; width: 100%; padding: 0 15mm; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #cbd5e1; padding-top: 4px;">
        <span>Confidential Workflow Specification</span>
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
  console.log(`✅ Workflow Diagrams PDF generated successfully at:\n 1: ${pdfOutputPath1}\n 2: ${pdfOutputPath2}`);
}

generateWorkflowPDF().catch((err) => {
  console.error('❌ Error generating Workflow PDF:', err);
  process.exit(1);
});
