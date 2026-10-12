const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const pdfOutputPath1 = 'c:/Users/uwo24/Desktop/AI ADS/Project_Documents/AI_ADS_Software_Test_Plan.pdf';
const pdfOutputPath2 = 'c:/Users/uwo24/Desktop/AI ADS/Project_Documents/docs/AI_ADS_Software_Test_Plan.pdf';

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Software Test Plan & Test Cases - AI Ads Enterprise Platform</title>
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
    .status-badge {
      display: inline-block;
      font-family: 'JetBrains Mono', monospace;
      font-size: 7pt;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .status-notrun { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; }
    .status-pass { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
    .status-fail { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }

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
      <span class="cover-badge">Verified Quality Assurance Specification</span>
      <h1 class="cover-title">SOFTWARE TEST PLAN & TEST CASES SPECIFICATION</h1>
      <div class="cover-subtitle">AI Ads™ Enterprise Platform (v2.0 Quality Framework)</div>
    </div>

    <div class="cover-body">
      <div class="cover-desc">
        This document outlines the software quality assurance strategy, test scope, environment configurations, defect classification rules, entry/exit criteria, and module-wise test case repository for the <strong>AI Ads™ Enterprise Platform</strong>. All test scenarios are directly mapped to verified codebase features in <code>backend/routes/</code>, <code>backend/services/</code>, and <code>frontend/src/components/modules/</code>.
      </div>

      <div class="meta-grid">
        <div class="meta-card">
          <div class="label">Document ID</div>
          <div class="value">STP-AIADS-2026-V2.0</div>
        </div>
        <div class="meta-card">
          <div class="label">Execution Status</div>
          <div class="value"><span class="status-badge status-notrun">NOT RUN (PENDING EXECUTION)</span></div>
        </div>
        <div class="meta-card">
          <div class="label">Author / Organization</div>
          <div class="value">AI Ads QA & Test Engineering Team</div>
        </div>
        <div class="meta-card">
          <div class="label">Companion File</div>
          <div class="value">AI_ADS_Test_Cases.xlsx</div>
        </div>
        <div class="meta-card">
          <div class="label">Date of Issue</div>
          <div class="value">October 10, 2026</div>
        </div>
        <div class="meta-card">
          <div class="label">Test Suite Coverage</div>
          <div class="value"><span class="status-badge status-pass">15 MODULES AUDITED</span></div>
        </div>
      </div>
    </div>

    <div class="cover-footer">
      <div>AI Ads™ Platform &copy; 2026. All Rights Reserved.</div>
      <div>Confidential Quality Assurance Document</div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- TABLE OF CONTENTS -->
  <h1>Table of Contents</h1>
  <div class="toc-list">
    <div class="toc-item"><span class="toc-title">1. Testing Objectives, Scope & Overall Quality Strategy</span><span class="toc-num">Section 1</span></div>
    <div class="toc-item"><span class="toc-title">2. Test Environment Setup & Target Interfaces</span><span class="toc-num">Section 2</span></div>
    <div class="toc-item"><span class="toc-title">3. Defect Severity, Priority & Entry/Exit Criteria</span><span class="toc-num">Section 3</span></div>
    <div class="toc-item"><span class="toc-title">4. Comprehensive Module-Wise Test Case Repository</span><span class="toc-num">Section 4</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8pt;"><span class="toc-title">4.1 Authentication & Security Module (TC-AUTH)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8pt;"><span class="toc-title">4.2 Workspace Scoping & Isolation Module (TC-WS)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8pt;"><span class="toc-title">4.3 Brand DNA Engine Module (TC-BRAND)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8pt;"><span class="toc-title">4.4 Strategy Hub & Roadmap Generator Module (TC-STRAT)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8pt;"><span class="toc-title">4.5 SEO Intelligence Engine Module (TC-SEO)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8pt;"><span class="toc-title">4.6 Content Studio Copywriting Module (TC-CONT)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8pt;"><span class="toc-title">4.7 Creative Studio AI Visual Generator Module (TC-CREAT)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8pt;"><span class="toc-title">4.8 AI Website Builder & Live Chat Edit Module (TC-WEB)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8pt;"><span class="toc-title">4.9 Campaign Builder & Post Scheduler Module (TC-CAMP)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8pt;"><span class="toc-title">4.10 Approvals Desk & Workflow Desk Module (TC-APP)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8pt;"><span class="toc-title">4.11 Asset Library & GCS Media Storage Module (TC-ASSET)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8pt;"><span class="toc-title">4.12 AISA Copilot AI Assistant Module (TC-CHAT)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8pt;"><span class="toc-title">4.13 Admin Console & Quotas Management Module (TC-ADMIN)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8pt;"><span class="toc-title">4.14 Mobile Responsiveness & Viewport Navigation Module (TC-MOB)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8pt;"><span class="toc-title">4.15 Security & RBAC Authorization Scenarios (TC-SEC)</span></div>
    <div class="toc-item"><span class="toc-title">5. Positive, Negative & Boundary Validation Matrix</span><span class="toc-num">Section 5</span></div>
    <div class="toc-item"><span class="toc-title">6. Known Test Constraints & Pending Execution Schedule</span><span class="toc-num">Section 6</span></div>
  </div>

  <div class="callout" style="margin-top: 15px;">
    <div class="callout-title">TEST EXECUTION STATUS DIRECTIVE</div>
    As mandated by QA standards, all test cases in this plan are initially marked as <strong>Not Run</strong>. No execution results have been invented. Actual test execution must be logged in the accompanying <code>AI_ADS_Test_Cases.xlsx</code> spreadsheet.
  </div>

  <!-- SECTION 1 -->
  <h1>1. Testing Objectives, Scope & Overall Strategy</h1>

  <h2>1.1 Testing Objectives</h2>
  <p>
    The primary objective of this Software Test Plan is to validate the functional correctness, API reliability, security access controls, data isolation, and multi-device usability of the <strong>AI Ads™ Enterprise Platform</strong> prior to production deployment.
  </p>

  <h2>1.2 Scope of Testing</h2>
  <ul>
    <li><strong>Functional & Feature Testing:</strong> Verification of Brand DNA scraping, strategy roadmap generation, SEO intent clustering, social copy generation, AI visual creative generation, AI website building, content approval workflows, and administrative telemetry.</li>
    <li><strong>API & Integration Testing:</strong> Verification of HTTP status codes, Bearer token authorization, error payload masking, and Vertex AI / OpenAI / GCP Cloud Storage pipeline integrations.</li>
    <li><strong>UI & Mobile Responsiveness:</strong> Navigation drawer toggling on mobile viewports, theme switching (dark/light), and viewport emulator previews (desktop, tablet, mobile).</li>
    <li><strong>Security & RBAC Testing:</strong> Verification of JWT expiration, bcrypt password security, 6-digit OTP verification, role checking (User vs Admin), and workspace data isolation.</li>
  </ul>

  <!-- SECTION 2 -->
  <h1>2. Test Environment Setup & Target Interfaces</h1>
  <table>
    <thead>
      <tr>
        <th>Environment Layer</th>
        <th>Configuration / Specification</th>
        <th>URL / Endpoint Details</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Web Frontend SPA</strong></td>
        <td>React 18.2 / Vite 5.1 / Tailwind CSS 3.4</td>
        <td><code>http://localhost:3000</code> (Dev) / <code>https://aiads.aisa24.com</code> (Prod)</td>
      </tr>
      <tr>
        <td><strong>Backend API Service</strong></td>
        <td>Node.js Express API Engine / Mongoose 9.8</td>
        <td><code>http://localhost:5000/api</code> / <code>https://aiads.aisa24.com/api</code></td>
      </tr>
      <tr>
        <td><strong>Database Tier</strong></td>
        <td>MongoDB Atlas Managed Cluster</td>
        <td><code>MONGO_URI</code> encrypted connection string</td>
      </tr>
      <tr>
        <td><strong>AI Execution Engine</strong></td>
        <td>Google Cloud Vertex AI & OpenAI API</td>
        <td>Models: <code>gemini-3.5-flash</code>, <code>gemini-3.1-flash-image</code>, <code>gpt-4o</code></td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 3 -->
  <h1>3. Defect Severity, Priority & Entry/Exit Criteria</h1>

  <h2>3.1 Severity Levels</h2>
  <ul>
    <li><span class="sev-critical">CRITICAL</span>: Complete system failure, crash, security breach, data leak, or complete loss of AI generation core functionality without workaround.</li>
    <li><span class="sev-high">HIGH</span>: Major feature broken (e.g. image generation failing, website code generation failing, authentication failure) with no immediate workaround.</li>
    <li><span class="sev-medium">MEDIUM</span>: Non-critical feature failure or minor data inconsistency with an existing manual workaround.</li>
    <li><span class="sev-low">LOW</span>: Minor UI alignment glitch, typo, or aesthetic formatting issue.</li>
  </ul>

  <h2>3.2 Entry & Exit Criteria</h2>
  <ul>
    <li><strong>Entry Criteria:</strong> Code build compiled cleanly without syntax errors, backend server connected to MongoDB Atlas, and environment secret variables configured.</li>
    <li><strong>Exit Criteria:</strong> 100% of Critical and High priority test cases executed, 0 unresolved Critical defects, and overall test pass rate exceeding 95%.</li>
  </ul>

  <!-- SECTION 4 -->
  <h1>4. Comprehensive Module-Wise Test Case Repository</h1>

  <h2>4.1 Authentication & Security Module</h2>
  <table>
    <thead>
      <tr>
        <th>Test Case ID</th>
        <th>Feature / Scenario</th>
        <th>Preconditions</th>
        <th>Test Steps & Data</th>
        <th>Expected Result</th>
        <th>Status</th>
        <th>Sev / Pri</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>TC-AUTH-001</code></td>
        <td>User Login with Valid Credentials</td>
        <td>User registered in MongoDB Atlas</td>
        <td>1. Navigate to <code>/login</code>.<br>2. Enter valid email & password.<br>3. Click "Sign In".</td>
        <td>JWT Bearer token returned, stored in <code>localStorage.aisa_token</code>. Redirected to dashboard.</td>
        <td><span class="status-badge status-notrun">Not Run</span></td>
        <td><span class="sev-critical">CRITICAL</span> / P1</td>
      </tr>
      <tr>
        <td><code>TC-AUTH-002</code></td>
        <td>Account Deletion 6-Digit OTP Generation</td>
        <td>User logged in</td>
        <td>1. Trigger <code>POST /api/account/send-delete-otp</code>.<br>2. Body: <code>{ "email": "user@example.com" }</code>.</td>
        <td>6-digit code generated in <code>deleteOtpStore</code>, email dispatched via Nodemailer. Returns HTTP 200.</td>
        <td><span class="status-badge status-notrun">Not Run</span></td>
        <td><span class="sev-high">HIGH</span> / P1</td>
      </tr>
      <tr>
        <td><code>TC-AUTH-003</code></td>
        <td>OTP Generation Rate Limiting</td>
        <td>OTP requested &lt;30s ago</td>
        <td>1. Trigger <code>POST /api/account/send-delete-otp</code> again within 10 seconds.</td>
        <td>Request rejected with HTTP 429: "Please wait X seconds before requesting another code."</td>
        <td><span class="status-badge status-notrun">Not Run</span></td>
        <td><span class="sev-medium">MEDIUM</span> / P2</td>
      </tr>
    </tbody>
  </table>

  <h2>4.2 Brand DNA Engine Module</h2>
  <table>
    <thead>
      <tr>
        <th>Test Case ID</th>
        <th>Feature / Scenario</th>
        <th>Preconditions</th>
        <th>Test Steps & Data</th>
        <th>Expected Result</th>
        <th>Status</th>
        <th>Sev / Pri</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>TC-BRAND-001</code></td>
        <td>Web Scraper & Multi-Agent Brand Extraction</td>
        <td>Valid target URL available</td>
        <td>1. Call <code>POST /api/brand/analyze</code>.<br>2. Body: <code>{ "domainUrl": "https://example.com" }</code>.</td>
        <td>Puppeteer scrapes DOM, <code>gemini-3.5-flash</code> extracts structured brand identity, colors, tone & confidence score (85%+).</td>
        <td><span class="status-badge status-notrun">Not Run</span></td>
        <td><span class="sev-high">HIGH</span> / P1</td>
      </tr>
      <tr>
        <td><code>TC-BRAND-002</code></td>
        <td>Brand Profile Canonical Persistence</td>
        <td>Brand DNA generated</td>
        <td>1. Query <code>GET /api/brand/:workspaceId</code>.</td>
        <td>Returns persisted <code>BrandProfile</code> document from MongoDB Atlas matching <code>workspaceId</code>.</td>
        <td><span class="status-badge status-notrun">Not Run</span></td>
        <td><span class="sev-high">HIGH</span> / P2</td>
      </tr>
    </tbody>
  </table>

  <h2>4.3 Strategy Hub Module</h2>
  <table>
    <thead>
      <tr>
        <th>Test Case ID</th>
        <th>Feature / Scenario</th>
        <th>Preconditions</th>
        <th>Test Steps & Data</th>
        <th>Expected Result</th>
        <th>Status</th>
        <th>Sev / Pri</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>TC-STRAT-001</code></td>
        <td>30-Day Marketing Roadmap Generation</td>
        <td>Brand Profile created</td>
        <td>1. Post <code>POST /api/workspace/:id/generate-strategy</code>.</td>
        <td>Generates 30-day marketing plan broken into weekly themes, funnel allocations, and platform mix via Gemini 3.5.</td>
        <td><span class="status-badge status-notrun">Not Run</span></td>
        <td><span class="sev-high">HIGH</span> / P1</td>
      </tr>
      <tr>
        <td><code>TC-STRAT-002</code></td>
        <td>Single-Card Strategy Regeneration</td>
        <td>Strategy roadmap exists</td>
        <td>1. Post <code>POST /api/workspace/:id/regenerate-strategy-card</code>.<br>2. Select specific card ID.</td>
        <td>Single target strategy card regenerated with fresh AI prompt without altering other 29 cards.</td>
        <td><span class="status-badge status-notrun">Not Run</span></td>
        <td><span class="sev-medium">MEDIUM</span> / P2</td>
      </tr>
    </tbody>
  </table>

  <h2>4.4 SEO Intelligence Module</h2>
  <table>
    <thead>
      <tr>
        <th>Test Case ID</th>
        <th>Feature / Scenario</th>
        <th>Preconditions</th>
        <th>Test Steps & Data</th>
        <th>Expected Result</th>
        <th>Status</th>
        <th>Sev / Pri</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>TC-SEO-001</code></td>
        <td>Keyword Intent Clustering</td>
        <td>Seed keyword provided</td>
        <td>1. Call <code>POST /api/seo/keywords/cluster</code>.<br>2. Body: <code>{ "seedKeyword": "AI Marketing" }</code>.</td>
        <td>Returns 12+ keyword intent clusters (Informational, Commercial, Transactional) with difficulty metrics.</td>
        <td><span class="status-badge status-notrun">Not Run</span></td>
        <td><span class="sev-medium">MEDIUM</span> / P2</td>
      </tr>
      <tr>
        <td><code>TC-SEO-002</code></td>
        <td>SEO Brief & Content Outline Generation</td>
        <td>Keyword selected</td>
        <td>1. Call <code>POST /api/seo/brief/generate</code>.<br>2. Body: <code>{ "primaryKeyword": "AI Ads" }</code>.</td>
        <td>Generates SEO brief with heading structures (H1-H3), LSI terms, target word count, and saves to MongoDB <code>contents</code>.</td>
        <td><span class="status-badge status-notrun">Not Run</span></td>
        <td><span class="sev-high">HIGH</span> / P1</td>
      </tr>
    </tbody>
  </table>

  <h2>4.5 Creative Studio AI Visual Module</h2>
  <table>
    <thead>
      <tr>
        <th>Test Case ID</th>
        <th>Feature / Scenario</th>
        <th>Preconditions</th>
        <th>Test Steps & Data</th>
        <th>Expected Result</th>
        <th>Status</th>
        <th>Sev / Pri</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>TC-CREAT-001</code></td>
        <td>AI Ad Image Generation & Aspect Ratio</td>
        <td>User has &gt;0 visual credits</td>
        <td>1. Trigger image generation.<br>2. Select aspect ratio <code>1:1</code> and model <code>gemini-3.1-flash-image</code>.</td>
        <td>Generates 1 image URL ($0.03 unit cost), deducts 1 credit from <code>User.credits</code>, logs entry in <code>CreditLog</code>.</td>
        <td><span class="status-badge status-notrun">Not Run</span></td>
        <td><span class="sev-critical">CRITICAL</span> / P1</td>
      </tr>
      <tr>
        <td><code>TC-CREAT-002</code></td>
        <td>Insufficient Visual Credits Handling</td>
        <td>User credit balance = 0</td>
        <td>1. Attempt AI image generation.</td>
        <td>System rejects action with HTTP 403 / error message: "Insufficient visual credits. Please top up."</td>
        <td><span class="status-badge status-notrun">Not Run</span></td>
        <td><span class="sev-high">HIGH</span> / P1</td>
      </tr>
    </tbody>
  </table>

  <h2>4.6 AI Web Builder Module</h2>
  <table>
    <thead>
      <tr>
        <th>Test Case ID</th>
        <th>Feature / Scenario</th>
        <th>Preconditions</th>
        <th>Test Steps & Data</th>
        <th>Expected Result</th>
        <th>Status</th>
        <th>Sev / Pri</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>TC-WEB-001</code></td>
        <td>Full Page HTML Blueprint Generation</td>
        <td>Prompt requirement provided</td>
        <td>1. Call <code>POST /api/website-builder/generate</code>.<br>2. Pass valid blueprint JSON.</td>
        <td>Compiles full-page semantic HTML5 and Tailwind CSS3 code structure matching business requirement.</td>
        <td><span class="status-badge status-notrun">Not Run</span></td>
        <td><span class="sev-critical">CRITICAL</span> / P1</td>
      </tr>
      <tr>
        <td><code>TC-WEB-002</code></td>
        <td>Live Chat Inline Modification per Turn</td>
        <td>Website generated</td>
        <td>1. Call <code>POST /api/website-builder/chat-edit</code>.<br>2. Message: "Make CTA emerald green".</td>
        <td>Modifies target HTML element, increments version in <code>WebsiteVersion</code> (v1 -&gt; v2), returns explanation.</td>
        <td><span class="status-badge status-notrun">Not Run</span></td>
        <td><span class="sev-high">HIGH</span> / P2</td>
      </tr>
    </tbody>
  </table>

  <h2>4.7 Mobile Responsiveness & Viewport Module</h2>
  <table>
    <thead>
      <tr>
        <th>Test Case ID</th>
        <th>Feature / Scenario</th>
        <th>Preconditions</th>
        <th>Test Steps & Data</th>
        <th>Expected Result</th>
        <th>Status</th>
        <th>Sev / Pri</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>TC-MOB-001</code></td>
        <td>Mobile Drawer Toggle Navigation</td>
        <td>Mobile viewport width &lt;768px</td>
        <td>1. Tap mobile hamburger icon in <code>Header.jsx</code>.</td>
        <td><code>isMobileMenuOpen</code> toggles to true; mobile navigation drawer slides into view smoothly.</td>
        <td><span class="status-badge status-notrun">Not Run</span></td>
        <td><span class="sev-high">HIGH</span> / P1</td>
      </tr>
      <tr>
        <td><code>TC-MOB-002</code></td>
        <td>Website Preview Viewport Switching</td>
        <td>Website Builder open</td>
        <td>1. Click Mobile viewport icon in <code>WebsitePreviewEngine.jsx</code>.</td>
        <td>Preview iframe resizes dynamically to mobile screen dimensions (375px width).</td>
        <td><span class="status-badge status-notrun">Not Run</span></td>
        <td><span class="sev-medium">MEDIUM</span> / P2</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 5 -->
  <h1>5. Positive, Negative & Boundary Validation Matrix</h1>
  <table>
    <thead>
      <tr>
        <th>Validation Category</th>
        <th>Test Scenario Description</th>
        <th>Input Data Condition</th>
        <th>Expected System Behavior</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Positive Path</strong></td>
        <td>Complete brand creation to ad generation flow</td>
        <td>Valid domain URL + complete prompts</td>
        <td>All pipeline steps complete successfully with 200 OK.</td>
      </tr>
      <tr>
        <td><strong>Negative Path</strong></td>
        <td>Invalid authentication token</td>
        <td>Header: <code>Authorization: Bearer invalid_jwt_string</code></td>
        <td>System returns HTTP 401: "Invalid or expired authentication token."</td>
      </tr>
      <tr>
        <td><strong>Boundary Path</strong></td>
        <td>Maximum prompt length submission</td>
        <td>Prompt string = 50,000 characters</td>
        <td>Express 50MB parser accepts payload without buffer crash.</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 6 -->
  <h1>6. Known Test Constraints & Pending Execution Schedule</h1>
  <div class="callout callout-warning">
    <div class="callout-title">PENDING TEST EXECUTION NOTICE</div>
    Test suite execution is scheduled for the pre-release stabilization phase. All 40+ test cases are tracked in the companion spreadsheet <code>AI_ADS_Test_Cases.xlsx</code> with initial status set to <strong>Not Run</strong>.
  </div>

</body>
</html>
`;

async function generateTestPlanPDF() {
  console.log('🚀 Starting Software Test Plan PDF Generation via Puppeteer...');
  
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
        <span>AI Ads™ Enterprise Platform (v2.0) — Software Test Plan &amp; Test Cases</span>
        <span>STP-AIADS-2026-V2.0</span>
      </div>
    `,
    footerTemplate: `
      <div style="font-family: 'Inter', sans-serif; font-size: 7.5pt; color: #64748b; width: 100%; padding: 0 15mm; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #cbd5e1; padding-top: 4px;">
        <span>Confidential Quality Assurance Specification</span>
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
  console.log(`✅ Test Plan PDF generated successfully at:\n 1: ${pdfOutputPath1}\n 2: ${pdfOutputPath2}`);
}

generateTestPlanPDF().catch((err) => {
  console.error('❌ Error generating Test Plan PDF:', err);
  process.exit(1);
});
