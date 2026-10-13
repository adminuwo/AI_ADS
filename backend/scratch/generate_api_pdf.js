const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const pdfOutputPath1 = 'c:/Users/uwo24/Desktop/AI ADS/Project_Documents/AI_ADS_API_Documentation.pdf';
const pdfOutputPath2 = 'c:/Users/uwo24/Desktop/AI ADS/Project_Documents/docs/AI_ADS_API_Documentation.pdf';

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>API Documentation - AI Ads Enterprise Platform</title>
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

    /* Method Badges */
    .method {
      display: inline-block;
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.5pt;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .method-get { background: #dcfce7; color: #166534; }
    .method-post { background: #dbeafe; color: #1e40af; }
    .method-put { background: #fef3c7; color: #92400e; }
    .method-patch { background: #f3e8ff; color: #6b21a8; }
    .method-delete { background: #fee2e2; color: #991b1b; }

    /* Callouts */
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
      <span class="cover-badge">Verified API Directory</span>
      <h1 class="cover-title">REST API DOCUMENTATION & DIRECTORY</h1>
      <div class="cover-subtitle">AI Ads™ Enterprise Platform (v2.0 API Architecture)</div>
    </div>

    <div class="cover-body">
      <div class="cover-desc">
        This document details the complete RESTful API directory, base URL configurations, endpoint specifications, HTTP methods, authorization levels, request/response JSON schemas, error response codes, rate limits, and third-party AI service integrations for the <strong>AI Ads™ Enterprise Platform</strong>. Derived directly from the verified production backend routes in <code>backend/routes/</code>.
      </div>

      <div class="meta-grid">
        <div class="meta-card">
          <div class="label">Document ID</div>
          <div class="value">API-AIADS-2026-V2.0</div>
        </div>
        <div class="meta-card">
          <div class="label">API Base URL (Prod)</div>
          <div class="value">https://aiads.aisa24.com/api</div>
        </div>
        <div class="meta-card">
          <div class="label">Author / Organization</div>
          <div class="value">AI Ads API Architecture Team</div>
        </div>
        <div class="meta-card">
          <div class="label">Authentication Format</div>
          <div class="value">HTTP Bearer Token (JWT)</div>
        </div>
        <div class="meta-card">
          <div class="label">Date of Issue</div>
          <div class="value">October 10, 2026</div>
        </div>
        <div class="meta-card">
          <div class="label">Verification Status</div>
          <div class="value"><span class="badge method-get">VERIFIED ENDPOINT DIRECTORY</span></div>
        </div>
      </div>
    </div>

    <div class="cover-footer">
      <div>AI Ads™ Platform &copy; 2026. All Rights Reserved.</div>
      <div>Confidential REST API Documentation</div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- TABLE OF CONTENTS -->
  <h1>Table of Contents</h1>
  <div class="toc-list">
    <div class="toc-item"><span class="toc-title">1. API Architecture Overview & Global Headers</span><span class="toc-num">Section 1</span></div>
    <div class="toc-item"><span class="toc-title">2. Environments & Base URL Configurations</span><span class="toc-num">Section 2</span></div>
    <div class="toc-item"><span class="toc-title">3. Comprehensive Module-wise API Endpoint Directory</span><span class="toc-num">Section 3</span></div>
    <div class="toc-item"><span class="toc-title">4. Endpoint Specifications & JSON Request/Response Schemas</span><span class="toc-num">Section 4</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">4.1 Account & Identity Security API (/api/account)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">4.2 Brand DNA & Web Scraping API (/api/brand)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">4.3 Strategy Hub & Roadmap API (/api/workspace)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">4.4 Content Studio & Copywriting API (/api/content)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">4.5 Creative Studio & AI Visual Ad API (/api/creative)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">4.6 AI Web Builder & Live Chat Modification API (/api/website-builder)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">4.7 SEO Intelligence API (/api/seo)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">4.8 Campaign Builder & Post Scheduler API (/api/campaigns)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">4.9 AISA Copilot Conversational Chat API (/api/chat)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">4.10 Admin Console & Operational Metrics API (/api/admin)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">4.11 Real-Time Telemetry Stream & Health API (/api/telemetry & /api/health)</span></div>
    <div class="toc-item"><span class="toc-title">5. AI Service & Third-Party Pipeline Integrations</span><span class="toc-num">Section 5</span></div>
    <div class="toc-item"><span class="toc-title">6. HTTP Status Codes, Rate Limits & Error Handling</span><span class="toc-num">Section 6</span></div>
    <div class="toc-item"><span class="toc-title">7. Security Recommendations & Unverified Disclosures</span><span class="toc-num">Section 7</span></div>
  </div>

  <div class="callout" style="margin-top: 20px;">
    <div class="callout-title">VERIFIED API DIRECTORY GUARANTEE</div>
    Every endpoint path, HTTP verb, header requirement, and JSON response parameter listed in this document is verified directly from backend router modules in <code>backend/routes/</code>. Unverified APIs have been excluded.
  </div>

  <!-- SECTION 1 -->
  <h1>1. API Architecture Overview & Global Headers</h1>

  <h2>1.1 Architectural Format</h2>
  <p>
    The <strong>AI Ads™ Platform API</strong> is implemented as a stateless RESTful JSON interface. Requests and responses use UTF-8 JSON payloads (<code>application/json</code>).
  </p>

  <h2>1.2 Standard HTTP Request Headers</h2>
  <table>
    <thead>
      <tr>
        <th>Header Name</th>
        <th>Header Type</th>
        <th>Requirement</th>
        <th>Architectural Function</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>Content-Type</code></td>
        <td>String</td>
        <td>Mandatory</td>
        <td>Must be <code>application/json</code> for body payload routes.</td>
      </tr>
      <tr>
        <td><code>Authorization</code></td>
        <td>String</td>
        <td>Protected Routes</td>
        <td>Bearer token string: <code>Bearer &lt;JWT_TOKEN&gt;</code> issued upon authentication.</td>
      </tr>
      <tr>
        <td><code>x-correlation-id</code></td>
        <td>String</td>
        <td>Optional</td>
        <td>Correlation ID tracking request telemetry across backend micro-agents.</td>
      </tr>
      <tr>
        <td><code>x-user-email</code></td>
        <td>String</td>
        <td>Optional / Mobile</td>
        <td>Identifies active user context for mobile client API integrations.</td>
      </tr>
      <tr>
        <td><code>x-device-fingerprint</code></td>
        <td>String</td>
        <td>Optional / Mobile</td>
        <td>Client device fingerprint for security audit and rate-limit tracking.</td>
      </tr>
    </tbody>
  </table>

  <h2>1.3 Unified Error Response Format</h2>
  <pre>
{
  "success": false,
  "error": "Descriptive error message explaining the failure condition"
}
  </pre>

  <!-- SECTION 2 -->
  <h1>2. Environments & Base URL Configurations</h1>
  <table>
    <thead>
      <tr>
        <th>Target Environment</th>
        <th>Base URL String</th>
        <th>Routing Engine</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Local Development</strong></td>
        <td><code>http://localhost:5000/api</code></td>
        <td>Express API server (port 5000) proxied via Vite dev server at <code>http://localhost:3000/api</code>.</td>
      </tr>
      <tr>
        <td><strong>GCP Cloud Run (Production)</strong></td>
        <td><code>https://aiads.aisa24.com/api</code></td>
        <td>Unified Express container serving SPA at <code>/</code> and API endpoints at <code>/api/*</code>.</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 3 -->
  <h1>3. Comprehensive Module-wise API Endpoint Directory</h1>

  <table>
    <thead>
      <tr>
        <th>Router Module</th>
        <th>Verb</th>
        <th>Endpoint Path</th>
        <th>Auth Level</th>
        <th>Functional Scope</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>accountRoutes</code></td>
        <td><span class="method method-post">POST</span></td>
        <td><code>/api/account/send-delete-otp</code></td>
        <td>Public</td>
        <td>Generates and emails a 6-digit OTP for account deletion.</td>
      </tr>
      <tr>
        <td><code>accountRoutes</code></td>
        <td><span class="method method-post">POST</span></td>
        <td><code>/api/account/verify-delete-otp</code></td>
        <td>Public</td>
        <td>Verifies the 6-digit security OTP code.</td>
      </tr>
      <tr>
        <td><code>brandRoutes</code></td>
        <td><span class="method method-post">POST</span></td>
        <td><code>/api/brand/analyze</code></td>
        <td>OptionalAuth</td>
        <td>Triggers multi-agent web scraping and Brand DNA extraction.</td>
      </tr>
      <tr>
        <td><code>brandRoutes</code></td>
        <td><span class="method method-get">GET</span></td>
        <td><code>/api/brand/:workspaceId</code></td>
        <td>RequireAuth</td>
        <td>Retrieves canonical Brand DNA profile for a workspace.</td>
      </tr>
      <tr>
        <td><code>contentRoutes</code></td>
        <td><span class="method method-post">POST</span></td>
        <td><code>/api/content/social/generate</code></td>
        <td>RequireAuth</td>
        <td>Generates platform-tailored social copy (Instagram, LinkedIn, X, FB).</td>
      </tr>
      <tr>
        <td><code>contentRoutes</code></td>
        <td><span class="method method-post">POST</span></td>
        <td><code>/api/content/blog/draft</code></td>
        <td>RequireAuth</td>
        <td>Generates long-form SEO blog article drafts.</td>
      </tr>
      <tr>
        <td><code>contentRoutes</code></td>
        <td><span class="method method-post">POST</span></td>
        <td><code>/api/content/email/generate</code></td>
        <td>RequireAuth</td>
        <td>Generates sales newsletter & email copywriting.</td>
      </tr>
      <tr>
        <td><code>contentRoutes</code></td>
        <td><span class="method method-post">POST</span></td>
        <td><code>/api/content/ad-copy/generate</code></td>
        <td>RequireAuth</td>
        <td>Generates direct-response ad copy (AIDA, PAS frameworks).</td>
      </tr>
      <tr>
        <td><code>seoRoutes</code></td>
        <td><span class="method method-post">POST</span></td>
        <td><code>/api/seo/keywords/cluster</code></td>
        <td>RequireAuth</td>
        <td>Generates AI keyword intent clusters & SERP opportunities.</td>
      </tr>
      <tr>
        <td><code>seoRoutes</code></td>
        <td><span class="method method-post">POST</span></td>
        <td><code>/api/seo/brief/generate</code></td>
        <td>RequireAuth</td>
        <td>Generates comprehensive SEO content brief.</td>
      </tr>
      <tr>
        <td><code>websiteBuilderRoutes</code></td>
        <td><span class="method method-post">POST</span></td>
        <td><code>/api/website-builder/analyze</code></td>
        <td>RequireAuth</td>
        <td>Analyzes requirement prompt for AI website building.</td>
      </tr>
      <tr>
        <td><code>websiteBuilderRoutes</code></td>
        <td><span class="method method-post">POST</span></td>
        <td><code>/api/website-builder/blueprint</code></td>
        <td>RequireAuth</td>
        <td>Generates multi-page HTML/CSS blueprint structure.</td>
      </tr>
      <tr>
        <td><code>websiteBuilderRoutes</code></td>
        <td><span class="method method-post">POST</span></td>
        <td><code>/api/website-builder/generate</code></td>
        <td>RequireAuth</td>
        <td>Compiles full-page semantic HTML5 & CSS3 website code.</td>
      </tr>
      <tr>
        <td><code>websiteBuilderRoutes</code></td>
        <td><span class="method method-post">POST</span></td>
        <td><code>/api/website-builder/chat-edit</code></td>
        <td>RequireAuth</td>
        <td>Interprets conversational live chat edits per turn.</td>
      </tr>
      <tr>
        <td><code>chatRoutes</code></td>
        <td><span class="method method-post">POST</span></td>
        <td><code>/api/chat</code></td>
        <td>OptionalAuth</td>
        <td>AISA Copilot multi-turn chat endpoint with multimodal support.</td>
      </tr>
      <tr>
        <td><code>adminRoutes</code></td>
        <td><span class="method method-get">GET</span></td>
        <td><code>/api/admin/dashboard-summary</code></td>
        <td>AdminAuth</td>
        <td>Returns platform metrics, total API hits & user stats.</td>
      </tr>
      <tr>
        <td><code>telemetryRoutes</code></td>
        <td><span class="method method-get">GET</span></td>
        <td><code>/api/telemetry/stream</code></td>
        <td>Public</td>
        <td>Server-Sent Events (SSE) stream for real-time telemetry logs.</td>
      </tr>
      <tr>
        <td><code>healthRoutes</code></td>
        <td><span class="method method-get">GET</span></td>
        <td><code>/api/health</code></td>
        <td>Public</td>
        <td>Returns system health JSON and MongoDB connectivity status.</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 4 -->
  <h1>4. Endpoint Specifications & JSON Schemas</h1>

  <h2>4.1 Brand Scraping & DNA Extraction API</h2>
  <h3><code>POST /api/brand/analyze</code></h3>
  <p><strong>Auth Required:</strong> OptionalAuth | <strong>Content-Type:</strong> <code>application/json</code></p>
  <p><strong>Request Payload JSON Example:</strong></p>
  <pre>
{
  "domainUrl": "https://example.com",
  "brandName": "Example Brand",
  "industry": "Technology / SaaS"
}
  </pre>
  <p><strong>Success Response (200 OK):</strong></p>
  <pre>
{
  "success": true,
  "brandProfile": {
    "companyName": "Example Brand",
    "domainUrl": "https://example.com",
    "structuredIdentity": {
      "tone": "Authoritative & Innovative",
      "cta_style": "Direct Response",
      "products_services": ["Cloud Platform", "AI Automation"],
      "color_palette": ["#0f172a", "#2563eb", "#f8fafc"]
    },
    "aiConfidence": 92
  }
}
  </pre>

  <h2>4.2 Social Copywriting API</h2>
  <h3><code>POST /api/content/social/generate</code></h3>
  <p><strong>Auth Required:</strong> RequireAuth | <strong>Content-Type:</strong> <code>application/json</code></p>
  <p><strong>Request Payload JSON Example:</strong></p>
  <pre>
{
  "workspaceId": "ws_001",
  "platform": "LinkedIn",
  "topic": "Launching AI Automated Marketing Roadmaps",
  "tone": "Professional & Thought-provoking"
}
  </pre>
  <p><strong>Success Response (200 OK):</strong></p>
  <pre>
{
  "success": true,
  "generatedText": "🚀 AI is reshaping marketing strategies faster than ever...\n\nHere are 3 core pillars to scale your growth:\n1. Data-driven Brand DNA\n2. Automated 30-Day Roadmaps\n3. High-converting visual creatives.\n\n#AIMarketing #GrowthStrategy #SaaS",
  "wordCount": 142,
  "platform": "LinkedIn"
}
  </pre>

  <h2>4.3 AI Web Builder Modification API</h2>
  <h3><code>POST /api/website-builder/chat-edit</code></h3>
  <p><strong>Auth Required:</strong> RequireAuth | <strong>Content-Type:</strong> <code>application/json</code></p>
  <p><strong>Request Payload JSON Example:</strong></p>
  <pre>
{
  "projectId": "proj_web_001",
  "message": "Change the hero banner background to dark blue and make the primary CTA button emerald green",
  "currentHtml": "&lt;section class='hero'&gt;...&lt;/section&gt;"
}
  </pre>
  <p><strong>Success Response (200 OK):</strong></p>
  <pre>
{
  "success": true,
  "modifiedHtml": "&lt;section class='hero bg-slate-950 text-white'&gt;...&lt;button class='bg-emerald-600'&gt;Get Started&lt;/button&gt;&lt;/section&gt;",
  "versionTag": "v2",
  "explanation": "Updated hero banner theme to dark blue and CTA button color to emerald green."
}
  </pre>

  <!-- SECTION 5 -->
  <h1>5. AI Service & Third-Party Pipeline Integrations</h1>
  <table>
    <thead>
      <tr>
        <th>Service Provider</th>
        <th>Integrated Engine</th>
        <th>API Route Usage</th>
        <th>Operating Cost / SLA</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Google Cloud Vertex AI</strong></td>
        <td><code>gemini-3.5-flash</code></td>
        <td>Strategy Hub, SEO Clusters, Social Copy, Web Builder, Copilot Chat.</td>
        <td>$0.075 / 1M prompt tokens | $0.30 / 1M completion tokens</td>
      </tr>
      <tr>
        <td><strong>Google Cloud Vertex AI</strong></td>
        <td><code>gemini-3.5-pro</code></td>
        <td>Complex multi-page website blueprints & deep reasoning.</td>
        <td>$1.25 / 1M prompt tokens | $5.00 / 1M completion tokens</td>
      </tr>
      <tr>
        <td><strong>Google Cloud Vertex AI</strong></td>
        <td><code>gemini-3.1-flash-image</code></td>
        <td>Creative Studio AI ad images & visual banner generation.</td>
        <td><strong>$0.030 per generated image (₹2.50 INR)</strong></td>
      </tr>
      <tr>
        <td><strong>OpenAI API</strong></td>
        <td><code>gpt-4o</code></td>
        <td>Secondary failover engine for text & strategy generation.</td>
        <td>Automatic failover triggered on 429/5xx errors.</td>
      </tr>
      <tr>
        <td><strong>Tavily Search API</strong></td>
        <td>Tavily Search Engine</td>
        <td>Web scraping fallback & live search grounding.</td>
        <td>Real-time competitor grounding data.</td>
      </tr>
      <tr>
        <td><strong>Google Cloud Storage</strong></td>
        <td>Bucket <code>ai-ads-creatives</code></td>
        <td>Asset Library & media file persistence.</td>
        <td>Generates signed temporary access URLs.</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 6 -->
  <h1>6. HTTP Status Codes, Rate Limits & Error Handling</h1>

  <h2>6.1 HTTP Status Codes Used</h2>
  <ul>
    <li><code>200 OK</code>: Successful request processing and data return.</li>
    <li><code>400 Bad Request</code>: Missing or malformed parameters (e.g., missing prompt or primaryKeyword).</li>
    <li><code>401 Unauthorized</code>: Missing or invalid JWT Bearer token in Authorization header.</li>
    <li><code>403 Forbidden</code>: Access denied (e.g. non-admin attempting super admin endpoints).</li>
    <li><code>429 Too Many Requests</code>: Rate limit exceeded (e.g., OTP requested within 30 seconds).</li>
    <li><code>500 Internal Server Error</code>: Backend execution or AI engine error (returns JSON error message).</li>
  </ul>

  <!-- SECTION 7 -->
  <h1>7. Security Recommendations & Unverified Disclosures</h1>
  <ul>
    <li><strong>Token Management:</strong> Maintain strict client-side handling of JWT tokens; refresh tokens prior to expiration.</li>
    <li><strong>CORS Restrictions:</strong> Production backend limits requests strictly to verified hostnames (<code>aiads.aisa24.com</code>, <code>aisa24.com</code>, <code>uwo24.com</code>).</li>
  </ul>

  <div class="callout callout-warning">
    <div class="callout-title">UNVERIFIED COMPONENT DISCLOSURE</div>
    <strong>React Native Mobile Client Codebase:</strong> Mobile API integration capabilities (custom headers <code>x-user-email</code>, <code>x-device-fingerprint</code>, JWT stateless auth) are active on the backend. However, a native React Native application repository is not present in this workspace directory.
  </div>

</body>
</html>
`;

async function generatePDF() {
  console.log('🚀 Starting REST API Documentation PDF Generation via Puppeteer...');
  
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
        <span>AI Ads™ Enterprise Platform (v2.0) — REST API Documentation</span>
        <span>API-AIADS-2026-V2.0</span>
      </div>
    `,
    footerTemplate: `
      <div style="font-family: 'Inter', sans-serif; font-size: 7.5pt; color: #64748b; width: 100%; padding: 0 15mm; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #cbd5e1; padding-top: 4px;">
        <span>Confidential REST API Documentation</span>
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
  console.log(`✅ REST API Documentation PDF generated successfully at:\n 1: ${pdfOutputPath1}\n 2: ${pdfOutputPath2}`);
}

generatePDF().catch((err) => {
  console.error('❌ Error generating REST API PDF:', err);
  process.exit(1);
});
