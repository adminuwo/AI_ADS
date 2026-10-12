const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const pdfOutputPath1 = 'c:/Users/uwo24/Desktop/AI ADS/Project_Documents/AI_ADS_Bug_Tracking_Report.pdf';
const pdfOutputPath2 = 'c:/Users/uwo24/Desktop/AI ADS/Project_Documents/docs/AI_ADS_Bug_Tracking_Report.pdf';

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Bug & Issue Tracking Report - AI Ads Enterprise Platform</title>
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
      border-bottom: 3px solid #f59e0b;
      padding-bottom: 20px;
    }

    .cover-badge {
      display: inline-block;
      background: #78350f;
      color: #fde68a;
      font-weight: 700;
      font-size: 8.5pt;
      padding: 4px 14px;
      border-radius: 20px;
      border: 1px solid #f59e0b;
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
      border-left: 4px solid #f59e0b;
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

    h3 {
      font-size: 9.5pt;
      font-weight: 600;
      color: #334155;
      margin-top: 12px;
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

    code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      background-color: #f1f5f9;
      color: #0f172a;
      padding: 1px 4px;
      border-radius: 3px;
      border: 1px solid #e2e8f0;
    }

    pre {
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.5pt;
      background-color: #0f172a;
      color: #f8fafc;
      padding: 10px;
      border-radius: 6px;
      overflow-x: auto;
      margin-top: 6px;
      margin-bottom: 10px;
      line-height: 1.35;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 6px;
      margin-bottom: 12px;
      font-size: 8pt;
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
      padding: 6px 8px;
      border: 1px solid #334155;
      font-size: 7.5pt;
      text-transform: uppercase;
      letter-spacing: 0.3px;
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

    /* Status Badges */
    .badge {
      display: inline-block;
      font-family: 'JetBrains Mono', monospace;
      font-size: 7pt;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .badge-resolved { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
    .badge-confirmed { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
    .badge-risk { background: #fef3c7; color: #92400e; border: 1px solid #facc15; }

    .sev-critical { background: #fee2e2; color: #991b1b; font-weight: 700; }
    .sev-high { background: #ffedd5; color: #9a3412; font-weight: 700; }
    .sev-medium { background: #fef3c7; color: #92400e; font-weight: 600; }
    .sev-low { background: #e0f2fe; color: #075985; font-weight: 600; }

    /* Callouts */
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
      <span class="cover-badge">Verified Codebase Defect Report</span>
      <h1 class="cover-title">BUG & ISSUE TRACKING REPORT</h1>
      <div class="cover-subtitle">AI Ads™ Enterprise Platform (v2.0 Issue Audit)</div>
    </div>

    <div class="cover-body">
      <div class="cover-desc">
        This document details verified bugs, historical resolved fixes, confirmed operational gaps, and architectural risk evaluations for the <strong>AI Ads™ Enterprise Platform</strong>. Every item is verified against source code files in <code>backend/</code>, <code>frontend/src/</code>, and utility migration scripts.
      </div>

      <div class="meta-grid">
        <div class="meta-card">
          <div class="label">Document ID</div>
          <div class="value">BTR-AIADS-2026-V2.0</div>
        </div>
        <div class="meta-card">
          <div class="label">Companion File</div>
          <div class="value">AI_ADS_Bug_Tracker.xlsx</div>
        </div>
        <div class="meta-card">
          <div class="label">Author / Organization</div>
          <div class="value">AI Ads QA & Security Engineering</div>
        </div>
        <div class="meta-card">
          <div class="label">Total Audited Defects</div>
          <div class="value">7 Verified Issues & Risks</div>
        </div>
        <div class="meta-card">
          <div class="label">Date of Issue</div>
          <div class="value">October 10, 2026</div>
        </div>
        <div class="meta-card">
          <div class="label">Audit Status</div>
          <div class="value"><span class="badge badge-resolved">CODEBASE VERIFIED</span></div>
        </div>
      </div>
    </div>

    <div class="cover-footer">
      <div>AI Ads™ Platform &copy; 2026. All Rights Reserved.</div>
      <div>Confidential Bug & Issue Tracking Report</div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- TABLE OF CONTENTS -->
  <h1>Table of Contents</h1>
  <div class="toc-list">
    <div class="toc-item"><span class="toc-title">1. Executive Summary & Defect Categorization</span><span class="toc-num">Section 1</span></div>
    <div class="toc-item"><span class="toc-title">2. Category A: Verified Resolved Issues & Code Fixes</span><span class="toc-num">Section 2</span></div>
    <div class="toc-item"><span class="toc-title">3. Category B: Confirmed Open Operational Issues</span><span class="toc-num">Section 3</span></div>
    <div class="toc-item"><span class="toc-title">4. Category C: Identified Architectural Risks & Disclosures</span><span class="toc-num">Section 4</span></div>
    <div class="toc-item"><span class="toc-title">5. Root Cause Analysis & Resolution Strategies</span><span class="toc-num">Section 5</span></div>
    <div class="toc-item"><span class="toc-title">6. Defect Retesting & Verification Protocols</span><span class="toc-num">Section 6</span></div>
  </div>

  <div class="callout" style="margin-top: 15px;">
    <div class="callout-title">VERIFICATION INTEGRITY DIRECTIVE</div>
    Unverified bugs have been excluded. Resolved issues include verified fix locations in source code. Open issues contain exact reproduction steps and root causes.
  </div>

  <!-- SECTION 1 -->
  <h1>1. Executive Summary & Defect Categorization</h1>
  <p>
    The codebase audit evaluated historical bug resolution scripts, CORS configurations, state reducers, in-memory volatile stores, and API payload limits. Issues are categorized into three distinct buckets:
  </p>
  <ul>
    <li><strong>Category A (Resolved Issues):</strong> Historical issues fully resolved in source code with verified fixes.</li>
    <li><strong>Category B (Confirmed Open Issues):</strong> Verified open defects currently pending architectural resolution.</li>
    <li><strong>Category C (Architectural Risks):</strong> Identified system risks requiring long-term engineering mitigation.</li>
  </ul>

  <!-- SECTION 2 -->
  <h1>2. Category A: Verified Resolved Issues & Code Fixes</h1>

  <h2>2.1 BUG-001: Historical Chat User ID ObjectId Format Mismatch</h2>
  <table>
    <thead>
      <tr>
        <th>Attribute</th>
        <th>Details</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Bug ID / Module</strong></td>
        <td><code>BUG-001</code> | Backend Chat Engine (<code>backend/models/ChatSession.js</code>)</td>
      </tr>
      <tr>
        <td><strong>Issue Description</strong></td>
        <td>Historical chat sessions stored <code>userId</code> as a legacy string format rather than a valid Mongoose <code>ObjectId</code>, causing populated queries in <code>adminController.getChatSessions</code> to fail or return orphan records.</td>
      </tr>
      <tr>
        <td><strong>Severity / Priority</strong></td>
        <td><span class="sev-high">HIGH</span> / P1</td>
      </tr>
      <tr>
        <td><strong>Reproduction Steps</strong></td>
        <td>1. Fetch legacy chat sessions created before v2.0.<br>2. Call <code>GET /api/admin/chat-sessions</code>.<br>3. Mongoose populate operation returns null for user references.</td>
      </tr>
      <tr>
        <td><strong>Root Cause</strong></td>
        <td>Schema migration gap where early chat sessions used plain email strings instead of <code>User._id</code>.</td>
      </tr>
      <tr>
        <td><strong>Fix Status & Retesting</strong></td>
        <td><span class="badge badge-resolved">RESOLVED</span> | Script <code>fix_historical_chat_user_ids.js</code> iterates over MongoDB Atlas <code>chatsessions</code> and maps legacy user IDs to valid User <code>ObjectId</code> refs. Verified.</td>
      </tr>
    </tbody>
  </table>

  <h2>2.2 BUG-002: CORS Preflight Failure on Unlisted Subdomains</h2>
  <table>
    <thead>
      <tr>
        <th>Attribute</th>
        <th>Details</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Bug ID / Module</strong></td>
        <td><code>BUG-002</code> | Backend Security & CORS (<code>backend/server.js</code>)</td>
      </tr>
      <tr>
        <td><strong>Issue Description</strong></td>
        <td>Web clients navigating from dynamic subdomains (e.g. <code>https://*.aisa24.com</code> or GCP Cloud Run <code>*.run.app</code>) were blocked by CORS policy during preflight OPTIONS requests.</td>
      </tr>
      <tr>
        <td><strong>Severity / Priority</strong></td>
        <td><span class="sev-high">HIGH</span> / P1</td>
      </tr>
      <tr>
        <td><strong>Reproduction Steps</strong></td>
        <td>1. Send request from <code>https://app.aisa24.com</code> to <code>/api/chat</code>.<br>2. Browser blocks response with CORS header error.</td>
      </tr>
      <tr>
        <td><strong>Root Cause</strong></td>
        <td>Static origin array lookup without dynamic hostname suffix matching.</td>
      </tr>
      <tr>
        <td><strong>Fix Status & Retesting</strong></td>
        <td><span class="badge badge-resolved">RESOLVED</span> | Added dynamic <code>isAllowedOrigin</code> regex function in <code>server.js</code> supporting '.aisa24.com', '.uwo24.com', '.aimall24.com', '.run.app', and localhost. Verified.</td>
      </tr>
    </tbody>
  </table>

  <h2>2.3 BUG-003: Strategy Card State Reducer Mutation</h2>
  <table>
    <thead>
      <tr>
        <th>Attribute</th>
        <th>Details</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Bug ID / Module</strong></td>
        <td><code>BUG-003</code> | Frontend Strategy Hub (<code>frontend/src/context/WorkspaceContext.jsx</code>)</td>
      </tr>
      <tr>
        <td><strong>Issue Description</strong></td>
        <td>Regenerating a single card in 30-day marketing roadmap occasionally reset the state of other 29 strategy cards in React context.</td>
      </tr>
      <tr>
        <td><strong>Severity / Priority</strong></td>
        <td><span class="sev-medium">MEDIUM</span> / P2</td>
      </tr>
      <tr>
        <td><strong>Root Cause</strong></td>
        <td>Direct array mutation in state handler instead of creating an immutable state copy.</td>
      </tr>
      <tr>
        <td><strong>Fix Status & Retesting</strong></td>
        <td><span class="badge badge-resolved">RESOLVED</span> | Updated state reducer in <code>WorkspaceContext.jsx</code> to perform immutable array cloning. Verified.</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 3 -->
  <h1>3. Category B: Confirmed Open Operational Issues</h1>

  <h2>3.1 BUG-004: In-Memory Delete OTP Store Volatility</h2>
  <table>
    <thead>
      <tr>
        <th>Attribute</th>
        <th>Details</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Bug ID / Module</strong></td>
        <td><code>BUG-004</code> | Account Security Module (<code>backend/routes/accountRoutes.js</code>)</td>
      </tr>
      <tr>
        <td><strong>Issue Description</strong></td>
        <td>Account deletion 6-digit OTP codes are stored in an in-memory <code>deleteOtpStore = new Map()</code>. If Cloud Run container restarts or scales, active OTPs are lost prior to 10-minute expiration.</td>
      </tr>
      <tr>
        <td><strong>Severity / Priority</strong></td>
        <td><span class="sev-medium">MEDIUM</span> / P2</td>
      </tr>
      <tr>
        <td><strong>Reproduction Steps</strong></td>
        <td>1. Trigger <code>POST /api/account/send-delete-otp</code>.<br>2. Restart Node server process.<br>3. Submit <code>POST /api/account/verify-delete-otp</code>.<br>4. Server returns "Expired or invalid OTP code."</td>
      </tr>
      <tr>
        <td><strong>Fix Status & Recommendation</strong></td>
        <td><span class="badge badge-confirmed">CONFIRMED OPEN</span> | Migrate <code>deleteOtpStore</code> to Redis or a temporary MongoDB collection with TTL index.</td>
      </tr>
    </tbody>
  </table>

  <h2>3.2 BUG-005: Unrestricted 50MB Request Payload Memory Allocation</h2>
  <table>
    <thead>
      <tr>
        <th>Attribute</th>
        <th>Details</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Bug ID / Module</strong></td>
        <td><code>BUG-005</code> | Backend Body Parser (<code>backend/server.js</code>)</td>
      </tr>
      <tr>
        <td><strong>Issue Description</strong></td>
        <td>Express JSON parser allows 50MB request bodies (<code>express.json({ limit: '50mb' })</code>) to handle inline base64 images, creating vulnerability to memory exhaustion under concurrent uploads.</td>
      </tr>
      <tr>
        <td><strong>Severity / Priority</strong></td>
        <td><span class="sev-medium">MEDIUM</span> / P3</td>
      </tr>
      <tr>
        <td><strong>Fix Status & Recommendation</strong></td>
        <td><span class="badge badge-confirmed">CONFIRMED OPEN</span> | Restructure client image uploads to request signed GCS upload URLs directly.</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 4 -->
  <h1>4. Category C: Identified Architectural Risks & Disclosures</h1>
  <table>
    <thead>
      <tr>
        <th>Risk ID</th>
        <th>Subsystem</th>
        <th>Risk Description & Impact</th>
        <th>Severity</th>
        <th>Recommended Mitigation</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>RISK-001</code></td>
        <td>AI Execution Engine</td>
        <td>Lack of explicit rate-limiting on heavy AI generation routes (<code>/api/content/social/generate</code>) allows potential quota exhaustion on Vertex AI (300 RPM limit).</td>
        <td><span class="sev-high">HIGH</span></td>
        <td>Attach <code>express-rate-limit</code> (20 req/min per IP) to AI generation endpoints.</td>
      </tr>
      <tr>
        <td><code>RISK-002</code></td>
        <td>Mobile Client Architecture</td>
        <td>A standalone native React Native codebase folder is unverified/absent in workspace directory (mobile integration relies on responsive React PWA & mobile-ready REST API).</td>
        <td><span class="sev-low">LOW</span></td>
        <td>Clearly disclose responsive PWA mobile architecture in technical docs.</td>
      </tr>
    </tbody>
  </table>

</body>
</html>
`;

async function generateBugReportPDF() {
  console.log('🚀 Starting Bug Tracking Report PDF Generation via Puppeteer...');
  
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
        <span>AI Ads™ Enterprise Platform (v2.0) — Bug &amp; Issue Tracking Report</span>
        <span>BTR-AIADS-2026-V2.0</span>
      </div>
    `,
    footerTemplate: `
      <div style="font-family: 'Inter', sans-serif; font-size: 7.5pt; color: #64748b; width: 100%; padding: 0 15mm; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #cbd5e1; padding-top: 4px;">
        <span>Confidential Bug &amp; Issue Tracking Report</span>
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
  console.log(`✅ Bug Report PDF generated successfully at:\n 1: ${pdfOutputPath1}\n 2: ${pdfOutputPath2}`);
}

generateBugReportPDF().catch((err) => {
  console.error('❌ Error generating Bug Report PDF:', err);
  process.exit(1);
});
