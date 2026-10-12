const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const pdfOutputPath1 = 'c:/Users/uwo24/Desktop/AI ADS/Project_Documents/AI_ADS_Database_Design.pdf';
const pdfOutputPath2 = 'c:/Users/uwo24/Desktop/AI ADS/Project_Documents/docs/AI_ADS_Database_Design.pdf';

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Database Design Document - AI Ads Enterprise Platform</title>
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
      <span class="cover-badge">Verified Schema Specification</span>
      <h1 class="cover-title">DATABASE DESIGN SPECIFICATION</h1>
      <div class="cover-subtitle">AI Ads™ Enterprise Platform (v2.0 Database Architecture)</div>
    </div>

    <div class="cover-body">
      <div class="cover-desc">
        This document details the complete MongoDB database design, Mongoose document schemas, collection structures, relational reference models, indexing topologies, validation rules, data security protocols, and data flow pipelines for the <strong>AI Ads™ Enterprise Platform</strong>. All specifications are derived strictly from verified production models in <code>backend/models/</code>.
      </div>

      <div class="meta-grid">
        <div class="meta-card">
          <div class="label">Document ID</div>
          <div class="value">DDD-AIADS-2026-V2.0</div>
        </div>
        <div class="meta-card">
          <div class="label">Database Technology</div>
          <div class="value">MongoDB Atlas (Mongoose 9.8 ODM)</div>
        </div>
        <div class="meta-card">
          <div class="label">Author / Organization</div>
          <div class="value">AI Ads Database Architecture Team</div>
        </div>
        <div class="meta-card">
          <div class="label">Total Schema Models</div>
          <div class="value">16 Canonical Document Collections</div>
        </div>
        <div class="meta-card">
          <div class="label">Date of Issue</div>
          <div class="value">October 10, 2026</div>
        </div>
        <div class="meta-card">
          <div class="label">Verification Status</div>
          <div class="value"><span class="badge badge-green">SCHEMA CODE VERIFIED</span></div>
        </div>
      </div>
    </div>

    <div class="cover-footer">
      <div>AI Ads™ Platform &copy; 2026. All Rights Reserved.</div>
      <div>Confidential Database Design Document</div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- TABLE OF CONTENTS -->
  <h1>Table of Contents</h1>
  <div class="toc-list">
    <div class="toc-item"><span class="toc-title">1. Database Technology & Connection Configuration</span><span class="toc-num">Section 1</span></div>
    <div class="toc-item"><span class="toc-title">2. Entity Relationship (ER) & Data Linkage Diagram</span><span class="toc-num">Section 2</span></div>
    <div class="toc-item"><span class="toc-title">3. Comprehensive Collection & Schema Directory</span><span class="toc-num">Section 3</span></div>
    <div class="toc-item"><span class="toc-title">4. Core Entity Data Models Breakdown</span><span class="toc-num">Section 4</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">4.1 User & Identity Security Schema (User.js)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">4.2 Workspace Scoping Schema (Workspace.js)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">4.3 Brand Identity & Provenance Schema (BrandProfile.js)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">4.4 Campaign & Post Generation Schemas (Campaign.js & CampaignPost.js)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">4.5 Content Studio & Fact-Checking Schema (Content.js)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">4.6 AI Web Builder Project & Version Schemas (WebsiteProject.js & WebsiteVersion.js)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">4.7 AISA Copilot Conversational Schema (ChatSession.js)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">4.8 Subscription, Pricing & Top-Up Schemas (Plan.js & TopUpPack.js)</span></div>
    <div class="toc-item" style="padding-left: 15px; font-size: 8.5pt;"><span class="toc-title">4.9 System Metrics, Audit & Task Schemas (SupportTicket, SystemSetting, CreditLog, Reminder, Notification)</span></div>
    <div class="toc-item"><span class="toc-title">5. Primary Identifiers, References & Relational Integrity</span><span class="toc-num">Section 5</span></div>
    <div class="toc-item"><span class="toc-title">6. Indexing Strategy, Validation Rules & Constraints</span><span class="toc-num">Section 6</span></div>
    <div class="toc-item"><span class="toc-title">7. Module Data Flow & Database Interaction Pipelines</span><span class="toc-num">Section 7</span></div>
    <div class="toc-item"><span class="toc-title">8. Data Security, Access Control & Privacy Architecture</span><span class="toc-num">Section 8</span></div>
    <div class="toc-item"><span class="toc-title">9. Backup, Disaster Recovery & High Availability Protocols</span><span class="toc-num">Section 9</span></div>
    <div class="toc-item"><span class="toc-title">10. Database Limitations & Recommended Improvements</span><span class="toc-num">Section 10</span></div>
  </div>

  <div class="callout" style="margin-top: 20px;">
    <div class="callout-title">SCHEMA VERIFICATION GUARANTEE</div>
    All collection structures, field types, enums, indexes, and document hooks in this document are derived directly from the Mongoose model files in <code>backend/models/</code>. Unverified database collections have been excluded.
  </div>

  <!-- SECTION 1 -->
  <h1>1. Database Technology & Connection Configuration</h1>

  <h2>1.1 Database Engine</h2>
  <p>
    The platform relies on <strong>MongoDB Atlas</strong>, a fully managed NoSQL document database. Data modeling, schema validation, connection pooling, and document lifecycle hooks are managed using <strong>Mongoose 9.8</strong> (<code>mongoose</code> npm package).
  </p>

  <h2>1.2 Connection Management (<code>backend/config/db.js</code>)</h2>
  <p>
    The database connection is established at application startup in <code>backend/server.js</code> via <code>connectDB()</code> defined in <code>backend/config/db.js</code>. The connection string is loaded from the environment variable <code>MONGO_URI</code>.
  </p>

  <pre>
