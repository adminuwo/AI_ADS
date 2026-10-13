const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const pdfOutputPath = 'c:/Users/uwo24/Desktop/AI ADS/Project_Documents/AI_ADS_SRS.pdf';

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Software Requirements Specification (SRS) - AI Ads Enterprise Platform</title>
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
      color: #1e293b;
      background-color: #ffffff;
      line-height: 1.5;
      font-size: 10pt;
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
      padding: 10mm 5mm;
      border: 2px solid #cbd5e1;
      border-radius: 8px;
      position: relative;
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    }

    .cover-header {
      border-bottom: 3px solid #3b82f6;
      padding-bottom: 15px;
    }

    .cover-badge {
      display: inline-block;
      background: #eff6ff;
      color: #1d4ed8;
      font-weight: 700;
      font-size: 8.5pt;
      padding: 4px 12px;
      border-radius: 20px;
      border: 1px solid #bfdbfe;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 15px;
    }

    .cover-title {
      font-size: 26pt;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.15;
      margin: 0 0 10px 0;
      letter-spacing: -0.5px;
    }

    .cover-subtitle {
      font-size: 14pt;
      font-weight: 500;
      color: #475569;
      margin: 0;
    }

    .cover-body {
      margin: 30px 0;
    }

    .cover-desc {
      font-size: 10.5pt;
      color: #334155;
      line-height: 1.6;
      background: #ffffff;
      padding: 18px;
      border-radius: 6px;
      border-left: 4px solid #2563eb;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 25px;
    }

    .meta-card {
      background: #f1f5f9;
      padding: 12px 15px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
    }

    .meta-card .label {
      font-size: 7.5pt;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 3px;
    }

    .meta-card .value {
      font-size: 9.5pt;
      font-weight: 600;
      color: #0f172a;
    }

    .cover-footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8.5pt;
      color: #64748b;
    }

    /* Typography & Headings */
    h1 {
      font-size: 16pt;
      font-weight: 700;
      color: #0f172a;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 6px;
      margin-top: 25px;
      margin-bottom: 12px;
      letter-spacing: -0.3px;
    }

    h2 {
      font-size: 12.5pt;
      font-weight: 600;
      color: #1e3a8a;
      margin-top: 18px;
      margin-bottom: 8px;
    }

    h3 {
      font-size: 10.5pt;
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
      margin-top: 6px;
      margin-bottom: 12px;
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
      background-color: #1e293b;
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
      border-left: 4px solid #3b82f6;
      padding: 10px 14px;
      border-radius: 0 6px 6px 0;
      margin: 10px 0;
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
      padding: 5px 0;
      border-bottom: 1px dotted #cbd5e1;
      font-size: 9pt;
    }

    .toc-title {
      font-weight: 600;
      color: #1e293b;
    }

    .toc-dots {
      flex-grow: 1;
      border-bottom: 1px dotted #94a3b8;
      margin: 0 8px;
      position: relative;
      top: -4px;
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
      <span class="cover-badge">Official Production Documentation</span>
      <h1 class="cover-title">SOFTWARE REQUIREMENTS SPECIFICATION (SRS)</h1>
      <div class="cover-subtitle">AI Ads™ Enterprise Platform (v2.0)</div>
    </div>

    <div class="cover-body">
      <div class="cover-desc">
        This document details the complete functional, technical, architectural, security, database, API, and financial requirements for the <strong>AI Ads™ Enterprise Platform</strong>. Built on a unified single-service architecture, the platform integrates multi-agent AI web scraping, automated Brand DNA extraction, SEO intelligence, social copy generation, AI visual/ad banner generation, a multi-step AI website builder, content calendars, team RBAC, and real-time telemetry.
      </div>

      <div class="meta-grid">
        <div class="meta-card">
          <div class="label">Document ID</div>
          <div class="value">SRS-AIADS-2026-V2.0</div>
        </div>
        <div class="meta-card">
          <div class="label">System Version</div>
          <div class="value">v2.0.0 (GCP Cloud Run Ready)</div>
        </div>
        <div class="meta-card">
          <div class="label">Author / Organization</div>
          <div class="value">AI Ads Architecture Team</div>
        </div>
        <div class="meta-card">
          <div class="label">Target Infrastructure</div>
          <div class="value">GCP Cloud Run / Vertex AI / Mongo Atlas</div>
        </div>
        <div class="meta-card">
          <div class="label">Date of Issue</div>
          <div class="value">October 10, 2026</div>
        </div>
        <div class="meta-card">
          <div class="label">Document Status</div>
          <div class="value"><span class="badge badge-green">APPROVED PRODUCTION</span></div>
        </div>
      </div>
    </div>

    <div class="cover-footer">
      <div>AI Ads™ Enterprise Platform &copy; 2026. All Rights Reserved.</div>
      <div>Confidential &amp; Proprietary Specification</div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- TABLE OF CONTENTS -->
  <h1>Table of Contents</h1>
  <div class="toc-list">
    <div class="toc-item"><span class="toc-title">1. Project Overview, Objectives & Scope</span><span class="toc-num">Section 1</span></div>
    <div class="toc-item"><span class="toc-title">2. User Roles, Permissions & RBAC Framework</span><span class="toc-num">Section 2</span></div>
    <div class="toc-item"><span class="toc-title">3. Major Modules & Functional Requirements</span><span class="toc-num">Section 3</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">3.1 Brand DNA Engine</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">3.2 Strategy Hub & Roadmap Generator</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">3.3 SEO Intelligence Engine</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">3.4 Content Studio (Multi-Platform Copy Generator)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">3.5 Creative Studio (AI Visual & Banner Generator)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">3.6 AI Web Builder & Live Chat Modification Pipeline</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">3.7 Campaign Builder Module</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">3.8 Content Calendar & Drag-Drop Scheduler</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">3.9 Approvals Desk & Workflow Desk</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">3.10 Asset Library & Media Storage</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">3.11 Analytics & System Telemetry</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">3.12 Team RBAC & Multi-Brand Workspaces</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">3.13 AISA Copilot (Floating Assistant)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">3.14 Admin Console & Operational Management</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">3.15 Account & Authentication Security Engine</span></div>
    <div class="toc-item"><span class="toc-title">4. System Architecture & Technical Stack</span><span class="toc-num">Section 4</span></div>
    <div class="toc-item"><span class="toc-title">5. External Service Integrations & AI Pipeline</span><span class="toc-num">Section 5</span></div>
    <div class="toc-item"><span class="toc-title">6. Database Models & Schema Specifications</span><span class="toc-num">Section 6</span></div>
    <div class="toc-item"><span class="toc-title">7. REST API Endpoint Directory & Routing</span><span class="toc-num">Section 7</span></div>
    <div class="toc-item"><span class="toc-title">8. Financial Architecture, Unit Costs & Pricing Model</span><span class="toc-num">Section 8</span></div>
    <div class="toc-item"><span class="toc-title">9. Non-Functional Requirements (Security, Performance, Usability)</span><span class="toc-num">Section 9</span></div>
    <div class="toc-item"><span class="toc-title">10. System Assumptions, Constraints & Future Scope</span><span class="toc-num">Section 10</span></div>
  </div>

  <div class="callout" style="margin-top: 20px;">
    <div class="callout-title">DOCUMENTATION VERIFICATION DIRECTIVE</div>
    This SRS document reflects strictly verified capabilities, models, schemas, and routes extracted directly from the AI Ads codebase. No fictional features or unverified API endpoints have been included.
  </div>

  <!-- SECTION 1 -->
  <h1>1. Project Overview, Objectives & Scope</h1>

  <h2>1.1 Purpose</h2>
  <p>
    The <strong>AI Ads™ Enterprise Platform</strong> is an end-to-end, multi-tenant AI marketing operating system engineered to automate brand identity extraction, 30-day marketing roadmaps, SEO keyword clusters, multi-channel copywriting, AI visual banner generation, multi-page website building, and social publishing workflows. This specification outlines all verified functional, technical, and operational requirements.
  </p>

  <h2>1.2 System Objectives</h2>
  <ul>
    <li><strong>Automated Brand Extraction:</strong> Crawl user domains via headless Puppeteer/Cheerio and extract structured brand DNA (colors, typography, voice tone, mission, claims, competitor landscape) within 15 seconds.</li>
    <li><strong>Multi-Model AI Orchestration:</strong> Route workloads to Google Cloud Vertex AI (Gemini 3.5 Flash, Gemini 3.5 Pro, Gemini 3.1 Flash Image, Imagen 3) with seamless failover to OpenAI (GPT-4o).</li>
    <li><strong>Unified Architecture:</strong> Deploy both React SPA static bundle and Express REST API inside a single Docker container on GCP Cloud Run without CORS overhead.</li>
    <li><strong>Controlled Profitability:</strong> Enforce a strict 50% net profit margin across subscription plans (Starter, Pro, Agency, Enterprise) and credit top-ups using precise token/image metering.</li>
  </ul>

  <h2>1.3 Scope of the Platform</h2>
  <p>
    The scope encompasses 15 core operational modules, 43+ verified features, 16 MongoDB schemas, 11 express router modules, multi-turn AI copilot chat, 6-digit OTP email account deletion, Google Cloud Storage integration, multi-workspace brand isolation, and super-admin telemetry metrics.
  </p>

  <!-- SECTION 2 -->
  <h1>2. User Roles, Permissions & RBAC Framework</h1>
  <p>
    The system enforces Role-Based Access Control (RBAC) across API routes and UI components. The roles defined in <code>User.js</code> and checked via authentication middleware include:
  </p>

  <table>
    <thead>
      <tr>
        <th>Role Identifier</th>
        <th>System Level</th>
        <th>Permissions & Scope</th>
        <th>Access Restrictions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>SuperAdmin</code> / <code>Admin</code></td>
        <td>Platform Admin</td>
        <td>Full system control, global user metrics, quota management, role-plan assignment, support tickets, tool limits, telemetry logs.</td>
        <td>None</td>
      </tr>
      <tr>
        <td><code>AgencyAdmin</code></td>
        <td>Organization Admin</td>
        <td>Manage multi-brand workspaces, add/remove team members, adjust brand credit allocations, view team usage analytics.</td>
        <td>Cannot modify super admin tool limits or view global server telemetry.</td>
      </tr>
      <tr>
        <td><code>Developer</code> / <code>developer</code></td>
        <td>Engineering</td>
        <td>Access API debugging endpoints, telemetry logs, route health monitoring, and feature flag toggles.</td>
        <td>Restricted from billing plan modifications and user account deletion.</td>
      </tr>
      <tr>
        <td><code>User</code> / <code>user</code></td>
        <td>Standard User</td>
        <td>Create workspaces, run brand scraping, generate marketing roadmaps, SEO content, AI websites, ad creatives, manage calendar.</td>
        <td>Scoped strictly to assigned workspace and plan quota limits.</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 3 -->
  <h1>3. Major Modules & Functional Requirements</h1>

  <h2>3.1 Brand DNA Engine (Module 1)</h2>
  <p>
    Analyzes external web pages or uploaded brand briefs to generate a canonical brand identity.
  </p>
  <ul>
    <li><strong>Web Scraper:</strong> Headless Cheerio/Puppeteer service (<code>scraperService.js</code>) scrapes domain HTML, meta titles, favicons, logos, and computed color palettes via <code>node-vibrant</code>.</li>
    <li><strong>Multi-Agent Brand Extraction:</strong> Executes multi-turn prompts on <code>gemini-3.5-flash</code> to structure brand voice, formality score (1-5), competitor list, approved claims, restricted claim lists, and content pillars.</li>
    <li><strong>Confidence Audit & Provenance:</strong> Evaluates confidence scores (default 85%+) for extracted claims and parent company metadata (<code>brandValidatorAgent.js</code>).</li>
  </ul>

  <h2>3.2 Strategy Hub & Roadmap Generator (Module 2)</h2>
  <ul>
    <li><strong>30-Day Marketing Roadmap:</strong> Generates a structured 30-day cross-platform marketing strategy grouped by weekly themes, channel mix, and target funnels (TOFU/MOFU/BOFU).</li>
    <li><strong>Single-Card Regenerator:</strong> Allows single-click AI regeneration of specific strategy cards without regenerating the entire month's roadmap.</li>
    <li><strong>1-Click Calendar Sync:</strong> Converts approved strategy cards directly into scheduled <code>Calendar</code> entries.</li>
  </ul>

  <h2>3.3 SEO Intelligence Engine (Module 3)</h2>
  <ul>
    <li><strong>Keyword Research & Intent Clustering:</strong> Groups target keywords into search intent clusters (Informational, Transactional, Navigational) using <code>gemini-3.5-flash</code>.</li>
    <li><strong>SEO Content Brief Builder:</strong> Produces detailed SEO content briefs including primary keyword target, LSI terms, meta titles, target word count, heading structures (H1-H3), and internal linking suggestions.</li>
  </ul>

  <h2>3.4 Content Studio - Multi-Format Copywriting (Module 4)</h2>
  <ul>
    <li><strong>Social Copy Generator:</strong> Generates platform-tailored copy for Instagram, LinkedIn, X/Twitter, and Facebook with custom hooks, emojis, and hashtags.</li>
    <li><strong>Long-Form Blog Generator:</strong> Generates 1,500+ word structured blog articles matching brand voice tone.</li>
    <li><strong>Ad Copy & Email Newsletters:</strong> Direct-response framework templates (AIDA, PAS) for Google Ads, Meta Ads, and sales email sequences.</li>
    <li><strong>Repurpose Engine:</strong> Transforms existing URLs or text into multi-channel social snippets (<code>RepurposeModule.jsx</code>).</li>
  </ul>

  <h2>3.5 Creative Studio - AI Visual & Banner Generator (Module 5)</h2>
  <ul>
    <li><strong>Image Generation Engine:</strong> Integrates Google Cloud Vertex AI <code>gemini-3.1-flash-image</code> and <code>imagen-3.0-generate-002</code> at an operating unit cost of <strong>$0.03 per image</strong>.</li>
    <li><strong>Style & Aspect Ratio Controls:</strong> Supports square (1:1), landscape (16:9), story/reel (9:16), and customizable artistic styles (Photorealistic, Vector, 3D Render, Minimalist).</li>
    <li><strong>Visual Variations (4x):</strong> Generates 4 distinct visual creative variations in a single operation.</li>
    <li><strong>Visual Credits & Top-Up System:</strong> Atomically checks user balance via <code>creditService.js</code>, deducting 1 credit per image generation and logging transactions in <code>CreditLog</code>.</li>
  </ul>

  <h2>3.6 AI Web Builder & Live Chat Edit Pipeline (Module 6)</h2>
  <div class="callout">
    <div class="callout-title">3-STEP AI WEBSITE BUILDER PIPELINE</div>
    1. <strong>Brief Analysis:</strong> Analyzes requirements (1.2k prompt / 400 completion tokens = $0.00021 USD).<br>
    2. <strong>Blueprint Code Generation:</strong> Generates full semantic HTML5 & CSS3 layout (5.5k prompt / 4.5k completion tokens = $0.00176 USD).<br>
    3. <strong>Hero Visual Generation:</strong> Generates high-fidelity hero banner imagery via <code>gemini-3.1-flash-image</code> ($0.03 USD/img).<br>
    4. <strong>Live Chat Inline Edit:</strong> Interactive natural language modifications per turn ($0.00055 USD/edit).
  </div>

  <h2>3.7 Campaign Builder Module (Module 7)</h2>
  <p>Provides multi-channel campaign planning, grouping posts by theme, target campaign month, budget allocation, and target KPIs.</p>

  <h2>3.8 Content Calendar & Drag-Drop Scheduler (Module 8)</h2>
  <p>Visual calendar interface supporting monthly/weekly views, drag-and-drop post rescheduling, and status tags (Draft, Scheduled, Published, Failed).</p>

  <h2>3.9 Approvals Desk & Workflow System (Module 9)</h2>
  <p>Enforces post-approval workflows (<code>postApprovalRequired</code>). Team members submit generated content for manager review before publishing.</p>

  <h2>3.10 Asset Library & Media Storage (Module 10)</h2>
  <p>Stores generated images, uploaded brand logos, and documents securely in Google Cloud Storage bucket (<code>ai-ads-creatives</code>) with signed temporary access URLs.</p>

  <h2>3.11 Analytics & System Telemetry (Module 11)</h2>
  <p>Tracks aggregate platform API hits via <code>SystemSetting</code> (key: <code>total_api_hits</code>), user activity metrics, and monthly credit usage graphs.</p>

  <h2>3.12 Team RBAC & Multi-Brand Workspaces (Module 12)</h2>
  <p>Allows users to create and switch between multiple brand workspaces, invite team members, and assign granular permissions.</p>

  <h2>3.13 AISA Copilot - Floating Assistant (Module 13)</h2>
  <p>Multi-turn conversational AI copilot embedded across all screens. Powered by <code>gemini-3.5-flash</code> with image attachment analysis support.</p>

  <h2>3.14 Admin Console & Operational Management (Module 14)</h2>
  <p>Super-admin dashboard providing live stats on total registered users, plan distributions, chat session histories, help desk tickets, tool quota limits, and legal policy updates.</p>

  <h2>3.15 Account & Security Engine (Module 15)</h2>
  <p>Handles user registration, login, Google OAuth 2.0 verification, JWT issue/renewal, profile updates, billing details (GSTIN, company address), and 6-digit email OTP account deletion verification (<code>accountRoutes.js</code>).</p>

  <!-- SECTION 4 -->
  <h1>4. System Architecture & Technical Stack</h1>

  <h2>4.1 Single-Service Unified Cloud Run Architecture</h2>
  <p>
    The platform is packaged into a unified Docker container serving both static frontend assets and Express API endpoints from a single host domain, eliminating cross-origin preflight requests (CORS).
  </p>

  <pre>
┌────────────────────────────────────────────────────────────────────────┐
│                        GCP Cloud Run Container                         │
│                           (Port 8080 / 5000)                           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
   Path: /* (Non-API)                               Path: /api/*
┌─────────────────────────────────────┐   ┌─────────────────────────────────────┐
│  React SPA (Vite Build Bundle)      │   │  Express REST API Node Engine       │
│  Static HTML / CSS / JS Assets      │   │  MongoDB Atlas & Vertex AI Client   │
└─────────────────────────────────────┘   └─────────────────────────────────────┘
  </pre>

  <h2>4.2 Technology Stack Summary</h2>
  <table>
    <thead>
      <tr>
        <th>Layer</th>
        <th>Technology / Package</th>
        <th>Version</th>
        <th>Purpose</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Frontend Core</td>
        <td>React SPA + Vite</td>
        <td>React 18.2 / Vite 5.1</td>
        <td>High-performance single page application dashboard.</td>
      </tr>
      <tr>
        <td>Frontend Styling</td>
        <td>Tailwind CSS + Framer Motion</td>
        <td>Tailwind 3.4 / Framer 11.0</td>
        <td>Responsive modern interface, animations & dark/light themes.</td>
      </tr>
      <tr>
        <td>Backend Runtime</td>
        <td>Node.js + Express</td>
        <td>Express 4.19</td>
        <td>RESTful API routing, middleware, authentication & webhooks.</td>
      </tr>
      <tr>
        <td>Database</td>
        <td>MongoDB Atlas + Mongoose</td>
        <td>Mongoose 9.8</td>
        <td>Document database storing users, brands, campaigns & content.</td>
      </tr>
      <tr>
        <td>AI Orchestration</td>
        <td><code>@google/genai</code> & <code>openai</code></td>
        <td>GenAI 2.13 / OpenAI 7.1</td>
        <td>Vertex AI SDK for Gemini 3.5/3.1 models & OpenAI failover.</td>
      </tr>
      <tr>
        <td>Headless Scraping</td>
        <td>Puppeteer + Cheerio</td>
        <td>Puppeteer 25.9 / Cheerio 1.2</td>
        <td>Domain analysis, automated crawling & screenshot capture.</td>
      </tr>
      <tr>
        <td>Storage</td>
        <td>Google Cloud Storage</td>
        <td><code>@google-cloud/storage</code> 8.0</td>
        <td>Persistent cloud asset storage (<code>ai-ads-creatives</code>).</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 5 -->
  <h1>5. External Service Integrations & AI Pipeline</h1>

  <h2>5.1 Multi-Model AI Orchestrator Fallback Chain</h2>
  <p>
    The primary engine routes calls to Google Cloud Vertex AI in <code>asia-south1</code> and Global regions using ADC authentication. If Vertex AI returns a rate-limit (429) or service error (5xx), calls fall back automatically to OpenAI.
  </p>

  <table>
    <thead>
      <tr>
        <th>Model Name</th>
        <th>Exact Model ID</th>
        <th>Provider</th>
        <th>Primary Responsibility</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Gemini 3.5 Flash</strong></td>
        <td><code>gemini-3.5-flash</code></td>
        <td>Google Vertex AI</td>
        <td>Roadmaps, SEO, Copywriting, Web Builder, Copilot Chat.</td>
      </tr>
      <tr>
        <td><strong>Gemini 3.5 Pro</strong></td>
        <td><code>gemini-3.5-pro</code></td>
        <td>Google Vertex AI</td>
        <td>Complex multi-page web blueprints & deep reasoning.</td>
      </tr>
      <tr>
        <td><strong>Gemini 3.1 Flash Image</strong></td>
        <td><code>gemini-3.1-flash-image</code></td>
        <td>Google Vertex AI</td>
        <td>Primary high-speed AI ad image generation.</td>
      </tr>
      <tr>
        <td><strong>Imagen 3</strong></td>
        <td><code>imagen-3.0-generate-002</code></td>
        <td>Google Vertex AI</td>
        <td>Commercial grade photorealistic visual generation.</td>
      </tr>
      <tr>
        <td><strong>GPT-4o</strong></td>
        <td><code>gpt-4o</code></td>
        <td>OpenAI API</td>
        <td>Secondary failover engine for text & strategy generation.</td>
      </tr>
    </tbody>
  </table>

  <h2>5.2 Third-Party Integrations</h2>
  <ul>
    <li><strong>Tavily Search API:</strong> Grounded real-time web search for competitor analysis and live facts.</li>
    <li><strong>Nodemailer SMTP:</strong> Email delivery service for password resets, 6-digit OTP codes, and notifications.</li>
    <li><strong>Pexels API:</strong> Fallback stock visual photography service.</li>
  </ul>

  <!-- SECTION 6 -->
  <h1>6. Database Models & Schema Specifications</h1>
  <p>The platform relies on 16 Mongoose models defined in <code>backend/models/</code>:</p>

  <table>
    <thead>
      <tr>
        <th>Model Name</th>
        <th>Collection</th>
        <th>Key Fields & Indexes</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>User</code></td>
        <td><code>users</code></td>
        <td><code>email</code> (unique), <code>role</code>, <code>credits</code>, <code>plan</code>, <code>billingDetails</code></td>
        <td>User identity, authentication, subscription tier & credit balance.</td>
      </tr>
      <tr>
        <td><code>Workspace</code></td>
        <td><code>workspaces</code></td>
        <td><code>userEmail</code> (indexed), <code>brandName</code>, <code>domainUrl</code>, <code>brandVoiceTone</code></td>
        <td>Multi-tenant workspace isolation for brand profile management.</td>
      </tr>
      <tr>
        <td><code>BrandProfile</code></td>
        <td><code>brandprofiles</code></td>
        <td><code>workspaceId</code> (indexed), <code>structuredIdentity</code>, <code>approvedClaims</code></td>
        <td>Extracted brand DNA, colors, target audience, and confidence scores.</td>
      </tr>
      <tr>
        <td><code>Campaign</code></td>
        <td><code>campaigns</code></td>
        <td><code>workspaceId</code>, <code>title</code>, <code>status</code>, <code>budget</code></td>
        <td>Multi-channel campaign grouping and strategy tracking.</td>
      </tr>
      <tr>
        <td><code>Content</code></td>
        <td><code>contents</code></td>
        <td><code>workspaceId</code>, <code>type</code>, <code>generatedText</code>, <code>platform</code></td>
        <td>Generated social copy, blogs, emails, and ad copy entries.</td>
      </tr>
      <tr>
        <td><code>WebsiteProject</code></td>
        <td><code>websiteprojects</code></td>
        <td><code>projectId</code> (unique), <code>workspaceId</code>, <code>status</code>, <code>healthScore</code></td>
        <td>AI Website projects, active deployment status & metadata.</td>
      </tr>
      <tr>
        <td><code>WebsiteVersion</code></td>
        <td><code>websiteversions</code></td>
        <td><code>projectId</code>, <code>versionTag</code>, <code>htmlCode</code>, <code>cssCode</code></td>
        <td>Version history of generated AI website blueprints and edits.</td>
      </tr>
      <tr>
        <td><code>ChatSession</code></td>
        <td><code>chatsessions</code></td>
        <td><code>userId</code>, <code>workspaceId</code>, <code>messages</code> array</td>
        <td>Persistent AISA Copilot multi-turn conversation logs.</td>
      </tr>
      <tr>
        <td><code>SupportTicket</code></td>
        <td><code>supporttickets</code></td>
        <td><code>userId</code>, <code>subject</code>, <code>status</code>, <code>priority</code></td>
        <td>User support desk tickets managed in Admin Console.</td>
      </tr>
      <tr>
        <td><code>SystemSetting</code></td>
        <td><code>systemsettings</code></td>
        <td><code>key</code> (unique), <code>value</code></td>
        <td>Global configuration keys (e.g. <code>total_api_hits</code>).</td>
      </tr>
      <tr>
        <td><code>Notification</code></td>
        <td><code>notifications</code></td>
        <td><code>userEmail</code>, <code>title</code>, <code>read</code>, <code>createdAt</code></td>
        <td>In-app notifications and system alerts.</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 7 -->
  <h1>7. REST API Endpoint Specifications</h1>

  <table>
    <thead>
      <tr>
        <th>Router Module</th>
        <th>HTTP Method</th>
        <th>Endpoint Path</th>
        <th>Auth Required</th>
        <th>Function / Controller Action</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>accountRoutes</code></td>
        <td><code>POST</code></td>
        <td><code>/api/account/send-delete-otp</code></td>
        <td>No</td>
        <td>Sends 6-digit OTP for account deletion.</td>
      </tr>
      <tr>
        <td><code>accountRoutes</code></td>
        <td><code>POST</code></td>
        <td><code>/api/account/verify-delete-otp</code></td>
        <td>No</td>
        <td>Verifies 6-digit OTP security code.</td>
      </tr>
      <tr>
        <td><code>adminRoutes</code></td>
        <td><code>GET</code></td>
        <td><code>/api/admin/dashboard-summary</code></td>
        <td>AdminAuth</td>
        <td>Returns platform user stats & total API hits.</td>
      </tr>
      <tr>
        <td><code>adminRoutes</code></td>
        <td><code>PUT</code></td>
        <td><code>/api/admin/user/:id/quota</code></td>
        <td>AdminAuth</td>
        <td>Updates user credit quota and subscription plan.</td>
      </tr>
      <tr>
        <td><code>brandRoutes</code></td>
        <td><code>POST</code></td>
        <td><code>/api/brand/analyze</code></td>
        <td>OptionalAuth</td>
        <td>Triggers multi-agent Brand DNA web scraping.</td>
      </tr>
      <tr>
        <td><code>campaignRoutes</code></td>
        <td><code>POST</code></td>
        <td><code>/api/campaigns/:id/generate-strategy</code></td>
        <td>RequireAuth</td>
        <td>Generates campaign strategy roadmap via Gemini.</td>
      </tr>
      <tr>
        <td><code>chatRoutes</code></td>
        <td><code>POST</code></td>
        <td><code>/api/chat</code></td>
        <td>OptionalAuth</td>
        <td>AISA Copilot multi-turn chat assistant endpoint.</td>
      </tr>
      <tr>
        <td><code>contentRoutes</code></td>
        <td><code>POST</code></td>
        <td><code>/api/content/social/generate</code></td>
        <td>RequireAuth</td>
        <td>Generates platform-tailored social copy.</td>
      </tr>
      <tr>
        <td><code>seoRoutes</code></td>
        <td><code>POST</code></td>
        <td><code>/api/seo/keywords/cluster</code></td>
        <td>RequireAuth</td>
        <td>Generates keyword intent clusters & briefs.</td>
      </tr>
      <tr>
        <td><code>websiteBuilderRoutes</code></td>
        <td><code>POST</code></td>
        <td><code>/api/website-builder/generate</code></td>
        <td>RequireAuth</td>
        <td>Executes full page HTML/CSS blueprint pipeline.</td>
      </tr>
      <tr>
        <td><code>websiteBuilderRoutes</code></td>
        <td><code>POST</code></td>
        <td><code>/api/website-builder/chat-edit</code></td>
        <td>RequireAuth</td>
        <td>Executes live conversational chat modification per turn.</td>
      </tr>
      <tr>
        <td><code>healthRoutes</code></td>
        <td><code>GET</code></td>
        <td><code>/api/health</code></td>
        <td>No</td>
        <td>Returns JSON system health status & DB connectivity.</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 8 -->
  <h1>8. Financial Architecture, Unit Costs & Pricing Model</h1>

  <h2>8.1 AI Model Unit Rate Table</h2>
  <table>
    <thead>
      <tr>
        <th>Model Name</th>
        <th>Input Tokens Rate</th>
        <th>Output Tokens Rate</th>
        <th>Image Generation Unit Cost</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Gemini 3.5 Flash</strong></td>
        <td>$0.075 / 1M ($0.000075 / 1k)</td>
        <td>$0.30 / 1M ($0.00030 / 1k)</td>
        <td>—</td>
      </tr>
      <tr>
        <td><strong>Gemini 3.5 Pro</strong></td>
        <td>$1.25 / 1M ($0.00125 / 1k)</td>
        <td>$5.00 / 1M ($0.00500 / 1k)</td>
        <td>—</td>
      </tr>
      <tr>
        <td><strong>Gemini 3.1 Flash Image</strong></td>
        <td>—</td>
        <td>—</td>
        <td><strong>$0.030 / image (₹2.50 INR)</strong></td>
      </tr>
      <tr>
        <td><strong>Imagen 3</strong></td>
        <td>—</td>
        <td>—</td>
        <td><strong>$0.030 / image (₹2.50 INR)</strong></td>
      </tr>
    </tbody>
  </table>

  <h2>8.2 50% Profit Margin Subscription Tier Breakdown</h2>
  <p>
    All plan workloads are calculated using the formula: <code>Subscription Price = 2 × (Included API Cost)</code>.
  </p>

  <table>
    <thead>
      <tr>
        <th>Plan Tier</th>
        <th>Monthly Price (USD)</th>
        <th>Monthly Price (INR)</th>
        <th>API Cost Allowance (50%)</th>
        <th>Image Credits Included</th>
        <th>Net Company Profit (50%)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Starter</strong></td>
        <td>$9.99 / mo</td>
        <td>₹799 / mo</td>
        <td>$5.00 (₹400)</td>
        <td>150 Images</td>
        <td>$4.99 / mo (50.0%)</td>
      </tr>
      <tr>
        <td><strong>Pro / Growth</strong></td>
        <td>$29.99 / mo</td>
        <td>₹2,399 / mo</td>
        <td>$15.00 (₹1,200)</td>
        <td>450 Images</td>
        <td>$14.99 / mo (50.0%)</td>
      </tr>
      <tr>
        <td><strong>Agency / Scale</strong></td>
        <td>$79.99 / mo</td>
        <td>₹6,399 / mo</td>
        <td>$40.00 (₹3,200)</td>
        <td>1,200 Images</td>
        <td>$39.99 / mo (50.0%)</td>
      </tr>
      <tr>
        <td><strong>Enterprise</strong></td>
        <td>$199.99 / mo</td>
        <td>₹15,999 / mo</td>
        <td>$100.00 (₹8,000)</td>
        <td>3,000 Images</td>
        <td>$99.99 / mo (50.0%)</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 9 -->
  <h1>9. Non-Functional Requirements</h1>

  <h2>9.1 Security & Authentication</h2>
  <ul>
    <li><strong>JWT Authentication:</strong> Secure Bearer Token issuance using <code>jsonwebtoken</code> with signature verification on all protected endpoints.</li>
    <li><strong>Password Hashing:</strong> Passwords encrypted using <code>bcryptjs</code> with 10 salt rounds before database persistence.</li>
    <li><strong>6-Digit Email OTP:</strong> Account deletion requires a time-bounded 6-digit OTP code sent via SMTP, with a 30-second rate limit per request.</li>
    <li><strong>CORS Whitelisting:</strong> Dynamic origin validation matching approved domains (<code>aiads.aisa24.com</code>, <code>aisa24.com</code>, <code>uwo24.com</code>, <code>localhost</code>).</li>
  </ul>

  <h2>9.2 Performance & Scalability</h2>
  <ul>
    <li><strong>GCP Cloud Run Auto-Scaling:</strong> Container configured with 2 CPU / 2GiB RAM memory limit, auto-scaling from 0 to 10 instances with a 300-second request timeout.</li>
    <li><strong>MongoDB Connection Pooling:</strong> Reusable database connection pool managed via Mongoose in <code>config/db.js</code>.</li>
  </ul>

  <h2>9.3 Usability & Localization</h2>
  <ul>
    <li><strong>Multi-Language Support:</strong> Frontend internationalization implemented via <code>i18next</code> and <code>react-i18next</code> supporting English, Hindi, and regional variations.</li>
    <li><strong>Responsive Light/Dark UI:</strong> Full aesthetic styling using Tailwind CSS, supporting dark/light mode toggles and accessibility compliance.</li>
  </ul>

  <!-- SECTION 10 -->
  <h1>10. System Assumptions, Constraints & Future Scope</h1>

  <h2>10.1 Assumptions</h2>
  <ul>
    <li>The primary Google Cloud Vertex AI project maintains active quotas of 300+ RPM for text models and 50+ RPM for image generation models.</li>
    <li>MongoDB Atlas deployment maintains 99.95% uptime availability.</li>
  </ul>

  <h2>10.2 Technical Constraints</h2>
  <ul>
    <li>Headless web scraping with Puppeteer requires a minimum of 2GB RAM per active Cloud Run container instance.</li>
    <li>Image generation is bounded by GCP regional quotas in <code>asia-south1</code> and Global regions.</li>
  </ul>

  <h2>10.3 Future Development Roadmap</h2>
  <ul>
    <li><strong>Direct Publishing APIs:</strong> Direct OAuth publishing integration with Meta Graph API, LinkedIn API, and Google Ads API.</li>
    <li><strong>AI Video Ad Generation:</strong> Integration with Veo 2 / Runway Gen-2 API for short-form video ad generation.</li>
  </ul>

</body>
</html>
`;

async function generatePDF() {
  console.log('🚀 Starting SRS PDF Generation via Puppeteer...');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  await page.setContent(htmlContent, {
    waitUntil: 'networkidle0'
  });

  await page.pdf({
    path: pdfOutputPath,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-family: 'Inter', sans-serif; font-size: 7.5pt; color: #64748b; width: 100%; padding: 0 15mm; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
        <span>AI Ads™ Enterprise Platform (v2.0) — Software Requirements Specification</span>
        <span>SRS-AIADS-2026-V2.0</span>
      </div>
    `,
    footerTemplate: `
      <div style="font-family: 'Inter', sans-serif; font-size: 7.5pt; color: #64748b; width: 100%; padding: 0 15mm; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 4px;">
        <span>Confidential &amp; Proprietary Documentation</span>
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

  await browser.close();
  console.log(`✅ SRS PDF generated successfully at: ${pdfOutputPath}`);
}

generatePDF().catch((err) => {
  console.error('❌ Error generating SRS PDF:', err);
  process.exit(1);
});