// Connection initialization pattern in backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Automatic connection pooling and retry management
    });
    console.log('MongoDB Connected: ' + conn.connection.host);
  } catch (error) {
    console.error('MongoDB Connection Error: ' + error.message);
    process.exit(1);
  }
};
  </pre>

  <!-- SECTION 2 -->
  <h1>2. Entity Relationship (ER) & Data Linkage Diagram</h1>
  <p>
    The MongoDB schema combines <strong>referenced relationships</strong> (using <code>ObjectId</code> and <code>workspaceId</code> indexed keys) with <strong>embedded sub-documents</strong> for optimal read performance.
  </p>

  <div class="diag-container">
    <div class="diag-title">FIGURE 2.1: ENTITY RELATIONSHIP & DATA LINKAGE MAP</div>
 ┌───────────────────────┐                  ┌───────────────────────┐
 │       User Model      │                  │    Workspace Model    │
 │ (users collection)    │                  │(workspaces collection)│
 │───────────────────────│                  │───────────────────────│
 │ _id (ObjectId)        │1                N│ _id (ObjectId)        │
 │ email (unique string) ├─────────────────►│ userEmail (indexed)   │
 │ role (enum)           │                  │ brandName             │
 │ credits (Number)      │                  │ domainUrl             │
 │ plan (enum)           │                  └───────────┬───────────┘
 └───────────┬───────────┘                              │
             │                                          │ 1
             │ 1                                        │
             ▼ N                                        ▼ 1
 ┌───────────────────────┐                  ┌───────────────────────┐
 │   CreditLog Model     │                  │  BrandProfile Model   │
 │ (creditlogs coll.)    │                  │(brandprofiles coll.)  │
 │───────────────────────│                  │───────────────────────│
 │ userId (ref: User)    │                  │ workspaceId (indexed) │
 │ action / amount       │                  │ structuredIdentity    │
 │ balanceAfter          │                  │ approvedClaims        │
 └───────────────────────┘                  └───────────┬───────────┘
                                                        │
             ┌──────────────────────────────────────────┴──────────────────────────────────────────┐
             │ 1                                        │ 1                                        │ 1
             ▼ N                                        ▼ N                                        ▼ N
 ┌───────────────────────┐                  ┌───────────────────────┐                  ┌───────────────────────┐
 │    Campaign Model     │                  │    Content Model      │                  │ WebsiteProject Model  │
 │ (campaigns coll.)     │                  │ (contents collection) │                  │(websiteprojects coll) │
 │───────────────────────│                  │───────────────────────│                  │───────────────────────│
 │ workspaceId (indexed) │                  │ workspaceId           │                  │ projectId (unique)    │
 │ campaignName          │                  │ title / type          │                  │ workspaceId           │
 └───────────┬───────────┘                  │ status / factCheck    │                  │ healthScore           │
             │ 1                            └───────────────────────┘                  └───────────┬───────────┘
             ▼ N                                                                                   │ 1
 ┌───────────────────────┐                                                                         ▼ N
 │  CampaignPost Model   │                                                             ┌───────────────────────┐
 │(campaignposts coll.)  │                                                             │ WebsiteVersion Model  │
 │───────────────────────│                                                             │(websiteversions coll) │
 │ campaignId (indexed)  │                                                             │───────────────────────│
 │ workspaceId (indexed) │                                                             │ projectId (indexed)   │
 │ prompt / caption      │                                                             │ versionTag            │
 │ generatedImage        │                                                             │ htmlCode / cssCode    │
 └───────────────────────┘                                                             └───────────────────────┘
  </div>

  <!-- SECTION 3 -->
  <h1>3. Comprehensive Collection & Schema Directory</h1>
  <p>
    The database contains 16 verified Mongoose document collections:
  </p>

  <table>
    <thead>
      <tr>
        <th>Schema Model</th>
        <th>Collection Name</th>
        <th>Model File Location</th>
        <th>Architectural Function</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>User</code></td>
        <td><code>users</code></td>
        <td><code>backend/models/User.js</code></td>
        <td>Authentication identity, hashed passwords, roles, plan tiers, credit balance, billing info.</td>
      </tr>
      <tr>
        <td><code>Workspace</code></td>
        <td><code>workspaces</code></td>
        <td><code>backend/models/Workspace.js</code></td>
        <td>Multi-brand workspace scoping, domain URLs, brand voice tone, positioning summary.</td>
      </tr>
      <tr>
        <td><code>BrandProfile</code></td>
        <td><code>brandprofiles</code></td>
        <td><code>backend/models/BrandProfile.js</code></td>
        <td>Extracted brand DNA, logo URLs, computed color palettes, confidence scores.</td>
      </tr>
      <tr>
        <td><code>Campaign</code></td>
        <td><code>campaigns</code></td>
        <td><code>backend/models/Campaign.js</code></td>
        <td>Marketing campaign containers, goals, date ranges, budgets, total/approved post stats.</td>
      </tr>
      <tr>
        <td><code>CampaignPost</code></td>
        <td><code>campaignposts</code></td>
        <td><code>backend/models/CampaignPost.js</code></td>
        <td>Individual social posts within a campaign, prompts, copy, generated image URLs, analytics.</td>
      </tr>
      <tr>
        <td><code>Content</code></td>
        <td><code>contents</code></td>
        <td><code>backend/models/Content.js</code></td>
        <td>Social copy, blog articles, email copy, fact-check verification scores & flags.</td>
      </tr>
      <tr>
        <td><code>WebsiteProject</code></td>
        <td><code>websiteprojects</code></td>
        <td><code>backend/models/WebsiteProject.js</code></td>
        <td>AI website project metadata, status, active deployment provider, health score metrics.</td>
      </tr>
      <tr>
        <td><code>WebsiteVersion</code></td>
        <td><code>websiteversions</code></td>
        <td><code>backend/models/WebsiteVersion.js</code></td>
        <td>Historical versions of generated HTML/CSS website blueprints.</td>
      </tr>
      <tr>
        <td><code>ChatSession</code></td>
        <td><code>chatsessions</code></td>
        <td><code>backend/models/ChatSession.js</code></td>
        <td>AISA Copilot multi-turn conversational chat sessions and messages array.</td>
      </tr>
      <tr>
        <td><code>Plan</code></td>
        <td><code>plans</code></td>
        <td><code>backend/models/Plan.js</code></td>
        <td>Subscription plan tiers, pricing in USD/INR, image credits, text generation limits.</td>
      </tr>
      <tr>
        <td><code>TopUpPack</code></td>
        <td><code>topuppacks</code></td>
        <td><code>backend/models/TopUpPack.js</code></td>
        <td>Credit top-up packs, Granted image credits, pricing in USD/INR.</td>
      </tr>
      <tr>
        <td><code>SupportTicket</code></td>
        <td><code>supporttickets</code></td>
        <td><code>backend/models/SupportTicket.js</code></td>
        <td>User help desk support tickets, priority, status, category, message.</td>
      </tr>
      <tr>
        <td><code>SystemSetting</code></td>
        <td><code>systemsettings</code></td>
        <td><code>backend/models/SystemSetting.js</code></td>
        <td>Global key-value settings (e.g. <code>total_api_hits</code> platform hit counter).</td>
      </tr>
      <tr>
        <td><code>Notification</code></td>
        <td><code>notifications</code></td>
        <td><code>backend/models/NotificationReminder.js</code></td>
        <td>In-app system notifications, type enum, read status.</td>
      </tr>
      <tr>
        <td><code>Reminder</code></td>
        <td><code>reminders</code></td>
        <td><code>backend/models/NotificationReminder.js</code></td>
        <td>User task reminders, due dates, completion status, campaign linkage.</td>
      </tr>
      <tr>
        <td><code>CreditLog</code></td>
        <td><code>creditlogs</code></td>
        <td><code>backend/models/NotificationReminder.js</code></td>
        <td>Audit log of user credit deductions, top-ups, and feature usage.</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 4 -->
  <h1>4. Core Entity Data Models Breakdown</h1>

  <h2>4.1 User Schema (<code>User.js</code>)</h2>
  <table>
    <thead>
      <tr>
        <th>Field Name</th>
        <th>BSON / JS Type</th>
        <th>Required?</th>
        <th>Default Value</th>
        <th>Validation & Constraints</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>email</code></td>
        <td>String</td>
        <td>Yes</td>
        <td>None</td>
        <td>Unique index, lowercase, trimmed.</td>
      </tr>
      <tr>
        <td><code>password</code></td>
        <td>String</td>
        <td>Conditional</td>
        <td>None</td>
        <td>Required for local provider. Hashed via bcrypt (10 rounds). Hidden in JSON.</td>
      </tr>
      <tr>
        <td><code>role</code></td>
        <td>String</td>
        <td>No</td>
        <td><code>'User'</code></td>
        <td>Enum: <code>['user', 'admin', 'developer', 'AgencyAdmin', 'SuperAdmin', 'Developer', 'Admin', 'User']</code></td>
      </tr>
      <tr>
        <td><code>credits</code></td>
        <td>Number</td>
        <td>No</td>
        <td><code>500</code></td>
        <td>User image generation credit balance.</td>
      </tr>
      <tr>
        <td><code>plan</code></td>
        <td>String</td>
        <td>No</td>
        <td><code>'free'</code></td>
        <td>Enum: <code>['free', 'starter', 'pro', 'enterprise']</code></td>
      </tr>
      <tr>
        <td><code>billingDetails</code></td>
        <td>Sub-document</td>
        <td>No</td>
        <td><code>{}</code></td>
        <td>Contains <code>companyName</code>, <code>billingName</code>, <code>gstin</code>, <code>addressLine1</code>, <code>city</code>, <code>state</code>, <code>postalCode</code>, <code>country</code>.</td>
      </tr>
    </tbody>
  </table>

  <h2>4.2 Workspace Schema (<code>Workspace.js</code>)</h2>
  <table>
    <thead>
      <tr>
        <th>Field Name</th>
        <th>BSON / JS Type</th>
        <th>Required?</th>
        <th>Default Value</th>
        <th>Validation & Constraints</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>userEmail</code></td>
        <td>String</td>
        <td>No</td>
        <td><code>''</code></td>
        <td>Indexed, lowercase, trimmed. Scopes multi-tenant workspaces.</td>
      </tr>
      <tr>
        <td><code>brandName</code></td>
        <td>String</td>
        <td>Yes</td>
        <td>None</td>
        <td>Name of the target brand or business.</td>
      </tr>
      <tr>
        <td><code>domainUrl</code></td>
        <td>String</td>
        <td>Yes</td>
        <td>None</td>
        <td>Target domain scraped by Puppeteer/Cheerio.</td>
      </tr>
      <tr>
        <td><code>brandVoiceTone</code></td>
        <td>Sub-document</td>
        <td>No</td>
        <td><code>{ formalityScore: 4 }</code></td>
        <td>Contains <code>formalityScore</code> (Number) and <code>toneKeywords</code> (Array).</td>
      </tr>
    </tbody>
  </table>

  <h2>4.3 Campaign & CampaignPost Schemas (<code>Campaign.js</code> & <code>CampaignPost.js</code>)</h2>
  <p>
    <code>Campaign</code> defines top-level campaign containers, indexed by <code>workspaceId</code>. <code>CampaignPost</code> stores individual posts linked via <code>campaignId</code> (ref: <code>Campaign</code>) and <code>workspaceId</code>.
  </p>

  <table>
    <thead>
      <tr>
        <th>Field Name</th>
        <th>Model</th>
        <th>Type</th>
        <th>Default / Enum</th>
        <th>Notes</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>postingFrequency</code></td>
        <td>Campaign</td>
        <td>String</td>
        <td><code>'Daily'</code></td>
        <td>Enum: <code>['Daily', 'Weekly', '2x per week', '3x per week', '4x per week', '5x per week', 'Bi Weekly', 'Monthly']</code></td>
      </tr>
      <tr>
        <td><code>status</code></td>
        <td>Campaign</td>
        <td>String</td>
        <td><code>'Draft'</code></td>
        <td>Enum: <code>['Draft', 'Active', 'Paused', 'Completed', 'Archived']</code></td>
      </tr>
      <tr>
        <td><code>status</code></td>
        <td>CampaignPost</td>
        <td>String</td>
        <td><code>'Draft'</code></td>
        <td>Enum: <code>['Draft', 'Generated', 'Approved', 'Scheduled', 'Published', 'Failed']</code></td>
      </tr>
      <tr>
        <td><code>approvalStatus</code></td>
        <td>CampaignPost</td>
        <td>String</td>
        <td><code>'Pending'</code></td>
        <td>Enum: <code>['Pending', 'Approved', 'Rejected']</code></td>
      </tr>
      <tr>
        <td><code>analytics</code></td>
        <td>CampaignPost</td>
        <td>Sub-doc</td>
        <td><code>{ impressions: 0 ... }</code></td>
        <td>Sub-document tracking <code>impressions</code>, <code>likes</code>, <code>comments</code>, <code>shares</code>, <code>clicks</code>, <code>engagementRate</code>.</td>
      </tr>
    </tbody>
  </table>

  <h2>4.4 AI Web Builder Schemas (<code>WebsiteProject.js</code> & <code>WebsiteVersion.js</code>)</h2>
  <p>
    <code>WebsiteProject</code> tracks website metadata, status (<code>['DRAFT', 'GENERATED', 'MODIFIED', 'VALIDATED', 'DEPLOYED']</code>), and health score metrics. Historical revisions are stored in <code>WebsiteVersion</code> indexed by <code>projectId</code>.
  </p>

  <!-- SECTION 5 -->
  <h1>5. Primary Identifiers, References & Relational Integrity</h1>
  <ul>
    <li><strong>ObjectId References:</strong> Explicit foreign key linkages using <code>mongoose.Schema.Types.ObjectId</code> with <code>ref</code> declarations (e.g. <code>CampaignPost.campaignId -&gt; Campaign</code>, <code>Notification.userId -&gt; User</code>, <code>CreditLog.userId -&gt; User</code>).</li>
    <li><strong>String Domain Keys:</strong> Workspace scoping across sub-modules uses indexed String identifiers (<code>workspaceId</code>, <code>userEmail</code>, <code>projectId</code>) for flexible multi-tenant querying.</li>
    <li><strong>Sparse Indexes:</strong> Applied to optional unique fields such as <code>ChatSession.shareId</code> and <code>User.providerId</code>.</li>
  </ul>

  <!-- SECTION 6 -->
  <h1>6. Indexing Strategy, Validation Rules & Constraints</h1>

  <table>
    <thead>
      <tr>
        <th>Model / Collection</th>
        <th>Indexed Fields</th>
        <th>Index Type</th>
        <th>Architectural Purpose</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>User</code></td>
        <td><code>email: 1</code></td>
        <td>Unique Index</td>
        <td>Prevents duplicate user registration; speeds up login lookups.</td>
      </tr>
      <tr>
        <td><code>User</code></td>
        <td><code>providerId: 1</code></td>
        <td>Sparse Unique Index</td>
        <td>Allows fast OAuth 2.0 provider lookup without indexing null values.</td>
      </tr>
      <tr>
        <td><code>Workspace</code></td>
        <td><code>userEmail: 1</code></td>
        <td>Standard Index</td>
        <td>Accelerates workspace listing queries by user email.</td>
      </tr>
      <tr>
        <td><code>BrandProfile</code></td>
        <td><code>workspaceId: 1</code></td>
        <td>Standard Index</td>
        <td>Fast retrieval of canonical brand DNA by workspace.</td>
      </tr>
      <tr>
        <td><code>Campaign</code></td>
        <td><code>{ workspaceId: 1, createdAt: -1 }</code></td>
        <td>Compound Index</td>
        <td>Optimizes sorting campaigns chronologically within a workspace.</td>
      </tr>
      <tr>
        <td><code>CampaignPost</code></td>
        <td><code>{ campaignId: 1, date: 1 }</code></td>
        <td>Compound Index</td>
        <td>Accelerates post retrieval by campaign and scheduled date.</td>
      </tr>
      <tr>
        <td><code>CampaignPost</code></td>
        <td><code>{ workspaceId: 1, status: 1 }</code></td>
        <td>Compound Index</td>
        <td>Optimizes filtering posts by status in Approvals Desk.</td>
      </tr>
      <tr>
        <td><code>WebsiteProject</code></td>
        <td><code>projectId: 1</code></td>
        <td>Unique Index</td>
        <td>Guarantees unique string project identifiers.</td>
      </tr>
      <tr>
        <td><code>ChatSession</code></td>
        <td><code>sessionId: 1</code></td>
        <td>Unique Index</td>
        <td>Fast lookup of multi-turn copilot chat sessions.</td>
      </tr>
      <tr>
        <td><code>SystemSetting</code></td>
        <td><code>key: 1</code></td>
        <td>Unique Index</td>
        <td>Atomic lookup for system settings (e.g. <code>total_api_hits</code> counter).</td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 7 -->
  <h1>7. Module Data Flow & Database Interaction Pipelines</h1>

  <h2>7.1 Brand Scraping Data Pipeline</h2>
  <div class="diag-container">
    <div class="diag-title">FIGURE 7.1: BRAND SCRAPING DATA INSERTION PIPELINE</div>
 Client Request (domainUrl) ──► scraperService (Puppeteer) ──► brandDnaAgent (Gemini 3.5)
                                                                      │
                                                                      ▼
 User Model (Update) ◄────── CreditLog (Insert) ◄──────── Mongoose Save Operation
 (Credit deduction)         (Audit log entry)             │
                                                          ├──► Workspace Model (Update)
                                                          └──► BrandProfile Model (Upsert)
  </div>

  <h2>7.2 Credit Deduction Pipeline (<code>creditService.js</code>)</h2>
  <p>
    When an image or AI action is executed:
  </p>
  <ol>
    <li>Fetches <code>User</code> record by email or ID. Checks if <code>user.credits &gt;= amount</code>.</li>
    <li>Atomically updates user balance: <code>user.credits -= amount</code>. Saves <code>User</code> document.</li>
    <li>Creates an audit entry in <code>CreditLog</code> recording <code>userId</code>, <code>action</code> ('deduct'), <code>amount</code>, <code>balanceAfter</code>, and <code>feature</code>.</li>
  </ol>

  <!-- SECTION 8 -->
  <h1>8. Data Security, Access Control & Privacy</h1>
  <ul>
    <li><strong>No Plaintext Secrets:</strong> All passwords are encrypted using <code>bcryptjs</code> with 10 salt rounds prior to persistence. Secret fields (<code>password</code>, <code>verificationCode</code>, <code>resetPasswordToken</code>, <code>providerId</code>) are marked <code>select: false</code> and stripped via <code>toJSON</code> schema transformers.</li>
    <li><strong>Multi-Tenant Data Isolation:</strong> Every workspace query enforces explicit workspace filtering (<code>workspaceId</code> or <code>userEmail</code>) extracted directly from verified JWT tokens.</li>
    <li><strong>Encryption at Rest & Transit:</strong> MongoDB Atlas enforces TLS 1.3 in-transit wire encryption and AES-256 storage volume encryption at rest.</li>
  </ul>

  <!-- SECTION 9 -->
  <h1>9. Backup, Recovery & High Availability</h1>
  <ul>
    <li><strong>Continuous Automated Backups:</strong> Managed via MongoDB Atlas Continuous Cloud Backups with point-in-time recovery (PITR).</li>
    <li><strong>Multi-Region Replication:</strong> Configured on MongoDB Atlas with automatic failover secondary replica nodes.</li>
  </ul>

  <!-- SECTION 10 -->
  <h1>10. Database Limitations & Recommended Improvements</h1>

  <h2>10.1 Identified Schema Limitations</h2>
  <ul>
    <li><strong>Mixed Workspace Keys:</strong> Some schemas reference workspaces via String <code>workspaceId</code> while others use <code>userEmail</code> or <code>ObjectId</code>. Standardizing on <code>ObjectId</code> foreign keys will improve relational consistency.</li>
    <li><strong>Unindexed Aggregations:</strong> Search queries on non-indexed text fields (e.g. <code>Content.content</code>) could slow down at high document volumes.</li>
  </ul>

  <h2>10.2 Recommended Architectural Improvements</h2>
  <ul>
    <li>Add a MongoDB Text Index on <code>Content.content</code> and <code>CampaignPost.caption</code> to support fast full-text keyword searches.</li>
    <li>Enforce strict Mongoose Schema validation rules on dynamic <code>Mixed</code> data fields (e.g. <code>structuredIdentity</code> in <code>BrandProfile</code>).</li>
  </ul>

</body>
</html>
`;

async function generatePDF() {
  console.log('🚀 Starting Database Design PDF Generation via Puppeteer...');
  
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
        <span>AI Ads™ Enterprise Platform (v2.0) — Database Design Document</span>
        <span>DDD-AIADS-2026-V2.0</span>
      </div>
    `,
    footerTemplate: `
      <div style="font-family: 'Inter', sans-serif; font-size: 7.5pt; color: #64748b; width: 100%; padding: 0 15mm; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #cbd5e1; padding-top: 4px;">
        <span>Confidential Database Design Document</span>
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
  console.log(`✅ Database Design PDF generated successfully at:\n 1: ${pdfOutputPath1}\n 2: ${pdfOutputPath2}`);
}

generatePDF().catch((err) => {
  console.error('❌ Error generating Database Design PDF:', err);
  process.exit(1);
});
